package input

import "github.com/shopspring/decimal"

// WalletInput 钱包创建和更新的输入模型
type WalletInput struct {
	WalletName        string `json:"wallet_name" binding:"required"`
	WalletDescription string `json:"wallet_description"`
	DefaultCurrency   string `json:"default_currency" binding:"required"`
}

// WalletBalanceInput 钱包余额创建的输入模型
type WalletBalanceInput struct {
	CurrencyCode string `json:"currency_code" binding:"required"`
	Amount       string `json:"amount" binding:"required"`
}

// 保持原有的输入模型以向后兼容
type Create_Update_WalletInput struct {
	WalletName      string `json:"wallet_name" binding:"required"`
	Description     string `json:"description"`
	DefaultCurrency string `json:"default_currency" binding:"required"`
}

// DepositInput 充值输入模型
type DepositInput struct {
	Amount       string `json:"amount" binding:"required"`
	CurrencyCode string `json:"currency_code" binding:"required"`
	Description  string `json:"description"`
}

// WithdrawInput 取出输入模型
type WithdrawInput struct {
	Amount       string `json:"amount" binding:"required"`
	CurrencyCode string `json:"currency_code" binding:"required"`
	Description  string `json:"description"`
}

// 保持原有的输入模型以向后兼容
type SaveMoneyInput struct {
	MoneyAmount  decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string          `json:"currency_code"`
	Description  string          `json:"description"`
}

type WithdrawMoneyInput struct {
	MoneyAmount  decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string          `json:"currency_code"`
	Description  string          `json:"description"`
}

type BillsInput struct {
	Genre        string          `json:"genre" binding:"required"`
	MoneyAmount  decimal.Decimal `json:"money_amount" binding:"required"`
	CurrencyCode string          `json:"currency_code"`
	Description  string          `json:"description"`
}

// ExchangeInput 货币兑换输入模型
type ExchangeInput struct {
	Amount       string `json:"amount" binding:"required"`
	FromCurrency string `json:"from_currency" binding:"required"`
	ToCurrency   string `json:"to_currency" binding:"required"`
	Description  string `json:"description"`
}

// TransferInput 转账输入模型
type TransferInput struct {
	ToUserID     uint   `json:"to_user_id"`
	ToUsername   string `json:"to_username"`
	Amount       string `json:"amount" binding:"required"`
	CurrencyCode string `json:"currency_code" binding:"required"`
	Description  string `json:"description"`
}
