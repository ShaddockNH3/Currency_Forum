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

		log.Printf("收到认证请求,完整Token: %s", token)
		log.Printf("Token长度: %d", len(token))
		if len(token) > 20 {
			log.Printf("Token前20字符: %s...", token[:20])
		}

		claims, err := utils.ParseJWT(token)
		if err != nil {
			log.Printf("认证失败: JWT 解析错误: %v", err)
			log.Printf("Token内容: %s", token)
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
			ctx.Abort()
			return
		}

		username := claims.Username
		role := claims.Role
		id := claims.UserID

		log.Printf("认证成功: 用户=%s, 角色=%s, ID=%d", username, role, id)

		ctx.Set("username", username)
		ctx.Set("role", role)
		ctx.Set("userID", id)

		ctx.Next()
	}
}
