package controllers

import (
	"exchangeapp/models"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ExchangeRateController struct {
	exchangeRateService service.ExchangeRateService
}

func NewExchangeRateController(exchangeRateService service.ExchangeRateService) *ExchangeRateController {
	return &ExchangeRateController{exchangeRateService: exchangeRateService}
}

func (c *ExchangeRateController) CreateExchangeRate(ctx *gin.Context) {
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

	// 获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// 创建汇率对象
	exchangeRate := &models.ExchangeRate{
		FromCurrency: input.FromCurrency,
		ToCurrency:   input.ToCurrency,
		Rate:         input.Rate,
		Description:  input.Description,
		Date:         time.Now(),
	}

	// 调用Service层创建汇率
	if err := c.exchangeRateService.Create(exchangeRate, uint(userID)); err != nil {
		if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Only admin can create exchange rates"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create exchange rate"})
		}
		return
	}

	ctx.JSON(http.StatusCreated, exchangeRate)
}

func (c *ExchangeRateController) GetExchangeRate(ctx *gin.Context) {
	// 调用Service层获取所有汇率
	exchangeRates, err := c.exchangeRateService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch exchange rates"})
		return
	}

	ctx.JSON(http.StatusOK, exchangeRates)
}

func (c *ExchangeRateController) DeleteExchangeRateByID(ctx *gin.Context) {
	id := ctx.Param("id")

	// 验证汇率ID参数
	if id == "" {
		log.Printf("错误点 A: 汇率ID参数为空")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "汇率ID不能为空"})
		return
	}

	// 获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权访问"})
		return
	}

	// 调用Service层删除汇率
	if err := c.exchangeRateService.Delete(id, uint(userID)); err != nil {
		log.Printf("错误点 C: 删除汇率失败: %v", err)
		if err == utils.ErrExchangeRateNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "汇率不存在"})
		} else if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "没有权限删除汇率"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "删除汇率失败，请稍后重试"})
		}
		return
	}

	log.Printf("汇率删除成功！用户ID: %v, 汇率ID: %s", userID, id)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "汇率删除成功",
		"rate_id": id,
	})
}

func (c *ExchangeRateController) UpdateExchangeRateByID(ctx *gin.Context) {
	id := ctx.Param("id")
	_, err := strconv.Atoi(id)
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

	// 获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// 创建汇率对象
	exchangeRate := &models.ExchangeRate{
		FromCurrency: input.FromCurrency,
		ToCurrency:   input.ToCurrency,
		Rate:         input.Rate,
		Description:  input.Description,
	}

	// 调用Service层更新汇率
	if err := c.exchangeRateService.Update(id, exchangeRate, uint(userID)); err != nil {
		if err == utils.ErrExchangeRateNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Exchange rate not found"})
		} else if err == utils.ErrForbidden {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "Only admin can update exchange rates"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update exchange rate"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Exchange rate updated successfully"})
}
