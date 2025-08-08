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

* **前端 (Frontend)**: **目前阶段，前端代码完全复制粘贴自原项目**。这样做的目的是为了有一个可以快速与我构建的后端进行交互的界面，以便于测试和验证后端功能的正确性。在我的未来计划中，包含了对前端代码的重新学习与复刻。

项目的核心功能包括用户注册、登录、货币兑换模拟、以及新闻文章的查看。

## 🛠️ 技术栈 (Technology Stack)

* **后端 (Backend)**: Go, Gin, Gorm
* **前端 (Frontend)**: Vue.js 3, Vite
* **数据库 (Database)**: MySQL
* **缓存 (Cache)**: Redis
* **认证 (Authentication)**: JWT

## 🚀 我的学习成果与未来计划 (My Accomplishments & Future Plans)

在完成了对基础功能的复现后，我基于自己的思考和规划，为项目添加了以下新功能，进一步深化了我的学习。

### ✅ 已完成的里程碑 (Completed Milestones)

-   [x] **实现了完整的用户认证与授权系统**
    -   [x] 构建了基于角色的访问控制 (RBAC)，区分 **管理员 (Admin)** 与 **普通用户 (User)**
-   [x] **实现了核心的文章（新闻）模块**
    -   [x] 允许认证用户发布文章，并记录文章作者
    -   [x] 普通用户**只能**删除自己发布的文章
    -   [x] 管理员**可以**删除任意文章
-   [x] **实现了基础的汇率管理模块**
    -   [x] 仅管理员角色可以创建或删除汇率信息

### 📝 未来的探索计划 (Future Exploration)
-   [ ] **初步建成了用户中心**
    -   [ ] 实现了基础的个人主页，用于未来展示用户信息
-   [ ] **前端体验优化 (Frontend Refinement)**
    -   [ ] **代码复刻**: 逐步重构并手打复现前端代码，以完全掌握 Vue 3 的精髓。
    -   [ ] **数据分页**: 为文章/新闻列表实现后端分页，优化大量数据下的加载性能。
-   [ ] **核心功能扩展 (Core Feature Expansion)**
    -   [ ] **文章评论系统**: 允许登录用户对文章进行评论和回复。
    -   [ ] **实时汇率**: 对接第三方开放 API，实现真实汇率数据的定时获取与展示。
    -   [ ] **内容编辑功能**: 允许用户在发布后，对自己文章进行编辑更新。
-   [ ] **工程化与部署 (Engineering & Deployment)**
    -   [ ] **单元测试**: 为核心的业务逻辑编写单元测试，保证代码质量。
    -   [ ] **容器化**: 使用 Docker 对前后端应用进行容器化，简化部署流程。
-   [ ] ... 更多激动人心的功能正在构思中！

---

## 📄 许可证 (License)

本项目中由我个人添加及修改的部分，采用 [MIT License](LICENSE) 开源许可证。原项目代码的版权归原作者 **Slumhee** 所有。

---