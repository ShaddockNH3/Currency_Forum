// Package controllers 处理HTTP请求，负责请求参数验证、调用服务层和返回响应
package controllers

import (
	"exchangeapp/input"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
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

	// 调用服务层处理创建钱包业务逻辑（会自动创建默认货币余额）
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
// 更新钱包的名称、描述和默认货币（如果默认货币变更，会自动创建新货币余额）
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

func (c *WalletController) CreateBalance(ctx *gin.Context) {
	var balanceInput input.WalletBalanceInput

	if err := ctx.ShouldBindJSON(&balanceInput); err != nil {
		log.Printf("[Wallet] 创建余额请求数据绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	walletID, err := c.walletService.GetWalletIDByUserID(uint(userID))
	if err != nil {
		log.Printf("[Wallet] 获取钱包ID失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	hasBalance, err := c.walletService.HasWalletBalance(walletID, balanceInput.CurrencyCode)
	if err != nil {
		log.Printf("[Wallet] 检查余额是否存在失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "检查余额失败"})
		return
	}

	if hasBalance {
		log.Printf("[Wallet] 钱包已存在该币种余额")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "钱包已存在该币种余额"})
		return
	}

	amount, err := decimal.NewFromString(balanceInput.Amount)
	if err != nil {
		log.Printf("[Wallet] 金额转换失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "金额格式错误"})
		return
	}

	response, err := c.walletService.CreateBalance(walletID, balanceInput.CurrencyCode, amount)

	if err != nil {
		log.Printf("[Wallet] 创建余额失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 余额创建成功，钱包ID: %d，货币: %s", walletID, balanceInput.CurrencyCode)
	ctx.JSON(http.StatusOK, response)
}

// GetAllBalances 获取钱包所有余额
func (c *WalletController) GetAllBalances(ctx *gin.Context) {
	log.Printf("[Wallet] 开始处理获取所有余额请求")

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	// 获取钱包ID
	walletID, err := c.walletService.GetWalletIDByUserID(uint(userID))
	if err != nil {
		log.Printf("[Wallet] 获取钱包ID失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "钱包不存在"})
		return
	}

	// 获取所有余额
	balances, err := c.walletService.GetAllBalancesByWalletID(walletID)
	if err != nil {
		log.Printf("[Wallet] 获取余额失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 余额获取成功，用户ID: %d，余额数量: %d", userID, len(balances))
	ctx.JSON(http.StatusOK, gin.H{"balances": balances})
}

// GetBalanceByCurrency 获取特定货币余额
func (c *WalletController) GetBalanceByCurrency(ctx *gin.Context) {
	currencyCode := ctx.Param("currency")
	log.Printf("[Wallet] 开始处理获取特定货币余额请求，货币: %s", currencyCode)

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Wallet] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	// 获取钱包ID
	walletID, err := c.walletService.GetWalletIDByUserID(uint(userID))
	if err != nil {
		log.Printf("[Wallet] 获取钱包ID失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "钱包不存在"})
		return
	}

	// 获取特定货币余额
	balance, err := c.walletService.GetBalanceByWalletIDAndCurrency(walletID, currencyCode)
	if err != nil {
		log.Printf("[Wallet] 获取%s余额失败: %v", currencyCode, err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "余额不存在"})
		return
	}

	log.Printf("[Wallet] %s余额获取成功，用户ID: %d", currencyCode, userID)
	ctx.JSON(http.StatusOK, balance)
}

// Deposit 处理充值请求
func (c *WalletController) Deposit(ctx *gin.Context) {
	var depositInput input.DepositInput

	log.Printf("[Wallet] 开始处理充值请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&depositInput); err != nil {
		log.Printf("[Wallet] 充值请求数据绑定失败: %v", err)
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

	log.Printf("[Wallet] 调用服务层处理充值，用户ID: %d，金额: %s %s", userID, depositInput.Amount, depositInput.CurrencyCode)

	// 调用服务层处理充值业务逻辑
	response, err := c.walletService.Deposit(uint(userID), &depositInput)
	if err != nil {
		log.Printf("[Wallet] 服务层充值失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 充值成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}

// Withdraw 处理取出请求
func (c *WalletController) Withdraw(ctx *gin.Context) {
	var withdrawInput input.WithdrawInput

	log.Printf("[Wallet] 开始处理取出请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&withdrawInput); err != nil {
		log.Printf("[Wallet] 取出请求数据绑定失败: %v", err)
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

	log.Printf("[Wallet] 调用服务层处理取出，用户ID: %d，金额: %s %s", userID, withdrawInput.Amount, withdrawInput.CurrencyCode)

	// 调用服务层处理取出业务逻辑
	response, err := c.walletService.Withdraw(uint(userID), &withdrawInput)
	if err != nil {
		log.Printf("[Wallet] 服务层取出失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 取出成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}

// Exchange 处理货币兑换请求
func (c *WalletController) Exchange(ctx *gin.Context) {
	var exchangeInput input.ExchangeInput

	log.Printf("[Wallet] 开始处理货币兑换请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&exchangeInput); err != nil {
		log.Printf("[Wallet] 货币兑换请求数据绑定失败: %v", err)
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

	log.Printf("[Wallet] 调用服务层处理货币兑换，用户ID: %d，%s -> %s，金额: %s",
		userID, exchangeInput.FromCurrency, exchangeInput.ToCurrency, exchangeInput.Amount)

	// 调用服务层处理货币兑换业务逻辑
	response, err := c.walletService.Exchange(uint(userID), &exchangeInput)
	if err != nil {
		log.Printf("[Wallet] 服务层货币兑换失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Wallet] 货币兑换成功，用户ID: %d", userID)
	ctx.JSON(http.StatusOK, response)
}
