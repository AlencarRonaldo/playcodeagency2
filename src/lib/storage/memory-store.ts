// Simple in-memory storage for onboarding data
// In production, replace with database

interface OnboardingData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: string;
  planType: string;
  formData: Record<string, any>;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  lastAccessDate?: string;
}

class MemoryStore {
  private onboardings: Map<string, OnboardingData> = new Map();

  constructor() {
    // Initialize with test data
    this.onboardings.set('test123', {
      id: 'test123',
      customerName: 'Ronaldo Alencar',
      customerEmail: 'ronaldoalencar2009@hotmail.com',
      customerPhone: '(11) 99999-9999',
      serviceType: 'website',
      planType: 'starter',
      formData: {},
      isCompleted: false,
      createdAt: new Date().toISOString(),
      lastAccessDate: new Date().toISOString()
    });
  }

  getOnboarding(id: string): OnboardingData | null {
    console.log('📖 Buscando onboarding:', id);
    const data = this.onboardings.get(id);
    console.log('📖 Dados encontrados:', data);
    return data || null;
  }

  updateOnboarding(id: string, updates: Partial<OnboardingData>): OnboardingData | null {
    const existing = this.onboardings.get(id);
    if (!existing) {
      console.log('❌ Onboarding não encontrado:', id);
      return null;
    }

    const updated = {
      ...existing,
      ...updates,
      lastAccessDate: new Date().toISOString()
    };

    this.onboardings.set(id, updated);
    console.log('💾 Onboarding atualizado:', { id, formData: updated.formData });
    return updated;
  }

  getAllOnboardings(): OnboardingData[] {
    return Array.from(this.onboardings.values());
  }
}

// Singleton instance
export const memoryStore = new MemoryStore();