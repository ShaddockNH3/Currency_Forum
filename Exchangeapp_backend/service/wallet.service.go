// Package service 业务逻辑层，处理钱包相关的业务规则和数据验证
package service

import (
	"errors"
	"exchangeapp/dto"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/repository"
	"fmt"
	"log"
	"time"

	"github.com/shopspring/decimal"
)

type WalletService interface {
	CreateWallet(userID uint, input *input.WalletInput) (*dto.WalletDTO, error)
	GetWalletByUserID(userID uint) (*dto.WalletDTO, error)
	GetWalletIDByUserID(userID uint) (uint, error)
	UpdateWalletMessage(userID uint, input *input.WalletInput) (*dto.WalletDTO, error)
	CreateBalance(walletID uint, currencyCode string, amount decimal.Decimal) (*dto.WalletBalanceDTO, error)
	GetAllBalancesByWalletID(walletID uint) ([]dto.WalletBalanceDTO, error)
	GetBalanceByWalletIDAndCurrency(walletID uint, currencyCode string) (*dto.WalletBalanceDTO, error)
	HasWalletBalance(walletID uint, currencyCode string) (bool, error)

	// 新增交易功能
	Deposit(userID uint, input *input.DepositInput) (*dto.TransactionResultDTO, error)
	Withdraw(userID uint, input *input.WithdrawInput) (*dto.TransactionResultDTO, error)
	Exchange(userID uint, input *input.ExchangeInput) (*dto.ExchangeResultDTO, error)
}

type walletService struct {
	walletRepo       repository.WalletRepository
	userRepo         repository.UserRepository
	exchangeRateRepo repository.ExchangeRateRepository
	billRepo         repository.BillRepository
}

// 在 New 函数里，把所有需要的 Repository 都注入进来
func NewWalletService(walletRepo repository.WalletRepository, userRepo repository.UserRepository, exchangeRateRepo repository.ExchangeRateRepository, billRepo repository.BillRepository) WalletService {
	return &walletService{
		walletRepo:       walletRepo,
		userRepo:         userRepo,
		exchangeRateRepo: exchangeRateRepo,
		billRepo:         billRepo,
	}
}

// CreateWallet 创建用户钱包
// 业务规则：每个用户只能创建一个钱包
func (s *walletService) CreateWallet(userID uint, input *input.WalletInput) (*dto.WalletDTO, error) {
	log.Printf("[WalletService] 开始创建钱包，用户ID: %d，钱包名: %s", userID, input.WalletName)

	// 检查用户是否已经有钱包
	existingWallet, _ := s.walletRepo.FindByUserID(userID)
	if existingWallet != nil {
		log.Printf("[WalletService] 用户已存在钱包，用户ID: %d", userID)
		return nil, errors.New("该用户已存在钱包")
	}

	// 构建钱包模型
	wallet := &models.Wallet{
		UserID:            userID,
		WalletName:        input.WalletName,
		WalletDescription: input.WalletDescription,
		WalletStatus:      "active",
		DefaultCurrency:   input.DefaultCurrency,
	}
	log.Printf("[WalletService] 钱包数据准备完成，默认货币: %s", input.DefaultCurrency)

	// 调用仓库层创建钱包
	if err := s.walletRepo.Create(wallet); err != nil {
		log.Printf("[WalletService] 创建钱包失败: %v", err)
		return nil, err
	}
	log.Printf("[WalletService] 钱包创建成功，钱包ID: %d", wallet.ID)

	// 自动创建默认货币余额（金额为0）
	defaultBalance := &models.WalletBalance{
		WalletID:     wallet.ID,
		CurrencyCode: input.DefaultCurrency,
		Amount:       decimal.NewFromInt(0),
	}

	if err := s.walletRepo.CreateBalance(defaultBalance); err != nil {
		log.Printf("[WalletService] 创建默认货币余额失败: %v", err)
		// 这里不返回错误，因为钱包已经创建成功了
	} else {
		log.Printf("[WalletService] 默认货币余额创建成功，货币: %s", input.DefaultCurrency)
	}

	// 创建钱包创建账单记录
	s.createBill(wallet.ID, "wallet_create", decimal.NewFromInt(0), input.DefaultCurrency,
		fmt.Sprintf("创建钱包: %s", input.WalletName))

	// 获取用户信息用于返回DTO
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取用户信息失败，使用默认用户信息: %v", err)
		user = &models.User{Username: "未知用户"}
	}

	// 获取刚创建的钱包余额（包含默认货币余额）
	balances, err := s.walletRepo.FindBalancesByWalletID(wallet.ID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包余额失败: %v", err)
		// 如果获取余额失败，至少包含我们刚创建的默认余额
		balances = []models.WalletBalance{*defaultBalance}
	}

	log.Printf("[WalletService] 钱包创建流程完成，用户ID: %d，余额记录数: %d", userID, len(balances))
	return convertWalletToDTO(wallet, user, balances), nil
}

// GetWalletByUserID 获取用户钱包信息（包含余额）
func (s *walletService) GetWalletByUserID(userID uint) (*dto.WalletDTO, error) {
	log.Printf("[WalletService] 开始获取钱包信息，用户ID: %d", userID)

	// 调用仓库层查找钱包（已预加载用户信息）
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包失败: %v", err)
		return nil, err
	}

	// 获取钱包的所有余额
	balances, err := s.walletRepo.FindBalancesByWalletID(wallet.ID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包余额失败: %v", err)
		// 如果获取余额失败，返回空余额数组而不是错误
		balances = []models.WalletBalance{}
	}

	log.Printf("[WalletService] 钱包信息获取成功，钱包ID: %d，余额记录数: %d", wallet.ID, len(balances))
	return convertWalletToDTO(wallet, &wallet.User, balances), nil
}

// GetWalletIDByUserID 根据用户ID获取钱包ID
func (s *walletService) GetWalletIDByUserID(userID uint) (uint, error) {
	log.Printf("[WalletService] 开始获取钱包ID，用户ID: %d", userID)

	// 调用仓库层查找钱包
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包ID失败: %v", err)
		return 0, err
	}

	log.Printf("[WalletService] 钱包ID获取成功，用户ID: %d，钱包ID: %d", userID, wallet.ID)
	return wallet.ID, nil
}

// UpdateWalletMessage 更新钱包信息
// 包括钱包名称、描述和默认货币
func (s *walletService) UpdateWalletMessage(userID uint, input *input.WalletInput) (*dto.WalletDTO, error) {
	log.Printf("[WalletService] 开始更新钱包信息，用户ID: %d，钱包名: %s", userID, input.WalletName)

	// 查找用户的钱包
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 查找钱包失败: %v", err)
		return nil, err
	}

	// 检查默认货币是否有变更
	oldDefaultCurrency := wallet.DefaultCurrency
	currencyChanged := oldDefaultCurrency != input.DefaultCurrency
	oldWalletName := wallet.WalletName

	// 更新钱包信息
	wallet.WalletName = input.WalletName
	wallet.WalletDescription = input.WalletDescription
	wallet.DefaultCurrency = input.DefaultCurrency
	log.Printf("[WalletService] 钱包信息更新准备完成")

	// 调用仓库层保存更新
	if err := s.walletRepo.UpdateWalletMessage(wallet); err != nil {
		log.Printf("[WalletService] 更新钱包失败: %v", err)
		return nil, err
	}

	// 如果默认货币发生变更，检查并创建新的货币余额
	if currencyChanged {
		log.Printf("[WalletService] 默认货币已变更：%s -> %s", oldDefaultCurrency, input.DefaultCurrency)

		// 检查新的默认货币是否已存在余额
		hasBalance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(wallet.ID, input.DefaultCurrency)
		if err != nil && hasBalance == nil {
			// 货币余额不存在，创建新的默认货币余额（金额为0）
			newBalance := &models.WalletBalance{
				WalletID:     wallet.ID,
				CurrencyCode: input.DefaultCurrency,
				Amount:       decimal.NewFromInt(0),
			}

			if err := s.walletRepo.CreateBalance(newBalance); err != nil {
				log.Printf("[WalletService] 创建新默认货币余额失败: %v", err)
				// 不返回错误，因为钱包更新已经成功
			} else {
				log.Printf("[WalletService] 新默认货币余额创建成功，货币: %s", input.DefaultCurrency)
			}
		} else {
			log.Printf("[WalletService] 新默认货币余额已存在，跳过创建，货币: %s", input.DefaultCurrency)
		}
	}

	// 获取更新后的钱包所有余额
	balances, err := s.walletRepo.FindBalancesByWalletID(wallet.ID)
	if err != nil {
		log.Printf("[WalletService] 获取更新后钱包余额失败: %v", err)
		// 如果获取余额失败，返回空余额数组而不是错误
		balances = []models.WalletBalance{}
	}

	// 创建钱包更新账单记录
	updateDescription := "更新钱包信息"
	if oldWalletName != input.WalletName {
		updateDescription += fmt.Sprintf("，钱包名: %s -> %s", oldWalletName, input.WalletName)
	}
	if currencyChanged {
		updateDescription += fmt.Sprintf("，默认货币: %s -> %s", oldDefaultCurrency, input.DefaultCurrency)
	}
	s.createBill(wallet.ID, "wallet_update", decimal.NewFromInt(0), input.DefaultCurrency, updateDescription)

	log.Printf("[WalletService] 钱包信息更新成功，钱包ID: %d，余额记录数: %d", wallet.ID, len(balances))
	return convertWalletToDTO(wallet, &wallet.User, balances), nil
}

// CreateBalance 创建钱包余额
func (s *walletService) CreateBalance(walletID uint, currencyCode string, amount decimal.Decimal) (*dto.WalletBalanceDTO, error) {
	log.Printf("[WalletService] 开始创建钱包余额，钱包ID: %d，货币: %s，金额: %s", walletID, currencyCode, amount.String())

	// 检查钱包是否存在
	_, err := s.walletRepo.FindByID(walletID)
	if err != nil {
		log.Printf("[WalletService] 钱包不存在，钱包ID: %d", walletID)
		return nil, errors.New("钱包不存在")
	}

	// 检查是否已存在该币种的余额
	existingBalance, _ := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, currencyCode)
	if existingBalance != nil {
		log.Printf("[WalletService] 该币种余额已存在，钱包ID: %d，货币: %s", walletID, currencyCode)
		return nil, errors.New("该币种余额已存在")
	}

	// 构建余额模型
	balance := &models.WalletBalance{
		WalletID:     walletID,
		CurrencyCode: currencyCode,
		Amount:       amount,
	}

	// 调用仓库层创建余额
	if err := s.walletRepo.CreateBalance(balance); err != nil {
		log.Printf("[WalletService] 创建余额失败: %v", err)
		return nil, err
	}

	log.Printf("[WalletService] 余额创建成功，钱包ID: %d，货币: %s", walletID, currencyCode)
	return convertBalanceToDTO(balance), nil
}

// GetAllBalancesByWalletID 获取钱包所有币种余额
func (s *walletService) GetAllBalancesByWalletID(walletID uint) ([]dto.WalletBalanceDTO, error) {
	log.Printf("[WalletService] 开始获取钱包所有余额，钱包ID: %d", walletID)

	// 检查钱包是否存在
	_, err := s.walletRepo.FindByID(walletID)
	if err != nil {
		log.Printf("[WalletService] 钱包不存在，钱包ID: %d", walletID)
		return nil, errors.New("钱包不存在")
	}

	// 获取所有余额
	balances, err := s.walletRepo.FindBalancesByWalletID(walletID)
	if err != nil {
		log.Printf("[WalletService] 获取余额失败: %v", err)
		return nil, err
	}

	// 转换为DTO
	var balanceDTOs []dto.WalletBalanceDTO
	for _, balance := range balances {
		balanceDTOs = append(balanceDTOs, *convertBalanceToDTO(&balance))
	}

	log.Printf("[WalletService] 余额获取成功，共 %d 条记录", len(balanceDTOs))
	return balanceDTOs, nil
}

// GetBalanceByWalletIDAndCurrency 获取钱包特定币种余额
func (s *walletService) GetBalanceByWalletIDAndCurrency(walletID uint, currencyCode string) (*dto.WalletBalanceDTO, error) {
	log.Printf("[WalletService] 开始获取钱包特定币种余额，钱包ID: %d，货币: %s", walletID, currencyCode)

	// 调用仓库层查找余额
	balance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, currencyCode)
	if err != nil {
		log.Printf("[WalletService] 获取余额失败: %v", err)
		return nil, err
	}

	log.Printf("[WalletService] 余额获取成功，金额: %s %s", balance.Amount.String(), balance.CurrencyCode)
	return convertBalanceToDTO(balance), nil
}

func (s *walletService) HasWalletBalance(walletID uint, currencyCode string) (bool, error) {
	return s.walletRepo.HasWalletBalance(walletID, currencyCode)
}

// 创建一个私有的辅助函数，专门负责将 model 转换为 DTO
func convertWalletToDTO(wallet *models.Wallet, user *models.User, balances []models.WalletBalance) *dto.WalletDTO {
	// 转换所有余额
	var balanceDTOs []dto.WalletBalanceDTO
	var defaultBalance *dto.WalletBalanceDTO

	for _, balance := range balances {
		balanceDTO := convertBalanceToDTO(&balance)
		balanceDTOs = append(balanceDTOs, *balanceDTO)

		// 找到默认货币的余额
		if balance.CurrencyCode == wallet.DefaultCurrency {
			defaultBalance = balanceDTO
		}
	}

	return &dto.WalletDTO{
		UserID:          wallet.UserID,
		Username:        user.Username,
		Status:          wallet.WalletStatus,
		WalletName:      wallet.WalletName,
		Description:     wallet.WalletDescription,
		DefaultCurrency: wallet.DefaultCurrency,
		CreatedAt:       wallet.CreatedAt,
		UpdatedAt:       wallet.UpdatedAt,
		Balances:        balanceDTOs,
		DefaultBalance:  defaultBalance,
		// Bills:          // Bills 的转换会更复杂一些，可以先留空
	}
}

// convertBalanceToDTO 将余额模型转换为DTO
func convertBalanceToDTO(balance *models.WalletBalance) *dto.WalletBalanceDTO {
	return &dto.WalletBalanceDTO{
		WalletID:     balance.WalletID,
		CurrencyCode: balance.CurrencyCode,
		Amount:       balance.Amount,
		CreatedAt:    balance.CreatedAt,
		UpdatedAt:    balance.UpdatedAt,
	}
}

// Deposit 充值功能
func (s *walletService) Deposit(userID uint, input *input.DepositInput) (*dto.TransactionResultDTO, error) {
	log.Printf("[WalletService] 开始处理充值，用户ID: %d，金额: %s %s", userID, input.Amount, input.CurrencyCode)

	// 获取钱包ID
	walletID, err := s.GetWalletIDByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包ID失败: %v", err)
		return nil, errors.New("钱包不存在")
	}

	// 解析金额
	amount, err := decimal.NewFromString(input.Amount)
	if err != nil || amount.LessThanOrEqual(decimal.Zero) {
		log.Printf("[WalletService] 金额格式错误或金额必须大于0: %s", input.Amount)
		return nil, errors.New("金额格式错误或金额必须大于0")
	}

	// 检查是否存在该币种余额，如果不存在则创建
	balance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, input.CurrencyCode)
	if err != nil {
		// 余额不存在，创建新的余额记录
		log.Printf("[WalletService] 币种%s余额不存在，创建新余额", input.CurrencyCode)
		balance = &models.WalletBalance{
			WalletID:     walletID,
			CurrencyCode: input.CurrencyCode,
			Amount:       amount,
		}
		if err := s.walletRepo.CreateBalance(balance); err != nil {
			log.Printf("[WalletService] 创建余额失败: %v", err)
			return nil, err
		}
	} else {
		// 余额存在，增加金额
		balance.Amount = balance.Amount.Add(amount)
		if err := s.walletRepo.UpdateBalance(balance); err != nil {
			log.Printf("[WalletService] 更新余额失败: %v", err)
			return nil, err
		}
	}

	// 获取更新后的所有余额
	balances, _ := s.walletRepo.FindBalancesByWalletID(walletID)
	balanceDTOs := make([]dto.WalletBalanceDTO, 0, len(balances))
	for _, bal := range balances {
		balanceDTOs = append(balanceDTOs, *convertBalanceToDTO(&bal))
	}

	// 创建充值账单记录
	description := input.Description
	if description == "" {
		description = fmt.Sprintf("充值 %s %s", input.Amount, input.CurrencyCode)
	}
	s.createBill(walletID, "deposit", amount, input.CurrencyCode, description)

	log.Printf("[WalletService] 充值成功，用户ID: %d，金额: %s %s", userID, input.Amount, input.CurrencyCode)
	return &dto.TransactionResultDTO{
		TransactionID:   generateTransactionID(),
		Type:            "deposit",
		Status:          "success",
		Message:         "充值成功",
		UpdatedBalances: balanceDTOs,
		CreatedAt:       time.Now(),
	}, nil
}

// Withdraw 取出功能
func (s *walletService) Withdraw(userID uint, input *input.WithdrawInput) (*dto.TransactionResultDTO, error) {
	log.Printf("[WalletService] 开始处理取出，用户ID: %d，金额: %s %s", userID, input.Amount, input.CurrencyCode)

	// 获取钱包ID
	walletID, err := s.GetWalletIDByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包ID失败: %v", err)
		return nil, errors.New("钱包不存在")
	}

	// 解析金额
	amount, err := decimal.NewFromString(input.Amount)
	if err != nil || amount.LessThanOrEqual(decimal.Zero) {
		log.Printf("[WalletService] 金额格式错误或金额必须大于0: %s", input.Amount)
		return nil, errors.New("金额格式错误或金额必须大于0")
	}

	// 获取现有余额
	balance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, input.CurrencyCode)
	if err != nil {
		log.Printf("[WalletService] 币种%s余额不存在", input.CurrencyCode)
		return nil, errors.New("余额不足，该币种余额不存在")
	}

	// 检查余额是否充足
	if balance.Amount.LessThan(amount) {
		log.Printf("[WalletService] 余额不足，当前余额: %s，尝试取出: %s", balance.Amount.String(), amount.String())
		return nil, errors.New("余额不足")
	}

	// 扣减余额
	balance.Amount = balance.Amount.Sub(amount)
	if err := s.walletRepo.UpdateBalance(balance); err != nil {
		log.Printf("[WalletService] 更新余额失败: %v", err)
		return nil, err
	}

	// 获取更新后的所有余额
	balances, _ := s.walletRepo.FindBalancesByWalletID(walletID)
	balanceDTOs := make([]dto.WalletBalanceDTO, 0, len(balances))
	for _, bal := range balances {
		balanceDTOs = append(balanceDTOs, *convertBalanceToDTO(&bal))
	}

	// 创建取出账单记录
	description := input.Description
	if description == "" {
		description = fmt.Sprintf("取出 %s %s", input.Amount, input.CurrencyCode)
	}
	s.createBill(walletID, "withdraw", amount, input.CurrencyCode, description)

	log.Printf("[WalletService] 取出成功，用户ID: %d，金额: %s %s", userID, input.Amount, input.CurrencyCode)
	return &dto.TransactionResultDTO{
		TransactionID:   generateTransactionID(),
		Type:            "withdraw",
		Status:          "success",
		Message:         "取出成功",
		UpdatedBalances: balanceDTOs,
		CreatedAt:       time.Now(),
	}, nil
}

// Exchange 货币兑换功能
func (s *walletService) Exchange(userID uint, input *input.ExchangeInput) (*dto.ExchangeResultDTO, error) {
	log.Printf("[WalletService] 开始处理货币兑换，用户ID: %d，%s -> %s，金额: %s",
		userID, input.FromCurrency, input.ToCurrency, input.Amount)

	// 基本验证
	if input.FromCurrency == input.ToCurrency {
		return nil, errors.New("源货币和目标货币不能相同")
	}

	// 获取钱包ID
	walletID, err := s.GetWalletIDByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包ID失败: %v", err)
		return nil, errors.New("钱包不存在")
	}

	// 解析金额
	fromAmount, err := decimal.NewFromString(input.Amount)
	if err != nil || fromAmount.LessThanOrEqual(decimal.Zero) {
		log.Printf("[WalletService] 金额格式错误或金额必须大于0: %s", input.Amount)
		return nil, errors.New("金额格式错误或金额必须大于0")
	}

	// 获取源货币余额
	fromBalance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, input.FromCurrency)
	if err != nil {
		log.Printf("[WalletService] 源货币%s余额不存在", input.FromCurrency)
		return nil, errors.New("源货币余额不存在")
	}

	// 检查余额是否充足
	if fromBalance.Amount.LessThan(fromAmount) {
		log.Printf("[WalletService] 源货币余额不足，当前余额: %s，尝试兑换: %s",
			fromBalance.Amount.String(), fromAmount.String())
		return nil, errors.New("源货币余额不足")
	}

	// 获取汇率
	exchangeRate, err := s.getExchangeRate(input.FromCurrency, input.ToCurrency)
	if err != nil {
		log.Printf("[WalletService] 获取汇率失败: %v", err)
		return nil, errors.New("无法获取汇率")
	}

	// 计算目标金额
	toAmount := fromAmount.Mul(exchangeRate)

	// 扣减源货币余额
	fromBalance.Amount = fromBalance.Amount.Sub(fromAmount)
	if err := s.walletRepo.UpdateBalance(fromBalance); err != nil {
		log.Printf("[WalletService] 更新源货币余额失败: %v", err)
		return nil, err
	}

	// 获取或创建目标货币余额
	toBalance, err := s.walletRepo.FindBalanceByWalletIDAndCurrency(walletID, input.ToCurrency)
	if err != nil {
		// 目标货币余额不存在，创建新的余额记录
		log.Printf("[WalletService] 目标货币%s余额不存在，创建新余额", input.ToCurrency)
		toBalance = &models.WalletBalance{
			WalletID:     walletID,
			CurrencyCode: input.ToCurrency,
			Amount:       toAmount,
		}
		if err := s.walletRepo.CreateBalance(toBalance); err != nil {
			log.Printf("[WalletService] 创建目标货币余额失败: %v", err)
			// 回滚源货币余额
			fromBalance.Amount = fromBalance.Amount.Add(fromAmount)
			s.walletRepo.UpdateBalance(fromBalance)
			return nil, err
		}
	} else {
		// 目标货币余额存在，增加金额
		toBalance.Amount = toBalance.Amount.Add(toAmount)
		if err := s.walletRepo.UpdateBalance(toBalance); err != nil {
			log.Printf("[WalletService] 更新目标货币余额失败: %v", err)
			// 回滚源货币余额
			fromBalance.Amount = fromBalance.Amount.Add(fromAmount)
			s.walletRepo.UpdateBalance(fromBalance)
			return nil, err
		}
	}

	// 获取更新后的所有余额
	balances, _ := s.walletRepo.FindBalancesByWalletID(walletID)
	balanceDTOs := make([]dto.WalletBalanceDTO, 0, len(balances))
	for _, bal := range balances {
		balanceDTOs = append(balanceDTOs, *convertBalanceToDTO(&bal))
	}

	// 创建货币兑换账单记录（创建两条记录：扣减源货币 + 增加目标货币）
	description := input.Description
	if description == "" {
		description = fmt.Sprintf("兑换 %s %s -> %s %s (汇率: %s)",
			fromAmount.String(), input.FromCurrency,
			toAmount.String(), input.ToCurrency,
			exchangeRate.String())
	}

	// 扣减源货币的账单
	s.createBill(walletID, "exchange_out", fromAmount, input.FromCurrency,
		fmt.Sprintf("兑换支出: %s", description))

	// 增加目标货币的账单
	s.createBill(walletID, "exchange_in", toAmount, input.ToCurrency,
		fmt.Sprintf("兑换收入: %s", description))

	log.Printf("[WalletService] 货币兑换成功，用户ID: %d，%s %s -> %s %s",
		userID, fromAmount.String(), input.FromCurrency, toAmount.String(), input.ToCurrency)

	return &dto.ExchangeResultDTO{
		TransactionID:   generateTransactionID(),
		FromCurrency:    input.FromCurrency,
		ToCurrency:      input.ToCurrency,
		FromAmount:      fromAmount,
		ToAmount:        toAmount,
		ExchangeRate:    exchangeRate,
		Status:          "success",
		Message:         "货币兑换成功",
		UpdatedBalances: balanceDTOs,
		CreatedAt:       time.Now(),
	}, nil
}

// getExchangeRate 获取汇率
func (s *walletService) getExchangeRate(fromCurrency, toCurrency string) (decimal.Decimal, error) {
	// 先尝试直接查找汇率
	rates, err := s.exchangeRateRepo.FindAll()
	if err != nil {
		log.Printf("[WalletService] 获取汇率失败: %v", err)
		// 如果数据库中没有汇率，使用默认汇率
		return s.getDefaultExchangeRate(fromCurrency, toCurrency)
	}

	// 查找匹配的汇率
	for _, rate := range rates {
		if rate.FromCurrency == fromCurrency && rate.ToCurrency == toCurrency {
			return decimal.NewFromFloat(rate.Rate), nil
		}
		// 尝试反向汇率
		if rate.FromCurrency == toCurrency && rate.ToCurrency == fromCurrency && rate.Rate != 0 {
			return decimal.NewFromFloat(1.0 / rate.Rate), nil
		}
	}

	// 未找到匹配的汇率，使用默认汇率
	return s.getDefaultExchangeRate(fromCurrency, toCurrency)
}

// getDefaultExchangeRate 获取默认汇率（简化实现）
func (s *walletService) getDefaultExchangeRate(fromCurrency, toCurrency string) (decimal.Decimal, error) {
	// 这里是一个简化的汇率表，实际应用中应该从外部API获取实时汇率
	defaultRates := map[string]map[string]float64{
		"USD": {"CNY": 7.2, "JPY": 150.0, "EUR": 0.85},
		"CNY": {"USD": 0.14, "JPY": 20.8, "EUR": 0.12},
		"JPY": {"USD": 0.0067, "CNY": 0.048, "EUR": 0.0057},
		"EUR": {"USD": 1.18, "CNY": 8.5, "JPY": 175.0},
	}

	if fromRates, exists := defaultRates[fromCurrency]; exists {
		if rate, exists := fromRates[toCurrency]; exists {
			return decimal.NewFromFloat(rate), nil
		}
	}

	return decimal.Zero, errors.New("不支持的货币对")
}

// generateTransactionID 生成交易ID
func generateTransactionID() string {
	return fmt.Sprintf("TXN_%d", time.Now().UnixNano())
}

// createBill 创建账单记录的辅助函数
func (s *walletService) createBill(walletID uint, transactionType string, amount decimal.Decimal, currencyCode, description string) error {
	bill := &models.Bill{
		WalletID:        walletID,
		TransactionType: transactionType,
		Amount:          amount,
		CurrencyCode:    currencyCode,
		Description:     description,
		Status:          "completed",
	}

	err := s.billRepo.Create(bill)
	if err != nil {
		log.Printf("[WalletService] 创建账单失败: %v", err)
		// 不返回错误，避免影响主业务流程
	}
	return err
}
