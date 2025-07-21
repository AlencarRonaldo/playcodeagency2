'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap,
  Trophy,
  Target,
  BarChart3,
  Brain,
  Gamepad2
} from 'lucide-react'
import { crmManager } from '@/lib/crm/manager'
import { CRMAnalytics, CRMNotification, GamingLead } from '@/lib/crm/types'
import { audioHelpers } from '@/lib/hooks/useAudio'

interface CRMDashboardProps {
  className?: string
}

export default function CRMDashboard({ className = '' }: CRMDashboardProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>('hubspot')
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null)
  const [notifications, setNotifications] = useState<CRMNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'analytics' | 'settings'>('overview')

  useEffect(() => {
    // Load analytics
    loadAnalytics()
    
    // Subscribe to CRM events
    const handleCRMEvent = (event: any) => {
      if (event.metadata?.isNotification) {
        setNotifications(crmManager.getNotifications())
      }
    }

    crmManager.on('*', handleCRMEvent)
    
    return () => {
      crmManager.off('*', handleCRMEvent)
    }
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await crmManager.getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  const connectCRM = async () => {
    setIsLoading(true)
    audioHelpers.playClick(true)

    try {
      // In a real app, these would come from environment variables or a secure config
      const config = {
        provider: selectedProvider,
        apiKey: process.env.NEXT_PUBLIC_CRM_API_KEY || 'demo-key',
        customFields: {},
        features: {
          twoWaySync: true,
          realTimeUpdates: true,
          customFields: true,
          automations: true,
          analytics: true
        },
        mappings: []
      }

      const connected = await crmManager.initializeProvider(selectedProvider, config)
      setIsConnected(connected)
      
      if (connected) {
        audioHelpers.playLevelUp()
        await loadAnalytics()
      } else {
        audioHelpers.playError()
      }
    } catch (error) {
      console.error('CRM connection error:', error)
      audioHelpers.playError()
    } finally {
      setIsLoading(false)
    }
  }

  const syncAllLeads = async () => {
    setIsLoading(true)
    audioHelpers.playClick(false)

    try {
      // In a real app, this would fetch leads from database
      const mockLeads: GamingLead[] = [
        {
          id: 'lead_1',
          email: 'demo@example.com',
          name: 'Demo Player',
          leadScore: 750,
          playerLevel: 'power_up_selection',
          achievements: ['first_contact', 'power_scout'],
          powerUps: ['React', 'Node.js', 'AI/ML'],
          projectType: 'webapp',
          budgetRange: 'medium',
          urgency: 'normal',
          message: 'Looking for a gaming-themed web app',
          source: 'website',
          createdAt: new Date(),
          updatedAt: new Date(),
          syncStatus: 'pending'
        }
      ]

      const results = await crmManager.bulkSyncLeads(mockLeads)
      const successful = results.filter(r => r.success).length
      
      if (successful > 0) {
        audioHelpers.playAchievementUnlocked('epic')
      }
    } catch (error) {
      console.error('Sync error:', error)
      audioHelpers.playError()
    } finally {
      setIsLoading(false)
    }
  }

  const providers = crmManager.getSupportedProviders()

  return (
    <div className={`min-h-screen bg-gradient-console p-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Brain className="w-8 h-8 text-neon-cyan" />
            <h1 className="gaming-title text-3xl font-bold text-neon-cyan neon-glow">
              CRM COMMAND CENTER
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg gaming-mono text-sm font-bold ${
              isConnected 
                ? 'bg-laser-green/20 text-laser-green border border-laser-green/50' 
                : 'bg-led-white/10 text-led-white/60 border border-led-white/20'
            }`}>
              {isConnected ? '● CONNECTED' : '○ DISCONNECTED'}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={syncAllLeads}
              disabled={!isConnected || isLoading}
              className="gaming-button-secondary px-4 py-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              SYNC ALL
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          {(['overview', 'leads', 'analytics', 'settings'] as const).map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(tab)
                audioHelpers.playHover()
              }}
              className={`px-6 py-2 rounded-lg gaming-mono text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                  : 'bg-led-white/10 text-led-white/60 hover:bg-led-white/20'
              }`}
            >
              {tab.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-4 gap-6"
          >
            {/* Quick Stats */}
            <div className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-6 h-6 text-electric-blue" />
                <span className="gaming-mono text-xs text-led-white/60">TOTAL LEADS</span>
              </div>
              <div className="gaming-display text-3xl font-bold text-electric-blue mb-2">
                {analytics?.totalLeads || 0}
              </div>
              <div className="text-xs text-laser-green">+12% this week</div>
            </div>

            <div className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6 text-laser-green" />
                <span className="gaming-mono text-xs text-led-white/60">CONVERSION</span>
              </div>
              <div className="gaming-display text-3xl font-bold text-laser-green mb-2">
                {((analytics?.conversionRate || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-electric-blue">Above industry avg</div>
            </div>

            <div className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-6 h-6 text-plasma-yellow" />
                <span className="gaming-mono text-xs text-led-white/60">AVG SCORE</span>
              </div>
              <div className="gaming-display text-3xl font-bold text-plasma-yellow mb-2">
                {analytics?.averageLeadScore || 0}
              </div>
              <div className="text-xs text-magenta-power">High quality leads</div>
            </div>

            <div className="gaming-card p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-6 h-6 text-magenta-power" />
                <span className="gaming-mono text-xs text-led-white/60">TIME TO WIN</span>
              </div>
              <div className="gaming-display text-3xl font-bold text-magenta-power mb-2">
                {analytics?.timeToConversion || 0}d
              </div>
              <div className="text-xs text-plasma-yellow">Lightning fast!</div>
            </div>

            {/* Lead Pipeline */}
            <div className="lg:col-span-2 gaming-card p-6">
              <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-4">
                LEAD PIPELINE
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics?.leadsByStage || {}).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-4 h-4 text-electric-blue" />
                      <span className="gaming-mono text-sm text-led-white/80">
                        {stage.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-led-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / (analytics?.totalLeads || 1)) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-electric-blue to-neon-cyan"
                        />
                      </div>
                      <span className="gaming-mono text-sm text-neon-cyan min-w-[40px] text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="lg:col-span-2 gaming-card p-6">
              <h3 className="gaming-title text-lg font-bold text-neon-cyan mb-4">
                ACTIVITY FEED
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${
                        notification.type === 'success' ? 'border-laser-green/50 bg-laser-green/10' :
                        notification.type === 'error' ? 'border-magenta-power/50 bg-magenta-power/10' :
                        notification.type === 'warning' ? 'border-plasma-yellow/50 bg-plasma-yellow/10' :
                        'border-electric-blue/50 bg-electric-blue/10'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="gaming-mono text-sm font-bold text-led-white">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-led-white/70 mt-1">
                            {notification.message}
                          </p>
                          {notification.achievement && (
                            <div className="flex items-center gap-2 mt-2">
                              <Trophy className="w-3 h-3 text-plasma-yellow" />
                              <span className="gaming-mono text-xs text-plasma-yellow">
                                {notification.achievement} +{notification.xpGained}XP
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-led-white/50">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-led-white/50">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="gaming-mono text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl"
          >
            <div className="gaming-card p-8">
              <h2 className="gaming-title text-2xl font-bold text-neon-cyan mb-6">
                CRM CONFIGURATION
              </h2>

              {/* Provider Selection */}
              <div className="mb-8">
                <h3 className="gaming-mono text-sm font-bold text-electric-blue mb-4">
                  SELECT CRM PROVIDER
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {providers.map(provider => (
                    <motion.div
                      key={provider.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedProvider(provider.id)
                        audioHelpers.playHover()
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedProvider === provider.id
                          ? 'border-neon-cyan bg-neon-cyan/10'
                          : 'border-led-white/20 hover:border-led-white/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <h4 className="gaming-title text-lg font-bold text-led-white">
                            {provider.name}
                          </h4>
                        </div>
                        {selectedProvider === provider.id && (
                          <CheckCircle className="w-5 h-5 text-laser-green" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {provider.features.slice(0, 3).map(feature => (
                          <div key={feature.id} className="flex items-center gap-2 text-xs">
                            {feature.supported ? (
                              <CheckCircle className="w-3 h-3 text-laser-green" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-led-white/40" />
                            )}
                            <span className={feature.supported ? 'text-led-white/80' : 'text-led-white/40'}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* API Configuration */}
              <div className="mb-8">
                <h3 className="gaming-mono text-sm font-bold text-electric-blue mb-4">
                  API CREDENTIALS
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="API Key"
                    className="gaming-input w-full"
                    disabled={isConnected}
                  />
                  <input
                    type="text"
                    placeholder="Webhook Secret (optional)"
                    className="gaming-input w-full"
                    disabled={isConnected}
                  />
                </div>
              </div>

              {/* Connect Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={connectCRM}
                disabled={isConnected || isLoading}
                className="gaming-button w-full py-4 text-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    CONNECTING...
                  </span>
                ) : isConnected ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    CONNECTED TO {selectedProvider.toUpperCase()}
                  </span>
                ) : (
                  <span>CONNECT CRM</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}