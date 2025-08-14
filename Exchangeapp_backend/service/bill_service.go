// Package service 业务逻辑层，处理账单相关的业务规则和数据验证
package service

import (
	"exchangeapp/dto"
	"exchangeapp/models"
	"exchangeapp/repository"
	"log"
	"math"
)

// BillService 账单服务接口
type BillService interface {
	CreateBill(bill *models.Bill) error
	GetBillsByWalletID(walletID uint, page, pageSize int) (*dto.BillListDTO, error)
	GetBillByID(id uint) (*dto.BillDTO, error)
}

// billService 账单服务实现
type billService struct {
	billRepo repository.BillRepository
}

// NewBillService 创建账单服务实例
func NewBillService(billRepo repository.BillRepository) BillService {
	return &billService{
		billRepo: billRepo,
	}
}

// CreateBill 创建账单
func (s *billService) CreateBill(bill *models.Bill) error {
	log.Printf("[BillService] 创建账单，钱包ID: %d，类型: %s", bill.WalletID, bill.TransactionType)

	// 设置默认状态
	if bill.Status == "" {
		bill.Status = "completed"
	}

	err := s.billRepo.Create(bill)
	if err != nil {
		log.Printf("[BillService] 创建账单失败: %v", err)
		return err
	}

	log.Printf("[BillService] 账单创建成功，账单ID: %d", bill.ID)
	return nil
}

// GetBillsByWalletID 获取钱包账单列表（分页）
func (s *billService) GetBillsByWalletID(walletID uint, page, pageSize int) (*dto.BillListDTO, error) {
	log.Printf("[BillService] 获取钱包账单列表，钱包ID: %d，页码: %d，页大小: %d", walletID, page, pageSize)

	// 参数验证
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20 // 默认每页20条
	}

	offset := (page - 1) * pageSize

	// 获取账单列表
	bills, err := s.billRepo.FindByWalletIDWithPagination(walletID, offset, pageSize)
	if err != nil {
		log.Printf("[BillService] 获取账单列表失败: %v", err)
		return nil, err
	}

	// 获取总数（简化实现，实际项目中应该有专门的Count方法）
	allBills, err := s.billRepo.FindByWalletID(walletID)
	if err != nil {
		log.Printf("[BillService] 获取账单总数失败: %v", err)
		return nil, err
	}
	total := len(allBills)

	// 转换为DTO
	billDTOs := make([]dto.BillDTO, 0, len(bills))
	for _, bill := range bills {
		billDTOs = append(billDTOs, *convertBillToDTO(&bill))
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	result := &dto.BillListDTO{
		Bills:      billDTOs,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}

	log.Printf("[BillService] 账单列表获取成功，共 %d 条记录，当前页 %d/%d", total, page, totalPages)
	return result, nil
}

// GetBillByID 根据ID获取账单
func (s *billService) GetBillByID(id uint) (*dto.BillDTO, error) {
	log.Printf("[BillService] 根据ID获取账单: %d", id)

	bill, err := s.billRepo.FindByID(id)
	if err != nil {
		log.Printf("[BillService] 获取账单失败: %v", err)
		return nil, err
	}

	log.Printf("[BillService] 账单获取成功，账单ID: %d", bill.ID)
	return convertBillToDTO(bill), nil
}

// convertBillToDTO 将账单模型转换为DTO
func convertBillToDTO(bill *models.Bill) *dto.BillDTO {
	return &dto.BillDTO{
		ID:              bill.ID,
		WalletID:        bill.WalletID,
		TransactionType: bill.TransactionType,
		Amount:          bill.Amount,
		CurrencyCode:    bill.CurrencyCode,
		RelatedWalletID: bill.RelatedWalletID,
		Description:     bill.Description,
		Status:          bill.Status,
		CreatedAt:       bill.CreatedAt,
		UpdatedAt:       bill.UpdatedAt,
	}
}
