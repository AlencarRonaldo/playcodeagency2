'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ExternalLink, 
  Github, 
  Eye,
  Globe,
  Smartphone,
  Bot,
  Database,
  Cloud,
  Shield,
  Star,
  Award,
  Calendar,
  Users,
  Code,
  Play,
  Target
} from 'lucide-react'
import { useAudio, audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  category: 'web' | 'mobile' | 'ai' | 'backend' | 'devops' | 'security'
  technologies: string[]
  features: string[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  status: 'completed' | 'in-progress' | 'upcoming'
  client: string
  duration: string
  teamSize: number
  year: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
  impact: {
    users?: string
    revenue?: string
    performance?: string
    other?: string
  }
  awards?: string[]
}

const PROJECTS: Project[] = [
  {
    id: 'rc-suporte',
    title: 'RC Suporte',
    description: 'Portal corporativo para empresa de infraestrutura tecnológica em São Bernardo do Campo',
    longDescription: 'Website institucional completo para RC Suporte, empresa especializada em cabeamento estruturado, CFTV IP, projetos elétricos e Wi-Fi corporativo. Site desenvolvido com foco em conversão e geração de leads para o mercado B2B da região do ABC Paulista.',
    category: 'web',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Google Analytics', 'Responsive Design', 'Google Tag Manager'],
    features: ['Calculadora de serviços', 'Portfolio showcase', 'Depoimentos de clientes', 'Integração WhatsApp', 'Newsletter signup', 'Design responsivo'],
    rarity: 'epic',
    status: 'completed',
    client: 'RC Suporte',
    duration: '3 meses',
    teamSize: 3,
    year: '2023',
    images: ['/portfolio/rc-suporte-1.jpg', '/portfolio/rc-suporte-2.jpg'],
    liveUrl: 'https://rcsuporte.com.br',
    impact: {
      users: '10K+',
      performance: '+150% leads',
      other: 'Certificação Fluke'
    },
    awards: ['Melhor Site Corporativo B2B 2023']
  },
  {
    id: 'carvalho-pics',
    title: 'Carvalho\'s Pics Photography',
    description: 'Plataforma de fotografia esportiva profissional com galeria dinâmica e vendas online',
    longDescription: 'Site especializado em fotografia esportiva desenvolvido para fotógrafo credenciado FIFA/CBF. Inclui galeria dinâmica para mais de 50.000 fotos, sistema de vendas online integrado, área de downloads para clientes e portfólio diversificado cobrindo múltiplas modalidades esportivas.',
    category: 'web',
    technologies: ['React', 'Next.js', 'JavaScript', 'Google Analytics', 'E-commerce Integration', 'Image Optimization'],
    features: ['Galeria de 50K+ fotos', 'Sistema de vendas online', 'Entrega expressa 24-48h', 'Credenciamento FIFA/CBF', 'Múltiplas modalidades', 'Downloads para clientes'],
    rarity: 'legendary',
    status: 'completed',
    client: 'Rones Carvalho',
    duration: '4 meses',
    teamSize: 2,
    year: '2024',
    images: ['/portfolio/carvalho-pics-1.jpg', '/portfolio/carvalho-pics-2.jpg'],
    liveUrl: 'https://carvalhopics.com.br',
    impact: {
      users: '8 anos experiência',
      performance: '500+ eventos',
      other: '50K+ fotos'
    },
    awards: ['Fotografia Esportiva de Excelência 2024']
  },
  {
    id: 'ecommerce-ai',
    title: 'NeuroCommerce AI',
    description: 'Plataforma de e-commerce com IA para recomendações personalizadas',
    longDescription: 'Sistema completo de e-commerce integrado com machine learning para análise de comportamento de usuários e recomendações personalizadas em tempo real. Implementação de chatbot inteligente para atendimento 24/7.',
    category: 'ai',
    technologies: ['React', 'Node.js', 'TensorFlow', 'PostgreSQL', 'Redis', 'OpenAI'],
    features: ['Recomendações IA', 'Chatbot inteligente', 'Analytics avançado', 'Payment Gateway', 'Admin Dashboard'],
    rarity: 'legendary',
    status: 'completed',
    client: 'TechStore Brasil',
    duration: '6 meses',
    teamSize: 4,
    year: '2024',
    images: ['/portfolio/ecommerce-1.jpg', '/portfolio/ecommerce-2.jpg'],
    liveUrl: '#',
    githubUrl: '#',
    caseStudyUrl: '#',
    impact: {
      users: '50K+',
      revenue: '+180%',
      performance: '95% faster'
    },
    awards: ['Best AI Implementation 2024', 'Innovation Award']
  },
  {
    id: 'fintech-mobile',
    title: 'CyberBank Mobile',
    description: 'App bancário com segurança biométrica e blockchain',
    longDescription: 'Aplicativo móvel para banco digital com implementação de blockchain para transações seguras, autenticação biométrica avançada e interface intuitiva para gestão financeira completa.',
    category: 'mobile',
    technologies: ['React Native', 'TypeScript', 'Blockchain', 'Biometrics', 'AWS'],
    features: ['Autenticação biométrica', 'Transações blockchain', 'PIX integrado', 'Investimentos', 'Cards virtuais'],
    rarity: 'epic',
    status: 'completed',
    client: 'NeoBank',
    duration: '8 meses',
    teamSize: 5,
    year: '2024',
    images: ['/portfolio/fintech-1.jpg', '/portfolio/fintech-2.jpg'],
    liveUrl: '#',
    impact: {
      users: '100K+',
      revenue: '+220%',
      other: '99.9% uptime'
    }
  },
  {
    id: 'healthcare-platform',
    title: 'MediCore System',
    description: 'Plataforma completa para gestão hospitalar e telemedicina',
    longDescription: 'Sistema integrado para gestão hospitalar com módulos de telemedicina, prontuário eletrônico, agendamento inteligente e integração com dispositivos IoT para monitoramento de pacientes.',
    category: 'web',
    technologies: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'WebRTC', 'IoT'],
    features: ['Telemedicina', 'Prontuário eletrônico', 'Agendamento inteligente', 'IoT integration', 'Dashboard analytics'],
    rarity: 'legendary',
    status: 'completed',
    client: 'Hospital São Lucas',
    duration: '12 meses',
    teamSize: 6,
    year: '2023',
    images: ['/portfolio/healthcare-1.jpg', '/portfolio/healthcare-2.jpg'],
    impact: {
      users: '5K+',
      performance: '70% efficiency',
      other: '24/7 monitoring'
    },
    awards: ['Healthcare Innovation 2023']
  },
  {
    id: 'logistics-ai',
    title: 'SmartLogistics AI',
    description: 'Sistema de otimização de rotas com machine learning',
    longDescription: 'Plataforma de gestão logística com IA para otimização de rotas em tempo real, previsão de demanda e automação de processos de distribuição.',
    category: 'ai',
    technologies: ['Python', 'TensorFlow', 'React', 'MongoDB', 'Docker', 'Kubernetes'],
    features: ['Otimização de rotas', 'Previsão de demanda', 'Tracking em tempo real', 'Analytics preditivo', 'API integrations'],
    rarity: 'epic',
    status: 'completed',
    client: 'TransportMax',
    duration: '5 meses',
    teamSize: 4,
    year: '2024',
    images: ['/portfolio/logistics-1.jpg'],
    liveUrl: '#',
    impact: {
      performance: '40% cost reduction',
      other: '60% faster delivery'
    }
  }
]

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Target, color: 'text-neon-cyan' },
  { id: 'web', name: 'Web Apps', icon: Globe, color: 'text-laser-green' },
  { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'text-electric-blue' },
  { id: 'ai', name: 'AI/ML', icon: Bot, color: 'text-plasma-yellow' },
  { id: 'backend', name: 'Backend', icon: Database, color: 'text-gaming-purple' },
  { id: 'devops', name: 'DevOps', icon: Cloud, color: 'text-magenta-power' },
  { id: 'security', name: 'Security', icon: Shield, color: 'text-voltage-purple' }
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

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { playContextMusic } = useAudio()

  useEffect(() => {
    setMounted(true)
    
    // Track page view
    trackingHelpers.trackPageView('/portfolio')
    
    // Play ambient music
    playContextMusic('default')
  }, [playContextMusic])

  const filteredProjects = selectedCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === selectedCategory)

  const handleCategorySelect = (categoryId: string) => {
    audioHelpers.playNavigation()
    trackingHelpers.trackClick(`portfolio_filter_${categoryId}`)
    setSelectedCategory(categoryId)
    setSelectedProject(null)
  }

  const handleProjectSelect = (projectId: string) => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick(`portfolio_project_${projectId}`)
    setSelectedProject(selectedProject === projectId ? null : projectId)
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
            <Code className="w-8 h-8 text-neon-cyan" />
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold text-neon-cyan neon-glow">
              PORTFÓLIO
            </h1>
            <Code className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 max-w-4xl mx-auto mb-8">
            Descubra nossas conquistas épicas: projetos que transformaram ideias 
            em soluções digitais revolucionárias e impactantes.
          </p>

          {/* Portfolio Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center space-x-8 mb-12"
          >
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-laser-green">{PROJECTS.length}</div>
              <div className="gaming-mono text-sm text-led-white/60">PROJETOS</div>
            </div>
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-plasma-yellow">
                {PROJECTS.filter(p => p.awards?.length).length}
              </div>
              <div className="gaming-mono text-sm text-led-white/60">AWARDS</div>
            </div>
            <div className="text-center">
              <div className="gaming-display text-3xl font-bold text-magenta-power">
                {PROJECTS.filter(p => p.status === 'completed').length}
              </div>
              <div className="gaming-mono text-sm text-led-white/60">CONCLUÍDOS</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="gaming-card p-4">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((category) => {
                const CategoryIcon = category.icon
                const isSelected = selectedCategory === category.id
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={audioHelpers.playHover}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md gaming-mono text-sm font-bold uppercase
                      transition-all duration-200 border
                      ${isSelected
                        ? `border-neon-cyan ${category.color} bg-neon-cyan/10` 
                        : 'border-led-white/30 text-led-white/70 hover:border-neon-cyan hover:text-neon-cyan'
                      }
                    `}
                  >
                    <CategoryIcon size={16} />
                    {category.name}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
          >
            {filteredProjects.map((project, index) => {
              const config = rarityConfig[project.rarity]
              const isSelected = selectedProject === project.id
              const categoryInfo = CATEGORIES.find(c => c.id === project.category)
              const CategoryIcon = categoryInfo?.icon || Globe

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className={`
                    relative gaming-card cursor-pointer overflow-hidden
                    bg-gradient-to-br ${config.gradient}
                    border-2 ${config.border}
                    hover:${config.glow}
                    transition-all duration-300
                    ${isSelected ? `${config.glow} scale-105` : ''}
                  `}
                  onClick={() => handleProjectSelect(project.id)}
                  onMouseEnter={audioHelpers.playHover}
                >
                  {/* Status & Rarity Badges */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <div className={`
                      px-2 py-1 rounded-md text-xs font-bold gaming-mono uppercase
                      ${config.text} ${config.border} border bg-gradient-to-r ${config.gradient}
                    `}>
                      {project.rarity}
                    </div>
                    {project.status === 'in-progress' && (
                      <div className="px-2 py-1 rounded-md text-xs font-bold gaming-mono uppercase bg-magenta-power/20 border border-magenta-power/50 text-magenta-power">
                        EM DESENVOLVIMENTO
                      </div>
                    )}
                  </div>

                  {/* Awards Badge */}
                  {project.awards && project.awards.length > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-plasma-yellow/20 border border-plasma-yellow/50 rounded-md">
                        <Award size={12} className="text-plasma-yellow" />
                        <span className="gaming-mono text-xs font-bold text-plasma-yellow">
                          {project.awards.length}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Project Image Placeholder */}
                    <div className={`
                      w-full h-48 mb-4 rounded-lg overflow-hidden
                      bg-gradient-to-br ${config.gradient}
                      border ${config.border}
                      flex items-center justify-center
                    `}>
                      <div className="text-center">
                        <CategoryIcon size={48} className={config.text} />
                        <div className="gaming-mono text-xs mt-2 text-led-white/60">
                          {project.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="mb-6">
                      <h3 className={`gaming-title text-xl font-bold mb-2 ${config.text}`}>
                        {project.title}
                      </h3>
                      <p className="gaming-subtitle text-sm text-led-white/70 mb-3">
                        {project.description}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex justify-between items-center text-xs gaming-mono text-led-white/60 mb-4">
                        <span>{project.client}</span>
                        <span>{project.year}</span>
                      </div>

                      {/* Tech Stack Preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs gaming-mono ${config.text} border ${config.border} bg-gradient-to-r ${config.gradient.replace('/10', '/20').replace('/5', '/10')}`}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 rounded text-xs gaming-mono text-led-white/60 border border-led-white/20">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Impact Stats */}
                      {Object.keys(project.impact).length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {Object.entries(project.impact).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className={`gaming-display text-lg font-bold ${config.text}`}>
                                {value}
                              </div>
                              <div className="gaming-mono text-xs text-led-white/60 uppercase">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4">
                      {project.liveUrl && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            audioHelpers.playClick(false)
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border ${config.border} ${config.text} hover:bg-gradient-to-r ${config.gradient.replace('/10', '/20')} transition-all text-xs gaming-mono font-bold`}
                        >
                          <Eye size={14} />
                          DEMO
                        </button>
                      )}
                      {project.githubUrl && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            audioHelpers.playClick(false)
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border ${config.border} ${config.text} hover:bg-gradient-to-r ${config.gradient.replace('/10', '/20')} transition-all text-xs gaming-mono font-bold`}
                        >
                          <Github size={14} />
                          CODE
                        </button>
                      )}
                    </div>

                    {/* Expand Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full px-4 py-3 rounded-md gaming-mono text-sm font-bold
                        border ${config.border} ${config.text}
                        hover:bg-gradient-to-r ${config.gradient.replace('/10', '/20')}
                        transition-all duration-200 flex items-center justify-center gap-2
                      `}
                    >
                      {isSelected ? 'FECHAR DETALHES' : 'VER DETALHES'}
                      <Play size={16} className={`transform transition-transform ${isSelected ? 'rotate-90' : ''}`} />
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
                      {/* Long Description */}
                      <div className="mb-6">
                        <h4 className="gaming-mono text-sm font-bold text-neon-cyan mb-3">
                          📋 DESCRIÇÃO COMPLETA:
                        </h4>
                        <p className="text-sm text-led-white/80 leading-relaxed">
                          {project.longDescription}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="gaming-mono text-sm font-bold text-electric-blue mb-3">
                          ⚡ FUNCIONALIDADES:
                        </h4>
                        <ul className="space-y-1">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-led-white/80">
                              <Star size={12} className="text-electric-blue" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* All Technologies */}
                      <div className="mb-6">
                        <h4 className="gaming-mono text-sm font-bold text-gaming-purple mb-3">
                          🛠️ STACK COMPLETA:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gaming-purple/20 border border-gaming-purple/30 rounded text-xs gaming-mono text-gaming-purple"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="mb-6">
                        <h4 className="gaming-mono text-sm font-bold text-magenta-power mb-3">
                          📊 DETALHES DO PROJETO:
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-magenta-power" />
                            <span className="text-led-white/80">{project.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users size={16} className="text-magenta-power" />
                            <span className="text-led-white/80">{project.teamSize} pessoas</span>
                          </div>
                        </div>
                      </div>

                      {/* Awards */}
                      {project.awards && project.awards.length > 0 && (
                        <div className="mb-6">
                          <h4 className="gaming-mono text-sm font-bold text-plasma-yellow mb-3">
                            🏆 RECONHECIMENTOS:
                          </h4>
                          <div className="space-y-2">
                            {project.awards.map((award, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-led-white/80">
                                <Award size={12} className="text-plasma-yellow" />
                                {award}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All Impact Stats */}
                      {Object.keys(project.impact).length > 0 && (
                        <div className="mb-6">
                          <h4 className="gaming-mono text-sm font-bold text-laser-green mb-3">
                            📈 IMPACTO:
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(project.impact).map(([key, value]) => (
                              <div key={key} className="hud-element text-center">
                                <div className="gaming-display text-lg font-bold text-laser-green">
                                  {value}
                                </div>
                                <div className="gaming-mono text-xs text-led-white/60 uppercase">
                                  {key}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={audioHelpers.playHover}
                            onClick={(e) => {
                              e.stopPropagation()
                              audioHelpers.playClick(true)
                              trackingHelpers.trackClick(`portfolio_demo_${project.id}`)
                            }}
                            className="flex-1 gaming-button text-sm py-2"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <ExternalLink size={16} />
                              VER DEMO
                            </span>
                          </motion.button>
                        )}
                        {project.caseStudyUrl && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={audioHelpers.playHover}
                            onClick={(e) => {
                              e.stopPropagation()
                              audioHelpers.playClick(false)
                              trackingHelpers.trackClick(`portfolio_case_study_${project.id}`)
                            }}
                            className="flex-1 gaming-card px-4 py-2 text-sm font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300"
                          >
                            CASE STUDY
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Circuit Pattern */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="circuit-pattern opacity-5 w-full h-full" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center gaming-card p-8 bg-gradient-to-r from-gaming-purple/20 to-neon-cyan/20 border-2 border-neon-cyan/50"
        >
          <h2 className="gaming-title text-2xl lg:text-3xl font-bold text-neon-cyan mb-4">
            PRONTO PARA O PRÓXIMO LEVEL?
          </h2>
          <p className="text-lg text-led-white/80 mb-6 max-w-2xl mx-auto">
            Transforme sua ideia em um projeto épico como estes. Vamos criar algo revolucionário juntos!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              onClick={() => {
                audioHelpers.playClick(true)
                trackingHelpers.trackClick('portfolio_main_cta')
              }}
              onMouseEnter={audioHelpers.playHover}
              className="gaming-button text-lg px-8 py-4 text-center"
            >
              <span className="relative z-10">INICIAR PROJETO</span>
            </Link>
            
            <Link
              href="/servicos"
              onClick={() => {
                audioHelpers.playClick(false)
                trackingHelpers.trackClick('portfolio_services_link')
              }}
              onMouseEnter={audioHelpers.playHover}
              className="gaming-card px-8 py-4 text-lg font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300 text-center"
            >
              VER SERVIÇOS
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}