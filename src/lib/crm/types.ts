// CRM Integration Types - Gaming-themed Enterprise Architecture
// Developed with architect + backend personas for scalable integration

export interface CRMProvider {
  id: string
  name: string
  type: 'hubspot' | 'salesforce' | 'pipedrive' | 'rd_station' | 'custom'
  icon: string
  color: string
  features: CRMFeature[]
}

export interface CRMFeature {
  id: string
  name: string
  description: string
  supported: boolean
}

// Lead data structure with gaming elements
export interface GamingLead {
  // Core Information
  id: string
  email: string
  name: string
  phone?: string
  company?: string
  
  // Gaming Metrics
  leadScore: number
  playerLevel: 'new_player' | 'power_up_selection' | 'mission_briefing' | 'boss_battle' | 'achievement_unlocked'
  achievements: string[]
  powerUps: string[]
  
  // Business Data
  projectType: 'website' | 'webapp' | 'mobile' | 'ai' | 'ecommerce' | 'custom'
  budgetRange: 'startup' | 'small' | 'medium' | 'large' | 'custom'
  urgency: 'low' | 'normal' | 'high' | 'critical'
  message: string
  
  // Tracking
  source: string
  campaign?: string
  createdAt: Date
  updatedAt: Date
  
  // CRM Sync
  crmId?: string
  crmProvider?: string
  syncStatus: 'pending' | 'synced' | 'error'
  lastSyncAt?: Date
}

// CRM API Response Types
export interface CRMResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
  timestamp: Date
}

// Webhook Event Types
export interface CRMWebhookEvent {
  id: string
  type: 'lead.created' | 'lead.updated' | 'lead.converted' | 'deal.won' | 'deal.lost'
  provider: string
  data: any
  timestamp: Date
  signature: string
}

// CRM Configuration
export interface CRMConfig {
  provider: string
  apiKey: string
  apiSecret?: string
  webhookSecret?: string
  customFields: Record<string, string>
  mappings: CRMFieldMapping[]
  features: {
    twoWaySync: boolean
    realTimeUpdates: boolean
    customFields: boolean
    automations: boolean
    analytics: boolean
  }
}

// Field Mapping Configuration
export interface CRMFieldMapping {
  localField: keyof GamingLead
  crmField: string
  transformer?: (value: any) => any
  required: boolean
}

// CRM Adapter Interface - Strategy Pattern
export interface CRMAdapter {
  // Connection
  connect(): Promise<boolean>
  disconnect(): Promise<void>
  testConnection(): Promise<boolean>
  
  // Lead Operations
  createLead(lead: GamingLead): Promise<CRMResponse>
  updateLead(id: string, lead: Partial<GamingLead>): Promise<CRMResponse>
  getLead(id: string): Promise<CRMResponse<GamingLead>>
  searchLeads(query: CRMSearchQuery): Promise<CRMResponse<GamingLead[]>>
  
  // Deal/Opportunity Operations
  createDeal(lead: GamingLead): Promise<CRMResponse>
  updateDealStage(dealId: string, stage: string): Promise<CRMResponse>
  
  // Sync Operations
  syncLead(lead: GamingLead): Promise<CRMResponse>
  bulkSync(leads: GamingLead[]): Promise<CRMResponse[]>
  
  // Webhook Handling
  validateWebhook(payload: any, signature: string): boolean
  processWebhook(event: CRMWebhookEvent): Promise<void>
  
  // Custom Fields
  createCustomField(field: CRMCustomField): Promise<CRMResponse>
  mapCustomFields(mappings: CRMFieldMapping[]): void
}

// Search Query Interface
export interface CRMSearchQuery {
  filters?: {
    email?: string
    company?: string
    leadScore?: { min?: number; max?: number }
    projectType?: string[]
    dateRange?: { start: Date; end: Date }
  }
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
  pagination?: {
    page: number
    limit: number
  }
}

// Custom Field Definition
export interface CRMCustomField {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean'
  options?: string[]
  required: boolean
  defaultValue?: any
}

// Analytics Types
export interface CRMAnalytics {
  totalLeads: number
  conversionRate: number
  averageLeadScore: number
  leadsByStage: Record<string, number>
  topSources: Array<{ source: string; count: number }>
  revenueByProject: Record<string, number>
  timeToConversion: number // in days
}

// Error Types
export class CRMError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public details?: any
  ) {
    super(message)
    this.name = 'CRMError'
  }
}

// Event Types for Real-time Updates
export interface CRMEvent {
  type: 'lead.created' | 'lead.updated' | 'sync.started' | 'sync.completed' | 'sync.error'
  data: any
  timestamp: Date
  metadata?: Record<string, any>
}

// Notification Templates
export interface CRMNotification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  achievement?: string
  xpGained?: number
  timestamp: Date
}