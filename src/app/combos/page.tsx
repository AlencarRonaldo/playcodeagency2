'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Crown, 
  Rocket,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Target,
  Code,
  Database,
  Globe,
  Lock,
  Gauge,
  Layers
} from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface Technology {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'hosting' | 'security' | 'monitoring'
  description: string
}

interface Combo {
  id: string
  name: string
  subtitle: string
  description: string
  icon: React.ElementType
  rarity: 'rare' | 'epic' | 'legendary'
  targetAudience: string
  setupCost: string
  monthlyCost: string
  developmentCost: string
  timeline: string
  technologies: Technology[]
  benefits: string[]
  useCases: string[]
  sla: string
  roi: string
  scalability: string
  addOns?: string[]
}

const COMBOS: Combo[] = [
  {
    id: 'startup-essentials',
    name: 'Startup Essentials',
    subtitle: 'VELOCIDADE MÁXIMA',
    description: 'Stack otimizado para startups que precisam validar ideias rapidamente com orçamento limitado',
    icon: Rocket,
    rarity: 'rare',
    targetAudience: 'Startups e PMEs',
    setupCost: 'R$ 2.500 - R$ 5.000',
    monthlyCost: 'R$ 150 - R$ 300/mês',
    developmentCost: 'R$ 80 - R$ 120/hora',
    timeline: '2-4 semanas',
    sla: '99% uptime',
    roi: '3-6 meses',
    scalability: '1K-10K usuários',
    technologies: [
      { name: 'Next.js 15 + React 19', category: 'frontend', description: 'Framework moderno com TypeScript' },
      { name: 'Tailwind CSS 4', category: 'frontend', description: 'Styling utilitário e responsivo' },
      { name: 'Supabase', category: 'database', description: 'PostgreSQL com auth integrado' },
      { name: 'Vercel', category: 'hosting', description: 'Deploy automático e escalável' },
      { name: 'NextAuth.js', category: 'security', description: 'Autenticação simplificada' },
      { name: 'Vercel Analytics', category: 'monitoring', description: 'Métricas de performance' }
    ],
    benefits: [
      'Deploy em minutos com zero configuração',
      'Escalabilidade automática sem intervenção',
      'Stack unificada reduz complexidade',
      'Comunidade ativa e documentação excelente',
      'Prototipagem e iteração ultra-rápida'
    ],
    useCases: [
      'Landing pages e sites institucionais',
      'MVPs e protótipos para validação',
      'E-commerce básico e catálogos',
      'Dashboards administrativos',
      'Apps mobile com Expo/React Native'
    ],
    addOns: ['OpenAI API + Vercel AI SDK', 'Stripe + Mercado Pago', 'Resend + React Email', 'Cloudinary', 'Expo + React Native']
  },
  {
    id: 'corporate-powerhouse',
    name: 'Corporate Powerhouse',
    subtitle: 'PERFORMANCE + SEGURANÇA',
    description: 'Solução robusta para empresas que demandam alta performance, segurança e confiabilidade',
    icon: Shield,
    rarity: 'epic',
    targetAudience: 'Empresas Médias/Corporativas',
    setupCost: 'R$ 8.000 - R$ 15.000',
    monthlyCost: 'R$ 500 - R$ 1.200/mês',
    developmentCost: 'R$ 120 - R$ 180/hora',
    timeline: '6-12 semanas',
    sla: '99.9% uptime',
    roi: '6-12 meses',
    scalability: '10K-100K usuários',
    technologies: [
      { name: 'Next.js + TanStack Query', category: 'frontend', description: 'Performance otimizada com cache inteligente' },
      { name: 'Node.js + Fastify', category: 'backend', description: 'Backend ultra-rápido e eficiente' },
      { name: 'PostgreSQL + Redis', category: 'database', description: 'Banco relacional com cache distribuído' },
      { name: 'AWS + CloudFront', category: 'hosting', description: 'Infraestrutura enterprise na nuvem' },
      { name: 'Auth0 + JWT', category: 'security', description: 'Autenticação enterprise-grade' },
      { name: 'Sentry + DataDog', category: 'monitoring', description: 'Observabilidade completa' }
    ],
    benefits: [
      'Performance otimizada com CDN global',
      'Segurança enterprise-grade com compliance',
      'Monitoring e observabilidade completa',
      'Escalabilidade horizontal automática',
      'Testes automatizados e CI/CD integrado'
    ],
    useCases: [
      'Plataformas SaaS corporativas',
      'E-commerce de médio/grande porte',
      'Sistemas internos e ERPs',
      'APIs públicas com alta demanda',
      'Integração complexa com terceiros'
    ],
    addOns: ['AWS SageMaker + ML', 'Socket.io + WebRTC', 'Algolia + Elasticsearch', 'Bull + Redis Queue', 'React Native + CodePush']
  },
  {
    id: 'enterprise-ultimate',
    name: 'Enterprise Ultimate',
    subtitle: 'ESCALA GLOBAL',
    description: 'Arquitetura distribuída para grandes corporações com requisitos de missão crítica',
    icon: Crown,
    rarity: 'legendary',
    targetAudience: 'Grandes Corporações',
    setupCost: 'R$ 25.000 - R$ 80.000',
    monthlyCost: 'R$ 2.000 - R$ 8.000/mês',
    developmentCost: 'R$ 180 - R$ 300/hora',
    timeline: '3-6 meses',
    sla: '99.99% uptime',
    roi: '12-24 meses',
    scalability: '100K+ usuários',
    technologies: [
      { name: 'Micro-frontends + Design System', category: 'frontend', description: 'Arquitetura modular e escalável' },
      { name: 'Microserviços + Kubernetes', category: 'backend', description: 'Orquestração de containers enterprise' },
      { name: 'Multi-database + Elasticsearch', category: 'database', description: 'Persistência distribuída e busca' },
      { name: 'Multi-cloud + CDN Global', category: 'hosting', description: 'Distribuição geográfica resiliente' },
      { name: 'Keycloak + SAML/OAuth', category: 'security', description: 'Identity management enterprise' },
      { name: 'ELK + Prometheus + Grafana', category: 'monitoring', description: 'Observabilidade enterprise' }
    ],
    benefits: [
      'Arquitetura distribuída e resiliente',
      'Performance global multi-região',
      'Segurança máxima e compliance total',
      'Escalabilidade ilimitada e automática',
      'DevOps e automação completa'
    ],
    useCases: [
      'Plataformas com milhões de usuários',
      'Sistemas financeiros e bancários',
      'Marketplaces de grande escala',
      'Análise de big data e IoT',
      'Aplicações mission-critical'
    ],
    addOns: ['Custom ML + MLOps', 'Blockchain + Web3', 'AWS IoT + MQTT', 'Cloudflare Workers', 'Kafka + Apache Spark']
  }
]

const rarityConfig = {
  rare: {
    border: 'border-electric-blue/60',
    glow: 'shadow-[0_0_15px_rgba(0,212,255,0.4)]',
    gradient: 'from-electric-blue/20 to-electric-blue/10',
    text: 'text-electric-blue',
    accent: 'text-electric-blue',
    bg: 'bg-electric-blue/10'
  },
  epic: {
    border: 'border-gaming-purple/70',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    gradient: 'from-gaming-purple/25 to-gaming-purple/10',
    text: 'text-gaming-purple',
    accent: 'text-gaming-purple',
    bg: 'bg-gaming-purple/10'
  },
  legendary: {
    border: 'border-plasma-yellow/80',
    glow: 'shadow-[0_0_25px_rgba(255,234,0,0.6)]',
    gradient: 'from-plasma-yellow/30 to-plasma-yellow/10',
    text: 'text-plasma-yellow',
    accent: 'text-plasma-yellow',
    bg: 'bg-plasma-yellow/10'
  }
}

const categoryIcons = {
  frontend: Code,
  backend: Database,
  database: Layers,
  hosting: Globe,
  security: Lock,
  monitoring: Gauge
}

export default function CombosPage() {
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'pricing'>('overview')
  const [mounted, setMounted] = useState(false)
  const { playContextMusic } = useAudio()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    trackingHelpers.trackPageView('/combos')
    playContextMusic('default')
  }, [playContextMusic])

  const handleComboSelect = (comboId: string) => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick(`combo_select_${comboId}`)
    setSelectedCombo(selectedCombo === comboId ? null : comboId)
    setActiveTab('overview')
  }

  const handleTabChange = (tab: 'overview' | 'tech' | 'pricing') => {
    audioHelpers.playClick(false)
    setActiveTab(tab)
  }

  const handleQuoteRequest = (comboId?: string) => {
    audioHelpers.playClick(true)
    trackingHelpers.trackClick(`combo_quote_${comboId || 'custom'}`)
    
    // Navigate to contact page with combo pre-selected
    const params = new URLSearchParams()
    if (comboId) {
      params.set('combo', comboId)
      params.set('project_type', 'custom')
    }
    router.push(`/contato?${params.toString()}`)
  }

  const handleSpecialistContact = (comboId?: string) => {
    audioHelpers.playClick(false)
    trackingHelpers.trackClick(`combo_specialist_${comboId || 'custom'}`)
    
    // Navigate to WhatsApp with pre-filled message
    const message = comboId 
      ? `Olá! Gostaria de falar sobre o combo ${COMBOS.find(c => c.id === comboId)?.name || 'personalizado'} que vi no site.`
      : 'Olá! Gostaria de criar um combo personalizado para meu projeto.'
    
    const whatsappUrl = `https://wa.me/5511956534963?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-console">
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
            <Star className="w-8 h-8 text-plasma-yellow" />
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold text-neon-cyan neon-glow">
              COMBOS RECOMENDADOS
            </h1>
            <Star className="w-8 h-8 text-plasma-yellow" />
          </div>
          
          <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 max-w-4xl mx-auto mb-8">
            Stacks tecnológicos otimizados para cada tipo de negócio. 
            Escolha o combo perfeito para dominar seu mercado.
          </p>

          {/* ROI Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { label: 'Time to Market', startup: '2-4 sem', corporate: '6-12 sem', enterprise: '3-6 meses' },
              { label: 'Escalabilidade', startup: '1K-10K', corporate: '10K-100K', enterprise: '100K+' },
              { label: 'ROI Break-even', startup: '3-6 meses', corporate: '6-12 meses', enterprise: '12-24 meses' }
            ].map((metric, index) => (
              <div key={index} className="gaming-card p-4">
                <div className="gaming-mono text-xs font-bold text-neon-cyan mb-3 uppercase">
                  {metric.label}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-electric-blue">Startup:</span>
                    <span className="text-led-white">{metric.startup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gaming-purple">Corporate:</span>
                    <span className="text-led-white">{metric.corporate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-plasma-yellow">Enterprise:</span>
                    <span className="text-led-white">{metric.enterprise}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Combos Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {COMBOS.map((combo, index) => {
            const config = rarityConfig[combo.rarity]
            const isSelected = selectedCombo === combo.id
            const Icon = combo.icon

            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`
                  relative gaming-card cursor-pointer h-fit
                  bg-gradient-to-br ${config.gradient}
                  border-2 ${config.border}
                  hover:${config.glow}
                  transition-all duration-300
                  ${isSelected ? `${config.glow} scale-105` : ''}
                `}
                onClick={() => handleComboSelect(combo.id)}
                onMouseEnter={audioHelpers.playHover}
              >
                {/* Rarity Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className={`
                    px-3 py-1 rounded-full text-xs font-bold gaming-mono uppercase
                    ${config.text} ${config.border} border ${config.bg}
                  `}>
                    {combo.rarity}
                  </div>
                </div>

                <div className="p-6">
                  {/* Icon & Title */}
                  <div className="text-center mb-6">
                    <div className={`
                      w-20 h-20 mx-auto mb-4 rounded-xl
                      bg-gradient-to-br ${config.gradient}
                      border-2 ${config.border}
                      flex items-center justify-center
                    `}>
                      <Icon size={40} className={config.text} />
                    </div>
                    
                    <h3 className={`gaming-title text-2xl font-bold mb-2 ${config.text}`}>
                      {combo.name}
                    </h3>
                    <div className={`gaming-mono text-sm font-bold ${config.accent} mb-2`}>
                      {combo.subtitle}
                    </div>
                    <p className="gaming-subtitle text-sm text-led-white/70 mb-4">
                      {combo.description}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="gaming-mono text-xs text-led-white/60 mb-1">SETUP</div>
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {combo.setupCost.split(' - ')[0]}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="gaming-mono text-xs text-led-white/60 mb-1">TIMELINE</div>
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {combo.timeline}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="gaming-mono text-xs text-led-white/60 mb-1">ESCALA</div>
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {combo.scalability}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="gaming-mono text-xs text-led-white/60 mb-1">SLA</div>
                      <div className={`gaming-display text-sm font-bold ${config.text}`}>
                        {combo.sla}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-full px-4 py-2 rounded-md gaming-mono text-sm font-bold
                      border ${config.border} ${config.text}
                      hover:bg-gradient-to-r ${config.gradient.replace('/10', '/20').replace('/5', '/10')}
                      transition-all duration-200 flex items-center justify-center gap-2
                    `}
                  >
                    {isSelected ? 'VER DETALHES' : 'EXPLORAR COMBO'}
                    <ArrowRight size={16} className={`transform transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </motion.button>
                </div>

                {/* Circuit Pattern */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="circuit-pattern opacity-10 w-full h-full" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Detailed View */}
        <AnimatePresence>
          {selectedCombo && (() => {
            const combo = COMBOS.find(c => c.id === selectedCombo)!
            const config = rarityConfig[combo.rarity]
            return (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className={`gaming-card border-2 ${config.border} ${config.bg} overflow-hidden`}
              >
                {/* Header */}
                <div className="p-6 border-b border-led-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <combo.icon size={32} className={config.text} />
                      <div>
                        <h2 className={`gaming-title text-3xl font-bold ${config.text}`}>
                          {combo.name}
                        </h2>
                        <div className="gaming-mono text-sm text-led-white/70">
                          {combo.targetAudience}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCombo(null)}
                      className="text-led-white/60 hover:text-neon-cyan"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4">
                    {[
                      { id: 'overview', label: 'VISÃO GERAL', icon: Target },
                      { id: 'tech', label: 'TECNOLOGIAS', icon: Code },
                      { id: 'pricing', label: 'INVESTIMENTO', icon: DollarSign }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id as 'overview' | 'tech' | 'pricing')}
                        onMouseEnter={audioHelpers.playHover}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-md gaming-mono text-sm font-bold
                          transition-all duration-200
                          ${activeTab === tab.id 
                            ? `${config.text} ${config.bg} border ${config.border}` 
                            : 'text-led-white/60 hover:text-neon-cyan'
                          }
                        `}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Benefits */}
                      <div>
                        <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-4 flex items-center gap-2">
                          <CheckCircle size={20} />
                          BENEFÍCIOS PRINCIPAIS
                        </h3>
                        <ul className="space-y-3">
                          {combo.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-led-white/80">
                              <CheckCircle size={16} className="text-laser-green mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-4 flex items-center gap-2">
                          <Target size={20} />
                          CASOS DE USO IDEAIS
                        </h3>
                        <ul className="space-y-3">
                          {combo.useCases.map((useCase, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-led-white/80">
                              <Star size={16} className={`${config.text} mt-0.5 flex-shrink-0`} />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tech' && (
                    <div>
                      <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                        <Code size={20} />
                        STACK TECNOLÓGICO
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {combo.technologies.map((tech, idx) => {
                          const CategoryIcon = categoryIcons[tech.category]
                          return (
                            <div key={idx} className="gaming-card p-4 border border-led-white/20">
                              <div className="flex items-center gap-2 mb-2">
                                <CategoryIcon size={16} className="text-neon-cyan" />
                                <span className="gaming-mono text-sm font-bold text-neon-cyan uppercase">
                                  {tech.category}
                                </span>
                              </div>
                              <div className="font-bold text-led-white mb-1">{tech.name}</div>
                              <div className="text-xs text-led-white/70">{tech.description}</div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Add-ons */}
                      {combo.addOns && (
                        <div>
                          <h4 className="gaming-title text-lg font-bold text-electric-blue mb-4">
                            🚀 ADD-ONS DISPONÍVEIS
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {combo.addOns.map((addon, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-electric-blue/20 border border-electric-blue/30 rounded text-sm gaming-mono text-electric-blue"
                              >
                                {addon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'pricing' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Pricing Details */}
                      <div>
                        <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                          <DollarSign size={20} />
                          ESTRUTURA DE INVESTIMENTO
                        </h3>
                        <div className="space-y-4">
                          <div className="gaming-card p-4 border border-led-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="gaming-mono text-sm font-bold text-neon-cyan">SETUP INICIAL</span>
                              <span className="gaming-display text-lg font-bold text-laser-green">
                                {combo.setupCost}
                              </span>
                            </div>
                            <div className="text-xs text-led-white/70">
                              Configuração completa da infraestrutura e ambiente
                            </div>
                          </div>

                          <div className="gaming-card p-4 border border-led-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="gaming-mono text-sm font-bold text-electric-blue">CUSTO MENSAL</span>
                              <span className="gaming-display text-lg font-bold text-electric-blue">
                                {combo.monthlyCost}
                              </span>
                            </div>
                            <div className="text-xs text-led-white/70">
                              Hosting, serviços e infraestrutura em nuvem
                            </div>
                          </div>

                          <div className="gaming-card p-4 border border-led-white/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="gaming-mono text-sm font-bold text-plasma-yellow">DESENVOLVIMENTO</span>
                              <span className="gaming-display text-lg font-bold text-plasma-yellow">
                                {combo.developmentCost}
                              </span>
                            </div>
                            <div className="text-xs text-led-white/70">
                              Customização e desenvolvimento especializado
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ROI Metrics */}
                      <div>
                        <h3 className="gaming-title text-xl font-bold text-neon-cyan mb-6 flex items-center gap-2">
                          <TrendingUp size={20} />
                          MÉTRICAS DE ROI
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Timeline de Entrega', value: combo.timeline, icon: Clock },
                            { label: 'Escalabilidade', value: combo.scalability, icon: Users },
                            { label: 'SLA Garantido', value: combo.sla, icon: Shield },
                            { label: 'ROI Break-even', value: combo.roi, icon: Award }
                          ].map((metric, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-led-white/5 rounded-lg">
                              <metric.icon size={20} className={config.text} />
                              <div className="flex-1">
                                <div className="gaming-mono text-xs text-led-white/70 uppercase">
                                  {metric.label}
                                </div>
                                <div className="font-bold text-led-white">
                                  {metric.value}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Footer */}
                <div className="p-6 border-t border-led-white/20 bg-led-white/5">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={audioHelpers.playHover}
                      onClick={() => handleQuoteRequest(combo.id)}
                      className="gaming-button text-lg px-8 py-4"
                    >
                      <span className="relative z-10">SOLICITAR ORÇAMENTO</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={audioHelpers.playHover}
                      onClick={() => handleSpecialistContact(combo.id)}
                      className="gaming-card px-8 py-4 text-lg font-semibold text-neon-cyan border-neon-cyan hover:text-controller-black hover:bg-neon-cyan transition-all duration-300"
                    >
                      FALAR COM ESPECIALISTA
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center gaming-card p-8 bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50 mt-16"
        >
          <h2 className="gaming-title text-2xl lg:text-3xl font-bold text-neon-cyan mb-4">
            NÃO ENCONTROU O COMBO IDEAL?
          </h2>
          <p className="text-lg text-led-white/80 mb-6 max-w-2xl mx-auto">
            Criamos combos personalizados para necessidades específicas. 
            Fale conosco e monte a stack perfeita para seu projeto!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={audioHelpers.playHover}
            onClick={() => handleQuoteRequest()}
            className="gaming-button text-lg px-8 py-4"
          >
            <span className="relative z-10">CRIAR COMBO PERSONALIZADO</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}