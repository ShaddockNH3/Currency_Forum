package input

type WalletInput struct {
	WalletName        string `json:"wallet_name" binding:"required"`      // 钱包的名字 (e.g., "我的小金库")
	WalletDescription string `json:"wallet_description"`                  // 钱包的描述
	DefaultCurrency   string `json:"default_currency" binding:"required"` // 用户偏好的默认货币 (e.g., "JPY")
}
