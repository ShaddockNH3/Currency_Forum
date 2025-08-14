// Package controllers 处理HTTP请求，负责请求参数验证、调用服务层和返回响应
package controllers

import (
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// BillController 账单控制器，处理账单相关的HTTP请求
type BillController struct {
	billService   service.BillService
	walletService service.WalletService
}

// NewBillController 创建账单控制器实例
func NewBillController(billService service.BillService, walletService service.WalletService) *BillController {
	return &BillController{
		billService:   billService,
		walletService: walletService,
	}
}

// GetBills 处理获取账单列表请求
func (c *BillController) GetBills(ctx *gin.Context) {
	log.Printf("[Bill] 开始处理获取账单列表请求")

	// 从JWT中获取用户信息
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Bill] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	// 获取钱包ID
	walletID, err := c.walletService.GetWalletIDByUserID(uint(userID))
	if err != nil {
		log.Printf("[Bill] 获取钱包ID失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "钱包不存在"})
		return
	}

	// 获取分页参数
	page := 1
	pageSize := 20

	if pageStr := ctx.Query("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if pageSizeStr := ctx.Query("page_size"); pageSizeStr != "" {
		if ps, err := strconv.Atoi(pageSizeStr); err == nil && ps > 0 && ps <= 100 {
			pageSize = ps
		}
	}

	log.Printf("[Bill] 调用服务层获取账单列表，用户ID: %d，页码: %d，页大小: %d", userID, page, pageSize)

	// 调用服务层获取账单列表
	response, err := c.billService.GetBillsByWalletID(walletID, page, pageSize)
	if err != nil {
		log.Printf("[Bill] 服务层获取账单列表失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Bill] 账单列表获取成功，用户ID: %d，共 %d 条记录", userID, response.Total)
	ctx.JSON(http.StatusOK, response)
}

// GetBillByID 处理根据ID获取账单请求
func (c *BillController) GetBillByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	log.Printf("[Bill] 开始处理获取账单请求，账单ID: %s", idStr)

	// 解析账单ID
	billID, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		log.Printf("[Bill] 账单ID格式错误: %s", idStr)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "账单ID格式错误"})
		return
	}

	// 从JWT中获取用户信息（用于权限验证）
	userID, _, _, err := utils.GetUserInfoFromContext(ctx)
	if err != nil {
		log.Printf("[Bill] 获取用户信息失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	// 获取账单
	bill, err := c.billService.GetBillByID(uint(billID))
	if err != nil {
		log.Printf("[Bill] 获取账单失败: %v", err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "账单不存在"})
		return
	}

	// 验证账单是否属于当前用户的钱包
	walletID, err := c.walletService.GetWalletIDByUserID(uint(userID))
	if err != nil || bill.WalletID != walletID {
		log.Printf("[Bill] 账单权限验证失败，用户ID: %d，账单钱包ID: %d，用户钱包ID: %d",
			userID, bill.WalletID, walletID)
		ctx.JSON(http.StatusForbidden, gin.H{"error": "无权访问此账单"})
		return
	}

	log.Printf("[Bill] 账单获取成功，账单ID: %d", billID)
	ctx.JSON(http.StatusOK, bill)
}
