package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

// WalletDTO 钱包信息 DTO
type WalletDTO struct {
	ID              uint            `json:"id"`
	UserID          uint            `json:"user_id"`
	Username        string          `json:"username"`
	Status          string          `json:"status"`
	IsEnabled       bool            `json:"is_enabled"`
	WalletName      string          `json:"wallet_name"`
	Description     string          `json:"description"`
	TotalBalance    decimal.Decimal `json:"total_balance"`
	DefaultCurrency string          `json:"default_currency"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// WalletBalanceDTO 钱包余额 DTO
type WalletBalanceDTO struct {
	ID           uint            `json:"id"`
	WalletID     uint            `json:"wallet_id"`
	CurrencyCode string          `json:"currency_code"`
	Amount       decimal.Decimal `json:"amount"`
	IsLocked     bool            `json:"is_locked"`
	ExchangeRate decimal.Decimal `json:"exchange_rate"`
	LastUpdated  int64           `json:"last_updated"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// WalletTransactionDTO 钱包交易记录 DTO
type WalletTransactionDTO struct {
	ID              uint            `json:"id"`
	WalletID        uint            `json:"wallet_id"`
	TransactionType string          `json:"transaction_type"`
	CurrencyCode    string          `json:"currency_code"`
	Amount          decimal.Decimal `json:"amount"`
	Status          string          `json:"status"`
	Description     string          `json:"description"`
	ReferenceID     string          `json:"reference_id"`
	ReferenceType   string          `json:"reference_type"`
	BalanceBefore   decimal.Decimal `json:"balance_before"`
	BalanceAfter    decimal.Decimal `json:"balance_after"`
	FeeAmount       decimal.Decimal `json:"fee_amount"`
	FeeCurrency     string          `json:"fee_currency"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// WalletSummaryDTO 钱包汇总信息 DTO
type WalletSummaryDTO struct {
	Wallet        WalletDTO          `json:"wallet"`
	Balances      []WalletBalanceDTO `json:"balances"`
	TotalAssets   decimal.Decimal    `json:"total_assets"`   // 总资产（默认货币）
	CurrencyCount int                `json:"currency_count"` // 持有货币种类数量
	LastActivity  time.Time          `json:"last_activity"`  // 最后活动时间
}

// CreateWalletRequest 创建钱包请求
type CreateWalletRequest struct {
	WalletName      string `json:"wallet_name" binding:"required"`
	Description     string `json:"description"`
	DefaultCurrency string `json:"default_currency" binding:"required"`
}

// UpdateWalletRequest 更新钱包请求
type UpdateWalletRequest struct {
	WalletName      string `json:"wallet_name"`
	Description     string `json:"description"`
	DefaultCurrency string `json:"default_currency"`
	Status          string `json:"status"`
	IsEnabled       *bool  `json:"is_enabled"`
}

// WalletTransactionRequest 钱包交易请求
type WalletTransactionRequest struct {
	TransactionType string          `json:"transaction_type" binding:"required"`
	CurrencyCode    string          `json:"currency_code" binding:"required"`
	Amount          decimal.Decimal `json:"amount" binding:"required"`
	Description     string          `json:"description"`
	ReferenceID     string          `json:"reference_id"`
	ReferenceType   string          `json:"reference_type"`
	FeeAmount       decimal.Decimal `json:"fee_amount"`
	FeeCurrency     string          `json:"fee_currency"`
}

// WalletBalanceRequest 钱包余额操作请求
type WalletBalanceRequest struct {
	CurrencyCode string          `json:"currency_code" binding:"required"`
	Amount       decimal.Decimal `json:"amount" binding:"required"`
	Operation    string          `json:"operation" binding:"required"` // add(增加), subtract(减少), set(设置)
	Description  string          `json:"description"`
}

// WalletQueryRequest 钱包查询请求
type WalletQueryRequest struct {
	Page         int    `form:"page"`
	PageSize     int    `form:"page_size"`
	CurrencyCode string `form:"currency_code"`
	Status       string `form:"status"`
	DateFrom     string `form:"date_from"`
	DateTo       string `form:"date_to"`
}

// WalletTransactionPageDTO 钱包交易分页响应
type WalletTransactionPageDTO struct {
	Page       int                    `json:"page"`
	PageSize   int                    `json:"page_size"`
	TotalItems int64                  `json:"total_items"`
	TotalPages int                    `json:"total_pages"`
	Items      []WalletTransactionDTO `json:"items"`
}
