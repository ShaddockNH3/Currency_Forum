# Currency Forum - 货币论坛系统

一个基于Go语言和Gin框架开发的现代化货币论坛系统，采用三层架构设计，支持多用户角色、钱包管理、汇率查询、文章发布等功能。

## 📋 目录

- [项目概述](#项目概述)
- [开发历程](#开发历程)
- [技术栈](#技术栈)
- [架构设计](#架构设计)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [API文档](#api文档)
- [开发计划](#开发计划)
- [贡献指南](#贡献指南)

## 🎯 项目概述

Currency Forum 是一个专注于货币话题讨论的论坛系统，集成了用户管理、内容发布、钱包系统和汇率查询等功能。项目采用现代化的三层架构设计，确保代码的可维护性和可扩展性。

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

## 🛠 技术栈

### 后端技术
- **语言**: Go 1.21+
- **框架**: Gin (Web框架)
- **数据库**: MySQL + GORM (ORM)
- **缓存**: Redis (计划中)
- **认证**: JWT (JSON Web Token)
- **密码**: bcrypt 加密

### 前端技术
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
- [ ] 评论系统 (开发中)
- [ ] 评论回复 (计划中)
- [ ] 高级点赞系统 (计划中)

### 💰 钱包系统
- [x] 多币种钱包创建
- [x] 钱包信息管理
- [x] 钱包状态控制
- [ ] 充值功能 (开发中)
- [ ] 提现功能 (开发中)
- [ ] P2P转账 (计划中)
- [ ] 汇率兑换 (计划中)

### 📊 汇率服务
- [x] 实时汇率查询
- [x] 汇率数据管理
- [x] 多币种支持

## 📁 项目结构

```
Exchangeapp_backend/
├── 📁 config/                 # 配置文件
│   ├── 🐹 config.go           # 配置加载
│   ├── 📄 config.yml          # 配置文件
│   ├── 🐹 db.go              # 数据库配置
│   └── 🐹 redis.go           # Redis配置
├── 📁 controllers/            # 控制器层
│   ├── 🐹 auth_controllers.go     # 认证控制器
│   ├── 🐹 article_controllers.go  # 文章控制器
│   ├── 🐹 wallet_controller.go    # 钱包控制器
│   ├── 🐹 exchange_rate_controllers.go # 汇率控制器
│   ├── 🐹 homepage_controller.go  # 主页控制器
│   └── 🐹 like_controllers.go     # 点赞控制器
├── 📁 service/                # 服务层
│   ├── 🐹 user_service.go         # 用户服务
│   ├── 🐹 article_service.go      # 文章服务
│   ├── 🐹 wallet.service.go       # 钱包服务
│   ├── 🐹 exchange_rate_service.go # 汇率服务
│   ├── 🐹 homepage_service.go     # 主页服务
│   └── 🐹 like_service.go         # 点赞服务
├── 📁 repository/             # 仓库层
│   ├── 🐹 user_repository.go      # 用户仓库
│   ├── 🐹 article_repository.go   # 文章仓库
│   ├── 🐹 wallet_repsitory.go     # 钱包仓库
│   └── 🐹 exchange_rate_repository.go # 汇率仓库
├── 📁 models/                 # 数据模型
│   ├── 🐹 user.go                 # 用户模型
│   ├── 🐹 article.go              # 文章模型
│   ├── 🐹 wallet.go               # 钱包模型
│   ├── 🐹 bill.go                 # 账单模型
│   └── 🐹 exchange_rate.go        # 汇率模型
├── 📁 dto/                    # 数据传输对象
│   ├── 🐹 article_dto.go          # 文章DTO
│   ├── 🐹 wallet_dto.go           # 钱包DTO
│   └── 🐹 homepage_dto.go         # 主页DTO
├── 📁 input/                  # 输入验证
│   ├── 🐹 article_input.go        # 文章输入
│   ├── 🐹 wallet_input.go         # 钱包输入
│   └── 🐹 homepage_input.go       # 主页输入
├── 📁 utils/                  # 工具类
│   ├── 🐹 auth.go                 # 认证工具
│   ├── 🐹 errors.go               # 错误定义
│   ├── 🐹 validator.go            # 验证工具
│   └── 🐹 converter.go            # 转换工具
├── 📁 middlewares/            # 中间件
│   └── 🐹 auth_middleware.go      # 认证中间件
├── 📁 di/                     # 依赖注入
│   └── 🐹 container.go            # DI容器
├── 📁 router/                 # 路由
│   └── 🐹 router.go               # 路由配置
├── 📁 global/                 # 全局变量
│   └── 🐹 global.go               # 全局配置
└── 🐹 main.go                     # 程序入口
```

## 🚀 快速开始

### 环境要求
- Go 1.21 或更高版本
- MySQL 8.0 或更高版本
- Node.js 16+ (前端开发)
- Git

### 后端启动

1. **克隆项目**
```bash
git clone <repository-url>
cd Currency_Forum/Exchangeapp_backend
```

2. **安装依赖**
```bash
go mod tidy
```

3. **配置数据库**
```yaml
# config/config.yml
database:
  host: localhost
  port: 3306
  username: your_username
  password: your_password
  dbname: currency_forum
  charset: utf8mb4
```

4. **启动服务**
```bash
go run main.go
```

服务将在 `http://localhost:3000` 启动

### 前端启动

```bash
cd Currency_Forum/frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动

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
POST /api/wallets          # 创建钱包
GET  /api/wallets          # 获取钱包信息
PUT  /api/wallets          # 更新钱包信息
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

## 🎯 开发计划

### 近期目标 (v1.1)
- [ ] **钱包交易系统**
  - [ ] 充值功能实现
  - [ ] 提现功能实现
  - [ ] 余额查询优化
  - [ ] 交易记录管理

- [ ] **P2P转账系统**
  - [ ] 用户间转账
  - [ ] 转账记录追踪
  - [ ] 转账手续费计算

- [ ] **汇率兑换系统**
  - [ ] 实时汇率兑换
  - [ ] 兑换手续费
  - [ ] 兑换历史记录

### 中期目标 (v1.2)
- [ ] **评论系统**
  - [ ] 文章评论功能
  - [ ] 评论回复功能
  - [ ] 评论点赞系统

- [ ] **高级点赞系统**
  - [ ] 防重复点赞
  - [ ] 点赞数据统计
  - [ ] 点赞用户列表

- [ ] **Redis缓存系统**
  - [ ] 热点数据缓存
  - [ ] 会话管理优化
  - [ ] 性能提升

### 长期目标 (v2.0)
    暂无

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

**项目状态**: 🚧 积极开发中