// Package models 定义数据模型，对应数据库表结构
package models

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// Wallet 钱包模型，存储用户钱包基本信息
// 业务规则：每个用户只能拥有一个钱包
type Wallet struct {
	gorm.Model      // 包含ID、CreatedAt、UpdatedAt、DeletedAt
	UserID     uint `gorm:"uniqueIndex"` // 钱包所有者的用户ID，唯一约束
	User       User // 关联用户信息

	WalletName        string // 钱包名称 (e.g., "我的小金库")
	WalletDescription string // 钱包描述
	WalletStatus      string // 钱包状态 (active/frozen)
	DefaultCurrency   string // 默认货币类型 (e.g., "JPY", "USD")

	Bills []Bill // 关联的交易记录
}

// WalletBalance 钱包余额模型，支持多币种余额
// 设计思路：一个钱包可以持有多种货币的余额
type WalletBalance struct {
	gorm.Model        // 包含ID、CreatedAt、UpdatedAt、DeletedAt
	WalletID   uint   // 所属钱包ID
	Wallet     Wallet // 关联钱包信息

	CurrencyCode string          `gorm:"size:10"`              // 货币代码 (e.g., "USD", "JPY", "CNY")
	Amount       decimal.Decimal `gorm:"type:decimal(20, 8);"` // 余额金额，支持高精度
}

// Bill 交易账单模型
type Bill struct {
	gorm.Model
	WalletID uint
	Wallet   Wallet

	TransactionType string          `gorm:"size:20"` // 交易类型：deposit(充值)/withdraw(取出)/exchange(兑换)/transfer(转账)
	Amount          decimal.Decimal `gorm:"type:decimal(20, 8);"`
	CurrencyCode    string          `gorm:"size:10"`

	RelatedWalletID uint // 关联钱包ID，用于转账等涉及对方的交易

	Description string // 交易描述 (e.g., "购买猫抓板", "收到CozyPaws的转账")
	Status      string // 交易状态：completed(完成)/pending(处理中)/failed(失败)
}
