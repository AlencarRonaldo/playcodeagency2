import { NextRequest, NextResponse } from 'next/server'

// POST /api/payment/checkout-mock - Versão simulada para teste
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

    console.log('🎮 Checkout Mock - Dados recebidos:', { plan_id, customer: customer.email, payment_method })

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

    // Definir planos mock diretamente
    const mockPlans = {
      'starter-pack': {
        name: 'Starter Pack',
        setup_fee: 79700,
        monthly_price: 19700,
        annual_discount: 20
      },
      'pro-guild': {
        name: 'Pro Guild', 
        setup_fee: 249700,
        monthly_price: 49700,
        annual_discount: 25
      },
      'enterprise': {
        name: 'Enterprise',
        setup_fee: 999700,
        monthly_price: 199700,
        annual_discount: 30
      }
    }

    const gamePlan = mockPlans[plan_id as keyof typeof mockPlans]
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

    // Calcular preços mock
    const isAnnual = billing_cycle === 'annual'
    const pricing = {
      setup_fee: gamePlan.setup_fee,
      monthly_price: gamePlan.monthly_price,
      annual_price: isAnnual ? Math.round(gamePlan.monthly_price * 12 * (1 - gamePlan.annual_discount / 100)) : undefined
    }

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

    // Simular criação de checkout (MOCK)
    const mockSubscriptionId = `sub_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const mockReferenceId = `ref_${Date.now()}_${customer.email.split('@')[0]}`
    const mockCustomerId = `customer_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Dados do cliente formatados
    const formattedCustomer = {
      id: mockCustomerId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      document: customer.document.replace(/\D/g, '') // remover formatação
    }

    // Plano formatado
    const formattedPlan = {
      id: `plan_mock_${plan_id}_${billing_cycle}`,
      name: `${gamePlan.name} - ${isAnnual ? 'Anual' : 'Mensal'}`,
      billing_cycle,
      setup_fee: pricing.setup_fee,
      monthly_amount: isAnnual ? (pricing.annual_price ? pricing.annual_price / 12 : pricing.monthly_price) : pricing.monthly_price,
      trial_period_days: plan_id === 'starter-pack' ? 7 : undefined
    }

    // URL de checkout simulada
    const mockCheckoutUrl = `https://sandbox.pagseguro.uol.com.br/application/checkout.jhtml?code=${mockSubscriptionId}`

    console.log('✅ Checkout Mock criado:', {
      subscription_id: mockSubscriptionId,
      customer: formattedCustomer.email,
      plan: formattedPlan.name
    })

    // Retornar sucesso simulado
    return NextResponse.json({
      success: true,
      data: {
        subscription_id: mockSubscriptionId,
        checkout_url: mockCheckoutUrl,
        reference_id: mockReferenceId,
        status: 'PENDING',
        plan: formattedPlan,
        customer: formattedCustomer,
        mock: true // Identificar que é um teste
      },
      message: '🎮 Checkout MOCK criado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro na API de checkout mock:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'CHECKOUT_MOCK_ERROR',
        message: 'Erro interno no checkout de teste',
        details: [String(error)]
      }
    }, { status: 500 })
  }
}