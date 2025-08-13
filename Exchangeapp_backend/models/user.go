// Package models 定义数据模型，对应数据库表结构
package models

import "gorm.io/gorm"

// User 用户模型，存储用户基本信息和认证信息
type User struct {
	gorm.Model          // 包含ID、CreatedAt、UpdatedAt、DeletedAt
	Username     string `gorm:"unique"`      // 用户名，唯一约束
	Role         string `binding:"required"` // 用户角色：admin/user
	Password     string `binding:"required"` // 密码哈希值
	Email        string `binding:"required"` // 邮箱地址
	Phone        string `binding:"required"` // 手机号码
	Signature    string // 个人签名
	Introduction string // 个人介绍
}
