package wallet_controllers

import (
	"exchangeapp/dto"
	"exchangeapp/global"
	"exchangeapp/input"
	"exchangeapp/models"
	"exchangeapp/utils"
	"log"
	"net/http"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

/*
	钱包相关接口
	1. 创建钱包
	2. 获取钱包信息
	3. 更新钱包信息
*/

// 创建钱包
func CreateWallet(ctx *gin.Context) {
	var input input.Create_Update_WalletInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	wallet := models.Wallet{
		UserID:          uint(userID),

		Status:          "active",
		IsEnabled:       true,

		WalletName:      input.WalletName,
		Description:     input.Description,

		TotalBalance:    decimal.Zero,
		DefaultCurrency: input.DefaultCurrency,
	}

	if err := global.Db.Create(&wallet).Error; err != nil {
		log.Printf("错误点 C: 创建钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := dto.WalletDTO{
		ID:              wallet.ID,
		UserID:          wallet.UserID,
		Username:        wallet.User.Username,
		Status:          wallet.Status,
		IsEnabled:       wallet.IsEnabled,
		WalletName:      wallet.WalletName,
		Description:     wallet.Description,
		TotalBalance:    wallet.TotalBalance,
		DefaultCurrency: wallet.DefaultCurrency,
		CreatedAt:       wallet.CreatedAt,
		UpdatedAt:       wallet.UpdatedAt,
	}

	ctx.JSON(http.StatusOK, response)
}

// 获取钱包信息
func GetWalletMessage(ctx *gin.Context) {
	userID, _, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 A: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var wallet models.Wallet
	if err := global.Db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "钱包不存在"})
			return
		}
		log.Printf("错误点 B: 获取钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := dto.WalletDTO{
		ID:              wallet.ID,
		UserID:          wallet.UserID,
		Username:        wallet.User.Username,
		Status:          wallet.Status,
		IsEnabled:       wallet.IsEnabled,
		WalletName:      wallet.WalletName,
		Description:     wallet.Description,
		TotalBalance:    wallet.TotalBalance,
		DefaultCurrency: wallet.DefaultCurrency,
		CreatedAt:       wallet.CreatedAt,
		UpdatedAt:       wallet.UpdatedAt,
	}

	ctx.JSON(http.StatusOK, response)
}

// 更新钱包信息
func UpdateWalletMessage(ctx *gin.Context) {
	var input input.Create_Update_WalletInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 A: 绑定请求数据失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _, _, err := utils.GetUserInfo(ctx)
	if err != nil {
		log.Printf("错误点 B: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var wallet models.Wallet
	if err := global.Db.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "钱包不存在"})
		}
	}

	wallet.WalletName = input.WalletName
	wallet.Description = input.Description
	wallet.DefaultCurrency = input.DefaultCurrency

	if err := global.Db.Save(&wallet).Error; err != nil {
		log.Printf("错误点 C: 更新钱包失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := dto.WalletDTO{
		ID:              wallet.ID,
		UserID:          wallet.UserID,
		Username:        wallet.User.Username,
		Status:          wallet.Status,
		IsEnabled:       wallet.IsEnabled,
		WalletName:      wallet.WalletName,
		Description:     wallet.Description,
		TotalBalance:    wallet.TotalBalance,
		DefaultCurrency: wallet.DefaultCurrency,
		CreatedAt:       wallet.CreatedAt,
		UpdatedAt:       wallet.UpdatedAt,
	}

	ctx.JSON(http.StatusOK, response)
}


