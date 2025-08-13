package controllers

import (
	"exchangeapp/input"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ArticleController struct {
	articleService service.ArticleService
}

func NewArticleController(articleService service.ArticleService) *ArticleController {
	return &ArticleController{articleService: articleService}
}

func (c *ArticleController) CreateArticle(ctx *gin.Context) {
	var articleInput input.ArticleInput

	log.Println("开始处理创建文章请求...")

	if err := ctx.ShouldBindJSON(&articleInput); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取用户信息
	userID, username, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	// 调用Service层创建文章
	response, err := c.articleService.Create(&articleInput, userID, username)
	if err != nil {
		log.Printf("错误点 C: 创建文章失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("文章创建成功！")
	ctx.JSON(http.StatusCreated, response)
}

func (c *ArticleController) GetArticles(ctx *gin.Context) {
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

	// 调用Service层获取文章列表
	response, err := c.articleService.GetAll(page, pageSize)
	if err != nil {
		log.Printf("错误点 B: 获取文章列表失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章列表失败"})
		return
	}

	log.Printf("分页文章查询成功，总数: %d, 当前页: %d", response.TotalArticles, len(response.Items))
	ctx.JSON(http.StatusOK, response)
}

func (c *ArticleController) GetArticlesByID(ctx *gin.Context) {
	id := ctx.Param("id")

	// 验证文章ID参数
	if id == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	log.Println("开始处理获取文章请求...")

	// 调用Service层获取文章
	article, err := c.articleService.GetByID(id)
	if err != nil {
		log.Printf("错误点 B: 获取文章失败: %v", err)
		if err == utils.ErrArticleNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	log.Println("文章获取成功！")
	ctx.JSON(http.StatusOK, article)
}

func (c *ArticleController) UpdateArticleByID(ctx *gin.Context) {
	articleID := ctx.Param("id")

	// 验证文章ID参数
	if articleID == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	var articleInput input.ArticleInput

	if err := ctx.ShouldBindJSON(&articleInput); err != nil {
		log.Printf("错误点 B: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取用户信息
	userID, _, userRole, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("错误点 C: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 调用Service层更新文章
	if err := c.articleService.Update(articleID, &articleInput, userID, userRole); err != nil {
		log.Printf("错误点 D: 更新文章失败: %v", err)
		if err == utils.ErrArticleNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限编辑此文章"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败，请稍后重试"})
		}
		return
	}

	log.Printf("文章更新成功！用户ID: %v, 文章ID: %s", userID, articleID)
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "文章更新成功",
		"article_id": articleID,
	})
}

func (c *ArticleController) DeleteArticleByID(ctx *gin.Context) {
	articleID := ctx.Param("id")

	// 验证文章ID参数
	if articleID == "" {
		log.Printf("错误点 A: 文章ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "文章ID不能为空"})
		return
	}

	// 获取用户信息
	userID, _, userRole, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 调用Service层删除文章
	if err := c.articleService.Delete(articleID, userID, userRole); err != nil {
		log.Printf("错误点 C: 删除文章失败: %v", err)
		if err == utils.ErrArticleNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "文章不存在"})
		} else if err == utils.ErrForbidden {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "没有权限删除此文章"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败，请稍后重试"})
		}
		return
	}

	log.Printf("文章删除成功！用户ID: %v, 文章ID: %s", userID, articleID)
	ctx.JSON(http.StatusOK, gin.H{
		"message":    "文章删除成功",
		"article_id": articleID,
	})
}
