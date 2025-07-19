'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Code, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Twitter,
  Heart,
  ExternalLink,
  Users,
  Briefcase,
  Crown,
  MessageCircle,
  Zap,
  ArrowUp,
  Clock,
  Shield,
  Award,
  Star
} from 'lucide-react'
import { audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface FooterSection {
  title: string
  links: {
    name: string
    href: string
    icon?: React.ElementType
    external?: boolean
  }[]
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Navegação',
    links: [
      { name: 'Início', href: '/', icon: Zap },
      { name: 'Sobre Nós', href: '/sobre', icon: Users },
      { name: 'Serviços', href: '/servicos', icon: Code },
      { name: 'Portfólio', href: '/portfolio', icon: Briefcase },
      { name: 'Planos', href: '/planos', icon: Crown },
      { name: 'Combos', href: '/combos', icon: Star },
      { name: 'Contato', href: '/contato', icon: MessageCircle }
    ]
  },
  {
    title: 'Serviços',
    links: [
      { name: 'Desenvolvimento Web', href: '/servicos#web' },
      { name: 'Desenvolvimento Mobile', href: '/servicos#mobile' },
      { name: 'Integração de IA', href: '/servicos#ai' }
    ]
  },
  {
    title: 'Empresa',
    links: [
      { name: 'Nossa História', href: '/sobre#historia' },
      { name: 'Equipe', href: '/sobre#equipe' },
      { name: 'Valores', href: '/sobre#valores' },
      { name: 'Careers', href: '#', external: true },
      { name: 'Blog', href: '#', external: true },
      { name: 'Imprensa', href: '#', external: true }
    ]
  },
  {
    title: 'Suporte',
    links: [
      { name: 'Central de Ajuda', href: '#', external: true },
      { name: 'Documentação', href: '#', external: true },
      { name: 'Status do Sistema', href: '#', external: true },
      { name: 'Política de Privacidade', href: '#' },
      { name: 'Termos de Uso', href: '#' },
      { name: 'SLA', href: '#' }
    ]
  }
]

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contato@playcodeagency.xyz',
    href: 'mailto:contato@playcodeagency.xyz'
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+55 (11) 95653-4963',
    href: 'tel:+5511956534963'
  },
  {
    icon: MapPin,
    label: 'Localização',
    value: 'São Bernardo do Campo, SP - Brasil',
    href: '#'
  }
]

const SOCIAL_LINKS = [
  { 
    name: 'GitHub', 
    icon: Github, 
    href: '#', 
    color: 'text-led-white hover:text-neon-cyan',
    description: 'Nossos projetos open source'
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    href: '#', 
    color: 'text-electric-blue hover:text-neon-cyan',
    description: 'Conecte-se conosco'
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    href: '#', 
    color: 'text-neon-cyan hover:text-electric-blue',
    description: 'Novidades e updates'
  }
]

const STATS = [
  { label: 'Projetos Entregues', value: '500+', icon: Award },
  { label: 'Clientes Satisfeitos', value: '200+', icon: Users },
  { label: 'Anos de Experiência', value: '25+', icon: Clock },
  { label: 'Uptime Garantido', value: '99.9%', icon: Shield }
]

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    audioHelpers.playNavigation()
    trackingHelpers.trackClick('footer_scroll_top')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLinkClick = (linkName: string, external: boolean = false) => {
    audioHelpers.playClick(false)
    trackingHelpers.trackClick(`footer_${linkName.toLowerCase().replace(/\s+/g, '_')}`)
  }

  if (!mounted) return null

  return (
    <footer className="relative bg-deep-space border-t border-neon-cyan/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 circuit-pattern opacity-5" />
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          onMouseEnter={audioHelpers.playHover}
          className="fixed bottom-6 right-6 w-12 h-12 bg-neon-cyan text-controller-black rounded-full flex items-center justify-center shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 z-40"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      <div className="relative z-10">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 border-b border-neon-cyan/20"
        >
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 bg-neon-cyan/20 border border-neon-cyan/50 rounded-lg flex items-center justify-center">
                      <StatIcon size={24} className="text-neon-cyan" />
                    </div>
                    <div className="gaming-display text-2xl font-bold text-neon-cyan mb-1">
                      {stat.value}
                    </div>
                    <div className="gaming-mono text-xs text-led-white/60 uppercase">
                      {stat.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-6 gap-12">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                {/* Logo */}
                <Link 
                  href="/"
                  onClick={() => handleLinkClick('logo')}
                  className="flex items-center gap-3 mb-6 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-gaming-purple rounded-lg flex items-center justify-center border border-neon-cyan/50 group-hover:border-neon-cyan"
                  >
                    <Code size={24} className="text-led-white" />
                  </motion.div>
                  <div>
                    <div className="gaming-title text-2xl font-bold text-neon-cyan">
                      PlayCode
                    </div>
                    <div className="gaming-mono text-sm text-led-white/60 -mt-1">
                      AGENCY
                    </div>
                  </div>
                </Link>

                <p className="gaming-subtitle text-sm text-led-white/80 mb-6 leading-relaxed">
                  Transformando ideias em realidades digitais através de tecnologia de ponta, 
                  IA avançada e design inovador. Sua jornada épica começa aqui.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  {CONTACT_INFO.map((contact, index) => {
                    const ContactIcon = contact.icon
                    return (
                      <motion.a
                        key={index}
                        href={contact.href}
                        whileHover={{ x: 5 }}
                        onClick={() => handleLinkClick(contact.label)}
                        onMouseEnter={audioHelpers.playHover}
                        className="flex items-center gap-3 text-sm text-led-white/70 hover:text-neon-cyan transition-colors duration-300 group"
                      >
                        <ContactIcon size={16} className="text-neon-cyan group-hover:text-electric-blue transition-colors duration-300" />
                        <div>
                          <div className="gaming-mono text-xs text-led-white/50 uppercase">
                            {contact.label}
                          </div>
                          <div className="font-medium">
                            {contact.value}
                          </div>
                        </div>
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>

              {/* Footer Sections */}
              {FOOTER_SECTIONS.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sectionIndex + 1) * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="lg:col-span-1"
                >
                  <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon
                      return (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            onClick={() => handleLinkClick(link.name, link.external)}
                            onMouseEnter={audioHelpers.playHover}
                            className="flex items-center gap-2 text-sm text-led-white/70 hover:text-neon-cyan transition-colors duration-300 group"
                          >
                            {LinkIcon && (
                              <LinkIcon size={14} className="text-led-white/50 group-hover:text-neon-cyan transition-colors duration-300" />
                            )}
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                            {link.external && (
                              <ExternalLink size={12} className="text-led-white/40 group-hover:text-neon-cyan transition-colors duration-300" />
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-8 border-t border-neon-cyan/20"
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-6">
                <div className="gaming-mono text-sm font-bold text-neon-cyan">
                  CONECTE-SE CONOSCO
                </div>
                <div className="flex gap-4">
                  {SOCIAL_LINKS.map((social) => {
                    const SocialIcon = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={audioHelpers.playHover}
                        onClick={() => {
                          audioHelpers.playClick(false)
                          trackingHelpers.trackClick(`footer_social_${social.name.toLowerCase()}`)
                        }}
                        className={`w-10 h-10 border border-current/30 rounded-lg flex items-center justify-center transition-all duration-300 group ${social.color}`}
                        title={social.description}
                      >
                        <SocialIcon size={18} />
                      </motion.a>
                    )
                  })}
                </div>
              </div>

              {/* Copyright */}
              <div className="flex items-center gap-2 text-sm text-led-white/60">
                <span className="gaming-mono">
                  © 2024 PlayCode Agency. Feito com
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Heart size={16} className="text-magenta-power fill-current" />
                </motion.div>
                <span className="gaming-mono">
                  no Brasil
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievement Notification */}
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="fixed bottom-6 left-6 gaming-card p-4 border-laser-green bg-laser-green/10 max-w-xs z-30"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📧</div>
            <div>
              <div className="gaming-mono text-xs text-laser-green font-bold">
                NEWSLETTER ACHIEVEMENT
              </div>
              <div className="gaming-mono text-xs text-led-white">
                Stay updated +25 XP
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}