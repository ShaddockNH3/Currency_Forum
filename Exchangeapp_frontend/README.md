# 蓝鼠兑换前端应用

这是一个基于Vue 3 + TypeScript + Element Plus的现代化前端应用，提供货币兑换、财经资讯、钱包管理等功能。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Element Plus** - 基于Vue 3的组件库
- **Vite** - 快速的前端构建工具
- **Pinia** - Vue的状态管理库
- **Vue Router** - Vue.js官方路由管理器
- **Axios** - HTTP客户端

## 功能特性

### 🔐 用户认证
- 用户注册和登录
- JWT token认证
- 角色权限管理（普通用户/管理员）

### 💱 货币兑换
- 实时汇率查询
- 货币兑换计算器
- 汇率管理（管理员功能）

### 📰 财经资讯
- 文章发布和管理
- 文章点赞功能
- 分页浏览

### 💰 钱包管理
- 数字钱包创建和管理
- 多货币支持
- 钱包状态管理

### 👤 用户中心
- 个人资料管理
- 文章管理
- 用户权限控制

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Login.vue       # 登录组件
│   ├── Register.vue    # 注册组件
│   ├── ArticleForm.vue # 文章表单
│   └── ExchangeRateForm.vue # 汇率表单
├── views/              # 页面组件
│   ├── HomeView.vue    # 首页
│   ├── NewsView.vue    # 新闻列表
│   ├── NewsDetailView.vue # 新闻详情
│   ├── CurrencyExchangeView.vue # 货币兑换
│   ├── UserProfileView.vue # 用户资料
│   └── WalletView.vue  # 钱包管理
├── store/              # 状态管理
│   └── auth.ts         # 认证状态
├── router/             # 路由配置
│   └── index.ts        # 路由定义
├── types/              # TypeScript类型定义
│   └── Article.d.ts    # 文章相关类型
├── axios.ts            # HTTP客户端配置
└── main.ts             # 应用入口
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境配置

### 后端API配置

在 `src/axios.ts` 中配置后端API地址：

```typescript
const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // 修改为你的后端地址
  timeout: 10000,
});
```

### 环境变量

创建 `.env.local` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 使用说明

### 1. 用户注册/登录
- 访问 `/register` 注册新账户
- 访问 `/login` 登录现有账户
- 登录后自动获取JWT token

### 2. 货币兑换
- 访问 `/exchange` 查看汇率和进行兑换计算
- 管理员可以添加/编辑汇率信息

### 3. 财经资讯
- 访问 `/news` 浏览文章列表
- 登录用户可以发布新文章
- 支持文章编辑、删除和点赞

### 4. 钱包管理
- 访问 `/wallets` 管理数字钱包
- 创建、编辑、删除钱包
- 设置钱包状态和默认货币

### 5. 用户中心
- 访问 `/users/:username` 查看用户资料
- 管理个人文章和设置

## 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建新的Vue组件
2. 使用TypeScript和Composition API
3. 遵循Element Plus设计规范

### 添加新页面

1. 在 `src/views/` 目录下创建页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 更新导航菜单

### 状态管理

使用Pinia进行状态管理：

```typescript
import { defineStore } from 'pinia';

export const useMyStore = defineStore('my', () => {
  // 状态定义
  const state = ref({});
  
  // 操作方法
  const actions = () => {};
  
  return { state, actions };
});
```

### API调用

使用配置好的axios实例：

```typescript
import axios from '../axios';

const response = await axios.get('/api/endpoint');
```

## 部署

### 构建

```bash
npm run build
```

### 部署到静态服务器

将 `dist` 目录部署到任何静态文件服务器。

### Docker部署

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 注意事项

1. **CORS配置**: 确保后端正确配置CORS以允许前端访问
2. **JWT Token**: 前端自动处理token的存储和请求头设置
3. **权限控制**: 根据用户角色显示/隐藏相应功能
4. **响应式设计**: 支持移动端和桌面端

## 故障排除

### 常见问题

1. **API连接失败**: 检查后端服务是否启动，API地址是否正确
2. **认证失败**: 检查JWT token是否有效，后端认证中间件是否正常
3. **组件不显示**: 检查路由配置和组件导入是否正确

### 调试技巧

- 使用浏览器开发者工具查看网络请求
- 检查控制台错误信息
- 使用Vue DevTools调试组件状态

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

本项目采用MIT许可证。
