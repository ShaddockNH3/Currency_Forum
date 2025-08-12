package models

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// Wallet 用户钱包模型
// 每个用户只能有一个钱包，通过 UserID 建立一对一关系
type Wallet struct {
	gorm.Model
	UserID uint `gorm:"uniqueIndex;not null" json:"user_id"` // 用户ID，唯一索引
	User   User `gorm:"foreignKey:UserID" json:"user"`       // 关联用户信息

	// 钱包状态
	Status    string `gorm:"default:'active';size:20" json:"status"` // 钱包状态：active(活跃), frozen(冻结), closed(关闭)
	IsEnabled bool   `gorm:"default:true" json:"is_enabled"`         // 是否启用

	// 钱包信息
	WalletName  string `gorm:"size:100" json:"wallet_name"` // 钱包名称
	Description string `gorm:"size:500" json:"description"` // 钱包描述

	// 统计信息
	TotalBalance    decimal.Decimal `gorm:"type:decimal(20,8);default:0" json:"total_balance"` // 总余额（默认货币）
	DefaultCurrency string          `gorm:"size:10;default:'USD'" json:"default_currency"`     // 默认货币代码
}

// WalletBalance 钱包余额模型
// 存储用户在不同货币下的余额信息
type WalletBalance struct {
	gorm.Model
	WalletID     uint            `gorm:"not null;index" json:"wallet_id"`                     // 钱包ID
	Wallet       Wallet          `gorm:"foreignKey:WalletID" json:"wallet"`                   // 关联钱包信息
	CurrencyCode string          `gorm:"size:10;not null;index" json:"currency_code"`         // 货币代码，如 "USD", "JPY", "EUR"
	Amount       decimal.Decimal `gorm:"type:decimal(20,8);default:0;not null" json:"amount"` // 该货币的余额数量

	// 余额状态
	IsLocked bool `gorm:"default:false" json:"is_locked"` // 是否锁定（冻结）

	// 汇率信息（相对于默认货币）
	ExchangeRate decimal.Decimal `gorm:"type:decimal(20,8);default:1" json:"exchange_rate"` // 兑换汇率
	LastUpdated  int64           `gorm:"default:0" json:"last_updated"`                     // 最后更新时间戳
}

// WalletTransaction 钱包交易记录模型
// 记录所有钱包相关的交易操作
type WalletTransaction struct {
	gorm.Model
	WalletID uint   `gorm:"not null;index" json:"wallet_id"`   // 钱包ID
	Wallet   Wallet `gorm:"foreignKey:WalletID" json:"wallet"` // 关联钱包信息

	// 交易基本信息
	TransactionType string          `gorm:"size:50;not null" json:"transaction_type"`  // 交易类型：deposit(充值), withdraw(提现), transfer(转账), exchange(兑换)
	CurrencyCode    string          `gorm:"size:10;not null" json:"currency_code"`     // 交易货币代码
	Amount          decimal.Decimal `gorm:"type:decimal(20,8);not null" json:"amount"` // 交易金额

	// 交易状态
	Status      string `gorm:"size:20;default:'pending'" json:"status"` // 交易状态：pending(待处理), completed(已完成), failed(失败), cancelled(已取消)
	Description string `gorm:"size:500" json:"description"`             // 交易描述

	// 关联信息
	ReferenceID   string `gorm:"size:100" json:"reference_id"`  // 关联ID（如订单ID、转账ID等）
	ReferenceType string `gorm:"size:50" json:"reference_type"` // 关联类型

	// 余额变化
	BalanceBefore decimal.Decimal `gorm:"type:decimal(20,8)" json:"balance_before"` // 交易前余额
	BalanceAfter  decimal.Decimal `gorm:"type:decimal(20,8)" json:"balance_after"`  // 交易后余额

	// 手续费
	FeeAmount   decimal.Decimal `gorm:"type:decimal(20,8);default:0" json:"fee_amount"` // 手续费金额
	FeeCurrency string          `gorm:"size:10" json:"fee_currency"`                    // 手续费货币

	// 元数据
	Metadata map[string]interface{} `gorm:"type:json" json:"metadata"` // 额外元数据
}

// TableName 指定表名
func (Wallet) TableName() string {
	return "wallets"
}

func (WalletBalance) TableName() string {
	return "wallet_balances"
}

func (WalletTransaction) TableName() string {
	return "wallet_transactions"
}
