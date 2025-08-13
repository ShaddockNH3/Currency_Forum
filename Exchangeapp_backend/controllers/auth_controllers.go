// Package controllers 处理HTTP请求，负责请求参数验证、调用服务层和返回响应
package controllers

import (
	"exchangeapp/models"
	"exchangeapp/service"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthController 认证控制器，处理用户注册和登录相关请求
type AuthController struct {
	userService service.UserService
}

// NewAuthController 创建认证控制器实例
func NewAuthController(userService service.UserService) *AuthController {
	return &AuthController{userService: userService}
}

// Register 处理用户注册请求
// 流程：1.参数绑定 2.数据验证 3.调用服务层 4.返回Token
func (c *AuthController) Register(ctx *gin.Context) {
	var user models.User

	log.Printf("[Auth] 开始处理用户注册请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&user); err != nil {
		log.Printf("[Auth] 注册请求数据绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Auth] 开始验证注册数据，用户名: %s", user.Username)

	// 验证用户名格式
	validationResultUsername := utils.ValidateUsername(user.Username)
	if !validationResultUsername.IsValid {
		log.Printf("[Auth] 用户名验证失败: %v", validationResultUsername.Errors[0])
		ctx.JSON(http.StatusBadRequest, gin.H{"error": validationResultUsername.Errors[0]})
		return
	}

	// 验证密码格式
	validationResultPassword := utils.ValidatePassword(user.Password)
	if !validationResultPassword.IsValid {
		log.Printf("[Auth] 密码验证失败: %v", validationResultPassword.Errors[0])
		ctx.JSON(http.StatusBadRequest, gin.H{"error": validationResultPassword.Errors[0]})
		return
	}

	// 验证邮箱格式
	validationResultEmail := utils.ValidateEmail(user.Email)
	if !validationResultEmail.IsValid {
		log.Printf("[Auth] 邮箱验证失败: %v", validationResultEmail.Errors[0])
		ctx.JSON(http.StatusBadRequest, gin.H{"error": validationResultEmail.Errors[0]})
		return
	}

	// 验证手机号格式
	validationResultPhone := utils.ValidatePhone(user.Phone)
	if !validationResultPhone.IsValid {
		log.Printf("[Auth] 手机号验证失败: %v", validationResultPhone.Errors[0])
		ctx.JSON(http.StatusBadRequest, gin.H{"error": validationResultPhone.Errors[0]})
		return
	}

	log.Printf("[Auth] 数据验证通过，调用服务层处理注册，角色: %s", user.Role)

	// 调用服务层处理注册业务逻辑
	token, err := c.userService.Register(&user)
	if err != nil {
		log.Printf("[Auth] 服务层注册失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Auth] 用户注册成功，用户名: %s", user.Username)
	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

// Login 处理用户登录请求
// 支持使用用户名、邮箱或手机号登录
func (c *AuthController) Login(ctx *gin.Context) {
	var input struct {
		LoginField string `json:"loginField"` // 支持用户名、邮箱、手机号
		Password   string `json:"password"`
	}

	log.Printf("[Auth] 开始处理用户登录请求")

	// 绑定JSON请求数据
	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("[Auth] 登录请求数据绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[Auth] 调用服务层处理登录，登录字段: %s", input.LoginField)

	// 调用服务层处理登录业务逻辑
	token, err := c.userService.Login(input.LoginField, input.Password)
	if err != nil {
		log.Printf("[Auth] 服务层登录失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "登录信息或密码错误"})
		return
	}

	log.Printf("[Auth] 用户登录成功，登录字段: %s", input.LoginField)
	ctx.JSON(http.StatusOK, gin.H{"token": token})
}
