// Package service 业务逻辑层，处理业务规则、数据验证和调用仓库层
package service

import (
	"exchangeapp/models"
	"exchangeapp/repository"
	"exchangeapp/utils"
	"log"
)

// UserService 用户服务接口，定义用户相关的业务操作
type UserService interface {
	Register(user *models.User) (string, error)
	Login(loginField, password string) (string, error)
	GetByUsername(username string) (*models.User, error)
	GetByID(id uint) (*models.User, error)
	UpdateProfile(user *models.User) error
}

// userService 用户服务实现
type userService struct {
	userRepo repository.UserRepository
}

// NewUserService 创建用户服务实例
func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{userRepo: userRepo}
}

// Register 处理用户注册业务逻辑
// 包括密码哈希、角色设置、用户创建和JWT生成
func (s *userService) Register(user *models.User) (string, error) {
	log.Printf("[UserService] 开始处理用户注册，用户名: %s", user.Username)

	// 对密码进行哈希处理
	hashedPwd, err := utils.HashPassword(user.Password)
	if err != nil {
		log.Printf("[UserService] 密码哈希失败: %v", err)
		return "", err
	}
	user.Password = hashedPwd
	log.Printf("[UserService] 密码哈希完成")

	// 设置默认用户角色
	if user.Role != "admin" {
		user.Role = "user"
	}
	log.Printf("[UserService] 设置用户角色: %s", user.Role)

	// 调用仓库层创建用户
	if err := s.userRepo.Create(user); err != nil {
		log.Printf("[UserService] 创建用户失败: %v", err)
		return "", err
	}
	log.Printf("[UserService] 用户创建成功，用户ID: %d", user.ID)

	// 生成JWT令牌
	token, err := utils.GenerateJWT(user.Username, user.Role, int(user.ID))
	if err != nil {
		log.Printf("[UserService] JWT生成失败: %v", err)
		return "", err
	}

	log.Printf("[UserService] 用户注册完成，用户名: %s", user.Username)
	return token, nil
}

// Login 处理用户登录业务逻辑
// 支持使用用户名、邮箱或手机号登录，验证密码并生成JWT
func (s *userService) Login(loginField, password string) (string, error) {
	log.Printf("[UserService] 开始处理用户登录，登录字段: %s", loginField)

	// 根据登录字段查找用户（支持用户名、邮箱、手机号）
	user, err := s.userRepo.FindByLoginField(loginField)
	if err != nil {
		log.Printf("[UserService] 用户查找失败: %v", err)
		return "", utils.ErrInvalidCredentials
	}
	log.Printf("[UserService] 找到用户: %s (ID: %d)", user.Username, user.ID)

	// 验证密码
	if !utils.CheckPassword(password, user.Password) {
		log.Printf("[UserService] 密码验证失败，用户: %s", user.Username)
		return "", utils.ErrInvalidCredentials
	}
	log.Printf("[UserService] 密码验证成功")

	// 生成JWT令牌
	token, err := utils.GenerateJWT(user.Username, user.Role, int(user.ID))
	if err != nil {
		log.Printf("[UserService] JWT生成失败: %v", err)
		return "", err
	}

	log.Printf("[UserService] 用户登录成功，用户名: %s", user.Username)
	return token, nil
}

// GetByUsername 根据用户名获取用户信息
func (s *userService) GetByUsername(username string) (*models.User, error) {
	log.Printf("[UserService] 根据用户名查找用户: %s", username)
	return s.userRepo.FindByUsername(username)
}

// GetByID 根据用户ID获取用户信息
func (s *userService) GetByID(id uint) (*models.User, error) {
	log.Printf("[UserService] 根据ID查找用户: %d", id)
	return s.userRepo.FindByID(id)
}

// UpdateProfile 更新用户资料
func (s *userService) UpdateProfile(user *models.User) error {
	log.Printf("[UserService] 更新用户资料，用户ID: %d", user.ID)
	return s.userRepo.Update(user)
}
