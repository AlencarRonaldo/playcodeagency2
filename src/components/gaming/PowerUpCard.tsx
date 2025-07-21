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
    border: 'border-led-white/30',
    glow: 'shadow-[0_0_10px_rgba(255,255,255,0.3)]',
    gradient: 'from-led-white/10 to-led-white/5',
    text: 'text-led-white',
    accent: 'text-led-white'
  },
  rare: {
    border: 'border-electric-blue/60',
    glow: 'shadow-[0_0_15px_rgba(0,212,255,0.4)]',
    gradient: 'from-electric-blue/20 to-electric-blue/10',
    text: 'text-electric-blue',
    accent: 'text-electric-blue'
  },
  epic: {
    border: 'border-gaming-purple/70',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    gradient: 'from-gaming-purple/25 to-gaming-purple/10',
    text: 'text-gaming-purple',
    accent: 'text-gaming-purple'
  },
  legendary: {
    border: 'border-plasma-yellow/80',
    glow: 'shadow-[0_0_25px_rgba(255,234,0,0.6)]',
    gradient: 'from-plasma-yellow/30 to-plasma-yellow/10',
    text: 'text-plasma-yellow',
    accent: 'text-plasma-yellow'
  },
  mythic: {
    border: 'border-laser-green/80',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.7)]',
    gradient: 'from-laser-green/30 to-laser-green/10',
    text: 'text-laser-green',
    accent: 'text-laser-green'
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
  
  // Use controlled state if provided, otherwise use internal state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded

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
          px-2 py-1 rounded-md text-xs font-bold gaming-mono uppercase
          ${config.text} ${config.border} border
          ${config.gradient} bg-gradient-to-r
        `}>
          {rarity}
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
                
                // Open WhatsApp with interest message
                const message = `🎮 Olá! Tenho interesse no power-up *${name}* ${price ? `por ${price}` : ''}.

📋 *Detalhes:*
• ${description}
${price ? `• Valor: ${price}` : ''}
• Level: ${level}

Gostaria de saber mais informações e como proceder com a contratação. Quando podemos conversar?`
                
                const whatsappUrl = `https://wa.me/5511956534963?text=${encodeURIComponent(message)}`
                window.open(whatsappUrl, '_blank')
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
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${config.text} rounded-full`}
            initial={{
              x: Math.random() * 200,
              y: Math.random() * 200,
              opacity: 0
            }}
            animate={{
              y: [null, -50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear'
            }}
            style={{
              boxShadow: `0 0 4px currentColor`
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}