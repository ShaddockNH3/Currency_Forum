package controllers

import (
	"encoding/json"
	"errors"
	"exchangeapp/dto"
	"exchangeapp/global"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/utils"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
	"gorm.io/gorm"
)

const (
	cacheKey = "articles"
	cacheTTL = 10 * time.Minute
)

func CreateArticle(ctx *gin.Context) {

	var articleInput input.ArticleInput

	log.Println("开始处理创建文章请求...")

	if err := ctx.ShouldBindJSON(&articleInput); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	article := models.Article{

		Title:   articleInput.Title,
		Content: articleInput.Content,
		Preview: articleInput.Preview,
	}

	// 获取用户信息
	userID, username, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	article.AuthorID = userID
	article.Author = username

	// 注意：数据库迁移已在应用启动时完成，此处不再需要

	if err := global.Db.Create(&article).Error; err != nil {
		log.Printf("错误点 C: 创建文章失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 清除所有相关缓存（包括分页缓存）
	clearArticleCache()

	response := dto.ArticleDTO{
		Title:    article.Title,
		Content:  article.Content,
		Preview:  article.Preview,
		AuthorID: int(article.AuthorID),
		Author:   article.Author,
	}

	log.Println("文章创建成功！")
	ctx.JSON(http.StatusCreated, response)
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
	// 解析分页参数
	var queryInput input.ArticleQueryInput
	if err := ctx.ShouldBindQuery(&queryInput); err != nil {
		log.Printf("错误点 A: 分页参数解析失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "分页参数无效"})
		return
	}

	// 设置默认分页参数
	page := 1
	pageSize := 10

	if queryInput.Page != nil {
		page = *queryInput.Page
	}
	if queryInput.PageSize != nil {
		pageSize = *queryInput.PageSize
	}

	// 验证分页参数合理性
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	} else if pageSize > 100 {
		pageSize = 100
	}

	log.Printf("分页参数: 页码=%d, 每页大小=%d", page, pageSize)

	// 构建缓存键（包含分页信息）
	cacheKeyWithPage := fmt.Sprintf("%s:page_%d_size_%d", cacheKey, page, pageSize)

	// 尝试从缓存获取分页数据
	cacheData, err := global.RedisDB.Get(cacheKeyWithPage).Result()

	if err == redis.Nil {
		// 缓存未命中，从数据库查询
		log.Println("缓存未命中，从数据库查询分页文章...")

		// 查询文章总数
		var totalArticles int64
		if err := global.Db.Model(&models.Article{}).Count(&totalArticles).Error; err != nil {
			log.Printf("错误点 B: 统计文章总数失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章统计失败"})
			return
		}

		// 计算分页偏移量
		offset := (page - 1) * pageSize

		// 查询分页文章
		var articles []models.Article
		if err := global.Db.Order("created_at DESC").
			Offset(offset).
			Limit(pageSize).
			Find(&articles).Error; err != nil {
			log.Printf("错误点 C: 查询分页文章失败: %v", err)
			if errors.Is(err, gorm.ErrRecordNotFound) {
				log.Printf("错误点 D: 文章不存在: %v", err)
				ctx.JSON(http.StatusNotFound, gin.H{"error": "没有找到文章"})
			} else {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库查询失败"})
			}
			return
		}

		// 转换为 DTO
		articleDTOs := utils.ConvertArticlesToDTOs(articles)

		// 构建分页响应
		response := dto.ArticlePageDTO{
			Page:          page,
			PageSize:      pageSize,
			TotalArticles: totalArticles,
			Items:         articleDTOs,
		}

		// 缓存分页结果（较短的缓存时间，因为分页数据变化频繁）
		responseJson, err := json.Marshal(response)
		if err != nil {
			log.Printf("错误点 E: 序列化分页响应失败: %v", err)
			// 序列化失败不影响主流程，只记录日志
		} else {
			// 分页缓存时间设置为5分钟，比全量缓存短
			if err := global.RedisDB.Set(cacheKeyWithPage, responseJson, 5*time.Minute).Err(); err != nil {
				log.Printf("错误点 F: 缓存分页数据失败: %v", err)
				// 缓存失败不影响主流程，只记录日志
			}
		}

		log.Printf("分页文章查询成功，总数: %d, 当前页: %d", totalArticles, len(articleDTOs))
		ctx.JSON(http.StatusOK, response)

	} else if err != nil {
		// 缓存获取失败
		log.Printf("错误点 G: 获取缓存失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "缓存服务异常"})
		return
	} else {
		// 缓存命中，直接返回
		var response dto.ArticlePageDTO
		if err := json.Unmarshal([]byte(cacheData), &response); err != nil {
			log.Printf("错误点 H: 反序列化缓存数据失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "缓存数据解析失败"})
			return
		}

		log.Printf("从缓存获取分页文章成功，当前页: %d", len(response.Items))
		ctx.JSON(http.StatusOK, response)
	}
}

func GetArticlesByID(ctx *gin.Context) {
	id := ctx.Param("id")

	// 验证文章ID参数
	if id == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	var article models.Article

	log.Println("开始处理获取文章请求...")

	if err := global.Db.Where("id = ?", id).First(&article).Error; err != nil {
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

func UpdateArticleByID(ctx *gin.Context) {
	articleid := ctx.Param("id")

	// 验证文章ID参数
	if articleid == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	var input struct {
		Title   string `json:"title" binding:"required"`
		Preview string `json:"preview" binding:"required"`
		Content string `json:"content" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 B: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 查找文章
	var article models.Article
	if err := global.Db.Where("id = ?", articleid).First(&article).Error; err != nil {
		log.Printf("错误点 C: 获取文章失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库查询失败"})
		}
		return
	}

	// 获取用户信息
	userID, _, userRole, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 D: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 权限检查：只有管理员或文章作者可以编辑文章
	if userRole != "admin" && article.AuthorID != userID {
		log.Printf("错误点 E: 用户 %v 没有权限编辑文章 %s", userID, articleid)
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限编辑此文章"})
		return
	}

	// 执行更新操作
	updates := map[string]interface{}{
		"title":   input.Title,
		"preview": input.Preview,
		"content": input.Content,
	}

	if err := global.Db.Model(&article).Updates(updates).Error; err != nil {
		log.Printf("错误点 F: 更新文章时数据库出错: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败，请稍后重试"})
		return
	}

	// 清除缓存
	clearArticleCache()

	log.Printf("文章更新成功！用户ID: %v, 文章ID: %s", userID, articleid)
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "文章更新成功",
		"article_id": articleid,
	})
}

func DeleteArticleByID(ctx *gin.Context) {
	articleid := ctx.Param("id")

	// 验证文章ID参数
	if articleid == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	var article models.Article
	if err := global.Db.Where("id = ?", articleid).First(&article).Error; err != nil {
		log.Printf("错误点 B: 获取文章失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库查询失败"})
		}
		return
	}

	// 获取用户信息
	userID, _, userRole, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 C: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 权限检查：只有管理员或文章作者可以删除文章
	if userRole != "admin" && article.AuthorID != userID {
		log.Printf("错误点 E: 用户 %v 没有权限删除文章 %s", userID, articleid)
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除此文章"})
		return
	}

	// 执行删除操作
	if err := global.Db.Delete(&article).Error; err != nil {
		log.Printf("错误点 F: 删除文章时数据库出错: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败，请稍后重试"})
		return
	}

	log.Printf("文章删除成功！用户ID: %v, 文章ID: %s", userID, articleid)
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "文章删除成功",
		"article_id": articleid,
	})
}

// clearArticleCache 清除所有文章相关的缓存
func clearArticleCache() {
	// 清除主缓存键
	if err := global.RedisDB.Del(cacheKey).Err(); err != nil {
		log.Printf("清除主缓存失败: %v", err)
	}

	// 清除分页缓存（使用模式匹配删除所有分页缓存）
	pattern := cacheKey + ":page_*"
	keys, err := global.RedisDB.Keys(pattern).Result()
	if err != nil {
		log.Printf("获取分页缓存键失败: %v", err)
		return
	}

	if len(keys) > 0 {
		if err := global.RedisDB.Del(keys...).Err(); err != nil {
			log.Printf("清除分页缓存失败: %v", err)
		} else {
			log.Printf("成功清除 %d 个分页缓存", len(keys))
		}
	}
}
