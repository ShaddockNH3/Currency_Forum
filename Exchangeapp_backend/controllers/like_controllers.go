package controllers

import (
	"exchangeapp/global"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

func LikeArticle(ctx *gin.Context){
	articleID:=ctx.Param("id")

	likeKey:="article:"+articleID+":likes"
	
	if err:=global.RedisDB.Incr(likeKey).Err();err!=nil{
		log.Printf("错误点 A: 增加点赞失败: %v",err)
		ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		return
	}

	log.Println("点赞成功！")
	ctx.JSON(http.StatusOK,gin.H{"message":"successful like article"})
}

func GetArticleLikes(ctx *gin.Context){
	articleID:=ctx.Param("id")

	likeKey:="article:"+articleID+":likes"

	likes,err:=global.RedisDB.Get(likeKey).Result()

	if err==redis.Nil{
		likes="0"
	}else if err!=nil{
		log.Printf("错误点 A: 获取点赞失败: %v",err)
		ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		return
	}

	log.Println("点赞获取成功！")
	ctx.JSON(http.StatusOK,gin.H{"likes":likes})
}