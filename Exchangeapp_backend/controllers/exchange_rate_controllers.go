package controllers

import (
	"errors"
	"exchangeapp/global"
	"exchangeapp/models"
	"exchangeapp/utils"
	"log"
	"net/http"
	"strconv"
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
	var input struct {
		FromCurrency string  `json:"fromCurrency" binding:"required"`
		ToCurrency   string  `json:"toCurrency" binding:"required"`
		Rate         float64 `json:"rate" binding:"required,gt=0"`
		Description  string  `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取当前用户ID
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// 检查用户是否为管理员
	var user models.User
	if err := global.Db.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if user.Role != "admin" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Only admin can create exchange rates"})
		return
	}

	// 创建汇率
	exchangeRate := models.ExchangeRate{
		FromCurrency: input.FromCurrency,
		ToCurrency:   input.ToCurrency,
		Rate:         input.Rate,
		Description:  input.Description,
		Date:         time.Now(),
	}

	if err := global.Db.Create(&exchangeRate).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exchange rate"})
		return
	}

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
	var exchangeRates []models.ExchangeRate

	if err := global.Db.Find(&exchangeRates).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exchange rates"})
		return
	}

	ctx.JSON(http.StatusOK, exchangeRates)
}

func DeleteExchangeRateByID(ctx *gin.Context) {
	id := ctx.Param("id")

	// 验证汇率ID参数
	if id == "" {
		log.Printf("错误点 A: 汇率ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "汇率ID不能为空"})
		return
	}

	// 查找汇率
	var exchangeRate models.ExchangeRate
	if err := global.Db.Where("id = ?", id).First(&exchangeRate).Error; err != nil {
		log.Printf("错误点 B: 获取汇率失败: %v", err)
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "汇率不存在"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "数据库查询失败"})
		}
		return
	}

	// 获取用户信息
	userID, _, userRole, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 C: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 权限检查：只有管理员可以删除汇率
	if userRole != "admin" {
		log.Printf("错误点 D: 用户 %v 没有权限删除汇率 %s", userID, id)
		ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除汇率"})
		return
	}

	// 执行删除操作
	if err := global.Db.Delete(&exchangeRate).Error; err != nil {
		log.Printf("错误点 E: 删除汇率时数据库出错: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "删除汇率失败，请稍后重试"})
		return
	}

	log.Printf("汇率删除成功！用户ID: %v, 汇率ID: %s", userID, id)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "汇率删除成功",
		"rate_id": id,
	})
}

func UpdateExchangeRateByID(ctx *gin.Context) {
	id := ctx.Param("id")
	rateID, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid exchange rate ID"})
		return
	}

	var input struct {
		FromCurrency string  `json:"fromCurrency" binding:"required"`
		ToCurrency   string  `json:"toCurrency" binding:"required"`
		Rate         float64 `json:"rate" binding:"required,gt=0"`
		Description  string  `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取当前用户ID
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// 检查用户是否为管理员
	var user models.User
	if err := global.Db.First(&user, userID).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
		return
	}

	if user.Role != "admin" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Only admin can update exchange rates"})
		return
	}

	// 查找汇率
	var exchangeRate models.ExchangeRate
	if err := global.Db.First(&exchangeRate, rateID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Exchange rate not found"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find exchange rate"})
		}
		return
	}

	// 更新汇率
	updates := map[string]interface{}{
		"fromCurrency": input.FromCurrency,
		"toCurrency":   input.ToCurrency,
		"rate":         input.Rate,
		"description":  input.Description,
	}

	if err := global.Db.Model(&exchangeRate).Updates(updates).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update exchange rate"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Exchange rate updated successfully"})
}
