import { Link } from 'react-router-dom'
import { useLotteryStore } from '../../store/lotteryStore'

export default function Header({ user, onLogout }) {
  const { onlineCount } = useLotteryStore()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-deep-red via-chinese-red to-deep-red shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-4xl group-hover:animate-pulse">🎊</div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-imperial-gold text-shadow-glow">
                年会幸运抽奖
              </h1>
              <p className="text-xs md:text-sm text-white/80">
                2026新春盛典
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white font-medium">
                在线: <span className="font-bold text-imperial-gold">{onlineCount}</span>
              </span>
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-white font-medium text-sm md:text-base">{user.name}</p>
                  <p className="text-white/60 text-xs">{user.department}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-imperial-gold flex items-center justify-center text-deep-red font-bold text-lg shadow-lg">
                  {user.name?.charAt(0) || '用'}
                </div>
                <button
                  onClick={onLogout}
                  className="btn-outline text-sm md:text-base py-2 px-3 md:px-4"
                >
                  退出
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
