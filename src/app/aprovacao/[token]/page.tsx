'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  DollarSign,
  Calendar,
  User,
  Zap,
  MessageSquare
} from 'lucide-react'

interface TokenData {
  customerId: string;
  email: string;
  projectType: string;
  createdAt: number;
  expiresAt: number;
}

interface ApprovalData {
  customerName: string;
  projectType: string;
  budgetRange: string;
  message: string;
  estimatedValue: number;
  timeline: string;
  services: string[];
  powerUps?: string[];
}

export default function ApprovalPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultAction = searchParams.get('action') as 'approve' | 'reject' | null
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [approvalData, setApprovalData] = useState<ApprovalData | null>(null)
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | null>(defaultAction)
  const [feedback, setFeedback] = useState('')
  
  useEffect(() => {
    loadApprovalData()
  }, [])
  
  const loadApprovalData = async () => {
    try {
      const response = await fetch(`/api/approval/${params.token}`)
      const result = await response.json()
      
      if (!result.success) {
        setError(result.message || 'Erro ao carregar dados da proposta')
        return
      }
      
      setTokenData(result.data.tokenData)
      setApprovalData(result.data.approvalData)
      
    } catch (err) {
      setError('Erro ao carregar dados da proposta')
      console.error('Erro ao carregar approval:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmitDecision = async () => {
    if (!selectedAction) return
    
    setSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/approval/${params.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: selectedAction,
          feedback: feedback.trim() || undefined
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        setError(result.message || 'Erro ao processar decisão')
        return
      }
      
      setSuccess(result.message)
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/')
      }, 3000)
      
    } catch (err) {
      setError('Erro ao processar decisão')
      console.error('Erro ao submeter decisão:', err)
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-console flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="gaming-mono text-led-white/70">Carregando proposta...</p>
        </div>
      </div>
    )
  }
  
  if (error && !approvalData) {
    return (
      <div className="min-h-screen bg-gradient-console flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card max-w-md w-full text-center"
        >
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="gaming-title text-2xl mb-4">Token Inválido</h1>
          <p className="gaming-subtitle mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary w-full"
          >
            Voltar ao Site
          </button>
        </motion.div>
      </div>
    )
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-console flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gaming-card max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-laser-green mx-auto mb-4" />
          <h1 className="gaming-title text-2xl mb-4">Decisão Processada!</h1>
          <p className="gaming-subtitle mb-6">{success}</p>
          <div className="hud-element p-4">
            <p className="gaming-mono text-sm text-led-white/70">
              Redirecionando em 3 segundos...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }
  
  const timeLeft = tokenData ? new Date(tokenData.expiresAt).getTime() - Date.now() : 0
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)))
  const hoursLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  
  return (
    <div className="min-h-screen bg-gradient-console relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 circuit-pattern opacity-10 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gaming-title text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-neon-cyan">PROPOSTA DE</span><br />
              <span className="text-magenta-power">ORÇAMENTO</span>
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="hud-element px-4 py-2">
                <Clock className="w-4 h-4 inline mr-2" />
                <span className="gaming-mono">
                  {daysLeft > 0 ? `${daysLeft} dias` : `${hoursLeft}h restantes`}
                </span>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Proposal Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="gaming-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-5 h-5 text-neon-cyan" />
                  <h3 className="gaming-title text-xl">Informações do Cliente</h3>
                </div>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {approvalData?.customerName}</p>
                  <p><strong>Email:</strong> {tokenData?.email}</p>
                  <p><strong>Projeto:</strong> {approvalData?.projectType}</p>
                </div>
              </motion.div>
              
              {/* Price */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="gaming-card bg-gradient-to-r from-laser-green/20 to-neon-cyan/20 border-laser-green"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign className="w-5 h-5 text-laser-green" />
                  <h3 className="gaming-title text-xl">Valor da Proposta</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-laser-green mb-2">
                    R$ {approvalData?.estimatedValue.toLocaleString('pt-BR')}
                  </div>
                  <p className="gaming-mono text-sm text-led-white/70">
                    Orçamento solicitado: {approvalData?.budgetRange}
                  </p>
                </div>
              </motion.div>
              
              {/* Timeline */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="gaming-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-5 h-5 text-electric-blue" />
                  <h3 className="gaming-title text-xl">Prazo de Entrega</h3>
                </div>
                <p className="text-electric-blue font-semibold text-lg">{approvalData?.timeline}</p>
              </motion.div>
              
              {/* Services */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="gaming-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-5 h-5 text-magenta-power" />
                  <h3 className="gaming-title text-xl">Serviços Inclusos</h3>
                </div>
                <ul className="space-y-2">
                  {approvalData?.services.map((service, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-laser-green flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              {/* Power-ups */}
              {approvalData?.powerUps && approvalData.powerUps.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="gaming-card"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-5 h-5 text-plasma-yellow" />
                    <h3 className="gaming-title text-xl">Power-ups Selecionados</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {approvalData.powerUps.map((powerUp, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-plasma-yellow/20 text-plasma-yellow border border-plasma-yellow/60 rounded-full text-sm gaming-mono"
                      >
                        {powerUp}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Project Description */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="gaming-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-neon-cyan" />
                  <h3 className="gaming-title text-xl">Descrição do Projeto</h3>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-led-white/20">
                  <p className="whitespace-pre-wrap">{approvalData?.message}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Decision Panel */}
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="gaming-card sticky top-6"
              >
                <h3 className="gaming-title text-xl mb-6 text-center">Sua Decisão</h3>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                {/* Action Selection */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setSelectedAction('approve')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedAction === 'approve'
                        ? 'border-laser-green bg-laser-green/20 text-laser-green'
                        : 'border-led-white/30 hover:border-laser-green/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Aprovar Proposta</div>
                        <div className="text-sm opacity-70">Aceitar orçamento e iniciar projeto</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedAction('reject')}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedAction === 'reject'
                        ? 'border-red-400 bg-red-400/20 text-red-400'
                        : 'border-led-white/30 hover:border-red-400/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <XCircle className="w-6 h-6" />
                      <div className="text-left">
                        <div className="font-bold">Rejeitar</div>
                        <div className="text-sm opacity-70">Não tenho interesse no momento</div>
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* Feedback (opcional) */}
                <div className="mb-6">
                  <label className="block gaming-mono text-sm mb-2">
                    Comentários (opcional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Deixe um comentário ou feedback..."
                    className="w-full bg-black/30 border border-led-white/30 rounded-lg p-3 text-sm resize-none focus:border-neon-cyan focus:outline-none"
                    rows={3}
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  onClick={handleSubmitDecision}
                  disabled={!selectedAction || submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    selectedAction === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'
                  )}
                </button>
                
                <p className="text-xs text-led-white/50 text-center mt-4">
                  Esta decisão é final e não pode ser alterada
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}