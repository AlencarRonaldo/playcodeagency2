'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from '@/lib/achievements/types'
import { RARITY_CONFIG } from '@/lib/achievements/definitions'

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const rarity = RARITY_CONFIG[achievement.rarity]

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 25,
            mass: 0.8
          }}
          className="fixed top-6 right-6 z-50 max-w-sm"
        >
          <div 
            className={`
              gaming-card p-6 border-2 relative overflow-hidden
              bg-gradient-to-br from-black/90 to-black/70
              backdrop-blur-xl
            `}
            style={{
              borderColor: rarity.color,
              boxShadow: `0 0 20px ${rarity.glow}, 0 0 40px ${rarity.glow}`,
            }}
          >
            {/* Background glow effect */}
            <div 
              className="absolute inset-0 opacity-20 blur-xl"
              style={{
                background: `radial-gradient(circle, ${rarity.color} 0%, transparent 70%)`
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: 'easeInOut'
                  }}
                  className="text-3xl"
                >
                  {achievement.icon}
                </motion.div>
                
                <div>
                  <div className="gaming-mono text-xs font-bold tracking-wider text-laser-green">
                    🏆 ACHIEVEMENT UNLOCKED
                  </div>
                  <div 
                    className={`gaming-mono text-xs font-bold tracking-wider`}
                    style={{ color: rarity.color }}
                  >
                    {rarity.name.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Achievement info */}
              <div className="mb-4">
                <h3 
                  className="gaming-title text-lg font-bold mb-1"
                  style={{ color: rarity.color }}
                >
                  {achievement.name}
                </h3>
                <p className="gaming-subtitle text-sm text-led-white/80">
                  {achievement.description}
                </p>
              </div>

              {/* XP reward */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 1,
                      ease: 'easeInOut'
                    }}
                    className="w-6 h-6 bg-gradient-to-r from-laser-green to-electric-blue rounded-full flex items-center justify-center"
                  >
                    <span className="text-xs font-bold">⚡</span>
                  </motion.div>
                  <span className="gaming-mono text-sm font-bold text-laser-green">
                    +{achievement.xp} XP
                  </span>
                </div>

                <div className="gaming-mono text-xs text-led-white/60">
                  {achievement.category}
                </div>
              </div>
            </div>

            {/* Particle effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: rarity.color }}
                  initial={{
                    x: Math.random() * 300,
                    y: Math.random() * 200,
                    opacity: 0
                  }}
                  animate={{
                    y: [null, -50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>

            {/* Rarity border animation */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 pointer-events-none"
              style={{ borderColor: rarity.color }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}