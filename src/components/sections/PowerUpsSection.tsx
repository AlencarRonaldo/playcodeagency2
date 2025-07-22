'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Bot, MenuSquare, Users, Brain, Search } from 'lucide-react'
import PowerUpCard from '@/components/gaming/PowerUpCard'
import { trackingHelpers } from '@/lib/hooks/useAchievements'
import { audioHelpers } from '@/lib/hooks/useAudio'

const powerUps = [
  {
    id: 'ai_chatbot',
    name: 'Chatbot com Inteligência Artificial',
    description: 'Atendimento automatizado 24h com IA ChatGPT para aumentar vendas e conversões',
    icon: Bot,
    rarity: 'legendary' as const, // Dourado - IA premium
    level: 15,
    stats: { power: 95, efficiency: 88, innovation: 92 },
    price: 'Sob consulta',
    fullDescription: 'Sistema de chatbot inteligente com IA ChatGPT integrada para atendimento automatizado 24/7. Capaz de responder perguntas complexas, qualificar leads e fazer atendimento personalizado via WhatsApp Business, aumentando vendas e conversões.',
    features: [
      'Integração IA ChatGPT avançada',
      'Atendimento automatizado 24/7',
      'WhatsApp Business API integrado',
      'Sistema de tickets inteligente',
      'Qualificação automática de leads',
      'Dashboard analytics completo',
      'Histórico conversas detalhado',
      'Respostas personalizadas inteligentes'
    ]
  },
  {
    id: 'digital_menu',
    name: 'Cardápio Digital QR Code',
    description: 'Cardápio digital responsivo com QR Code para restaurantes e catálogo empresarial',
    icon: MenuSquare,
    rarity: 'rare' as const, // Azul elétrico - gastronomia
    level: 12,
    stats: { power: 85, efficiency: 90, innovation: 80 },
    price: 'Sob consulta',
    fullDescription: 'Solução completa de cardápio digital responsivo para restaurantes e catálogo digital empresarial. Inclui QR Code personalizado, gestão produtos, galeria fotos profissionais e sistema pedidos integrado WhatsApp.',
    features: [
      'QR Code cardápio personalizado',
      'Design responsivo mobile-first',
      'Gestão produtos/pratos online',
      'Galeria fotos profissionais HD',
      'Categorização inteligente produtos',
      'Sistema pedidos WhatsApp integrado',
      'Analytics visualizações detalhado',
      'SEO otimizado cardápio digital'
    ]
  },
  {
    id: 'specialized_landing',
    name: 'Landing Pages Profissionais',
    description: 'Landing pages otimizadas para advogados, psicólogos, coaches e personal trainers',
    icon: Users,
    rarity: 'epic' as const, // Roxo - especialização profissional
    level: 16,
    stats: { power: 88, efficiency: 92, innovation: 85 },
    price: 'Sob consulta',
    fullDescription: 'Landing pages especializadas para profissionais liberais com alta conversão. Templates personalizados por área profissional, formulários otimizados, integração agendamento online e SEO especializado.',
    features: [
      'Templates profissionais por área',
      'Formulários agendamento otimizados',
      'Integração calendário Google',
      'Seção depoimentos clientes',
      'Área certificações credenciais',
      'Blog profissional SEO integrado',
      'WhatsApp Business integração',
      'SEO especializado profissionais liberais'
    ]
  },
  {
    id: 'management_system',
    name: 'Sistema ERP/CRM Empresarial',
    description: 'Sistema de gestão empresarial completo: CRM, financeiro, agenda e relatórios',
    icon: Brain,
    rarity: 'mythic' as const, // Verde - poder mítico
    level: 16,
    stats: { power: 92, efficiency: 95, innovation: 88 },
    price: 'Sob consulta',
    fullDescription: 'Sistema ERP/CRM empresarial personalizado para organização total da empresa. Gestão completa clientes, controle financeiro, agenda online, relatórios gerenciais e integração WhatsApp em plataforma única.',
    features: [
      'Sistema CRM gestão clientes',
      'Controle financeiro empresarial completo',
      'Agenda online integrada',
      'Relatórios gerenciais automatizados',
      'Integração WhatsApp Business',
      'Backup automático dados',
      'Dashboard executivo personalizado',
      'Módulos empresariais personalizáveis'
    ]
  },
  {
    id: 'seo_optimizer',
    name: 'SEO Otimização Google',
    description: 'Otimização SEO completa com IA para primeira página Google e aumento tráfego',
    icon: Search,
    rarity: 'common' as const, // Branco - base essencial
    level: 13,
    stats: { power: 82, efficiency: 90, innovation: 78 },
    price: 'Sob consulta',
    fullDescription: 'Estratégia SEO completa para primeira página Google. Auditoria técnica detalhada, pesquisa palavras-chave lucrativas, otimização on-page, criação conteúdo SEO e monitoramento rankings Google.',
    features: [
      'Auditoria SEO técnica completa',
      'Pesquisa palavras-chave lucrativas',
      'Otimização on-page avançada',
      'Criação conteúdo SEO otimizado',
      'Link building estratégico qualificado',
      'Monitoramento rankings Google',
      'Relatórios SEO mensais detalhados',
      'Google Analytics configuração avançada'
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
          {/* Slogan Simples */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="gaming-mono text-lg font-bold text-plasma-yellow">
              🚀 SUA IDEIA É NOSSO CHEAT CODE PARA O SUCESSO! 🎯💡
            </div>
          </motion.div>

          <h2 className="gaming-title text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-neon-cyan">DESENVOLVIMENTO WEB</span>
            <br />
            <span className="text-magenta-power">ESPECIALIZADO</span>
          </h2>
          
          <p className="gaming-subtitle text-xl text-led-white/80 max-w-3xl mx-auto mb-8">
            Soluções completas em <strong>desenvolvimento web</strong>, <strong>criação de sites</strong>, 
            <strong>chatbot com IA</strong>, <strong>sistema ERP/CRM</strong> e <strong>SEO para Google</strong>. 
            Tecnologia avançada para aumentar vendas e conversões do seu negócio online.
          </p>

          {/* Collection Stats */}
          <div className="flex justify-center space-x-8">
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-laser-green">
                {powerUps.length}
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                SERVIÇOS DIGITAIS
              </div>
            </div>
            
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-electric-blue">
                40+
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                CLIENTES SATISFEITOS
              </div>
            </div>
            
            <div className="hud-element text-center px-6 py-3">
              <div className="gaming-display text-2xl font-bold text-plasma-yellow">
                10
              </div>
              <div className="gaming-mono text-xs text-led-white/60">
                ANOS EXPERIÊNCIA
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
              SOLUÇÕES WEB PERSONALIZADAS
            </h3>
            
            <p className="gaming-subtitle text-led-white/80 mb-6">
              Combine nossos <strong>serviços de desenvolvimento web</strong> para criar 
              a solução digital perfeita. Nossa equipe especializada ajuda você a escolher 
              as melhores tecnologias para aumentar vendas e resultados online.
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
                <span className="relative z-10">SOLICITAR ORÇAMENTO</span>
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
                VER PACOTES DESENVOLVIMENTO WEB
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Achievement System Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="fixed bottom-20 right-4 z-30"
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