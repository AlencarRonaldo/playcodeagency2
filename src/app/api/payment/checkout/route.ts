import { NextRequest, NextResponse } from 'next/server'
import { pagSeguroClient } from '@/lib/payments/pagseguro-client'
import { GAME_PLANS, calculatePlanPrice } from '@/lib/payments/plans-config'
import { PaymentCustomer, CreateSubscriptionRequest } from '@/lib/payments/types'

// POST /api/payment/checkout - Criar sessão de checkout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      plan_id, 
      customer, 
      payment_method, 
      billing_cycle = 'monthly',
      promo_code 
    } = body

    // Validar dados obrigatórios
    if (!plan_id || !customer || !payment_method) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Dados obrigatórios não fornecidos',
          details: ['plan_id, customer e payment_method são obrigatórios']
        }
      }, { status: 400 })
    }

    // Buscar plano
    const gamePlan = GAME_PLANS.find(p => p.id === plan_id)
    if (!gamePlan) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PLAN_NOT_FOUND',
          message: 'Plano não encontrado',
          details: [`Plano ${plan_id} não existe`]
        }
      }, { status: 404 })
    }

    // Calcular preços
    const isAnnual = billing_cycle === 'annual'
    const pricing = calculatePlanPrice(plan_id, isAnnual)

    // Validar dados do cliente
    const requiredCustomerFields = ['name', 'email', 'document', 'phone']
    const missingFields = requiredCustomerFields.filter(field => !customer[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CUSTOMER_DATA',
          message: 'Dados do cliente incompletos',
          details: [`Campos obrigatórios: ${missingFields.join(', ')}`]
        }
      }, { status: 400 })
    }

    // Formatar dados do cliente para PagSeguro
    const pagSeguroCustomer: PaymentCustomer = {
      id: `customer_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      document: customer.document.replace(/\D/g, ''), // remover formatação
      birth_date: customer.birth_date,
      address: customer.address || {
        street: 'Rua Principal',
        number: '123',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postal_code: '01000000',
        country: 'BRA' as const
      }
    }

    // Criar plano no PagSeguro (se necessário)
    const pagSeguroPlan = {
      id: `pagseguro_${plan_id}_${billing_cycle}`,
      name: `${gamePlan.name} - ${isAnnual ? 'Anual' : 'Mensal'}`,
      description: `${gamePlan.subtitle} - ${gamePlan.description}`,
      setup_fee: pricing.setup_fee,
      monthly_amount: isAnnual ? (pricing.annual_price! / 12) : pricing.monthly_price,
      currency: 'BRL' as const,
      interval: 'MONTHLY' as const,
      trial_period_days: gamePlan.id === 'starter-pack' ? 7 : undefined
    }

    // Criar assinatura
    const subscriptionRequest: CreateSubscriptionRequest = {
      reference_id: `subscription_${Date.now()}_${customer.email.split('@')[0]}`,
      plan: pagSeguroPlan,
      customer: pagSeguroCustomer,
      payment_method: {
        type: payment_method.type,
        ...(payment_method.type === 'CREDIT_CARD' && {
          credit_card: payment_method.credit_card
        })
      },
      pro_rata: false,
      webhook_urls: [`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pagseguro`]
    }

    const result = await pagSeguroClient.createSubscription(subscriptionRequest)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }

    // Salvar informações no banco de dados (se houver)
    // TODO: Implementar salvamento em BD

    return NextResponse.json({
      success: true,
      data: {
        subscription_id: result.data!.id,
        checkout_url: result.data!.checkout_url,
        reference_id: result.data!.reference_id,
        status: result.data!.status,
        plan: {
          id: plan_id,
          name: gamePlan.name,
          billing_cycle,
          setup_fee: pricing.setup_fee,
          monthly_amount: pagSeguroPlan.monthly_amount,
          trial_period_days: pagSeguroPlan.trial_period_days
        },
        customer: {
          id: pagSeguroCustomer.id,
          name: pagSeguroCustomer.name,
          email: pagSeguroCustomer.email
        }
      },
      message: 'Checkout criado com sucesso'
    })

  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'CHECKOUT_CREATION_ERROR',
        message: 'Erro interno ao criar checkout',
        details: [String(error)]
      }
    }, { status: 500 })
  }
}

// GET /api/payment/checkout - Listar checkouts do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customer_email')

    if (!customerEmail) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_CUSTOMER_EMAIL',
          message: 'Email do cliente é obrigatório',
          details: ['Parâmetro customer_email não fornecido']
        }
      }, { status: 400 })
    }

    // TODO: Buscar checkouts do banco de dados
    // Por enquanto, retornar lista vazia
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Lista de checkouts recuperada com sucesso'
    })

  } catch (error) {
    console.error('Error fetching checkouts:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'CHECKOUT_FETCH_ERROR',
        message: 'Erro ao buscar checkouts',
        details: [String(error)]
      }
    }, { status: 500 })
  }
}