'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Phone, Mail, MapPin, Clock, Shield, Zap, Code, Users } from 'lucide-react'
import { useAchievements, trackingHelpers } from '@/lib/hooks/useAchievements'
import { audioHelpers } from '@/lib/hooks/useAudio'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  project_type: string
  budget_range: string
  message: string
  urgency: string
}

interface ContactInfo {
  icon: React.ElementType
  title: string
  details: string[]
  color: string
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget_range: '',
    message: '',
    urgency: 'normal'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const { } = useAchievements()

  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: 'COMUNICAÇÃO DIRETA',
      details: ['+55 (11) 95653-4963', 'WhatsApp Business 24/7'],
      color: 'text-neon-cyan'
    },
    {
      icon: Mail,
      title: 'CANAL DIGITAL',
      details: ['contato@playcodeagency.xyz', 'Response time: < 2h'],
      color: 'text-electric-blue'
    },
    {
      icon: MapPin,
      title: 'HQ LOCATION',
      details: ['São Bernardo do Campo, SP', 'Remote & On-site'],
      color: 'text-magenta-power'
    },
    {
      icon: Clock,
      title: 'OPERATING HOURS',
      details: ['24/7 Digital Support', 'Mon-Fri: 9h-18h BRT'],
      color: 'text-laser-green'
    }
  ]

  const projectTypes = [
    { value: 'website', label: '🌐 Website/Landing Page', points: 100 },
    { value: 'webapp', label: '⚡ Web Application', points: 300 },
    { value: 'mobile', label: '📱 Mobile App', points: 500 },
    { value: 'ai', label: '🤖 AI Integration', points: 800 },
    { value: 'ecommerce', label: '🛒 E-commerce', points: 400 },
    { value: 'custom', label: '🚀 Custom Solution', points: 1000 }
  ]

  const budgetRanges = [
    { value: 'startup', label: '💡 Startup (R$ 5K - 15K)', multiplier: 1 },
    { value: 'small', label: '🏢 Small Business (R$ 15K - 50K)', multiplier: 1.5 },
    { value: 'medium', label: '🏗️ Medium Enterprise (R$ 50K - 150K)', multiplier: 2 },
    { value: 'large', label: '🏛️ Large Enterprise (R$ 150K+)', multiplier: 3 },
    { value: 'custom', label: '💎 Custom Budget', multiplier: 2.5 }
  ]

  const urgencyLevels = [
    { value: 'low', label: '🐌 Standard (30-60 days)', color: 'text-led-white' },
    { value: 'normal', label: '⚡ Fast Track (15-30 days)', color: 'text-electric-blue' },
    { value: 'high', label: '🚀 Rush (7-15 days)', color: 'text-plasma-yellow' },
    { value: 'critical', label: '🔥 Emergency (< 7 days)', color: 'text-magenta-power' }
  ]

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) errors.email = 'Email é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido'
    if (!formData.project_type) errors.project_type = 'Selecione o tipo de projeto'
    if (!formData.message.trim()) errors.message = 'Descreva seu projeto'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateLeadScore = (): number => {
    let score = 0
    
    // Project type score
    const projectType = projectTypes.find(p => p.value === formData.project_type)
    if (projectType) score += projectType.points
    
    // Budget multiplier
    const budget = budgetRanges.find(b => b.value === formData.budget_range)
    if (budget) score *= budget.multiplier
    
    // Company bonus
    if (formData.company.trim()) score += 200
    
    // Phone bonus (higher intent)
    if (formData.phone.trim()) score += 150
    
    // Message length bonus
    if (formData.message.length > 100) score += 100
    
    // Urgency multiplier
    const urgencyMultipliers = { low: 0.8, normal: 1, high: 1.3, critical: 1.5 }
    score *= urgencyMultipliers[formData.urgency as keyof typeof urgencyMultipliers]
    
    return Math.round(score)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      audioHelpers.playError()
      return
    }
    
    setIsSubmitting(true)
    audioHelpers.playClick(true)
    
    try {
      const leadScore = calculateLeadScore()
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lead_score: leadScore,
          submitted_at: new Date().toISOString(),
          source: 'contact_page'
        })
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        audioHelpers.playAchievementUnlocked('epic')
        
        // Track achievement
        trackingHelpers.trackContactForm({
          project_type: formData.project_type,
          budget_range: formData.budget_range,
          lead_score: leadScore
        })
        
        // Reset form
        setFormData({
          name: '', email: '', phone: '', company: '',
          project_type: '', budget_range: '', message: '', urgency: 'normal'
        })
        
      } else {
        throw new Error('Submission failed')
      }
      
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      audioHelpers.playError()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Play hover sound for select changes
    if (['project_type', 'budget_range', 'urgency'].includes(field)) {
      audioHelpers.playHover()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-console relative overflow-hidden">
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain opacity-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="text-terminal-green"
            style={{
              left: `${i * 7}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${10 + Math.random() * 4}px`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </span>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="gaming-title text-4xl lg:text-6xl font-bold mb-6 neon-glow">
            <span className="text-neon-cyan">INICIAR</span>
            <br />
            <span className="text-magenta-power">MISSÃO</span>
          </h1>
          <p className="gaming-subtitle text-xl text-led-white/80 max-w-2xl mx-auto">
            Conecte-se com nossa equipe de especialistas e transforme sua visão em realidade digital
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="gaming-card p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-gaming rounded flex items-center justify-center">
                <Code className="w-5 h-5 text-neon-cyan" />
              </div>
              <h2 className="gaming-title text-2xl font-bold text-neon-cyan">
                MISSION BRIEFING
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    PLAYER NAME *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onFocus={() => audioHelpers.playHover()}
                    className={`gaming-input ${formErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Seu nome completo"
                  />
                  {formErrors.name && (
                    <span className="text-red-400 text-xs mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    EMAIL CHANNEL *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => audioHelpers.playHover()}
                    className={`gaming-input ${formErrors.email ? 'border-red-500' : ''}`}
                    placeholder="seu@email.com"
                  />
                  {formErrors.email && (
                    <span className="text-red-400 text-xs mt-1 block">{formErrors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    COMM LINK
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onFocus={() => audioHelpers.playHover()}
                    className="gaming-input"
                    placeholder="(11) 95653-4963"
                  />
                </div>

                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    ORGANIZATION
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onFocus={() => audioHelpers.playHover()}
                    className="gaming-input"
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="hud-element">
                <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                  MISSION TYPE *
                </label>
                <select
                  value={formData.project_type}
                  onChange={(e) => handleInputChange('project_type', e.target.value)}
                  className={`gaming-input ${formErrors.project_type ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione o tipo de projeto</option>
                  {projectTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formErrors.project_type && (
                  <span className="text-red-400 text-xs mt-1 block">{formErrors.project_type}</span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    BUDGET ALLOCATION
                  </label>
                  <select
                    value={formData.budget_range}
                    onChange={(e) => handleInputChange('budget_range', e.target.value)}
                    className="gaming-input"
                  >
                    <option value="">Selecione a faixa de investimento</option>
                    {budgetRanges.map(budget => (
                      <option key={budget.value} value={budget.value}>
                        {budget.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hud-element">
                  <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                    URGENCY LEVEL
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="gaming-input"
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="hud-element">
                <label className="gaming-mono text-xs text-led-white/70 mb-2 block">
                  MISSION DETAILS *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  onFocus={() => audioHelpers.playHover()}
                  className={`gaming-input h-32 resize-none ${formErrors.message ? 'border-red-500' : ''}`}
                  placeholder="Descreva seu projeto, objetivos e requisitos específicos..."
                />
                {formErrors.message && (
                  <span className="text-red-400 text-xs mt-1 block">{formErrors.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => audioHelpers.playHover()}
                className="gaming-button w-full py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                    PROCESSANDO MISSÃO...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    ENVIAR BRIEFING
                  </>
                )}
              </motion.button>
            </form>

            {/* Status Messages */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 gaming-card bg-laser-green/10 border-laser-green p-4"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-laser-green" />
                    <div>
                      <h3 className="gaming-mono font-bold text-laser-green">MISSÃO RECEBIDA</h3>
                      <p className="text-sm text-led-white/70">
                        Resposta em até 2 horas. Prepare-se para decolar! 🚀
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 gaming-card bg-red-500/10 border-red-500 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-red-400" />
                    <div>
                      <h3 className="gaming-mono font-bold text-red-400">FALHA NA TRANSMISSÃO</h3>
                      <p className="text-sm text-led-white/70">
                        Erro no sistema. Tente novamente ou use nossos canais alternativos.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info & Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Contact Methods */}
            <div className="gaming-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-gaming rounded flex items-center justify-center">
                  <Users className="w-5 h-5 text-magenta-power" />
                </div>
                <h3 className="gaming-title text-xl font-bold text-magenta-power">
                  QUICK ACCESS
                </h3>
              </div>

              <div className="grid gap-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hud-element p-4 hover:bg-led-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${info.color} mt-1`}>
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="gaming-mono text-sm font-bold text-led-white mb-1">
                          {info.title}
                        </h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-led-white/70">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Business Hours & Response Time */}
            <div className="gaming-card p-6">
              <h3 className="gaming-title text-lg font-bold text-electric-blue mb-4">
                SERVICE LEVEL AGREEMENT
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-led-white/70">Response Time:</span>
                  <span className="text-laser-green font-bold">&lt; 2 horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-led-white/70">Project Kickoff:</span>
                  <span className="text-electric-blue font-bold">24-48h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-led-white/70">Support:</span>
                  <span className="text-magenta-power font-bold">24/7 Digital</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-led-white/70">Success Rate:</span>
                  <span className="text-plasma-yellow font-bold">99.9%</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="gaming-card p-6 border-plasma-yellow bg-plasma-yellow/5">
              <h3 className="gaming-title text-lg font-bold text-plasma-yellow mb-4">
                🚨 EMERGENCY PROTOCOL
              </h3>
              <p className="text-sm text-led-white/80 mb-4">
                Para projetos críticos ou emergências técnicas, contate nossa linha direta:
              </p>
              <a 
                href="tel:+5511999998888"
                className="gaming-button bg-plasma-yellow text-controller-black py-2 px-4 text-sm font-bold inline-flex items-center gap-2"
                onMouseEnter={() => audioHelpers.playHover()}
                onClick={() => audioHelpers.playClick(true)}
              >
                <Phone className="w-4 h-4" />
                (11) 95653-4963
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}