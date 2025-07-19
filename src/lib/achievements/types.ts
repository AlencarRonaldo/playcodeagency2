// Achievement System Types
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type AchievementCategory = 'exploration' | 'interaction' | 'mastery' | 'secret' | 'social'

export interface Achievement {
  id: string
  name: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  icon: string
  xp: number
  condition: AchievementCondition
  unlocked: boolean
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
  hidden?: boolean
  prerequisite?: string[]
}

export interface AchievementCondition {
  type: 'event' | 'counter' | 'sequence' | 'time' | 'combo'
  target: string | string[]
  value?: number
  timeframe?: number // milliseconds
}

export interface UserProgress {
  userId: string
  totalXP: number
  level: number
  achievements: Record<string, AchievementProgress>
  stats: UserStats
  session: SessionData
}

export interface AchievementProgress {
  id: string
  unlocked: boolean
  progress: number
  unlockedAt?: string
  attempts?: number
}

export interface UserStats {
  totalClicks: number
  totalHovers: number
  totalPageViews: number
  totalTimeOnSite: number
  powerUpsViewed: number
  powerUpsSelected: number
  chatbotMessages: number
  achievementsUnlocked: number
  lastVisit: string
  visitCount: number
}

export interface SessionData {
  sessionId: string
  startTime: number
  currentPath: string
  interactions: InteractionEvent[]
}

export interface InteractionEvent {
  type: string
  timestamp: number
  data?: Record<string, unknown>
}

export interface AchievementNotification {
  achievement: Achievement
  timestamp: number
  id: string
  shown: boolean
}