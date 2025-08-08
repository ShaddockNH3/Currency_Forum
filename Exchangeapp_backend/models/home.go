package models

import "gorm.io/gorm"

type Home struct{
	gorm.Model
	Username string `gorm:"unique"`
	Role     string `binding:"required"` //admin,user
	Password string `binding:"required"`
	Signature string
	Introduction string
}