package controllers

import (
	"errors"
	"exchangeapp/dto"
	"exchangeapp/global"
	"exchangeapp/input"
	"exchangeapp/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHomePage(ctx *gin.Context) {
	username := ctx.Param("username")

	log.Printf("开始处理获取用户 '%s' 的主页请求...", username)

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

	log.Printf("用户 '%s' 的信息获取成功！", username)

	response:=dto.UserResponse{
		ID:           user.ID,
        Username:     user.Username,
        Role:         user.Role,
        Signature:    user.Signature,
        Introduction: user.Introduction,
	}

	log.Printf("用户 '%s' 清洗敏感信息成功", username)
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
	if err := global.Db.Where("username = ?", username).First(&user).Error; err != nil{
		log.Printf("错误点 A: 用户查询失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound){
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户不存在"})
		}else{
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库错误"})
		}
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
