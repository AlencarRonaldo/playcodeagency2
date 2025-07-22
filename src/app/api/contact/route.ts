import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { secureContactSchema, EnhancedRateLimit, MemoryRateLimitStore, IPSecurity, SecurityMonitor } from '@/lib/security/input-validation'

// Enhanced rate limiting - more permissive in development
const contactRateLimit = new EnhancedRateLimit(
  new MemoryRateLimitStore(),
  process.env.NODE_ENV === 'development' ? 5 * 60 * 1000 : 15 * 60 * 1000, // 5 min dev, 15 min prod
  process.env.NODE_ENV === 'development' ? 10 : 3 // 10 attempts in dev, 3 in prod
)

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

    // Simulate email sending (replace with actual SendGrid implementation)
    const emailData = {
      to: process.env.FROM_EMAIL || 'contact@playcode.agency',
      from: process.env.FROM_EMAIL || 'noreply@playcode.agency',
      subject: `🎮 Nova missão recebida: ${validatedData.name}`,
      html: generateEmailHTML({
        ...validatedData,
        approvalInstructions
      } as any)
    }

    // TODO: Implement actual email sending with SendGrid
    console.log('📧 Email would be sent:', emailData)

    // TODO: Save to database
    console.log('💾 Contact would be saved to database:', validatedData)

    // Se tem informações suficientes para orçamento, incluir link para envio de aprovação
    let approvalInstructions = ''
    if (validatedData.name && validatedData.email && body.project_type && body.budget_range) {
      approvalInstructions = `
        
        🎯 <strong>Para Equipe - Processo de Orçamento:</strong>
        <div style="background: #2A2A3A; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <p>Cliente possui informações completas para orçamento:</p>
          <ul>
            <li>Nome: ${validatedData.name}</li>
            <li>Email: ${validatedData.email}</li>
            <li>Projeto: ${body.project_type}</li>
            <li>Orçamento: ${body.budget_range}</li>
            <li>Empresa: ${validatedData.company || 'Não informado'}</li>
            <li>Telefone: ${validatedData.phone || 'Não informado'}</li>
          </ul>
          
          <p><strong>Próximos passos:</strong></p>
          <ol>
            <li>Analisar requisitos e preparar orçamento detalhado</li>
            <li>Usar API <code>/api/approval/send</code> para enviar proposta</li>
            <li>Cliente receberá email com botões de Aprovar/Rejeitar</li>
            <li>Notificação automática do resultado para equipe</li>
          </ol>
          
          <p><em>Dados prontos para sistema de aprovação automática!</em></p>
        </div>
      `
    }

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

function generateEmailHTML(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  powerUps?: string[];
  gameMode?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Arial', sans-serif; background: #0A0A0F; color: #FFFFFF; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0070D1, #8B5CF6, #00FFFF); padding: 20px; border-radius: 10px; text-align: center; }
        .content { background: #1E1E2E; padding: 30px; border-radius: 10px; margin-top: 20px; }
        .power-up { background: #2A2A3A; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #00FFFF; }
        .footer { text-align: center; margin-top: 20px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎮 NOVA MISSÃO RECEBIDA</h1>
          <p>PlayCode Agency - Gaming Digital Solutions</p>
        </div>
        
        <div class="content">
          <h2>📋 Detalhes da Missão</h2>
          
          <p><strong>👤 Player:</strong> ${data.name}</p>
          <p><strong>📧 Email:</strong> ${data.email}</p>
          ${data.company ? `<p><strong>🏢 Empresa:</strong> ${data.company}</p>` : ''}
          ${data.phone ? `<p><strong>📱 Telefone:</strong> ${data.phone}</p>` : ''}
          ${data.gameMode ? `<p><strong>🎮 Modo de Jogo:</strong> ${data.gameMode.toUpperCase()}</p>` : ''}
          
          <h3>💬 Mensagem:</h3>
          <div class="power-up">${data.message}</div>
          
          ${data.powerUps && data.powerUps.length > 0 ? `
            <h3>⚡ Power-ups Selecionados:</h3>
            ${data.powerUps.map((powerUp: string) => `<div class="power-up">${powerUp}</div>`).join('')}
          ` : ''}
          
          ${(data as any).approvalInstructions || ''}
        </div>
        
        <div class="footer">
          <p>🚀 Processado em ${new Date().toLocaleString('pt-BR')}</p>
          <p>PlayCode Agency - Transformando visões em realidade digital</p>
        </div>
      </div>
    </body>
    </html>
  `
}