package controllers

import (
	"exchangeapp/input"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type HomePageController struct {
	homePageService service.HomePageService
}

func NewHomePageController(homePageService service.HomePageService) *HomePageController {
	return &HomePageController{homePageService: homePageService}
}

func (c *HomePageController) GetHomePage(ctx *gin.Context) {
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

	// 调用Service层获取主页信息
	response, err := c.homePageService.GetHomePage(username, page, pageSize)
	if err != nil {
		log.Printf("错误点 B: 获取主页信息失败: %v", err)
		if err == utils.ErrUserNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "获取主页信息失败"})
		}
		return
	}

	log.Printf("用户 '%s' 的主页信息获取成功，文章总数: %d, 当前页文章数: %d",
		username, response.Articles.TotalArticles, len(response.Articles.Items))
	ctx.JSON(http.StatusOK, response)
}

func (c *HomePageController) UpdateUserProfile(ctx *gin.Context) {
	log.Println("开始处理更新个人主页资料请求...")

	username, exists := ctx.Get("username")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "用户认证信息获取失败"})
		return
	}

	log.Printf("用户名 %s 正在请求更新资料...", username)

	var profileInput input.UpdateProfileInput
	if err := ctx.ShouldBindJSON(&profileInput); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 调用Service层更新用户资料
	if err := c.homePageService.UpdateUserProfile(username.(string), &profileInput); err != nil {
		log.Printf("更新用户资料失败, 用户名 %s: %v", username, err)
		if err == utils.ErrUserNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新资料失败，请稍后再试"})
		}
		return
	}

	log.Printf("用户名 %s 的资料更新成功！", username)
	ctx.JSON(http.StatusOK, gin.H{"message": "个人资料更新成功！"})
}
