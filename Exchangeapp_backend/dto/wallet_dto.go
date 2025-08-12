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

