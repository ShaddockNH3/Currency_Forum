# 迷你货币论坛 (Mini Currency Forum)

![Go Version](https://img.shields.io/badge/Go-1.22+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📖 关于项目 (About This Project)

这是一个我用来学习和实践 Go + Vue 全栈开发技术的个人项目，旨在实现一个围绕“货币”主题，集资讯、讨论与模拟交易于一体的迷你论坛。

本项目深度学习并参考了 Bilibili UP 主及 GitHub 作者 **Slumhee** 的优秀教程，具体信息请见文末的“致谢”部分。

### 项目现状 (Current Status)
作为学习和探索的过程，本仓库的当前状态如下：
* **后端 (Backend)**: **已全部由我个人为学习和理解而逐行手打复现并进行大量重构**。通过这个过程，我深入学习并实践了 Gin 框架、GORM、JWT 认证、数据库事务、Redis 缓存以及分层的项目架构。

## ✨ 核心功能 (Core Features)

### 👤 用户与认证系统 (User & Authentication System)
* **基础认证**: 实现了完整的用户 **注册** 与 **登录** 流程，并基于 `JWT` 进行会话管理。
* **角色权限**: 构建了基于角色的访问控制 (RBAC)，区分 **管理员 (Admin)** 与 **普通用户 (User)** 两种角色。
* **个人主页**: 每位用户拥有独立的个人主页，能够返回用户的公开信息（签名、简介）及其发布过的文章列表（支持分页）。

### 📰 论坛与内容模块 (Forum & Content Module)
* **文章管理 (CRUD)**: 用户可以发布、编辑、删除自己的文章。管理员则拥有管理所有文章的权限。
* **内容互动**: 实现了基础的文章“点赞”功能。

### 💸 核心金融与交易系统 (Core Financial & Transaction System)
*这是一个完全模拟的、不涉及真实货币的内部交易系统，旨在提供有趣和有教育意义的体验。*
* **多币种钱包**: 每位用户拥有一个可以持有多种货币（如 USD, JPY）的个人钱包。
* **资金操作 (模拟)**: 用户可以向自己的钱包进行 **充值 (Deposit)** 和 **提现 (Withdraw)** 操作。
* **货币兑换 (Exchange)**: 用户可以根据系统内设定的汇率，在不同货币之间进行兑换。
* **用户间交易 (P2P Trading)**: 实现了用户之间互相转账的功能。
* **交易记录**: 所有的资金变动都会被记录下来，形成清晰的个人账单。

## 🛠️ 技术栈 (Technology Stack)

* **后端 (Backend)**: Go, Gin, Gorm
* **数据库 (Database)**: MySQL
* **缓存 (Cache)**: Redis
* **认证 (Authentication)**: JWT

## 🏛️ 项目架构 (Project Architecture)

本项目后端采用分层清晰的架构模式，将不同职责的代码解耦到独立的包中，以提高代码的可维护性和可扩展性。

```
/Exchangeapp_backend
├── 📁 config/
│   ├── 🐹 config.go
│   ├── ⚙️ config.yml
│   ├── 🐹 db.go
│   └── 🐹 redis.go
├── 📁 controllers/
│   ├── 📁 wallet_controllers/
│   │   ├── 🐹 bills.go
│   │   ├── 🐹 exchange.go
│   │   ├── 🐹 trade.go
│   │   └── 🐹 wallet.go
│   ├── 🐹 article_controllers.go
│   ├── 🐹 auth_controllers.go
│   ├── 🐹 exchange_rate_controllers.go
│   ├── 🐹 homepage_controller.go
│   └── 🐹 like_controllers.go
├── 📁 dto/
│   ├── 🐹 article_dto.go
│   ├── 🐹 homepage_dto.go
│   └── 🐹 wallet_dto.go
├── 📁 global/
│   └── 🐹 global.go
├── 📁 input/
│   ├── 🐹 article_input.go
│   ├── 🐹 homepage_input.go
│   └── 🐹 wallet_input.go
├── 📁 middlewares/
│   └── 🐹 auth_middleware.go
├── 📁 models/
│   ├── 🐹 article.go
│   ├── 🐹 exchange_rate.go
│   ├── 🐹 user.go
│   └── 🐹 wallet.go
├── 📁 router/
│   └── 🐹 router.go
├── 📁 services/
│   └── 🐹 bill_service.go
├── 📁 utils/
│   ├── 🐹 dto_converter.go
│   ├── 🐹 user_utils.go
│   └── 🐹 utils.go
├── 🐹 go.mod
├── 🐹 go.sum
└── 🐹 main.go
```

## 🚀 未来蓝图 (Future Roadmap)

在当前已实现功能的基础上，我为项目的未来发展规划了清晰的路线图。

-   [ ] **社区化与互动功能 (Community & Interaction)**
    -   [ ] **评论系统**: 允许用户对文章进行评论和回复，形成讨论氛围。
    -   [ ] **权限**：允许文章发布者以及管理员对文章的评论进行删除
    -   [ ] **内容发现**: 实现文章的模糊搜索功能。
-   [ ] **待进行**

## 🙏 致谢 (Acknowledgements)

本项目的诞生离不开 **Slumhee** 提供的优秀教程，它为我的学习之路提供了坚实的基础和清晰的指引。在此对原作者的无私分享和精彩讲解表示最衷心的感谢！

* **原项目教程仓库**: [https://github.com/Slumhee/Web003Gin-01_gingormtutorials](https://github.com/Slumhee/Web003Gin-01_gingormtutorials)

## 📄 许可证 (License)

本项目中由我个人添加及修改的部分，采用 [MIT License](LICENSE) 开源许可证。原项目代码的版权归原作者 **Slumhee** 所有。
