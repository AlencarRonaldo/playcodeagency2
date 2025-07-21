// CRM Webhook Handler - Secure webhook processing for all CRM providers
// Gaming-themed webhook handling with achievement tracking

import { NextRequest, NextResponse } from 'next/server'
import { crmManager } from '@/lib/crm/manager'
import { IPSecurity, SecurityMonitor } from '@/lib/security/input-validation'

// Webhook rate limiting - more permissive than contact form
const WEBHOOK_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100 // 100 requests per minute per IP
}

// Track webhook requests
const webhookRequests = new Map<string, { count: number; resetTime: number }>()

export async function POST(request: NextRequest) {
  try {
    // Get provider from URL or headers
    const provider = request.headers.get('x-crm-provider') || 
                    request.nextUrl.searchParams.get('provider')
    
    if (!provider) {
      return NextResponse.json({
        error: 'Missing provider',
        message: 'CRM provider not specified'
      }, { status: 400 })
    }

    // IP-based rate limiting
    const ip = IPSecurity.getClientIP(request)
    const now = Date.now()
    const requestData = webhookRequests.get(ip) || { count: 0, resetTime: now + WEBHOOK_RATE_LIMIT.windowMs }

    if (now > requestData.resetTime) {
      requestData.count = 0
      requestData.resetTime = now + WEBHOOK_RATE_LIMIT.windowMs
    }

    requestData.count++
    webhookRequests.set(ip, requestData)

    if (requestData.count > WEBHOOK_RATE_LIMIT.maxRequests) {
      SecurityMonitor.logSecurityEvent({
        type: 'webhook_rate_limit',
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { provider, count: requestData.count }
      })

      return NextResponse.json({
        error: 'Rate limit exceeded',
        message: 'Too many webhook requests'
      }, { status: 429 })
    }

    // Get webhook signature based on provider
    const signature = getWebhookSignature(request, provider)
    if (!signature) {
      return NextResponse.json({
        error: 'Missing signature',
        message: 'Webhook signature not found'
      }, { status: 401 })
    }

    // Parse webhook payload
    const payload = await request.json()

    // Log webhook received
    console.log(`📨 Webhook received from ${provider}:`, {
      type: payload.subscriptionType || payload.event_type || payload.event,
      timestamp: new Date().toISOString()
    })

    // Process webhook through CRM manager
    const processed = await crmManager.handleWebhook(provider, payload, signature)

    if (!processed) {
      SecurityMonitor.logSecurityEvent({
        type: 'webhook_validation_failed',
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { provider, payload: JSON.stringify(payload).substring(0, 200) }
      })

      return NextResponse.json({
        error: 'Invalid webhook',
        message: 'Webhook validation failed'
      }, { status: 401 })
    }

    // Achievement tracking for webhook events
    const achievements = getWebhookAchievements(provider, payload)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      provider,
      achievements,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Webhook Error:', error)

    // Don't expose internal errors to webhook callers
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to process webhook'
    }, { status: 500 })
  }
}

// Handle webhook verification requests (some providers use GET)
export async function GET(request: NextRequest) {
  try {
    const provider = request.nextUrl.searchParams.get('provider')
    
    // HubSpot verification
    if (provider === 'hubspot') {
      const challenge = request.nextUrl.searchParams.get('challenge')
      if (challenge) {
        return new NextResponse(challenge, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        })
      }
    }

    // Salesforce verification
    if (provider === 'salesforce') {
      return NextResponse.json({
        success: true,
        message: 'Webhook endpoint verified'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'CRM webhook endpoint',
      providers: ['hubspot', 'salesforce', 'pipedrive', 'rd_station']
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Verification failed',
      message: 'Failed to verify webhook endpoint'
    }, { status: 500 })
  }
}

// Extract webhook signature based on provider
function getWebhookSignature(request: NextRequest, provider: string): string | null {
  switch (provider) {
    case 'hubspot':
      return request.headers.get('x-hubspot-signature-v3') || 
             request.headers.get('x-hubspot-signature')
    
    case 'salesforce':
      return request.headers.get('x-sfdc-signature')
    
    case 'pipedrive':
      return request.headers.get('x-pipedrive-signature')
    
    case 'rd_station':
      return request.headers.get('x-rd-signature')
    
    default:
      return request.headers.get('x-webhook-signature')
  }
}

// Map webhook events to gaming achievements
function getWebhookAchievements(provider: string, payload: any): string[] {
  const achievements: string[] = []

  // Check for specific events
  const eventType = payload.subscriptionType || payload.event_type || payload.event

  if (eventType?.includes('contact.creation') || eventType?.includes('lead.created')) {
    achievements.push('new_player_joined')
  }

  if (eventType?.includes('deal.creation')) {
    achievements.push('quest_initiated')
  }

  if (eventType?.includes('deal.propertyChange') && payload.propertyName === 'dealstage') {
    if (payload.propertyValue === 'closedwon') {
      achievements.push('boss_defeated')
      achievements.push('mission_complete')
    }
  }

  if (eventType?.includes('contact.propertyChange') && payload.propertyName === 'lifecyclestage') {
    if (payload.propertyValue === 'customer') {
      achievements.push('player_converted')
      achievements.push('legendary_status')
    }
  }

  // Provider-specific achievements
  if (provider === 'hubspot' && achievements.length > 0) {
    achievements.push('hubspot_sync_master')
  }

  return achievements
}

// Cleanup old rate limit entries periodically
if (typeof global !== 'undefined' && !(global as any).webhookCleanupInterval) {
  (global as any).webhookCleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [ip, data] of webhookRequests.entries()) {
      if (now > data.resetTime + WEBHOOK_RATE_LIMIT.windowMs) {
        webhookRequests.delete(ip)
      }
    }
  }, 5 * 60 * 1000) // Clean every 5 minutes
}