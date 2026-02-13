import Joi from 'joi'

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return res.status(400).json({ message: errors.join(', ') })
    }
    next()
  }
}

export const schemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50).messages({
      'string.empty': '姓名不能为空',
      'string.min': '姓名至少2个字符',
      'string.max': '姓名不能超过50个字符',
    }),
    department: Joi.string().required().max(100).messages({
      'string.empty': '部门不能为空',
      'string.max': '部门名称不能超过100个字符',
    }),
    phone: Joi.string()
      .required()
      .pattern(/^1[3-9]\d{9}$/)
      .messages({
        'string.empty': '手机号不能为空',
        'string.pattern.base': '请输入有效的手机号',
      }),
  }),

  login: Joi.object({
    phone: Joi.string()
      .required()
      .pattern(/^1[3-9]\d{9}$/)
      .messages({
        'string.empty': '手机号不能为空',
        'string.pattern.base': '请输入有效的手机号',
      }),
  }),

  createRedEnvelope: Joi.object({
    name: Joi.string().required().min(1).max(100),
    minAmount: Joi.number().required().min(0),
    maxAmount: Joi.number().required().min(0),
    winProbability: Joi.number().required().min(0).max(100),
    totalPackets: Joi.number().required().min(1),
    prizes: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid('cash', 'gift', 'special').required(),
        value: Joi.number().min(0),
        probability: Joi.number().min(0).max(100),
        description: Joi.string(),
      })
    ),
  }),

  createActivity: Joi.object({
    title: Joi.string().required().min(1).max(200),
    description: Joi.string().max(500),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref('startDate')),
    maxParticipants: Joi.number().min(1).max(1000),
    settings: Joi.object({
      allowMultipleWins: Joi.boolean(),
      requireOnline: Joi.boolean(),
      showWinners: Joi.boolean(),
    }),
  }),
}
