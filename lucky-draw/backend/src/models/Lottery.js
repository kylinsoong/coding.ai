import mongoose from 'mongoose'

const prizeSchema = new mongoose.Schema({
  name: String,
  prizeType: {
    type: String,
    enum: ['cash', 'gift', 'special'],
  },
  value: Number,
  description: String,
})

const lotterySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prize: {
      type: prizeSchema,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'claimed', 'expired'],
      default: 'pending',
    },
    claimedAt: {
      type: Date,
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

lotterySchema.index({ user: 1 })
lotterySchema.index({ status: 1 })
lotterySchema.index({ round: 1 })
lotterySchema.index({ createdAt: -1 })

export default mongoose.model('Lottery', lotterySchema)
