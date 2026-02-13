import RedEnvelope from '../models/RedEnvelope.js'

export const createRedEnvelope = async (req, res) => {
  try {
    const { name, minAmount, maxAmount, winProbability, totalPackets, prizes, round = 1 } = req.body

    if (minAmount > maxAmount) {
      return res.status(400).json({ message: '最小金额不能大于最大金额' })
    }

    const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0)
    if (Math.abs(totalProbability - 100) > 0.01) {
      return res.status(400).json({ message: '奖品概率总和必须为100%' })
    }

    const redEnvelope = await RedEnvelope.create({
      name,
      minAmount,
      maxAmount,
      winProbability,
      totalPackets,
      remainingPackets: totalPackets,
      prizes,
      round,
      isActive: true,
    })

    res.status(201).json({ message: '红包创建成功', data: redEnvelope })
  } catch (error) {
    res.status(500).json({ message: '创建红包失败', error: error.message })
  }
}

export const getRedEnvelopes = async (req, res) => {
  try {
    const { isActive, round } = req.query
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    if (round) filter.round = parseInt(round)

    const redEnvelopes = await RedEnvelope.find(filter).sort({ createdAt: -1 })

    res.json({ data: redEnvelopes })
  } catch (error) {
    res.status(500).json({ message: '获取红包列表失败', error: error.message })
  }
}

export const getRedEnvelopeById = async (req, res) => {
  try {
    const { id } = req.params
    const redEnvelope = await RedEnvelope.findById(id)

    if (!redEnvelope) {
      return res.status(404).json({ message: '红包不存在' })
    }

    res.json({ data: redEnvelope })
  } catch (error) {
    res.status(500).json({ message: '获取红包详情失败', error: error.message })
  }
}

export const updateRedEnvelope = async (req, res) => {
  try {
    const { id } = req.params
    const redEnvelope = await RedEnvelope.findById(id)

    if (!redEnvelope) {
      return res.status(404).json({ message: '红包不存在' })
    }

    Object.assign(redEnvelope, req.body)
    await redEnvelope.save()

    res.json({ message: '红包更新成功', data: redEnvelope })
  } catch (error) {
    res.status(500).json({ message: '更新红包失败', error: error.message })
  }
}

export const deleteRedEnvelope = async (req, res) => {
  try {
    const { id } = req.params
    const redEnvelope = await RedEnvelope.findById(id)

    if (!redEnvelope) {
      return res.status(404).json({ message: '红包不存在' })
    }

    await RedEnvelope.findByIdAndDelete(id)

    res.json({ message: '红包删除成功' })
  } catch (error) {
    res.status(500).json({ message: '删除红包失败', error: error.message })
  }
}

export const toggleRedEnvelope = async (req, res) => {
  try {
    const { id } = req.params
    const redEnvelope = await RedEnvelope.findById(id)

    if (!redEnvelope) {
      return res.status(404).json({ message: '红包不存在' })
    }

    redEnvelope.isActive = !redEnvelope.isActive
    await redEnvelope.save()

    res.json({ message: '红包状态更新成功', data: redEnvelope })
  } catch (error) {
    res.status(500).json({ message: '更新红包状态失败', error: error.message })
  }
}
