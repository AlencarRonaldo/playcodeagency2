'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'
import { GamePlan, PaymentMethod } from '@/lib/payments/types'
import { calculatePlanPrice, formatPrice } from '@/lib/payments/plans-config'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan: GamePlan
  billingCycle?: 'monthly' | 'annual'
}

interface CustomerData {
  name: string
  email: string
  phone: string
  document: string
  birth_date?: string
  address?: {
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    postal_code: string
  }
}

interface PaymentFormData {
  customer: CustomerData
  payment_method: {
    type: 'CREDIT_CARD' | 'BOLETO' | 'PIX'
    credit_card?: {
      number: string
      holder_name: string
      exp_month: string
      exp_year: string
      security_code: string
    }
  }
  accept_terms: boolean
}

export default function CheckoutModal({ isOpen, onClose, plan, billingCycle = 'monthly' }: CheckoutModalProps) {
  const [step, setStep] = useState<'customer' | 'payment' | 'review' | 'processing' | 'success' | 'error'>('customer')
  const [formData, setFormData] = useState<PaymentFormData>({
    customer: {
      name: '',
      email: '',
      phone: '',
      document: ''
    },
    payment_method: {
      type: 'CREDIT_CARD'
    },
    accept_terms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [checkoutUrl, setCheckoutUrl] = useState<string>('')
  const [subscriptionId, setSubscriptionId] = useState<string>('')

  const pricing = calculatePlanPrice(plan.id, billingCycle === 'annual')
  const isAnnual = billingCycle === 'annual'

  useEffect(() => {
    if (isOpen) {
      setStep('customer')
      setErrors({})
      audioHelpers.playNotification()
      trackingHelpers.trackClick(`checkout_open_${plan.id}`)
    }
  }, [isOpen, plan.id])

  const handleClose = () => {
    audioHelpers.playClick()
    onClose()
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }
      
      const newData = { ...prev }
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      
      return newData
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCustomerData = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = 'Nome é obrigatório'
    }

    if (!formData.customer.email.trim()) {
      newErrors['customer.email'] = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors['customer.email'] = 'Email inválido'
    }

    if (!formData.customer.phone.trim()) {
      newErrors['customer.phone'] = 'Telefone é obrigatório'
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.customer.phone)) {
      newErrors['customer.phone'] = 'Formato: (11) 99999-9999'
    }

    if (!formData.customer.document.trim()) {
      newErrors['customer.document'] = 'CPF/CNPJ é obrigatório'
    } else {
      const doc = formData.customer.document.replace(/\D/g, '')
      if (doc.length !== 11 && doc.length !== 14) {
        newErrors['customer.document'] = 'CPF (11 dígitos) ou CNPJ (14 dígitos)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentData = (): boolean => {
    if (formData.payment_method.type === 'CREDIT_CARD') {
      const newErrors: Record<string, string> = {}

      if (!formData.payment_method.credit_card?.number?.replace(/\s/g, '')) {
        newErrors['payment_method.credit_card.number'] = 'Número do cartão é obrigatório'
      }

      if (!formData.payment_method.credit_card?.holder_name?.trim()) {
        newErrors['payment_method.credit_card.holder_name'] = 'Nome no cartão é obrigatório'
      }

      if (!formData.payment_method.credit_card?.exp_month) {
        newErrors['payment_method.credit_card.exp_month'] = 'Mês de vencimento é obrigatório'
      }

      if (!formData.payment_method.credit_card?.exp_year) {
        newErrors['payment_method.credit_card.exp_year'] = 'Ano de vencimento é obrigatório'
      }

      if (!formData.payment_method.credit_card?.security_code) {
        newErrors['payment_method.credit_card.security_code'] = 'CVV é obrigatório'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    return true
  }

  const handleNextStep = async () => {
    audioHelpers.playClick(false)

    if (step === 'customer') {
      if (validateCustomerData()) {
        setStep('payment')
      }
    } else if (step === 'payment') {
      if (validatePaymentData()) {
        setStep('review')
      }
    } else if (step === 'review') {
      if (!formData.accept_terms) {
        setErrors({ accept_terms: 'Você deve aceitar os termos de uso' })
        return
      }
      await processPayment()
    }
  }

  const processPayment = async () => {
    setStep('processing')
    audioHelpers.playClick(true)

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_id: plan.id,
          customer: formData.customer,
          payment_method: formData.payment_method,
          billing_cycle: billingCycle
        })
      })

      const result = await response.json()

      if (result.success) {
        setCheckoutUrl(result.data.checkout_url)
        setSubscriptionId(result.data.subscription_id)
        setStep('success')
        audioHelpers.playAchievementUnlocked('epic')
        trackingHelpers.trackPurchase({
          plan_id: plan.id,
          amount: pricing.monthly_price,
          currency: 'BRL',
          billing_cycle: billingCycle
        })
      } else {
        console.error('Checkout error:', result.error)
        setStep('error')
        audioHelpers.playError()
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      setStep('error')
      audioHelpers.playError()
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-controller-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="gaming-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-led-white/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  plan.rarity === 'rare' ? 'from-electric-blue/20 to-electric-blue/10 border-electric-blue/60' :
                  plan.rarity === 'epic' ? 'from-gaming-purple/25 to-gaming-purple/10 border-gaming-purple/70' :
                  'from-plasma-yellow/30 to-plasma-yellow/10 border-plasma-yellow/80'
                } rounded-lg border flex items-center justify-center`}>
                  <CreditCard className={`w-6 h-6 ${
                    plan.rarity === 'rare' ? 'text-electric-blue' :
                    plan.rarity === 'epic' ? 'text-gaming-purple' : 'text-plasma-yellow'
                  }`} />
                </div>
                <div>
                  <h2 className="gaming-title text-xl font-bold text-neon-cyan">
                    Checkout - {plan.name}
                  </h2>
                  <p className="text-sm text-led-white/70">
                    Plano {isAnnual ? 'Anual' : 'Mensal'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-led-white/60 hover:text-neon-cyan transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 border-b border-led-white/20">
              <div className="flex items-center gap-2 mb-2">
                {['customer', 'payment', 'review'].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === stepName || (['processing', 'success', 'error'].includes(step) && index < 3)
                        ? 'bg-neon-cyan text-controller-black'
                        : step === 'customer' && index === 0 ? 'bg-neon-cyan text-controller-black'
                        : step === 'payment' && index <= 1 ? 'bg-neon-cyan text-controller-black'
                        : 'bg-led-white/20 text-led-white/60'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className={`w-12 h-0.5 mx-2 ${
                        (step === 'payment' && index === 0) || 
                        (step === 'review' && index <= 1) ||
                        (['processing', 'success', 'error'].includes(step) && index < 2)
                          ? 'bg-neon-cyan' : 'bg-led-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs text-led-white/60 uppercase tracking-wide">
                {step === 'customer' && 'Dados Pessoais'}
                {step === 'payment' && 'Forma de Pagamento'}
                {step === 'review' && 'Revisão e Confirmação'}
                {step === 'processing' && 'Processando Pagamento...'}
                {step === 'success' && 'Pagamento Concluído!'}
                {step === 'error' && 'Erro no Pagamento'}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Customer Data Step */}
              {step === 'customer' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-4">
                      Dados Pessoais
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="hud-element">
                        <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                          <User size={14} className="inline mr-1" />
                          NOME COMPLETO *
                        </label>
                        <input
                          type="text"
                          value={formData.customer.name}
                          onChange={(e) => updateFormData('customer.name', e.target.value)}
                          className={`gaming-input ${errors['customer.name'] ? 'border-red-500' : ''}`}
                          placeholder="Seu nome completo"
                          onFocus={audioHelpers.playHover}
                        />
                        {errors['customer.name'] && (
                          <span className="text-red-400 text-xs mt-1 block">{errors['customer.name']}</span>
                        )}
                      </div>

                      <div className="hud-element">
                        <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                          <Mail size={14} className="inline mr-1" />
                          EMAIL *
                        </label>
                        <input
                          type="email"
                          value={formData.customer.email}
                          onChange={(e) => updateFormData('customer.email', e.target.value)}
                          className={`gaming-input ${errors['customer.email'] ? 'border-red-500' : ''}`}
                          placeholder="seu@email.com"
                          onFocus={audioHelpers.playHover}
                        />
                        {errors['customer.email'] && (
                          <span className="text-red-400 text-xs mt-1 block">{errors['customer.email']}</span>
                        )}
                      </div>

                      <div className="hud-element">
                        <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                          <Phone size={14} className="inline mr-1" />
                          TELEFONE *
                        </label>
                        <input
                          type="tel"
                          value={formData.customer.phone}
                          onChange={(e) => updateFormData('customer.phone', formatPhone(e.target.value))}
                          className={`gaming-input ${errors['customer.phone'] ? 'border-red-500' : ''}`}
                          placeholder="(11) 99999-9999"
                          onFocus={audioHelpers.playHover}
                          maxLength={15}
                        />
                        {errors['customer.phone'] && (
                          <span className="text-red-400 text-xs mt-1 block">{errors['customer.phone']}</span>
                        )}
                      </div>

                      <div className="hud-element">
                        <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                          <FileText size={14} className="inline mr-1" />
                          CPF/CNPJ *
                        </label>
                        <input
                          type="text"
                          value={formData.customer.document}
                          onChange={(e) => updateFormData('customer.document', formatDocument(e.target.value))}
                          className={`gaming-input ${errors['customer.document'] ? 'border-red-500' : ''}`}
                          placeholder="000.000.000-00"
                          onFocus={audioHelpers.playHover}
                          maxLength={18}
                        />
                        {errors['customer.document'] && (
                          <span className="text-red-400 text-xs mt-1 block">{errors['customer.document']}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Method Step */}
              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-4">
                      Forma de Pagamento
                    </h3>

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {['CREDIT_CARD', 'BOLETO', 'PIX'].map((method) => (
                        <button
                          key={method}
                          onClick={() => updateFormData('payment_method.type', method)}
                          onMouseEnter={audioHelpers.playHover}
                          className={`p-4 rounded-lg border transition-all duration-200 text-center ${
                            formData.payment_method.type === method
                              ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                              : 'border-led-white/20 text-led-white/70 hover:border-neon-cyan/50'
                          }`}
                        >
                          <div className="gaming-mono text-xs font-bold mb-1">
                            {method === 'CREDIT_CARD' && 'CARTÃO'}
                            {method === 'BOLETO' && 'BOLETO'}
                            {method === 'PIX' && 'PIX'}
                          </div>
                          <div className="text-xs text-led-white/60">
                            {method === 'CREDIT_CARD' && 'Débito/Crédito'}
                            {method === 'BOLETO' && 'Bancário'}
                            {method === 'PIX' && 'Instantâneo'}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Credit Card Form */}
                    {formData.payment_method.type === 'CREDIT_CARD' && (
                      <div className="space-y-4">
                        <div className="hud-element">
                          <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                            NÚMERO DO CARTÃO *
                          </label>
                          <input
                            type="text"
                            value={formData.payment_method.credit_card?.number || ''}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value)
                              updateFormData('payment_method.credit_card.number', formatted)
                            }}
                            className={`gaming-input ${errors['payment_method.credit_card.number'] ? 'border-red-500' : ''}`}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            onFocus={audioHelpers.playHover}
                          />
                          {errors['payment_method.credit_card.number'] && (
                            <span className="text-red-400 text-xs mt-1 block">{errors['payment_method.credit_card.number']}</span>
                          )}
                        </div>

                        <div className="hud-element">
                          <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                            NOME NO CARTÃO *
                          </label>
                          <input
                            type="text"
                            value={formData.payment_method.credit_card?.holder_name || ''}
                            onChange={(e) => updateFormData('payment_method.credit_card.holder_name', e.target.value.toUpperCase())}
                            className={`gaming-input ${errors['payment_method.credit_card.holder_name'] ? 'border-red-500' : ''}`}
                            placeholder="NOME COMO NO CARTÃO"
                            onFocus={audioHelpers.playHover}
                          />
                          {errors['payment_method.credit_card.holder_name'] && (
                            <span className="text-red-400 text-xs mt-1 block">{errors['payment_method.credit_card.holder_name']}</span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="hud-element">
                            <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                              MÊS *
                            </label>
                            <select
                              value={formData.payment_method.credit_card?.exp_month || ''}
                              onChange={(e) => updateFormData('payment_method.credit_card.exp_month', e.target.value)}
                              className={`gaming-input ${errors['payment_method.credit_card.exp_month'] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Mês</option>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = String(i + 1).padStart(2, '0')
                                return (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                )
                              })}
                            </select>
                            {errors['payment_method.credit_card.exp_month'] && (
                              <span className="text-red-400 text-xs mt-1 block">{errors['payment_method.credit_card.exp_month']}</span>
                            )}
                          </div>

                          <div className="hud-element">
                            <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                              ANO *
                            </label>
                            <select
                              value={formData.payment_method.credit_card?.exp_year || ''}
                              onChange={(e) => updateFormData('payment_method.credit_card.exp_year', e.target.value)}
                              className={`gaming-input ${errors['payment_method.credit_card.exp_year'] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Ano</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = String(new Date().getFullYear() + i)
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                )
                              })}
                            </select>
                            {errors['payment_method.credit_card.exp_year'] && (
                              <span className="text-red-400 text-xs mt-1 block">{errors['payment_method.credit_card.exp_year']}</span>
                            )}
                          </div>

                          <div className="hud-element">
                            <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={formData.payment_method.credit_card?.security_code || ''}
                              onChange={(e) => updateFormData('payment_method.credit_card.security_code', e.target.value.replace(/\D/g, ''))}
                              className={`gaming-input ${errors['payment_method.credit_card.security_code'] ? 'border-red-500' : ''}`}
                              placeholder="123"
                              maxLength={4}
                              onFocus={audioHelpers.playHover}
                            />
                            {errors['payment_method.credit_card.security_code'] && (
                              <span className="text-red-400 text-xs mt-1 block">{errors['payment_method.credit_card.security_code']}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Boleto/PIX Instructions */}
                    {formData.payment_method.type === 'BOLETO' && (
                      <div className="gaming-card p-4 border border-electric-blue/30 bg-electric-blue/5">
                        <h4 className="gaming-mono font-bold text-electric-blue mb-2">
                          📄 PAGAMENTO VIA BOLETO
                        </h4>
                        <ul className="text-sm text-led-white/80 space-y-1">
                          <li>• Boleto será gerado após confirmação</li>
                          <li>• Pagamento pode levar até 3 dias úteis</li>
                          <li>• Serviços liberados após confirmação</li>
                        </ul>
                      </div>
                    )}

                    {formData.payment_method.type === 'PIX' && (
                      <div className="gaming-card p-4 border border-laser-green/30 bg-laser-green/5">
                        <h4 className="gaming-mono font-bold text-laser-green mb-2">
                          ⚡ PAGAMENTO VIA PIX
                        </h4>
                        <ul className="text-sm text-led-white/80 space-y-1">
                          <li>• QR Code será gerado após confirmação</li>
                          <li>• Pagamento instantâneo 24/7</li>
                          <li>• Serviços liberados em minutos</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-4">
                      Revisar Pedido
                    </h3>

                    {/* Order Summary */}
                    <div className="gaming-card p-4 border border-neon-cyan/30 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="gaming-title font-bold text-neon-cyan">{plan.name}</h4>
                          <p className="text-sm text-led-white/70">{plan.subtitle}</p>
                          <p className="text-xs text-led-white/60 mt-1">
                            Plano {isAnnual ? 'Anual' : 'Mensal'}
                            {isAnnual && ` (${plan.annual_discount}% desconto)`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="gaming-display text-xl font-bold text-laser-green">
                            {formatPrice(isAnnual ? pricing.annual_price! : pricing.monthly_price)}
                            <span className="text-sm text-led-white/60">
                              /{isAnnual ? 'ano' : 'mês'}
                            </span>
                          </div>
                          {pricing.setup_fee > 0 && (
                            <div className="text-sm text-led-white/70">
                              + {formatPrice(pricing.setup_fee)} (setup)
                            </div>
                          )}
                        </div>
                      </div>

                      {isAnnual && pricing.savings && (
                        <div className="text-sm text-laser-green font-bold">
                          💰 Você economiza {formatPrice(pricing.savings)} por ano!
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="gaming-card p-4 border border-led-white/20 mb-6">
                      <h4 className="gaming-mono font-bold text-electric-blue mb-3">DADOS DO CLIENTE</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-led-white/60">Nome:</span>
                          <span className="ml-2 text-led-white">{formData.customer.name}</span>
                        </div>
                        <div>
                          <span className="text-led-white/60">Email:</span>
                          <span className="ml-2 text-led-white">{formData.customer.email}</span>
                        </div>
                        <div>
                          <span className="text-led-white/60">Telefone:</span>
                          <span className="ml-2 text-led-white">{formData.customer.phone}</span>
                        </div>
                        <div>
                          <span className="text-led-white/60">Documento:</span>
                          <span className="ml-2 text-led-white">{formData.customer.document}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="gaming-card p-4 border border-led-white/20 mb-6">
                      <h4 className="gaming-mono font-bold text-electric-blue mb-3">FORMA DE PAGAMENTO</h4>
                      <div className="text-sm">
                        {formData.payment_method.type === 'CREDIT_CARD' && (
                          <div>
                            <span className="text-led-white/60">Cartão:</span>
                            <span className="ml-2 text-led-white">
                              **** **** **** {formData.payment_method.credit_card?.number?.slice(-4)}
                            </span>
                            <br />
                            <span className="text-led-white/60">Portador:</span>
                            <span className="ml-2 text-led-white">{formData.payment_method.credit_card?.holder_name}</span>
                          </div>
                        )}
                        {formData.payment_method.type === 'BOLETO' && (
                          <span className="text-led-white">Boleto Bancário</span>
                        )}
                        {formData.payment_method.type === 'PIX' && (
                          <span className="text-led-white">PIX</span>
                        )}
                      </div>
                    </div>

                    {/* Terms Acceptance */}
                    <div className="hud-element">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.accept_terms}
                          onChange={(e) => updateFormData('accept_terms', e.target.checked)}
                          className="mt-1"
                        />
                        <span className="text-sm text-led-white/80">
                          Eu aceito os{' '}
                          <a href="/termos" target="_blank" className="text-neon-cyan hover:underline">
                            termos de uso
                          </a>{' '}
                          e{' '}
                          <a href="/privacidade" target="_blank" className="text-neon-cyan hover:underline">
                            política de privacidade
                          </a>
                          . Autorizo a cobrança recorrente conforme o plano selecionado.
                        </span>
                      </label>
                      {errors.accept_terms && (
                        <span className="text-red-400 text-xs mt-2 block">{errors.accept_terms}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Processing Step */}
              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Loader2 className="w-16 h-16 text-neon-cyan animate-spin mx-auto mb-4" />
                  <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-2">
                    Processando Pagamento...
                  </h3>
                  <p className="text-led-white/70">
                    Aguarde enquanto processamos seu pagamento com segurança
                  </p>
                </motion.div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-laser-green mx-auto mb-4" />
                  <h3 className="gaming-title text-xl font-bold text-laser-green mb-2">
                    Pagamento Iniciado!
                  </h3>
                  <p className="text-led-white/70 mb-6">
                    {formData.payment_method.type === 'CREDIT_CARD' 
                      ? 'Redirecionando para finalizar pagamento...'
                      : 'Você será redirecionado para completar o pagamento'
                    }
                  </p>
                  
                  {checkoutUrl && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(checkoutUrl, '_blank')}
                      className="gaming-button px-8 py-3"
                    >
                      <span className="relative z-10">FINALIZAR PAGAMENTO</span>
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Error Step */}
              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="gaming-title text-xl font-bold text-red-400 mb-2">
                    Erro no Pagamento
                  </h3>
                  <p className="text-led-white/70 mb-6">
                    Ocorreu um erro ao processar seu pagamento. Tente novamente ou entre em contato conosco.
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStep('review')}
                      className="gaming-card px-6 py-2 border-neon-cyan text-neon-cyan"
                    >
                      Tentar Novamente
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('https://wa.me/5511956534963', '_blank')}
                      className="gaming-button px-6 py-2"
                    >
                      <span className="relative z-10">Falar com Suporte</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {!['processing', 'success', 'error'].includes(step) && (
              <div className="flex justify-between items-center p-6 border-t border-led-white/20">
                <div className="flex items-center gap-2 text-sm text-led-white/60">
                  <Shield size={16} />
                  Pagamento 100% seguro
                </div>

                <div className="flex gap-3">
                  {step !== 'customer' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        audioHelpers.playClick(false)
                        if (step === 'payment') setStep('customer')
                        else if (step === 'review') setStep('payment')
                      }}
                      className="gaming-card px-6 py-2 border-led-white/30 text-led-white"
                    >
                      Voltar
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextStep}
                    onMouseEnter={audioHelpers.playHover}
                    className="gaming-button px-6 py-2"
                  >
                    <span className="relative z-10">
                      {step === 'customer' && 'Continuar'}
                      {step === 'payment' && 'Revisar'}
                      {step === 'review' && 'Confirmar Pagamento'}
                    </span>
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}