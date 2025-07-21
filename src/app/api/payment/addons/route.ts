import { NextRequest, NextResponse } from 'next/server'
import { pagSeguroClient } from '@/lib/payments/pagseguro-client'

// Configuração dos power-ups com IDs únicos para PagSeguro
const POWER_UPS = [
  {
    id: 'chatbot-premium',
    name: 'Chatbot Premium',
    description: 'IA avançada com processamento de linguagem natural',
    price: 150000, // R$ 1.500,00 em centavos
    pagseguro_id: 'POWERUP_CHATBOT_PREMIUM'
  },
  {
    id: 'seo-boost',
    name: 'SEO Turbo Boost',
    description: 'Otimização avançada e campanha de conteúdo',
    price: 200000, // R$ 2.000,00 em centavos
    pagseguro_id: 'POWERUP_SEO_BOOST'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Aplicativo nativo para iOS e Android',
    price: 800000, // R$ 8.000,00 em centavos
    pagseguro_id: 'POWERUP_MOBILE_APP'
  },
  {
    id: 'priority-support',
    name: 'Suporte Prioritário',
    description: 'Atendimento VIP com resposta em 1 hora',
    price: 80000, // R$ 800,00 em centavos
    pagseguro_id: 'POWERUP_PRIORITY_SUPPORT'
  },
  {
    id: 'advanced-analytics',
    name: 'Analytics Pro',
    description: 'Dashboards personalizados e relatórios avançados',
    price: 120000, // R$ 1.200,00 em centavos
    pagseguro_id: 'POWERUP_ANALYTICS_PRO'
  }
]

// GET /api/payment/addons - Listar power-ups com links de pagamento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const addonId = searchParams.get('id')

    // Se foi solicitado um addon específico
    if (addonId) {
      const addon = POWER_UPS.find(p => p.id === addonId)
      if (!addon) {
        return NextResponse.json({
          success: false,
          error: 'Power-up não encontrado'
        }, { status: 404 })
      }

      const paymentLink = await generatePaymentLink(addon)
      
      return NextResponse.json({
        success: true,
        data: {
          ...addon,
          payment_link: paymentLink
        }
      })
    }

    // Listar todos os power-ups
    const addonsWithLinks = await Promise.all(
      POWER_UPS.map(async (addon) => ({
        ...addon,
        price_formatted: formatPrice(addon.price),
        payment_link: await generatePaymentLink(addon)
      }))
    )

    return NextResponse.json({
      success: true,
      data: addonsWithLinks
    })
  } catch (error) {
    console.error('Error fetching addons:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar power-ups'
    }, { status: 500 })
  }
}

// POST /api/payment/addons/create-link - Criar link específico para power-up
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { addon_id, customer_info } = body

    const addon = POWER_UPS.find(p => p.id === addon_id)
    if (!addon) {
      return NextResponse.json({
        success: false,
        error: 'Power-up não encontrado'
      }, { status: 404 })
    }

    // Criar pagamento único no PagSeguro
    const paymentData = {
      reference_id: `POWERUP_${addon.id.toUpperCase()}_${Date.now()}`,
      description: `${addon.name} - ${addon.description}`,
      amount: {
        value: addon.price, // valor em centavos
        currency: 'BRL'
      },
      payment_methods: [
        {
          type: 'CREDIT_CARD',
          brands: ['mastercard', 'visa', 'elo', 'hipercard']
        },
        {
          type: 'BOLETO'
        },
        {
          type: 'PIX'
        }
      ],
      notification_urls: [
        `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/pagseguro`
      ],
      expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      ...(customer_info && {
        customer: customer_info
      })
    }

    // Since we don't have a specific createPaymentOrder method, we'll create a checkout session
    // For now, let's return a mock response until the proper method is implemented
    const result = {
      success: true,
      data: {
        id: `addon_order_${Date.now()}`,
        status: 'PENDING',
        reference_id: `addon_${addon.id}_${Date.now()}`,
        amount: {
          value: addon.price,
          currency: 'BRL'
        },
        checkout_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/addon/${addon.id}`,
        created_at: new Date().toISOString(),
        links: [
          { rel: 'APPROVE', href: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/addon/${addon.id}` }
        ],
        qr_codes: [
          { text: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/addon/${addon.id}` }
        ]
      },
      error: null
    }

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar link de pagamento',
        details: result.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        addon,
        payment_order: result.data,
        payment_link: result.data?.links?.find((link: any) => link.rel === 'APPROVE')?.href,
        qr_code: result.data?.qr_codes?.[0]
      }
    })
  } catch (error) {
    console.error('Error creating payment link:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// Função auxiliar para gerar link de pagamento
async function generatePaymentLink(addon: typeof POWER_UPS[0]): Promise<string> {
  try {
    // Para desenvolvimento, retorna link de demonstração
    if (process.env.NODE_ENV === 'development') {
      return `https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=DEMO_${addon.pagseguro_id}`
    }

    // Criar ordem de pagamento temporária no PagSeguro
    const paymentData = {
      reference_id: `TEMP_${addon.pagseguro_id}_${Date.now()}`,
      description: `${addon.name} - Power-up PlayCode Agency`,
      amount: {
        value: addon.price,
        currency: 'BRL'
      },
      payment_methods: ['CREDIT_CARD', 'BOLETO', 'PIX'],
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Mock payment order creation until proper method is implemented
    const result = {
      success: true,
      data: {
        links: [
          { rel: 'APPROVE', href: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/addon/${addon.id}` }
        ]
      }
    }
    
    if (result.success && result.data?.links) {
      const approveLink = result.data.links.find((link: any) => link.rel === 'APPROVE')
      return approveLink?.href || '#'
    }

    return '#'
  } catch (error) {
    console.error('Error generating payment link:', error)
    return '#'
  }
}

// Função auxiliar para formatar preços
function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}