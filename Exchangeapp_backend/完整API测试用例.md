# Currency Forum API 完整测试用例

## 服务器信息
- **URL**: `http://localhost:3000`
- **端口**: 3000

## 🔄 测试流程

### 第一步：准备测试账户

#### 1.1 注册管理员账户
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "admin_test",
  "password": "Admin123456",
  "email": "admin@test.com", 
  "phone": "13800138000",
  "role": "admin"
}
```

#### 1.2 注册普通用户账户
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "user_test",
  "password": "User123456",
  "email": "user@test.com",
  "phone": "13800138001", 
  "role": "user"
}
```

#### 1.3 注册第二个普通用户（用于权限测试）
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "user_test2", 
  "password": "User123456",
  "email": "user2@test.com",
  "phone": "13800138002",
  "role": "user"
}
```

### 第二步：获取认证Token

#### 2.1 管理员登录
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "loginField": "admin_test",
  "password": "Admin123456"
}
```
**保存返回的token作为 ADMIN_TOKEN**

#### 2.2 普通用户1登录
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "loginField": "user_test",
  "password": "User123456"
}
```
**保存返回的token作为 USER_TOKEN**

#### 2.3 普通用户2登录
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "loginField": "user_test2",
  "password": "User123456"
}
```
**保存返回的token作为 USER2_TOKEN**

---

## 📈 汇率管理API测试

### 3.1 查看汇率（无需认证）
```http
GET http://localhost:3000/api/exchangeRates
```

### 3.2 管理员创建汇率 ✅
```http
POST http://localhost:3000/api/exchangeRates
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "USD",
  "toCurrency": "CNY",
  "rate": 7.2,
  "description": "美元对人民币汇率"
}
```

### 3.3 管理员创建第二个汇率
```http
POST http://localhost:3000/api/exchangeRates
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "EUR",
  "toCurrency": "CNY",
  "rate": 8.5,
  "description": "欧元对人民币汇率"
}
```

### 3.4 管理员创建第三个汇率
```http
POST http://localhost:3000/api/exchangeRates
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "JPY",
  "toCurrency": "CNY",
  "rate": 0.05,
  "description": "日元对人民币汇率"
}
```

### 3.5 普通用户尝试创建汇率 ❌（应该返回403）
```http
POST http://localhost:3000/api/exchangeRates
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "GBP",
  "toCurrency": "CNY",
  "rate": 9.2,
  "description": "英镑对人民币汇率"
}
```

### 3.6 管理员更新汇率 ✅
```http
PUT http://localhost:3000/api/exchangeRates/1
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "USD",
  "toCurrency": "CNY",
  "rate": 7.3,
  "description": "美元对人民币汇率（更新）"
}
```

### 3.7 普通用户尝试更新汇率 ❌（应该返回403）
```http
PUT http://localhost:3000/api/exchangeRates/1
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "USD",
  "toCurrency": "CNY",
  "rate": 7.4,
  "description": "普通用户尝试更新"
}
```

---

## 📝 文章管理API测试

### 4.1 用户1创建文章
```http
POST http://localhost:3000/api/articles
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "title": "Bitcoin投资指南",
  "content": "比特币作为数字货币之王，其投资价值不言而喻。本文将详细介绍比特币投资的基本策略...",
  "preview": "投资理财"
}
```

### 4.2 用户2创建文章
```http
POST http://localhost:3000/api/articles
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "title": "外汇交易心得分享",
  "content": "经过三年的外汇交易实战，我总结了一些宝贵的经验，希望能帮助到新手朋友们...",
  "preview": "外汇交易"
}
```

### 4.3 管理员创建文章
```http
POST http://localhost:3000/api/articles
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "平台公告：新功能上线",
  "content": "亲爱的用户们，我们很高兴地宣布，平台新增了钱包功能，支持多币种管理...",
  "preview": "平台公告"
}
```

### 4.4 获取文章列表
```http
GET http://localhost:3000/api/articles
Authorization: Bearer {USER_TOKEN}
```

### 4.5 获取特定文章
```http
GET http://localhost:3000/api/articles/1
Authorization: Bearer {USER_TOKEN}
```

### 4.6 用户1编辑自己的文章 ✅
```http
PUT http://localhost:3000/api/articles/1
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "title": "Bitcoin投资指南（更新版）",
  "content": "比特币作为数字货币之王，其投资价值不言而喻。本文将详细介绍比特币投资的基本策略，包括技术分析、基本面分析等...",
  "preview": "投资理财"
}
```

### 4.7 用户2尝试编辑用户1的文章 ❌（应该返回403）
```http
PUT http://localhost:3000/api/articles/1
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "title": "恶意修改标题",
  "content": "恶意修改内容",
  "preview": "恶意分类"
}
```

### 4.8 管理员编辑任何文章 ✅
```http
PUT http://localhost:3000/api/articles/2
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "title": "外汇交易心得分享（管理员审核版）",
  "content": "经过三年的外汇交易实战，我总结了一些宝贵的经验，希望能帮助到新手朋友们...【管理员备注：内容已审核通过】",
  "preview": "外汇交易"
}
```

### 4.9 点赞文章
```http
POST http://localhost:3000/api/articles/1/like
Authorization: Bearer {USER_TOKEN}
```

### 4.10 用户2点赞同一篇文章
```http
POST http://localhost:3000/api/articles/1/like
Authorization: Bearer {USER2_TOKEN}
```

### 4.11 查看文章点赞数
```http
GET http://localhost:3000/api/articles/1/like
Authorization: Bearer {USER_TOKEN}
```

### 4.12 管理员删除文章 ✅
```http
DELETE http://localhost:3000/api/articles/3
Authorization: Bearer {ADMIN_TOKEN}
```

### 4.13 普通用户尝试删除别人的文章 ❌
```http
DELETE http://localhost:3000/api/articles/2
Authorization: Bearer {USER_TOKEN}
```

---

## 👤 用户资料管理API测试

### 5.1 获取用户1主页
```http
GET http://localhost:3000/api/users/user_test
Authorization: Bearer {USER_TOKEN}
```

### 5.2 获取用户2主页
```http
GET http://localhost:3000/api/users/user_test2
Authorization: Bearer {USER2_TOKEN}
```

### 5.3 用户1更新自己的资料
```http
PUT http://localhost:3000/api/users/user_test
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "username": "user_test",
  "email": "user_new@test.com",
  "phone": "13900139001",
  "signature": "专注数字货币投资三年，分享实战经验",
  "introduction": "大家好，我是一名数字货币投资爱好者，喜欢分析市场趋势和技术指标。欢迎大家一起交流学习！"
}
```

### 5.4 用户2更新自己的资料
```http
PUT http://localhost:3000/api/users/user_test2
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "username": "user_test2",
  "email": "user2_new@test.com",
  "phone": "13900139002",
  "signature": "外汇交易老司机，稳健盈利第一",
  "introduction": "从事外汇交易五年，主要研究技术分析和风险控制。愿与志同道合的朋友交流心得。"
}
```

---

## 💰 钱包功能API测试

### 6.1 用户1创建钱包
```http
POST http://localhost:3000/api/wallets
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "wallet_name": "我的投资钱包",
  "wallet_description": "用于数字货币和外汇投资的专用钱包",
  "default_currency": "USD"
}
```

### 6.2 用户2创建钱包
```http
POST http://localhost:3000/api/wallets
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "wallet_name": "交易专用钱包",
  "wallet_description": "外汇交易专用钱包，支持多币种",
  "default_currency": "EUR"
}
```

### 6.3 用户1获取钱包信息
```http
GET http://localhost:3000/api/wallets
Authorization: Bearer {USER_TOKEN}
```

### 6.4 用户1更新钱包信息
```http
PUT http://localhost:3000/api/wallets
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "wallet_name": "我的全球投资钱包",
  "wallet_description": "用于全球数字货币和外汇投资的多币种钱包",
  "default_currency": "CNY"
}
```

### 6.5 用户1手动创建EUR余额
```http
POST http://localhost:3000/api/wallets/balance
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "currency_code": "EUR",
  "amount": "0"
}
```

### 6.6 用户1手动创建JPY余额
```http
POST http://localhost:3000/api/wallets/balance
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "currency_code": "JPY",
  "amount": "0"
}
```

---

## 💳 钱包交易API测试

### 7.1 用户1充值USD
```http
POST http://localhost:3000/api/wallets/deposit
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "10000",
  "currency_code": "USD",
  "description": "初始资金投入"
}
```

### 7.2 用户1充值EUR
```http
POST http://localhost:3000/api/wallets/deposit
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "5000",
  "currency_code": "EUR",
  "description": "欧元投资资金"
}
```

### 7.3 用户2充值EUR
```http
POST http://localhost:3000/api/wallets/deposit
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "amount": "8000",
  "currency_code": "EUR",
  "description": "交易启动资金"
}
```

### 7.4 用户1取出部分USD
```http
POST http://localhost:3000/api/wallets/withdraw
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "1000",
  "currency_code": "USD",
  "description": "部分提现用于生活开支"
}
```

### 7.5 用户1货币兑换：USD转CNY
```http
POST http://localhost:3000/api/wallets/exchange
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "2000",
  "from_currency": "USD",
  "to_currency": "CNY",
  "description": "美元兑换人民币进行国内投资"
}
```

### 7.6 用户1货币兑换：EUR转JPY
```http
POST http://localhost:3000/api/wallets/exchange
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "1000",
  "from_currency": "EUR",
  "to_currency": "JPY",
  "description": "欧元兑换日元布局日本市场"
}
```

### 7.7 用户2取出EUR（测试余额不足）
```http
POST http://localhost:3000/api/wallets/withdraw
Authorization: Bearer {USER2_TOKEN}
Content-Type: application/json

{
  "amount": "10000",
  "currency_code": "EUR",
  "description": "尝试超额提现"
}
```

---

## 📊 余额查询API测试

### 8.1 用户1获取所有余额
```http
GET http://localhost:3000/api/wallets/balances
Authorization: Bearer {USER_TOKEN}
```

### 8.2 用户1获取USD余额
```http
GET http://localhost:3000/api/wallets/balance/USD
Authorization: Bearer {USER_TOKEN}
```

### 8.3 用户1获取CNY余额
```http
GET http://localhost:3000/api/wallets/balance/CNY
Authorization: Bearer {USER_TOKEN}
```

### 8.4 用户2获取所有余额
```http
GET http://localhost:3000/api/wallets/balances
Authorization: Bearer {USER2_TOKEN}
```

---

## 📋 账单查询API测试

### 9.1 用户1获取账单列表（第1页）
```http
GET http://localhost:3000/api/wallets/bills?page=1&page_size=5
Authorization: Bearer {USER_TOKEN}
```

### 9.2 用户1获取账单列表（第2页）
```http
GET http://localhost:3000/api/wallets/bills?page=2&page_size=5
Authorization: Bearer {USER_TOKEN}
```

### 9.3 用户1获取所有账单
```http
GET http://localhost:3000/api/wallets/bills?page=1&page_size=20
Authorization: Bearer {USER_TOKEN}
```

### 9.4 用户1获取特定账单
```http
GET http://localhost:3000/api/wallets/bills/1
Authorization: Bearer {USER_TOKEN}
```

### 9.5 用户2尝试查看用户1的账单 ❌（应该返回403）
```http
GET http://localhost:3000/api/wallets/bills/1
Authorization: Bearer {USER2_TOKEN}
```

### 9.6 用户2获取自己的账单
```http
GET http://localhost:3000/api/wallets/bills?page=1&page_size=10
Authorization: Bearer {USER2_TOKEN}
```

---

## 🚫 权限边界测试

### 10.1 无Token访问受保护接口 ❌
```http
GET http://localhost:3000/api/wallets
```

### 10.2 无效Token访问 ❌
```http
GET http://localhost:3000/api/wallets
Authorization: Bearer invalid_token_12345
```

### 10.3 普通用户删除汇率 ❌
```http
DELETE http://localhost:3000/api/exchangeRates/1
Authorization: Bearer {USER_TOKEN}
```

### 10.4 管理员删除汇率 ✅
```http
DELETE http://localhost:3000/api/exchangeRates/2
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 🔍 异常情况测试

### 11.1 重复注册用户名
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "user_test",
  "password": "User123456",
  "email": "duplicate@test.com",
  "phone": "13800138999",
  "role": "user"
}
```

### 11.2 错误的登录信息
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "user_test",
  "password": "WrongPassword"
}
```

### 11.3 获取不存在的文章
```http
GET http://localhost:3000/api/articles/999
Authorization: Bearer {USER_TOKEN}
```

### 11.4 无效的汇率数据
```http
POST http://localhost:3000/api/exchangeRates
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "fromCurrency": "",
  "toCurrency": "CNY",
  "rate": -1,
  "description": "无效汇率测试"
}
```

### 11.5 无效的充值金额
```http
POST http://localhost:3000/api/wallets/deposit
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "amount": "-100",
  "currency_code": "USD",
  "description": "负数充值测试"
}
```

---

## ✅ 测试验证要点

### 权限验证
- ✅ 管理员可以管理汇率，普通用户不能
- ✅ 用户只能编辑自己的文章，管理员可以编辑任何文章
- ✅ 钱包和账单数据完全隔离
- ✅ 无Token或无效Token被正确拒绝

### 功能验证
- ✅ 注册登录流程完整
- ✅ JWT Token认证机制正常
- ✅ 钱包多币种支持
- ✅ 货币兑换功能正常
- ✅ 账单记录完整准确
- ✅ 分页查询正常工作

### 数据验证
- ✅ 密码强度验证
- ✅ 余额不足时正确阻止取出
- ✅ 输入数据格式验证
- ✅ 重复操作防护

---

## 📈 测试结果期望

每个API调用都应该返回相应的HTTP状态码：
- **200**: 成功操作
- **201**: 创建成功
- **400**: 请求参数错误
- **401**: 未认证
- **403**: 权限不足
- **404**: 资源不存在
- **409**: 冲突（如重复注册）

测试完成后，您应该验证：
1. 所有权限控制正确生效
2. 所有业务功能正常运行
3. 数据完整性和一致性
4. 错误处理机制完善
