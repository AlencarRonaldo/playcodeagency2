// HubSpot CRM Adapter - Enterprise-grade integration
// Implements gaming-themed lead management with HubSpot API v3

import { BaseCRMAdapter } from '../base-adapter'
import {
  CRMResponse,
  GamingLead,
  CRMWebhookEvent,
  CRMSearchQuery,
  CRMCustomField,
  CRMConfig,
  CRMError
} from '../types'

interface HubSpotContact {
  id?: string
  properties: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

interface HubSpotDeal {
  id?: string
  properties: {
    dealname: string
    amount: string
    dealstage: string
    pipeline: string
    closedate?: string
    [key: string]: any
  }
  associations?: {
    contacts?: string[]
  }
}

export class HubSpotAdapter extends BaseCRMAdapter {
  private baseUrl = 'https://api.hubapi.com'
  private headers: Record<string, string>

  constructor(config: CRMConfig) {
    super(config)
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  async connect(): Promise<boolean> {
    try {
      const isConnected = await this.testConnection()
      if (isConnected) {
        this.connected = true
        this.logActivity('connect', { status: 'connected' })
        
        // Initialize custom properties
        await this.initializeCustomProperties()
      }
      return isConnected
    } catch (error) {
      this.logActivity('connect', { error }, 'error')
      return false
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false
    this.logActivity('disconnect', { status: 'disconnected' })
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts?limit=1`, {
        headers: this.headers
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  async createLead(lead: GamingLead): Promise<CRMResponse> {
    try {
      // Validate lead data
      const errors = this.validateLead(lead)
      if (errors.length > 0) {
        return this.createResponse(false, null, errors.join(', '))
      }

      // Transform to HubSpot format
      const hubspotData = this.transformLeadData(lead)
      
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ properties: hubspotData })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new CRMError(
          'Failed to create lead in HubSpot',
          'HUBSPOT_CREATE_ERROR',
          'hubspot',
          error
        )
      }

      const data: HubSpotContact = await response.json()
      
      // Create associated deal if high-value lead
      if (lead.leadScore > 500) {
        await this.createDeal({
          ...lead,
          crmId: data.id
        })
      }

      this.logActivity('createLead', { 
        leadId: data.id, 
        email: lead.email,
        score: lead.leadScore 
      })

      return this.createResponse(true, {
        ...lead,
        crmId: data.id,
        crmProvider: 'hubspot',
        syncStatus: 'synced',
        lastSyncAt: new Date()
      })
    } catch (error) {
      this.logActivity('createLead', { error }, 'error')
      return this.createResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async updateLead(id: string, lead: Partial<GamingLead>): Promise<CRMResponse> {
    try {
      const hubspotData = this.transformLeadData(lead as GamingLead)
      
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/${id}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ properties: hubspotData })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new CRMError(
          'Failed to update lead in HubSpot',
          'HUBSPOT_UPDATE_ERROR',
          'hubspot',
          error
        )
      }

      const data: HubSpotContact = await response.json()
      
      this.logActivity('updateLead', { leadId: id, updates: Object.keys(lead) })

      return this.createResponse(true, {
        ...lead,
        crmId: data.id,
        syncStatus: 'synced',
        lastSyncAt: new Date()
      })
    } catch (error) {
      this.logActivity('updateLead', { error }, 'error')
      return this.createResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async getLead(id: string): Promise<CRMResponse<GamingLead>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/crm/v3/objects/contacts/${id}?properties=${this.getPropertyList()}`,
        { headers: this.headers }
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Lead not found')
        }
        throw new Error('Failed to get lead from HubSpot')
      }

      const data: HubSpotContact = await response.json()
      const lead = this.reverseTransformData(data.properties) as GamingLead
      
      return this.createResponse(true, {
        ...lead,
        crmId: data.id,
        crmProvider: 'hubspot'
      })
    } catch (error) {
      this.logActivity('getLead', { error }, 'error')
      return this.createResponse<GamingLead>(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async searchLeads(query: CRMSearchQuery): Promise<CRMResponse<GamingLead[]>> {
    try {
      const searchBody = this.buildSearchQuery(query)
      
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(searchBody)
      })

      if (!response.ok) {
        throw new Error('Failed to search leads in HubSpot')
      }

      const data = await response.json()
      const leads: GamingLead[] = data.results.map((contact: HubSpotContact) => ({
        ...this.reverseTransformData(contact.properties),
        crmId: contact.id,
        crmProvider: 'hubspot'
      })) as GamingLead[]

      return this.createResponse(true, leads)
    } catch (error) {
      this.logActivity('searchLeads', { error }, 'error')
      return this.createResponse<GamingLead[]>(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async createDeal(lead: GamingLead): Promise<CRMResponse> {
    try {
      const dealData: HubSpotDeal = {
        properties: {
          dealname: `${lead.name} - ${lead.projectType.toUpperCase()} Project`,
          amount: this.calculateDealAmount(lead),
          dealstage: this.mapLeadLevelToDealStage(lead.playerLevel),
          pipeline: 'default',
          gaming_lead_score: String(lead.leadScore),
          gaming_project_type: lead.projectType,
          gaming_urgency: lead.urgency,
          closedate: this.calculateCloseDate(lead.urgency)
        }
      }

      const response = await fetch(`${this.baseUrl}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(dealData)
      })

      if (!response.ok) {
        throw new Error('Failed to create deal in HubSpot')
      }

      const deal = await response.json()
      
      // Associate deal with contact
      if (lead.crmId) {
        await this.associateDealWithContact(deal.id, lead.crmId)
      }

      this.logActivity('createDeal', { 
        dealId: deal.id, 
        amount: dealData.properties.amount,
        stage: dealData.properties.dealstage 
      })

      return this.createResponse(true, { dealId: deal.id })
    } catch (error) {
      this.logActivity('createDeal', { error }, 'error')
      return this.createResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async updateDealStage(dealId: string, stage: string): Promise<CRMResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/deals/${dealId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          properties: { dealstage: stage }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update deal stage')
      }

      this.logActivity('updateDealStage', { dealId, newStage: stage })

      return this.createResponse(true, { dealId, stage })
    } catch (error) {
      return this.createResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    // HubSpot webhook validation using SHA256
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret || '')
      .update(JSON.stringify(payload))
      .digest('hex')
    
    return signature === expectedSignature
  }

  async processWebhook(event: CRMWebhookEvent): Promise<void> {
    try {
      switch (event.type) {
        case 'lead.created':
          // Trigger welcome automation
          this.logActivity('webhookProcessed', { 
            type: event.type, 
            leadId: event.data.objectId 
          })
          break
          
        case 'lead.updated':
          // Check for stage changes
          if (event.data.propertyName === 'lifecyclestage') {
            this.logActivity('leadStageChanged', {
              leadId: event.data.objectId,
              newStage: event.data.propertyValue
            })
          }
          break
          
        case 'deal.won':
          // Trigger celebration workflow
          this.logActivity('dealWon', { dealId: event.data.objectId })
          break
          
        default:
          this.logActivity('unknownWebhook', { type: event.type }, 'warning')
      }
    } catch (error) {
      this.logActivity('processWebhook', { error }, 'error')
      throw error
    }
  }

  async createCustomField(field: CRMCustomField): Promise<CRMResponse> {
    try {
      const hubspotProperty = {
        name: `gaming_${field.name}`,
        label: field.label,
        type: this.mapFieldType(field.type),
        fieldType: this.mapFieldType(field.type),
        groupName: 'gaming_properties',
        options: field.options?.map((opt, index) => ({
          label: opt,
          value: opt.toLowerCase().replace(/\s+/g, '_'),
          displayOrder: index
        }))
      }

      const response = await fetch(
        `${this.baseUrl}/crm/v3/properties/contacts`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(hubspotProperty)
        }
      )

      if (!response.ok) {
        const error = await response.json()
        if (error.message?.includes('already exists')) {
          return this.createResponse(true, { message: 'Property already exists' })
        }
        throw new Error('Failed to create custom field')
      }

      return this.createResponse(true, { field: field.name })
    } catch (error) {
      return this.createResponse(false, undefined, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Private helper methods
  private async initializeCustomProperties(): Promise<void> {
    const gamingProperties: CRMCustomField[] = [
      {
        name: 'lead_score',
        label: '🎮 Gaming Lead Score',
        type: 'number',
        required: false
      },
      {
        name: 'player_level',
        label: '⭐ Player Level',
        type: 'select',
        options: ['new_player', 'power_up_selection', 'mission_briefing', 'boss_battle', 'achievement_unlocked'],
        required: false
      },
      {
        name: 'achievements',
        label: '🏆 Achievements',
        type: 'text',
        required: false
      },
      {
        name: 'power_ups',
        label: '⚡ Selected Power-ups',
        type: 'text',
        required: false
      },
      {
        name: 'project_type',
        label: '🚀 Project Type',
        type: 'select',
        options: ['website', 'webapp', 'mobile', 'ai', 'ecommerce', 'custom'],
        required: false
      },
      {
        name: 'urgency',
        label: '🔥 Urgency Level',
        type: 'select',
        options: ['low', 'normal', 'high', 'critical'],
        required: false
      }
    ]

    // Create properties group first
    await this.createPropertyGroup()

    // Create each custom property
    for (const prop of gamingProperties) {
      await this.createCustomField(prop)
      await this.delay(100) // Respect rate limits
    }
  }

  private async createPropertyGroup(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/crm/v3/properties/contacts/groups`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name: 'gaming_properties',
          label: '🎮 Gaming Properties',
          displayOrder: 10
        })
      })
    } catch (error) {
      // Group might already exist, ignore error
    }
  }

  private buildSearchQuery(query: CRMSearchQuery): any {
    const filters: any[] = []

    if (query.filters?.email) {
      filters.push({
        propertyName: 'email',
        operator: 'EQ',
        value: query.filters.email
      })
    }

    if (query.filters?.company) {
      filters.push({
        propertyName: 'company',
        operator: 'CONTAINS_TOKEN',
        value: query.filters.company
      })
    }

    if (query.filters?.leadScore) {
      if (query.filters.leadScore.min) {
        filters.push({
          propertyName: 'gaming_lead_score',
          operator: 'GTE',
          value: query.filters.leadScore.min
        })
      }
      if (query.filters.leadScore.max) {
        filters.push({
          propertyName: 'gaming_lead_score',
          operator: 'LTE',
          value: query.filters.leadScore.max
        })
      }
    }

    return {
      filterGroups: filters.length > 0 ? [{ filters }] : [],
      properties: this.getPropertyList().split(','),
      limit: query.pagination?.limit || 100,
      after: query.pagination?.page ? String((query.pagination.page - 1) * (query.pagination?.limit || 100)) : undefined
    }
  }

  private getPropertyList(): string {
    const defaultProps = ['email', 'firstname', 'lastname', 'phone', 'company']
    const gamingProps = [
      'gaming_lead_score',
      'gaming_player_level',
      'gaming_achievements',
      'gaming_power_ups',
      'gaming_project_type',
      'gaming_urgency'
    ]
    return [...defaultProps, ...gamingProps].join(',')
  }

  private mapFieldType(type: string): string {
    const typeMap: Record<string, string> = {
      'text': 'string',
      'number': 'number',
      'date': 'date',
      'select': 'enumeration',
      'multiselect': 'checkbox',
      'boolean': 'bool'
    }
    return typeMap[type] || 'string'
  }

  private mapLeadLevelToDealStage(level: string): string {
    const stageMap: Record<string, string> = {
      'new_player': 'qualifiedtobuy',
      'power_up_selection': 'presentationscheduled',
      'mission_briefing': 'decisionmakerboughtin',
      'boss_battle': 'contractsent',
      'achievement_unlocked': 'closedwon'
    }
    return stageMap[level] || 'qualifiedtobuy'
  }

  private calculateDealAmount(lead: GamingLead): string {
    const baseAmounts: Record<string, number> = {
      'startup': 10000,
      'small': 30000,
      'medium': 100000,
      'large': 200000,
      'custom': 150000
    }
    
    const projectMultipliers: Record<string, number> = {
      'website': 0.8,
      'webapp': 1.2,
      'mobile': 1.5,
      'ai': 2.0,
      'ecommerce': 1.3,
      'custom': 1.8
    }

    const base = baseAmounts[lead.budgetRange] || 50000
    const multiplier = projectMultipliers[lead.projectType] || 1
    const urgencyBonus = lead.urgency === 'critical' ? 1.3 : lead.urgency === 'high' ? 1.15 : 1

    return String(Math.round(base * multiplier * urgencyBonus))
  }

  private calculateCloseDate(urgency: string): string {
    const daysToClose: Record<string, number> = {
      'low': 60,
      'normal': 30,
      'high': 14,
      'critical': 7
    }
    
    const days = daysToClose[urgency] || 30
    const closeDate = new Date()
    closeDate.setDate(closeDate.getDate() + days)
    
    return closeDate.toISOString().split('T')[0]
  }

  private async associateDealWithContact(dealId: string, contactId: string): Promise<void> {
    try {
      await fetch(
        `${this.baseUrl}/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/deal_to_contact`,
        {
          method: 'PUT',
          headers: this.headers
        }
      )
    } catch (error) {
      this.logActivity('associateDealWithContact', { error }, 'warning')
    }
  }
}