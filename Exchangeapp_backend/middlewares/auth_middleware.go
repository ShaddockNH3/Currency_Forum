package middlewares

import (
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if token == "" {
			log.Printf("认证失败: 缺少 Authorization Header")
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization Header"})
			ctx.Abort()
			return
		}

		log.Printf("收到认证请求，Token: %s", token[:min(len(token), 20)]+"...")

		username, role, id, err := utils.ParseJWT(token)
		if err != nil {
			log.Printf("认证失败: JWT 解析错误: %v", err)
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
			ctx.Abort()
			return
		}

		log.Printf("认证成功: 用户=%s, 角色=%s, ID=%d", username, role, id)

		ctx.Set("username", username)
		ctx.Set("role", role)
		ctx.Set("id", id)

		ctx.Next()
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
