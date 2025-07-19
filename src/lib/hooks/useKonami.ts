'use client'

import { useState, useEffect, useCallback } from 'react'
import { konamiCode } from '../easter-eggs/konami'
import { audioHelpers } from './useAudio'
import { trackingHelpers } from './useAchievements'

interface UseKonamiReturn {
  isActive: boolean
  activationCount: number
  triggerManually: () => void
}

export function useKonami(): UseKonamiReturn {
  const [isActive, setIsActive] = useState(false)
  const [activationCount, setActivationCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!konamiCode) return
    
    setMounted(true)
    setIsActive(konamiCode.isCurrentlyActive())

    const unsubscribe = konamiCode.onActivated(() => {
      setIsActive(true)
      setActivationCount(prev => prev + 1)
      
      // Play Konami sound
      audioHelpers.playKonami()
      
      // Track achievement
      trackingHelpers.trackKonamiCode()
      
      // Show success message
      console.log('🎮 PLAYER ONE - KONAMI CODE UNLOCKED!')
      
      // Reset active state after animation
      setTimeout(() => {
        setIsActive(false)
      }, 5000)
    })

    return unsubscribe
  }, [])

  const triggerManually = useCallback(() => {
    if (!mounted || !konamiCode) return
    
    setIsActive(true)
    setActivationCount(prev => prev + 1)
    
    // Play effects
    audioHelpers.playKonami()
    trackingHelpers.trackKonamiCode()
    
    // Reset after animation
    setTimeout(() => {
      setIsActive(false)
    }, 5000)
  }, [mounted])

  return {
    isActive,
    activationCount,
    triggerManually
  }
}