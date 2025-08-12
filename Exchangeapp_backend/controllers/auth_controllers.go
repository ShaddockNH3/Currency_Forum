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

	if user.Role != "admin" {
        user.Role = "user"
    }

	if len(user.Username)<=5||len(user.Username)>=21{
		ctx.JSON(http.StatusBadGateway,gin.H{"error":"用户名长度必须在6-20位之间"})
		return
	}

	if len(user.Password)<=5||len(user.Password)>=21{
		ctx.JSON(http.StatusBadRequest,gin.H{"error":"密码长度必须在6-20位之间"})
		return 
	}

	log.Printf("1. JSON 绑定成功,角色为%s, 准备处理用户: %s",user.Role, user.Username)

	hashedPwd, err := utils.HashPassword(user.Password)

	if err != nil {
		log.Printf("错误点 A: 密码哈希失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.Password = hashedPwd

	log.Println("3. 密码哈希成功, 准备创建用户")

	// 注意：数据库迁移已在应用启动时完成，此处不再需要

	if err := global.Db.Create(&user).Error; err != nil {
		log.Printf("错误点 C: 创建用户失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("4. 用户创建成功！准备生成 JWT")

	// 在用户创建成功后生成 JWT，此时 user.ID 已经有值
	token, err := utils.GenrateJWT(user.Username, user.Role, int(user.ID))
	if err != nil {
		log.Printf("错误点 D: 生成 JWT 失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("5. JWT 生成成功！准备返回 Token")

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

	token, err := utils.GenrateJWT(user.Username, user.Role, int(user.ID))

	if err != nil {
		log.Printf("错误点 D: 生成 JWT 失败: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("4. JWT 生成成功, 准备返回 Token")

	ctx.JSON(http.StatusOK, gin.H{"token": token})
}
