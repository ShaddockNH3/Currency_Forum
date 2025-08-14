package dto

import (
	"exchangeapp/models"
	"time"

	"github.com/shopspring/decimal"
)

// WalletDTO 钱包信息 DTO
type WalletDTO struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Status   string `json:"status"`

	WalletName  string `json:"wallet_name"`
	Description string `json:"description"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	DefaultCurrency string `json:"default_currency"`

	// 余额信息
	Balances       []WalletBalanceDTO `json:"balances"`        // 所有币种余额
	DefaultBalance *WalletBalanceDTO  `json:"default_balance"` // 默认货币余额

	Bills []models.Bill `json:"bills"`
}

// WalletBalanceDTO 钱包余额 DTO
type WalletBalanceDTO struct {
	WalletID     uint            `json:"wallet_id"`
	CurrencyCode string          `json:"currency_code"`
	Amount       decimal.Decimal `json:"amount"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}

// TransactionResultDTO 交易结果 DTO
type TransactionResultDTO struct {
	TransactionID   string             `json:"transaction_id"`
	Type            string             `json:"type"` // "deposit", "withdraw", "exchange"
	Status          string             `json:"status"`
	Message         string             `json:"message"`
	UpdatedBalances []WalletBalanceDTO `json:"updated_balances"`
	CreatedAt       time.Time          `json:"created_at"`
}

// ExchangeResultDTO 货币兑换结果 DTO
type ExchangeResultDTO struct {
	TransactionID   string             `json:"transaction_id"`
	FromCurrency    string             `json:"from_currency"`
	ToCurrency      string             `json:"to_currency"`
	FromAmount      decimal.Decimal    `json:"from_amount"`
	ToAmount        decimal.Decimal    `json:"to_amount"`
	ExchangeRate    decimal.Decimal    `json:"exchange_rate"`
	Status          string             `json:"status"`
	Message         string             `json:"message"`
	UpdatedBalances []WalletBalanceDTO `json:"updated_balances"`
	CreatedAt       time.Time          `json:"created_at"`
}