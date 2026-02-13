# 🚀 部署指南

本文档提供企业年会互动抽奖系统的详细部署说明。

## 目录
- [环境准备](#环境准备)
- [本地部署](#本地部署)
- [Docker 部署](#docker-部署)
- [生产环境部署](#生产环境部署)
- [监控与维护](#监控与维护)

## 环境准备

### 系统要求
- **操作系统**: Linux / macOS / Windows
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 5.0
- **内存**: 至少 2GB
- **磁盘**: 至少 10GB

### 安装 MongoDB

#### Linux (Ubuntu/Debian)
```bash
# 导入 MongoDB 公钥
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# 添加 MongoDB 仓库
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.asc ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 安装 MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS
```bash
# 使用 Homebrew 安装
brew tap mongodb/brew
brew install mongodb-community

# 启动 MongoDB
brew services start mongodb-community
```

#### Windows
下载并安装 MongoDB Community Edition: https://www.mongodb.com/try/download/community

## 本地部署

### 1. 克隆项目
```bash
git clone <repository-url>
cd lucky-draw
```

### 2. 安装依赖
```bash
# 根目录
npm install

# 前端
cd frontend && npm install

# 后端
cd ../backend && npm install
```

### 3. 配置环境变量
```bash
cd backend
cp .env.example .env

# 编辑 .env 文件
nano .env
```

配置以下变量：
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/luckydraw
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
SOCKET_CORS_ORIGIN=http://localhost:3000
```

### 4. 启动服务
```bash
# 返回根目录
cd ..

# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

### 5. 访问应用
- 前端: http://localhost:3000
- 后端 API: http://localhost:5000
- 健康检查: http://localhost:5000/health

## Docker 部署

### 1. 安装 Docker 和 Docker Compose
```bash
# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# macOS
brew install --cask docker
```

### 2. 配置环境变量
```bash
cp .env.example .env

# 编辑环境变量
nano .env
```

### 3. 构建并启动
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 4. 常用命令
```bash
# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 查看服务状态
docker-compose ps

# 删除所有容器
docker-compose down

# 删除所有容器和卷
docker-compose down -v
```

## 生产环境部署

### 使用 Nginx 反向代理

#### 1. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx nginx-extras

# macOS
brew install nginx
```

#### 2. 配置 Nginx
创建配置文件 `/etc/nginx/sites-available/luckydraw`:
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 前端静态文件
    location / {
        proxy_pass http://frontend;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Socket.io 代理
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
```

#### 3. 启用配置
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/luckydraw /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 使用 PM2 管理进程

#### 1. 安装 PM2
```bash
npm install -g pm2
```

#### 2. 创建 PM2 配置
创建 `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'luckydraw-backend',
      script: './backend/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
```

#### 3. 启动应用
```bash
# 启动后端
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启
pm2 restart all

# 停止
pm2 stop all
```

### 配置 SSL 证书

#### 使用 Let's Encrypt (免费)
```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 使用自签名证书（开发环境）
```bash
# 生成私钥
openssl openssl genrsa -out key.pem 2048

# 生成证书
openssl openssl req -new -key key.pem -out cert.pem -days 365 -subj "/CN=localhost"
```

## 监控与维护

### 日志管理
```bash
# 查看应用日志
pm2 logs

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看 MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log
```

### 数据库备份
```bash
# 备份数据库
mongodump --host localhost --port 27017 --db luckydraw --out backup-$(date +%Y%m%d).tar.gz

# 恢复数据库
mongorestore --host localhost --port 27017 --db luckydraw backup-20240101.tar.gz
```

### 性能监控
```bash
# 查看系统资源
htop

# 查看 MongoDB 性能
mongosh
> db.stats()
> db.currentOp()

# 查看 PM2 监控
pm2 monit
```

### 常见问题

#### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

#### MongoDB 连接失败
```bash
# 检查 MongoDB 状态
sudo systemctl status mongod

# 重启 MongoDB
sudo systemctl restart mongod

# 检查连接
mongosh --host localhost --port 27017
```

#### 内存不足
```bash
# 查看内存使用
free -h

# 清理缓存
sudo sync
sudo echo 3 > /proc/sys/vm/drop_caches
```

## 安全建议

1. **修改 JWT_SECRET**: 生产环境必须使用强随机字符串
2. **启用 HTTPS**: 使用 SSL/TLS 加密所有通信
3. **配置防火墙**: 只开放必要端口
4. **定期备份**: 建立自动备份机制
5. **监控日志**: 及时发现异常行为
6. **更新依赖**: 定期更新安全补丁

## 扩展部署

### 负载均衡
使用 Nginx 负载均衡多个后端实例：
```nginx
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

### 数据库集群
配置 MongoDB 副本集以提高可用性：
```javascript
// backend/src/config/database.js
mongoose.connect(
  'mongodb://node1:27017,node2:27017,node3:27017/luckydraw?replicaSet=myReplicaSet'
)
```

---

如有问题，请联系技术支持团队。
