import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { lotteryAPI } from '../../services/api'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await lotteryAPI.getLeaderboard()
      setLeaderboard(response.data.data)
    } catch (error) {
      console.error('Failed to fetch leaderboard leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return null
  }

  return (
    <div className="card chinese-border box-shadow-glow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-chinese-red">
          🏆 排行榜
        </h3>
        <button
          onClick={fetchLeaderboard}
          className="text-sm text-imperial-gold hover:underline"
        >
          刷新
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-imperial-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {leaderboard.map((item, index) => (
            <motion.div
              key={item.user?.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index < 3 
                  ? 'bg-gradient-to-r from-imperial-gold/20 to-bright-gold/10 border border-imperial-gold/30' 
                  : 'bg-spring-red-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-imperial-gold flex items-center justify-center text-deep-red font-bold text-sm">
                  {getMedal(index) || index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {item.user?.name || '未知用户'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.user?.department || '未知部门'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-imperial-gold font-bold text-sm">
                  ¥{item.totalAmount || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {item.winCount || 0} 次
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-gray-500">
            暂无排行榜数据
          </p>
        </div>
      )}
    </div>
  )
}
