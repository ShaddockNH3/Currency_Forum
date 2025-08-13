// Package repository 数据访问层，负责与数据库交互
package repository

import (
	"exchangeapp/models"
	"log"

	"gorm.io/gorm"
)

// UserRepository 用户仓库接口，定义用户数据访问操作
type UserRepository interface {
	Create(user *models.User) error
	FindByUsername(username string) (*models.User, error)
	FindByID(id uint) (*models.User, error)
	FindByLoginField(loginField string) (*models.User, error)
	Update(user *models.User) error
	Delete(id uint) error
}

// userRepository 用户仓库实现
type userRepository struct {
	db *gorm.DB
}

// NewUserRepository 创建用户仓库实例
func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

// Create 创建新用户
func (r *userRepository) Create(user *models.User) error {
	log.Printf("[UserRepo] 创建用户，用户名: %s", user.Username)
	err := r.db.Create(user).Error
	if err != nil {
		log.Printf("[UserRepo] 创建用户失败: %v", err)
		return err
	}
	log.Printf("[UserRepo] 用户创建成功，用户ID: %d", user.ID)
	return nil
}

// FindByUsername 根据用户名查找用户
func (r *userRepository) FindByUsername(username string) (*models.User, error) {
	log.Printf("[UserRepo] 根据用户名查找用户: %s", username)
	var user models.User
	err := r.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		log.Printf("[UserRepo] 用户名查找失败: %v", err)
		return nil, err
	}
	return &user, nil
}

// FindByID 根据ID查找用户
func (r *userRepository) FindByID(id uint) (*models.User, error) {
	log.Printf("[UserRepo] 根据ID查找用户: %d", id)
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		log.Printf("[UserRepo] ID查找失败: %v", err)
		return nil, err
	}
	return &user, nil
}

// FindByLoginField 通过登录字段查找用户（支持用户名、邮箱、手机号）
func (r *userRepository) FindByLoginField(loginField string) (*models.User, error) {
	log.Printf("[UserRepo] 根据登录字段查找用户: %s", loginField)
	var user models.User
	err := r.db.Where("username = ? OR email = ? OR phone = ?", loginField, loginField, loginField).First(&user).Error
	if err != nil {
		log.Printf("[UserRepo] 登录字段查找失败: %v", err)
		return nil, err
	}
	log.Printf("[UserRepo] 找到用户: %s (ID: %d)", user.Username, user.ID)
	return &user, nil
}

// Update 更新用户信息
func (r *userRepository) Update(user *models.User) error {
	log.Printf("[UserRepo] 更新用户信息，用户ID: %d", user.ID)
	return r.db.Save(user).Error
}

// Delete 删除用户
func (r *userRepository) Delete(id uint) error {
	log.Printf("[UserRepo] 删除用户，用户ID: %d", id)
	return r.db.Delete(&models.User{}, id).Error
}
