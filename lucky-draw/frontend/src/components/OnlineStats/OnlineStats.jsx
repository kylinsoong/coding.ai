import { motion } from 'framer-motion'

export default function OnlineStats({ onlineCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card chinese-border box-shadow-glow"
    >
      <div className="flex items-center justify-around">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-gray-600 text-sm">在线人数</span>
          </div>
          <p className="text-4xl font-bold text-chinese-red">
            {onlineCount}
          </p>
        </div>

        <div className="h-16 w-px bg-imperial-gold/30"></div>

        <div className="text-center">
          <div className="mb-2">
            <span className="text-gray-600 text-sm">活动状态</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">🎊</span>
            <span className="text-imperial-gold font-bold text-lg">
              进行中
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
