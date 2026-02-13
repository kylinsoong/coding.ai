import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function RedPacketAnimation({ packet, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ 
        y: -100, 
        x: packet.x || Math.random() * (window.innerWidth - 100),
        rotate: 0,
        opacity: 1 
      }}
      animate={{ 
        y: window.innerHeight + 100,
        rotate: 360,
        opacity: 0 
      }}
      transition={{ 
        duration: 4, 
        ease: 'easeIn' 
      }}
      className="fixed z-40 pointer-events-none"
      style={{
        left: `${packet.x || Math.random() * 80 + 10}%`,
      }}
    >
      <svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="redpacket-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#C41E3A" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>
        
        <rect
          x="5"
          y="10"
          width="70"
          height="80"
          rx="5"
          fill="url(#redpacket-grad)"
        />
        
        <rect
          x="5"
          y="10"
          width="70"
          height="25"
          rx="5"
          fill="#D4AF37"
        />
        
        <circle
          cx="40"
          cy="22"
          r="8"
          fill="#C41E3A"
        />
        
        <text
          x="40"
          y="27"
          textAnchor="middle"
          fill="#FFD700"
          fontSize="16"
          fontWeight="bold"
        >
          福
        </text>
        
        <path
          d="M 5 35 L 40 52 L 75 35"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </motion.div>
  )
}
