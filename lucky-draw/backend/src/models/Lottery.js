import mongoose from 'mongoose'

const lotterySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prize: {
      type: {
        name: String,
        type: {
          type: String,
          enum: ['cash', 'gift', 'special'],
        },
        value: Number,
        description: String,
      },
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
