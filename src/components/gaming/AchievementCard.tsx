'use client'

import { motion } from 'framer-motion'
import { Achievement } from '@/lib/achievements/types'
import { RARITY_CONFIG, ACHIEVEMENT_CATEGORIES } from '@/lib/achievements/definitions'
import { useAchievements } from '@/lib/hooks/useAchievements'

interface AchievementCardProps {
  achievement: Achievement
  className?: string
  showProgress?: boolean
}

export default function AchievementCard({ 
  achievement, 
  className = '',
  showProgress = true 
}: AchievementCardProps) {
  const { getAchievementProgress, isUnlocked } = useAchievements()
  const progress = getAchievementProgress(achievement.id)
  const unlocked = isUnlocked(achievement.id)
  const rarity = RARITY_CONFIG[achievement.rarity]
  const category = ACHIEVEMENT_CATEGORIES[achievement.category]

  return (
    <motion.div
      whileHover={{ 
        scale: unlocked ? 1.02 : 1.01,
        y: unlocked ? -4 : -2
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-black/80 to-black/60
        backdrop-blur-xl border-2 rounded-xl p-4
        transition-all duration-300
        ${unlocked 
          ? `border-opacity-100 shadow-lg` 
          : `border-opacity-30 opacity-60 grayscale`
        }
        ${className}
      `}
      style={{
        borderColor: unlocked ? rarity.color : '#444',
        boxShadow: unlocked 
          ? `0 0 15px ${rarity.glow}, 0 0 30px ${rarity.glow}` 
          : '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Hidden achievement overlay */}
      {achievement.hidden && !unlocked && (
        <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🔐</div>
            <div className="gaming-mono text-sm text-led-white/70">
              HIDDEN ACHIEVEMENT
            </div>
          </div>
        </div>
      )}

      {/* Rarity indicator */}
      <div className="absolute top-3 right-3">
        <div 
          className={`
            px-2 py-1 rounded-md text-xs font-bold gaming-mono uppercase
            border
          `}
          style={{
            color: rarity.color,
            borderColor: rarity.color,
            backgroundColor: `${rarity.color}20`
          }}
        >
          {rarity.name}
        </div>
      </div>

      {/* Achievement icon */}
      <div className="mb-4">
        <motion.div
          animate={unlocked ? {
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: unlocked ? Infinity : 0,
            ease: 'easeInOut'
          }}
          className={`
            w-16 h-16 mx-auto rounded-xl
            border-2 flex items-center justify-center text-3xl
            ${unlocked ? 'animate-glow' : ''}
          `}
          style={{
            borderColor: unlocked ? rarity.color : '#444',
            backgroundColor: unlocked ? `${rarity.color}20` : '#1a1a1a'
          }}
        >
          {achievement.icon}
        </motion.div>
      </div>

      {/* Achievement info */}
      <div className="text-center mb-4">
        <h3 
          className={`gaming-title text-lg font-bold mb-2 ${
            unlocked ? '' : 'text-led-white/60'
          }`}
          style={{ color: unlocked ? rarity.color : undefined }}
        >
          {achievement.name}
        </h3>
        
        <p className={`gaming-subtitle text-sm mb-3 ${
          unlocked ? 'text-led-white/80' : 'text-led-white/50'
        }`}>
          {achievement.description}
        </p>

        {/* Category */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span style={{ color: category.color }}>{category.icon}</span>
          <span className="gaming-mono text-xs" style={{ color: category.color }}>
            {category.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && achievement.maxProgress && achievement.maxProgress > 1 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="gaming-mono text-xs text-led-white/60">
              PROGRESSO
            </span>
            <span className="gaming-mono text-xs" style={{ color: rarity.color }}>
              {progress.progress}/{progress.maxProgress}
            </span>
          </div>
          
          <div className="hud-bar h-2">
            <motion.div
              className="h-full bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(90deg, ${rarity.color}, ${category.color})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* XP reward */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${rarity.color}30` }}
          >
            <span className="text-xs">⚡</span>
          </div>
          <span 
            className="gaming-mono text-sm font-bold"
            style={{ color: unlocked ? rarity.color : '#666' }}
          >
            {achievement.xp} XP
          </span>
        </div>

        {unlocked && (
          <div className="flex items-center space-x-1">
            <span className="text-laser-green text-sm">✓</span>
            <span className="gaming-mono text-xs text-laser-green">
              UNLOCKED
            </span>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      {unlocked && (
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${rarity.glow} 0%, transparent 70%)`
          }}
        />
      )}

      {/* Particle effects for unlocked achievements */}
      {unlocked && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: rarity.color }}
              initial={{
                x: Math.random() * 200,
                y: Math.random() * 200,
                opacity: 0
              }}
              animate={{
                y: [null, -30],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}