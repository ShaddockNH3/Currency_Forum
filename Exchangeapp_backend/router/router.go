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
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"},
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

		// 评论功能
		api.POST("/comments", container.CommentController.CreateComment)                           // 创建评论
		api.GET("/articles/:id/comments", container.CommentController.GetCommentsByArticleID)      // 获取文章评论
		api.GET("/comments/:id/replies", container.CommentController.GetCommentsByParentID)        // 获取评论回复
		api.DELETE("/comments/:id", container.CommentController.DeleteCommentByID)                 // 删除单个评论
		api.DELETE("/articles/:id/comments", container.CommentController.DeleteCommentByArticleID) // 删除文章所有评论

		api.GET("/users/:username", container.HomePageController.GetHomePage)
		api.PUT("/users/:username", container.HomePageController.UpdateUserProfile)
	}

	wallet := api.Group("/wallets")
	wallet.Use(middlewares.AuthMiddleware())
	{
		// 钱包基本操作 - 已实现
		wallet.POST("", container.WalletController.CreateWallet)
		wallet.GET("", container.WalletController.GetWallet)
		wallet.PUT("", container.WalletController.UpdateWallet)

		// 钱包余额操作 - 已实现
		wallet.POST("/balance", container.WalletController.CreateBalance)
		wallet.GET("/balances", container.WalletController.GetAllBalances)                // 获取所有余额
		wallet.GET("/balance/:currency", container.WalletController.GetBalanceByCurrency) // 获取特定货币余额

		// 钱包交易操作 - 已实现
		wallet.POST("/deposit", container.WalletController.Deposit)   // 充值
		wallet.POST("/withdraw", container.WalletController.Withdraw) // 取出
		wallet.POST("/exchange", container.WalletController.Exchange) // 货币兑换
		wallet.POST("/transfer", container.WalletController.Transfer) // 转账

		// 账单相关操作 - 已实现
		wallet.GET("/bills", container.BillController.GetBills)        // 获取账单列表
		wallet.GET("/bills/:id", container.BillController.GetBillByID) // 获取特定账单
	}

	return r
}
