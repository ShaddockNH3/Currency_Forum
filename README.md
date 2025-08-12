# 迷你货币论坛

![Go Version](https://img.shields.io/badge/Go-1.22+-blue.svg)
![Vue Version](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📖 关于项目 (About This Project)

这是一个我用来学习和实践全栈开发技术的个人项目，旨在实现一个围绕“货币”主题的迷你论坛。

**本项目严格遵循并学习自 Bilibili UP 主及 GitHub 作者 Slumhee 的优秀教程。** 在此对原作者的无私分享和精彩讲解表示最衷心的感谢！

* **原项目教程仓库**: [https://github.com/Slumhee/Web003Gin-01_gingormtutorials](https://github.com/Slumhee/Web003Gin-01_gingormtutorials)

### 项目现状 (Current Status)

作为学习过程的一部分，本仓库的当前状态如下：

* **后端 (Backend)**: **已全部由我个人为学习和理解而逐行手打复现**。通过这个过程，我深入学习了 Gin 框架的路由、Gorm 的数据库操作、JWT 认证以及整体项目架构。

* **前端 (Frontend)**: **目前阶段，前端代码完全复制粘贴自原项目，此后为对接后端增加的功能，也暂时直接使用AI补全前端功能**。这样做的目的是为了有一个可以快速与我构建的后端进行交互的界面，以便于测试和验证后端功能的正确性。在我的未来计划中，包含了对前端代码的重新学习与复刻。

项目的核心功能包括用户注册、登录、货币兑换模拟、以及新闻文章的查看。

### 🏛️ 项目架构 (Project Architecture)

本项目后端采用分层清晰的架构模式，将不同职责的代码解耦到独立的包中，以提高代码的可维护性和可扩展性。

```
├── config/
│   ├── config.go
│   ├── config.yml
│   ├── db.go
│   └── redis.go
├── controllers/
│   ├── article_controllers.go
│   ├── auth_controllers.go
│   ├── exchange_rate_controllers.go
│   ├── homepage_controller.go
│   ├── like_controllers.go
│   └── wallet_controller.go
├── dto/
│   ├── article_dto.go
│   ├── homepage_dto.go
│   └── wallet_dto.go
├── global/
│   └── global.go
├── input/
│   ├── article_input.go
│   └── homepage_input.go
├── middlewares/
│   └── auth_middleware.go
├── models/
│   ├── article.go
│   ├── exchange_rate.go
│   ├── user.go
│   └── wallet.go
├── router/
│   └── router.go
├── utils/
│   ├── dto_converter.go
│   └── utils.go
├── go.mod
├── go.sum
└── main.go
```

## 🛠️ 技术栈 (Technology Stack)

* **后端 (Backend)**: Go, Gin, Gorm
* **数据库 (Database)**: MySQL
* **缓存 (Cache)**: Redis
* **认证 (Authentication)**: JWT

## 🚀 我的学习成果与未来计划 (My Accomplishments & Future Plans)

在完成了对基础功能的复现后，我基于自己的思考和规划，为项目添加了以下新功能，进一步深化了我的学习。

### ✅ 已完成的里程碑 (Completed Milestones)

第零阶段：基本的补充 (Phase 0: Basement)
-   [x] **实现了完整的用户认证与授权系统**
    -   [x] 构建了基于角色的访问控制 (RBAC)，区分 **管理员 (Admin)** 与 **普通用户 (User)**
-   [x] **实现了核心的文章（新闻）模块**
    -   [x] 允许认证用户发布文章，并记录文章作者
    -   [x] 普通用户**只能**删除自己发布的文章
    -   [x] 管理员**可以**删除任意文章
-   [x] **实现了基础的汇率管理模块**
    -   [x] 仅管理员角色可以创建或删除汇率信息

第一阶段：地基加固与核心功能完善 (Phase 1: Foundation & Core Features)
这个阶段的目标是补完现有模块的功能，让我们的应用成为一个完整、可靠的 CRUD 系统。
 - [x] 文章模块：补完 CRUD 链路
   - [x] 实现文章的 编辑(Update) 功能，允许作者或管理员修改已发布的内容。
 - [x] 用户中心：建立个人空间
   - [x] 实现功能完整的 用户个人主页 接口，能够返回用户的公开信息及其发布过的文章列表。
   - [x] 为用户个人主页的文章列表，实现后端分页(Pagination) 功能。
 - [x] 性能优化：为所有列表实现分页
   - [x] 为公共的文章列表 (GET /articles) 也实现分页功能。
   
   第二阶段：核心“货币兑换”模块 (Phase 2: Core "Currency Exchange" Module)
这是我们应用的灵魂！我们要为用户构建一个完整、安全的模拟货币兑换系统。
 * [x] 用户资产系统：创建“钱包”
   * [x] 设计并创建用户 “钱包/余额” (Wallet/Balance) 的数据模型，用于存储每个用户拥有的不同种类货币的数量。
   * [x] 用户可以自由的更改钱包的基本属性
 * [x] 核心兑换逻辑：实现“交易引擎”
   * [x] 编写核心的 货币兑换业务逻辑，接收源货币、目标货币和兑换金额。
   * [x] 根据数据库中管理员设定的汇率进行计算，并处理汇率不存在或余额不足等错误情况。
   * [x] 设计并创建 “交易记录” (Transaction) 的数据模型，用于永久记录每一笔成功的兑换操作。
   * [x] 实现贸易功能，可以自由存钱取钱以及与其他用户进行交易
 * [x] API 接口：开放“交易柜台”
   * [x] 创建一个安全的 货币兑换 API 接口 (例如 POST /api/exchange)。
   * [x] 在这个接口中，处理用户的兑换请求，并在兑换成功后，原子性地更新用户钱包、创建交易记录。
   * [x] 创建一个 获取用户交易历史 的接口。

### 📝 未来的探索计划 (Future Exploration)

第三阶段：社区化与互动功能 (Phase 3: Community & Interaction)
在核心功能之上，我们要让这个世界“活”起来，让用户之间能够互动。
 * [ ] 评论系统：构建交流的桥梁
   * [ ] 设计并创建 Comment 模型，建立与用户和文章的关联。
   * [ ] 实现 发表评论/回复 与 获取评论列表 的接口。
   * [ ] 实现 删除评论 的权限逻辑（作者和管理员可删）。
 * [ ] 内容发现：让信息井井有条
   * [ ] 实现文章的 模糊搜索 功能（可按标题、内容或作者进行搜索）。

第四阶段：“货币”主题深化与外部世界联动 (Phase 4: Theme Deep Dive & External Integration)
让我们的应用更加真实和强大。
 * [ ] 数据真实化：引入实时汇率
   * [ ] 研究并选择一个免费的第三方 实时汇率 API。
   * [ ] 设计一个定时任务 (Cron Job)，例如每小时自动更新一次数据库中的汇率数据，让我们的“交易引擎”使用更真实的数据。


---

## 📄 许可证 (License)

本项目中由我个人添加及修改的部分，采用 [MIT License](LICENSE) 开源许可证。原项目代码的版权归原作者 **Slumhee** 所有。

---