import express from 'express'
import {
  register,
  login,
  getProfile,
  getAllUsers,
  updateOnlineStatus,
  logout,
  generateQRCode,
} from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', validate(schemas.register), register)
router.post('/login', authLimiter, validate(schemas.login), login)
router.post('/logout', protect, logout)

router.get('/profile', protect, getProfile)
router.get('/users', protect, adminOnly, getAllUsers)
router.put('/status', protect, updateOnlineStatus)
router.get('/qrcode', protect, generateQRCode)

export default router
