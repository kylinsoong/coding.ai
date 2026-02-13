import { motion } from 'framer-motion'

export default function WinnersList({ winners }) {
  return (
    <div className="card chinese-border box-shadow-glow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-chinese-red">
          🎉 中奖名单
        </h3>
        <span className="text-sm text-gray-500">
          共 {winners.length} 人
        </span>
      </div>

      {winners.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {winners.map((winner, index) => (
            <motion.div
              key={winner._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-imperial-gold/10 to-transparent rounded-lg border border-imperial-gold/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-imperial-gold flex items-center justify-center text-deep-red font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {winner.user?.name || '未知用户'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {winner.user?.department || '未知部门'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-chinese-red">
                  {winner.prize?.name || '未知奖品'}
                </p>
                {winner.amount > 0 && (
                  <p className="text-imperial-gold font-bold">
                    ¥{winner.amount}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🧧</div>
          <p className="text-gray-500">
            暂无中奖记录，快来参与抽奖吧！
          </p>
        </div>
      )}
    </div>
  )
}
