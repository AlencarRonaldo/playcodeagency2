'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, Check } from 'lucide-react'
import { trackingHelpers } from '@/lib/hooks/useAchievements'
import { audioHelpers } from '@/lib/hooks/useAudio'

export type PowerUpRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'

interface PowerUpCardProps {
  id?: string
  name: string
  description: string
  icon: LucideIcon
  rarity: PowerUpRarity
  level: number
  stats: {
    power: number
    efficiency: number
    innovation: number
  }
  price?: string
  isUnlocked?: boolean
  onSelect?: () => void
  className?: string
  fullDescription?: string
  features?: string[]
  isExpanded?: boolean
  onToggleExpansion?: () => void
}

const rarityConfig = {
  common: {
    border: 'border-led-white/50',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.5)]',
    gradient: 'from-led-white/20 to-led-white/10',
    text: 'text-led-white',
    accent: 'text-led-white',
    badgeGlow: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
  },
  rare: {
    border: 'border-electric-blue/70',
    glow: 'shadow-[0_0_20px_rgba(0,212,255,0.6)]',
    gradient: 'from-electric-blue/30 to-electric-blue/15',
    text: 'text-electric-blue',
    accent: 'text-electric-blue',
    badgeGlow: 'drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]'
  },
  epic: {
    border: 'border-gaming-purple/80',
    glow: 'shadow-[0_0_25px_rgba(139,92,246,0.7)]',
    gradient: 'from-gaming-purple/35 to-gaming-purple/15',
    text: 'text-gaming-purple',
    accent: 'text-gaming-purple',
    badgeGlow: 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]'
  },
  legendary: {
    border: 'border-plasma-yellow/90',
    glow: 'shadow-[0_0_30px_rgba(255,234,0,0.8)]',
    gradient: 'from-plasma-yellow/40 to-plasma-yellow/20',
    text: 'text-plasma-yellow',
    accent: 'text-plasma-yellow',
    badgeGlow: 'drop-shadow-[0_0_10px_rgba(255,234,0,1)]'
  },
  mythic: {
    border: 'border-laser-green/90',
    glow: 'shadow-[0_0_35px_rgba(34,197,94,0.9)]',
    gradient: 'from-laser-green/40 to-laser-green/20',
    text: 'text-laser-green',
    accent: 'text-laser-green',
    badgeGlow: 'drop-shadow-[0_0_10px_rgba(34,197,94,1)]'
  }
}

export default function PowerUpCard({
  id,
  name,
  description,
  icon: Icon,
  rarity,
  level,
  stats,
  price,
  isUnlocked = true,
  onSelect,
  className = '',
  fullDescription,
  features,
  isExpanded: controlledExpanded,
  onToggleExpansion
}: PowerUpCardProps) {
  const config = rarityConfig[rarity]
  const [internalExpanded, setInternalExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number, delay: number}>>([])
  
  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded
  
  // Generate particles only on client
  useEffect(() => {
    setMounted(true)
    setParticles(
      Array.from({ length: 3 }).map(() => ({
        x: Math.random() * 200,
        y: Math.random() * 200,
        duration: 2 + Math.random(),
        delay: Math.random() * 3
      }))
    )
  }, [])

  // Track power-up view on mount
  useEffect(() => {
    if (id) {
      trackingHelpers.trackPowerUpView(id)
    }
  }, [id])

  const toggleExpansion = () => {
    if (onToggleExpansion) {
      onToggleExpansion()
    } else {
      setInternalExpanded(!internalExpanded)
      audioHelpers.playClick(false)
    }
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -8
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br ${config.gradient}
        backdrop-blur-xl border-2 ${config.border}
        rounded-xl p-6 transition-all duration-300
        hover:${config.glow}
        ${!isUnlocked ? 'opacity-60 grayscale' : ''}
        ${className}
      `}
      onMouseEnter={() => {
        audioHelpers.playHover()
        if (id) {
          trackingHelpers.trackHover(`powerup_${id}`)
        }
      }}
      onClick={() => {
        audioHelpers.playPowerUpSelect()
        if (id) {
          trackingHelpers.trackPowerUpSelect(id)
        }
        onSelect?.()
      }}
    >
      {/* Rarity Indicator */}
      <div className="absolute top-3 right-3">
        <div className={`
          px-3 py-1.5 rounded-lg text-xs font-bold gaming-mono uppercase
          ${config.text} ${config.border} border-2
          ${config.gradient} bg-gradient-to-r
          shadow-lg backdrop-blur-sm ${config.badgeGlow}
          transform transition-all duration-300 hover:scale-110 hover:rotate-1
          animate-pulse-slow neon-glow-strong
          relative overflow-hidden
        `}>
          <span className="relative z-10">{rarity}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </div>
      </div>

      {/* Lock Indicator */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-controller-black/50 rounded-xl flex items-center justify-center">
          <div className="text-6xl opacity-50">🔒</div>
        </div>
      )}

      {/* Power-up Icon */}
      <div className={`
        w-16 h-16 mx-auto mb-4 rounded-xl
        bg-gradient-to-br ${config.gradient}
        border ${config.border}
        flex items-center justify-center
        group-hover:animate-powerup
      `}>
        <Icon size={32} className={config.text} />
      </div>

      {/* Power-up Info */}
      <div className="text-center mb-4">
        <h3 className={`gaming-title text-lg font-bold mb-2 ${config.text}`}>
          {name}
        </h3>
        <p className="gaming-subtitle text-sm text-led-white/70 mb-3">
          {description}
        </p>
        
        {/* Level Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <span className="gaming-mono text-xs text-led-white/50">LVL</span>
          <span className={`gaming-display text-lg font-bold ${config.text}`}>
            {level}
          </span>
        </div>
      </div>

      {/* Stats Bars */}
      <div className="space-y-2 mb-4">
        {Object.entries(stats).map(([statName, value]) => (
          <div key={statName} className="flex items-center justify-between">
            <span className="gaming-mono text-xs text-led-white/60 uppercase w-20">
              {statName}
            </span>
            <div className="flex-1 mx-2">
              <div className="hud-bar h-2">
                <motion.div
                  className={`h-full bg-gradient-to-r ${config.gradient.replace('/10', '/60').replace('/5', '/40')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
            <span className={`gaming-mono text-xs ${config.text} w-8 text-right`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-led-white/20 pt-4">
        <div className="flex items-center justify-between mb-3">
          {price ? (
            <div className="gaming-mono text-sm font-bold text-laser-green">
              {price}
            </div>
          ) : (
            <div className="gaming-mono text-xs text-led-white/50">
              UNLOCKED
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-md gaming-mono text-xs font-bold
              border ${config.border} ${config.text}
              hover:bg-gradient-to-r ${config.gradient.replace('/10', '/20').replace('/5', '/10')}
              transition-all duration-200
              ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!isUnlocked}
            onMouseEnter={audioHelpers.playHover}
            onClick={(e) => {
              e.stopPropagation()
              if (isUnlocked) {
                audioHelpers.playClick(false)
                if (id) {
                  trackingHelpers.trackClick(`powerup_choose_${id}`)
                  trackingHelpers.trackPowerUpSelect(id)
                }
                
                // Redirect to contact page with service pre-selected
                const contactUrl = `/contato?servico=${encodeURIComponent(id)}&servico_nome=${encodeURIComponent(name)}`
                window.location.href = contactUrl
              } else {
                audioHelpers.playError()
              }
            }}
          >
            {isUnlocked ? 'ESCOLHER' : 'LOCKED'}
          </motion.button>
        </div>

        {/* Ver Detalhes Button */}
        {(fullDescription || features) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full px-3 py-2 rounded-md gaming-mono text-xs font-bold
              border ${config.border} ${config.text} bg-transparent
              hover:${config.gradient.replace('/10', '/20').replace('/5', '/10')} hover:bg-gradient-to-r
              transition-all duration-200
              ${isExpanded ? 'border-opacity-100' : 'border-opacity-50'}
            `}
            onMouseEnter={audioHelpers.playHover}
            onClick={(e) => {
              e.stopPropagation()
              toggleExpansion()
              if (id) {
                trackingHelpers.trackClick(`powerup_details_${id}`)
              }
            }}
          >
            {isExpanded ? 'OCULTAR DETALHES' : 'VER DETALHES'}
          </motion.button>
        )}
      </div>

      {/* Expanded Details */}
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        {(fullDescription || features) && (
          <div className="border-t border-led-white/10 pt-4 mt-4">
            {/* Full Description */}
            {fullDescription && (
              <div className="mb-4">
                <h4 className={`gaming-mono text-xs font-bold ${config.text} mb-2 uppercase`}>
                  Descrição Completa
                </h4>
                <p className="gaming-subtitle text-xs text-led-white/80 leading-relaxed">
                  {fullDescription}
                </p>
              </div>
            )}

            {/* Features List */}
            {features && features.length > 0 && (
              <div>
                <h4 className={`gaming-mono text-xs font-bold ${config.text} mb-2 uppercase`}>
                  Recursos Inclusos
                </h4>
                <div className="space-y-1">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-2"
                    >
                      <Check size={12} className={`${config.text} flex-shrink-0`} />
                      <span className="gaming-mono text-xs text-led-white/70">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Hover Effect Overlay */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${config.gradient.replace('/10', '/5').replace('/5', '/2')}
        transition-opacity duration-300 pointer-events-none
      `} />

      {/* Circuit Pattern */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="circuit-pattern opacity-20 w-full h-full" />
      </div>

      {/* Power-up Particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${config.text} rounded-full`}
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0
              }}
              animate={{
                y: [particle.y, particle.y - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'linear'
              }}
              style={{
                boxShadow: `0 0 4px currentColor`
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}