package controllers

import (
	"exchangeapp/input"
	"exchangeapp/service"
	"exchangeapp/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CommentController struct {
	commentService service.CommentService
}

func NewCommentController(commentService service.CommentService) *CommentController {
	return &CommentController{
		commentService: commentService,
	}
}

func (c *CommentController) CreateComment(ctx *gin.Context) {
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	var commentInput input.CommentInput
	if err := ctx.ShouldBindJSON(&commentInput); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = c.commentService.Create(&commentInput, uint(userID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "评论创建成功"})
}

func (c *CommentController) GetCommentsByArticleID(ctx *gin.Context) {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的articleID"})
		return
	}

	// 检查是否需要分页
	pageStr := ctx.Query("page")
	pageSizeStr := ctx.Query("page_size")

	if pageStr != "" || pageSizeStr != "" {
		// 使用分页查询
		page := 1
		pageSize := 20

		if pageStr != "" {
			if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
				page = p
			}
		}

		if pageSizeStr != "" {
			if ps, err := strconv.Atoi(pageSizeStr); err == nil && ps > 0 && ps <= 100 {
				pageSize = ps
			}
		}

		result, err := c.commentService.FindByArticleIDWithPagination(articleID, page, pageSize)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, result)
		return
	}

	// 不分页，返回所有评论
	comments, err := c.commentService.FindByArticleID(articleID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"comments": comments})
}

func (c *CommentController) DeleteCommentByArticleID(ctx *gin.Context) {
	userID, _, userRole, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的articleID"})
		return
	}

	err = c.commentService.DeleteByArticleID(articleID, uint(userID), userRole)
	if err != nil {
		if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除此文章的评论"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "评论删除成功"})
}

func (c *CommentController) GetCommentsByParentID(ctx *gin.Context) {
	parentID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的parentID"})
		return
	}

	comments, err := c.commentService.FindByParentID(parentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"comments": comments})
}

// DeleteCommentByID 删除单个评论
func (c *CommentController) DeleteCommentByID(ctx *gin.Context) {
	userID, _, userRole, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	commentID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "无效的评论ID"})
		return
	}

	err = c.commentService.DeleteByID(commentID, uint(userID), userRole)
	if err != nil {
		if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除此评论"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "评论删除成功"})
}
