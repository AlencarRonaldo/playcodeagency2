'use client'

import { GamePlan, PaymentPlan } from './types'

// Configuração dos planos de assinatura da PlayCode Agency
export const GAME_PLANS: GamePlan[] = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    subtitle: 'ACELERE SUA ENTRADA',
    description: 'Perfeito para startups e pequenos negócios que querem resultados rápidos',
    rarity: 'rare',
    popular: false,
    enterprise: false,
    setup_fee: 79700, // R$ 797,00 em centavos
    monthly_price: 19700, // R$ 197,00 em centavos
    annual_discount: 20, // 20% desconto anual
    max_projects: 3,
    support_level: 'basic',
    sla_uptime: '99.0%',
    custom_addons: false,
    features: [
      { id: 'websites', name: 'Landing Pages & Sites', included: true, limit: 3 },
      { id: 'hosting', name: 'Hospedagem Profissional', included: true },
      { id: 'ssl', name: 'Certificado SSL', included: true },
      { id: 'analytics', name: 'Analytics Básico', included: true },
      { id: 'support', name: 'Suporte por Email', included: true },
      { id: 'updates', name: 'Atualizações Mensais', included: true },
      { id: 'seo', name: 'SEO Básico', included: true },
      { id: 'forms', name: 'Formulários de Contato', included: true },
      { id: 'mobile', name: 'Design Responsivo', included: true },
      { id: 'backup', name: 'Backup Semanal', included: true },
      
      // Recursos não incluídos
      { id: 'ecommerce', name: 'E-commerce Avançado', included: false },
      { id: 'api', name: 'APIs Customizadas', included: false },
      { id: 'integrations', name: 'Integrações Premium', included: false },
      { id: 'priority_support', name: 'Suporte Prioritário', included: false },
      { id: 'custom_dev', name: 'Desenvolvimento Custom', included: false }
    ]
  },
  {
    id: 'business-one',
    name: 'Business One',
    subtitle: 'EVOLUÇÃO INTELIGENTE',
    description: 'Para pequenas empresas que buscam crescimento sustentável com recursos premium',
    rarity: 'rare',
    popular: false,
    enterprise: false,
    setup_fee: 149700, // R$ 1.497,00 em centavos
    monthly_price: 39700, // R$ 397,00 em centavos
    annual_discount: 22, // 22% desconto anual
    max_projects: 5,
    support_level: 'priority',
    sla_uptime: '99.2%',
    custom_addons: true,
    features: [
      { id: 'websites', name: 'Website Profissional', included: true, limit: 5 },
      { id: 'hosting', name: 'Hospedagem Premium', included: true },
      { id: 'ssl', name: 'Certificado SSL', included: true },
      { id: 'analytics', name: 'Analytics Avançado', included: true },
      { id: 'support', name: 'Suporte Profissional', included: true },
      { id: 'updates', name: 'Atualizações Semanais', included: true },
      { id: 'seo', name: 'SEO Otimizado', included: true },
      { id: 'forms', name: 'Formulários Avançados', included: true },
      { id: 'mobile', name: 'Design Responsivo', included: true },
      { id: 'backup', name: 'Backup Automático', included: true },
      { id: 'social', name: 'Integração Redes Sociais', included: true },
      { id: 'chat', name: 'Suporte Chat Online', included: true },
      
      // Recursos não incluídos
      { id: 'ecommerce', name: 'E-commerce Básico', included: false },
      { id: 'api', name: 'APIs Customizadas', included: false },
      { id: 'integrations', name: 'Integrações Premium', included: false },
      { id: 'priority_support', name: 'Suporte Prioritário', included: false },
      { id: 'custom_dev', name: 'Desenvolvimento Custom', included: false }
    ]
  },
  {
    id: 'pro-guild',
    name: 'Pro Guild',
    subtitle: 'MÁXIMA PERFORMANCE',
    description: 'Para empresas que exigem soluções robustas e performance superior',
    rarity: 'epic',
    popular: true,
    enterprise: false,
    setup_fee: 249700, // R$ 2.497,00 em centavos
    monthly_price: 49700, // R$ 497,00 em centavos
    annual_discount: 25, // 25% desconto anual
    max_projects: 10,
    support_level: 'priority',
    sla_uptime: '99.5%',
    custom_addons: true,
    features: [
      // Tudo do Starter Pack
      { id: 'websites', name: 'Landing Pages & Sites', included: true, limit: 10 },
      { id: 'hosting', name: 'Hospedagem Profissional', included: true },
      { id: 'ssl', name: 'Certificado SSL', included: true },
      { id: 'analytics', name: 'Analytics Avançado', included: true },
      { id: 'support', name: 'Suporte Prioritário 24/7', included: true },
      { id: 'updates', name: 'Atualizações Semanais', included: true },
      { id: 'seo', name: 'SEO Avançado', included: true },
      { id: 'forms', name: 'Formulários Avançados', included: true },
      { id: 'mobile', name: 'Design Responsivo', included: true },
      { id: 'backup', name: 'Backup Diário', included: true },
      
      // Recursos Premium
      { id: 'ecommerce', name: 'E-commerce Completo', included: true },
      { id: 'api', name: 'APIs Customizadas', included: true, limit: 5 },
      { id: 'integrations', name: 'Integrações Premium', included: true },
      { id: 'priority_support', name: 'Suporte Prioritário', included: true },
      { id: 'custom_dev', name: '20h Dev Custom/mês', included: true, limit: 20 },
      { id: 'performance', name: 'Otimização Performance', included: true },
      { id: 'security', name: 'Segurança Avançada', included: true },
      { id: 'monitoring', name: 'Monitoramento 24/7', included: true },
      
      // Recursos não incluídos
      { id: 'enterprise_support', name: 'Suporte Dedicado', included: false },
      { id: 'unlimited_dev', name: 'Dev Ilimitado', included: false }
    ]
  },
  {
    id: 'enterprise-legend',
    name: 'Enterprise Legend',
    subtitle: 'SOLUÇÃO COMPLETA',
    description: 'Poder máximo para grandes corporações e projetos ambiciosos',
    rarity: 'legendary',
    popular: false,
    enterprise: true,
    setup_fee: 999700, // R$ 9.997,00 em centavos
    monthly_price: 199700, // R$ 1.997,00 em centavos
    annual_discount: 30, // 30% desconto anual
    max_projects: -1, // ilimitado
    support_level: 'dedicated',
    sla_uptime: '99.9%',
    custom_addons: true,
    features: [
      // Tudo dos planos anteriores
      { id: 'websites', name: 'Projetos Ilimitados', included: true, limit: -1 },
      { id: 'hosting', name: 'Infraestrutura Enterprise', included: true },
      { id: 'ssl', name: 'Certificados SSL Enterprise', included: true },
      { id: 'analytics', name: 'Analytics Enterprise', included: true },
      { id: 'support', name: 'Suporte Dedicado 24/7', included: true },
      { id: 'updates', name: 'Updates em Tempo Real', included: true },
      { id: 'seo', name: 'SEO Enterprise', included: true },
      { id: 'forms', name: 'Formulários Enterprise', included: true },
      { id: 'mobile', name: 'Apps Mobile Nativos', included: true },
      { id: 'backup', name: 'Backup em Tempo Real', included: true },
      { id: 'ecommerce', name: 'E-commerce Enterprise', included: true },
      { id: 'api', name: 'APIs Ilimitadas', included: true },
      { id: 'integrations', name: 'Integrações Ilimitadas', included: true },
      { id: 'priority_support', name: 'Gerente Dedicado', included: true },
      { id: 'custom_dev', name: 'Desenvolvimento Ilimitado', included: true },
      { id: 'performance', name: 'Performance Máxima', included: true },
      { id: 'security', name: 'Segurança Militar', included: true },
      { id: 'monitoring', name: 'Monitoramento Avançado', included: true },
      { id: 'enterprise_support', name: 'Suporte Dedicado', included: true },
      { id: 'unlimited_dev', name: 'Dev Team Dedicado', included: true },
      { id: 'consulting', name: 'Consultoria Estratégica', included: true },
      { id: 'white_label', name: 'Solução White Label', included: true },
      { id: 'compliance', name: 'Compliance Corporativo', included: true }
    ]
  }
]

// Converter planos para formato PagSeguro
export const convertToPagSeguroPlan = (gamePlan: GamePlan): PaymentPlan => {
  return {
    id: `pagseguro_${gamePlan.id}`,
    name: gamePlan.name,
    description: `${gamePlan.subtitle} - ${gamePlan.description}`,
    setup_fee: gamePlan.setup_fee,
    monthly_amount: gamePlan.monthly_price,
    currency: 'BRL',
    interval: 'MONTHLY',
    trial_period_days: gamePlan.id === 'starter-pack' ? 7 : undefined, // 7 dias grátis para Starter
    max_cycles: undefined // assinatura indefinida
  }
}

// Planos em formato PagSeguro
export const PAGSEGURO_PLANS: PaymentPlan[] = GAME_PLANS.map(convertToPagSeguroPlan)

// Configurações de desconto
export const DISCOUNT_CONFIG = {
  annual: {
    starter: 20, // 20% desconto
    business: 22, // 22% desconto
    pro: 25,     // 25% desconto  
    enterprise: 30 // 30% desconto
  },
  promotional: {
    black_friday: 40, // 40% desconto
    new_year: 30,     // 30% desconto
    easter: 20        // 20% desconto
  }
}

// Power-ups e add-ons disponíveis
export const ADDONS = [
  {
    id: 'extra-projects',
    name: 'Projetos Extras',
    description: '+5 projetos adicionais',
    price: 9700, // R$ 97,00
    available_for: ['starter-pack', 'business-one', 'pro-guild']
  },
  {
    id: 'priority-support',
    name: 'Suporte Prioritário',
    description: 'Atendimento prioritário 24/7',
    price: 19700, // R$ 197,00
    available_for: ['starter-pack', 'business-one']
  },
  {
    id: 'custom-development',
    name: 'Desenvolvimento Extra',
    description: '+10 horas de desenvolvimento',
    price: 79700, // R$ 797,00
    available_for: ['starter-pack', 'business-one', 'pro-guild']
  },
  {
    id: 'ai-integration',
    name: 'Integração IA',
    description: 'ChatGPT e ferramentas de IA',
    price: 29700, // R$ 297,00
    available_for: ['business-one', 'pro-guild', 'enterprise-legend']
  },
  {
    id: 'mobile-app',
    name: 'App Mobile',
    description: 'Aplicativo nativo iOS/Android',
    price: 199700, // R$ 1.997,00
    available_for: ['business-one', 'pro-guild', 'enterprise-legend']
  }
]

// Utilitário para calcular preços
export const calculatePlanPrice = (planId: string, isAnnual: boolean = false): {
  setup_fee: number
  monthly_price: number
  annual_price?: number
  savings?: number
} => {
  const plan = GAME_PLANS.find(p => p.id === planId)
  if (!plan) throw new Error(`Plano ${planId} não encontrado`)

  const monthlyPrice = plan.monthly_price
  
  if (!isAnnual) {
    return {
      setup_fee: plan.setup_fee,
      monthly_price: monthlyPrice
    }
  }

  const discountPercent = plan.annual_discount
  const annualPriceWithoutDiscount = monthlyPrice * 12
  const annualPrice = Math.round(annualPriceWithoutDiscount * (1 - discountPercent / 100))
  const savings = annualPriceWithoutDiscount - annualPrice

  return {
    setup_fee: plan.setup_fee,
    monthly_price: monthlyPrice,
    annual_price: annualPrice,
    savings
  }
}

// Utilitário para formatar preços
export const formatPrice = (priceInCents: number): string => {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export default GAME_PLANS