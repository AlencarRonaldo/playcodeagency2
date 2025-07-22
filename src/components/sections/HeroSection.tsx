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
  const [matrixRainData, setMatrixRainData] = useState<Array<{delay: number, fontSize: number, char: string}>>([])
  const [particlesData, setParticlesData] = useState<Array<{x: number, y: number, duration: number, delay: number}>>([])

  const { playContextMusic } = useAudio()
  const { } = useAchievements()

  // Generate matrix rain data on client side only
  useEffect(() => {
    const rainData = Array.from({ length: 20 }).map(() => ({
      delay: Math.random() * 3,
      fontSize: 12 + Math.random() * 6,
      char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
    }))
    setMatrixRainData(rainData)

    // Generate particles data
    const particles = Array.from({ length: 10 }).map(() => ({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 5
    }))
    setParticlesData(particles)
  }, [])

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
          
          // Play boot complete sound (music now handled by MarioAutoPlay component)
          audioHelpers.playBootComplete()
          // Music is now controlled by the MarioAutoPlay component
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
        {matrixRainData.map((data, i) => (
          <span
            key={i}
            className="text-terminal-green opacity-30"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${data.delay}s`,
              fontSize: `${data.fontSize}px`
            }}
          >
            {data.char}
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
                  <span className="sr-only">PlayCode Agency - </span>
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
                  Transformamos seu negócio com <strong>desenvolvimento web profissional</strong>, 
                  <strong>integração de IA</strong> e <strong>soluções digitais personalizadas</strong>. 
                  Mais de <strong>40 clientes satisfeitos</strong> com <strong>10 anos de experiência</strong>.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <button 
                    className="gaming-button text-lg px-8 py-4 animate-urgent-glow hover:animate-cta-pulse focus:animate-cta-pulse"
                    onMouseEnter={() => audioHelpers.playHover()}
                    onClick={() => {
                      audioHelpers.playClick(true)
                      trackingHelpers.trackClick('hero_start_mission')
                      // Navigate to contact or services page
                      window.location.href = '/contato'
                    }}
                  >
                    <span className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">INICIAR MISSÃO</span>
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
                    <div className="gaming-display text-2xl font-bold text-laser-green">50+</div>
                    <div className="gaming-mono text-sm text-led-white/60">PROJETOS ENTREGUES</div>
                  </div>
                  <div className="text-center">
                    <div className="gaming-display text-2xl font-bold text-plasma-yellow">24/7</div>
                    <div className="gaming-mono text-sm text-led-white/60">SUPORTE DIGITAL</div>
                  </div>
                  <div className="text-center">
                    <div className="gaming-display text-2xl font-bold text-magenta-power">10+</div>
                    <div className="gaming-mono text-sm text-led-white/60">ANOS EXPERIÊNCIA</div>
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
                        POR QUE NOS ESCOLHER
                      </div>
                      <div className="gaming-mono text-laser-green text-sm">
                        COMPROVADO
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 space-y-6">
                    {/* Competitive Advantages Display */}
                    <div className="flex justify-center mb-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Advantage 1 - Speed & Delivery */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center p-4 gaming-card border-2 border-laser-green bg-laser-green/10 min-w-[140px]"
                        >
                          {/* Speed Icon Frame */}
                          <div className="w-16 h-20 relative mx-auto mb-3 bg-gradient-to-b from-laser-green/20 to-green-400/20 rounded-lg border-2 border-laser-green flex items-center justify-center">
                            {/* Simple Lightning Icon */}
                            <div className="text-3xl">⚡</div>
                          </div>
                          
                          {/* Advantage Info */}
                          <div className="gaming-mono text-xs text-laser-green font-bold">ENTREGA RÁPIDA</div>
                          <div className="gaming-mono text-xs text-led-white/50">50% Mais Rápido</div>
                          
                          {/* Key Metrics */}
                          <div className="text-xs text-laser-green mt-1">Que Concorrentes</div>
                          <div className="text-xs text-laser-green">Deploy em 2-4 Semanas</div>
                          
                          {/* Trust Indicators */}
                          <div className="flex justify-center mt-2 space-x-1">
                            <div className="w-2 h-2 bg-laser-green rounded-full"></div>
                            <div className="w-2 h-2 bg-laser-green rounded-full"></div>
                            <div className="w-2 h-2 bg-laser-green rounded-full"></div>
                          </div>
                          
                          {/* Speed Glow */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                '0 0 8px rgba(0,255,127,0.3)',
                                '0 0 16px rgba(0,255,127,0.6)',
                                '0 0 8px rgba(0,255,127,0.3)'
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-lg pointer-events-none"
                          />
                        </motion.div>

                        {/* Advantage 2 - Quality & Reliability */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center p-4 gaming-card border-2 border-electric-blue bg-electric-blue/10 min-w-[140px]"
                        >
                          {/* Quality Shield Frame */}
                          <div className="w-16 h-20 relative mx-auto mb-3 bg-gradient-to-b from-electric-blue/20 to-neon-cyan/20 rounded-lg border-2 border-electric-blue flex items-center justify-center">
                            {/* Simple Shield Icon */}
                            <div className="text-3xl">🛡️</div>
                          </div>
                          
                          {/* Advantage Info */}
                          <div className="gaming-mono text-xs text-electric-blue font-bold">QUALIDADE</div>
                          <div className="gaming-mono text-xs text-led-white/50">99% Bug-Free</div>
                          
                          {/* Key Metrics */}
                          <div className="text-xs text-electric-blue mt-1">Código Limpo</div>
                          <div className="text-xs text-electric-blue">Testes Automatizados</div>
                          
                          {/* Trust Indicators */}
                          <div className="flex justify-center mt-2 space-x-1">
                            <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                            <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                            <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                          </div>
                          
                          {/* Quality Glow */}
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

                        {/* Advantage 3 - Experience & Innovation */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center p-4 gaming-card border-2 border-gaming-purple bg-gaming-purple/10 min-w-[140px]"
                        >
                          <div className="w-16 h-20 relative mx-auto mb-3 bg-gradient-to-b from-gaming-purple/20 to-magenta-power/20 rounded-lg border-2 border-gaming-purple flex items-center justify-center">
                            {/* Simple Brain/Innovation Icon */}
                            <div className="text-3xl">🧠</div>
                          </div>
                          
                          {/* Advantage Info */}
                          <div className="gaming-mono text-xs text-gaming-purple font-bold">EXPERIÊNCIA</div>
                          <div className="gaming-mono text-xs text-led-white/50">10+ Anos Gaming</div>
                          
                          {/* Key Metrics */}
                          <div className="text-xs text-gaming-purple mt-1">Tecnologia Avançada</div>
                          <div className="text-xs text-gaming-purple">Soluções Inovadoras</div>
                          
                          <div className="flex justify-center mt-2 space-x-1">
                            <div className="w-2 h-2 bg-gaming-purple rounded-full"></div>
                            <div className="w-2 h-2 bg-gaming-purple rounded-full"></div>
                            <div className="w-2 h-2 bg-gaming-purple rounded-full"></div>
                          </div>
                          
                          {/* Innovation Glow */}
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

                        {/* Advantage 4 - Results & ROI */}
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
                          className="relative text-center p-4 gaming-card border-2 border-plasma-yellow bg-plasma-yellow/10 min-w-[140px]"
                        >
                          <div className="w-16 h-20 relative mx-auto mb-3 bg-gradient-to-b from-plasma-yellow/20 to-yellow-300/20 rounded-lg border-2 border-plasma-yellow flex items-center justify-center">
                            {/* Simple Trophy Icon */}
                            <div className="text-3xl">🏆</div>
                          </div>
                          
                          {/* Advantage Info */}
                          <div className="gaming-mono text-xs text-plasma-yellow font-bold">RESULTADOS</div>
                          <div className="gaming-mono text-xs text-led-white/50">3x+ ROI Comprovado</div>
                          
                          {/* Key Metrics */}
                          <div className="text-xs text-plasma-yellow mt-1">95% Retenção</div>
                          <div className="text-xs text-plasma-yellow">50+ Projetos</div>
                          
                          {/* Success Indicators */}
                          <div className="flex justify-center mt-2 space-x-1">
                            <div className="w-2 h-2 bg-plasma-yellow rounded-full"></div>
                            <div className="w-2 h-2 bg-plasma-yellow rounded-full"></div>
                            <div className="w-2 h-2 bg-plasma-yellow rounded-full"></div>
                          </div>
                          
                          {/* Success Crown */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gradient-to-r from-plasma-yellow to-yellow-300 rounded-t-lg border border-plasma-yellow flex items-center justify-center">
                            <span className="text-xs text-controller-black font-bold">👑</span>
                          </div>
                          
                          {/* Results Glow */}
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

                    {/* Client Success Rate */}
                    <div className="hud-element">
                      <div className="flex justify-between items-center mb-2">
                        <span className="gaming-mono text-xs">TAXA DE SUCESSO</span>
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

                    {/* Client Satisfaction */}
                    <div className="hud-element">
                      <div className="flex justify-between items-center mb-2">
                        <span className="gaming-mono text-xs">SATISFAÇÃO DOS CLIENTES</span>
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

                    {/* Trust Metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="hud-element text-center">
                        <div className="gaming-display text-2xl font-bold text-magenta-power">
                          50+
                        </div>
                        <div className="gaming-mono text-xs opacity-70">PROJETOS ENTREGUES</div>
                      </div>
                      
                      <div className="hud-element text-center">
                        <div className="gaming-display text-2xl font-bold text-plasma-yellow">
                          10+
                        </div>
                        <div className="gaming-mono text-xs opacity-70">ANOS EXPERIÊNCIA</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge Notification */}
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 3, duration: 0.8 }}
                  className="absolute -top-6 -right-6 gaming-card p-3 border-laser-green bg-laser-green/10"
                >
                  <div className="gaming-mono text-xs text-laser-green">
                    ✅ AGÊNCIA VERIFICADA
                  </div>
                  <div className="gaming-mono text-xs font-bold">
                    95% Client Retention Rate
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient Gaming Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particlesData.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
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