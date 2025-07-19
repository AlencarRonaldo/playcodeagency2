'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  VolumeX, 
  Volume2, 
  Volume1, 
  VolumeOff,
  Music,
  AudioWaveform,
  Settings,
  Headphones,
  Play,
  Pause
} from 'lucide-react'
import { useAudio } from '@/lib/hooks/useAudio'
import { audioHelpers } from '@/lib/hooks/useAudio'

interface AudioControlsProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  compact?: boolean
  className?: string
}

export default function AudioControls({ 
  position = 'top-right', 
  compact = false,
  className = '' 
}: AudioControlsProps) {
  const {
    isInitialized,
    preferences,
    currentMusic,
    setMasterVolume,
    setMusicVolume,
    setSFXVolume,
    toggleMusic,
    toggleSFX,
    pauseMusic,
    playContextMusic
  } = useAudio()

  const [isExpanded, setIsExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-collapse after inactivity
  useEffect(() => {
    if (!isExpanded) return

    const timer = setTimeout(() => {
      setIsExpanded(false)
      setShowSettings(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [isExpanded])

  // Position classes
  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6', 
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  }

  // Volume icon helper
  const getVolumeIcon = (volume: number, enabled: boolean) => {
    if (!enabled || volume === 0) return VolumeX
    if (volume < 0.3) return VolumeOff
    if (volume < 0.7) return Volume1
    return Volume2
  }

  // Handle volume change
  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', value: number) => {
    audioHelpers.playClick(false)
    
    switch (type) {
      case 'master':
        setMasterVolume(value)
        break
      case 'music':
        setMusicVolume(value)
        break
      case 'sfx':
        setSFXVolume(value)
        break
    }
  }

  // Handle slider interaction  
  const handleSliderMouseUp = () => {
    // Placeholder for future slider interaction handling
  }

  // Quick music controls
  const handleMusicToggle = () => {
    if (currentMusic) {
      pauseMusic()
    } else {
      playContextMusic('default')
    }
    audioHelpers.playClick()
  }


  if (compact) {
    return (
      <motion.div
        ref={containerRef}
        className={`fixed ${positionClasses[position]} ${className} z-40`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-green-500/30 rounded-lg px-3 py-2">
          {/* Music Toggle */}
          <button
            onClick={handleMusicToggle}
            onMouseEnter={audioHelpers.playHover}
            className="text-green-400 hover:text-green-300 transition-colors p-1"
            title={currentMusic ? 'Pausar música' : 'Tocar música'}
          >
            {currentMusic ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Master Volume */}
          <button
            onClick={() => {
              toggleMusic()
              audioHelpers.playClick()
            }}
            onMouseEnter={audioHelpers.playHover}
            className="text-green-400 hover:text-green-300 transition-colors p-1"
            title="Toggle audio"
          >
            {(() => {
              const VolumeIcon = getVolumeIcon(preferences.masterVolume, preferences.musicEnabled && preferences.sfxEnabled)
              return <VolumeIcon size={16} />
            })()}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      className={`fixed ${positionClasses[position]} ${className} z-40`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !showSettings && setIsExpanded(false)}
    >
      <div className="gaming-card bg-black/90 backdrop-blur-md border border-green-500/50 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <Headphones size={18} className="text-green-400" />
            <span className="text-green-300 font-mono text-sm">AUDIO</span>
            {isInitialized && (
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          
          <button
            onClick={() => {
              setShowSettings(!showSettings)
              audioHelpers.playClick(false)
            }}
            onMouseEnter={audioHelpers.playHover}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <Settings size={16} className={showSettings ? 'rotate-90' : ''} />
          </button>
        </div>

        {/* Quick Controls */}
        <div className="p-3">
          <div className="flex items-center gap-3 mb-3">
            {/* Music Controls */}
            <button
              onClick={handleMusicToggle}
              onMouseEnter={audioHelpers.playHover}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded border border-green-500/30 hover:border-green-500/50"
              title={currentMusic ? 'Pausar música' : 'Tocar música'}
            >
              <Music size={14} />
              {currentMusic ? <Pause size={12} /> : <Play size={12} />}
            </button>

            {/* Master Volume Toggle */}
            <button
              onClick={() => {
                toggleMusic()
                toggleSFX()
                audioHelpers.playClick()
              }}
              onMouseEnter={audioHelpers.playHover}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
              title="Mute all"
            >
              {(() => {
                const VolumeIcon = getVolumeIcon(
                  preferences.masterVolume, 
                  preferences.musicEnabled && preferences.sfxEnabled
                )
                return <VolumeIcon size={18} />
              })()}
            </button>
          </div>

          {/* Current Track */}
          {currentMusic && (
            <div className="text-xs text-green-300/70 font-mono mb-2">
              ♪ Tocando: {currentMusic.replace('_', ' ').toUpperCase()}
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <AnimatePresence>
          {(isExpanded || showSettings) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-green-500/30"
            >
              <div className="p-3 space-y-3">
                {/* Master Volume */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-300 font-mono">MASTER</span>
                    <span className="text-xs text-green-400">{Math.round(preferences.masterVolume * 100)}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.masterVolume}
                      onChange={(e) => handleVolumeChange('master', parseFloat(e.target.value))}
                      onMouseUp={handleSliderMouseUp}
                      className="gaming-slider w-full"
                    />
                  </div>
                </div>

                {/* Music Volume */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music size={12} className="text-green-400" />
                      <span className="text-xs text-green-300 font-mono">MUSIC</span>
                      <button
                        onClick={() => {
                          toggleMusic()
                          audioHelpers.playClick(false)
                        }}
                        className={`text-xs ${preferences.musicEnabled ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {preferences.musicEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <span className="text-xs text-green-400">{Math.round(preferences.musicVolume * 100)}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.musicVolume}
                      onChange={(e) => handleVolumeChange('music', parseFloat(e.target.value))}
                      onMouseUp={handleSliderMouseUp}
                      disabled={!preferences.musicEnabled}
                      className="gaming-slider w-full"
                    />
                  </div>
                </div>

                {/* SFX Volume */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AudioWaveform size={12} className="text-green-400" />
                      <span className="text-xs text-green-300 font-mono">SFX</span>
                      <button
                        onClick={() => {
                          toggleSFX()
                          audioHelpers.playClick(false)
                        }}
                        className={`text-xs ${preferences.sfxEnabled ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {preferences.sfxEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <span className="text-xs text-green-400">{Math.round(preferences.sfxVolume * 100)}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={preferences.sfxVolume}
                      onChange={(e) => handleVolumeChange('sfx', parseFloat(e.target.value))}
                      onMouseUp={handleSliderMouseUp}
                      disabled={!preferences.sfxEnabled}
                      className="gaming-slider w-full"
                    />
                  </div>
                </div>

                {/* Test Buttons */}
                <div className="flex gap-2 pt-2 border-t border-green-500/20">
                  <button
                    onClick={() => audioHelpers.playXPGain()}
                    onMouseEnter={audioHelpers.playHover}
                    className="flex-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 px-2 py-1 rounded border border-green-500/30"
                  >
                    XP
                  </button>
                  <button
                    onClick={() => audioHelpers.playLevelUp()}
                    onMouseEnter={audioHelpers.playHover}
                    className="flex-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded border border-blue-500/30"
                  >
                    LEVEL
                  </button>
                  <button
                    onClick={() => audioHelpers.playAchievementUnlocked('epic')}
                    onMouseEnter={audioHelpers.playHover}
                    className="flex-1 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2 py-1 rounded border border-purple-500/30"
                  >
                    EPIC
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}