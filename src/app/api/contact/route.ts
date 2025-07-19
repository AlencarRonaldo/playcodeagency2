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
      html: generateEmailHTML(validatedData)
    }

    // TODO: Implement actual email sending with SendGrid
    console.log('📧 Email would be sent:', emailData)

    // TODO: Save to database
    console.log('💾 Contact would be saved to database:', validatedData)

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