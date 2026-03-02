# Auth 模块文档

## 1. 模块概述

Auth 模块是 Collection System 的认证和用户管理核心模块，提供了完整的用户认证、授权和管理功能。该模块采用 RESTful API 设计风格，支持基于 JWT 的认证机制和基于角色的访问控制（RBAC）。

## 2. 功能特性

- ✅ 用户注册与登录
- ✅ JWT 令牌认证
- ✅ 基于角色的访问控制（RBAC）
- ✅ 用户信息管理（CRUD 操作）
- ✅ 密码管理
- ✅ 用户状态管理
- ✅ Swagger API 文档
- ✅ 测试环境支持

## 3. 技术栈

- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **JSON Web Token (JWT)** - 认证令牌
- **CORS** - 跨域资源共享
- **Swagger** - API 文档
- **Jest** - 测试框架
- **Mock-fs** - 文件系统模拟（用于测试）
- **Supertest** - HTTP 请求测试

## 4. 安装与配置

### 4.1 依赖安装

```bash
cd /Users/bytedance/src/doubao.ai/trae/collection-system
npm install
```

### 4.2 环境变量

| 变量名 | 默认值 | 描述 |
|-------|-------|------|
| PORT | 3000 | 服务器监听端口 |
| NODE_ENV | - | 运行环境（test/production） |

### 4.3 启动服务器

```bash
# 生产环境
npm start

# 开发环境
npm run dev
```

服务器将在 `http://localhost:3000` 上运行。

## 5. API 端点

### 5.1 认证 API

#### 5.1.1 用户登录

```
POST /api/auth/login
```

**请求体：**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "US001",
    "username": "admin",
    "role": "admin",
    "email": "admin@example.com",
    "status": "active"
  },
  "token": "jwt-token-here"
}
```

#### 5.1.2 获取当前用户信息

```
GET /api/auth/me
```

**认证：** 需要 JWT 令牌

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "US001",
    "username": "admin",
    "role": "admin",
    "email": "admin@example.com",
    "status": "active"
  }
}
```

### 5.2 用户管理 API

#### 5.2.1 获取所有用户（仅管理员）

```
GET /api/users
```

**认证：** 需要管理员 JWT 令牌

**响应：**
```json
{
  "success": true,
  "users": [
    {
      "id": "US001",
      "username": "admin",
      "role": "admin",
      "email": "admin@example.com",
      "status": "active",
      "createdAt": "2026-02-01T00:00:00Z",
      "updatedAt": "2026-02-01T00:00:00Z"
    }
  ]
}
```

#### 5.2.2 创建用户（仅管理员）

```
POST /api/users
```

**认证：** 需要管理员 JWT 令牌

**请求体：**
```json
{
  "username": "newuser",
  "password": "newpassword",
  "role": "user",
  "email": "newuser@example.com"
}
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "US003",
    "username": "newuser",
    "role": "user",
    "email": "newuser@example.com",
    "status": "active",
    "createdAt": "2026-02-09T00:00:00Z",
    "updatedAt": "2026-02-09T00:00:00Z"
  }
}
```

#### 5.2.3 获取单个用户

```
GET /api/users/:id
```

**认证：** 需要 JWT 令牌
**权限：** 管理员或用户自己

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "US001",
    "username": "admin",
    "role": "admin",
    "email": "admin@example.com",
    "status": "active",
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T00:00:00Z"
  }
}
```

#### 5.2.4 更新用户

```
PUT /api/users/:id
```

**认证：** 需要 JWT 令牌
**权限：** 管理员或用户自己

**请求体：**
```json
{
  "email": "updated@example.com",
  "status": "inactive"
}
```

**响应：**
```json
{
  "success": true,
  "user": {
    "id": "US002",
    "username": "kylin",
    "role": "user",
    "email": "updated@example.com",
    "status": "inactive",
    "createdAt": "2026-02-02T00:00:00Z",
    "updatedAt": "2026-02-09T00:00:00Z"
  }
}
```

#### 5.2.5 删除用户（仅管理员）

```
DELETE /api/users/:id
```

**认证：** 需要管理员 JWT 令牌

**响应：**
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

#### 5.2.6 更改密码

```
POST /api/users/:id/change-password
```

**认证：** 需要 JWT 令牌
**权限：** 仅用户自己

**请求体：**
```json
{
  "oldPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**响应：**
```json
{
  "success": true,
  "message": "密码更改成功"
}
```

### 5.3 API 文档

#### 5.3.1 Swagger UI

```
GET /api-docs
```

提供交互式 API 文档界面。

#### 5.3.2 Swagger JSON

```
GET /api-docs.json
```

提供 API 文档的 JSON 格式。

## 6. 认证与授权机制

### 6.1 JWT 认证

- 用户登录后获取 JWT 令牌
- 后续请求需在 `Authorization` 头中携带令牌：`Authorization: Bearer {token}`
- 令牌有效期为 24 小时

### 6.2 基于角色的访问控制（RBAC）

系统支持两种角色：

#### 6.2.1 管理员（admin）
- 可以访问所有 API 端点
- 可以创建、更新、删除所有用户
- 可以查看所有用户信息

#### 6.2.2 普通用户（user）
- 只能访问自己的信息
- 只能更新自己的信息
- 只能更改自己的密码

### 6.3 测试环境认证

在测试环境下（`NODE_ENV=test`），可以通过以下方式简化认证：

```
Authorization: Bearer role:id
```

例如：
- 管理员：`Authorization: Bearer admin:US001`
- 普通用户：`Authorization: Bearer user:US002`

## 7. 数据模型

### 7.1 用户模型

```json
{
  "id": "US001",
  "username": "admin",
  "password": "admin",
  "role": "admin",
  "email": "admin@example.com",
  "status": "active",
  "createdAt": "2026-02-01T00:00:00Z",
  "updatedAt": "2026-02-01T00:00:00Z"
}
```

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | string | 用户唯一标识 |
| username | string | 用户名 |
| password | string | 密码（实际项目中应加密存储） |
| role | string | 用户角色（admin/user） |
| email | string | 用户邮箱 |
| status | string | 用户状态（active/inactive） |
| createdAt | string | 创建时间 |
| updatedAt | string | 更新时间 |

## 8. 测试

### 8.1 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx jest tests/auth/api.test.js
```

### 8.2 测试覆盖

测试覆盖了以下场景：
- 用户登录（正确/错误凭据）
- 用户信息获取（管理员/普通用户）
- 用户创建、更新、删除（权限控制）
- 密码更改（正确/错误旧密码）
- 测试环境认证

## 9. 注意事项

1. **密码安全**：当前版本中密码以明文存储，生产环境中应使用 bcryptjs 等库进行加密
2. **环境配置**：确保在不同环境下使用正确的配置（端口、密钥等）
3. **错误处理**：API 已实现基本错误处理，但可根据需要进一步增强
4. **日志记录**：建议在生产环境中添加日志记录功能
5. **CORS 配置**：当前允许所有跨域请求，生产环境中应限制为特定域名

## 10. 版本历史

### v1.0.0 (2026-02-09)
- 初始版本
- 实现用户认证和管理功能
- 支持 JWT 认证
- 实现基于角色的访问控制
- 添加 Swagger API 文档
- 编写完整测试用例