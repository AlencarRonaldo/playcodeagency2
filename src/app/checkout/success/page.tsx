'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  Crown, 
  Mail, 
  Phone, 
  Calendar,
  ArrowRight,
  Download,
  Star,
  Sparkles
} from 'lucide-react'
import { audioHelpers } from '@/lib/hooks/useAudio'
import { trackingHelpers } from '@/lib/hooks/useAchievements'

function CheckoutSuccessContent() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  
  const subscriptionId = searchParams.get('subscription_id')
  const planName = searchParams.get('plan_name') || 'Plano PlayCode'
  const customerEmail = searchParams.get('email') || ''
  const amount = searchParams.get('amount') || '0'

  useEffect(() => {
    setMounted(true)
    audioHelpers.playAchievementUnlocked('legendary')
    trackingHelpers.trackPurchaseComplete({
      subscription_id: subscriptionId || '',
      plan_name: planName,
      amount: parseFloat(amount)
    })
  }, [subscriptionId, planName, amount])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-console relative overflow-hidden">
      {/* Success Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [Math.random() * window.innerHeight, -100]
            }}
            transition={{ 
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 5
            }}
            className="absolute w-2 h-2 bg-plasma-yellow rounded-full"
          />
        ))}
      </div>

      {/* Matrix Rain Background */}
      <div className="matrix-rain opacity-10">
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 10,
              delay: 0.2 
            }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-laser-green/30 to-laser-green/10 rounded-full border-4 border-laser-green animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-laser-green to-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.6)]">
              <CheckCircle className="w-16 h-16 text-controller-black" />
            </div>
            
            {/* Floating sparkles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute w-4 h-4 text-plasma-yellow"
                style={{
                  top: `${20 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
                  left: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`
                }}
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
            ))}
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-12"
          >
            <h1 className="gaming-title text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-laser-green">PAGAMENTO</span>
              <br />
              <span className="text-neon-cyan">CONFIRMADO!</span>
            </h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="gaming-subtitle text-xl lg:text-2xl text-led-white/80 mb-4">
                🎉 Bem-vindo ao time PlayCode Agency! 
              </p>
              <p className="text-lg text-led-white/70">
                Sua assinatura do <span className="text-plasma-yellow font-bold">{planName}</span> foi 
                ativada com sucesso. Prepare-se para uma experiência épica!
              </p>
            </div>
          </motion.div>

          {/* Subscription Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="gaming-card p-6 border border-laser-green/30 bg-laser-green/5">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-plasma-yellow" />
                <h3 className="gaming-title text-lg font-bold text-plasma-yellow">
                  DETALHES DA ASSINATURA
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-led-white/70">Plano:</span>
                  <span className="text-led-white font-bold">{planName}</span>
                </div>
                {subscriptionId && (
                  <div className="flex justify-between">
                    <span className="text-led-white/70">ID:</span>
                    <span className="text-led-white gaming-mono text-xs">
                      {subscriptionId.substring(0, 12)}...
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-led-white/70">Status:</span>
                  <span className="text-laser-green font-bold">ATIVO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-led-white/70">Próxima cobrança:</span>
                  <span className="text-led-white">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="gaming-card p-6 border border-neon-cyan/30 bg-neon-cyan/5">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-neon-cyan" />
                <h3 className="gaming-title text-lg font-bold text-neon-cyan">
                  PRÓXIMOS PASSOS
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-laser-green" />
                  <span className="text-led-white/80">Email de confirmação enviado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-laser-green" />
                  <span className="text-led-white/80">Acesso liberado ao painel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-electric-blue" />
                  <span className="text-led-white/80">Reunião de onboarding agendada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-electric-blue" />
                  <span className="text-led-white/80">Kit de boas-vindas disponível</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="gaming-card p-6 mb-12 border border-gaming-purple/30 bg-gaming-purple/5"
          >
            <h3 className="gaming-title text-xl font-bold text-gaming-purple mb-4">
              🚀 VAMOS COMEÇAR SUA JORNADA!
            </h3>
            <p className="text-led-white/80 mb-6">
              Nossa equipe entrará em contato em até 24 horas para agendar sua sessão de onboarding 
              e começar a trabalhar em seus projetos.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-electric-blue" />
                <div>
                  <div className="text-led-white/70">Email:</div>
                  <div className="text-led-white">contato@playcodeagency.xyz</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-laser-green" />
                <div>
                  <div className="text-led-white/70">WhatsApp:</div>
                  <div className="text-led-white">(11) 95653-4963</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                onMouseEnter={audioHelpers.playHover}
                onClick={() => audioHelpers.playClick(true)}
                className="gaming-button px-8 py-4 text-lg inline-flex items-center gap-3"
              >
                <span className="relative z-10">ACESSAR PAINEL</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="https://wa.me/5511956534963?text=Olá! Acabei de assinar um plano e gostaria de agendar minha sessão de onboarding."
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={audioHelpers.playHover}
                onClick={() => audioHelpers.playClick(false)}
                className="gaming-card px-8 py-4 text-lg border-laser-green text-laser-green hover:text-controller-black hover:bg-laser-green transition-all duration-300 inline-flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                FALAR NO WHATSAPP
              </a>
            </motion.div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-led-white/60">
              Tem dúvidas? Nossa equipe está disponível 24/7 para ajudar você. 
              <br />
              <span className="text-neon-cyan">
                Bem-vindo à família PlayCode Agency! 🎮
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-console flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
        <p className="text-led-white">Carregando...</p>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}