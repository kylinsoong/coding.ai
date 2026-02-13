import User from '../models/User.js'
import Lottery from '../models/Lottery.js'
import RedEnvelope from '../models/RedEnvelope.js'
import Activity from '../models/Activity.js'

export const participate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user.isOnline) {
      return res.status(400).json({ message: '请先上线参与活动' })
    }

    const activity = await Activity.findOne({ status: 'active' })
    if (!activity) {
      return res.status(400).json({ message: '当前没有活动进行中' })
    }

    if (!activity.settings.allowMultipleWins && user.hasWon) {
      return res.status(400).json({ message: '您已经中奖过了，感谢参与' })
    }

    const redEnvelope = await RedEnvelope.findOne({ isActive: true, round: activity.settings.currentRound || 1 })
    if (!redEnvelope || redEnvelope.remainingPackets <= 0) {
      return res.status(400).json({ message: '红包已发完' })
    }

    const random = Math.random() * 100
    const isWinner = random < redEnvelope.winProbability

    if (!isWinner) {
      return res.json({
        message: '很遗憾，没有中奖',
        data: { won: false, message: '再接再厉！' },
      })
    }

    const prizeIndex = Math.floor(Math.random() * redEnvelope.prizes.length)
    const prize = redEnvelope.prizes[prizeIndex]

    const amount = prize.type === 'cash' 
      ? Math.floor(Math.random() * (redEnvelope.maxAmount - redEnvelope.minAmount + 1)) + redEnvelope.minAmount
      : 0

    const lottery = await Lottery.create({
      user: user._id,
      prize,
      amount,
      round: redEnvelope.round,
    })

    user.hasWon = true
    user.winCount += 1
    await user.save()

    redEnvelope.remainingPackets -= 1
    if (redEnvelope.remainingPackets === 0) {
      redEnvelope.isActive = false
    }
    await redEnvelope.save()

    res.json({
      message: '恭喜中奖！',
      data: {
        won: true,
        lottery: {
          id: lottery._id,
          prize: lottery.prize,
          amount: lottery.amount,
          round: lottery.round,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ message: '抽奖失败', error: error.message })
  }
}

export const getLotteryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    const lotteries = await Lottery.find({ user: req.user._id })
      .populate('user', 'name department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Lottery.countDocuments({ user: req.user._id })

    res.json({
      data: lotteries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: '获取抽奖记录失败', error: error.message })
  }
}

export const getAllLotteries = async (req, res) => {
  try {
    const { round, status, page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    const filter = {}
    if (round) filter.round = parseInt(round)
    if (status) filter.status = status

    const lotteries = await Lottery.find(filter)
      .populate('user', 'name department phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Lottery.countDocuments(filter)

    res.json({
      data: lotteries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ message: '获取所有抽奖记录失败', error: error.message })
  }
}

export const getWinners = async (req, res) => {
  try {
    const { round, limit = 50 } = req.query
    const filter = { status: 'pending' }
    if (round) filter.round = parseInt(round)

    const winners = await Lottery.find(filter)
      .populate('user', 'name department')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))

    res.json({ data: winners })
  } catch (error) {
    res.status(500).json({ message: '获取中奖名单失败', error: error.message })
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Lottery.aggregate([
      {
        $group: {
          _id: '$user',
          totalAmount: { $sum: '$amount' },
          winCount: { $sum: 1 },
          lastWin: { $max: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          user: {
            id: '$_id',
            name: '$user.name',
            department: '$user.department',
          },
          totalAmount: 1,
          winCount: 1,
          lastWin: 1,
        },
      },
      { $sort: { totalAmount: -1, winCount: -1 } },
      { $limit: 50 },
    ])

    res.json({ data: leaderboard })
  } catch (error) {
    res.status(500).json({ message: '获取排行榜失败', error: error.message })
  }
}

export const claimPrize = async (req, res) => {
  try {
    const { lotteryId } = req.params
    const lottery = await Lottery.findById(lotteryId)

    if (!lottery) {
      return res.status(404).json({ message: '抽奖记录不存在' })
    }

    if (lottery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权操作此记录' })
    }

    if (lottery.status === 'claimed') {
      return res.status(400).json({ message: '奖品已领取' })
    }

    lottery.status = 'claimed'
    lottery.claimedAt = Date.now()
    await lottery.save()

    res.json({ message: '奖品领取成功', data: lottery })
  } catch (error) {
    res.status(500).json({ message: '领取奖品失败', error: error.message })
  }
}
