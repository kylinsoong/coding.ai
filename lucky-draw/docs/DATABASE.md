# 📊 数据库设计文档

本文档描述企业年会互动抽奖系统的数据库结构。

## 数据库概览

系统使用 MongoDB 作为主数据库，包含以下集合：

1. **users** - 用户信息
2. **lotteries** - 抽奖记录
3. **redenvelopes** - 红包配置
4. **activities** - 活动配置

## 集合详情

### 1. users (用户集合)

存储参与活动的用户信息。

#### Schema 结构
```javascript
{
  _id: ObjectId,              // 用户 ID
  name: String,               // 用户姓名 (必填, 最大50字符)
  department: String,          // 部门名称 (必填, 最大100字符)
  phone: String,              // 手机号 (必填, 唯一, 格式验证)
  qrCode: String,             // 二维码标识 (唯一)
  status: String,              // 用户状态: 'pending' | 'active' | 'inactive'
  isOnline: Boolean,           // 在线状态 (默认 false)
  lastActiveAt: Date,         // 最后活跃时间
  hasWon: Boolean,            // 是否中奖 (默认 false)
  winCount: Number,           // 中奖次数 (默认 0)
  createdAt: Date,            // 创建时间
  updatedAt: Date,            // 更新时间
}
```

#### 索引
- `phone` - 唯一索引，用于快速查找用户
- `qrCode` - 唯一索引，用于二维码登录
- `isOnline` - 索引，用于统计在线用户

#### 示例数据
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6a7b8c9d0e"),
  name: "张三",
  department: "技术部",
  phone: "13800138000",
  qrCode: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  status: "active",
  isOnline: true,
  lastActiveAt: ISODate("2026-02-13T10:30:00.000Z"),
  hasWon: true,
  winCount: 2,
  createdAt: ISODate("2026-02-13T08:00:00.000Z"),
  updatedAt: ISODate("2026-02-13T10:30:00.000Z")
}
```

### 2. lotteries (抽奖记录集合)

存储所有抽奖记录和中奖信息。

#### Schema 结构
```javascript
{
  _id: ObjectId,              // 抽奖记录 ID
  user: ObjectId,              // 用户 ID (引用 users)
  prize: {                    // 奖品信息
    name: String,              // 奖品名称
    type: String,              // 奖品类型: 'cash' | 'gift' | 'special'
    value: Number,              // 奖品价值
    description: String         // 奖品描述
  },
  amount: Number,              // 中奖金额 (现金类奖品)
  status: String,              // 领取状态: 'pending' | 'claimed' | 'expired'
'  claimedAt: Date,             // 领取时间
  round: Number,               // 抽奖轮次 (默认 1)
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

#### 索引
- `user` - 索引，用于查询用户抽奖记录
- `status` - 索引，用于查询待领取奖品
- `round` - 索引，用于按轮次查询
- `createdAt` - 降序索引，用于最新记录查询

#### 示例数据
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6a7b8c9d0e"),
  user: ObjectId("65a1b2c3d4e5f6a7b8c9d0e"),
  prize: {
    name: "一等奖红包",
    type: "cash",
    value: 888,
    description: "新年大红包"
  },
  amount: 888,
  status: "pending",
  claimedAt: null,
  round: 1,
  createdAt: ISODate("2026-02-13T10:00:00.000Z"),
  updatedAt: ISODate("2026-02-13T10:00:00.000Z")
}
```

### 3. redenvelopes (红包配置集合)

存储红包活动配置和奖品设置。

#### Schema 结构
```javascript
{
  _id: ObjectId,              // 红包 ID
  name: String,               // 红包名称 (必填)
  minAmount: Number,          // 最小金额 (必填, >= 0)
  maximaount: Number,         // 最大金额 (必填, >= 0)
  winProbability: Number,      // 中奖概率 (必填, 0-100)
  totalPackets: Number,        // 红包总数 (必填, >= 1)
  remainingPackets: Number,   // 剩余红包数
  prizes: [{                  // 奖品配置
    name: String,              // 奖品名称
    type: String,              // 奖品类型: 'cash' | 'gift' | 'special'
    value: Number,              // 奖品价值
    probability: Number,        // 奖品概率 (0-100)
    description: String         // 奖品描述
  }],
  isActive: Boolean,          // 是否激活 (默认 true)
  round: Number,              // 轮次 (默认 1)
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

#### 索引
- `isActive` - 索引，用于查询活动红包
- `round` - 索引，用于按轮次查询

#### 示例数据
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6a7b8c9d0e"),
  name: "第一轮红包雨",
  minAmount: 10,
  maxAmount: 888,
  winProbability: 30,
  totalPackets: 100,
  remainingPackets: 85,
  prizes: [
    {
      name: "特等奖",
      type: "cash",
      value: 888,
      probability: 1,
      description: "新年大红包"
    },
    {
      name: "一等奖",
      type: "cash",
      value: 188,
      probability: 5,
      description: "幸运红包"
    },
    {
      name: "二等奖",
      type: "cash",
      value: 88,
      probability: 10,
      description: "开心红包"
    },
    {
      name: "三等奖",
      type: "cash",
      value: 18,
      probability: 20,
      description: "参与红包"
    }
  ],
  isActive: true,
  round: 1,
  createdAt: ISODate("2026-02-13T08:00:00.000Z"),
  updatedAt: ISODate("2026-02-13T08:00:00.000Z")
}
```

### 4. activities (活动配置集合)

存储年会活动的整体配置。

#### Schema 结构
```javascript
{
  _id: ObjectId,              // 活动 ID
  title: String,              // 活动标题 (必填)
  description: String,         // 活动描述
  startDate: Date,            // 开始时间 (必填)
  endDate: Date,              // 结束时间 (必填)
  maxParticipants: Number,     // 最大参与人数 (默认 200)
  status: String,              // 活动状态: 'draft' | 'active' | 'paused' | 'completed'
  settings: {                 // 活动设置
    allowMultipleWins: Boolean, // 允许多次中奖 (默认 false)
    requireOnline: Boolean,     // 要求在线 (默认 true)
    showWinners: Boolean       // 显示中奖名单 (默认 true)
  },
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

#### 索引
- `status` - 索引，用于查询活动状态

#### 示例数据
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6a7b8c9d0e"),
  title: "2026年新春年会",
  description: "公司2026年度新春年会抽奖活动",
  startDate: ISODate("2026-02-13T09:00:00.000Z"),
  endDate: ISODate("2026-02-13T18:00:00.000Z"),
  maxParticipants: 200,
  status: "active",
  settings: {
    allowMultipleWins: false,
    requireOnline: true,
    showWinners: true
  },
  createdAt: ISODate("2026-02-13T08:00:00.000Z"),
  updatedAt: ISODate("2026-02-13T08:00:00.000Z")
}
```

## 数据关系图

```
users (1) ──────── (N) lotteries
    │
    └─── qrCode (用于登录)

activities (1) ──────── (N) redenvelopes
    │
    └─── settings (控制抽奖规则)

redenvelopes (1) ──────── (N) lotteries
    │
    └─── prizes (奖品配置)
```

## 常用查询

### 查询在线用户
```javascript
db.users.find({ isOnline: true }).count()
```

### 查询用户抽奖记录
```javascript
db.lotteries.find({ user: ObjectId("...") }).sort({ createdAt: -1 })
```

### 查询中奖名单
```javascript
db.lotteries
  .find({ status: 'pending' })
  .populate('user', 'name department')
  .sort({ createdAt: -1 })
```

### 查询排行榜
```javascript
db.lotteries.aggregate([
  {
    $group: {
      _id: '$user',
      totalAmount: { $sum: '$amount' },
      winCount: { $sum: 1 },
      lastWin: { $max: '$createdAt' }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $sort: { totalAmount: -1, winCount: -1 } },
  { $limit: 50 }
])
```

## 数据备份与恢复

### 备份
```bash
# 备份整个数据库
mongodump --host localhost --port 27017 --db luckydraw --out backup/

# 备份单个集合
mongodump --host localhost --port 27017 --db luckydraw --collection users --out users-backup/
```

### 恢复
```bash
# 恢复整个数据库
mongorestore --host localhost --port 27017 --db luckydraw backup/

# 恢复单个集合
mongorestore --host localhost --port 27017 --db luckydraw users-backup/
```

## 性能优化建议

1. **索引优化**: 确保所有常用查询字段都有索引
2. **分页查询**: 大数据集使用分页避免内存溢出
3. **聚合优化**: 复杂查询使用聚合管道
4. **连接池**: 配置合适的连接池大小
5. **定期清理**: 清理过期数据和日志

## 安全建议

1. **访问控制**: 配置 MongoDB 认证和授权
2. **网络隔离**: MongoDB 不直接暴露到公网
3. **数据加密**: 敏感字段考虑加密存储
4. **审计日志**: 记录所有数据修改操作
5. **定期备份**: 建立自动备份机制

---

如有数据库相关问题，请联系数据库管理员。
