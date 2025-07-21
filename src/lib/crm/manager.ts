// CRM Manager - Central orchestration for all CRM operations
// Gaming-themed enterprise CRM management with multi-provider support

import { 
  CRMAdapter,
  CRMProvider,
  CRMConfig,
  GamingLead,
  CRMResponse,
  CRMEvent,
  CRMAnalytics,
  CRMNotification,
  CRMWebhookEvent
} from './types'
import { HubSpotAdapter } from './providers/hubspot-adapter'
// Import other adapters as they are implemented
// import { SalesforceAdapter } from './providers/salesforce-adapter'
// import { PipedriveAdapter } from './providers/pipedrive-adapter'
// import { RDStationAdapter } from './providers/rdstation-adapter'

export class CRMManager {
  private static instance: CRMManager
  private adapters: Map<string, CRMAdapter> = new Map()
  private activeProvider: string | null = null
  private eventHandlers: Map<string, Set<(event: CRMEvent) => void>> = new Map()
  private notificationQueue: CRMNotification[] = []

  private constructor() {
    // Singleton pattern for global CRM management
  }

  public static getInstance(): CRMManager {
    if (!CRMManager.instance) {
      CRMManager.instance = new CRMManager()
    }
    return CRMManager.instance
  }

  // Provider Management
  async initializeProvider(provider: string, config: CRMConfig): Promise<boolean> {
    try {
      let adapter: CRMAdapter

      switch (provider) {
        case 'hubspot':
          adapter = new HubSpotAdapter(config)
          break
        // case 'salesforce':
        //   adapter = new SalesforceAdapter(config)
        //   break
        // case 'pipedrive':
        //   adapter = new PipedriveAdapter(config)
        //   break
        // case 'rd_station':
        //   adapter = new RDStationAdapter(config)
        //   break
        default:
          throw new Error(`Unsupported CRM provider: ${provider}`)
      }

      const connected = await adapter.connect()
      if (connected) {
        this.adapters.set(provider, adapter)
        if (!this.activeProvider) {
          this.activeProvider = provider
        }
        
        this.emitEvent({
          type: 'sync.completed',
          data: { provider, status: 'connected' },
          timestamp: new Date()
        })

        this.createNotification({
          type: 'success',
          title: '🎮 CRM Connected!',
          message: `Successfully connected to ${provider}`,
          achievement: 'crm_integration',
          xpGained: 500
        })

        return true
      }

      return false
    } catch (error) {
      this.emitEvent({
        type: 'sync.error',
        data: { provider, error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date()
      })

      this.createNotification({
        type: 'error',
        title: '❌ Connection Failed',
        message: `Failed to connect to ${provider}`
      })

      return false
    }
  }

  setActiveProvider(provider: string): boolean {
    if (this.adapters.has(provider)) {
      this.activeProvider = provider
      return true
    }
    return false
  }

  getActiveAdapter(): CRMAdapter | null {
    if (!this.activeProvider) return null
    return this.adapters.get(this.activeProvider) || null
  }

  // Lead Operations
  async createLead(lead: GamingLead): Promise<CRMResponse> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return {
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }
    }

    try {
      // Emit start event
      this.emitEvent({
        type: 'lead.created',
        data: { email: lead.email, score: lead.leadScore },
        timestamp: new Date()
      })

      // Create lead in CRM
      const response = await adapter.createLead(lead)

      if (response.success) {
        // Track achievement
        this.createNotification({
          type: 'success',
          title: '🚀 New Lead Created!',
          message: `${lead.name} has been added to the CRM`,
          achievement: 'lead_captured',
          xpGained: 100
        })

        // Update analytics
        await this.updateAnalytics('lead_created', lead)
      }

      return response
    } catch (error) {
      this.emitEvent({
        type: 'sync.error',
        data: { operation: 'createLead', error },
        timestamp: new Date()
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  async updateLead(id: string, updates: Partial<GamingLead>): Promise<CRMResponse> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return {
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }
    }

    try {
      const response = await adapter.updateLead(id, updates)

      if (response.success) {
        this.emitEvent({
          type: 'lead.updated',
          data: { id, updates },
          timestamp: new Date()
        })

        // Check for level progression
        if (updates.playerLevel) {
          this.createNotification({
            type: 'info',
            title: '⬆️ Lead Level Up!',
            message: `Lead progressed to ${updates.playerLevel}`,
            achievement: 'lead_progression',
            xpGained: 200
          })
        }
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  async syncLead(lead: GamingLead): Promise<CRMResponse> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return {
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }
    }

    return await adapter.syncLead(lead)
  }

  async bulkSyncLeads(leads: GamingLead[]): Promise<CRMResponse[]> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return leads.map(() => ({
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }))
    }

    this.emitEvent({
      type: 'sync.started',
      data: { count: leads.length },
      timestamp: new Date()
    })

    const results = await adapter.bulkSync(leads)

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    this.emitEvent({
      type: 'sync.completed',
      data: { successful, failed, total: leads.length },
      timestamp: new Date()
    })

    if (successful > 0) {
      this.createNotification({
        type: successful === leads.length ? 'success' : 'warning',
        title: '📊 Bulk Sync Complete',
        message: `Synced ${successful}/${leads.length} leads`,
        achievement: 'bulk_sync_master',
        xpGained: successful * 50
      })
    }

    return results
  }

  // Deal Operations
  async createDeal(lead: GamingLead): Promise<CRMResponse> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return {
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }
    }

    const response = await adapter.createDeal(lead)

    if (response.success) {
      this.createNotification({
        type: 'success',
        title: '💼 New Deal Created!',
        message: `Deal created for ${lead.name}`,
        achievement: 'deal_maker',
        xpGained: 300
      })
    }

    return response
  }

  async updateDealStage(dealId: string, stage: string): Promise<CRMResponse> {
    const adapter = this.getActiveAdapter()
    if (!adapter) {
      return {
        success: false,
        error: 'No CRM provider configured',
        timestamp: new Date()
      }
    }

    const response = await adapter.updateDealStage(dealId, stage)

    if (response.success && stage === 'closedwon') {
      this.createNotification({
        type: 'success',
        title: '🏆 Deal Won!',
        message: 'Achievement Unlocked: Deal Closer',
        achievement: 'deal_won',
        xpGained: 1000
      })
    }

    return response
  }

  // Webhook Handling
  async handleWebhook(
    provider: string, 
    payload: any, 
    signature: string
  ): Promise<boolean> {
    const adapter = this.adapters.get(provider)
    if (!adapter) return false

    try {
      // Validate webhook signature
      if (!adapter.validateWebhook(payload, signature)) {
        console.warn('Invalid webhook signature')
        return false
      }

      // Transform to standard event format
      const event: CRMWebhookEvent = {
        id: payload.eventId || Date.now().toString(),
        type: this.mapWebhookType(payload),
        provider,
        data: payload,
        timestamp: new Date(),
        signature
      }

      // Process webhook
      await adapter.processWebhook(event)

      return true
    } catch (error) {
      console.error('Webhook processing error:', error)
      return false
    }
  }

  // Analytics
  async getAnalytics(): Promise<CRMAnalytics> {
    // This would typically fetch from a database
    // For now, return mock data
    return {
      totalLeads: 156,
      conversionRate: 0.23,
      averageLeadScore: 420,
      leadsByStage: {
        new_player: 45,
        power_up_selection: 38,
        mission_briefing: 29,
        boss_battle: 24,
        achievement_unlocked: 20
      },
      topSources: [
        { source: 'website', count: 67 },
        { source: 'referral', count: 34 },
        { source: 'social', count: 28 },
        { source: 'direct', count: 27 }
      ],
      revenueByProject: {
        website: 125000,
        webapp: 280000,
        mobile: 450000,
        ai: 620000,
        ecommerce: 195000,
        custom: 380000
      },
      timeToConversion: 18.5
    }
  }

  // Event Management
  on(event: string, handler: (event: CRMEvent) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  off(event: string, handler: (event: CRMEvent) => void): void {
    this.eventHandlers.get(event)?.delete(handler)
  }

  private emitEvent(event: CRMEvent): void {
    const handlers = this.eventHandlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => handler(event))
    }

    // Also emit to wildcard handlers
    const wildcardHandlers = this.eventHandlers.get('*')
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(event))
    }
  }

  // Notification Management
  private createNotification(notification: Omit<CRMNotification, 'id' | 'timestamp'>): void {
    const fullNotification: CRMNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    this.notificationQueue.push(fullNotification)

    // Emit notification event
    this.emitEvent({
      type: 'sync.completed',
      data: fullNotification,
      timestamp: new Date(),
      metadata: { isNotification: true }
    })

    // Auto-remove after 10 seconds
    setTimeout(() => {
      const index = this.notificationQueue.findIndex(n => n.id === fullNotification.id)
      if (index > -1) {
        this.notificationQueue.splice(index, 1)
      }
    }, 10000)
  }

  getNotifications(): CRMNotification[] {
    return [...this.notificationQueue]
  }

  clearNotifications(): void {
    this.notificationQueue = []
  }

  // Helper Methods
  private mapWebhookType(payload: any): CRMWebhookEvent['type'] {
    // Map provider-specific webhook types to standard types
    const typeMap: Record<string, CRMWebhookEvent['type']> = {
      'contact.creation': 'lead.created',
      'contact.propertyChange': 'lead.updated',
      'deal.creation': 'lead.created',
      'deal.propertyChange': 'lead.updated',
      'deal.deletion': 'deal.lost'
    }

    return typeMap[payload.subscriptionType] || 'lead.updated'
  }

  private async updateAnalytics(action: string, data: any): Promise<void> {
    // In a real implementation, this would update a database
    console.log('📊 Analytics Update:', { action, data })
  }

  // Provider Information
  getSupportedProviders(): CRMProvider[] {
    return [
      {
        id: 'hubspot',
        name: 'HubSpot',
        type: 'hubspot',
        icon: '🟠',
        color: '#FF7A59',
        features: [
          { id: 'two-way-sync', name: 'Two-way Sync', description: 'Real-time bidirectional sync', supported: true },
          { id: 'custom-fields', name: 'Custom Fields', description: 'Gaming-themed custom properties', supported: true },
          { id: 'webhooks', name: 'Webhooks', description: 'Real-time event notifications', supported: true },
          { id: 'bulk-operations', name: 'Bulk Operations', description: 'Mass import/export', supported: true }
        ]
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        type: 'salesforce',
        icon: '☁️',
        color: '#00A1E0',
        features: [
          { id: 'two-way-sync', name: 'Two-way Sync', description: 'Real-time bidirectional sync', supported: true },
          { id: 'custom-fields', name: 'Custom Fields', description: 'Gaming-themed custom properties', supported: true },
          { id: 'webhooks', name: 'Webhooks', description: 'Platform events', supported: true },
          { id: 'bulk-operations', name: 'Bulk Operations', description: 'Bulk API support', supported: true }
        ]
      },
      {
        id: 'pipedrive',
        name: 'Pipedrive',
        type: 'pipedrive',
        icon: '🎯',
        color: '#172733',
        features: [
          { id: 'two-way-sync', name: 'Two-way Sync', description: 'API-based sync', supported: true },
          { id: 'custom-fields', name: 'Custom Fields', description: 'Custom field support', supported: true },
          { id: 'webhooks', name: 'Webhooks', description: 'Event webhooks', supported: true },
          { id: 'bulk-operations', name: 'Bulk Operations', description: 'Batch API', supported: false }
        ]
      },
      {
        id: 'rd_station',
        name: 'RD Station',
        type: 'rd_station',
        icon: '🚀',
        color: '#7C4DFF',
        features: [
          { id: 'two-way-sync', name: 'Two-way Sync', description: 'Contact sync', supported: true },
          { id: 'custom-fields', name: 'Custom Fields', description: 'Custom attributes', supported: true },
          { id: 'webhooks', name: 'Webhooks', description: 'Webhook notifications', supported: true },
          { id: 'bulk-operations', name: 'Bulk Operations', description: 'Import/export', supported: true }
        ]
      }
    ]
  }
}

// Export singleton instance
export const crmManager = CRMManager.getInstance()