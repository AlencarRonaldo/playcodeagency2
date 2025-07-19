'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Code, 
  Zap, 
  Users, 
  Briefcase, 
  Crown,
  MessageCircle,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Star
} from 'lucide-react'
import { audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  description: string
  external?: boolean
}

const NAVIGATION: NavItem[] = [
  {
    name: 'Início',
    href: '/',
    icon: Zap,
    description: 'Portal principal da PlayCode Agency'
  },
  {
    name: 'Sobre',
    href: '/sobre',
    icon: Users,
    description: 'Nossa história e equipe'
  },
  {
    name: 'Serviços',
    href: '/servicos',
    icon: Code,
    description: 'Soluções e tecnologias'
  },
  {
    name: 'Portfólio',
    href: '/portfolio',
    icon: Briefcase,
    description: 'Projetos e cases de sucesso'
  },
  {
    name: 'Planos',
    href: '/planos',
    icon: Crown,
    description: 'Pacotes e investimento'
  },
  {
    name: 'Combos',
    href: '/combos',
    icon: Star,
    description: 'Stacks tecnológicos recomendados'
  },
  {
    name: 'Contato',
    href: '/contato',
    icon: MessageCircle,
    description: 'Fale conosco'
  }
]

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: Github, href: '#', color: 'text-led-white' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'text-electric-blue' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'text-neon-cyan' }
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    audioHelpers.playNavigation()
    setIsOpen(!isOpen)
    trackingHelpers.trackClick(`header_menu_${isOpen ? 'close' : 'open'}`)
  }

  const handleNavClick = (item: NavItem) => {
    audioHelpers.playClick(false)
    trackingHelpers.trackClick(`nav_${item.name.toLowerCase()}`)
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-deep-space/90 backdrop-blur-md border-b border-neon-cyan/30"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/"
              onClick={() => handleNavClick(NAVIGATION[0])}
              className="flex items-center gap-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-gaming-purple rounded-lg flex items-center justify-center border border-neon-cyan/50 group-hover:border-neon-cyan"
              >
                <Code size={20} className="text-led-white" />
              </motion.div>
              <div>
                <div className="gaming-title text-xl font-bold text-neon-cyan">
                  PlayCode
                </div>
                <div className="gaming-mono text-xs text-led-white/60 -mt-1">
                  AGENCY
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {NAVIGATION.map((item) => {
                const isActive = pathname === item.href
                const ItemIcon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    onMouseEnter={audioHelpers.playHover}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg gaming-mono text-sm font-bold
                      transition-all duration-300 group
                      ${isActive 
                        ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/50' 
                        : 'text-led-white/70 hover:text-neon-cyan hover:bg-neon-cyan/5'
                      }
                    `}
                  >
                    <ItemIcon size={16} />
                    {item.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="gaming-card p-3 min-w-48 border border-neon-cyan/30">
                        <div className="gaming-mono text-xs text-neon-cyan font-bold mb-1">
                          {item.name.toUpperCase()}
                        </div>
                        <div className="text-xs text-led-white/80">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Social Links & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => {
                  const SocialIcon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={audioHelpers.playHover}
                      onClick={() => {
                        audioHelpers.playClick(false)
                        trackingHelpers.trackClick(`social_${social.name.toLowerCase()}`)
                      }}
                      className={`w-8 h-8 ${social.color} hover:text-neon-cyan transition-colors duration-200`}
                    >
                      <SocialIcon size={18} />
                    </motion.a>
                  )
                })}
              </div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contato"
                  onMouseEnter={audioHelpers.playHover}
                  onClick={() => {
                    audioHelpers.playClick(true)
                    trackingHelpers.trackClick('header_cta')
                  }}
                  className="gaming-button px-6 py-2 text-sm"
                >
                  <span className="relative z-10">INICIAR PROJETO</span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              onMouseEnter={audioHelpers.playHover}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-controller-black/80 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-deep-space border-l border-neon-cyan/30 z-50 lg:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-neon-cyan/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-gaming-purple rounded-lg flex items-center justify-center">
                      <Code size={16} className="text-led-white" />
                    </div>
                    <div>
                      <div className="gaming-title text-lg font-bold text-neon-cyan">
                        PlayCode
                      </div>
                      <div className="gaming-mono text-xs text-led-white/60 -mt-1">
                        AGENCY
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-8 h-8 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-6">
                <div className="space-y-2">
                  {NAVIGATION.map((item, index) => {
                    const isActive = pathname === item.href
                    const ItemIcon = item.icon
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => handleNavClick(item)}
                          className={`
                            flex items-center gap-3 p-4 rounded-lg border transition-all duration-300
                            ${isActive 
                              ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan' 
                              : 'border-led-white/10 text-led-white/70 hover:border-neon-cyan/30 hover:text-neon-cyan hover:bg-neon-cyan/5'
                            }
                          `}
                        >
                          <ItemIcon size={20} />
                          <div className="flex-1">
                            <div className="gaming-mono text-sm font-bold">
                              {item.name}
                            </div>
                            <div className="text-xs text-led-white/60 mt-1">
                              {item.description}
                            </div>
                          </div>
                          {item.external && (
                            <ExternalLink size={16} className="text-led-white/40" />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 pt-6 border-t border-neon-cyan/30"
                >
                  <div className="gaming-mono text-xs font-bold text-neon-cyan mb-4">
                    REDES SOCIAIS
                  </div>
                  <div className="flex gap-3">
                    {SOCIAL_LINKS.map((social) => {
                      const SocialIcon = social.icon
                      return (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            audioHelpers.playClick(false)
                            trackingHelpers.trackClick(`mobile_social_${social.name.toLowerCase()}`)
                          }}
                          className={`w-12 h-12 ${social.color} border border-current/30 rounded-lg flex items-center justify-center hover:bg-current/10 transition-all duration-200`}
                        >
                          <SocialIcon size={20} />
                        </motion.a>
                      )
                    })}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8"
                >
                  <Link
                    href="/contato"
                    onClick={() => {
                      audioHelpers.playClick(true)
                      trackingHelpers.trackClick('mobile_header_cta')
                      setIsOpen(false)
                    }}
                    className="gaming-button w-full text-center py-4"
                  >
                    <span className="relative z-10">INICIAR PROJETO</span>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}