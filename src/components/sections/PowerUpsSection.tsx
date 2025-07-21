'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bot, Zap, Cpu, Brain, Search } from 'lucide-react'
import PowerUpCard from '@/components/gaming/PowerUpCard'
import { trackingHelpers } from '@/lib/hooks/useAchievements'
import { audioHelpers } from '@/lib/hooks/useAudio'

const powerUps = [
  {
    id: 'ai_chatbot',
    name: 'AI Companion',
    description: 'Chatbot inteligente com processamento de linguagem natural',
    icon: Bot,
    rarity: 'legendary' as const, // Dourado - IA premium
    level: 15,
    stats: { power: 95, efficiency: 88, innovation: 92 },
    price: 'R$ 1.500',
    fullDescription: 'Chatbot inteligente com IA ChatGPT integrada, capaz de responder perguntas complexas, fazer atendimento automatizado 24/7 e integração com WhatsApp Business.',
    features: [
      'IA ChatGPT integrada',
      'Atendimento 24/7 automatizado',
      'Integração WhatsApp Business',
      'Sistema de tickets inteligente',
      'Treinamento personalizado',
      'Dashboard de analytics',
      'Histórico de conversas',
      'Respostas inteligentes'
    ]
  },
  {
    id: 'performance_boost',
    name: 'Turbo Engine',
    description: 'Otimização avançada de performance e velocidade',
    icon: Zap,
    rarity: 'rare' as const, // Azul elétrico - velocidade
    level: 12,
    stats: { power: 90, efficiency: 95, innovation: 75 },
    price: 'R$ 1.900',
    fullDescription: 'Otimização completa de performance com CDN global, compressão avançada, cache inteligente e monitoramento em tempo real para máxima velocidade.',
    features: [
      'CDN global integrado',
      'Compressão avançada de assets',
      'Cache inteligente multicamada',
      'Otimização de imagens automática',
      'Minificação de código',
      'Lazy loading avançado',
      'Monitoramento de performance',
      'Core Web Vitals otimizados'
    ]
  },
  {
    id: 'ai_processor',
    name: 'Neural Core',
    description: 'Processamento de dados com machine learning avançado',
    icon: Cpu,
    rarity: 'epic' as const, // Roxo - tecnologia avançada
    level: 18,
    stats: { power: 92, efficiency: 87, innovation: 95 },
    price: 'R$ 3.200',
    fullDescription: 'Sistema avançado de machine learning para análise preditiva, processamento de big data e automação inteligente de processos empresariais.',
    features: [
      'Machine Learning personalizado',
      'Análise preditiva avançada',
      'Processamento de big data',
      'Automação inteligente',
      'Reconhecimento de padrões',
      'APIs de IA integradas',
      'Modelos treináveis',
      'Analytics comportamental'
    ]
  },
  {
    id: 'smart_analytics',
    name: 'Mind Reader',
    description: 'Analytics inteligente com insights preditivos',
    icon: Brain,
    rarity: 'mythic' as const, // Verde - poder mítico
    level: 14,
    stats: { power: 88, efficiency: 92, innovation: 85 },
    price: 'R$ 1.650',
    fullDescription: 'Sistema avançado de analytics com dashboards interativos, relatórios automatizados, análise de comportamento do usuário e métricas de engajamento.',
    features: [
      'Dashboards interativos',
      'Relatórios automatizados',
      'Análise de comportamento',
      'Funis de conversão',
      'Métricas de engajamento',
      'Integração Google Analytics',
      'Facebook Pixel avançado',
      'ROI e métricas de negócio'
    ]
  },
  {
    id: 'seo_optimizer',
    name: 'Search Master',
    description: 'Otimização SEO com IA para máxima visibilidade',
    icon: Search,
    rarity: 'common' as const, // Branco - base essencial
    level: 13,
    stats: { power: 82, efficiency: 90, innovation: 78 },
    price: 'R$ 2.800',
    fullDescription: 'Estratégia completa de SEO com auditoria técnica, pesquisa de palavras-chave, otimização on-page, criação de conteúdo otimizado e monitoramento de resultados.',
    features: [
      'Auditoria técnica completa',
      'Pesquisa de palavras-chave',
      'Otimização on-page',
      'Criação de conteúdo SEO',
      'Link building estratégico',
      'Monitoramento de rankings',
      'Relatórios mensais',
      'Google Analytics avançado'
    ]
  }
]

export default function PowerUpsSection() {
  const [expandedPowerUp, setExpandedPowerUp] = useState<string | null>(null)

  const togglePowerUpExpansion = (powerUpId: string) => {
    setExpandedPowerUp(prev => prev === powerUpId ? null : powerUpId)
    audioHelpers.playClick(false)
  }

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Circuit Pattern */}
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="gaming-title text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-neon-cyan">POWER-UPS</span>
            <br />
            <span className="text-magenta-power">DISPONÍVEIS</span>
          </h2>
          
          <p className="gaming-subtitle text-xl text-led-white/80 max-w-3xl mx-auto mb-8">
            Escolha suas habilidades especiais e monte a stack perfeita 
            para dominar o mundo digital. Cada power-up oferece 
            características únicas para seu projeto.
          </p>

          {/* Collection Stats */}
          <div className="flex justify-center space-x-8">
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-laser-green">
                {powerUps.length}
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                POWER-UPS TOTAL
              </div>
            </div>
            
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-electric-blue">
                4
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                RARIDADES
              </div>
            </div>
            
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-plasma-yellow">
                ∞
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                COMBINAÇÕES
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rarity Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="gaming-card p-4">
            <div className="flex flex-wrap justify-center gap-3">
              {['all', 'legendary', 'epic', 'rare', 'common'].map((filter) => (
                <button
                  key={filter}
                  className={`
                    px-4 py-2 rounded-md gaming-mono text-sm font-bold uppercase
                    transition-all duration-200 border
                    ${filter === 'all' 
                      ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' 
                      : 'border-led-white/30 text-led-white/70 hover:border-neon-cyan hover:text-neon-cyan'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Power-ups Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {powerUps.map((powerUp, index) => (
            <motion.div
              key={powerUp.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: 'easeOut'
              }}
              viewport={{ once: true }}
            >
              <PowerUpCard
                {...powerUp}
                isExpanded={expandedPowerUp === powerUp.id}
                onToggleExpansion={() => togglePowerUpExpansion(powerUp.id)}
                onSelect={() => {
                  console.log(`Selected power-up: ${powerUp.name}`)
                  trackingHelpers.trackPowerUpSelect(powerUp.id)
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="gaming-card p-8 max-w-2xl mx-auto">
            <h3 className="gaming-title text-2xl font-bold mb-4 text-gaming-purple">
              MONTE SUA STACK PERFEITA
            </h3>
            
            <p className="gaming-subtitle text-led-white/80 mb-6">
              Combine diferentes power-ups para criar a solução ideal 
              para seu projeto. Nossa equipe ajuda você a escolher 
              a melhor configuração.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                onClick={() => {
                  audioHelpers.playClick(true)
                  trackingHelpers.trackClick('powerups_configure_project')
                }}
                onMouseEnter={audioHelpers.playHover}
                className="gaming-button text-lg px-8 py-4 text-center"
              >
                <span className="relative z-10">CONFIGURAR PROJETO</span>
              </Link>
              
              <Link
                href="/combos"
                onClick={() => {
                  audioHelpers.playClick(false)
                  trackingHelpers.trackClick('powerups_view_combos')
                }}
                onMouseEnter={audioHelpers.playHover}
                className="gaming-card px-8 py-4 text-lg font-semibold text-electric-blue border-electric-blue hover:text-controller-black hover:bg-electric-blue transition-all duration-300 text-center"
              >
                VER COMBOS RECOMENDADOS
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Achievement System Preview */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="fixed bottom-6 left-6 z-50"
        >
          <div className="gaming-card p-4 max-w-xs border-laser-green bg-laser-green/10">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="gaming-mono text-xs text-laser-green font-bold">
                  ACHIEVEMENT UNLOCKED
                </div>
                <div className="gaming-mono text-xs text-led-white">
                  Power-up Explorer +50 XP
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}