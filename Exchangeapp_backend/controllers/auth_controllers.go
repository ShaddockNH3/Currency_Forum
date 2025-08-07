package controllers

import (
	"exchangeapp/global"
	"exchangeapp/models"
	"exchangeapp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

/*
注册流程：
1. 接收用户输入的 JSON 数据
2. 将密码进行哈希处理
3. 生成 JWT
4. 迁移数据库
5. 创建用户
6. 返回 Token
*/
func Register(ctx *gin.Context) {
	var user models.User

	log.Println("开始处理注册请求...")
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("1. JSON 绑定成功, 准备处理用户: %s", user.Username)

	hashedPwd, err := utils.HashPassword(user.Password)

	if err != nil {
		log.Printf("错误点 A: 密码哈希失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Password = hashedPwd

	token, err := utils.GenrateJWT(user.Username)

	if err != nil {
		log.Printf("错误点 B: 生成 JWT 失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("3. JWT 生成成功, 准备操作数据库")

	if err := global.Db.AutoMigrate(&user); err != nil {
		log.Printf("错误点 C: 数据库迁移失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("4. 数据库迁移成功, 准备创建用户")

	if err := global.Db.Create(&user).Error; err != nil {
		log.Printf("错误点 D: 创建用户失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("5. 用户创建成功！准备返回 Token")

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}

/*
登录流程：
1. 接收用户输入的 JSON 数据
2. 查询用户
3. 验证密码
4. 生成 JWT
5. 返回 Token
*/
func Login(ctx *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	log.Println("开始处理登录请求...")

	if err := ctx.ShouldBindJSON(&input); err != nil {
		log.Printf("错误点 A: JSON 绑定失败: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("1. JSON 绑定成功, 准备验证用户: %s", input.Username)

	var user models.User

	if err := global.Db.Where("username=?", input.Username).First(&user).Error; err != nil {
		log.Printf("错误点 B: 用户查询失败: %v", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "wrong credentials"})
		return
	}

	log.Println("2. 用户查询成功, 准备验证密码")

	if !utils.CheckPassword(input.Password, user.Password) {
		log.Printf("错误点 C: 密码验证失败")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "wrong credentials"})
		return
	}

	log.Println("3. 密码验证成功, 准备生成 JWT")

	token, err := utils.GenrateJWT(user.Username)

	if err != nil {
		log.Printf("错误点 D: 生成 JWT 失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("4. JWT 生成成功, 准备返回 Token")

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}
