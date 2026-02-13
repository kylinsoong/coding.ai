import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Fireworks() {
  const [fireworks, setFireworks] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newFirework = {
          id: Date.now(),
          x: Math.random() * 100,
          y: 20 + Math.random() * 30,
          color: ['#FFD700', '#FF6B35', '#C41E3A', '#00A86B'][Math.floor(Math.random() * 4)],
        }
        setFireworks(prev => [...prev, newFirework])
        
        setTimeout(() => {
          setFireworks(prev => prev.filter(f => f.id !== newFirework.id))
        }, 1500)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {fireworks.map(firework => (
          <motion.div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: firework.color,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: Math.cos((i * 45) * Math.PI / 180) * 50,
                  y: Math.sin((i * 45) * Math.PI / 180) * 50,
                }}
                transition={{ duration: 1 }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
