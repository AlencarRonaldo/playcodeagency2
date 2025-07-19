'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { useAchievements, trackingHelpers } from '@/lib/hooks/useAchievements'

interface HUDStats {
  hp: number
  xp: number
  level: number
  achievements: number
}

export default function HeroSection() {
  const [isBooting, setIsBooting] = useState(true)
  const [bootProgress, setBootProgress] = useState(0)
  const [currentBootMessage, setCurrentBootMessage] = useState('')
  const [hudStats, setHudStats] = useState<HUDStats>({
    hp: 0,
    xp: 0,
    level: 1,
    achievements: 0
  })

  const { playContextMusic } = useAudio()
  const { } = useAchievements()

  useEffect(() => {
    if (isBooting) {
      const bootMessages = [
        'INITIALIZING PLAYCODE MATRIX...',
        'LOADING GAMING PROTOCOLS...',
        'ESTABLISHING AI CONNECTION...',
        'CALIBRATING CREATIVE ENGINES...',
        'ACTIVATING DIGITAL UNIVERSE...',
        'SYSTEM READY - WELCOME PLAYER ONE!'
      ]

      const bootSequence = async () => {
        for (let i = 0; i < bootMessages.length; i++) {
          setCurrentBootMessage(bootMessages[i])
          setBootProgress(((i + 1) / bootMessages.length) * 100)
          await new Promise(resolve => setTimeout(resolve, 800))
        }
        
        // Boot complete - start HUD animation
        setTimeout(() => {
          setIsBooting(false)
          animateHUDStats()
          
          // Play boot complete sound and start hero music
          audioHelpers.playBootComplete()
          setTimeout(() => {
            playContextMusic('hero')
          }, 500)
        }, 1000)
      }
      
      bootSequence()
    }
  }, [isBooting, playContextMusic])

  const animateHUDStats = () => {
    // Animate HP bar
    let currentHp = 0
    const hpInterval = setInterval(() => {
      currentHp += 2
      setHudStats(prev => ({ ...prev, hp: Math.min(currentHp, 95) }))
      if (currentHp >= 95) clearInterval(hpInterval)
    }, 50)

    // Animate XP bar with delay
    setTimeout(() => {
      let currentXp = 0
      const xpInterval = setInterval(() => {
        currentXp += 3
        setHudStats(prev => ({ ...prev, xp: Math.min(currentXp, 78) }))
        if (currentXp >= 78) clearInterval(xpInterval)
      }, 40)
    }, 500)

    // Animate level and achievements
    setTimeout(() => {
      setHudStats(prev => ({ ...prev, level: 42, achievements: 12 }))
      audioHelpers.playLevelUp()
      
      // Track page view for achievements
      trackingHelpers.trackPageView('/hero')
    }, 1200)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-console">
      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="text-terminal-green opacity-30"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${12 + Math.random() * 6}px`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </span>
        ))}
      </div>

      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Boot Sequence */}
        <AnimatePresence>
          {isBooting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="gaming-mono text-terminal-green text-lg mb-8">
                {currentBootMessage}
              </div>
              
              {/* Boot Progress Bar */}
              <div className="hud-bar w-96 mx-auto mb-4">
                <motion.div
                  className="hud-bar-fill bg-gradient-power"
                  style={{ width: `${bootProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="gaming-mono text-neon-cyan text-sm">
                PROGRESS: {Math.round(bootProgress)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Hero Content */}
        <AnimatePresence>
          {!isBooting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="gaming-title text-5xl lg:text-7xl font-bold mb-6 neon-glow text-neon-cyan"
                >
                  READY
                  <br />
                  <span className="text-magenta-power">PLAYER</span>
                  <br />
                  <span className="text-gaming-purple">ONE?</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="gaming-subtitle text-xl lg:text-2xl mb-8 text-led-white/80 max-w-xl"
                >
                  Eleve seu negócio para o próximo nível digital. 
                  Criamos experiências inovadoras que dominam o mercado 
                  com inteligência artificial e soluções tecnológicas avançadas.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <button 
                    className="gaming-button text-lg px-8 py-4 hover:animate-glow"
                    onMouseEnter={() => audioHelpers.playHover()}
                    onClick={() => {
                      audioHelpers.playClick(true)
                      trackingHelpers.trackClick('hero_start_mission')
                      // Navigate to contact or services page
                      window.location.href = '/contato'
                    }}
                  >
                    <span className="relative z-10">INICIAR MISSÃO</span>
                  </button>
                  
                  <button 
                    className="gaming-card px-8 py-4 text-lg font-semibold text-neon-cyan border-neon-cyan hover:text-controller-black hover:bg-neon-cyan transition-all duration-300"
                    onMouseEnter={() => audioHelpers.playHover()}
                    onClick={() => {
                      audioHelpers.playClick(false)
                      trackingHelpers.trackClick('hero_view_achievements')
                      // Show achievements modal or scroll to achievements section
                    }}
                  >
                    VER ACHIEVEMENTS
                  </button>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex justify-center lg:justify-start space-x-8 mt-8"
                >
                  <div className="text-center">
                    <div className="gaming-display text-2xl font-bold text-laser-green">500+</div>
                    <div className="gaming-mono text-sm text-led-white/60">PROJETOS</div>
                  </div>
                  <div className="text-center">
                    <div className="gaming-display text-2xl font-bold text-plasma-yellow">24/7</div>
                    <div className="gaming-mono text-sm text-led-white/60">SUPORTE</div>
                  </div>
                  <div className="text-center">
                    <div className="gaming-display text-2xl font-bold text-magenta-power">99.9%</div>
                    <div className="gaming-mono text-sm text-led-white/60">UPTIME</div>
                  </div>
                </motion.div>
              </div>

              {/* Right HUD Interface */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="relative"
              >
                {/* HUD Container */}
                <div className="gaming-card p-8 relative">
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex justify-between items-center mb-6">
                      <div className="gaming-mono text-neon-cyan text-sm">
                        PLAYER STATUS
                      </div>
                      <div className="gaming-mono text-laser-green text-sm">
                        ONLINE
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 space-y-6">
                    {/* Business Potential Bar */}
                    <div className="hud-element">
                      <div className="flex justify-between items-center mb-2">
                        <span className="gaming-mono text-xs">BUSINESS POTENTIAL</span>
                        <span className="gaming-mono text-xs text-laser-green">{hudStats.hp}%</span>
                      </div>
                      <div className="hud-bar">
                        <motion.div
                          className="hud-bar-fill bg-gradient-to-r from-laser-green to-electric-blue"
                          initial={{ width: 0 }}
                          animate={{ width: `${hudStats.hp}%` }}
                          transition={{ duration: 2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Digital Experience Bar */}
                    <div className="hud-element">
                      <div className="flex justify-between items-center mb-2">
                        <span className="gaming-mono text-xs">DIGITAL EXPERIENCE</span>
                        <span className="gaming-mono text-xs text-electric-blue">{hudStats.xp}%</span>
                      </div>
                      <div className="hud-bar">
                        <motion.div
                          className="hud-bar-fill bg-gradient-to-r from-electric-blue to-gaming-purple"
                          initial={{ width: 0 }}
                          animate={{ width: `${hudStats.xp}%` }}
                          transition={{ duration: 2.5, delay: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="hud-element text-center">
                        <div className="gaming-display text-2xl font-bold text-magenta-power">
                          {hudStats.level}
                        </div>
                        <div className="gaming-mono text-xs opacity-70">TECH LEVEL</div>
                      </div>
                      
                      <div className="hud-element text-center">
                        <div className="gaming-display text-2xl font-bold text-plasma-yellow">
                          {hudStats.achievements}
                        </div>
                        <div className="gaming-mono text-xs opacity-70">ACHIEVEMENTS</div>
                      </div>
                    </div>

                    {/* Power-ups Indicator */}
                    <div className="border-t border-neon-cyan/30 pt-4">
                      <div className="gaming-mono text-xs mb-3 text-center text-neon-cyan">
                        ACTIVE POWER-UPS
                      </div>
                      <div className="flex justify-center space-x-2">
                        {['AI', 'WEB', 'API', 'UX'].map((powerup, index) => (
                          <motion.div
                            key={powerup}
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
                            className="w-10 h-10 bg-gradient-gaming rounded border border-neon-cyan/50 flex items-center justify-center gaming-mono text-xs font-bold animate-glow"
                          >
                            {powerup}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Achievement Notification */}
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 3, duration: 0.8 }}
                  className="absolute -top-6 -right-6 gaming-card p-3 border-laser-green bg-laser-green/10"
                >
                  <div className="gaming-mono text-xs text-laser-green">
                    🏆 ACHIEVEMENT UNLOCKED
                  </div>
                  <div className="gaming-mono text-xs font-bold">
                    Welcome Bonus +100 XP
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient Gaming Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan rounded-full"
            initial={{
              x: Math.random() * 1200,
              y: Math.random() * 800,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
            style={{
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
    </section>
  )
}