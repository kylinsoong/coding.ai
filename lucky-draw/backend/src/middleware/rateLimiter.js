import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    message: '请求过于频繁，请稍后再试',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: '登录尝试次数过多，请15分钟后再试',
  },
  skipSuccessfulRequests: true,
})

export const lotteryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    message: '抽奖请求过于频繁，请稍后再试',
  },
})
