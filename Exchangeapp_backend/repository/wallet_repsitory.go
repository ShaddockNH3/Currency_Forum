// Package repository 数据访问层，负责与数据库交互
package repository

import (
	"exchangeapp/models"
	"log"

	"gorm.io/gorm"
)

// WalletRepository 钱包仓库接口，定义钱包数据访问操作
type WalletRepository interface {
	Create(wallet *models.Wallet) error
	FindByID(id uint) (*models.Wallet, error) // 内部使用，不对外暴露
	FindByUserID(userID uint) (*models.Wallet, error)
	UpdateWalletMessage(wallet *models.Wallet) error
}

// walletRepository 钱包仓库实现
type walletRepository struct {
	db *gorm.DB
}

// NewWalletRepository 创建钱包仓库实例
func NewWalletRepository(db *gorm.DB) WalletRepository {
	return &walletRepository{db: db}
}

// Create 创建新钱包
func (r *walletRepository) Create(wallet *models.Wallet) error {
	log.Printf("[WalletRepo] 创建钱包，用户ID: %d，钱包名: %s", wallet.UserID, wallet.WalletName)
	err := r.db.Create(wallet).Error
	if err != nil {
		log.Printf("[WalletRepo] 创建钱包失败: %v", err)
		return err
	}
	log.Printf("[WalletRepo] 钱包创建成功，钱包ID: %d", wallet.ID)
	return nil
}

// FindByID 根据钱包ID查找钱包（内部使用）
func (r *walletRepository) FindByID(id uint) (*models.Wallet, error) {
	log.Printf("[WalletRepo] 根据钱包ID查找: %d", id)
	var wallet models.Wallet
	err := r.db.First(&wallet, id).Error
	if err != nil {
		log.Printf("[WalletRepo] 钱包ID查找失败: %v", err)
		return nil, err
	}
	return &wallet, nil
}

// FindByUserID 根据用户ID查找钱包（预加载用户信息）
func (r *walletRepository) FindByUserID(userID uint) (*models.Wallet, error) {
	log.Printf("[WalletRepo] 根据用户ID查找钱包: %d", userID)
	var wallet models.Wallet
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&wallet).Error
	if err != nil {
		log.Printf("[WalletRepo] 用户钱包查找失败: %v", err)
		return nil, err
	}
	log.Printf("[WalletRepo] 找到钱包: %s (钱包ID: %d)", wallet.WalletName, wallet.ID)
	return &wallet, nil
}

// UpdateWalletMessage 更新钱包信息
func (r *walletRepository) UpdateWalletMessage(wallet *models.Wallet) error {
	log.Printf("[WalletRepo] 更新钱包信息，钱包ID: %d", wallet.ID)
	err := r.db.Save(wallet).Error
	if err != nil {
		log.Printf("[WalletRepo] 更新钱包失败: %v", err)
		return err
	}
	log.Printf("[WalletRepo] 钱包更新成功")
	return nil
}
