import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '活动标题是必填项'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: 200,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed'],
      default: 'draft',
    },
    settings: {
      allowMultipleWins: {
        type: Boolean,
        default: false,
      },
      requireOnline: {
        type: Boolean,
        default: true,
      },
      showWinners: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

activitySchema.index({ status: 1 })

export default mongoose.model('Activity', activitySchema)
