import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '姓名是必填项'],
      trim: true,
      maxlength: [50, '姓名不能超过50个字符'],
    },
    department: {
      type: String,
      required: [true, '部门是必填项'],
      trim: true,
      maxlength: [100, '部门名称不能超过100个字符'],
    },
    phone: {
      type: String,
      required: [true, '手机号是必填项'],
      trim: true,
      match: [/^1[3-9]\d{9}$/, '请输入有效的手机号'],
      unique: true,
    },
    qrCode: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive'],
      default: 'pending',
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    hasWon: {
      type: Boolean,
      default: false,
    },
    winCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.index({ phone: 1 })
userSchema.index({ qrCode: 1 })
userSchema.index({ isOnline: 1 })

export default mongoose.model('User', userSchema)
