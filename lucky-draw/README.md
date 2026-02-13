# 🎊 企业年会互动抽奖系统

一个具有浓厚春节氛围的企业年会互动网站，支持扫码登录、随机抽奖红包、实时在线统计等功能。

## ✨ 功能特性

### 核心功能
- 📱 **扫码登录**：基于二维码的用户快速注册与登录
- 🧧 **红包抽奖**：点击触发式随机抽奖系统
- 🎉 **红包动画**：精美的红包动态掉落效果
- 📊 **实时统计**：在线人数、中奖名单实时更新
- 🏆 **排行榜**：中奖金额排行榜展示
- 🎆 **烟花特效**：中奖时触发烟花庆祝动画

### 界面设计
- 🏮 **春节主题**：红灯笼、中国结、祥云等传统元素
- 🎨 **喜庆配色**：中国红 + 金色主色调
- 📱 **响应式布局**：完美适配移动端、平板、桌面
- ✨ **流畅动画**：Framer Motion 驱动的交互动画

### 技术特性
- 🔒 **安全认证**：JWT + bcrypt 密码加密
- 🛡️ **防作弊**：请求限流、状态验证
- ⚡ **高性能**：支持 200+ 人同时在线
- 🔌 **实时通信**：Socket.io WebSocket 连接

## 🏗️ 技术栈

### 前端
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Socket.io Client
- Zustand (状态管理)
- React Router

### 后端
- Node.js + Express
- Socket.io
- MongoDB + Mongoose
- JWT 认证
- Joi 数据验证

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 5.0

### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd backend && npm install
```

### 环境配置

复制后端环境配置文件：
```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/luckydraw
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 启动 MongoDB

确保 MongoDB 服务正在运行：
```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:frontend  # 前端 http://localhost:3000
npm run dev:backend   # 后端 http://localhost:5000
```

## 📦 生产部署

### 使用 Docker 部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 手动部署

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **启动后端**
```bash
cd backend
NODE_ENV=production npm start
```

3. **配置 Nginx** (可选)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

## 📁 项目结构

```
lucky-draw/
├── frontend/           # 前端项目
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 服务
│   │   ├── store/        # Zustand 状态管理
│   │   └── styles/       # 样式文件
│   ├── package.json
│   └── vite.config.js
├── backend/            # 后端项目
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   ├── socket/       # WebSocket 处理
│   │   └── config/       # 配置文件
│   ├── package.json
│   └── .env
├── docker-compose.yml
└── README.md
```

## 🔌 API 接口

### 用户认证
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `POST /api/users/logout` - 用户退出
- `GET /api/users/profile` - 获取用户信息
- `GET /api/users/users` - 获取用户列表（管理员）

### 抽奖功能
- `POST /api/lottery/participate` - 参与抽奖
- `GET /api/lottery/history` - 获取抽奖记录
- `GET /api/lottery/winners` - 获取中奖名单
- `GET /api/lottery/leaderboard` - 获取排行榜

### 红包管理
- `POST /api/redenvelopes` - 创建红包（管理员）
- `GET /api/redenvelopes` - 获取红包列表（管理员）
- `PATCH /api/redenvelopes/:id/toggle` - 切换红包状态（管理员）

### 活动管理
- `POST /api/activities` - 创建活动（管理员）
- `GET /api/activities` - 获取活动列表（管理员）
- `GET /api/activities/active` - 获取当前活动
- `PATCH /api/activities/:id/status` - 更新活动状态（管理员）

## 🔌 WebSocket 事件

### 客户端发送
- `user:join` - 用户加入
- `user:leave` - 用户离开
- `lottery:trigger` - 触发抽奖
- `lottery:result` - 抽奖结果

### 服务端广播
- `user:online` - 用户上线
- `user:offline` - 用户下线
- `stats:online` - 在线人数统计
- `lottery:started` - 抽奖开始
- `lottery:winner` - 中奖公告
- `redpacket:falling` - 红包掉落
- `firework:exploded` - 烟花绽放

## 🎨 自定义配置

### 修改主题颜色

编辑 `frontend/tailwind.config.js`：

```javascript
theme: {
  extend: {
    colors: {
      'chinese-red': '#C41E3A',
      'imperial-gold': '#D4AF37',
      // 添加更多自定义颜色
    }
  }
}
```

### 修改抽奖概率

编辑后端红包配置或通过管理界面创建红包时设置：
- `winProbability`: 中奖概率 (0-100)
- `minAmount` / `maxAmount`: 金额范围
- `totalPackets`: 红包总数

## 🐛 故障排除

### MongoDB 连接失败
```bash
# 检查 MongoDB 是否运行
brew services list | grep mongo

# 重启 MongoDB
brew services restart mongodb-community
```

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

### Socket.io 连接问题
确保 CORS 配置正确：
```env
CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请联系开发团队。

---

**祝您新年快乐，万事如意！** 🎊🧧🎉
