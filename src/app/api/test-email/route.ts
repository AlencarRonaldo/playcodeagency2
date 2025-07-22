import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/services/email'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Iniciando teste de email...')
    
    // Verificar variáveis de ambiente
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    }
    
    console.log('📧 Configuração SMTP:', {
      ...smtpConfig,
      pass: process.env.SMTP_PASS ? '***definida***' : '❌ não definida'
    })

    // Inicializar serviço
    const emailService = new EmailService()

    // Enviar email de teste
    await emailService.sendWelcomeEmail({
      to: 'ronaldoalencar2009@hotmail.com',
      customerName: 'Ronaldo Alencar',
      serviceType: 'website',
      planType: 'starter',
      onboardingUrl: 'http://localhost:3005/onboarding/test123'
    })

    console.log('✅ Email de teste enviado!')
    
    return NextResponse.json({
      success: true,
      message: '✅ Email enviado com sucesso!',
      config: smtpConfig
    })

  } catch (error) {
    console.error('❌ Erro no teste de email:', error)
    
    return NextResponse.json({
      success: false,
      message: '❌ Erro ao enviar email',
      error: String(error)
    }, { status: 500 })
  }
}