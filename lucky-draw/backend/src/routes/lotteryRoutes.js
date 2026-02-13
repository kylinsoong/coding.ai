import express from 'express'
import {
  participate,
  getLotteryHistory,
  getAllLotteries,
  getWinners,
  getLeaderboard,
  claimPrize,
} from '../controllers/lotteryController.js'
import { protect } from '../middleware/auth.js'
import { lotteryLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/participate', protect, lotteryLimiter, participate)
router.get('/history', protect, getLotteryHistory)
router.get('/all', protect, getAllLotteries)
router.get('/winners', getWinners)
router.get('/leaderboard', getLeaderboard)
router.put('/claim/:lotteryId', protect, claimPrize)

export default router
