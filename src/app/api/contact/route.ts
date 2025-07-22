import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { secureContactSchema, EnhancedRateLimit, MemoryRateLimitStore, IPSecurity, SecurityMonitor } from '@/lib/security/input-validation'
import { EmailService } from '@/lib/services/email'

// Enhanced rate limiting - more permissive in development
const contactRateLimit = new EnhancedRateLimit(
  new MemoryRateLimitStore(),
  process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 min dev, 15 min prod
  process.env.NODE_ENV === 'development' ? 10 : 3 // 10 attempts in dev, 3 in prod
)

const emailService = new EmailService();

// Security tracking - for future security monitoring dashboard
// const securityEvents = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    // Enhanced IP security and validation
    const ip = IPSecurity.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Block suspicious IPs
    if (IPSecurity.isBlockedIP(ip)) {
      SecurityMonitor.logSecurityEvent({
        type: 'blocked_ip',
        ip,
        userAgent,
        details: { action: 'contact_form' }
      })
      
      return NextResponse.json({
        error: 'Access denied',
        message: 'Acesso negado para este IP'
      }, { status: 403 })
    }
    
    // Enhanced rate limiting
    if (await contactRateLimit.isRateLimited(ip)) {
      SecurityMonitor.logSecurityEvent({
        type: 'rate_limit',
        ip,
        userAgent,
        details: { endpoint: 'contact', limit: '3/15min' }
      })
      
      return NextResponse.json({
        error: 'Too many requests',
        message: 'Muitas tentativas. Tente novamente em 15 minutos.',
        achievement: 'rate_limit_reached'
      }, { status: 429 })
    }

    // Parse and validate request body with enhanced security
    const body = await request.json()
    
    // Check for suspicious content
    const suspicious = SecurityMonitor.detectSuspiciousContent(JSON.stringify(body))
    if (suspicious.length > 0) {
      SecurityMonitor.logSecurityEvent({
        type: 'suspicious_input',
        ip,
        userAgent,
        details: { threats: suspicious, data: body }
      })
      
      return NextResponse.json({
        error: 'Invalid content',
        message: 'Conteúdo suspeito detectado'
      }, { status: 400 })
    }
    
    // Bot detection - check honeypot fields
    if (body.website || body.confirm_email) {
      SecurityMonitor.logSecurityEvent({
        type: 'bot_detected',
        ip,
        userAgent,
        details: { honeypot_triggered: true }
      })
      
      // Silent fail - don't let bots know they're detected
      return NextResponse.json({
        success: true,
        message: '🚀 Mensagem enviada com sucesso!'
      })
    }
    
    const validatedData = secureContactSchema.parse(body)

    // Tentar enviar email usando o EmailService
    try {
      await emailService.sendContactFormEmail({
        ...validatedData,
        lead_score: body.lead_score || 0,
        project_type: body.project_type,
        budget_range: body.budget_range,
        urgency: body.urgency,
      });
      console.log('✅ Email enviado com sucesso')
    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError)
      // Continue o processo mesmo se o email falhar - não queremos perder o lead
      console.log('⚠️ Continuando processo apesar do erro de email')
    }

    // TODO: Save to database
    console.log('💾 Contact would be saved to database:', validatedData)

    // CRM Integration (optional)
    try {
      const { getCRMManager } = await import('@/lib/crm/init')
      const crmManager = await getCRMManager()
      
      // Transform to GamingLead format
      const gamingLead = {
        id: `lead_${Date.now()}`,
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        company: validatedData.company,
        leadScore: body.lead_score || 0,
        playerLevel: 'new_player' as const,
        achievements: ['first_contact'],
        powerUps: validatedData.powerUps || [],
        projectType: body.project_type || 'custom',
        budgetRange: body.budget_range || 'custom',
        urgency: body.urgency || 'normal',
        message: validatedData.message,
        source: 'website',
        campaign: body.campaign,
        createdAt: new Date(),
        updatedAt: new Date(),
        syncStatus: 'pending' as const
      }

      // Sync with CRM asynchronously (only if configured)
      crmManager.createLead(gamingLead).then(response => {
        if (response.success) {
          console.log('✅ Lead synced to CRM:', response.data)
        } else {
          // Log as info instead of error if no provider is configured
          if (response.error === 'No CRM provider configured') {
            console.log('ℹ️ CRM not configured - lead saved locally only')
          } else {
            console.error('❌ CRM sync failed:', response.error)
          }
        }
      }).catch(error => {
        console.error('❌ CRM sync error:', error)
      })
    } catch (crmError) {
      // Don't fail the contact submission if CRM fails
      console.log('ℹ️ CRM integration not available:', crmError)
    }

    // Gaming response with achievements
    const achievements = []
    if (validatedData.powerUps && validatedData.powerUps.length > 0) {
      achievements.push('power_up_selector')
    }
    if (validatedData.gameMode) {
      achievements.push('game_mode_chosen')
    }
    achievements.push('first_contact')

    return NextResponse.json({
      success: true,
      message: '🚀 Missão recebida com sucesso! Nossa equipe entrará em contato em breve.',
      data: {
        id: `mission_${Date.now()}`,
        status: 'received',
        eta: '24 horas',
        achievements: achievements,
        xp: 100
      }
    })

  } catch (error) {
    console.error('❌ Contact API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          message: 'Dados inválidos',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Erro interno do servidor. Tente novamente.' 
      },
      { status: 500 }
    )
  }
}