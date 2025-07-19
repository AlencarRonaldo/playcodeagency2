'use client'

import { Achievement, UserProgress, AchievementProgress, UserStats, SessionData, InteractionEvent, AchievementNotification } from './types'
import { ACHIEVEMENTS } from './definitions'

const STORAGE_KEY = 'playcode_user_progress'
const STORAGE_VERSION = '1.0'

export class AchievementManager {
  private userProgress: UserProgress
  private listeners: Set<(achievement: Achievement) => void> = new Set()
  private notificationQueue: AchievementNotification[] = []

  constructor() {
    this.userProgress = this.loadProgress()
    this.initializeSession()
    
    // Auto-save every 30 seconds
    setInterval(() => this.saveProgress(), 30000)
    
    // Save on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.saveProgress())
    }
  }

  private loadProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.version === STORAGE_VERSION) {
          return {
            ...data,
            session: this.createNewSession()
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load achievement progress:', error)
    }

    return this.createDefaultProgress()
  }

  private createDefaultProgress(): UserProgress {
    return {
      userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalXP: 0,
      level: 1,
      achievements: {},
      stats: {
        totalClicks: 0,
        totalHovers: 0,
        totalPageViews: 0,
        totalTimeOnSite: 0,
        powerUpsViewed: 0,
        powerUpsSelected: 0,
        chatbotMessages: 0,
        achievementsUnlocked: 0,
        lastVisit: new Date().toISOString(),
        visitCount: 1
      },
      session: this.createNewSession()
    }
  }

  private createNewSession(): SessionData {
    return {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
      interactions: []
    }
  }

  private initializeSession(): void {
    // Update visit count and last visit
    const now = new Date().toISOString()
    const lastVisit = new Date(this.userProgress.stats.lastVisit)
    const timeSinceLastVisit = Date.now() - lastVisit.getTime()
    
    // If more than 30 minutes since last visit, count as new visit
    if (timeSinceLastVisit > 30 * 60 * 1000) {
      this.userProgress.stats.visitCount++
      this.checkAchievement('comeback_hero', 'visit_count', this.userProgress.stats.visitCount)
    }
    
    this.userProgress.stats.lastVisit = now
    
    // Check time-based achievements
    this.checkTimeBasedAchievements()
    
    // Trigger first contact achievement
    this.trackEvent('page_view', { path: this.userProgress.session.currentPath })
  }

  private saveProgress(): void {
    try {
      const dataToSave = {
        ...this.userProgress,
        version: STORAGE_VERSION,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save achievement progress:', error)
    }
  }

  // Public API Methods
  public trackEvent(eventType: string, data?: Record<string, unknown>): void {
    // Record interaction
    const interaction: InteractionEvent = {
      type: eventType,
      timestamp: Date.now(),
      data
    }
    this.userProgress.session.interactions.push(interaction)

    // Update stats
    this.updateStats(eventType, data)

    // Check achievements
    this.checkEventAchievements(eventType, data)

    // Save progress
    this.saveProgress()
  }

  private updateStats(eventType: string, data?: Record<string, unknown>): void {
    const stats = this.userProgress.stats

    switch (eventType) {
      case 'click':
        stats.totalClicks++
        this.checkAchievement('click_master', 'click', stats.totalClicks)
        break
      
      case 'hover':
        stats.totalHovers++
        break
      
      case 'page_view':
        stats.totalPageViews++
        this.updateTimeOnSite()
        break
      
      case 'power_up_viewed':
        stats.powerUpsViewed++
        this.checkAchievement('power_scout', 'power_up_viewed', stats.powerUpsViewed)
        break
      
      case 'power_up_selected':
        stats.powerUpsSelected++
        this.checkAchievement('power_collector', 'power_up_selected', stats.powerUpsSelected)
        break
      
      case 'chatbot_message':
        stats.chatbotMessages++
        this.checkAchievement('chatbot_friend', 'chatbot_message', stats.chatbotMessages)
        break
      
      case 'contact_form_submitted':
        this.unlockAchievement('mission_starter')
        break
    }
  }

  private updateTimeOnSite(): void {
    const sessionTime = Date.now() - this.userProgress.session.startTime
    this.userProgress.stats.totalTimeOnSite = sessionTime
    
    // Check time-based achievements
    if (sessionTime >= 600000) { // 10 minutes
      this.unlockAchievement('dedicated_visitor')
    }
  }

  private checkEventAchievements(eventType: string, data?: Record<string, unknown>): void {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (achievement.unlocked) return

      if (achievement.condition.type === 'event' && achievement.condition.target === eventType) {
        this.unlockAchievement(achievement.id)
      }
    })

    // Special event checks
    if (eventType === 'page_view' && !this.userProgress.achievements['first_contact']?.unlocked) {
      this.unlockAchievement('first_contact')
    }
  }

  private checkAchievement(achievementId: string, statType: string, currentValue: number): void {
    const achievement = ACHIEVEMENTS[achievementId]
    if (!achievement || achievement.unlocked) return

    const progress = this.userProgress.achievements[achievementId] || {
      id: achievementId,
      unlocked: false,
      progress: 0
    }

    progress.progress = currentValue

    if (achievement.condition.value && currentValue >= achievement.condition.value) {
      this.unlockAchievement(achievementId)
    }

    this.userProgress.achievements[achievementId] = progress
  }

  private checkTimeBasedAchievements(): void {
    const now = new Date()
    const hour = now.getHours()

    // Night Owl achievement (00:00 - 06:00)
    if (hour >= 0 && hour < 6) {
      this.unlockAchievement('night_owl')
    }
  }

  public unlockAchievement(achievementId: string): boolean {
    const achievement = ACHIEVEMENTS[achievementId]
    if (!achievement) return false

    const progress = this.userProgress.achievements[achievementId] || {
      id: achievementId,
      unlocked: false,
      progress: 0
    }

    if (progress.unlocked) return false

    // Check prerequisites
    if (achievement.prerequisite) {
      const prerequisitesMet = achievement.prerequisite.every(prereqId => 
        this.userProgress.achievements[prereqId]?.unlocked
      )
      if (!prerequisitesMet) return false
    }

    // Unlock achievement
    progress.unlocked = true
    progress.unlockedAt = new Date().toISOString()
    this.userProgress.achievements[achievementId] = progress

    // Add XP
    this.addXP(achievement.xp)

    // Update stats
    this.userProgress.stats.achievementsUnlocked++

    // Check meta-achievement
    this.checkAchievement('achievement_hunter', 'achievement_unlocked', this.userProgress.stats.achievementsUnlocked)

    // Notify listeners
    this.notifyAchievementUnlocked(achievement)

    // Add to notification queue
    this.queueNotification(achievement)

    console.log(`🏆 Achievement Unlocked: ${achievement.name} (+${achievement.xp} XP)`)
    return true
  }

  private addXP(amount: number): void {
    const oldLevel = this.userProgress.level
    this.userProgress.totalXP += amount

    // Calculate new level (100 XP per level, exponential scaling)
    const newLevel = Math.floor(Math.sqrt(this.userProgress.totalXP / 100)) + 1
    
    if (newLevel > oldLevel) {
      this.userProgress.level = newLevel
      this.trackEvent('level_up', { 
        oldLevel, 
        newLevel, 
        totalXP: this.userProgress.totalXP 
      })

      // Check level-based achievements
      if (newLevel >= 10) {
        this.unlockAchievement('level_up_legend')
      }
    }
  }

  private notifyAchievementUnlocked(achievement: Achievement): void {
    this.listeners.forEach(listener => {
      try {
        listener(achievement)
      } catch (error) {
        console.error('Achievement listener error:', error)
      }
    })
  }

  private queueNotification(achievement: Achievement): void {
    const notification: AchievementNotification = {
      achievement,
      timestamp: Date.now(),
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shown: false
    }
    this.notificationQueue.push(notification)
  }

  // Public API
  public onAchievementUnlocked(callback: (achievement: Achievement) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  public getProgress(): UserProgress {
    return { ...this.userProgress }
  }

  public getAchievement(id: string): Achievement | null {
    return ACHIEVEMENTS[id] || null
  }

  public getAllAchievements(): Achievement[] {
    return Object.values(ACHIEVEMENTS)
  }

  public getUnlockedAchievements(): Achievement[] {
    return Object.values(ACHIEVEMENTS).filter(achievement => 
      this.userProgress.achievements[achievement.id]?.unlocked
    )
  }

  public getAchievementProgress(id: string): AchievementProgress | null {
    return this.userProgress.achievements[id] || null
  }

  public getNextNotification(): AchievementNotification | null {
    const unshown = this.notificationQueue.find(n => !n.shown)
    if (unshown) {
      unshown.shown = true
      return unshown
    }
    return null
  }

  public triggerKonamiCode(): void {
    this.unlockAchievement('konami_master')
    this.trackEvent('konami_code_entered')
  }

  public reset(): void {
    localStorage.removeItem(STORAGE_KEY)
    this.userProgress = this.createDefaultProgress()
    this.initializeSession()
  }
}

// Singleton instance
export const achievementManager = typeof window !== 'undefined' ? new AchievementManager() : null