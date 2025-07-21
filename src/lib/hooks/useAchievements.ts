'use client'

import { useState, useEffect, useCallback } from 'react'
import { Achievement, UserProgress, AchievementNotification } from '../achievements/types'
import { achievementManager } from '../achievements/manager'

interface UseAchievementsReturn {
  // Progress data
  userProgress: UserProgress | null
  achievements: Achievement[]
  unlockedAchievements: Achievement[]
  
  // Actions
  trackEvent: (eventType: string, data?: Record<string, unknown>) => void
  unlockAchievement: (id: string) => boolean
  
  // Notifications
  notifications: AchievementNotification[]
  getNextNotification: () => AchievementNotification | null
  
  // Utilities
  getAchievementProgress: (id: string) => { progress: number; maxProgress: number; percentage: number }
  isUnlocked: (id: string) => boolean
  reset: () => void
  
  // Gaming actions
  triggerKonamiCode: () => void
}

export function useAchievements(): UseAchievementsReturn {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [achievements] = useState<Achievement[]>(() => 
    achievementManager?.getAllAchievements() || []
  )
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [notifications, setNotifications] = useState<AchievementNotification[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    if (!achievementManager) return
    
    setMounted(true)
    setUserProgress(achievementManager.getProgress())
    setUnlockedAchievements(achievementManager.getUnlockedAchievements())

    // Listen for new achievements
    const unsubscribe = achievementManager.onAchievementUnlocked((_achievement) => {
      if (!achievementManager) return
      setUserProgress(achievementManager.getProgress())
      setUnlockedAchievements(achievementManager.getUnlockedAchievements())
      
      // Add notification
      const notification = achievementManager.getNextNotification()
      if (notification) {
        setNotifications(prev => [...prev, notification])
      }
    })

    return unsubscribe
  }, [])

  // Track events
  const trackEvent = useCallback((eventType: string, data?: Record<string, unknown>) => {
    if (!achievementManager || !mounted) return
    achievementManager.trackEvent(eventType, data)
  }, [mounted])

  // Unlock achievement manually
  const unlockAchievement = useCallback((id: string): boolean => {
    if (!achievementManager || !mounted) return false
    return achievementManager.unlockAchievement(id)
  }, [mounted])

  // Get next notification
  const getNextNotification = useCallback((): AchievementNotification | null => {
    if (!achievementManager || !mounted) return null
    return achievementManager.getNextNotification()
  }, [mounted])

  // Get achievement progress
  const getAchievementProgress = useCallback((id: string) => {
    if (!achievementManager || !mounted) {
      return { progress: 0, maxProgress: 1, percentage: 0 }
    }

    const achievement = achievementManager.getAchievement(id)
    const progress = achievementManager.getAchievementProgress(id)
    
    if (!achievement || !progress) {
      return { progress: 0, maxProgress: 1, percentage: 0 }
    }

    const maxProgress = achievement.maxProgress || 1
    const currentProgress = progress.progress || 0
    const percentage = Math.min((currentProgress / maxProgress) * 100, 100)

    return {
      progress: currentProgress,
      maxProgress,
      percentage
    }
  }, [mounted])

  // Check if achievement is unlocked
  const isUnlocked = useCallback((id: string): boolean => {
    if (!achievementManager || !mounted) return false
    const progress = achievementManager.getAchievementProgress(id)
    return progress?.unlocked || false
  }, [mounted])

  // Reset progress
  const reset = useCallback(() => {
    if (!achievementManager || !mounted) return
    achievementManager.reset()
    setUserProgress(achievementManager.getProgress())
    setUnlockedAchievements(achievementManager.getUnlockedAchievements())
    setNotifications([])
  }, [mounted])

  // Gaming actions
  const triggerKonamiCode = useCallback(() => {
    if (!achievementManager || !mounted) return
    achievementManager.triggerKonamiCode()
  }, [mounted])

  return {
    userProgress,
    achievements,
    unlockedAchievements,
    trackEvent,
    unlockAchievement,
    notifications,
    getNextNotification,
    getAchievementProgress,
    isUnlocked,
    reset,
    triggerKonamiCode
  }
}

// Gaming event helpers
export const trackingHelpers = {
  // Page navigation
  trackPageView: (path: string) => {
    achievementManager?.trackEvent('page_view', { path })
  },

  // UI interactions
  trackClick: (element: string, data?: Record<string, unknown>) => {
    achievementManager?.trackEvent('click', { element, ...data })
  },

  trackHover: (element: string) => {
    achievementManager?.trackEvent('hover', { element })
  },

  // Power-ups
  trackPowerUpView: (powerUpId: string) => {
    achievementManager?.trackEvent('power_up_viewed', { powerUpId })
  },

  trackPowerUpSelect: (powerUpId: string) => {
    achievementManager?.trackEvent('power_up_selected', { powerUpId })
  },

  // Chatbot
  trackChatbotMessage: (message: string, response?: string) => {
    achievementManager?.trackEvent('chatbot_message', { message, response })
  },

  // Forms
  trackContactForm: (data: Record<string, unknown>) => {
    achievementManager?.trackEvent('contact_form_submitted', data)
  },

  // Social
  trackSocialShare: (platform: string, url: string) => {
    achievementManager?.trackEvent('social_share', { platform, url })
  },

  // Payment & Purchases
  trackPurchase: (data: {
    plan_id: string
    amount: number
    currency: string
    billing_cycle: string
  }) => {
    achievementManager?.trackEvent('purchase_initiated', data)
  },

  trackPurchaseComplete: (data: {
    subscription_id: string
    plan_name: string
    amount: number
  }) => {
    achievementManager?.trackEvent('purchase_completed', data)
  },

  trackCheckoutStep: (step: string, plan_id: string) => {
    achievementManager?.trackEvent('checkout_step', { step, plan_id })
  },

  // Gaming
  trackKonamiCode: () => {
    achievementManager?.triggerKonamiCode()
  },

  trackEasterEgg: (eggId: string) => {
    achievementManager?.trackEvent('easter_egg_found', { eggId })
  }
}