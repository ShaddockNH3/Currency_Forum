package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
)

// GetUserInfo 从上下文中获取用户信息
func GetUserInfo(ctx *gin.Context) (userID int, username string, role string, err error) {
	id, exists := ctx.Get("id")
	if !exists {
		return 0, "", "", errors.New("获取用户ID失败")
	}

	usernameVal, exists := ctx.Get("username")
	if !exists {
		return 0, "", "", errors.New("获取用户名失败")
	}

	roleVal, exists := ctx.Get("role")
	if !exists {
		return 0, "", "", errors.New("获取用户角色失败")
	}

	return id.(int), usernameVal.(string), roleVal.(string), nil
}
