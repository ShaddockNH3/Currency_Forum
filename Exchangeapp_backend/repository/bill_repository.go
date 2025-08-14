// Package repository 数据访问层，负责与数据库交互
package repository

import (
	"exchangeapp/models"
	"log"

	"gorm.io/gorm"
)

// BillRepository 账单仓库接口，定义账单数据访问操作
type BillRepository interface {
	Create(bill *models.Bill) error
	FindByWalletID(walletID uint) ([]models.Bill, error)
	FindByID(id uint) (*models.Bill, error)
	Update(bill *models.Bill) error
	FindByWalletIDWithPagination(walletID uint, offset, limit int) ([]models.Bill, error)
}

// billRepository 账单仓库实现
type billRepository struct {
	db *gorm.DB
}

// NewBillRepository 创建账单仓库实例
func NewBillRepository(db *gorm.DB) BillRepository {
	return &billRepository{db: db}
}

// Create 创建新账单
func (r *billRepository) Create(bill *models.Bill) error {
	log.Printf("[BillRepo] 创建账单，钱包ID: %d，类型: %s，金额: %s %s",
		bill.WalletID, bill.TransactionType, bill.Amount.String(), bill.CurrencyCode)

	err := r.db.Create(bill).Error
	if err != nil {
		log.Printf("[BillRepo] 创建账单失败: %v", err)
		return err
	}

	log.Printf("[BillRepo] 账单创建成功，账单ID: %d", bill.ID)
	return nil
}

// FindByWalletID 根据钱包ID查找所有账单
func (r *billRepository) FindByWalletID(walletID uint) ([]models.Bill, error) {
	log.Printf("[BillRepo] 根据钱包ID查找账单: %d", walletID)

	var bills []models.Bill
	err := r.db.Where("wallet_id = ?", walletID).Order("created_at DESC").Find(&bills).Error
	if err != nil {
		log.Printf("[BillRepo] 查找账单失败: %v", err)
		return nil, err
	}

	log.Printf("[BillRepo] 找到 %d 条账单记录", len(bills))
	return bills, nil
}

// FindByID 根据账单ID查找账单
func (r *billRepository) FindByID(id uint) (*models.Bill, error) {
	log.Printf("[BillRepo] 根据账单ID查找: %d", id)

	var bill models.Bill
	err := r.db.First(&bill, id).Error
	if err != nil {
		log.Printf("[BillRepo] 账单查找失败: %v", err)
		return nil, err
	}

	return &bill, nil
}

// Update 更新账单
func (r *billRepository) Update(bill *models.Bill) error {
	log.Printf("[BillRepo] 更新账单，账单ID: %d", bill.ID)

	err := r.db.Save(bill).Error
	if err != nil {
		log.Printf("[BillRepo] 更新账单失败: %v", err)
		return err
	}

	log.Printf("[BillRepo] 账单更新成功")
	return nil
}

// FindByWalletIDWithPagination 根据钱包ID分页查找账单
func (r *billRepository) FindByWalletIDWithPagination(walletID uint, offset, limit int) ([]models.Bill, error) {
	log.Printf("[BillRepo] 分页查找账单，钱包ID: %d，偏移: %d，限制: %d", walletID, offset, limit)

	var bills []models.Bill
	err := r.db.Where("wallet_id = ?", walletID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&bills).Error

	if err != nil {
		log.Printf("[BillRepo] 分页查找账单失败: %v", err)
		return nil, err
	}

	log.Printf("[BillRepo] 分页找到 %d 条账单记录", len(bills))
	return bills, nil
}
