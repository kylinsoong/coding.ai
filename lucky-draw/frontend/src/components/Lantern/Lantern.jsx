import { motion } from 'framer-motion'

const lanternColors = [
  'from-red-600 to-red-800',
  'from-orange-500 to-red-700',
  'from-red-500 to-red-700',
]

export default function Lantern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 18}%`,
              top: '-20px',
            }}
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="relative">
              <svg
                width="60"
                height="100"
                viewBox="0 0 60 100"
                className="drop-shadow-2xl"
              >
                <defs>
                  <linearGradient id={`lantern-grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#991B1B" />
                  </linearGradient>
                  <radialGradient id={`lantern-glow-${i}`}>
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                <ellipse
                  cx="30"
                  cy="15"
                  rx="25"
                  ry="8"
                  fill="#D4AF37"
                />
                <rect
                  x="10"
                  y="15"
                  width="40"
                  height="60"
                  rx="5"
                  fill={`url(#lantern-grad-${i})`}
                />
                <ellipse
                  cx="30"
                  cy="75"
                  rx="25"
                  ry="8"
                  fill="#D4AF37"
                />
                <circle
                  cx="30"
                  cy="45"
                  r="812"
                  fill="url(#lantern-glow-${i})"
                />
                <text
                  x="30"
                  y="50"
"
                  textAnchor="middle"
                  fill="#FFD700"
                  fontSize="14"
                  fontWeight="bold"
                >
                  福
                </text>
                <line
                  x1="30"
                  y1="75"
                  x2="30"
                  y2="100"
                  stroke="#D4AF37"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
