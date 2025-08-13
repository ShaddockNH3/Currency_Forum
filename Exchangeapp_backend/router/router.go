package router

import (
	"exchangeapp/di"
	"exchangeapp/middlewares"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 创建依赖注入容器
	container := di.NewContainer()

	auth := r.Group("/api/auth")
	{
		auth.POST("/login", container.AuthController.Login)
		auth.POST("/register", container.AuthController.Register)
	}

	api := r.Group("/api")

	api.GET("/exchangeRates", container.ExchangeRateController.GetExchangeRate)

	api.Use(middlewares.AuthMiddleware())
	{
		api.POST("/exchangeRates", container.ExchangeRateController.CreateExchangeRate)
		api.PUT("/exchangeRates/:id", container.ExchangeRateController.UpdateExchangeRateByID)
		api.DELETE("/exchangeRates/:id", container.ExchangeRateController.DeleteExchangeRateByID)

		api.POST("/articles", container.ArticleController.CreateArticle)
		api.GET("/articles", container.ArticleController.GetArticles)
		api.GET("/articles/:id", container.ArticleController.GetArticlesByID)
		api.PUT("/articles/:id", container.ArticleController.UpdateArticleByID)
		api.DELETE("/articles/:id", container.ArticleController.DeleteArticleByID)

		api.POST("/articles/:id/like", container.LikeController.LikeArticle)
		api.GET("/articles/:id/like", container.LikeController.GetArticleLikes)

		api.GET("/users/:username", container.HomePageController.GetHomePage)
		api.PUT("/users/:username", container.HomePageController.UpdateUserProfile)
	}

	wallet := api.Group("/wallets")
	wallet.Use(middlewares.AuthMiddleware())
	{
		wallet.POST("", container.WalletController.CreateWallet)
		wallet.GET("", container.WalletController.GetWallet)
		wallet.PUT("", container.WalletController.UpdateWallet)
	}

	return r
}
