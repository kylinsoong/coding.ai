import { v4 as uuidv4 } from 'uuid'
import xlsx from 'xlsx'
import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

export const register = async (req, res) => {
  try {
    const { name, department, phone } = req.body

    const existingUser = await User.findOne({ phone })
    if (existingUser) {
      return res.status(400).json({ message: '该手机号已注册' })
    }

    const qrCode = uuidv4()

    const user = await User.create({
      name,
      department,
      phone,
      qrCode,
      status: 'active',
    })

    const token = generateToken(user._id)

    res.status(201).json({
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          name: user.name,
          department: user.department,
          phone: user.phone,
          qrCode: user.qrCode,
          status: user.status,
        },
        token,
      },
    })
  } catch (error) {
    res.status(500).json({ message: '注册失败', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { phone } = req.body

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    user.isOnline = true
    user.lastActiveAt = Date.now()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          name: user.name,
          department: user.department,
          phone: user.phone,
          qrCode: user.qrCode,
          status: user.status,
          isOnline: user.isOnline,
          hasWon: user.hasWon,
          winCount: user.winCount,
        },
        token,
      },
    })
  } catch (error) {
    res.status(500).json({ message: '登录失败', error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ data: user })
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const { status, isOnline, page = 1, limit = 50 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (isOnline !== undefined) filter.isOnline = isOnline === 'true'

    const skip = (page - 1) * limit

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await User.countDocuments(filter)

    const stats = {
      total: total,
      online: await User.countDocuments({ isOnline: true }),
      offline: await User.countDocuments({ isOnline: false }),
      winners: await User.countDocuments({ hasWon: true }),
    }

    res.json({ 
      data: users, 
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message })
  }
}

export const updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body
    const user = await User.findById(req.user._id)

    user.isOnline = isOnline
    user.lastActiveAt = Date.now()
    await user.save()

    res.json({ message: '状态更新成功', data: { isOnline: user.isOnline } })
  } catch (error) {
    res.status(500).json({ message: '更新状态失败', error: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.isOnline = false
    await user.save()

    res.json({ message: '退出成功' })
  } catch (error) {
    res.status(500).json({ message: '退出失败', error: error.message })
  }
}

export const generateQRCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user.qrCode) {
      user.qrCode = uuidv4()
      await user.save()
    }

    const baseUrl = process.env.CORS_ORIGIN || 'http://localhost:3000'
    const qrUrl = `${baseUrl}/login/${user.qrCode}`

    res.json({ data: { qrCode: user.qrCode, url: qrUrl } })
  } catch (error) {
    res.status(500).json({ message: '生成二维码失败', error: error.message })
  }
}

export const importUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传 Excel 文件' })
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel 文件为空' })
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    }

    for (const row of data) {
      try {
        const name = row['姓名'] || row['name'] || row['Name']
        const department = row['部门'] || row['department'] || row['Department']
        const phone = row['手机号'] || row['phone'] || row['Phone'] || row['手机']

        if (!name || !department || !phone) {
          results.failed.push({
            row,
            reason: '缺少必填字段（姓名、部门、手机号）'
          })
          continue
        }

        if (!/^1[3-9]\d{9}$/.test(String(phone))) {
          results.failed.push({
            row,
            reason: '手机号格式不正确'
          })
          continue
        }

        const existingUser = await User.findOne({ phone })
        if (existingUser) {
          results.skipped.push({
            row,
            reason: '该手机号已存在'
          })
          continue
        }

        const qrCode = uuidv4()
        const user = await User.create({
          name,
          department,
          phone: String(phone),
          qrCode,
          status: 'active',
        })

        results.success.push({
          id: user._id,
          name: user.name,
          department: user.department,
          phone: user.phone,
          qrCode: user.qrCode,
        })
      } catch (error) {
        results.failed.push({
          row,
          reason: error.message
        })
      }
    }

    res.json({
      message: '导入完成',
      data: {
        total: data.length,
        success: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length,
        results
      }
    })
  } catch (error) {
    res.status(500).json({ message: '导入失败', error: error.message })
  }
}

export const exportUsersToExcel = async (req, res) => {
  try {
    const { status, isOnline } = req.query
    const filter = {}
    if (status) filter.status = status
    if (isOnline !== undefined) filter.isOnline = isOnline === 'true'

    const users = await User.find(filter)
      .select('-password -qrCode')
      .sort({ createdAt: -1 })

    const data = users.map(user => ({
      '姓名': user.name,
      '部门': user.department,
      '手机号': user.phone,
      '状态': user.status === 'active' ? '活跃' : user.status === 'pending' ? '待审核' : '未激活',
      '在线状态': user.isOnline ? '在线' : '离线',
      '是否中奖': user.hasWon ? '是' : '否',
      '中奖次数': user.winCount,
      '注册时间': new Date(user.createdAt).toLocaleString('zh-CN'),
      '最后活跃': new Date(user.lastActiveAt).toLocaleString('zh-CN'),
    }))

    const worksheet = xlsx.utils.json_to_sheet(data)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表')

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.xlsx`)
    res.send(buffer)
  } catch (error) {
    res.status(500).json({ message: '导出失败', error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    await User.findByIdAndDelete(id)

    res.json({ message: '用户删除成功' })
  } catch (error) {
    res.status(500).json({ message: '删除失败', error: error.message })
  }
}

export const batchDeleteUsers = async (req, res) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: '请提供要删除的用户 ID 列表' })
    }

    const result = await User.deleteMany({ _id: { $in: ids } })

    res.json({ 
      message: '批量删除成功',
      data: {
        deletedCount: result.deletedCount
      }
    })
  } catch (error) {
    res.status(500).json({ message: '批量删除失败', error: error.message })
  }
}
