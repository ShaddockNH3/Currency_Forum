package wallet_controllers

import (
	"errors"
	"exchangeapp/global"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/utils"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

/*
	大概的思路是先获取用户信息，然后先看看汇率有没有在数据库里，没有就不管他
	然后看看用户的钱包里有没有足够的钱，没有就返回错误
	后面就是创建交易记录，然后更新钱包余额
	最后返回成功信息
*/

func Exchange(ctx *gin.Context) {
	userID, username, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 A: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input input.ExchangeInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 B: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fromCurrency := input.FromCurrency
	toCurrency := input.ToCurrency

	if fromCurrency == toCurrency {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "from_currency和to_currency不能相同"})
		return
	}

	// 获取汇率
	exchangeRate, err := getExchangeRate(fromCurrency, toCurrency)
	if err != nil {
		log.Printf("错误点 C: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "汇率不存在，无法进行兑换"})
		return
	}

	// 计算兑换后的金额
	toAmount := input.MoneyAmount.Mul(decimal.NewFromFloat(exchangeRate))

	// 获取用户钱包
	var wallet models.Wallet
	if err := global.Db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "用户钱包不存在"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "获取钱包信息失败"})
		return
	}

	// 检查源货币余额是否足够
	var fromBalance models.WalletBalance
	err = global.Db.Where("wallet_id = ? AND currency_code = ?", wallet.ID, fromCurrency).First(&fromBalance).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "源货币余额记录不存在"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "查询源货币余额失败"})
		return
	}

	if fromBalance.Amount.LessThan(input.MoneyAmount) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "源货币余额不足"})
		return
	}

	// 开始数据库事务
	tx := global.Db.Begin()

	// 第一步：从源货币扣除金额
	fromBalanceBefore := fromBalance.Amount
	fromBalanceAfter := fromBalance.Amount.Sub(input.MoneyAmount)

	// 更新源货币余额
	fromBalance.Amount = fromBalanceAfter
	fromBalance.LastUpdated = time.Now().Unix()
	if err := tx.Save(&fromBalance).Error; err != nil {
		tx.Rollback()
		log.Printf("更新源货币余额失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新源货币余额失败"})
		return
	}

	// 第二步：向目标货币添加兑换后的金额
	var toBalance models.WalletBalance
	err = tx.Where("wallet_id = ? AND currency_code = ?", wallet.ID, toCurrency).First(&toBalance).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// 如果目标货币余额记录不存在，创建新的
			toBalance = models.WalletBalance{
				WalletID:     wallet.ID,
				CurrencyCode: toCurrency,
				Amount:       decimal.Zero,
				IsLocked:     false,
				ExchangeRate: decimal.NewFromInt(1),
				LastUpdated:  time.Now().Unix(),
			}
		} else {
			tx.Rollback()
			log.Printf("查询目标货币余额失败: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "查询目标货币余额失败"})
			return
		}
	}

	toBalanceBefore := toBalance.Amount
	toBalanceAfter := toBalance.Amount.Add(toAmount)

	// 更新目标货币余额
	toBalance.Amount = toBalanceAfter
	toBalance.LastUpdated = time.Now().Unix()
	if err := tx.Save(&toBalance).Error; err != nil {
		tx.Rollback()
		log.Printf("更新目标货币余额失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "更新目标货币余额失败"})
		return
	}

	// 第三步：创建源货币的交易记录（扣除）
	fromTransaction := models.WalletTransaction{
		WalletID:        wallet.ID,
		TransactionType: "exchange",
		CurrencyCode:    fromCurrency,
		Amount:          input.MoneyAmount,
		Status:          "completed",
		Description:     input.Description + " (兑换扣除)",
		ReferenceType:   "currency_exchange",
		ReferenceID:     "",
		BalanceBefore:   fromBalanceBefore,
		BalanceAfter:    fromBalanceAfter,
		FeeAmount:       decimal.Zero,
		FeeCurrency:     fromCurrency,
		Metadata: map[string]interface{}{
			"user_id":       userID,
			"username":      username,
			"operation":     "exchange_from",
			"to_currency":   toCurrency,
			"exchange_rate": exchangeRate,
			"to_amount":     toAmount.String(),
		},
	}

	if err := tx.Create(&fromTransaction).Error; err != nil {
		tx.Rollback()
		log.Printf("创建源货币交易记录失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "创建源货币交易记录失败"})
		return
	}

	// 第四步：创建目标货币的交易记录（增加）
	toTransaction := models.WalletTransaction{
		WalletID:        wallet.ID,
		TransactionType: "exchange",
		CurrencyCode:    toCurrency,
		Amount:          toAmount,
		Status:          "completed",
		Description:     input.Description + " (兑换获得)",
		ReferenceType:   "currency_exchange",
		ReferenceID:     "",
		BalanceBefore:   toBalanceBefore,
		BalanceAfter:    toBalanceAfter,
		FeeAmount:       decimal.Zero,
		FeeCurrency:     toCurrency,
		Metadata: map[string]interface{}{
			"user_id":       userID,
			"username":      username,
			"operation":     "exchange_to",
			"from_currency": fromCurrency,
			"exchange_rate": exchangeRate,
			"from_amount":   input.MoneyAmount.String(),
		},
	}

	if err := tx.Create(&toTransaction).Error; err != nil {
		tx.Rollback()
		log.Printf("创建目标货币交易记录失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "创建目标货币交易记录失败"})
		return
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		log.Printf("提交兑换事务失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "提交兑换事务失败"})
		return
	}

	// 返回成功信息
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "货币兑换成功",
		"data": gin.H{
			"from_currency": fromCurrency,
			"from_amount":   input.MoneyAmount.String(),
			"to_currency":   toCurrency,
			"to_amount":     toAmount.String(),
			"exchange_rate": exchangeRate,
			"from_balance":  fromBalanceAfter.String(),
			"to_balance":    toBalanceAfter.String(),
			"transactions": []gin.H{
				{
					"id":       fromTransaction.ID,
					"type":     "扣除",
					"currency": fromCurrency,
					"amount":   input.MoneyAmount.String(),
				},
				{
					"id":       toTransaction.ID,
					"type":     "获得",
					"currency": toCurrency,
					"amount":   toAmount.String(),
				},
			},
		},
	})
}

func getExchangeRate(fromCurrency string, toCurrency string) (float64, error) {
	var exchangeRate models.ExchangeRate
	// 1. 先正常查询 A -> B
	err := global.Db.Where("from_currency = ? AND to_currency = ?", fromCurrency, toCurrency).First(&exchangeRate).Error
	if err == nil {
		return exchangeRate.Rate, nil // 找到了，直接返回
	}

	// 2. 如果没找到，尝试查询 B -> A
	if errors.Is(err, gorm.ErrRecordNotFound) {
		err_inv := global.Db.Where("from_currency = ? AND to_currency = ?", toCurrency, fromCurrency).First(&exchangeRate).Error
		if err_inv == nil {
			// 找到了反向汇率！我们返回它的倒数
			return 1.0 / exchangeRate.Rate, nil
		}
	}

	// 3. 如果正向反向都找不到，那就是真的没有
	return 0, errors.New("汇率不存在")
}
