import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLotteryStore } from '../../store/lotteryStore'
import { lotteryAPI } from '../../services/api'
import { emitLotteryTrigger, emitRedPacketFall, emitFireworkLaunch } from '../../services/socket'
import toast from 'react-hot-toast'
import LotteryButton from '../../components/LotteryButton/LotteryButton'
import RedPacketAnimation from '../../components/RedPacketAnimation/RedPacketAnimation'
import WinnersList from '../../components/WinnersList/WinnersList'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import OnlineStats from '../../components/OnlineStats/OnlineStats'

export default function HomePage() {
  const { onlineCount, winners, redPacketsFalling, isLotteryActive } = useLotteryStore()
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResult, setShowResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
    fetchWinners()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await lotteryAPI.getHistory()
      setHistory(response.data.data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const fetchWinners = async () => {
    try {
      const response = await lotteryAPI.getWinners()
      useLotteryStore.getState().setWinners(response.data.data)
    } catch (error) {
      console.error('Failed to fetch winners:', error)
    }
  }

  const handleLottery = async () => {
    if (isDrawing) return

    setIsDrawing(true)
    emitLotteryTrigger({ timestamp: Date.now() })

    try {
      const response = await lotteryAPI.participate()
      const result = response.data.data

      if (result.won) {
        setShowResult(result.lottery)
        emitFireworkLaunch({ type: 'win', data: result.lottery })
        toast.success('🎉 恭喜中奖！')
        fetchHistory()
        fetchWinners()
      } else {
        toast.info('再接再厉，下次一定中！')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '抽奖失败，请重试')
    } finally {
      setIsDrawing(false)
    }
  }

  const closeResult = () => {
    setShowResult(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OnlineStats onlineCount={onlineCount} />
          
          <div className="card chinese-border box-shadow-glow">
            <div className="text-center py-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold gold-text mb-4">
                🧧 幸运抽奖 🧧
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                点击下方按钮参与抽奖，赢取丰厚奖品！
              </p>
              
              <LotteryButton
                isDrawing={isDrawing}
                onClick={handleLottery}
              />
            </div>
          </div>

          <WinnersList winners={winners} />
        </div>

        <div className="space-y-6">
          <Leaderboard />
          
          <div className="card">
            <h3 className="font-display text-xl font-bold text-chinese-red mb-4">
              我的抽奖记录
            </h3>
            {history.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-spring-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.prize.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {item.amount > 0 && (
                      <span className="text-imperial-gold font-bold">
                        ¥{item.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                暂无抽奖记录
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {redPacketsFalling.map((packet) => (
          <RedPacketAnimation
            key={packet.id}
            packet={packet}
            onComplete={() => {
              useLotteryStore.getState().removeRedPacket(packet.id)
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="card chinese-border max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="font-display text-3xl font-bold gold-text mb-4">
                恭喜中奖！
              </h2>
              <div className="bg-gradient-to-r from-imperial-gold/20 to-bright-gold/20 rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold text-chinese-red mb-2">
                  {showResult.prize.name}
                </p>
                {showResult.amount > 0 && (
                  <p className="text-3xl font-bold text-imperial-gold">
                    ¥{showResult.amount}
                  </p>
                )}
                {showResult.prize.description && (
                  <p className="text-gray-600 mt-2">
                    {showResult.prize.description}
                  </p>
                )}
              </div>
              <button
                onClick={closeResult}
                className="btn-primary w-full"
              >
                太棒了！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
