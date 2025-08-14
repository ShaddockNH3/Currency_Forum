package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"exchangeapp/config"
	"exchangeapp/global"
	"exchangeapp/models"
	"exchangeapp/router"

	"github.com/pkg/browser"
)

func main() {
	config.InitConfig()

	// 数据库迁移：确保所有表结构在应用启动时就准备好
	log.Println("开始数据库迁移...")
	if err := global.Db.AutoMigrate(
		&models.User{},
		&models.Article{},
		&models.ExchangeRate{},
		&models.Wallet{},
		&models.WalletBalance{},
		&models.Bill{},
		&models.Comment{},
	); err != nil {
		log.Fatalf("数据库迁移失败: %v", err)
	}
	log.Println("数据库迁移完成")

	r := router.SetupRouter()

	port := config.AppConfig.App.Port

	if port == "" {
		port = ":8080"
	}

	srv := &http.Server{
		Addr:    port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()
	
	go func() {
        time.Sleep(2 * time.Second) 
        frontendURL := "http://localhost:5173"

        log.Println("正在检查前端服务状态 at", frontendURL)
        resp, err := http.Get(frontendURL)

        if err == nil && resp.StatusCode == http.StatusOK {
            log.Printf("前端服务已准备就绪，正在打开浏览器...")
            browser.OpenURL(frontendURL)
        } else {
            log.Printf("未检测到前端服务在 %s 运行，请手动启动前端后访问。", frontendURL)
        }

        if resp != nil {
            resp.Body.Close()
        }
    }()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")

	// r.Run(port)
}
