'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, X, ChevronUp } from 'lucide-react'
import { audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

interface WhatsAppFloatProps {
  phoneNumber: string
  position?: 'bottom-left' | 'bottom-right'
  companyName?: string
  showTooltip?: boolean
  message?: string
  autoShow?: boolean
  scrollThreshold?: number
}

export default function WhatsAppFloat({
  phoneNumber,
  position = 'bottom-left',
  companyName = 'PlayCode Agency',
  showTooltip = true,
  message = 'Olá! Gostaria de saber mais sobre os serviços da PlayCode Agency 🎮',
  autoShow = true,
  scrollThreshold = 100
}: WhatsAppFloatProps) {
  const [isVisible, setIsVisible] = useState(!autoShow)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltipState, setShowTooltipState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (autoShow) {
      const handleScroll = () => {
        const scrolled = window.scrollY > scrollThreshold
        setIsVisible(scrolled)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [autoShow, scrollThreshold])

  // Auto-show tooltip after component appears
  useEffect(() => {
    if (isVisible && showTooltip && !isExpanded) {
      const timer = setTimeout(() => {
        setShowTooltipState(true)
        // Auto-hide tooltip after 5 seconds
        const hideTimer = setTimeout(() => {
          setShowTooltipState(false)
        }, 5000)
        return () => clearTimeout(hideTimer)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, showTooltip, isExpanded])

  const handleMainClick = () => {
    audioHelpers.playClick(true)
    trackingHelpers.trackClick('whatsapp_main_button')
    
    if (isExpanded) {
      setIsExpanded(false)
      setShowTooltipState(false)
    } else {
      setIsExpanded(true)
      setShowTooltipState(false)
    }
  }

  const handleWhatsAppClick = () => {
    audioHelpers.playPowerUpSelect()
    trackingHelpers.trackClick('whatsapp_chat')
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCallClick = () => {
    audioHelpers.playClick(false)
    trackingHelpers.trackClick('whatsapp_call')
    
    window.open(`tel:+${phoneNumber}`, '_self')
  }

  const positionClasses = {
    'bottom-left': 'bottom-6 left-6',
    'bottom-right': 'bottom-6 right-6'
  }

  if (!mounted || !isVisible) return null

  return (
    <div className={`fixed ${positionClasses[position]} z-35 flex flex-col items-start gap-3`}>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltipState && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="gaming-card p-4 max-w-xs border-neon-cyan bg-neon-cyan/10 relative"
          >
            {/* Close button */}
            <button
              onClick={() => setShowTooltipState(false)}
              onMouseEnter={audioHelpers.playHover}
              className="absolute -top-2 -right-2 w-6 h-6 bg-controller-black border border-neon-cyan/50 rounded-full flex items-center justify-center text-neon-cyan hover:bg-neon-cyan hover:text-controller-black transition-all duration-200"
            >
              <X size={12} />
            </button>

            {/* Tooltip content */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <div className="gaming-mono text-xs font-bold text-neon-cyan mb-1">
                  💬 CHAT DIRETO
                </div>
                <div className="text-xs text-led-white/80 leading-relaxed">
                  Fale conosco agora! Nossa equipe está online para te ajudar com seu projeto.
                </div>
                <div className="gaming-mono text-xs text-green-400 mt-2">
                  ⚡ Resposta em minutos
                </div>
              </div>
            </div>

            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-neon-cyan/10 border-r border-b border-neon-cyan/30 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.3, staggerChildren: 0.1 }}
            className="flex flex-col gap-2"
          >
            {/* WhatsApp Chat Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              onMouseEnter={audioHelpers.playHover}
              className="flex items-center gap-3 px-4 py-3 gaming-card border border-green-500/50 bg-green-500/10 hover:bg-green-500/20 transition-all duration-300 min-w-48"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div className="text-left">
                <div className="gaming-mono text-sm font-bold text-green-400">
                  CHAT WHATSAPP
                </div>
                <div className="text-xs text-led-white/70">
                  Conversar agora
                </div>
              </div>
            </motion.button>

            {/* Call Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCallClick}
              onMouseEnter={audioHelpers.playHover}
              className="flex items-center gap-3 px-4 py-3 gaming-card border border-electric-blue/50 bg-electric-blue/10 hover:bg-electric-blue/20 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-neon-cyan rounded-full flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div className="text-left">
                <div className="gaming-mono text-sm font-bold text-electric-blue">
                  LIGAR AGORA
                </div>
                <div className="text-xs text-led-white/70">
                  (11) 95653-4963
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleMainClick}
        onMouseEnter={audioHelpers.playHover}
        className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all duration-300 border-2 border-green-500/50 hover:border-green-400"
      >
        {/* Notification Badge */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-controller-black flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>

        {/* Main Icon */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 180, opacity: 1 }}
              exit={{ rotate: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Effect */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-green-500 rounded-full"
        />

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30" />
      </motion.button>

      {/* Status Indicator */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="gaming-mono text-xs text-green-400">
            ONLINE
          </span>
        </motion.div>
      )}
    </div>
  )
}