import express from 'express'
import multer from 'multer'
import {
  register,
  login,
  getProfile,
  getAllUsers,
  updateOnlineStatus,
  logout,
  generateQRCode,
  importUsersFromExcel,
  exportUsersToExcel,
  deleteUser,
  batchDeleteUsers,
} from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
      cb(null, true)
    } else {
      cb(new Error('只支持 Excel 文件'))
    }
  },
})

router.post('/register', validate(schemas.register), register)
router.post('/login', authLimiter, validate(schemas.login), login)
router.post('/logout', protect, logout)

router.get('/profile', protect, getProfile)
router.get('/users', protect, adminOnly, getAllUsers)
router.put('/status', protect, updateOnlineStatus)
router.get('/qrcode', protect, generateQRCode)
router.post('/import', protect, adminOnly, upload.single('file'), importUsersFromExcel)
router.get('/export', protect, adminOnly, exportUsersToExcel)
router.delete('/:id', protect, adminOnly, deleteUser)
router.delete('/batch', protect, adminOnly, batchDeleteUsers)

export default router
