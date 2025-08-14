package dto

import (
	"time"

	"github.com/shopspring/decimal"
)

// BillDTO 账单 DTO
type BillDTO struct {
	ID              uint            `json:"id"`
	WalletID        uint            `json:"wallet_id"`
	TransactionType string          `json:"transaction_type"`
	Amount          decimal.Decimal `json:"amount"`
	CurrencyCode    string          `json:"currency_code"`
	RelatedWalletID uint            `json:"related_wallet_id,omitempty"`
	Description     string          `json:"description"`
	Status          string          `json:"status"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

// BillListDTO 账单列表响应 DTO
type BillListDTO struct {
	Bills      []BillDTO `json:"bills"`
	Total      int       `json:"total"`
	Page       int       `json:"page"`
	PageSize   int       `json:"page_size"`
	TotalPages int       `json:"total_pages"`
}
