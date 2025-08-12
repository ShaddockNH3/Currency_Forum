package wallet_controllers

import (
	"exchangeapp/input"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

const (
	TransactionTypeSave     = "save"
	TransactionTypeWithdraw = "withdraw"
)

func SaveMoney(ctx *gin.Context) {
	var input input.SaveMoneyInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, username, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 构造 CreateBill 所需的参数
	// 注意：我们不再查询 Wallet，让 CreateBill 自己处理钱包验证和余额管理
	createBillInput := map[string]interface{}{
		"user_id":          userID, // 传递用户ID，让 CreateBill 自己查找钱包
		"transaction_type": TransactionTypeSave,
		"currency_code":    input.CurrencyCode,
		"amount":           input.MoneyAmount,
		"description":      input.Description,
		"reference_type":   "save_money",
		"reference_id":     "",
		"fee_amount":       decimal.Zero,
		"fee_currency":     input.CurrencyCode,
		"metadata": map[string]interface{}{
			"user_id":   userID,
			"username":  username,
			"operation": "save_money",
		},
	}

	// 调用 CreateBill Service 函数 - 让它处理所有财务逻辑
	transactionDTO, err := CreateBill(createBillInput)
	if err != nil {
		// 根据错误类型返回相应的HTTP状态码
		log.Printf("充值失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "充值失败: " + err.Error(),
		})
		return
	}

	// 充值成功，返回成功响应
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "充值成功",
		"data":    transactionDTO,
	})
}

func WithdrawMoney(ctx *gin.Context) {
	var input input.WithdrawMoneyInput

	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, username, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 构造 CreateBill 所需的参数
	// 注意：我们不再查询 Wallet 或检查余额，让 CreateBill 自己处理
	createBillInput := map[string]interface{}{
		"user_id":          userID, // 传递用户ID，让 CreateBill 自己查找钱包
		"transaction_type": TransactionTypeWithdraw,
		"currency_code":    input.CurrencyCode,
		"amount":           input.MoneyAmount,
		"description":      input.Description,
		"reference_type":   "withdraw_money",
		"reference_id":     "",
		"fee_amount":       decimal.Zero,
		"fee_currency":     input.CurrencyCode,
		"metadata": map[string]interface{}{
			"user_id":   userID,
			"username":  username,
			"operation": "withdraw_money",
		},
	}

	// 调用 CreateBill Service 函数 - 让它处理所有财务逻辑，包括余额检查
	transactionDTO, err := CreateBill(createBillInput)
	if err != nil {
		// 根据错误类型返回相应的HTTP状态码
		log.Printf("提现失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "提现失败: " + err.Error(),
		})
		return
	}

	// 提现成功，返回成功响应
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "提现成功",
		"data":    transactionDTO,
	})
}
