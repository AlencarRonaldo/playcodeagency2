import { NextRequest, NextResponse } from 'next/server'
import { WebhookEvent } from '@/lib/payments/types'
import crypto from 'crypto'

// Função para verificar assinatura do webhook
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

// POST /api/webhooks/pagseguro - Receber webhooks do PagSeguro
export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-pagseguro-signature') || ''
    const eventType = request.headers.get('x-pagseguro-event-type') || ''

    // Verificar assinatura (em produção)
    if (process.env.NODE_ENV === 'production') {
      const webhookSecret = process.env.PAGSEGURO_WEBHOOK_SECRET
      if (!webhookSecret || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        console.error('Invalid webhook signature')
        return NextResponse.json({
          success: false,
          error: 'Invalid signature'
        }, { status: 401 })
      }
    }

    const webhookData: WebhookEvent = JSON.parse(payload)
    
    console.log('Received PagSeguro webhook:', {
      event_type: webhookData.event_type,
      reference_id: webhookData.reference_id,
      subscription_id: webhookData.data.subscription?.id
    })

    // Processar evento baseado no tipo
    switch (webhookData.event_type) {
      case 'SUBSCRIPTION_CREATED':
        await handleSubscriptionCreated(webhookData)
        break

      case 'SUBSCRIPTION_ACTIVATED':
        await handleSubscriptionActivated(webhookData)
        break

      case 'SUBSCRIPTION_PAYMENT_SUCCESS':
        await handlePaymentSuccess(webhookData)
        break

      case 'SUBSCRIPTION_PAYMENT_FAILED':
        await handlePaymentFailed(webhookData)
        break

      case 'SUBSCRIPTION_CANCELED':
        await handleSubscriptionCanceled(webhookData)
        break

      default:
        console.log(`Unhandled webhook event type: ${webhookData.event_type}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed'
    }, { status: 500 })
  }
}

// Handlers para diferentes tipos de eventos

async function handleSubscriptionCreated(webhook: WebhookEvent) {
  try {
    console.log('Processing subscription created:', webhook.data.subscription.id)
    
    // TODO: Salvar assinatura no banco de dados
    // TODO: Enviar email de confirmação para cliente
    // TODO: Ativar recursos do plano
    
    // Por enquanto, apenas log
    console.log('Subscription created successfully:', {
      subscription_id: webhook.data.subscription.id,
      reference_id: webhook.reference_id,
      customer_email: webhook.data.subscription.customer_id,
      plan_id: webhook.data.subscription.plan_id,
      amount: webhook.data.subscription.amount
    })
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
    throw error
  }
}

async function handleSubscriptionActivated(webhook: WebhookEvent) {
  try {
    console.log('Processing subscription activated:', webhook.data.subscription.id)
    
    // TODO: Ativar acesso completo aos recursos
    // TODO: Atualizar status no banco de dados
    // TODO: Enviar email de boas-vindas
    
    console.log('Subscription activated successfully:', {
      subscription_id: webhook.data.subscription.id,
      reference_id: webhook.reference_id,
      status: webhook.data.subscription.status
    })
    
  } catch (error) {
    console.error('Error handling subscription activated:', error)
    throw error
  }
}

async function handlePaymentSuccess(webhook: WebhookEvent) {
  try {
    console.log('Processing payment success:', webhook.data.payment?.id)
    
    // TODO: Renovar acesso aos recursos
    // TODO: Atualizar próxima data de cobrança
    // TODO: Enviar recibo por email
    
    console.log('Payment processed successfully:', {
      payment_id: webhook.data.payment?.id,
      subscription_id: webhook.data.subscription.id,
      amount: webhook.data.payment?.amount,
      payment_date: webhook.data.payment?.payment_date,
      method: webhook.data.payment?.method
    })
    
  } catch (error) {
    console.error('Error handling payment success:', error)
    throw error
  }
}

async function handlePaymentFailed(webhook: WebhookEvent) {
  try {
    console.log('Processing payment failed:', webhook.data.payment?.id)
    
    // TODO: Notificar cliente sobre falha no pagamento
    // TODO: Suspender acesso se necessário (após tentativas)
    // TODO: Tentar cobrança novamente se configurado
    
    console.log('Payment failed:', {
      payment_id: webhook.data.payment?.id,
      subscription_id: webhook.data.subscription.id,
      amount: webhook.data.payment?.amount,
      status: webhook.data.payment?.status
    })
    
  } catch (error) {
    console.error('Error handling payment failed:', error)
    throw error
  }
}

async function handleSubscriptionCanceled(webhook: WebhookEvent) {
  try {
    console.log('Processing subscription canceled:', webhook.data.subscription.id)
    
    // TODO: Suspender acesso aos recursos
    // TODO: Atualizar status no banco de dados
    // TODO: Enviar email de cancelamento
    
    console.log('Subscription canceled:', {
      subscription_id: webhook.data.subscription.id,
      reference_id: webhook.reference_id,
      status: webhook.data.subscription.status
    })
    
  } catch (error) {
    console.error('Error handling subscription canceled:', error)
    throw error
  }
}

// GET endpoint para verificação de saúde do webhook
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'PagSeguro webhook endpoint is healthy',
    timestamp: new Date().toISOString()
  })
}