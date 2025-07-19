'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useKonami } from '@/lib/hooks/useKonami'

export default function KonamiEffects() {
  const { isActive } = useKonami()

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Screen Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0, 0.3, 0],
              background: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 0.3)',
                'rgba(255, 0, 255, 0)',
                'rgba(255, 0, 255, 0.3)',
                'rgba(255, 255, 0, 0)'
              ]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, times: [0, 0.1, 0.3, 0.5, 1] }}
            className="fixed inset-0 pointer-events-none z-[100]"
          />

          {/* Central Notification */}
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 1, 1, 0],
              rotate: [180, 0, 0, 0, 360]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 4,
              times: [0, 0.2, 0.3, 0.8, 1],
              ease: "easeInOut"
            }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101]"
          >
            <div className="gaming-card bg-black/90 backdrop-blur-xl border-4 border-plasma-yellow p-8 text-center">
              <motion.div
                animate={{ 
                  textShadow: [
                    '0 0 10px #00FFFF',
                    '0 0 20px #FF00FF', 
                    '0 0 30px #FFEA00',
                    '0 0 20px #FF00FF',
                    '0 0 10px #00FFFF'
                  ]
                }}
                transition={{ duration: 2, repeat: 1 }}
                className="gaming-title text-4xl font-bold text-plasma-yellow mb-4"
              >
                🎮 KONAMI CODE 🎮
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="gaming-subtitle text-xl text-neon-cyan mb-6"
              >
                PLAYER ONE - CHEAT ACTIVATED!
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="gaming-mono text-sm text-led-white/70"
              >
                ↑↑↓↓←→←→BA
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-4 text-laser-green gaming-display text-lg font-bold"
              >
                +30 LIVES • INFINITE AMMO • ALL POWER-UPS
              </motion.div>
            </div>
          </motion.div>

          {/* Matrix Rain Explosion */}
          <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  opacity: 0
                }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [0, 1, 1, 0],
                  color: [
                    '#00FF41',
                    '#00FFFF', 
                    '#FF00FF',
                    '#FFEA00',
                    '#00FF41'
                  ]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear'
                }}
                className="absolute gaming-mono text-lg font-bold"
                style={{
                  textShadow: '0 0 10px currentColor'
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </motion.div>
            ))}
          </div>

          {/* Power-up Particles */}
          <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut'
                }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: ['#00FFFF', '#FF00FF', '#FFEA00', '#00FF41'][Math.floor(Math.random() * 4)],
                  boxShadow: '0 0 20px currentColor'
                }}
              />
            ))}
          </div>

          {/* Achievement Banner */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 300,
              delay: 2 
            }}
            className="fixed top-20 left-4 gaming-card bg-gradient-to-r from-gaming-purple to-magenta-power p-4 border-2 border-plasma-yellow z-[102]"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="gaming-title text-sm font-bold text-plasma-yellow">
                  ACHIEVEMENT UNLOCKED
                </div>
                <div className="gaming-mono text-xs text-led-white">
                  Retro Gamer - Enter the Konami Code
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screen Shake Effect */}
          <motion.div
            animate={{
              x: [0, -5, 5, -5, 5, 0],
              y: [0, -3, 3, -3, 3, 0]
            }}
            transition={{
              duration: 0.5,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              repeat: 2
            }}
            className="fixed inset-0 pointer-events-none z-[98]"
          >
            {/* Empty div for shake effect */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}