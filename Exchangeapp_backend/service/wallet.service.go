// Package service 业务逻辑层，处理钱包相关的业务规则和数据验证
package service

import (
	"errors"
	"exchangeapp/dto"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/repository"
	"log"
)

type WalletService interface {
	CreateWallet(userID uint, input *input.WalletInput) (*dto.WalletDTO, error)
	GetWalletByUserID(userID uint) (*dto.WalletDTO, error)
	UpdateWalletMessage(userID uint, input *input.WalletInput) (*dto.WalletDTO, error)
}

type walletService struct {
	walletRepo repository.WalletRepository
	userRepo   repository.UserRepository
}

// 在 New 函数里，把所有需要的 Repository 都注入进来
func NewWalletService(walletRepo repository.WalletRepository, userRepo repository.UserRepository) WalletService {
	return &walletService{
		walletRepo: walletRepo,
		userRepo:   userRepo,
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

	// 获取用户信息用于返回DTO
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取用户信息失败，使用默认用户信息: %v", err)
		return convertWalletToDTO(wallet, &models.User{Username: "未知用户"}), nil
	}

	log.Printf("[WalletService] 钱包创建流程完成，用户ID: %d", userID)
	return convertWalletToDTO(wallet, user), nil
}

// GetWalletByUserID 获取用户钱包信息
func (s *walletService) GetWalletByUserID(userID uint) (*dto.WalletDTO, error) {
	log.Printf("[WalletService] 开始获取钱包信息，用户ID: %d", userID)

	// 调用仓库层查找钱包（已预加载用户信息）
	wallet, err := s.walletRepo.FindByUserID(userID)
	if err != nil {
		log.Printf("[WalletService] 获取钱包失败: %v", err)
		return nil, err
	}

	log.Printf("[WalletService] 钱包信息获取成功，钱包ID: %d", wallet.ID)
	return convertWalletToDTO(wallet, &wallet.User), nil
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

	log.Printf("[WalletService] 钱包信息更新成功，钱包ID: %d", wallet.ID)
	return convertWalletToDTO(wallet, &wallet.User), nil
}

// 创建一个私有的辅助函数，专门负责将 model 转换为 DTO
func convertWalletToDTO(wallet *models.Wallet, user *models.User) *dto.WalletDTO {
	return &dto.WalletDTO{
		UserID:          wallet.UserID,
		Username:        user.Username, // 现在我们有 user 对象了！
		Status:          wallet.WalletStatus,
		WalletName:      wallet.WalletName,
		Description:     wallet.WalletDescription,
		DefaultCurrency: wallet.DefaultCurrency,
		CreatedAt:       wallet.CreatedAt,
		UpdatedAt:       wallet.UpdatedAt,
		// Bills:          // Bills 的转换会更复杂一些，可以先留空
	}
}
