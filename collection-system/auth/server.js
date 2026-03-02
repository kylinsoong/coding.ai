const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'collection_system_secret_key';

// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API Documentation',
      description: 'Collection System Authentication and User Management API',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer {token}'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'US001'
            },
            username: {
              type: 'string',
              example: 'admin'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'admin'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              example: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-01T00:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-01T00:00:00Z'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'admin'
            },
            password: {
              type: 'string',
              example: 'admin'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        CreateUserRequest: {
          type: 'object',
          required: ['username', 'password', 'role', 'email'],
          properties: {
            username: {
              type: 'string',
              example: 'newuser'
            },
            password: {
              type: 'string',
              example: 'password123'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'newuser@example.com'
            }
          }
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              example: 'updateduser'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'updateduser@example.com'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              example: 'active'
            }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: {
              type: 'string',
              example: 'oldpassword'
            },
            newPassword: {
              type: 'string',
              example: 'newpassword123'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: '操作成功'
            }
          }
        }
      }
    }
  },
  apis: [__filename]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// 中间件
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  swaggerOptions: {
    security: [{ bearerAuth: [] }]
  }
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// 数据库文件路径
const dbPath = path.join(__dirname, 'db.json');

// 读取数据库
function readDB() {
    console.log('[LOG] readDB() 被调用');
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('读取数据库失败:', err);
        return { users: [] };
    }
}

// 写入数据库
function writeDB(data) {
    console.log('[LOG] writeDB() 被调用');
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('写入数据库失败:', err);
        return false;
    }
}

// 生成JWT令牌
function generateToken(user) {
    console.log('[LOG] generateToken() 被调用 - 用户:', user.username);
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
    }, SECRET_KEY, { expiresIn: '24h' });
}

// 验证JWT令牌中间件
function verifyToken(req, res, next) {
    console.log('[LOG] verifyToken() 被调用 - 路径:', req.path);
    // 测试环境下跳过验证
    if (process.env.NODE_ENV === 'test') {
        console.log('[LOG] verifyToken() - 测试环境，跳过实际验证');
        // 从Authorization头中获取用户角色和ID（格式：Bearer role:id）
        const authHeader = req.header('Authorization');
        if (authHeader) {
            const [role, id] = authHeader.replace('Bearer ', '').split(':');
            req.user = {
                role: role || 'admin',
                id: id || 'US001'
            };
            console.log('[LOG] verifyToken() - 测试环境用户:', req.user);
        } else {
            // 默认设置为管理员
            req.user = {
                role: 'admin',
                id: 'US001'
            };
            console.log('[LOG] verifyToken() - 测试环境默认用户:', req.user);
        }
        return next();
    }
    
    // 生产环境下正常验证
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('[LOG] verifyToken() - 生产环境，检查令牌');
    
    if (!token) {
        console.log('[LOG] verifyToken() - 未提供认证令牌');
        return res.status(401).json({ message: '未提供认证令牌' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        console.log('[LOG] verifyToken() - 令牌验证成功，用户:', req.user.username);
        next();
    } catch (err) {
        console.log('[LOG] verifyToken() - 无效的认证令牌');
        res.status(401).json({ message: '无效的认证令牌' });
    }
}

// 检查用户是否存在
function checkUserExists(username) {
    console.log('[LOG] checkUserExists() 被调用 - 用户名:', username);
    const db = readDB();
    const exists = db.users.find(user => user.username === username) !== undefined;
    console.log('[LOG] checkUserExists() - 结果:', exists);
    return exists;
}

// 生成用户ID
function generateUserId() {
    console.log('[LOG] generateUserId() 被调用');
    const db = readDB();
    const maxId = db.users.reduce((max, user) => {
        const idNum = parseInt(user.id.replace('US', ''));
        return idNum > max ? idNum : max;
    }, 0);
    const newId = `US${String(maxId + 1).padStart(3, '0')}`;
    console.log('[LOG] generateUserId() - 生成的新ID:', newId);
    return newId;
}

// API路由

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     description: 验证用户凭据并返回JWT令牌
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: 用户名或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 用户登录
app.post('/api/auth/login', (req, res) => {
    const startTime = Date.now();
    console.log('[DEBUG] 收到登录请求，请求头:', req.headers);
    console.log('[DEBUG] 收到登录请求，请求体:', req.body);
    const { username, password } = req.body;
    console.log('[API LOG] POST /api/auth/login 被调用');
    console.log('[API LOG] 请求参数:', { username, password: '***' });
    
    const db = readDB();
    
    // 查找用户
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 生成令牌
        const token = generateToken(user);
        
        // 返回用户信息和令牌
        const response = {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                status: user.status
            },
            token: '***'
        };
        
        console.log('[API LOG] POST /api/auth/login 成功 - 用户:', username);
        console.log('[API LOG] POST /api/auth/login 响应:', response);
        console.log('[API LOG] POST /api/auth/login 执行时间:', Date.now() - startTime, 'ms');
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                status: user.status
            },
            token
        });
    } else {
        console.log('[API LOG] POST /api/auth/login 失败 - 用户名或密码错误');
        console.log('[API LOG] POST /api/auth/login 执行时间:', Date.now() - startTime, 'ms');
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: 获取当前用户信息
 *     description: 获取当前已认证用户的详细信息
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 获取当前用户信息
app.get('/api/auth/me', verifyToken, (req, res) => {
    const startTime = Date.now();
    console.log('[API LOG] GET /api/auth/me 被调用 - 用户:', req.user.username);
    
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    
    if (user) {
        const response = {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                status: user.status
            }
        };
        
        console.log('[API LOG] GET /api/auth/me 成功');
        console.log('[API LOG] GET /api/auth/me 响应:', response);
        console.log('[API LOG] GET /api/auth/me 执行时间:', Date.now() - startTime, 'ms');
        
        res.json(response);
    } else {
        console.log('[API LOG] GET /api/auth/me 失败 - 用户不存在');
        console.log('[API LOG] GET /api/auth/me 执行时间:', Date.now() - startTime, 'ms');
        res.status(404).json({ success: false, message: '用户不存在' });
    }
});

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: 获取所有用户
 *     description: 获取系统中所有用户的列表（仅管理员可访问）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: 没有权限执行此操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 获取所有用户
app.get('/api/users', verifyToken, (req, res) => {
    const startTime = Date.now();
    console.log('[API LOG] GET /api/users 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    
    // 只有管理员可以查看所有用户
    if (req.user.role !== 'admin') {
        console.log('[API LOG] GET /api/users 失败 - 没有权限执行此操作');
        console.log('[API LOG] GET /api/users 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    const db = readDB();
    const usersResponse = db.users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }));
    
    const response = {
        success: true,
        users: usersResponse
    };
    
    console.log('[API LOG] GET /api/users 成功 - 返回用户数量:', usersResponse.length);
    console.log('[API LOG] GET /api/users 响应:', response);
    console.log('[API LOG] GET /api/users 执行时间:', Date.now() - startTime, 'ms');
    
    res.json(response);
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: 获取单个用户
 *     description: 根据用户ID获取用户的详细信息
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 获取单个用户
app.get('/api/users/:id', verifyToken, (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    console.log('[API LOG] GET /api/users/:id 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    console.log('[API LOG] 请求参数:', { id });
    
    const db = readDB();
    const user = db.users.find(u => u.id === id);
    
    // 只有管理员或用户自己可以查看用户信息
    if (req.user.role !== 'admin' && req.user.id !== id) {
        console.log('[API LOG] GET /api/users/:id 失败 - 没有权限执行此操作');
        console.log('[API LOG] GET /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    if (user) {
        const response = {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
        
        console.log('[API LOG] GET /api/users/:id 成功 - 用户ID:', id);
        console.log('[API LOG] GET /api/users/:id 响应:', response);
        console.log('[API LOG] GET /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        
        res.json(response);
    } else {
        console.log('[API LOG] GET /api/users/:id 失败 - 用户不存在');
        console.log('[API LOG] GET /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        res.status(404).json({ success: false, message: '用户不存在' });
    }
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: 创建用户
 *     description: 创建新用户（仅管理员可访问）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       200:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: 没有权限执行此操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 创建用户
app.post('/api/users', verifyToken, (req, res) => {
    const startTime = Date.now();
    console.log('[API LOG] POST /api/users 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    
    // 只有管理员可以创建用户
    if (req.user.role !== 'admin') {
        console.log('[API LOG] POST /api/users 失败 - 没有权限执行此操作');
        console.log('[API LOG] POST /api/users 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    const { username, password, role, email } = req.body;
    console.log('[API LOG] 请求参数:', { username, password: '***', role, email });
    
    // 验证必填字段
    if (!username || !password || !role || !email) {
        console.log('[API LOG] POST /api/users 失败 - 请填写所有必填字段');
        console.log('[API LOG] POST /api/users 执行时间:', Date.now() - startTime, 'ms');
        return res.status(400).json({ success: false, message: '请填写所有必填字段' });
    }
    
    // 检查用户是否已存在
    if (checkUserExists(username)) {
        console.log('[API LOG] POST /api/users 失败 - 用户名已存在');
        console.log('[API LOG] POST /api/users 执行时间:', Date.now() - startTime, 'ms');
        return res.status(400).json({ success: false, message: '用户名已存在' });
    }
    
    const db = readDB();
    const now = new Date().toISOString();
    
    const newUser = {
        id: generateUserId(),
        username,
        password, // 实际项目中应该加密存储
        role,
        email,
        status: 'active',
        createdAt: now,
        updatedAt: now
    };
    
    db.users.push(newUser);
    
    if (writeDB(db)) {
        const response = {
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                email: newUser.email,
                status: newUser.status,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        };
        
        console.log('[API LOG] POST /api/users 成功 - 创建用户:', username, '(ID:', newUser.id, ')');
        console.log('[API LOG] POST /api/users 响应:', response);
        console.log('[API LOG] POST /api/users 执行时间:', Date.now() - startTime, 'ms');
        
        res.json(response);
    } else {
        console.log('[API LOG] POST /api/users 失败 - 创建用户失败');
        console.log('[API LOG] POST /api/users 执行时间:', Date.now() - startTime, 'ms');
        res.status(500).json({ success: false, message: '创建用户失败' });
    }
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: 更新用户
 *     description: 更新用户信息（管理员或用户自己可访问）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: 用户更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: 没有权限执行此操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 更新用户
app.put('/api/users/:id', verifyToken, (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const { username, role, email, status } = req.body;
    console.log('[API LOG] PUT /api/users/:id 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    console.log('[API LOG] 请求参数:', { id, username, role, email, status });
    
    // 只有管理员或用户自己可以更新用户信息
    if (req.user.role !== 'admin' && req.user.id !== id) {
        console.log('[API LOG] PUT /api/users/:id 失败 - 没有权限执行此操作');
        console.log('[API LOG] PUT /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        console.log('[API LOG] PUT /api/users/:id 失败 - 用户不存在');
        console.log('[API LOG] PUT /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 检查用户名是否已被其他用户使用
    if (username && username !== db.users[userIndex].username) {
        if (checkUserExists(username)) {
            console.log('[API LOG] PUT /api/users/:id 失败 - 用户名已存在');
            console.log('[API LOG] PUT /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
            return res.status(400).json({ success: false, message: '用户名已存在' });
        }
    }
    
    // 更新用户信息
    const originalUsername = db.users[userIndex].username;
    db.users[userIndex] = {
        ...db.users[userIndex],
        username: username || db.users[userIndex].username,
        role: role || db.users[userIndex].role,
        email: email || db.users[userIndex].email,
        status: status || db.users[userIndex].status,
        updatedAt: new Date().toISOString()
    };
    
    if (writeDB(db)) {
        const response = {
            success: true,
            user: {
                id: db.users[userIndex].id,
                username: db.users[userIndex].username,
                role: db.users[userIndex].role,
                email: db.users[userIndex].email,
                status: db.users[userIndex].status,
                createdAt: db.users[userIndex].createdAt,
                updatedAt: db.users[userIndex].updatedAt
            }
        };
        
        console.log('[API LOG] PUT /api/users/:id 成功 - 更新用户:', originalUsername, '->', db.users[userIndex].username);
        console.log('[API LOG] PUT /api/users/:id 响应:', response);
        console.log('[API LOG] PUT /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        
        res.json(response);
    } else {
        console.log('[API LOG] PUT /api/users/:id 失败 - 更新用户失败');
        console.log('[API LOG] PUT /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        res.status(500).json({ success: false, message: '更新用户失败' });
    }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     description: 删除指定ID的用户（仅管理员可访问）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 用户删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权或令牌无效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: 没有权限执行此操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 删除用户
app.delete('/api/users/:id', verifyToken, (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    console.log('[API LOG] DELETE /api/users/:id 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    console.log('[API LOG] 请求参数:', { id });
    
    // 只有管理员可以删除用户
    if (req.user.role !== 'admin') {
        console.log('[API LOG] DELETE /api/users/:id 失败 - 没有权限执行此操作');
        console.log('[API LOG] DELETE /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        console.log('[API LOG] DELETE /api/users/:id 失败 - 用户不存在');
        console.log('[API LOG] DELETE /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 不能删除自己
    if (db.users[userIndex].id === req.user.id) {
        console.log('[API LOG] DELETE /api/users/:id 失败 - 不能删除自己');
        console.log('[API LOG] DELETE /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        return res.status(400).json({ success: false, message: '不能删除自己' });
    }
    
    const deletedUser = db.users[userIndex];
    db.users.splice(userIndex, 1);
    
    if (writeDB(db)) {
        const response = { success: true, message: '用户删除成功' };
        console.log('[API LOG] DELETE /api/users/:id 成功 - 删除用户:', deletedUser.username, '(ID:', id, ')');
        console.log('[API LOG] DELETE /api/users/:id 响应:', response);
        console.log('[API LOG] DELETE /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        res.json(response);
    } else {
        console.log('[API LOG] DELETE /api/users/:id 失败 - 删除用户失败');
        console.log('[API LOG] DELETE /api/users/:id 执行时间:', Date.now() - startTime, 'ms');
        res.status(500).json({ success: false, message: '删除用户失败' });
    }
});

/**
 * @openapi
 * /api/users/{id}/change-password:
 *   post:
 *     summary: 更改密码
 *     description: 更改用户密码（仅用户自己可访问）
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: 密码更改成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权或令牌无效或旧密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: 没有权限执行此操作
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
// 更改密码
app.post('/api/users/:id/change-password', verifyToken, (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    console.log('[API LOG] POST /api/users/:id/change-password 被调用 - 用户:', req.user.username, '(角色:', req.user.role, ')');
    console.log('[API LOG] 请求参数:', { id, oldPassword: '***', newPassword: '***' });
    
    // 只有用户自己可以更改密码
    if (req.user.id !== id) {
        console.log('[API LOG] POST /api/users/:id/change-password 失败 - 没有权限执行此操作');
        console.log('[API LOG] POST /api/users/:id/change-password 执行时间:', Date.now() - startTime, 'ms');
        return res.status(403).json({ success: false, message: '没有权限执行此操作' });
    }
    
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        console.log('[API LOG] POST /api/users/:id/change-password 失败 - 用户不存在');
        console.log('[API LOG] POST /api/users/:id/change-password 执行时间:', Date.now() - startTime, 'ms');
        return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    // 验证旧密码
    if (db.users[userIndex].password !== oldPassword) {
        console.log('[API LOG] POST /api/users/:id/change-password 失败 - 旧密码错误');
        console.log('[API LOG] POST /api/users/:id/change-password 执行时间:', Date.now() - startTime, 'ms');
        return res.status(401).json({ success: false, message: '旧密码错误' });
    }
    
    // 更新密码
    db.users[userIndex].password = newPassword;
    db.users[userIndex].updatedAt = new Date().toISOString();
    
    if (writeDB(db)) {
        const response = { success: true, message: '密码更改成功' };
        console.log('[API LOG] POST /api/users/:id/change-password 成功 - 用户:', db.users[userIndex].username);
        console.log('[API LOG] POST /api/users/:id/change-password 响应:', response);
        console.log('[API LOG] POST /api/users/:id/change-password 执行时间:', Date.now() - startTime, 'ms');
        res.json(response);
    } else {
        console.log('[API LOG] POST /api/users/:id/change-password 失败 - 密码更改失败');
        console.log('[API LOG] POST /api/users/:id/change-password 执行时间:', Date.now() - startTime, 'ms');
        res.status(500).json({ success: false, message: '密码更改失败' });
    }
});

// 导出app对象以便测试使用
module.exports = {
    app,
    generateToken,
    verifyToken,
    checkUserExists,
    generateUserId,
    readDB,
    writeDB
};

// 只有直接运行该文件时才启动服务器
if (require.main === module) {
    // 启动服务器
    app.listen(PORT, () => {
        console.log(`Auth API服务器运行在 http://localhost:${PORT}`);
        console.log('可用API端点:');
        console.log('  POST   /api/auth/login          - 用户登录');
        console.log('  GET    /api/auth/me             - 获取当前用户信息');
        console.log('  GET    /api/users               - 获取所有用户');
        console.log('  GET    /api/users/:id           - 获取单个用户');
        console.log('  POST   /api/users               - 创建用户');
        console.log('  PUT    /api/users/:id           - 更新用户');
        console.log('  DELETE /api/users/:id           - 删除用户');
        console.log('  POST   /api/users/:id/change-password - 更改密码');
    });
}
