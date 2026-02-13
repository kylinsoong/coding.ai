import mongoose from 'mongoose'

const redEnvelopeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '红包名称是必填项'],
      trim: true,
    },
    minAmount: {
      type: Number,
      required: [true, '最小金额是必填项'],
      min: [0, '最小金额不能为负数'],
    },
    maxAmount: {
      type: Number,
      required: [true, '最大金额是必填项'],
      min: [0, '最大金额不能为负数'],
    },
    winProbability: {
      type: Number,
      required: [true, '中奖概率是必填项'],
      min: [0, '中奖概率不能为负数'],
      max: [100, '中奖概率不能超过100%'],
    },
    totalPackets: {
      type: Number,
      required: [true, '红包总数是必填项'],
      min: [1, '红包总数至少为1'],
    },
    remainingPackets: {
      type: Number,
      required: true,
    },
    prizes: [
      {
        name: String,
        type: {
          type: String,
          enum: ['cash', 'gift', 'special'],
        },
        value: Number,
        probability: Number,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    round: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

redEnvelopeSchema.index({ isActive: 1 })
redEnvelopeSchema.index({ round: 1 })

export default mongoose.model('RedEnvelope', redEnvelopeSchema)
