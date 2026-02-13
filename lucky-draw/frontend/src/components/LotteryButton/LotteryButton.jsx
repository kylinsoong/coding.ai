import { motion } from 'framer-motion'

export default function LotteryButton({ isDrawing, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDrawing}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-full
        ${isDrawing ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
        boxShadow: '0 20px 60px rgba(196, 30, 58, 0.4)',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isDrawing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-2"
            >
              🧧
            </motion.div>
            <span className="text-white font-bold text-lg">抽奖中...</span>
          </>
        ) : (
          <>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-2"
            >
              🧧
            </motion.div>
            <span className="text-imperial-gold font-display font-bold text-xl">
              点击抽奖
            </span>
          </>
        )}
      </div>

      <div className="absolute inset-0 rounded-full border-4 border-imperial-gold/50"></div>
      <div className="absolute inset-2 rounded-full border-2 border-bright-gold/30"></div>

      <div className="absolute -top-2 -right-2 w-8 h-8 bg-bright-gold rounded-full flex items-center justify-center text-deep-red font-bold shadow-lg">
        ¥
      </div>
    </motion.button>
  )
}
