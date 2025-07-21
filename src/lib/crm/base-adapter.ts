// Base CRM Adapter - Abstract implementation with common functionality
// Using Template Method and Strategy patterns for extensibility

import { 
  CRMAdapter, 
  CRMResponse, 
  GamingLead, 
  CRMWebhookEvent,
  CRMSearchQuery,
  CRMCustomField,
  CRMFieldMapping,
  CRMError,
  CRMConfig
} from './types'

export abstract class BaseCRMAdapter implements CRMAdapter {
  protected config: CRMConfig
  protected connected: boolean = false
  protected fieldMappings: Map<string, CRMFieldMapping> = new Map()

  constructor(config: CRMConfig) {
    this.config = config
    this.initializeFieldMappings()
  }

  // Abstract methods that must be implemented by providers
  abstract connect(): Promise<boolean>
  abstract disconnect(): Promise<void>
  abstract testConnection(): Promise<boolean>
  abstract createLead(lead: GamingLead): Promise<CRMResponse>
  abstract updateLead(id: string, lead: Partial<GamingLead>): Promise<CRMResponse>
  abstract getLead(id: string): Promise<CRMResponse<GamingLead>>
  abstract searchLeads(query: CRMSearchQuery): Promise<CRMResponse<GamingLead[]>>
  abstract createDeal(lead: GamingLead): Promise<CRMResponse>
  abstract updateDealStage(dealId: string, stage: string): Promise<CRMResponse>
  abstract validateWebhook(payload: any, signature: string): boolean
  abstract processWebhook(event: CRMWebhookEvent): Promise<void>
  abstract createCustomField(field: CRMCustomField): Promise<CRMResponse>

  // Common implementation methods
  async syncLead(lead: GamingLead): Promise<CRMResponse> {
    try {
      // Check if lead exists
      const existingLead = await this.searchLeads({
        filters: { email: lead.email }
      })

      if (existingLead.data && existingLead.data.length > 0) {
        // Update existing lead
        const crmId = existingLead.data[0].crmId!
        return await this.updateLead(crmId, lead)
      } else {
        // Create new lead
        return await this.createLead(lead)
      }
    } catch (error) {
      throw new CRMError(
        'Failed to sync lead',
        'SYNC_ERROR',
        this.config.provider,
        error
      )
    }
  }

  async bulkSync(leads: GamingLead[]): Promise<CRMResponse[]> {
    const results: CRMResponse[] = []
    const batchSize = 10 // Process in batches to avoid rate limits

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map(lead => this.syncLead(lead))
      )

      results.push(...batchResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          return {
            success: false,
            error: result.reason.message,
            timestamp: new Date()
          }
        }
      }))

      // Add delay to respect rate limits
      if (i + batchSize < leads.length) {
        await this.delay(1000)
      }
    }

    return results
  }

  mapCustomFields(mappings: CRMFieldMapping[]): void {
    mappings.forEach(mapping => {
      this.fieldMappings.set(mapping.localField, mapping)
    })
  }

  // Helper methods
  protected transformLeadData(lead: GamingLead): Record<string, any> {
    const transformed: Record<string, any> = {}

    this.fieldMappings.forEach((mapping, localField) => {
      const value = lead[localField as keyof GamingLead]
      if (value !== undefined) {
        const transformedValue = mapping.transformer 
          ? mapping.transformer(value)
          : value
        transformed[mapping.crmField] = transformedValue
      }
    })

    // Add gaming-specific custom properties
    transformed.gaming_lead_score = lead.leadScore
    transformed.gaming_achievements = lead.achievements.join(', ')
    transformed.gaming_power_ups = lead.powerUps.join(', ')
    transformed.gaming_player_level = lead.playerLevel

    return transformed
  }

  protected reverseTransformData(crmData: any): Partial<GamingLead> {
    const lead: Partial<GamingLead> = {}

    this.fieldMappings.forEach((mapping, localField) => {
      const value = crmData[mapping.crmField]
      if (value !== undefined) {
        (lead as any)[localField] = value
      }
    })

    // Transform gaming-specific fields back
    if (crmData.gaming_lead_score) {
      lead.leadScore = parseInt(crmData.gaming_lead_score)
    }
    if (crmData.gaming_achievements) {
      lead.achievements = crmData.gaming_achievements.split(', ').filter(Boolean)
    }
    if (crmData.gaming_power_ups) {
      lead.powerUps = crmData.gaming_power_ups.split(', ').filter(Boolean)
    }
    if (crmData.gaming_player_level) {
      lead.playerLevel = crmData.gaming_player_level
    }

    return lead
  }

  protected initializeFieldMappings(): void {
    // Default field mappings
    const defaultMappings: CRMFieldMapping[] = [
      { localField: 'email', crmField: 'email', required: true },
      { localField: 'name', crmField: 'firstname', required: true },
      { localField: 'phone', crmField: 'phone', required: false },
      { localField: 'company', crmField: 'company', required: false },
      { localField: 'message', crmField: 'description', required: false },
      { 
        localField: 'projectType', 
        crmField: 'project_type',
        transformer: (value: string) => value.toUpperCase(),
        required: false 
      },
      { 
        localField: 'budgetRange', 
        crmField: 'budget',
        transformer: (value: string) => {
          const budgetMap: Record<string, string> = {
            'startup': '5000-15000',
            'small': '15000-50000',
            'medium': '50000-150000',
            'large': '150000+',
            'custom': 'Custom'
          }
          return budgetMap[value] || value
        },
        required: false 
      },
      {
        localField: 'urgency',
        crmField: 'priority',
        transformer: (value: string) => {
          const priorityMap: Record<string, number> = {
            'low': 0,
            'normal': 1,
            'high': 2,
            'critical': 3
          }
          return priorityMap[value] || 1
        },
        required: false
      }
    ]

    // Merge with custom mappings from config
    const allMappings = [...defaultMappings, ...(this.config.mappings || [])]
    this.mapCustomFields(allMappings)
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected createResponse<T = any>(
    success: boolean, 
    data?: T, 
    error?: string
  ): CRMResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: new Date()
    }
  }

  protected logActivity(
    action: string, 
    details: any, 
    level: 'info' | 'warning' | 'error' = 'info'
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      provider: this.config.provider,
      action,
      level,
      details
    }

    if (level === 'error') {
      console.error('🚨 CRM Error:', logEntry)
    } else if (level === 'warning') {
      console.warn('⚠️ CRM Warning:', logEntry)
    } else {
      console.log('📊 CRM Activity:', logEntry)
    }
  }

  // Validation helpers
  protected validateLead(lead: GamingLead): string[] {
    const errors: string[] = []

    if (!lead.email || !this.isValidEmail(lead.email)) {
      errors.push('Invalid email address')
    }

    if (!lead.name || lead.name.trim().length < 2) {
      errors.push('Name is too short')
    }

    if (lead.phone && !this.isValidPhone(lead.phone)) {
      errors.push('Invalid phone number')
    }

    // Check required custom fields
    this.fieldMappings.forEach((mapping, field) => {
      if (mapping.required && !lead[field as keyof GamingLead]) {
        errors.push(`${field} is required`)
      }
    })

    return errors
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private isValidPhone(phone: string): boolean {
    // Brazilian phone format
    return /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4})-?\d{4}$/.test(phone)
  }
}