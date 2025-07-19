'use client'

import { useCallback } from 'react'

interface AnalyticsEvent {
  event: string
  category: 'gaming' | 'ui' | 'achievement' | 'power-up' | 'navigation' | 'interaction'
  action: string
  label?: string
  value?: number
  metadata?: Record<string, unknown>
}

interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => Promise<void>
  trackPageView: (page: string) => Promise<void>
  trackAchievement: (achievementId: string, xp?: number) => Promise<void>
  trackPowerUp: (powerUpId: string, action: 'viewed' | 'selected' | 'equipped') => Promise<void>
  trackPerformance: (metric: string, value: number) => Promise<void>
}

export function useAnalytics(): UseAnalyticsReturn {
  const trackEvent = useCallback(async (eventData: AnalyticsEvent) => {
    try {
      // Add user session data
      const enrichedData = {
        ...eventData,
        userId: getOrCreateUserId(),
        sessionId: getOrCreateSessionId(),
        timestamp: Date.now(),
        url: window.location.href,
        metadata: {
          ...eventData.metadata,
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          timestamp: new Date().toISOString()
        }
      }

      // Send to analytics API
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedData)
      })

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`)
      }

      const result = await response.json()
      
      // Handle achievements from analytics response
      if (result.data?.achievements?.length > 0) {
        handleAchievements(result.data.achievements)
      }

      // Gaming feedback
      if (result.data?.gamingMetrics?.xpGained > 0) {
        showXPGainedFeedback(result.data.gamingMetrics.xpGained)
      }

    } catch (error) {
      console.error('📊 Analytics tracking failed:', error)
      // Fail silently to not break user experience
    }
  }, [])

  const trackPageView = useCallback(async (page: string) => {
    await trackEvent({
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      metadata: {
        page,
        referrer: document.referrer,
        loadTime: performance.now()
      }
    })
  }, [trackEvent])

  const trackAchievement = useCallback(async (achievementId: string, xp = 100) => {
    await trackEvent({
      event: 'achievement_unlocked',
      category: 'achievement',
      action: 'unlock',
      label: achievementId,
      value: xp,
      metadata: {
        achievementId,
        xpGained: xp
      }
    })
  }, [trackEvent])

  const trackPowerUp = useCallback(async (powerUpId: string, action: 'viewed' | 'selected' | 'equipped') => {
    await trackEvent({
      event: `power_up_${action}`,
      category: 'power-up',
      action,
      label: powerUpId,
      metadata: {
        powerUpId,
        action
      }
    })
  }, [trackEvent])

  const trackPerformance = useCallback(async (metric: string, value: number) => {
    await trackEvent({
      event: metric,
      category: 'gaming',
      action: 'performance',
      label: metric,
      value,
      metadata: {
        metric,
        value,
        timestamp: performance.now()
      }
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackAchievement,
    trackPowerUp,
    trackPerformance
  }
}

// Gaming-specific analytics events
export const ANALYTICS_EVENTS = {
  // Achievement system
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  XP_GAINED: 'xp_gained',
  
  // Power-ups
  POWER_UP_VIEWED: 'power_up_viewed',
  POWER_UP_SELECTED: 'power_up_selected',
  POWER_UP_EQUIPPED: 'power_up_equipped',
  
  // Gaming interactions
  KONAMI_CODE_ENTERED: 'konami_code_entered',
  EASTER_EGG_FOUND: 'easter_egg_found',
  AUDIO_TOGGLED: 'audio_toggled',
  
  // User journey
  HERO_BOOT_COMPLETED: 'hero_boot_completed',
  MISSION_STARTED: 'mission_started',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  
  // Performance
  PAGE_LOAD_TIME: 'page_load_time',
  INTERACTIVE_TIME: 'interactive_time',
}

// Helper functions
function getOrCreateUserId(): string {
  let userId = localStorage.getItem('playcode_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('playcode_user_id', userId)
  }
  return userId
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('playcode_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('playcode_session_id', sessionId)
  }
  return sessionId
}

function handleAchievements(achievements: string[]) {
  achievements.forEach(achievementId => {
    // Show achievement notification
    console.log(`🏆 Achievement unlocked: ${achievementId}`)
    
    // Could trigger UI notification here
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('achievement-unlocked', {
        detail: { achievementId }
      }))
    }
  })
}

function showXPGainedFeedback(xp: number) {
  console.log(`⚡ +${xp} XP gained!`)
  
  // Could trigger XP animation here
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('xp-gained', {
      detail: { xp }
    }))
  }
}