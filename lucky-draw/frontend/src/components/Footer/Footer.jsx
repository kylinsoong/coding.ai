export default function Footer() {
  return (
    <footer className="bg-deep-red/90 backdrop-blur-sm border-t border-imperial-gold/30 relative z-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-imperial-gold font-display font-semibold text-lg mb-1">
              🎊 2026 企业年会互动系统
            </p>
            <p className="text-white/60 text-sm">
              祝您新年快乐，万事如意！
            </p>
          </div>
          
          <div className="flex items-center space-x-6 text-white/60 text-sm">
            <span>🧧 恭喜发财</span>
            <span>🏮 吉祥如意</span>
            <span>🎆 新春大吉</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
