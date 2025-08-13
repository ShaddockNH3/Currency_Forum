package controllers

import (
	"exchangeapp/service"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LikeController struct {
	likeService service.LikeService
}

func NewLikeController(likeService service.LikeService) *LikeController {
	return &LikeController{likeService: likeService}
}

func (c *LikeController) LikeArticle(ctx *gin.Context) {
	articleID := ctx.Param("id")

	// 调用Service层处理点赞
	if err := c.likeService.LikeArticle(articleID); err != nil {
		log.Printf("错误点 A: 增加点赞失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("点赞成功！")
	ctx.JSON(http.StatusOK, gin.H{"message": "successful like article"})
}

func (c *LikeController) GetArticleLikes(ctx *gin.Context) {
	articleID := ctx.Param("id")

	// 调用Service层获取点赞数
	likes, err := c.likeService.GetArticleLikes(articleID)
	if err != nil {
		log.Printf("错误点 A: 获取点赞失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("点赞获取成功！")
	ctx.JSON(http.StatusOK, gin.H{"likes": likes})
}