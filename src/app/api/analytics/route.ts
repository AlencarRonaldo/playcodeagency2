import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Event tracking schema
const analyticsSchema = z.object({
  event: z.string().min(1).max(100),
  category: z.enum(['gaming', 'ui', 'achievement', 'power-up', 'navigation', 'interaction']),
  action: z.string().min(1).max(100),
  label: z.string().optional(),
  value: z.number().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

// Gaming-specific events
const GAMING_EVENTS = {
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

// In-memory storage (replace with database)
const analyticsData = new Map()

// Rate limiting
const rateLimit = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 1 * 60 * 1000 // 1 minute
  const maxRequests = 100

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  const limit = rateLimit.get(ip)
  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (limit.count >= maxRequests) {
    return true
  }

  limit.count++
  return false
}

// POST: Track analytics event
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({
        error: 'Too many requests',
        message: 'Rate limit exceeded'
      }, { status: 429 })
    }

    // Parse and validate request
    const body = await request.json()
    const eventData = analyticsSchema.parse(body)

    // Add server-side metadata
    const enrichedEvent = {
      ...eventData,
      timestamp: new Date().toISOString(),
      ip: ip,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Store event (replace with database insert)
    analyticsData.set(enrichedEvent.id, enrichedEvent)

    // Calculate gaming metrics
    const gamingMetrics = calculateGamingMetrics(eventData)

    // Log for debugging (remove in production)
    console.log('📊 Analytics Event:', {
      event: eventData.event,
      category: eventData.category,
      action: eventData.action,
      metrics: gamingMetrics
    })

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      data: {
        eventId: enrichedEvent.id,
        timestamp: enrichedEvent.timestamp,
        gamingMetrics,
        achievements: checkForAchievements(eventData)
      }
    })

  } catch (error) {
    console.error('❌ Analytics API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to track event'
    }, { status: 500 })
  }
}

// GET: Retrieve analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '24h'
    const category = searchParams.get('category')

    // Get analytics summary (replace with database query)
    const events = Array.from(analyticsData.values())
    const filteredEvents = filterEventsByTimeframe(events, timeframe)
    
    if (category) {
      filteredEvents.filter(e => e.category === category)
    }

    const dashboard = generateDashboard(filteredEvents)

    return NextResponse.json({
      success: true,
      data: dashboard,
      metadata: {
        totalEvents: filteredEvents.length,
        timeframe,
        category: category || 'all',
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Analytics Dashboard Error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to generate dashboard'
    }, { status: 500 })
  }
}

function calculateGamingMetrics(eventData: z.infer<typeof analyticsSchema>) {
  const metrics = {
    xpGained: 0,
    achievementTriggered: false,
    engagementScore: 0,
    gamingLevel: 'novice'
  }

  // Calculate XP based on event type
  switch (eventData.event) {
    case GAMING_EVENTS.ACHIEVEMENT_UNLOCKED:
      metrics.xpGained = 100
      metrics.achievementTriggered = true
      break
    case GAMING_EVENTS.POWER_UP_SELECTED:
      metrics.xpGained = 50
      break
    case GAMING_EVENTS.KONAMI_CODE_ENTERED:
      metrics.xpGained = 500
      metrics.achievementTriggered = true
      break
    case GAMING_EVENTS.CONTACT_FORM_SUBMITTED:
      metrics.xpGained = 200
      break
    default:
      metrics.xpGained = 10
  }

  // Calculate engagement score
  metrics.engagementScore = Math.min(100, metrics.xpGained / 5)

  return metrics
}

function checkForAchievements(eventData: z.infer<typeof analyticsSchema>): string[] {
  const achievements = []

  // Event-specific achievements
  if (eventData.event === GAMING_EVENTS.KONAMI_CODE_ENTERED) {
    achievements.push('secret_discoverer')
  }
  
  if (eventData.category === 'power-up' && eventData.action === 'selected') {
    achievements.push('power_collector')
  }

  if (eventData.event === GAMING_EVENTS.HERO_BOOT_COMPLETED) {
    achievements.push('system_initiated')
  }

  return achievements
}

function filterEventsByTimeframe(events: Record<string, unknown>[], timeframe: string) {
  const now = new Date()
  const cutoff = new Date()

  switch (timeframe) {
    case '1h':
      cutoff.setHours(now.getHours() - 1)
      break
    case '24h':
      cutoff.setDate(now.getDate() - 1)
      break
    case '7d':
      cutoff.setDate(now.getDate() - 7)
      break
    case '30d':
      cutoff.setDate(now.getDate() - 30)
      break
    default:
      cutoff.setDate(now.getDate() - 1)
  }

  return events.filter(event => new Date(event.timestamp as string) >= cutoff)
}

function generateDashboard(events: Record<string, unknown>[]) {
  const dashboard = {
    overview: {
      totalEvents: events.length,
      uniqueUsers: new Set(events.map(e => e.userId as string).filter(Boolean)).size,
      topEvents: getTopEvents(events),
      topCategories: getTopCategories(events)
    },
    gaming: {
      totalXP: events.reduce((sum, e) => sum + ((e.metadata as Record<string, unknown>)?.xp as number || 0), 0),
      achievementsUnlocked: events.filter(e => e.event === GAMING_EVENTS.ACHIEVEMENT_UNLOCKED).length,
      powerUpsSelected: events.filter(e => e.category === 'power-up').length,
      easterEggsFound: events.filter(e => e.event === GAMING_EVENTS.EASTER_EGG_FOUND).length
    },
    performance: {
      avgPageLoadTime: calculateAverage(events, GAMING_EVENTS.PAGE_LOAD_TIME),
      avgInteractiveTime: calculateAverage(events, GAMING_EVENTS.INTERACTIVE_TIME),
      bounceRate: calculateBounceRate(events)
    },
    conversion: {
      contactFormSubmissions: events.filter(e => e.event === GAMING_EVENTS.CONTACT_FORM_SUBMITTED).length,
      missionStarted: events.filter(e => e.event === GAMING_EVENTS.MISSION_STARTED).length,
      conversionRate: calculateConversionRate(events)
    }
  }

  return dashboard
}

function getTopEvents(events: Record<string, unknown>[]) {
  const eventCounts: Record<string, number> = {}
  events.forEach(event => {
    const eventName = event.event as string
    eventCounts[eventName] = (eventCounts[eventName] || 0) + 1
  })

  return Object.entries(eventCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }))
}

function getTopCategories(events: Record<string, unknown>[]) {
  const categoryCounts: Record<string, number> = {}
  events.forEach(event => {
    const category = event.category as string
    categoryCounts[category] = (categoryCounts[category] || 0) + 1
  })

  return Object.entries(categoryCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .map(([category, count]) => ({ category, count }))
}

function calculateAverage(events: Record<string, unknown>[], eventType: string) {
  const relevantEvents = events.filter(e => e.event === eventType && e.value)
  if (relevantEvents.length === 0) return 0
  
  const sum = relevantEvents.reduce((acc, e) => acc + (e.value as number), 0)
  return Math.round(sum / relevantEvents.length)
}

function calculateBounceRate(events: Record<string, unknown>[]) {
  // Simplified bounce rate calculation
  const sessions = new Set(events.map(e => e.sessionId as string).filter(Boolean))
  const bouncedSessions = Array.from(sessions).filter(sessionId => {
    const sessionEvents = events.filter(e => e.sessionId === sessionId)
    return sessionEvents.length === 1
  })
  
  return sessions.size > 0 ? Math.round((bouncedSessions.length / sessions.size) * 100) : 0
}

function calculateConversionRate(events: Record<string, unknown>[]) {
  const totalSessions = new Set(events.map(e => e.sessionId as string).filter(Boolean)).size
  const conversions = events.filter(e => 
    e.event === GAMING_EVENTS.CONTACT_FORM_SUBMITTED || 
    e.event === GAMING_EVENTS.MISSION_STARTED
  ).length
  
  return totalSessions > 0 ? Math.round((conversions / totalSessions) * 100) : 0
}