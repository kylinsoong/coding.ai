import { v4 as uuidv4 } from 'uuid'
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
    const { status, isOnline } = req.query
    const filter = {}
    if (status) filter.status = status
    if (isOnline !== undefined) filter.isOnline = isOnline === 'true'

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })

    const stats = {
      total: users.length,
      online: users.filter((u) => u.isOnline).length,
      offline: users.filter((u) => !u.isOnline).length,
      winners: users.filter((u) => u.hasWon).length,
    }

    res.json({ data: users, stats })
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
  })
}
