package controllers

import (
	"errors"
	"exchangeapp/global"
	"exchangeapp/models"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
创建汇率
1. 接收请求数据
2. 验证数据
3. 迁移数据库
4. 创建汇率
5. 返回响应
*/
func CreateExchangeRate(ctx *gin.Context) {
	var exchangeRate models.ExchangeRate

	log.Println("开始处理创建汇率请求...")
	if err := ctx.ShouldBindJSON(&exchangeRate); err != nil {
		log.Printf("错误点 A: 绑定请求失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	exchangeRate.Date = time.Now()

	role, exists := ctx.Get("role")
	if !exists {
		log.Printf("错误点 B: 获取角色失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	if role != "admin" {
		log.Printf("错误点 C: 用户没有权限创建汇率")
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限创建汇率"})
		return
	}

	// 注意：数据库迁移已在应用启动时完成，此处不再需要

	if err := global.Db.Create(&exchangeRate).Error; err != nil {
		log.Printf("错误点 D: 创建汇率失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("汇率创建成功！")
	ctx.JSON(http.StatusCreated, exchangeRate)
}

/*
获取汇率
1. 接收请求数据
2. 验证数据
3. 迁移数据库
4. 创建汇率
5. 返回响应
*/
func GetExchangeRate(ctx *gin.Context) {
	var exchangeRate []models.ExchangeRate

	log.Println("开始处理获取汇率请求...")
	if err := global.Db.Find(&exchangeRate).Error; err != nil {
		log.Printf("错误点 A: 获取汇率失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("错误点 B: 汇率不存在: %v", err)
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("错误点 C: 数据库查询失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("汇率获取成功！")
	ctx.JSON(http.StatusOK, exchangeRate)
}

func DeleteExchangeRateByID(ctx *gin.Context) {
	id := ctx.Param("id")

	result := global.Db.Where("id = ?", id).Delete(&models.ExchangeRate{})

	role, exists := ctx.Get("role")
	if !exists {
		log.Printf("错误点 B: 获取角色失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	if role != "admin" {
		log.Printf("错误点 B: 用户没有权限删除汇率")
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除文章"})
		return
	}

	if result.Error != nil {
		log.Printf("错误点 A: 删除汇率时数据库出错: %v", result.Error)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库错误，删除失败"})
		return
	}

	if result.RowsAffected == 0 {
		log.Printf("警告: 尝试删除一个不存在的汇率, ID: %s", id)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "未找到指定 ID 的汇率，无法删除"})
		return
	}

	log.Printf("ID 为 %s 的汇率删除成功！", id)
	ctx.JSON(http.StatusOK, gin.H{"message": "汇率删除成功！"})
}
