# Currency Forum - 货币论坛系统

一个基于Go语言和Gin框架开发的现代化货币论坛系统，采用三层架构设计，支持多用户角色、钱包管理、汇率查询、文章发布等功能。

## 📋 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [开发历程](#开发历程)
- [技术栈](#技术栈)
- [架构设计](#架构设计)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [API文档](#api文档)
- [开发安装](#开发安装)
- [开发计划](#开发计划)
- [贡献指南](#贡献指南)

---

## 🎯 项目概述

Currency Forum 是一个专注于货币话题讨论的论坛系统，集成了用户管理、内容发布、钱包系统和汇率查询等功能。项目采用现代化的三层架构设计，确保代码的可维护性和可扩展性。

## 快速开始

## 🔧 本地开发指南 (Local Development Guide)

欢迎为本项目贡献代码或进行二次开发！请遵循以下步骤，在你的本地计算机上将项目成功运行起来。

### 1. 先决条件 (Prerequisites)

在开始之前，请确保你的电脑上已经安装并正确配置了以下软件：

* **Go**: 版本 `1.20` 或更高
* **Node.js**: 版本 `18.0` (LTS) 或更高
* **MySQL**: 版本 `8.0` 或更高
* **Redis**

### 2. 获取代码 (Get the Code)

首先，使用 `git` 将本仓库克隆到你的本地：
```bash
git clone [https://github.com/ShaddockNH3/Currency_Forum.git](https://github.com/ShaddockNH3/Currency_Forum.git)
cd Currency_Forum
```

### 3. 后端启动流程 (Backend Setup)

1.  **进入后端目录**:
    ```bash
    cd Exchangeapp_backend
    ```

2.  **配置 `config.yml`**:
    这是最关键的一步！请在 `config/` 目录下修改config.yaml文件。
    ```yaml
    app:
      name: CurrencyExchangeApp
      port: :3000

    database:
      dsn: 用户名:密码@tcp(127.0.0.1:3306)/你的数据库名?charset=utf8mb4&parseTime=True&loc=Local
    
    redis:
      addr: "localhost:6379"
      password: "" # 如果你的 Redis 有密码
      db: 0
    ```
    **请务必**将 `dsn` 中的数据库连接信息，替换成你自己的本地设置！

3.  **安装依赖**:
    Go Modules 会帮我们处理好一切。
    ```bash
    go mod tidy
    ```

4.  **启动后端服务**:
    ```bash
    go run .
    ```
    当你看到类似 `Server is running at :3000` 的日志时，就说明后端已经成功启动啦！

### 4. 前端启动流程 (Frontend Setup)

1.  **打开一个新的终端**，然后进入前端目录:
    ```bash
    cd Exchangeapp_frontend
    ```

2.  **安装依赖**:
    (如果你是第一次运行，或者 `package.json` 有更新，就需要执行这一步)
    ```bash
    npm install
    ```

3.  **启动前端开发服务**:
    ```bash
    npm run dev
    ```
    当你看到 Vite 打印出类似 `> Local: http://localhost:5173/` 的信息时，就说明前端也成功启动啦！

### 5. 开始探索！

现在，你的浏览器应该会自动打开 `http://localhost:5173`，或者你可以手动访问它。恭喜你，整个应用已经在你的本地完美地运行起来了！

---

## 🚀 开发历程

### 第一阶段：基础功能复刻
- 复刻了原始代码的核心功能
- 实现基础的文章发布和查看功能
- 建立了基本的用户认证系统

### 第二阶段：功能扩展
- 🔐 **用户角色系统**：增加了管理员和普通用户角色区分
- 👤 **个人主页**：用户可以自定义个人资料和查看个人文章
- ✏️ **文章管理**：支持文章的删除和编辑功能
- 💰 **钱包系统**：引入多币种钱包管理功能
- 📊 **数据分层**：将DTO、Input和Model分离，提高代码组织性

### 第三阶段：架构重构
- 🏗️ **三层架构重构**：完全重构为Controller-Service-Repository架构
- 📝 **代码规范化**：统一注释和日志规范，提高代码可读性
- 🔧 **依赖注入**：实现完整的依赖注入容器
- 🛡️ **错误处理**：建立统一的错误处理机制

### 第四阶段：钱包系统 ✅
- 💰 **完整钱包系统**：实现多币种钱包管理
- 🔄 **交易功能**：充值、提现、货币兑换、转账全部到位
- 📊 **账单系统**：完整的交易记录和查询功能
- 🏦 **余额管理**：支持多币种余额实时查询

### 第五阶段：评论系统完成 ✅
- 💬 **完整评论系统**：支持顶级评论和多层回复
- 👥 **用户体验**：评论作者信息展示，实时创建时间
- 📄 **分页查询**：支持评论列表分页，性能优化
- 🛡️ **权限控制**：用户删除自己评论，管理员全局管理

## 🛠 技术栈

### 后端技术
- **语言**: Go 1.21+
- **框架**: Gin (Web框架)
- **数据库**: MySQL + GORM (ORM)
- **缓存**: Redis (计划中)
- **认证**: JWT (JSON Web Token)
- **密码**: bcrypt 加密

### 前端技术（基于原项目使用Cursor跑的）
- **框架**: Vue.js 3
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **路由**: Vue Router

### 开发工具
- **依赖管理**: Go Modules
- **API测试**: 支持 Postman/Thunder Client
- **版本控制**: Git

## 🏗 架构设计

项目采用经典的三层架构模式：

```
┌─────────────────────────────────────────┐
│              前端层 (Frontend)            │
│         Vue.js + Vite + Axios          │
└─────────────────────────────────────────┘
                    │ HTTP/JSON
┌─────────────────────────────────────────┐
│             控制器层 (Controller)         │
│        HTTP请求处理、参数验证、响应        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│              服务层 (Service)            │
│        业务逻辑、数据验证、业务规则        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│             仓库层 (Repository)          │
│          数据访问、数据库操作            │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│              数据层 (Database)           │
│            MySQL + Redis               │
└─────────────────────────────────────────┘
```

### 核心设计原则
- **单一职责原则**: 每层只负责特定的功能
- **依赖倒置**: 上层依赖抽象，不依赖具体实现
- **接口隔离**: 定义清晰的接口边界
- **开闭原则**: 对扩展开放，对修改封闭

## ✨ 功能特性

### 🔐 用户认证与授权
- [x] 用户注册/登录
- [x] JWT令牌认证
- [x] 角色权限控制 (管理员/普通用户)
- [x] 密码安全加密
- [x] 多字段登录支持 (用户名/邮箱/手机号)

### 👤 用户管理
- [x] 个人资料管理
- [x] 个人主页展示
- [x] 用户信息更新
- [x] 个人签名和介绍

### 📝 内容管理
- [x] 文章发布与编辑
- [x] 文章删除功能
- [x] 文章列表查看
- [x] 文章详情展示
- [x] 文章点赞功能
- [x] 评论系统
- [x] 评论回复功能
- [x] 评论分页查询
- [x] 评论权限控制
- [ ] 高级点赞系统 (计划中)

### 💰 钱包系统
- [x] 多币种钱包创建
- [x] 钱包信息管理
- [x] 钱包状态控制
- [x] 多币种余额管理
- [x] 充值功能
- [x] 提现功能
- [x] 汇率兑换功能
- [x] 账单记录与查询
- [x] 余额查询（全部/单币种）
- [x] 转账功能

### 📊 汇率服务
- [x] 实时汇率查询
- [x] 汇率数据管理
- [x] 多币种支持

## 📁 项目结构

```
Exchangeapp_backend
├── 📁 config/
│   ├── 🐹 config.go
│   ├── ⚙️ config.yml
│   ├── 🐹 db.go
│   └── 🐹 redis.go
├── 📁 controllers/
│   ├── 🐹 article_controllers.go
│   ├── 🐹 auth_controllers.go
│   ├── 🐹 bill_controller.go
│   ├── 🐹 comment_controllers.go
│   ├── 🐹 exchange_rate_controllers.go
│   ├── 🐹 homepage_controller.go
│   ├── 🐹 like_controllers.go
│   └── 🐹 wallet_controller.go
├── 📁 di/
│   └── 🐹 container.go
├── 📁 dto/
│   ├── 🐹 article_dto.go
│   ├── 🐹 bill_dto.go
│   ├── 🐹 comment_dto.go
│   ├── 🐹 homepage_dto.go
│   └── 🐹 wallet_dto.go
├── 📁 global/
│   └── 🐹 global.go
├── 📁 input/
│   ├── 🐹 article_input.go
│   ├── 🐹 comment_input.go
│   ├── 🐹 homepage_input.go
│   └── 🐹 wallet_input.go
├── 📁 middlewares/
│   └── 🐹 auth_middleware.go
├── 📁 models/
│   ├── 🐹 article.go
│   ├── 🐹 comment.go
│   ├── 🐹 exchange_rate.go
│   ├── 🐹 user.go
│   └── 🐹 wallet.go
├── 📁 repository/
│   ├── 🐹 article_repository.go
│   ├── 🐹 bill_repository.go
│   ├── 🐹 comment_repository.go
│   ├── 🐹 exchange_rate_repository.go
│   ├── 🐹 user_repository.go
│   └── 🐹 wallet_repsitory.go
├── 📁 router/
│   └── 🐹 router.go
├── 📁 service/
│   ├── 🐹 article_service.go
│   ├── 🐹 bill_service.go
│   ├── 🐹 conmment_service.go
│   ├── 🐹 exchange_rate_service.go
│   ├── 🐹 homepage_service.go
│   ├── 🐹 like_service.go
│   ├── 🐹 user_service.go
│   └── 🐹 wallet.service.go
├── 📁 utils/
│   ├── 🐹 auth.go
│   ├── 🐹 common.go
│   ├── 🐹 converter.go
│   ├── 🐹 errors.go
│   ├── 🐹 utils.go
│   ├── 🐹 validator.go
│   └── 🐹 wallet.go
├── 🐹 go.mod
├── 🐹 go.sum
├── 🐹 main.go
└── 📝 完整API测试用例.md
```

## 📚 API文档

### 认证相关
```http
POST /api/auth/register    # 用户注册
POST /api/auth/login       # 用户登录
```

### 文章管理
```http
GET    /api/articles       # 获取文章列表
POST   /api/articles       # 创建文章
GET    /api/articles/:id   # 获取文章详情
PUT    /api/articles/:id   # 更新文章
DELETE /api/articles/:id   # 删除文章
```

### 钱包管理
```http
POST /api/wallets                    # 创建钱包
GET  /api/wallets                    # 获取钱包信息
PUT  /api/wallets                    # 更新钱包信息

# 余额管理
POST /api/wallets/balance            # 创建新币种余额
GET  /api/wallets/balances           # 获取所有币种余额
GET  /api/wallets/balance/:currency  # 获取特定币种余额

# 交易功能
POST /api/wallets/deposit            # 充值
POST /api/wallets/withdraw           # 提现
POST /api/wallets/exchange           # 货币兑换

# 账单查询
GET  /api/wallets/bills              # 获取账单列表 (支持分页)
GET  /api/wallets/bills/:id          # 获取特定账单详情
```

### 汇率服务
```http
GET  /api/exchangeRates    # 获取汇率列表
POST /api/exchangeRates    # 创建汇率 (管理员)
```

### 用户主页
```http
GET /api/users/:username   # 获取用户主页
PUT /api/users/:username   # 更新用户资料
```

### 评论系统
```http
POST /api/comments                    # 创建评论（顶级评论或回复）
GET  /api/articles/:id/comments       # 获取文章评论（支持分页）
GET  /api/comments/:id/replies        # 获取评论的回复
DELETE /api/comments/:id              # 删除单个评论
DELETE /api/articles/:id/comments     # 删除文章所有评论（作者+管理员）
```

## 🎯 开发计划

### 近期目标 (v1.1)
- [x] **钱包交易系统** ✅ (已完成)
  - [x] 充值功能实现
  - [x] 提现功能实现
  - [x] 余额查询优化
  - [x] 交易记录管理

- [x] **汇率兑换系统** ✅ (已完成)
  - [x] 实时汇率兑换
  - [x] 兑换历史记录

- [x] **P2P转账系统**
  - [x] 用户间转账
  - [x] 转账记录追踪

### 中期目标 (v1.2)
- [x] **评论系统** ✅ (已完成)
  - [x] 文章评论功能
  - [x] 评论回复功能
  - [x] 评论分页查询
  - [x] 评论权限控制
  - [ ] 评论点赞系统 (计划中)

### 长期目标 (v2.0)
  - [ ] **高级点赞系统**
  - [ ] 防重复点赞
  - [ ] 点赞数据统计
  - [ ] 点赞用户列表

- [ ] **Redis缓存系统**
  - [ ] 热点数据缓存
  - [ ] 会话管理优化
  - [ ] 性能提升

## 🔧 开发规范

### 代码规范
- 遵循Go官方代码规范
- 统一的注释格式：`// FunctionName 功能描述`
- 统一的日志格式：`log.Printf("[ModuleName] 操作描述: %v", 参数)`

## 🙏 致谢

本项目的诞生离不开 **Slumhee** 提供的优秀教程，它为我的学习之路提供了坚实的基础和清晰的指引。在此对原作者的无私分享和精彩讲解表示最衷心的感谢！

- **原项目教程仓库**: [https://github.com/Slumhee/Web003Gin-01_gingormtutorials](https://github.com/Slumhee/Web003Gin-01_gingormtutorials)

## 📄 许可证

本项目中由我个人添加及修改的部分，采用 MIT License 开源许可证。原项目代码的版权归原作者 **Slumhee** 所有。

---

**项目状态**: 🎉 核心功能完成，钱包系统+评论系统全面上线