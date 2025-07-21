'use client'

// PagSeguro Payment Integration Types

export interface PaymentPlan {
  id: string
  name: string
  description: string
  setup_fee: number // valor em centavos
  monthly_amount: number // valor em centavos  
  currency: 'BRL'
  interval: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
  trial_period_days?: number
  max_cycles?: number // indefinido se null
}

export interface PaymentCustomer {
  id: string
  name: string
  email: string
  phone: string
  document: string // CPF/CNPJ
  birth_date?: string
  address: {
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    postal_code: string
    country: 'BRA'
  }
}

export interface PaymentSubscription {
  id: string
  reference_id: string
  plan_id: string
  customer_id: string
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED' | 'TRIALING' | 'PAST_DUE'
  payment_method: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  created_at: string
  updated_at: string
  next_payment_date: string
  amount: number
  setup_fee?: number
  trial_end?: string
}

export interface PaymentMethod {
  type: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  credit_card?: {
    token: string
    holder_name: string
    brand: string
    last_four_digits: string
    exp_month: string
    exp_year: string
  }
}

export interface PagSeguroConfig {
  application_id: string
  application_key: string
  public_key: string
  environment: 'sandbox' | 'production'
  webhook_url: string
}

export interface CreateSubscriptionRequest {
  reference_id: string
  plan: PaymentPlan
  customer: PaymentCustomer
  payment_method: PaymentMethod
  pro_rata?: boolean
  webhook_urls?: string[]
}

export interface CreateSubscriptionResponse {
  id: string
  reference_id: string
  status: string
  plan: PaymentPlan
  customer: PaymentCustomer
  payment_method: PaymentMethod
  links: {
    rel: string
    href: string
    method: string
  }[]
  checkout_url?: string
}

export interface WebhookEvent {
  id: string
  reference_id: string
  event_type: 'SUBSCRIPTION_CREATED' | 'SUBSCRIPTION_ACTIVATED' | 'SUBSCRIPTION_PAYMENT_SUCCESS' | 'SUBSCRIPTION_PAYMENT_FAILED' | 'SUBSCRIPTION_CANCELED'
  data: {
    subscription: PaymentSubscription
    payment?: {
      id: string
      amount: number
      status: string
      payment_date: string
      method: string
    }
  }
  created_at: string
}

export interface PlanFeature {
  id: string
  name: string
  included: boolean
  limit?: number
  description?: string
}

export interface GamePlan {
  id: string
  name: string
  subtitle: string
  description: string
  rarity: 'rare' | 'epic' | 'legendary'
  popular: boolean
  enterprise: boolean
  setup_fee: number // em centavos
  monthly_price: number // em centavos
  annual_discount: number // percentual
  features: PlanFeature[]
  max_projects: number
  support_level: 'basic' | 'priority' | 'dedicated'
  sla_uptime: string
  custom_addons: boolean
  pagseguro_plan_id?: string
}

export interface CheckoutSession {
  id: string
  customer_email: string
  plan_id: string
  setup_fee: number
  monthly_amount: number
  payment_method: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  checkout_url?: string
  subscription_id?: string
  created_at: string
  expires_at: string
}

export interface PaymentError {
  code: string
  message: string
  details?: string[]
  parameter?: string
}

export interface PaymentResponse<T = any> {
  success: boolean
  data?: T
  error?: PaymentError
}