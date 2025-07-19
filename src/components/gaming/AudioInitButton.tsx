'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Play } from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'

export default function AudioInitButton() {
  const { isInitialized, playContextMusic } = useAudio()
  const [showButton, setShowButton] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Show button after 2 seconds if not initialized and user hasn't interacted
    const timer = setTimeout(() => {
      if (!isInitialized && !hasInteracted) {
        setShowButton(true)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isInitialized, hasInteracted])

  // Hide if already initialized
  useEffect(() => {
    if (isInitialized) {
      setShowButton(false)
    }
  }, [isInitialized])

  const handleInitAudio = async () => {
    setHasInteracted(true)
    setShowButton(false)
    
    try {
      // Play a UI sound to initialize audio context
      await audioHelpers.playClick()
      
      // Wait a bit then start hero music
      setTimeout(() => {
        playContextMusic('hero')
      }, 500)
    } catch (error) {
      console.warn('Failed to initialize audio:', error)
    }
  }

  if (!showButton || isInitialized) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="gaming-card bg-gaming-surface/95 backdrop-blur-md p-8 max-w-md mx-4 text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-gaming rounded-full flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-neon-cyan" />
            </div>
            
            <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-2">
              INICIALIZAR ÁUDIO
            </h3>
            
            <p className="gaming-mono text-sm text-led-white/70 mb-6">
              Ative o sistema de áudio cyberpunk para uma experiência completa
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleInitAudio}
              onMouseEnter={audioHelpers.playHover}
              className="gaming-button w-full py-3 px-6 text-lg flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" />
              <span>ATIVAR EXPERIÊNCIA SONORA</span>
            </button>
            
            <button
              onClick={() => {
                setHasInteracted(true)
                setShowButton(false)
              }}
              className="gaming-card w-full py-2 px-4 text-sm text-led-white/60 hover:text-led-white"
            >
              Continuar sem áudio
            </button>
          </div>

          <div className="mt-6 text-xs text-led-white/40 gaming-mono">
            🎵 Inclui música ambiente cyberpunk e efeitos sonoros de interface
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}