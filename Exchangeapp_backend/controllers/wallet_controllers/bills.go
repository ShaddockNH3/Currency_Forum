package wallet_controllers

import (
	"exchangeapp/dto"
	"exchangeapp/global"
	"exchangeapp/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"exchangeapp/utils"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// CreateBill 创建账单/交易记录 - 纯粹的 Service 函数
// 返回：交易记录DTO、错误信息
func CreateBill(inputData map[string]interface{}) (*dto.WalletTransactionDTO, error) {
	var input struct {
		WalletID        uint                   `json:"wallet_id"`
		UserID          uint                   `json:"user_id"`
		TransactionType string                 `json:"transaction_type"`
		CurrencyCode    string                 `json:"currency_code"`
		Amount          decimal.Decimal        `json:"amount"`
		Description     string                 `json:"description"`
		ReferenceID     string                 `json:"reference_id"`
		ReferenceType   string                 `json:"reference_type"`
		FeeAmount       decimal.Decimal        `json:"fee_amount"`
		FeeCurrency     string                 `json:"fee_currency"`
		Metadata        map[string]interface{} `json:"metadata"`
	}

	// 从提供的参数中构造输入
	if inputData == nil {
		return nil, fmt.Errorf("输入数据不能为空")
	}

	// 转换 wallet_id
	if walletID, ok := inputData["wallet_id"].(uint); ok {
		input.WalletID = walletID
	} else if walletIDFloat, ok := inputData["wallet_id"].(float64); ok {
		input.WalletID = uint(walletIDFloat)
	}

	// 转换 user_id
	if userID, ok := inputData["user_id"].(uint); ok {
		input.UserID = userID
	} else if userIDFloat, ok := inputData["user_id"].(float64); ok {
		input.UserID = uint(userIDFloat)
	}

	// 转换其他字段
	if transactionType, ok := inputData["transaction_type"].(string); ok {
		input.TransactionType = transactionType
	}
	if currencyCode, ok := inputData["currency_code"].(string); ok {
		input.CurrencyCode = currencyCode
	}
	if amount, ok := inputData["amount"].(decimal.Decimal); ok {
		input.Amount = amount
	}
	if description, ok := inputData["description"].(string); ok {
		input.Description = description
	}
	if referenceID, ok := inputData["reference_id"].(string); ok {
		input.ReferenceID = referenceID
	}
	if referenceType, ok := inputData["reference_type"].(string); ok {
		input.ReferenceType = referenceType
	}
	if feeAmount, ok := inputData["fee_amount"].(decimal.Decimal); ok {
		input.FeeAmount = feeAmount
	}
	if feeCurrency, ok := inputData["fee_currency"].(string); ok {
		input.FeeCurrency = feeCurrency
	}
	if metadata, ok := inputData["metadata"].(map[string]interface{}); ok {
		input.Metadata = metadata
	}

	// 验证必需字段
	if input.TransactionType == "" {
		return nil, fmt.Errorf("交易类型不能为空")
	}
	if input.CurrencyCode == "" {
		return nil, fmt.Errorf("货币代码不能为空")
	}
	if input.Amount.IsZero() {
		return nil, fmt.Errorf("交易金额不能为零")
	}

	// 如果提供了 user_id 但没有 wallet_id，则根据 user_id 查找钱包
	if input.WalletID == 0 && input.UserID > 0 {
		var wallet models.Wallet
		if err := global.Db.Where("user_id = ?", input.UserID).First(&wallet).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, fmt.Errorf("用户钱包不存在")
			}
			return nil, fmt.Errorf("查找钱包失败: %v", err)
		}
		input.WalletID = wallet.ID
	}

	// 验证钱包是否存在
	var wallet models.Wallet
	if err := global.Db.Preload("User").First(&wallet, input.WalletID).Error; err != nil {
		return nil, fmt.Errorf("钱包不存在")
	}

	// 获取当前余额
	var balance models.WalletBalance
	err := global.Db.Where("wallet_id = ? AND currency_code = ?", input.WalletID, input.CurrencyCode).First(&balance).Error
	if err != nil {
		// 如果余额记录不存在，创建新的余额记录
		balance = models.WalletBalance{
			WalletID:     input.WalletID,
			CurrencyCode: input.CurrencyCode,
			Amount:       decimal.Zero,
			IsLocked:     false,
			ExchangeRate: decimal.NewFromInt(1),
			LastUpdated:  time.Now().Unix(),
		}
	}

	// 计算交易后的余额
	balanceBefore := balance.Amount
	var balanceAfter decimal.Decimal

	switch input.TransactionType {
	case "save":
		balanceAfter = balanceBefore.Add(input.Amount)
	case "withdraw":
		if balanceBefore.LessThan(input.Amount) {
			return nil, fmt.Errorf("余额不足")
		}
		balanceAfter = balanceBefore.Sub(input.Amount)
	default:
		return nil, fmt.Errorf("不支持的交易类型: %s", input.TransactionType)
	}

	// 创建交易记录
	transaction := models.WalletTransaction{
		WalletID:        input.WalletID,
		TransactionType: input.TransactionType,
		CurrencyCode:    input.CurrencyCode,
		Amount:          input.Amount,
		Status:          "pending",
		Description:     input.Description,
		ReferenceID:     input.ReferenceID,
		ReferenceType:   input.ReferenceType,
		BalanceBefore:   balanceBefore,
		BalanceAfter:    balanceAfter,
		FeeAmount:       input.FeeAmount,
		FeeCurrency:     input.FeeCurrency,
		Metadata:        input.Metadata,
	}

	// 开始数据库事务
	tx := global.Db.Begin()

	// 保存交易记录
	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		log.Printf("创建交易记录失败: %v", err)
		return nil, fmt.Errorf("创建交易记录失败: %v", err)
	}

	// 更新余额
	balance.Amount = balanceAfter
	balance.LastUpdated = time.Now().Unix()

	if err := tx.Save(&balance).Error; err != nil {
		tx.Rollback()
		log.Printf("更新余额失败: %v", err)
		return nil, fmt.Errorf("更新余额失败: %v", err)
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		log.Printf("提交事务失败: %v", err)
		return nil, fmt.Errorf("提交事务失败: %v", err)
	}

	// 转换为 DTO 返回
	transactionDTO := &dto.WalletTransactionDTO{
		ID:              transaction.ID,
		WalletID:        transaction.WalletID,
		TransactionType: transaction.TransactionType,
		CurrencyCode:    transaction.CurrencyCode,
		Amount:          transaction.Amount,
		Status:          transaction.Status,
		Description:     transaction.Description,
		ReferenceID:     transaction.ReferenceID,
		ReferenceType:   transaction.ReferenceType,
		BalanceBefore:   transaction.BalanceBefore,
		BalanceAfter:    transaction.BalanceAfter,
		FeeAmount:       transaction.FeeAmount,
		FeeCurrency:     transaction.FeeCurrency,
		CreatedAt:       transaction.CreatedAt,
		UpdatedAt:       transaction.UpdatedAt,
	}

	return transactionDTO, nil
}

func GetBills(ctx *gin.Context) {
	userID, _, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 A: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var bills []models.WalletTransaction
	if err := global.Db.Where("user_id = ?", userID).Find(&bills).Error; err != nil {
		log.Printf("错误点 B: %v", err)
	}

	ctx.JSON(http.StatusOK, gin.H{"data": bills})

}