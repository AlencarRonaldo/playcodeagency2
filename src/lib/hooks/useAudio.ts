'use client'

import { useState, useEffect, useCallback } from 'react'
import { audioManager } from '../audio/manager'
import { audioSynthesizer } from '../audio/synthesizer'
import { marioSynthesizer } from '../audio/mario-synthesizer'
import { AudioPreferences } from '../audio/types'
import { CONTEXT_MUSIC, ACHIEVEMENT_SOUNDS, UI_SOUNDS } from '../audio/tracks'

interface UseAudioReturn {
  // State
  isInitialized: boolean
  preferences: AudioPreferences
  currentMusic: string | null
  
  // Music controls
  playMusic: (trackId: string, fadeIn?: boolean) => Promise<void>
  stopMusic: (fadeOut?: boolean) => Promise<void>
  pauseMusic: () => void
  resumeMusic: () => void
  
  // SFX controls
  playSFX: (trackId: string) => Promise<void>
  playUISound: (soundType: keyof typeof UI_SOUNDS) => Promise<void>
  playAchievementSound: (rarity: keyof typeof ACHIEVEMENT_SOUNDS) => Promise<void>
  
  // Volume controls
  setMasterVolume: (volume: number) => void
  setMusicVolume: (volume: number) => void
  setSFXVolume: (volume: number) => void
  toggleMusic: () => void
  toggleSFX: () => void
  
  // Context-aware music
  playContextMusic: (context: keyof typeof CONTEXT_MUSIC) => Promise<void>
  
  // Utilities
  initializeAudio: () => void
}

export function useAudio(): UseAudioReturn {
  const [isInitialized, setIsInitialized] = useState(false)
  const [preferences, setPreferences] = useState<AudioPreferences>({
    masterVolume: 0.7,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    musicEnabled: true,
    sfxEnabled: true,
    audioQuality: 'medium',
    reducedMotion: false
  })
  const [currentMusic, setCurrentMusic] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    if (!audioManager) return
    
    setMounted(true)
    setIsInitialized(audioManager.isInitialized())
    setPreferences(audioManager.getPreferences())
    setCurrentMusic(audioManager.getCurrentMusic())

    // Listen for audio events
    const unsubscribeInit = audioManager.on('audio_initialized', () => {
      setIsInitialized(true)
    })

    const unsubscribeMusic = audioManager.on('music_started', (data?: unknown) => {
      const musicData = data as { trackId: string }
      setCurrentMusic(musicData.trackId)
    })

    const unsubscribeMusicStop = audioManager.on('music_stopped', () => {
      setCurrentMusic(null)
    })

    const unsubscribeVolume = audioManager.on('volume_changed', () => {
      if (audioManager) setPreferences(audioManager.getPreferences())
    })

    const unsubscribePrefs = audioManager.on('preferences_updated', () => {
      if (audioManager) setPreferences(audioManager.getPreferences())
    })

    return () => {
      unsubscribeInit()
      unsubscribeMusic()
      unsubscribeMusicStop()
      unsubscribeVolume()
      unsubscribePrefs()
    }
  }, [])

  // Music controls
  const playMusic = useCallback(async (trackId: string, fadeIn: boolean = true) => {
    if (!audioManager || !mounted) return
    await audioManager.playMusic(trackId, fadeIn)
  }, [mounted])

  const stopMusic = useCallback(async (fadeOut: boolean = true) => {
    if (!audioManager || !mounted) return
    await audioManager.stopMusic(fadeOut)
  }, [mounted])

  const pauseMusic = useCallback(() => {
    if (!audioManager || !mounted) return
    audioManager.pauseAllMusic()
  }, [mounted])

  const resumeMusic = useCallback(() => {
    if (!audioManager || !mounted) return
    audioManager.resumeMusic()
  }, [mounted])

  // SFX controls
  const playSFX = useCallback(async (trackId: string) => {
    if (!audioManager || !mounted) return
    await audioManager.playSFX(trackId)
  }, [mounted])

  const playUISound = useCallback(async (soundType: keyof typeof UI_SOUNDS) => {
    if (!audioManager || !mounted) return
    const trackId = UI_SOUNDS[soundType]
    await audioManager.playSFX(trackId)
  }, [mounted])

  const playAchievementSound = useCallback(async (rarity: keyof typeof ACHIEVEMENT_SOUNDS) => {
    if (!audioManager || !mounted) return
    const trackId = ACHIEVEMENT_SOUNDS[rarity]
    await audioManager.playSFX(trackId)
  }, [mounted])

  // Volume controls
  const setMasterVolume = useCallback((volume: number) => {
    if (!audioManager || !mounted) return
    audioManager.setMasterVolume(volume)
  }, [mounted])

  const setMusicVolume = useCallback((volume: number) => {
    if (!audioManager || !mounted) return
    audioManager.setMusicVolume(volume)
  }, [mounted])

  const setSFXVolume = useCallback((volume: number) => {
    if (!audioManager || !mounted) return
    audioManager.setSFXVolume(volume)
  }, [mounted])

  const toggleMusic = useCallback(() => {
    if (!audioManager || !mounted) return
    audioManager.toggleMusic()
  }, [mounted])

  const toggleSFX = useCallback(() => {
    if (!audioManager || !mounted) return
    audioManager.toggleSFX()
  }, [mounted])

  // Context-aware music - DISABLED: Music now controlled by MarioAutoPlay component
  const playContextMusic = useCallback(async (context: keyof typeof CONTEXT_MUSIC) => {
    if (!mounted) return
    console.log('🎵 playContextMusic called but disabled - music controlled by MarioAutoPlay component')
    // All music is now controlled by the MarioAutoPlay component globally
  }, [mounted])

  // Initialize audio (call on user interaction)
  const initializeAudio = useCallback(() => {
    if (!audioManager || !mounted) return
    // Audio manager initializes automatically on first user interaction
    console.log('🎵 Audio initialization requested')
  }, [mounted])

  return {
    isInitialized,
    preferences,
    currentMusic,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    playSFX,
    playUISound,
    playAchievementSound,
    setMasterVolume,
    setMusicVolume,
    setSFXVolume,
    toggleMusic,
    toggleSFX,
    playContextMusic,
    initializeAudio
  }
}

// Convenient helper functions with synthesizer fallback
export const audioHelpers = {
  // Achievement sounds
  playAchievementUnlocked: async (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    try {
      if (audioManager) {
        await audioManager.playSFX(ACHIEVEMENT_SOUNDS[rarity])
      } else if (audioSynthesizer) {
        audioSynthesizer.playAchievementSound(rarity)
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playAchievementSound(rarity)
    }
  },

  // UI interaction sounds
  playClick: async (primary: boolean = true) => {
    try {
      if (audioManager) {
        await audioManager.playSFX(primary ? UI_SOUNDS.button_primary : UI_SOUNDS.button_secondary)
      } else if (audioSynthesizer) {
        audioSynthesizer.playClickSound(primary)
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playClickSound(primary)
    }
  },

  playHover: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.hover)
      } else if (audioSynthesizer) {
        audioSynthesizer.playHoverSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playHoverSound()
    }
  },

  playNavigation: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.navigation)
      } else if (audioSynthesizer) {
        audioSynthesizer.playClickSound(false)
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playClickSound(false)
    }
  },

  playPowerUpSelect: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.power_up_select)
      } else if (audioSynthesizer) {
        audioSynthesizer.playXPSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playXPSound()
    }
  },

  playLevelUp: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.level_up)
      } else if (audioSynthesizer) {
        audioSynthesizer.playLevelUpSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playLevelUpSound()
    }
  },

  playXPGain: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.xp_gain)
      } else if (audioSynthesizer) {
        audioSynthesizer.playXPSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playXPSound()
    }
  },

  playNotification: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.notification)
      } else if (audioSynthesizer) {
        audioSynthesizer.playNotificationSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playNotificationSound()
    }
  },

  playError: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.error)
      } else if (audioSynthesizer) {
        audioSynthesizer.playErrorSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playErrorSound()
    }
  },

  playChatbot: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.chatbot)
      } else if (audioSynthesizer) {
        audioSynthesizer.playNotificationSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playNotificationSound()
    }
  },

  playKonami: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.konami)
      } else if (audioSynthesizer) {
        audioSynthesizer.playBootSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playBootSound()
    }
  },

  playBootComplete: async () => {
    try {
      if (audioManager) {
        await audioManager.playSFX(UI_SOUNDS.boot_complete)
      } else if (audioSynthesizer) {
        audioSynthesizer.playBootSound()
      }
    } catch (error) {
      console.warn('Audio failed, using synthesizer fallback:', error)
      audioSynthesizer?.playBootSound()
    }
  },

  // Context music
  playHeroMusic: async () => {
    try {
      if (audioManager) {
        await audioManager.playMusic(CONTEXT_MUSIC.hero, true)
      } else if (audioSynthesizer) {
        audioSynthesizer.startAmbientLoop()
      }
    } catch (error) {
      console.warn('Music failed, using synthesizer ambient:', error)
      audioSynthesizer?.startAmbientLoop()
    }
  },

  playAmbientMusic: async () => {
    try {
      if (audioManager) {
        await audioManager.playMusic(CONTEXT_MUSIC.default, true)
      } else if (audioSynthesizer) {
        audioSynthesizer.startAmbientLoop()
      }
    } catch (error) {
      console.warn('Music failed, using synthesizer ambient:', error)
      audioSynthesizer?.startAmbientLoop()
    }
  },

  playChillMusic: async () => {
    try {
      if (audioManager) {
        await audioManager.playMusic(CONTEXT_MUSIC.contact, true)
      } else if (audioSynthesizer) {
        audioSynthesizer.startAmbientLoop()
      }
    } catch (error) {
      console.warn('Music failed, using synthesizer ambient:', error)
      audioSynthesizer?.startAmbientLoop()
    }
  }
}