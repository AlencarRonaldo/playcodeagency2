'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { marioMusicPlayer } from '@/lib/audio/mario-player'
import { marioSynthesizer } from '@/lib/audio/mario-synthesizer'
import { useAudio } from '@/lib/hooks/useAudio'

export default function MarioAutoPlay() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const { preferences, toggleSFX } = useAudio()

  // Sync state with music player
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const playerState = marioMusicPlayer.getIsPlaying()
      if (playerState !== isPlaying) {
        console.log('🎮 Syncing state: player =', playerState, 'component =', isPlaying)
        setIsPlaying(playerState)
      }
    }, 500)

    return () => clearInterval(syncInterval)
  }, [isPlaying])

  useEffect(() => {
    // Stop any old music that might be playing
    console.log('🎮 Stopping old synthesizer...')
    marioSynthesizer.stop()
    
    // Função para iniciar a música do Mario
    const startMarioMusic = async () => {
      try {
        console.log('🎮 Iniciando música do Mario com novo player...')
        await marioMusicPlayer.play()
        setIsPlaying(true)
        setIsInitialized(true)
        console.log('🎮 Música do Mario iniciada com sucesso!')
      } catch (error) {
        console.log('🎮 Erro ao tocar música do Mario:', error)
        setIsInitialized(true) // Mark as initialized even if failed
      }
    }

    // Tenta iniciar automaticamente primeiro
    const tryAutoplay = async () => {
      try {
        console.log('🎮 Tentando autoplay...')
        await startMarioMusic()
      } catch (error) {
        console.log('🎮 Autoplay bloqueado, aguardando interação do usuário')
      }
    }

    // Se não conseguir (política de autoplay), tocar no primeiro clique
    const handleFirstInteraction = () => {
      if (!isInitialized) {
        console.log('🎮 Primeira interação detectada!')
        startMarioMusic()
      }
      // Remove os listeners depois do primeiro clique
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    // Tenta autoplay primeiro
    tryAutoplay()

    // Adiciona listeners para primeira interação do usuário
    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    // Cleanup
    return () => {
      marioMusicPlayer.stop()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [isInitialized])

  const toggleMusic = () => {
    console.log('🎮 Toggle music clicked! Current state:', isPlaying)
    
    if (marioMusicPlayer.getIsPlaying()) {
      console.log('🎮 Parando música (player state: true)')
      marioMusicPlayer.stop()
    } else {
      console.log('🎮 Iniciando música (player state: false)')
      marioMusicPlayer.play()
    }
    
    // State will be synced by the interval
  }

  if (!isInitialized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-4 right-4 z-50 gaming-card p-3 bg-plasma-yellow/20 border-plasma-yellow border-2"
      >
        <div className="text-xs gaming-mono text-plasma-yellow">
          🎮 Clique em qualquer lugar para ativar a música!
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="gaming-card border-2 border-electric-blue bg-controller-black/90 backdrop-blur-sm">
        {/* Header com botão de minimizar */}
        <div className="flex items-center justify-between p-3 border-b border-electric-blue/30">
          <div className="gaming-mono text-xs text-electric-blue">
            🎮 CONTROLES DE ÁUDIO
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-electric-blue hover:text-neon-cyan text-sm transition-colors duration-200"
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
        </div>
        
        {/* Conteúdo expansível */}
        <motion.div
          initial={false}
          animate={{ 
            height: isMinimized ? 0 : 'auto',
            opacity: isMinimized ? 0 : 1 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-3">
            {/* Controle da Música */}
            <div className="flex items-center justify-between">
              <div className="text-xs gaming-mono text-led-white/80">
                MÚSICA DE FUNDO
              </div>
              <button
                onClick={toggleMusic}
                className={`
                  px-3 py-1 text-xs gaming-mono rounded border-2 transition-all duration-300
                  ${isPlaying 
                    ? 'border-plasma-yellow bg-plasma-yellow/20 text-plasma-yellow hover:bg-plasma-yellow/30' 
                    : 'border-led-white/30 bg-led-white/10 text-led-white/70 hover:bg-led-white/20'
                  }
                `}
              >
                {isPlaying ? '⏸️ PARAR' : '▶️ TOCAR'}
              </button>
            </div>

            {/* Status da Música */}
            <div className="flex items-center gap-2 text-xs">
              <div className={`text-lg ${isPlaying ? 'animate-bounce' : ''}`}>
                {isPlaying ? '🎵' : '🔇'}
              </div>
              <div className="gaming-mono">
                <div className={isPlaying ? 'text-plasma-yellow' : 'text-led-white/50'}>
                  {isPlaying ? 'Mario Theme Tocando' : 'Música Pausada'}
                </div>
              </div>
            </div>

            {/* Controle dos Efeitos Sonoros */}
            <div className="flex items-center justify-between">
              <div className="text-xs gaming-mono text-led-white/80">
                EFEITOS SONOROS
              </div>
              <button
                onClick={toggleSFX}
                className={`
                  px-3 py-1 text-xs gaming-mono rounded border-2 transition-all duration-300
                  ${preferences.sfxEnabled 
                    ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30' 
                    : 'border-led-white/30 bg-led-white/10 text-led-white/70 hover:bg-led-white/20'
                  }
                `}
              >
                {preferences.sfxEnabled ? '🔊 ATIVO' : '🔇 MUDO'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Indicador minimizado */}
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-2 flex items-center justify-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-plasma-yellow animate-pulse' : 'bg-gray-500'}`} />
            <div className={`w-2 h-2 rounded-full ${preferences.sfxEnabled ? 'bg-neon-cyan animate-pulse' : 'bg-gray-500'}`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}