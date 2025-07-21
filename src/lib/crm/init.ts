// CRM Initialization - Auto-configure CRM based on environment variables

import { CRMManager } from './manager'

export async function initializeCRM(): Promise<void> {
  const crmManager = CRMManager.getInstance()
  
  // Check if CRM should be enabled
  const crmProvider = process.env.CRM_PROVIDER
  
  if (!crmProvider) {
    console.log('ℹ️ CRM provider not configured - running without CRM integration')
    return
  }

  try {
    switch (crmProvider) {
      case 'hubspot':
        const hubspotApiKey = process.env.HUBSPOT_API_KEY
        const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID
        
        if (!hubspotApiKey || !hubspotPortalId) {
          console.log('⚠️ HubSpot credentials missing - CRM disabled')
          return
        }

        const hubspotInitialized = await crmManager.initializeProvider('hubspot', {
          provider: 'hubspot',
          apiKey: hubspotApiKey,
          portalId: hubspotPortalId,
          enableSync: true,
          retryAttempts: 3,
          rateLimitPerSecond: 10
        })

        if (hubspotInitialized) {
          crmManager.setActiveProvider('hubspot')
          console.log('✅ HubSpot CRM initialized successfully')
        } else {
          console.log('❌ Failed to initialize HubSpot CRM')
        }
        break

      default:
        console.log(`⚠️ Unknown CRM provider: ${crmProvider}`)
    }
  } catch (error) {
    console.error('❌ CRM initialization error:', error)
  }
}

// Lazy initialization function
let crmInitialized = false
export async function getCRMManager() {
  if (!crmInitialized) {
    await initializeCRM()
    crmInitialized = true
  }
  return CRMManager.getInstance()
}