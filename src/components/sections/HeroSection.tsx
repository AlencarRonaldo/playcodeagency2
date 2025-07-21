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

                  <div className="pt-8 space-y-6">
                    {/* Pixel Art Player Characters Gallery */}
                    <div className="flex justify-center mb-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Starter Player - "CodeKid" */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center"
                        >
                          <div className="w-12 h-16 relative mx-auto mb-2">
                            {/* Head - Simple */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-b from-amber-200 to-amber-300 border border-amber-400" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'}} />
                            
                            {/* Eyes */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                              <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                              <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                            </div>
                            
                            {/* Body - Basic */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-led-white to-gray-200 border border-gray-300" style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'}} />
                            
                            {/* Arms */}
                            <div className="absolute top-5 left-1 w-2 h-1.5 bg-gradient-to-r from-led-white to-gray-200 border border-gray-300 rounded-sm"></div>
                            <div className="absolute top-5 right-1 w-2 h-1.5 bg-gradient-to-r from-led-white to-gray-200 border border-gray-300 rounded-sm"></div>
                            
                            {/* Legs */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                              <div className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-500/50 rounded-sm"></div>
                              <div className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-blue-500 border border-blue-500/50 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="gaming-mono text-xs text-led-white/80 font-bold">CODEKID</div>
                          <div className="gaming-mono text-xs text-led-white/50">Starter Pack</div>
                        </motion.div>

                        {/* Pro Player - "DevMaster" */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center"
                        >
                          <div className="w-14 h-18 relative mx-auto mb-2">
                            {/* Head - Pro */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-b from-electric-blue to-neon-cyan border border-electric-blue" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'}} />
                            
                            {/* Eyes */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-1 h-1 bg-plasma-yellow rounded-full"></div>
                              <div className="w-1 h-1 bg-plasma-yellow rounded-full"></div>
                            </div>
                            
                            {/* Body - Enhanced */}
                            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-b from-electric-blue to-neon-cyan border border-electric-blue/50" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'}} />
                            
                            {/* Arms */}
                            <div className="absolute top-6 left-0.5 w-2.5 h-2 bg-gradient-to-r from-electric-blue to-neon-cyan border border-electric-blue/50 rounded-sm"></div>
                            <div className="absolute top-6 right-0.5 w-2.5 h-2 bg-gradient-to-r from-electric-blue to-neon-cyan border border-electric-blue/50 rounded-sm"></div>
                            
                            {/* Legs */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-2 h-5 bg-gradient-to-b from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded-sm"></div>
                              <div className="w-2 h-5 bg-gradient-to-b from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="gaming-mono text-xs text-electric-blue font-bold">DEVMASTER</div>
                          <div className="gaming-mono text-xs text-led-white/50">Pro Guild</div>
                          
                          {/* Pro Glow */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                '0 0 8px rgba(0,212,255,0.3)',
                                '0 0 16px rgba(0,212,255,0.6)',
                                '0 0 8px rgba(0,212,255,0.3)'
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg pointer-events-none"
                          />
                        </motion.div>

                        {/* Elite Player - "CyberWarrior" */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center"
                        >
                          <div className="w-16 h-20 relative mx-auto mb-2">
                            {/* Head - Elite with armor */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-gaming-purple to-magenta-power border-2 border-gaming-purple" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'}} />
                            
                            {/* Visor */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gradient-to-r from-neon-cyan to-electric-blue border border-neon-cyan rounded-sm"></div>
                            
                            {/* Body - Armored */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-gaming-purple to-magenta-power border-2 border-gaming-purple/70" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'}} />
                            
                            {/* Shoulder Pads */}
                            <div className="absolute top-6 left-0 w-3 h-3 bg-gradient-to-r from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded"></div>
                            <div className="absolute top-6 right-0 w-3 h-3 bg-gradient-to-r from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded"></div>
                            
                            {/* Arms */}
                            <div className="absolute top-7 left-1 w-3 h-2 bg-gradient-to-r from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded-sm"></div>
                            <div className="absolute top-7 right-1 w-3 h-2 bg-gradient-to-r from-gaming-purple to-magenta-power border border-gaming-purple/50 rounded-sm"></div>
                            
                            {/* Legs */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-2 h-6 bg-gradient-to-b from-gaming-purple to-magenta-power border-2 border-gaming-purple/50 rounded-sm"></div>
                              <div className="w-2 h-6 bg-gradient-to-b from-gaming-purple to-magenta-power border-2 border-gaming-purple/50 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="gaming-mono text-xs text-gaming-purple font-bold">CYBERWARRIOR</div>
                          <div className="gaming-mono text-xs text-led-white/50">Elite Force</div>
                          
                          {/* Elite Glow */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                '0 0 12px rgba(139,92,246,0.4)',
                                '0 0 24px rgba(139,92,246,0.7)',
                                '0 0 12px rgba(139,92,246,0.4)'
                              ]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg pointer-events-none"
                          />
                        </motion.div>

                        {/* Legendary Player - "QuantumLord" */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center"
                        >
                          <div className="w-18 h-22 relative mx-auto mb-2">
                            {/* Crown */}
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gradient-to-r from-plasma-yellow to-yellow-300 border border-plasma-yellow rounded-t" style={{clipPath: 'polygon(0% 50%, 20% 0%, 40% 50%, 60% 0%, 80% 50%, 100% 100%, 0% 100%)'}} />
                            
                            {/* Head - Legendary */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-b from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow" style={{clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'}} />
                            
                            {/* Energy Eyes */}
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-white border border-plasma-yellow rounded-full animate-pulse"></div>
                              <div className="w-1.5 h-1.5 bg-white border border-plasma-yellow rounded-full animate-pulse"></div>
                            </div>
                            
                            {/* Body - Legendary Armor */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gradient-to-b from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/70" style={{clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'}} />
                            
                            {/* Energy Core */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-2 border-plasma-yellow rounded-full animate-pulse"></div>
                            
                            {/* Legendary Shoulder Guards */}
                            <div className="absolute top-8 -left-1 w-4 h-4 bg-gradient-to-r from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-lg"></div>
                            <div className="absolute top-8 -right-1 w-4 h-4 bg-gradient-to-r from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-lg"></div>
                            
                            {/* Arms */}
                            <div className="absolute top-9 left-0 w-4 h-3 bg-gradient-to-r from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-sm"></div>
                            <div className="absolute top-9 right-0 w-4 h-3 bg-gradient-to-r from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-sm"></div>
                            
                            {/* Legs */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-2.5 h-7 bg-gradient-to-b from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-sm"></div>
                              <div className="w-2.5 h-7 bg-gradient-to-b from-plasma-yellow to-yellow-300 border-2 border-plasma-yellow/50 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="gaming-mono text-xs text-plasma-yellow font-bold">QUANTUMLORD</div>
                          <div className="gaming-mono text-xs text-led-white/50">Legendary Tier</div>
                          
                          {/* Legendary Glow */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                '0 0 15px rgba(255,234,0,0.5)',
                                '0 0 30px rgba(255,234,0,0.8)',
                                '0 0 15px rgba(255,234,0,0.5)'
                              ]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg pointer-events-none"
                          />
                        </motion.div>
                      </div>
                    </div>

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