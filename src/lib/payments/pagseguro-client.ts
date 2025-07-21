'use client'

import { 
  PaymentPlan, 
  PaymentCustomer, 
  CreateSubscriptionRequest, 
  CreateSubscriptionResponse,
  PagSeguroConfig,
  PaymentResponse,
  CheckoutSession
} from './types'

class PagSeguroClient {
  private config: PagSeguroConfig
  private baseUrl: string

  constructor() {
    this.config = {
      application_id: process.env.NEXT_PUBLIC_PAGSEGURO_APPLICATION_ID!,
      application_key: process.env.PAGSEGURO_APPLICATION_KEY!,
      public_key: process.env.NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY!,
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pagseguro`
    }

    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api.pagseguro.com'
      : 'https://sandbox.api.pagseguro.com'
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.application_key}`,
      'Accept': 'application/json'
    }
  }

  // Criar plano de assinatura
  async createPlan(plan: PaymentPlan): Promise<PaymentResponse<PaymentPlan>> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments/plans`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reference_id: plan.id,
          name: plan.name,
          description: plan.description,
          amount: {
            value: plan.monthly_amount,
            currency: plan.currency
          },
          interval: {
            length: 1,
            unit: plan.interval
          },
          setup_fee: plan.setup_fee ? {
            value: plan.setup_fee,
            currency: plan.currency
          } : undefined,
          trial: plan.trial_period_days ? {
            enabled: true,
            hold_setup_fee: false,
            days: plan.trial_period_days
          } : undefined,
          payment_methods: [
            { type: 'CREDIT_CARD', brands: ['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD'] },
            { type: 'BOLETO' },
            { type: 'PIX' }
          ]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error_messages?.[0]?.code || 'PLAN_CREATION_FAILED',
            message: data.error_messages?.[0]?.description || 'Erro ao criar plano',
            details: data.error_messages?.map((err: any) => err.description)
          }
        }
      }

      return {
        success: true,
        data: {
          ...plan,
          id: data.id
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com PagSeguro',
          details: [String(error)]
        }
      }
    }
  }

  // Criar assinatura
  async createSubscription(request: CreateSubscriptionRequest): Promise<PaymentResponse<CreateSubscriptionResponse>> {
    try {
      const payload = {
        reference_id: request.reference_id,
        plan_id: request.plan.id,
        customer: {
          name: request.customer.name,
          email: request.customer.email,
          tax_id: request.customer.document,
          phone: request.customer.phone,
          address: request.customer.address
        },
        payment_method: {
          type: request.payment_method.type,
          ...(request.payment_method.credit_card && {
            card: {
              token: request.payment_method.credit_card.token,
              holder_name: request.payment_method.credit_card.holder_name
            }
          })
        },
        pro_rata: request.pro_rata || false,
        webhook_urls: request.webhook_urls || [this.config.webhook_url]
      }

      const response = await fetch(`${this.baseUrl}/recurring-payments/subscriptions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error_messages?.[0]?.code || 'SUBSCRIPTION_CREATION_FAILED',
            message: data.error_messages?.[0]?.description || 'Erro ao criar assinatura',
            details: data.error_messages?.map((err: any) => err.description)
          }
        }
      }

      return {
        success: true,
        data: {
          id: data.id,
          reference_id: data.reference_id,
          status: data.status,
          plan: request.plan,
          customer: request.customer,
          payment_method: request.payment_method,
          links: data.links || [],
          checkout_url: data.links?.find((link: any) => link.rel === 'CHECKOUT')?.href
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com PagSeguro',
          details: [String(error)]
        }
      }
    }
  }

  // Criar sessão de checkout para pagamento direto
  async createCheckoutSession(planId: string, customerEmail: string): Promise<PaymentResponse<CheckoutSession>> {
    try {
      const sessionId = `checkout_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      const response = await fetch(`${this.baseUrl}/checkouts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          reference_id: sessionId,
          customer_email: customerEmail,
          items: [
            {
              reference_id: planId,
              name: `Plano PlayCode Agency - ${planId}`,
              quantity: 1,
              unit_amount: 0 // será definido baseado no plano
            }
          ],
          payment_methods: [
            {
              type: 'CREDIT_CARD',
              brands: ['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'HIPERCARD']
            },
            {
              type: 'BOLETO'
            },
            {
              type: 'PIX'
            }
          ],
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          notification_urls: [this.config.webhook_url]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error_messages?.[0]?.code || 'CHECKOUT_CREATION_FAILED',
            message: data.error_messages?.[0]?.description || 'Erro ao criar checkout',
            details: data.error_messages?.map((err: any) => err.description)
          }
        }
      }

      const checkoutSession: CheckoutSession = {
        id: data.id || sessionId,
        customer_email: customerEmail,
        plan_id: planId,
        setup_fee: 0,
        monthly_amount: 0,
        payment_method: 'CREDIT_CARD',
        status: 'pending',
        checkout_url: data.links?.find((link: any) => link.rel === 'PAY')?.href,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
      }

      return {
        success: true,
        data: checkoutSession
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com PagSeguro',
          details: [String(error)]
        }
      }
    }
  }

  // Cancelar assinatura
  async cancelSubscription(subscriptionId: string): Promise<PaymentResponse<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          cancel_reason: 'CUSTOMER_REQUEST'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        return {
          success: false,
          error: {
            code: data.error_messages?.[0]?.code || 'CANCEL_FAILED',
            message: data.error_messages?.[0]?.description || 'Erro ao cancelar assinatura',
            details: data.error_messages?.map((err: any) => err.description)
          }
        }
      }

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com PagSeguro',
          details: [String(error)]
        }
      }
    }
  }

  // Buscar informações da assinatura
  async getSubscription(subscriptionId: string): Promise<PaymentResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/recurring-payments/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error_messages?.[0]?.code || 'SUBSCRIPTION_NOT_FOUND',
            message: data.error_messages?.[0]?.description || 'Assinatura não encontrada',
            details: data.error_messages?.map((err: any) => err.description)
          }
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Erro de conexão com PagSeguro',
          details: [String(error)]
        }
      }
    }
  }

  // Gerar token de cartão (lado cliente)
  async generateCardToken(cardData: {
    number: string
    exp_month: string
    exp_year: string
    security_code: string
    holder_name: string
  }): Promise<PaymentResponse<{ token: string }>> {
    try {
      // Este método deve ser executado no frontend usando a biblioteca JS do PagSeguro
      // Por agora, retornamos um mock para desenvolvimento
      if (this.config.environment === 'sandbox') {
        return {
          success: true,
          data: {
            token: `mock_token_${Date.now()}`
          }
        }
      }

      // Em produção, usar PagSeguro.js no frontend
      throw new Error('Use PagSeguro.js no frontend para gerar tokens de cartão')
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TOKEN_GENERATION_FAILED',
          message: 'Erro ao gerar token do cartão',
          details: [String(error)]
        }
      }
    }
  }
}

export const pagSeguroClient = new PagSeguroClient()
export default PagSeguroClient