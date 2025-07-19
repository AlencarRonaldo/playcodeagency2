'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Shield, 
  Rocket,
  Check,
  X,
  Star,
  Trophy,
  Target,
  Brain,
  Globe,
  HeadphonesIcon
} from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface Plan {
  id: string
  name: string
  subtitle: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  price: {
    monthly: number
    yearly: number
    setup?: number
  }
  features: {
    name: string
    included: boolean
    description?: string
  }[]
  powerUps: string[]
  support: string
  projects: string
  revisions: string
  delivery: string
  popular?: boolean
  enterprise?: boolean
  icon: React.ElementType
}

interface AddOn {
  id: string
  name: string
  description: string
  price: number
  icon: React.ElementType
  category: 'development' | 'marketing' | 'support' | 'analytics'
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    subtitle: 'Para quem está começando',
    description: 'Ideal para pequenos negócios que querem marcar presença digital',
    rarity: 'rare',
    price: {
      monthly: 797,
      yearly: 797
    },
    features: [
      { name: 'Landing Page Responsiva', included: true, description: 'Focado em vendas ou apresentação' },
      { name: 'SEO Básico', included: true, description: 'Otimização para mecanismos de busca' },
      { name: 'Formulário de Contato', included: true, description: 'Captação de leads básica' },
      { name: 'Hospedagem Anual Incluída', included: true, description: '1 ano de hosting gratuito' },
      { name: 'SSL Certificado', included: true, description: 'Segurança HTTPS' },
      { name: 'Analytics Básico', included: true, description: 'Google Analytics configurado' },
      { name: 'Domínio .com.br', included: true, description: 'Registro de domínio incluído' },
      { name: 'WhatsApp Integration', included: true, description: 'Botão flutuante configurado' },
      { name: 'E-commerce', included: false },
      { name: 'Blog/CMS', included: false },
      { name: 'Chatbot IA', included: false },
      { name: 'API Integrations', included: false }
    ],
    powerUps: ['HTML5', 'CSS3', 'JavaScript', 'SEO', 'WhatsApp'],
    support: '5x8 (dias úteis)',
    projects: '1 projeto',
    revisions: '2 rodadas',
    delivery: '7 dias',
    icon: Rocket,
    popular: true
  },
  {
    id: 'professional',
    name: 'Pro Guild',
    subtitle: 'Para negócios em crescimento',
    description: 'Solução completa para empresas que querem escalar digitalmente',
    rarity: 'rare',
    price: {
      monthly: 2497,
      yearly: 2497
    },
    features: [
      { name: 'Website Completo', included: true, description: 'Até 5 páginas personalizadas' },
      { name: 'Domínio Incluído', included: true, description: 'Registro .com.br por 1 ano' },
      { name: 'Hospedagem Anual', included: true, description: 'Hosting profissional por 1 ano' },
      { name: 'SSL Certificado', included: true, description: 'Segurança HTTPS' },
      { name: 'WhatsApp Integration', included: true, description: 'Botão flutuante configurado' },
      { name: 'SEO Avançado', included: true, description: 'Otimização técnica completa' },
      { name: 'Analytics Avançado', included: true, description: 'Dashboards personalizados' },
      { name: 'Backup Automático', included: true, description: 'Proteção de dados' },
      { name: 'Blog/CMS Avançado', included: false },
      { name: 'E-commerce Integrado', included: false },
      { name: 'Integração com APIs', included: false },
      { name: 'Chatbot IA', included: false },
      { name: 'Mobile App', included: false },
      { name: 'DevOps Avançado', included: false }
    ],
    powerUps: ['React', 'Node.js', 'Database', 'Payment', 'CMS'],
    support: '7x12 (seg-dom)',
    projects: '2-3 projetos',
    revisions: '3 rodadas',
    delivery: '7 dias',
    popular: true,
    icon: Shield
  },
  {
    id: 'enterprise',
    name: 'Elite Force',
    subtitle: 'Para empresas estabelecidas',
    description: 'Solução enterprise com IA, automação e infraestrutura robusta',
    rarity: 'epic',
    price: {
      monthly: 7500,
      yearly: 75000
    },
    features: [
      { name: 'Plataforma Customizada', included: true, description: 'Solução sob medida' },
      { name: 'Integração de IA', included: true, description: 'Chatbot e automações inteligentes' },
      { name: 'Painel Administrativo', included: true, description: 'Sistema de gestão completo' },
      { name: 'DevOps Completo', included: true, description: 'CI/CD e monitoramento' },
      { name: 'Business Intelligence', included: true, description: 'Dashboards executivos' },
      { name: 'Security Audit', included: true, description: 'Auditoria de segurança' },
      { name: 'Load Balancing', included: true, description: 'Alta disponibilidade' },
      { name: 'Microservices', included: true, description: 'Arquitetura escalável' },
      { name: 'Mobile App Nativo', included: false },
      { name: 'API Gateway', included: false },
      { name: 'White Label', included: false }
    ],
    powerUps: ['React', 'Node.js', 'AI/ML', 'DevOps', 'Security'],
    support: '24x7 (sempre)',
    projects: '5+ projetos',
    revisions: 'Ilimitadas',
    delivery: '8-16 semanas',
    icon: Crown
  },
  {
    id: 'legendary',
    name: 'Legendary Tier',
    subtitle: 'Para visionários digitais',
    description: 'Parceria estratégica completa com dedicação exclusiva',
    rarity: 'legendary',
    price: {
      monthly: 15000,
      yearly: 150000,
      setup: 25000
    },
    features: [
      { name: 'Equipe Dedicada', included: true, description: 'Time exclusivo para seu projeto' },
      { name: 'Arquitetura Enterprise', included: true, description: 'Solução escalável ilimitada' },
      { name: 'IA Personalizada', included: true, description: 'Machine Learning customizado' },
      { name: 'Blockchain Integration', included: true, description: 'Web3 e contratos inteligentes' },
      { name: 'IoT Integration', included: true, description: 'Internet das Coisas' },
      { name: 'AR/VR Experiences', included: true, description: 'Realidade aumentada/virtual' },
      { name: 'Global CDN', included: true, description: 'Performance mundial' },
      { name: 'White Label', included: true, description: 'Marca própria' },
      { name: 'Strategic Consulting', included: true, description: 'Consultoria estratégica' },
      { name: 'Innovation Lab', included: true, description: 'P&D contínuo' }
    ],
    powerUps: ['Full Stack', 'AI/ML', 'Blockchain', 'IoT', 'AR/VR', 'Strategic'],
    support: 'Dedicado 24x7',
    projects: 'Ilimitados',
    revisions: 'Ilimitadas',
    delivery: 'Contínua',
    enterprise: true,
    icon: Rocket
  }
]

const ADD_ONS: AddOn[] = [
  {
    id: 'chatbot-premium',
    name: 'Chatbot Premium',
    description: 'IA avançada com processamento de linguagem natural',
    price: 1500,
    icon: Brain,
    category: 'development'
  },
  {
    id: 'seo-boost',
    name: 'SEO Turbo Boost',
    description: 'Otimização avançada e campanha de conteúdo',
    price: 2000,
    icon: Target,
    category: 'marketing'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Aplicativo nativo para iOS e Android',
    price: 8000,
    icon: Globe,
    category: 'development'
  },
  {
    id: 'priority-support',
    name: 'Suporte Prioritário',
    description: 'Atendimento VIP com resposta em 1 hora',
    price: 800,
    icon: HeadphonesIcon,
    category: 'support'
  },
  {
    id: 'advanced-analytics',
    name: 'Analytics Pro',
    description: 'Dashboards personalizados e relatórios avançados',
    price: 1200,
    icon: Star,
    category: 'analytics'
  }
]

const rarityConfig = {
  common: {
    border: 'border-led-white/40',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.3)]',
    gradient: 'from-led-white/15 to-led-white/5',
    text: 'text-led-white',
    accent: 'text-led-white',
    bg: 'bg-led-white/5'
  },
  rare: {
    border: 'border-electric-blue/60',
    glow: 'shadow-[0_0_20px_rgba(0,212,255,0.4)]',
    gradient: 'from-electric-blue/25 to-electric-blue/10',
    text: 'text-electric-blue',
    accent: 'text-electric-blue',
    bg: 'bg-electric-blue/10'
  },
  epic: {
    border: 'border-gaming-purple/70',
    glow: 'shadow-[0_0_25px_rgba(139,92,246,0.5)]',
    gradient: 'from-gaming-purple/30 to-gaming-purple/15',
    text: 'text-gaming-purple',
    accent: 'text-gaming-purple',
    bg: 'bg-gaming-purple/15'
  },
  legendary: {
    border: 'border-plasma-yellow/80',
    glow: 'shadow-[0_0_30px_rgba(255,234,0,0.6)]',
    gradient: 'from-plasma-yellow/35 to-plasma-yellow/15',
    text: 'text-plasma-yellow',
    accent: 'text-plasma-yellow',
    bg: 'bg-plasma-yellow/15'
  }
}

export default function PlanosPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { playContextMusic } = useAudio()

  // Enhanced badge animation styles
  const badgeStyles = `
    .badge-glow-popular {
      animation: popularGlow 2s ease-in-out infinite alternate, badgePulse 3s ease-in-out infinite;
    }
    .badge-glow-enterprise {
      animation: enterpriseGlow 2.5s ease-in-out infinite alternate, cyberpunkScan 4s linear infinite;
    }
    @keyframes popularGlow {
      0% { box-shadow: 0 0 20px rgba(255, 234, 0, 0.8), 0 0 40px rgba(255, 234, 0, 0.6), 0 0 60px rgba(255, 234, 0, 0.4); }
      100% { box-shadow: 0 0 30px rgba(255, 234, 0, 1), 0 0 60px rgba(255, 234, 0, 0.8), 0 0 90px rgba(255, 234, 0, 0.6); }
    }
    @keyframes enterpriseGlow {
      0% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4); }
      100% { box-shadow: 0 0 30px rgba(236, 72, 153, 1), 0 0 60px rgba(236, 72, 153, 0.8), 0 0 90px rgba(139, 92, 246, 0.6); }
    }
    @keyframes badgePulse {
      0%, 100% { transform: scale(1) rotate(2deg); }
      50% { transform: scale(1.05) rotate(1deg); }
    }
    @keyframes cyberpunkScan {
      0% { background-position: -100% 0; }
      100% { background-position: 100% 0; }
    }
  `

  useEffect(() => {
    setMounted(true)
    
    // Track page view
    trackingHelpers.trackPageView('/planos')
    
    // Play ambient music
    playContextMusic('default')
  }, [playContextMusic])

  const handlePlanSelect = (planId: string) => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick(`plan_select_${planId}`)
    setSelectedPlan(planId)
  }

  const handleBillingToggle = () => {
    audioHelpers.playNavigation()
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-console">
      {/* Enhanced Badge Animations CSS */}
      <style jsx>{badgeStyles}</style>

      {/* Matrix Rain Background */}
      <div className="matrix-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="text-terminal-green opacity-20"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${12 + Math.random() * 6}px`
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </span>
        ))}
      </div>

      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-neon-cyan" />
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold text-neon-cyan neon-glow">
              PLANOS
            </h1>
            <Trophy className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 max-w-4xl mx-auto mb-8">
            Escolha seu power-up ideal e desbloqueie todo o potencial digital do seu negócio. 
            Cada plano é uma aventura épica rumo ao sucesso.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className={`gaming-mono text-sm font-bold ${billingCycle === 'monthly' ? 'text-neon-cyan' : 'text-led-white/60'}`}>
              MENSAL
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={handleBillingToggle}
              className="relative w-16 h-8 bg-led-white/20 rounded-full border border-neon-cyan/50 hover:border-neon-cyan transition-all duration-300"
            >
              <motion.div
                animate={{ x: billingCycle === 'yearly' ? 32 : 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-1 w-6 h-6 bg-neon-cyan rounded-full shadow-lg"
              />
            </motion.button>
            <span className={`gaming-mono text-sm font-bold ${billingCycle === 'yearly' ? 'text-neon-cyan' : 'text-led-white/60'}`}>
              ANUAL
            </span>
            {billingCycle === 'yearly' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-laser-green/20 border border-laser-green/50 rounded-full gaming-mono text-xs font-bold text-laser-green"
              >
                💰 SAVE 15%
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {PLANS.map((plan, index) => {
            const config = rarityConfig[plan.rarity]
            const isSelected = selectedPlan === plan.id
            const PlanIcon = plan.icon
            const currentPrice = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`
                  relative gaming-card cursor-pointer overflow-visible
                  bg-gradient-to-br ${config.gradient}
                  border-2 ${config.border}
                  hover:${config.glow}
                  transition-all duration-300
                  ${isSelected ? `${config.glow} scale-105` : ''}
                  ${plan.popular ? 'ring-2 ring-plasma-yellow/50 ring-offset-2 ring-offset-transparent' : ''}
                  ${plan.enterprise ? 'ring-2 ring-magenta-power/50 ring-offset-2 ring-offset-transparent' : ''}
                `}
                onClick={() => handlePlanSelect(plan.id)}
                onMouseEnter={audioHelpers.playHover}
              >
                {/* Popular Badge - Maximum Visibility Cyberpunk Design */}
                {plan.popular && (
                  <div className="absolute -top-3 -right-3 z-50">
                    <div className="relative group">
                      {/* Ultra-wide glow effect */}
                      <div className="absolute inset-0 bg-plasma-yellow/60 rounded-xl blur-2xl animate-pulse scale-125"></div>
                      <div className="absolute inset-0 bg-yellow-300/40 rounded-xl blur-xl animate-pulse scale-150"></div>
                      
                      {/* Card darkening overlay for contrast */}
                      <div className="absolute -inset-20 bg-black/20 rounded-xl pointer-events-none"></div>
                      
                      {/* Main badge - extra large */}
                      <div className="relative badge-glow-popular bg-gradient-to-r from-plasma-yellow via-yellow-300 to-amber-400 text-controller-black px-8 py-4 gaming-mono text-base font-black shadow-[0_12px_40px_rgba(255,234,0,1)] transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 border-3 border-yellow-200 rounded-lg">
                        {/* Inner shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80 animate-pulse rounded-lg"></div>
                        
                        {/* Scanning line effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent h-full animate-pulse bg-size-200 bg-pos-x-minus-100"></div>
                        
                        <div className="relative flex items-center gap-2">
                          <span className="text-xl animate-bounce">🔥</span>
                          <span className="tracking-wide font-extrabold">POPULAR</span>
                          <span className="text-xl animate-bounce animation-delay-300">⚡</span>
                        </div>
                        
                        {/* Multiple glow borders */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-plasma-yellow to-yellow-300 rounded-lg opacity-40 blur-sm"></div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-lg opacity-20 blur-md"></div>
                      </div>
                      
                      {/* Enhanced ribbon fold with dramatic shadow */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-yellow-700 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent transform translate-x-4 drop-shadow-2xl"></div>
                      
                      {/* Multiple pulsing rings */}
                      <div className="absolute inset-0 border-3 border-plasma-yellow rounded-lg animate-ping opacity-50"></div>
                      <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-ping opacity-30 animation-delay-500"></div>
                      <div className="absolute inset-0 border-1 border-amber-400 rounded-lg animate-ping opacity-20 animation-delay-1000"></div>
                    </div>
                  </div>
                )}

                {/* Enterprise Badge - Maximum Impact Premium Design */}
                {plan.enterprise && (
                  <div className="absolute -top-3 -right-3 z-50">
                    <div className="relative group">
                      {/* Ultra-wide cyberpunk glow */}
                      <div className="absolute inset-0 bg-magenta-power/70 rounded-xl blur-2xl animate-pulse scale-125"></div>
                      <div className="absolute inset-0 bg-purple-500/50 rounded-xl blur-xl animate-pulse scale-150"></div>
                      <div className="absolute inset-0 bg-violet-400/30 rounded-xl blur-2xl animate-pulse scale-175"></div>
                      
                      {/* Card darkening overlay for contrast */}
                      <div className="absolute -inset-20 bg-black/25 rounded-xl pointer-events-none"></div>
                      
                      {/* Main enterprise badge - extra large */}
                      <div className="relative badge-glow-enterprise bg-gradient-to-r from-magenta-power via-purple-500 to-violet-600 text-white px-8 py-4 gaming-mono text-base font-black shadow-[0_12px_40px_rgba(236,72,153,1)] transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 border-3 border-pink-200 rounded-lg">
                        {/* Neon inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80 animate-pulse rounded-lg"></div>
                        
                        {/* Cyberpunk glitch effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent h-full animate-pulse"></div>
                        
                        <div className="relative flex items-center gap-2">
                          <span className="text-xl animate-bounce">👑</span>
                          <span className="tracking-wide font-extrabold">ENTERPRISE</span>
                          <span className="text-xl animate-bounce animation-delay-300">💎</span>
                        </div>
                        
                        {/* Multiple neon glow borders */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-magenta-power to-purple-500 rounded-lg opacity-40 blur-sm"></div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg opacity-30 blur-md"></div>
                        <div className="absolute -inset-3 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg opacity-20 blur-lg"></div>
                      </div>
                      
                      {/* Enhanced ribbon fold with dramatic neon shadow */}
                      <div className="absolute top-0 left-0 w-0 h-0 border-r-[16px] border-r-purple-900 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent transform -translate-x-4 drop-shadow-2xl"></div>
                      
                      {/* Glitch-style multiple rings with different timings */}
                      <div className="absolute inset-0 border-3 border-magenta-power rounded-lg animate-ping opacity-50"></div>
                      <div className="absolute inset-0 border-2 border-purple-400 rounded-lg animate-ping opacity-30 animation-delay-300"></div>
                      <div className="absolute inset-0 border-2 border-violet-400 rounded-lg animate-ping opacity-20 animation-delay-600"></div>
                      <div className="absolute inset-0 border-1 border-indigo-400 rounded-lg animate-ping opacity-15 animation-delay-900"></div>
                    </div>
                  </div>
                )}

                {/* Rarity Badge - Enhanced with better positioning */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`
                    px-3 py-1.5 rounded-lg text-xs font-bold gaming-mono uppercase
                    ${config.text} ${config.border} border-2 bg-gradient-to-r ${config.gradient}
                    shadow-[0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-sm
                    transform hover:scale-105 transition-transform duration-200
                  `}>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
                      {plan.rarity}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Plan Icon */}
                  <div className={`
                    w-16 h-16 mx-auto mb-4 rounded-xl
                    bg-gradient-to-br ${config.gradient}
                    border ${config.border}
                    flex items-center justify-center
                  `}>
                    <PlanIcon size={32} className={config.text} />
                  </div>

                  {/* Plan Info */}
                  <div className="text-center mb-6">
                    <h3 className={`gaming-title text-xl font-bold mb-1 ${config.text}`}>
                      {plan.name}
                    </h3>
                    <p className="gaming-mono text-sm text-neon-cyan mb-2">
                      {plan.subtitle}
                    </p>
                    <p className="text-xs text-led-white/70 mb-4">
                      {plan.description}
                    </p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className={`gaming-display text-3xl font-bold mb-1 ${config.text}`}>
                        R$ {currentPrice.toLocaleString()}
                      </div>
                      <div className="gaming-mono text-xs text-led-white/60">
                        {(plan.id === 'starter' || plan.id === 'professional' || plan.id === 'enterprise') ? 'valor único' : `por ${billingCycle === 'monthly' ? 'mês' : 'ano'}`}
                      </div>
                      {plan.price.setup && plan.price.setup > 0 && (
                        <div className="gaming-mono text-xs text-led-white/50 mt-1">
                          + R$ {plan.price.setup.toLocaleString()} setup
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center">
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {plan.projects}
                      </div>
                      <div className="gaming-mono text-xs text-led-white/60">
                        PROJETOS
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {plan.delivery}
                      </div>
                      <div className="gaming-mono text-xs text-led-white/60">
                        ENTREGA
                      </div>
                    </div>
                  </div>

                  {/* Power-ups Preview */}
                  <div className="mb-6">
                    <h4 className="gaming-mono text-xs font-bold text-neon-cyan mb-2 text-center">
                      POWER-UPS INCLUSOS
                    </h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {plan.powerUps.slice(0, 4).map((powerUp, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs gaming-mono ${config.text} border ${config.border} ${config.bg}`}
                        >
                          {powerUp}
                        </span>
                      ))}
                      {plan.powerUps.length > 4 && (
                        <span className="px-2 py-1 rounded text-xs gaming-mono text-led-white/60 border border-led-white/20">
                          +{plan.powerUps.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="mb-6">
                    <h4 className="gaming-mono text-xs font-bold text-electric-blue mb-2">
                      RECURSOS PRINCIPAIS:
                    </h4>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-led-white/80">
                          {feature.included ? (
                            <Check size={12} className="text-laser-green" />
                          ) : (
                            <X size={12} className="text-led-white/40" />
                          )}
                          <span className={feature.included ? '' : 'text-led-white/40'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-xs text-led-white/60 text-center pt-1">
                          +{plan.features.length - 4} recursos adicionais
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Select Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={audioHelpers.playHover}
                    onClick={(e) => {
                      e.stopPropagation()
                      audioHelpers.playClick(true)
                      trackingHelpers.trackClick(`plan_cta_${plan.id}`)
                    }}
                    className={`
                      w-full px-4 py-3 rounded-md gaming-mono text-sm font-bold
                      ${plan.popular || plan.enterprise 
                        ? 'gaming-button' 
                        : `border ${config.border} ${config.text} hover:${config.bg} transition-all duration-200`
                      }
                    `}
                  >
                    {plan.popular || plan.enterprise ? (
                      <span className="relative z-10">ESCOLHER PLANO</span>
                    ) : (
                      'ESCOLHER PLANO'
                    )}
                  </motion.button>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-led-white/20 p-6 overflow-hidden"
                  >
                    {/* Full Features List */}
                    <div className="mb-6">
                      <h4 className="gaming-mono text-sm font-bold text-neon-cyan mb-3">
                        📋 RECURSOS COMPLETOS:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check size={16} className="text-laser-green mt-0.5 flex-shrink-0" />
                            ) : (
                              <X size={16} className="text-led-white/40 mt-0.5 flex-shrink-0" />
                            )}
                            <div className={feature.included ? '' : 'opacity-40'}>
                              <div className="text-sm text-led-white/90 font-medium">
                                {feature.name}
                              </div>
                              {feature.description && (
                                <div className="text-xs text-led-white/60 mt-1">
                                  {feature.description}
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Support & Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <h5 className="gaming-mono text-xs font-bold text-electric-blue mb-2">
                          SUPORTE:
                        </h5>
                        <p className="text-sm text-led-white/80">{plan.support}</p>
                      </div>
                      <div>
                        <h5 className="gaming-mono text-xs font-bold text-magenta-power mb-2">
                          REVISÕES:
                        </h5>
                        <p className="text-sm text-led-white/80">{plan.revisions}</p>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={audioHelpers.playHover}
                      onClick={(e) => {
                        e.stopPropagation()
                        audioHelpers.playClick(false)
                        trackingHelpers.trackClick(`plan_contact_${plan.id}`)
                      }}
                      className="w-full gaming-card px-4 py-3 text-sm font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300"
                    >
                      FALAR COM ESPECIALISTA
                    </motion.button>
                  </motion.div>
                )}

                {/* Circuit Pattern */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="circuit-pattern opacity-5 w-full h-full" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="gaming-title text-3xl lg:text-4xl font-bold text-neon-cyan mb-4 neon-glow">
              POWER-UPS EXTRAS
            </h2>
            <p className="gaming-subtitle text-lg text-led-white/80 max-w-3xl mx-auto">
              Turbine seu plano com funcionalidades adicionais para maximizar seus resultados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {ADD_ONS.map((addon, index) => {
              const AddonIcon = addon.icon
              return (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="gaming-card p-6 text-center border border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-neon-cyan/20 border border-neon-cyan/50 rounded-lg flex items-center justify-center">
                    <AddonIcon size={24} className="text-neon-cyan" />
                  </div>
                  <h3 className="gaming-title text-sm font-bold text-neon-cyan mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-xs text-led-white/70 mb-3">
                    {addon.description}
                  </p>
                  <div className="gaming-display text-lg font-bold text-laser-green mb-3">
                    +R$ {addon.price.toLocaleString()}
                  </div>
                  <button className="w-full px-3 py-2 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 rounded-md gaming-mono text-xs font-bold transition-all duration-200">
                    ADICIONAR
                  </button>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="gaming-title text-3xl font-bold text-neon-cyan mb-4">
              COMPARAÇÃO DETALHADA
            </h2>
          </div>

          <div className="gaming-card p-6 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-neon-cyan/30">
                  <th className="text-left py-4 px-2 gaming-mono text-sm font-bold text-neon-cyan">
                    RECURSOS
                  </th>
                  {PLANS.map(plan => (
                    <th key={plan.id} className="text-center py-4 px-2">
                      <div className={`gaming-title text-sm font-bold ${rarityConfig[plan.rarity].text}`}>
                        {plan.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS[0].features.map((feature, idx) => (
                  <tr key={idx} className="border-b border-led-white/10 hover:bg-led-white/5">
                    <td className="py-3 px-2 text-sm text-led-white/90">
                      {feature.name}
                    </td>
                    {PLANS.map(plan => {
                      const planFeature = plan.features[idx]
                      return (
                        <td key={plan.id} className="text-center py-3 px-2">
                          {planFeature?.included ? (
                            <Check size={16} className="text-laser-green mx-auto" />
                          ) : (
                            <X size={16} className="text-led-white/40 mx-auto" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="gaming-title text-3xl font-bold text-neon-cyan mb-4">
              PERGUNTAS FREQUENTES
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: 'Posso trocar de plano depois?',
                answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Ajustamos os valores proporcionalmente.'
              },
              {
                question: 'O que acontece se eu cancelar?',
                answer: 'Você mantém acesso até o final do período pago. Todos os seus dados ficam disponíveis por 30 dias para download.'
              },
              {
                question: 'Tem período de teste gratuito?',
                answer: 'Oferecemos uma análise gratuita do seu projeto e uma consultoria de 1 hora sem compromisso.'
              },
              {
                question: 'Como funciona o suporte?',
                answer: 'Cada plano tem um nível de suporte diferente, desde 5x8 até dedicado 24x7. Sempre por chat, email e video-call.'
              }
            ].map((faq, index) => (
              <div key={index} className="gaming-card p-6">
                <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-led-white/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center gaming-card p-8 bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50"
        >
          <h2 className="gaming-title text-2xl lg:text-3xl font-bold text-neon-cyan mb-4">
            READY TO POWER UP?
          </h2>
          <p className="text-lg text-led-white/80 mb-6 max-w-2xl mx-auto">
            Não tem certeza qual plano escolher? Nossa equipe pode ajudar você a 
            encontrar a solução perfeita para seu negócio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(true)
                trackingHelpers.trackClick('plans_main_cta')
              }}
              className="gaming-button text-lg px-8 py-4"
            >
              <span className="relative z-10">FALAR COM ESPECIALISTA</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(false)
                trackingHelpers.trackClick('plans_portfolio_link')
              }}
              className="gaming-card px-8 py-4 text-lg font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300"
            >
              VER PORTFÓLIO
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}