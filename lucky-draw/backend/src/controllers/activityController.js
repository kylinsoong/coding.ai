import Activity from '../models/Activity.js'

export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body)
    res.status(201).json({ message: '活动创建成功', data: activity })
  } catch (error) {
    res.status(500).json({ message: '创建活动失败', error: error.message })
  }
}

export const getActivities = async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status) filter.status = status

    const activities = await Activity.find(filter).sort({ createdAt: -1 })
    res.json({ data: activities })
  } catch (error) {
    res.status(500).json({ message: '获取活动列表失败', error: error.message })
  }
}

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params
    const activity = await Activity.findById(id)

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' })
    }

    res.json({ data: activity })
  } catch (error) {
    res.status(500).json({ message: '获取活动详情失败', error: error.message })
  }
}

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params
    const activity = await Activity.findById(id)

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' })
    }

    Object.assign(activity, req.body)
    await activity.save()

    res.json({ message: '活动更新成功', data: activity })
  } catch (error) {
    res.status(500).json({ message: '更新活动失败', error: error.message })
  }
}

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params
    const activity = await Activity.findById(id)

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' })
    }

    await Activity.findByIdAndDelete(id)

    res.json({ message: '活动删除成功' })
  } catch (error) {
    res.status(500).json({ message: '删除活动失败', error: error.message })
  }
}

export const updateActivityStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['draft', 'active', 'paused', 'completed'].includes(status)) {
      return res.status(400).json({ message: '无效的活动状态' })
    }

    const activity = await Activity.findById(id)

    if (!activity) {
      return res.status(404).json({ message: '活动不存在' })
    }

    activity.status = status
    await activity.save()

    res.json({ message: '活动状态更新成功', data: activity })
  } catch (error) {
    res.status(500).json({ message: '更新活动状态失败', error: error.message })
  }
}

export const getActiveActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({ status: 'active' })

    if (!activity) {
      return res.status(404).json({ message: '当前没有活动进行中' })
    }

    res.json({ data: activity })
  } catch (error) {
    res.status(500).json({ message: '获取活动信息失败', error: error.message })
  }
}
