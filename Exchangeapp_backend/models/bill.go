// Package models 定义数据模型，对应数据库表结构
package models

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// Bill 账单模型，记录所有的交易流水
// 也可以称为Transaction，用于追踪钱包的所有资金变动
type Bill struct {
	gorm.Model        // 包含ID、CreatedAt、UpdatedAt、DeletedAt
	WalletID   uint   // 所属钱包ID
	Wallet     Wallet // 关联钱包信息

	TransactionType string // 交易类型：deposit(存款)/withdraw(取款)/transfer_out(转出)/transfer_in(转入)/exchange_out(兑换出)/exchange_in(兑换入)

	Amount       decimal.Decimal `gorm:"type:decimal(20, 8);"` // 交易金额，支持高精度
	CurrencyCode string          // 交易货币代码

	RelatedWalletID uint // 关联钱包ID，用于转账等涉及对方的交易

	Description string // 交易描述 (e.g., "购买猫抓板", "收到CozyPaws的转账")
	Status      string // 交易状态：completed(完成)/pending(处理中)/failed(失败)
}
