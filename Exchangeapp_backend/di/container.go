package di

import (
	"exchangeapp/controllers"
	"exchangeapp/global"
	"exchangeapp/repository"
	"exchangeapp/service"
)

// Container 依赖注入容器
type Container struct {
	// Repositories
	UserRepository         repository.UserRepository
	ArticleRepository      repository.ArticleRepository
	ExchangeRateRepository repository.ExchangeRateRepository
	WalletRepository       repository.WalletRepository
	BillRepository         repository.BillRepository
	// Services
	UserService         service.UserService
	ArticleService      service.ArticleService
	ExchangeRateService service.ExchangeRateService
	HomePageService     service.HomePageService
	LikeService         service.LikeService
	WalletService       service.WalletService
	BillService         service.BillService
	// Controllers
	AuthController         *controllers.AuthController
	ArticleController      *controllers.ArticleController
	ExchangeRateController *controllers.ExchangeRateController
	HomePageController     *controllers.HomePageController
	LikeController         *controllers.LikeController
	WalletController       *controllers.WalletController
	BillController         *controllers.BillController
}

// NewContainer 创建新的依赖注入容器
func NewContainer() *Container {
	container := &Container{}

	// 初始化Repositories
	container.initRepositories()

	// 初始化Services
	container.initServices()

	// 初始化Controllers
	container.initControllers()

	return container
}

// initRepositories 初始化所有Repository
func (c *Container) initRepositories() {
	c.UserRepository = repository.NewUserRepository(global.Db)
	c.ArticleRepository = repository.NewArticleRepository(global.Db)
	c.ExchangeRateRepository = repository.NewExchangeRateRepository(global.Db)
	c.WalletRepository = repository.NewWalletRepository(global.Db)
	c.BillRepository = repository.NewBillRepository(global.Db)
}

// initServices 初始化所有Service
func (c *Container) initServices() {
	c.UserService = service.NewUserService(c.UserRepository)
	c.ArticleService = service.NewArticleService(c.ArticleRepository)
	c.ExchangeRateService = service.NewExchangeRateService(c.ExchangeRateRepository, c.UserRepository)
	c.HomePageService = service.NewHomePageService(c.UserRepository, c.ArticleRepository)
	c.LikeService = service.NewLikeService(global.RedisDB)
	c.BillService = service.NewBillService(c.BillRepository)
	c.WalletService = service.NewWalletService(c.WalletRepository, c.UserRepository, c.ExchangeRateRepository, c.BillRepository)
}

// initControllers 初始化所有Controller
func (c *Container) initControllers() {
	c.AuthController = controllers.NewAuthController(c.UserService)
	c.ArticleController = controllers.NewArticleController(c.ArticleService)
	c.ExchangeRateController = controllers.NewExchangeRateController(c.ExchangeRateService)
	c.HomePageController = controllers.NewHomePageController(c.HomePageService)
	c.LikeController = controllers.NewLikeController(c.LikeService)
	c.WalletController = controllers.NewWalletController(c.WalletService)
	c.BillController = controllers.NewBillController(c.BillService, c.WalletService)
}

// GetControllers 获取所有Controller
func (c *Container) GetControllers() *Container {
	return c
}
