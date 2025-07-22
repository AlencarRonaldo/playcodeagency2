'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Bot, 
  Rocket,
  Code,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface Service {
  id: string
  name: string
  description: string
  icon: React.ElementType
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  features: string[]
  technologies: string[]
  deliverables: string[]
  timeline: string
  price: string
  highlighted?: boolean
}

const SERVICES: Service[] = [
  {
    id: 'web-development',
    name: 'Desenvolvimento Web',
    description: 'Aplicações web modernas com tecnologias de ponta e design responsivo',
    icon: Globe,
    rarity: 'epic',
    features: [
      'React/Next.js com TypeScript',
      'Design responsivo e mobile-first',
      'Performance otimizada (Core Web Vitals)',
      'SEO avançado e acessibilidade',
      'Integração com APIs e databases',
      'Deploy automatizado na Vercel/AWS'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    deliverables: ['Código fonte completo', 'Documentação técnica', 'Testes automatizados', 'Deploy em produção'],
    timeline: '4-12 semanas',
    price: 'Consultar',
    highlighted: true
  },
  {
    id: 'mobile-development',
    name: 'Desenvolvimento Mobile',
    description: 'Apps nativos e híbridos para iOS e Android com performance superior',
    icon: Smartphone,
    rarity: 'epic',
    features: [
      'React Native ou desenvolvimento nativo',
      'Interface intuitiva e moderna',
      'Integração com serviços nativos',
      'Push notifications e analytics',
      'Offline-first architecture',
      'Publicação nas stores'
    ],
    technologies: ['React Native', 'Swift', 'Kotlin', 'Expo', 'Firebase'],
    deliverables: ['Apps para iOS e Android', 'Backend personalizado', 'Analytics integrado', 'Suporte pós-launch'],
    timeline: '8-16 semanas',
    price: 'Consultar'
  },
  {
    id: 'ai-integration',
    name: 'Integração de IA',
    description: 'Implementação de inteligência artificial para automatizar processos',
    icon: Bot,
    rarity: 'legendary',
    features: [
      'Chatbots inteligentes com OpenAI',
      'Processamento de linguagem natural',
      'Análise preditiva de dados',
      'Automação de workflows',
      'Machine Learning personalizado',
      'Integração com APIs de IA'
    ],
    technologies: ['OpenAI GPT', 'Python', 'TensorFlow', 'Hugging Face', 'LangChain'],
    deliverables: ['Modelo de IA treinado', 'API de integração', 'Dashboard de monitoramento', 'Documentação completa'],
    timeline: '6-20 semanas',
    price: 'Consultar',
    highlighted: true
  }
]

const rarityConfig = {
  common: {
    border: 'border-led-white/30',
    glow: 'shadow-[0_0_10px_rgba(255,255,255,0.3)]',
    gradient: 'from-led-white/10 to-led-white/5',
    text: 'text-led-white',
    accent: 'text-led-white'
  },
  rare: {
    border: 'border-electric-blue/60',
    glow: 'shadow-[0_0_15px_rgba(0,212,255,0.4)]',
    gradient: 'from-electric-blue/20 to-electric-blue/10',
    text: 'text-electric-blue',
    accent: 'text-electric-blue'
  },
  epic: {
    border: 'border-gaming-purple/70',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    gradient: 'from-gaming-purple/25 to-gaming-purple/10',
    text: 'text-gaming-purple',
    accent: 'text-gaming-purple'
  },
  legendary: {
    border: 'border-plasma-yellow/80',
    glow: 'shadow-[0_0_25px_rgba(255,234,0,0.6)]',
    gradient: 'from-plasma-yellow/30 to-plasma-yellow/10',
    text: 'text-plasma-yellow',
    accent: 'text-plasma-yellow'
  }
}

export default function ServicosPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { playContextMusic } = useAudio()

  useEffect(() => {
    setMounted(true)
    
    // Track page view
    trackingHelpers.trackPageView('/servicos')
    
    // Play ambient music
    // Music is now controlled by the MarioAutoPlay component globally
  }, [])

  const handleServiceSelect = (serviceId: string) => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick(`service_${serviceId}`)
    setSelectedService(selectedService === serviceId ? null : serviceId)
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
            <Zap className="w-8 h-8 text-neon-cyan" />
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold text-neon-cyan neon-glow">
              SERVIÇOS
            </h1>
            <Zap className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 max-w-4xl mx-auto mb-8">
            Soluções tecnológicas de elite para dominar o mercado digital. 
            Cada serviço é uma power-up para o sucesso do seu negócio.
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center space-x-8 mb-12"
          >
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-laser-green">500+</div>
              <div className="gaming-mono text-sm text-led-white/60">PROJETOS</div>
            </div>
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-plasma-yellow">98%</div>
              <div className="gaming-mono text-sm text-led-white/60">SATISFAÇÃO</div>
            </div>
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-magenta-power">24/7</div>
              <div className="gaming-mono text-sm text-led-white/60">SUPORTE</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {SERVICES.map((service, index) => {
            const config = rarityConfig[service.rarity]
            const isSelected = selectedService === service.id
            const Icon = service.icon

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -8 }}
                className={`
                  relative gaming-card cursor-pointer
                  bg-gradient-to-br ${config.gradient}
                  border-2 ${config.border}
                  hover:${config.glow}
                  transition-all duration-300
                  ${isSelected ? `${config.glow} scale-105` : ''}
                  ${service.highlighted ? 'ring-2 ring-plasma-yellow/50' : ''}
                `}
                onClick={() => handleServiceSelect(service.id)}
                onMouseEnter={audioHelpers.playHover}
              >
                {/* Highlighted Badge */}
                {service.highlighted && (
                  <div className="absolute -top-3 -right-3 bg-plasma-yellow text-controller-black px-3 py-1 rounded-full gaming-mono text-xs font-bold">
                    ⭐ POPULAR
                  </div>
                )}

                {/* Rarity Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`
                    px-2 py-1 rounded-md text-xs font-bold gaming-mono uppercase
                    ${config.text} ${config.border} border
                    ${config.gradient} bg-gradient-to-r
                  `}>
                    {service.rarity}
                  </div>
                </div>

                <div className="p-6">
                  {/* Service Icon */}
                  <div className={`
                    w-16 h-16 mx-auto mb-4 rounded-xl
                    bg-gradient-to-br ${config.gradient}
                    border ${config.border}
                    flex items-center justify-center
                  `}>
                    <Icon size={32} className={config.text} />
                  </div>

                  {/* Service Info */}
                  <div className="text-center mb-6">
                    <h3 className={`gaming-title text-xl font-bold mb-3 ${config.text}`}>
                      {service.name}
                    </h3>
                    <p className="gaming-subtitle text-sm text-led-white/70 mb-4">
                      {service.description}
                    </p>
                    
                    {/* Timeline */}
                    <div className="text-center mb-4">
                      <span className="gaming-mono text-sm text-neon-cyan font-bold">
                        Timeline: {service.timeline}
                      </span>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
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
                    {isSelected ? 'FECHAR DETALHES' : 'VER DETALHES'}
                    <ArrowRight 
                      size={16} 
                      className={`transform transition-transform ${isSelected ? 'rotate-90' : ''}`} 
                    />
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
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="gaming-mono text-sm font-bold text-neon-cyan mb-3">
                        🚀 RECURSOS INCLUSOS:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-led-white/80">
                            <CheckCircle size={16} className="text-laser-green mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="gaming-mono text-sm font-bold text-electric-blue mb-3">
                        ⚡ TECNOLOGIAS:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-electric-blue/20 border border-electric-blue/30 rounded text-xs gaming-mono text-electric-blue"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-6">
                      <h4 className="gaming-mono text-sm font-bold text-magenta-power mb-3">
                        📦 ENTREGÁVEIS:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-led-white/80">
                            <Star size={12} className="text-magenta-power" />
                            {deliverable}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={audioHelpers.playHover}
                      onClick={(e) => {
                        e.stopPropagation()
                        audioHelpers.playClick(true)
                        trackingHelpers.trackClick(`service_cta_${service.id}`)
                        
                        // Navigate to contact page with service context
                        window.location.href = `/contato?servico=${service.id}`
                      }}
                      className="w-full gaming-button text-sm py-3 mb-2"
                    >
                      <span className="relative z-10">SOLICITAR ORÇAMENTO</span>
                    </motion.button>
                  </motion.div>
                )}

                {/* Circuit Pattern */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="circuit-pattern opacity-10 w-full h-full" />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="gaming-title text-3xl lg:text-4xl font-bold text-neon-cyan mb-8 neon-glow">
            NOSSO PROCESSO
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Target, title: 'ANÁLISE', desc: 'Entendemos suas necessidades e objetivos' },
              { icon: Code, title: 'DESENVOLVIMENTO', desc: 'Criamos a solução com tecnologia de ponta' },
              { icon: Rocket, title: 'DEPLOY', desc: 'Colocamos sua aplicação em produção' },
              { icon: Users, title: 'SUPORTE', desc: 'Acompanhamos e evoluímos continuamente' }
            ].map((step, index) => {
              const StepIcon = step.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="gaming-card p-6 text-center hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/20 border border-neon-cyan/50 rounded-xl flex items-center justify-center">
                    <StepIcon size={32} className="text-neon-cyan" />
                  </div>
                  <h3 className="gaming-display text-lg font-bold text-neon-cyan mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-led-white/70">
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center gaming-card p-8 bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50"
        >
          <h2 className="gaming-title text-2xl lg:text-3xl font-bold text-neon-cyan mb-4">
            READY TO LEVEL UP?
          </h2>
          <p className="text-lg text-led-white/80 mb-6 max-w-2xl mx-auto">
            Transforme sua ideia em realidade digital. Entre em contato e vamos discutir seu projeto!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(true)
                trackingHelpers.trackClick('services_main_cta')
                
                // Navigate to contact page
                window.location.href = '/contato'
              }}
              className="gaming-button text-lg px-8 py-4"
            >
              <span className="relative z-10">INICIAR PROJETOS</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={audioHelpers.playHover}
              onClick={() => {
                audioHelpers.playClick(false)
                trackingHelpers.trackClick('services_portfolio_link')
              }}
              className="gaming-card px-8 py-4 text-lg font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300"
            >
              VER PORTFOLIO
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}