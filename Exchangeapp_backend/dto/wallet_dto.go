package dto

import (
	"exchangeapp/models"
	"time"

)

// WalletDTO 钱包信息 DTO
type WalletDTO struct {
	UserID          uint            `json:"user_id"`
	Username        string          `json:"username"`
	Status          string          `json:"status"`

	WalletName      string          `json:"wallet_name"`
	Description     string          `json:"description"`

	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`

	DefaultCurrency string          `json:"default_currency"`

	Bills           []models.Bill   `json:"bills"`
}


