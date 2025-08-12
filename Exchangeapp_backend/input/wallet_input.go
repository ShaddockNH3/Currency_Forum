package input

import "github.com/shopspring/decimal"

type Create_Update_WalletInput struct {
	WalletName      string `json:"wallet_name" binding:"required"`
	Description     string `json:"description"`
	DefaultCurrency string `json:"default_currency" binding:"required"`
}

type SaveMoneyInput struct {
	MoneyAmount decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string `json:"currency_code"`
	Description string `json:"description"`
}

type WithdrawMoneyInput struct {
	MoneyAmount decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string `json:"currency_code"`
	Description string `json:"description"`
}

type BillsInput struct {
	Genre string `json:"genre" binding:"required"`
	MoneyAmount decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string `json:"currency_code"`
	Description string `json:"description"`
}

type ExchangeInput struct {
	MoneyAmount decimal.Decimal `json:"money_amount" binding:"required"`
	FromCurrency string `json:"from_currency" binding:"required"`
	ToCurrency string `json:"to_currency" binding:"required"`
	Description string `json:"description"`
}