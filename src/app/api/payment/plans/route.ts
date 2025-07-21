import { NextRequest, NextResponse } from 'next/server'
import { pagSeguroClient } from '@/lib/payments/pagseguro-client'
import { GAME_PLANS, PAGSEGURO_PLANS, calculatePlanPrice, formatPrice } from '@/lib/payments/plans-config'

// GET /api/payment/plans - Listar todos os planos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includePaymentInfo = searchParams.get('include_payment') === 'true'

    const plans = GAME_PLANS.map(plan => {
      const pricing = calculatePlanPrice(plan.id, false)
      const annualPricing = calculatePlanPrice(plan.id, true)

      return {
        ...plan,
        pricing: {
          setup_fee: pricing.setup_fee,
          setup_fee_formatted: formatPrice(pricing.setup_fee),
          monthly_price: pricing.monthly_price,
          monthly_price_formatted: formatPrice(pricing.monthly_price),
          annual_price: annualPricing.annual_price,
          annual_price_formatted: annualPricing.annual_price ? formatPrice(annualPricing.annual_price) : null,
          annual_savings: annualPricing.savings,
          annual_savings_formatted: annualPricing.savings ? formatPrice(annualPricing.savings) : null,
          annual_discount_percent: plan.annual_discount
        },
        ...(includePaymentInfo && {
          pagseguro_plan: PAGSEGURO_PLANS.find(p => p.id === `pagseguro_${plan.id}`)
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'PLANS_FETCH_ERROR',
        message: 'Erro ao buscar planos',
        details: [String(error)]
      }
    }, { status: 500 })
  }
}

// POST /api/payment/plans/create - Criar planos no PagSeguro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan_ids } = body

    if (!plan_ids || !Array.isArray(plan_ids)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PLAN_IDS',
          message: 'IDs de planos inválidos',
          details: ['plan_ids deve ser um array']
        }
      }, { status: 400 })
    }

    const results = []

    for (const planId of plan_ids) {
      const pagSeguroPlan = PAGSEGURO_PLANS.find(p => p.id === `pagseguro_${planId}`)
      
      if (!pagSeguroPlan) {
        results.push({
          plan_id: planId,
          success: false,
          error: 'Plano não encontrado'
        })
        continue
      }

      const result = await pagSeguroClient.createPlan(pagSeguroPlan)
      
      results.push({
        plan_id: planId,
        success: result.success,
        data: result.data,
        error: result.error?.message
      })
    }

    const allSuccessful = results.every(r => r.success)

    return NextResponse.json({
      success: allSuccessful,
      data: results,
      message: allSuccessful 
        ? 'Todos os planos criados com sucesso'
        : 'Alguns planos falharam ao ser criados'
    }, { 
      status: allSuccessful ? 200 : 207 // 207 Multi-Status para sucesso parcial
    })
  } catch (error) {
    console.error('Error creating plans:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'PLAN_CREATION_ERROR',
        message: 'Erro ao criar planos no PagSeguro',
        details: [String(error)]
      }
    }, { status: 500 })
  }
}