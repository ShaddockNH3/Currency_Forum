package controllers

import (
	"encoding/json"
	"errors"
	"exchangeapp/global"
	"exchangeapp/models"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"gorm.io/gorm"
)

var cacheKey = "articles"

func CreateArticle(ctx *gin.Context) {
	var article models.Article

	log.Println("开始处理创建文章请求...")

	if err := ctx.ShouldBindJSON(&article); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	username, exists := ctx.Get("username")
	if !exists {
		log.Printf("错误点 B: 获取用户名失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	article.Author = username.(string)

	if err := global.Db.AutoMigrate(&article); err != nil {
		log.Printf("错误点 C: 迁移数据库失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := global.Db.Create(&article).Error; err != nil {
		log.Printf("错误点 D: 创建文章失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := global.RedisDB.Del(cacheKey).Err(); err != nil {
		log.Printf("错误点 E: 删除缓存失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("文章创建成功！")
	ctx.JSON(http.StatusCreated, article)
}

/*
获取文章列表
1. 先从缓存中获取文章列表
2. 如果缓存中没有文章列表，则从数据库中获取文章列表
3. 将文章列表缓存到Redis中
4. 返回文章列表

-----
1. 先从缓存中获取文章列表
2. 获取缓存失败
-----
1. 先从缓存中获取文章列表
2. 如果缓存中有文章列表，则直接返回文章列表
*/
func GetArticles(ctx *gin.Context) {

	cacheData, err := global.RedisDB.Get(cacheKey).Result()

	if err == redis.Nil {
		var articles []models.Article

		log.Println("开始处理获取文章请求...")

		if err := global.Db.Find(&articles).Error; err != nil {
			log.Printf("错误点 A: 获取文章失败: %v", err)
			if errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("错误点 B: 文章不存在: %v", err)
				ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			} else {
				log.Printf("错误点 C: 数据库查询失败: %v", err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}
			return
		}
		articleJson, err := json.Marshal(articles)
		if err != nil {
			log.Printf("错误点 D: 序列化文章失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if err := global.RedisDB.Set(cacheKey, articleJson, 10*time.Minute).Err(); err != nil {
			log.Printf("错误点 E: 缓存文章失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, articles)

	} else if err != nil {
		log.Printf("错误点 F: 获取缓存失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	} else {
		var articles []models.Article
		if err := json.Unmarshal([]byte(cacheData), &articles); err != nil {
			log.Printf("错误点 G: 反序列化文章失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, articles)
	}
}

func GetArticlesByID(ctx *gin.Context) {
	id := ctx.Param("id")

	var article models.Article

	log.Println("开始处理获取文章请求...")

	if err := global.Db.Where("id=?", id).First(&article).Error; err != nil {
		log.Printf("错误点 A: 获取文章失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("错误点 B: 文章不存在: %v", err)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("错误点 C: 数据库查询失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	log.Println("文章获取成功！")
	ctx.JSON(http.StatusOK, article)
}

func DeleteArticleByID(ctx *gin.Context) {
	id := ctx.Param("id")

	var article models.Article
	result := global.Db.Where("id = ?", id).First(&article)

	username, exists := ctx.Get("username")
	if !exists {
		log.Printf("错误点 A: 获取用户名失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}
	
	role, exists := ctx.Get("role")
	if !exists {
		log.Printf("错误点 B: 获取角色失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	if role != "admin" && article.Author != username.(string) {
		log.Printf("错误点 B: 用户没有权限删除文章")
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除文章"})
		return
	}

	if result.Error != nil {
		log.Printf("错误点 C: 删除文章时数据库出错: %v", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库错误，删除失败"})
		return
	}

	if result.RowsAffected == 0 {
		log.Printf("警告: 尝试删除一个不存在的文章, ID: %s", id)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "未找到指定 ID 的文章，无法删除"})
		return
	}

	log.Printf("ID 为 %s 的文章删除成功！", id)
	ctx.JSON(http.StatusOK, gin.H{"message": "文章删除成功！"})
}
