package controllers

import (
	"errors"
	"exchangeapp/dto"
	"exchangeapp/global"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHomePage(ctx *gin.Context) {
	username := ctx.Param("username")

	log.Printf("开始处理获取用户 '%s' 的主页请求...", username)

	// 解析分页参数
	var queryInput input.HomePageQueryInput
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

	// 查询用户信息
	var user models.User
	if err := global.Db.Where("username = ?", username).First(&user).Error; err != nil {
		log.Printf("错误点 B: 用户查询失败: %v", err)

		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库错误"})
		}
		return
	}

	log.Printf("用户 '%s' 的信息获取成功！", username)

	// 查询用户文章总数
	var totalArticles int64
	if err := global.Db.Model(&models.Article{}).Where("author_id = ?", user.ID).Count(&totalArticles).Error; err != nil {
		log.Printf("错误点 C: 统计文章总数失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "获取文章统计失败"})
		return
	}

	// 计算分页偏移量
	offset := (page - 1) * pageSize

	// 查询分页文章
	var articles []models.Article
	if err := global.Db.Where("author_id = ?", user.ID).
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&articles).Error; err != nil {
		log.Printf("错误点 D: 查询分页文章失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章列表失败"})
		return
	}

	// 转换为 DTO
	articleDTOs := utils.ConvertArticlesToDTOs(articles)

	// 构建分页响应
	response := dto.HomePageALLDTO{
		Username:     user.Username,
		Role:         user.Role,
		Signature:    user.Signature,
		Introduction: user.Introduction,
		Articles: dto.HomePageByPagesDTO{
			Page:          page,
			PageSize:      pageSize,
			TotalArticles: int(totalArticles),
			Items:         articleDTOs,
		},
	}

	log.Printf("用户 '%s' 的主页信息获取成功，文章总数: %d, 当前页文章数: %d",
		username, totalArticles, len(articleDTOs))
	ctx.JSON(http.StatusOK, response)
}

func UpdateUserProfile(ctx *gin.Context) {
	log.Println("开始处理更新个人主页资料请求...")

	username, exists := ctx.Get("username")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "用户认证信息获取失败"})
		return
	}

	log.Printf("用户名 %s 正在请求更新资料...", username)

	var profileinput input.UpdateProfileInput
	if err := ctx.ShouldBindJSON(&profileinput); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := global.Db.Where("username = ?", username).First(&user).Error; err != nil {
		log.Printf("错误点 A: 用户查询失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库错误"})
		}
		return
	}
	result := global.Db.Model(&user).Where("username = ?", username).Updates(profileinput)

	if result.Error != nil {
		log.Printf("更新用户资料失败, 用户名 %s: %v", username, result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新资料失败，请稍后再试"})
		return
	}

	log.Printf("用户名 %s 的资料更新成功！", username)
	ctx.JSON(http.StatusOK, gin.H{"message": "个人资料更新成功！"})
}
