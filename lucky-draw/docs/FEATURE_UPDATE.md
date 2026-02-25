# 🎊 功能更新说明

## 新增功能

### 1. Excel 批量导入用户

#### 后端实现
- **新增依赖**: `xlsx` (Excel 文件处理), `multer` (文件上传)
- **新增 API**: `POST /api/users/import`
- **功能特性**:
  - 支持 .xlsx 和 .xls 格式
  - 自动识别多种列名格式（中文/英文）
  - 数据验证（手机号格式、必填字段）
  - 重复数据跳过
  - 返回详细的导入结果（成功/失败/跳过）

#### Excel 文件格式要求
```
| 姓名 | 部门 | 手机号 |
|------|--------|----------|
| 张三 | 技术部 | 13800138000 |
| 李四 | 市场部 | 13900139000 |
```

#### API 使用示例
```bash
curl -X POST http://localhost:5000/api/users/import \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@users.xlsx"
```

#### 响应示例
```json
{
  "message": "导入完成",
  "data": {
    "total": 100,
    "success": 95,
    "failed": 3,
    "skipped": 2,
    "results": {
      "success": [...],
      "failed": [...],
      "skipped": [...]
    }
  }
}
```

### 2. Excel 导出用户数据

#### 后端实现
- **新增 API**: `GET /api/users/export`
- **功能特性**:
  - 支持按状态/在线状态筛选
  - 导出完整的用户信息
  - 自动生成带时间戳的文件名

#### API 使用示例
```bash
curl -X GET http://localhost:5000/api/users/export \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o users_export.xlsx
```

### 3. 增强抽奖功能

#### 新增功能
- **多轮次支持**: 支持不同轮次的红包配置
- **中奖概率控制**: 可配置每轮次的中奖概率
- **奖品池管理**: 支持多种奖品类型（现金/礼品/特殊奖品）
- **防重复中奖**: 可配置是否允许多次中奖
- **实时红包统计**: 剩余红包数量实时更新

#### 抽奖流程
1. 验证用户在线状态
2. 检查活动是否进行中
3. 验证用户是否已中奖（根据配置）
4. 检查红包是否还有剩余
5. 随机判断是否中奖
6. 中奖则随机选择奖品
7. 更新用户和红包状态
8. 返回抽奖结果

### 4. 批量删除用户

#### 后端实现
- **新增 API**: `DELETE /api/users/batch`
- **功能特性**:
  - 支持批量删除多个 用户
  - 返回删除数量统计

#### API 使用示例
```bash
curl -X DELETE http://localhost:5000/api/users/batch \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["id1", "id2", "id3"]}'
```

## 前端新增功能

### 1. Excel 导入组件
```jsx
// ExcelImport.jsx
import { useState } from 'react'
import { userAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function ExcelImport() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('请选择 Excel 文件')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await userAPI.importFromExcel(formData)
      setResults(response.data.data)
      toast.success(`导入完成！成功 ${response.data.data.success} 条`)
    } catch (error) {
      toast.error('导入失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">批量导入用户</h3>
      
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="input-field"
        />
      </div>

      <button
        onClick={handleImport}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? '导入中...' : '开始导入'}
      </button>

      {results && (
        <div className="mt-6 p-4 bg-spring-red-50 rounded-lg">
          <p className="font-medium">导入结果：</p>
          <ul className="mt-2 space-y-1">
            <li>总计: {results.total}</li>
            <li className="text-green-600">成功: {results.success}</li>
            <li className="text-red-600">失败: {results.failed.length}</li>
            <li className="text-yellow-600">跳过: {results.skipped.length}</li>
          </ul>
        </div>
      )}
    </div>
  )
}
```

### 2. 增强抽奖组件
```jsx
// EnhancedLottery.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { lotteryAPI } from '../../services/api'
import { emitLotteryTrigger, emitRedPacketFall } from '../../services/socket'
import toast from 'react-hot-toast'

export default function EnhancedLottery() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResult, setShowResult] = useState(null)
  const [drawCount, setDrawCount] = useState(0)

  const handleLottery = async () => {
    if (isDrawing) return

    setIsDrawing(true)
    emitLotteryTrigger({ timestamp: Date.now() })

    try {
      const response = await lotteryAPI.participate()
      const result = response.data.data

      setDrawCount(prev => prev + 1)

      if (result.won) {
        setShowResult(result.lottery)
        emitRedPacketFall({
          id: Date.now(),
          x: Math.random() * 80 + 10,
          amount: result.lottery.amount,
        })
        toast.success('🎉 恭喜中奖！')
      } else {
        toast.info('再接再厉，下次一定中！')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '抽奖失败，请重试')
    } finally {
      setIsDrawing(false)
    }
  }

  const closeResult = () => {
    setShowResult(null)
  }

  return (
    <div>
      <motion.button
        onClick={handleLottery}
        disabled={isDrawing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative overflow-hidden rounded-full"
        style={{
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
          boxShadow: '0 20px 60px rgba(196, 30, 58, 0.4)',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isDrawing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-2"
              >
                🧧
              </motion.div>
              <span className="text-white font-bold text-lg">抽奖中...</span>
              <span className="text-white/60 text-sm mt-1">
                已抽奖 {drawCount} 次
              </span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-2"
              >
                🧧
              </motion.div>
              <span className="text-imperial-gold font-display font-bold text-xl">
                点击抽奖
              </span>
              {drawCount > 0 && (
                <span className="text-white/60 text-sm mt-1">
                  已抽奖 {drawCount} 次
                </span>
              )}
            </>
          )}
        </div>

        <div className="absolute inset-0 rounded-full border-4 border-imperial-gold/50"></div>
        <div className="absolute inset-2 rounded-full border-2 border-bright-gold/30"></div>

        <div className="absolute -top-2 -right-2 w-8 h-8 bg-bright-gold rounded-full flex items-center justify-center text-deep-red font-bold shadow-lg">
          ¥
        </div>
      </motion.button>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="card chinese-border max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="font-display text-3xl font-bold gold-text mb-4">
                恭喜中奖！
              </h2>
              <div className="bg-gradient-to-r from-imperial-gold/20 to-bright-gold/20 rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-chinese-red mb-2">
                  {showResult.prize.name}
                </p>
                {showResult.amount > 0 && (
                  <p className="text-3xl font-bold text-imperial-gold">
                    ¥{showResult.amount}
                  </p>
                )}
                {showResult.prize.description && (
                  <p className="text-gray-600 mt-2">
                    {showResult.prize.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeResult}
                className="btn-primary w-full"
              >
                太棒了！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## 安装说明

### 后端新增依赖
```bash
cd backend
npm install xlsx multer
```

### 前端新增依赖（如需要）
```bash
cd frontend
npm install xlsx
```

## 使用说明

### Excel 导入流程
1. 准备 Excel 文件，包含姓名、部门、手机号列
2. 登录管理员账号
3. 进入用户管理页面
4. 点击"批量导入"按钮
5. 选择 Excel 文件并上传
6. 查看导入结果

### 增强抽奖流程
1. 用户登录系统
2. 确保在线状态
3. 点击抽奖按钮
4. 系统自动判断是否中奖
5. 中奖则显示中奖弹窗和红包动画
6. 查看中奖记录和排行榜

## 注意事项

1. **Excel 文件大小限制**: 最大 5MB
2. **手机号格式**: 必须是有效的中国大陆手机号（11位，1开头）
3. **重复数据**: 已存在的手机号会自动跳过
4. **抽奖限制**: 每分钟最多 10 次抽奖请求
5. **中奖限制**: 根据活动配置，可能限制每人只能中奖一次

## 技术细节

### Excel 导入实现
- 使用 `xlsx` 库解析 Excel 文件
- 使用 `multer` 处理文件上传
- 支持多种列名格式（中英文）
- 批量插入数据库，提高性能

### 增强抽奖实现
- 多轮次红包配置
- 动态奖品池管理
- 实时状态同步
- WebSocket 广播中奖信息

---

如有问题，请联系技术支持团队。
