import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/services/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔔 Webhook Mock recebido:', body)

    // Dados esperados do nosso teste
    const { 
      event_type,
      data: {
        id,
        reference_id,
        status,
        customer,
        plan
      }
    } = body

    // Verificar se é um evento de ativação
    if (event_type !== 'subscription.activated' && status !== 'ACTIVE') {
      console.log('⚠️ Evento ignorado:', event_type, status)
      return NextResponse.json({ 
        message: 'Evento não processado - não é ativação' 
      }, { status: 200 })
    }

    // Mapear dados do cliente
    const customerData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || ''
    }

    // Mapear tipo de serviço baseado no plano
    const serviceTypeMap: Record<string, any> = {
      'starter-pack': 'website',
      'pro-guild': 'ecommerce', 
      'enterprise': 'automation'
    }

    const planTypeMap: Record<string, any> = {
      'starter-pack': 'starter',
      'pro-guild': 'pro',
      'enterprise': 'enterprise'
    }

    // Extrair plano do ID do plano
    const planId = plan.id.includes('starter') ? 'starter-pack' :
                  plan.id.includes('pro') ? 'pro-guild' : 'enterprise'

    const serviceType = serviceTypeMap[planId] || 'website'
    const planType = planTypeMap[planId] || 'starter'

    console.log('📧 Preparando envio de email:', {
      to: customerData.email,
      name: customerData.name,
      serviceType,
      planType
    })

    // Gerar ID do onboarding
    const onboardingId = `onboarding_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/onboarding/${onboardingId}`

    // Inicializar serviço de email
    const emailService = new EmailService()

    // Enviar email de boas-vindas
    try {
      await emailService.sendWelcomeEmail({
        to: customerData.email,
        customerName: customerData.name,
        serviceType,
        planType,
        onboardingUrl
      })

      console.log('✅ Email de boas-vindas enviado com sucesso!')
      
      return NextResponse.json({ 
        success: true,
        message: '✅ Email de boas-vindas enviado com sucesso!',
        data: {
          onboardingId,
          customerEmail: customerData.email,
          serviceType,
          planType,
          onboardingUrl
        }
      })

    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError)
      
      return NextResponse.json({ 
        success: false,
        message: '❌ Erro ao enviar email',
        error: String(emailError)
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Erro no webhook mock:', error)
    
    return NextResponse.json({ 
      success: false,
      message: 'Erro interno no webhook',
      error: String(error)
    }, { status: 500 })
  }
}