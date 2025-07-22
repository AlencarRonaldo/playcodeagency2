'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, User, Mail, Phone, FileText, ArrowRight, Loader2 } from 'lucide-react'

interface TestFormData {
  plan_id: string
  customer: {
    name: string
    email: string
    document: string
    phone: string
  }
  payment_method: {
    type: string
  }
}

export default function TestCheckoutPage() {
  const [formData, setFormData] = useState<TestFormData>({
    plan_id: 'starter-pack',
    customer: {
      name: 'Cliente Teste',
      email: 'teste@playcodeagency.xyz',
      document: '123.456.789-00',
      phone: '(11) 99999-9999'
    },
    payment_method: {
      type: 'CREDIT_CARD'
    }
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const plans = [
    { id: 'starter-pack', name: 'Starter Pack', price: 'R$ 797' },
    { id: 'pro-guild', name: 'Pro Guild', price: 'R$ 2.497' },
    { id: 'enterprise', name: 'Enterprise', price: 'Sob consulta' }
  ]

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('customer.')) {
      const customerField = field.replace('customer.', '')
      setFormData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          [customerField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleTestCheckout = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/payment/checkout-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        console.log('✅ Checkout criado:', data)
      } else {
        setError(data.error?.message || 'Erro no checkout')
        console.error('❌ Erro checkout:', data.error)
      }
    } catch (err) {
      setError('Erro de conexão')
      console.error('❌ Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmailFlow = async () => {
    if (!result?.data?.customer) return

    setLoading(true)
    try {
      // Simular webhook de pagamento aprovado
      const webhookResponse = await fetch('/api/webhooks/pagseguro-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'subscription.activated',
          data: {
            id: result.data.subscription_id,
            reference_id: result.data.reference_id,
            status: 'ACTIVE',
            customer: result.data.customer,
            plan: result.data.plan
          }
        })
      })

      const webhookData = await webhookResponse.json()
      console.log('✅ Webhook processado:', webhookData)
      
      alert('✅ Email de boas-vindas enviado! Verifique o console para logs.')
    } catch (err) {
      console.error('❌ Erro webhook:', err)
      alert('❌ Erro ao processar webhook')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-console relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gaming-title text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-neon-cyan">TESTE DE</span><br />
              <span className="text-magenta-power">CHECKOUT</span>
            </h1>
            <p className="gaming-subtitle">
              Simular venda para testar fluxo completo: pagamento → email → onboarding
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulário de Teste */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="gaming-card"
            >
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-5 h-5 text-neon-cyan" />
                <h3 className="gaming-title text-xl">Dados para Teste</h3>
              </div>

              <div className="space-y-4">
                {/* Seleção de Plano */}
                <div>
                  <label className="block gaming-mono text-sm mb-2">Plano</label>
                  <select
                    value={formData.plan_id}
                    onChange={(e) => handleInputChange('plan_id', e.target.value)}
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 focus:border-neon-cyan focus:outline-none"
                  >
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dados do Cliente */}
                <div>
                  <label className="block gaming-mono text-sm mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.customer.name}
                    onChange={(e) => handleInputChange('customer.name', e.target.value)}
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block gaming-mono text-sm mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => handleInputChange('customer.email', e.target.value)}
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block gaming-mono text-sm mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    CPF
                  </label>
                  <input
                    type="text"
                    value={formData.customer.document}
                    onChange={(e) => handleInputChange('customer.document', e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block gaming-mono text-sm mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.customer.phone}
                    onChange={(e) => handleInputChange('customer.phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                {/* Botão de Teste */}
                <button
                  onClick={handleTestCheckout}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🎮 Criar Checkout de Teste</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Resultado */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="gaming-card"
            >
              <h3 className="gaming-title text-xl mb-6">Resultado do Teste</h3>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
                  <strong>❌ Erro:</strong> {error}
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="bg-laser-green/20 border border-laser-green text-laser-green p-4 rounded-lg">
                    <strong>✅ Checkout Criado!</strong>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-led-white/20">
                    <h4 className="font-bold mb-2">Detalhes:</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>ID:</strong> {result.data.subscription_id}</p>
                      <p><strong>Referência:</strong> {result.data.reference_id}</p>
                      <p><strong>Status:</strong> {result.data.status}</p>
                      <p><strong>Cliente:</strong> {result.data.customer.name}</p>
                      <p><strong>Email:</strong> {result.data.customer.email}</p>
                      <p><strong>Plano:</strong> {result.data.plan.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleTestEmailFlow}
                      disabled={loading}
                      className="btn-secondary w-full"
                    >
                      📧 Simular Pagamento Aprovado (Enviar Email)
                    </button>

                    <button
                      onClick={async () => {
                        setLoading(true)
                        try {
                          const response = await fetch('/api/test-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                          })
                          const data = await response.json()
                          console.log('📧 Teste direto:', data)
                          alert(data.message)
                        } catch (err) {
                          console.error('❌ Erro:', err)
                          alert('❌ Erro no teste de email')
                        } finally {
                          setLoading(false)
                        }
                      }}
                      disabled={loading}
                      className="btn-primary w-full opacity-80"
                    >
                      🧪 Teste Direto de Email SMTP
                    </button>

                    {result.data.checkout_url && (
                      <div className="bg-neon-cyan/20 border border-neon-cyan p-4 rounded-lg">
                        <p className="text-sm mb-3"><strong>🔗 Link de Pagamento Gerado:</strong></p>
                        <a 
                          href={result.data.checkout_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full bg-neon-cyan text-black font-bold py-2 px-4 rounded-lg hover:bg-neon-cyan/80 transition-colors"
                        >
                          💳 Abrir Link de Pagamento
                        </a>
                        <p className="text-xs text-led-white/60 mt-2 break-all">
                          URL: {result.data.checkout_url}
                        </p>
                      </div>
                    )}

                    {result.data.mock && (
                      <div className="bg-plasma-yellow/20 border border-plasma-yellow p-3 rounded-lg">
                        <p className="text-sm text-plasma-yellow">
                          ⚠️ <strong>Modo Teste:</strong> Este é um link simulado para desenvolvimento. 
                          Em produção, seria gerado pelo PagSeguro real.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-led-white/50 py-8">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Preencha os dados e clique em "Criar Checkout de Teste"</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Instruções */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="gaming-card mt-8"
          >
            <h3 className="gaming-title text-xl mb-4">📋 Fluxo de Teste</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-neon-cyan/10 rounded-lg">
                <div className="text-neon-cyan font-bold text-lg mb-2">1</div>
                <div>Criar Checkout</div>
              </div>
              <div className="text-center p-4 bg-magenta-power/10 rounded-lg">
                <div className="text-magenta-power font-bold text-lg mb-2">2</div>
                <div>Simular Pagamento</div>
              </div>
              <div className="text-center p-4 bg-laser-green/10 rounded-lg">
                <div className="text-laser-green font-bold text-lg mb-2">3</div>
                <div>Email Boas-vindas</div>
              </div>
              <div className="text-center p-4 bg-plasma-yellow/10 rounded-lg">
                <div className="text-plasma-yellow font-bold text-lg mb-2">4</div>
                <div>Link Onboarding</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}