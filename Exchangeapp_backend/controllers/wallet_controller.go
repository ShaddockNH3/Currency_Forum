// Package controllers 处理HTTP请求，负责请求参数验证、调用服务层和返回响应
package controllers

import (
	"exchangeapp/input"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// WalletController 钱包控制器，处理钱包相关的HTTP请求
type WalletController struct {
	walletService service.WalletService
}

// NewWalletController 创建钱包控制器实例
func NewWalletController(walletService service.WalletService) *WalletController {
	return &WalletController{walletService: walletService}
}

// CreateWallet 处理创建钱包请求
// 每个用户只能创建一个钱包
func (c *WalletController) CreateWallet(ctx *gin.Context) {
	var walletInput input.WalletInput

	log.Printf("[Wallet] 开始处理创建钱包请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&walletInput); err != nil {
		log.Printf("[Wallet] 创建钱包请求数据绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	log.Printf("[Wallet] 调用服务层创建钱包，用户ID: %d，钱包名: %s", userID, walletInput.WalletName)

	// 调用服务层处理创建钱包业务逻辑
	response, err := c.walletService.CreateWallet(uint(userID), &walletInput)
	if err != nil {
		log.Printf("[Wallet] 服务层创建钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 钱包创建成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}

// GetWallet 处理获取钱包信息请求
// 根据JWT中的用户ID获取用户的钱包信息
func (c *WalletController) GetWallet(ctx *gin.Context) {
	log.Printf("[Wallet] 开始处理获取钱包请求")

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	log.Printf("[Wallet] 调用服务层获取钱包，用户ID: %d", userID)

	// 调用服务层获取钱包信息
	response, err := c.walletService.GetWalletByUserID(uint(userID))
	if err != nil {
		log.Printf("[Wallet] 服务层获取钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 钱包信息获取成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}

// UpdateWallet 处理更新钱包信息请求
// 更新钱包的名称、描述和默认货币
func (c *WalletController) UpdateWallet(ctx *gin.Context) {
	var walletInput input.WalletInput

	log.Printf("[Wallet] 开始处理更新钱包请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&walletInput); err != nil {
		log.Printf("[Wallet] 更新钱包请求数据绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	log.Printf("[Wallet] 调用服务层更新钱包，用户ID: %d，钱包名: %s", userID, walletInput.WalletName)

	// 调用服务层处理更新钱包业务逻辑
	response, err := c.walletService.UpdateWalletMessage(uint(userID), &walletInput)
	if err != nil {
		log.Printf("[Wallet] 服务层更新钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 钱包更新成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}
