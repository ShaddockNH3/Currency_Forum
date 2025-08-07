package controllers

import (
	"exchangeapp/global"
	"exchangeapp/models"
	"log"
	"net/http"
	"errors"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

/*
创建汇率
1. 接收请求数据
2. 验证数据
3. 迁移数据库
4. 创建汇率
5. 返回响应
*/
func CreateExchangeRate(ctx *gin.Context){
	var exchangeRate models.ExchangeRate
	
	log.Println("开始处理创建汇率请求...")
	if err:=ctx.ShouldBindJSON(&exchangeRate);err!=nil{
		log.Printf("错误点 A: 绑定请求失败: %v",err)
		ctx.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return 
	}

	exchangeRate.Date=time.Now()

	if err:=global.Db.AutoMigrate(&exchangeRate);err!=nil{
		log.Printf("错误点 B: 迁移数据库失败: %v",err)
		ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		return
	}

	if err:=global.Db.Create(&exchangeRate).Error;err!=nil{
		log.Printf("错误点 C: 创建汇率失败: %v",err)
		ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		return
	}

	log.Println("汇率创建成功！")
	ctx.JSON(http.StatusCreated,exchangeRate)
}

/*
获取汇率
1. 接收请求数据
2. 验证数据
3. 迁移数据库
4. 创建汇率
5. 返回响应
*/
func GetExchangeRate(ctx *gin.Context){
	var exchangeRate []models.ExchangeRate

	log.Println("开始处理获取汇率请求...")
	if err:=global.Db.Find(&exchangeRate).Error;err!=nil{
		log.Printf("错误点 A: 获取汇率失败: %v",err)
		if errors.Is(err,gorm.ErrRecordNotFound){
			log.Printf("错误点 B: 汇率不存在: %v",err)
			ctx.JSON(http.StatusNotFound,gin.H{"error":err.Error()})
		}else{
			log.Printf("错误点 C: 数据库查询失败: %v",err)
			ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		}
		ctx.JSON(http.StatusInternalServerError,gin.H{"error":err.Error()})
		return
	}

	log.Println("汇率获取成功！")
	ctx.JSON(http.StatusOK,exchangeRate)
}