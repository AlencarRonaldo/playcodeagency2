import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/storage/memory-store';

interface OnboardingRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  formData: Record<string, any>;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  lastAccessDate?: string;
}

// Fallback data for when memory store is empty
const fallbackOnboardings: OnboardingRecord[] = [
  {
    id: 'test123',
    customerName: 'Ronaldo Alencar',
    customerEmail: 'ronaldoalencar2009@hotmail.com',
    customerPhone: '(11) 99999-9999',
    serviceType: 'website',
    planType: 'starter',
    formData: {
      domain: { 
        hasExisting: true, 
        currentDomain: 'exemplo.com.br' 
      },
      design: { 
        hasLogo: false, 
        colorPreferences: 'Azul corporativo',
        stylePreference: 'modern'
      },
      content: { 
        needsContentCreation: true, 
        targetAudience: 'Empresas de tecnologia',
        contentAreas: ['Página Inicial', 'Sobre Nós', 'Serviços/Produtos']
      },
      features: { 
        contactForm: true, 
        blog: true, 
        newsletter: false,
        livechat: true
      },
      seo: { 
        keywords: 'desenvolvimento web, sites responsivos',
        hasGoogleAnalytics: true
      }
    },
    isCompleted: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'onb456',
    customerName: 'Maria Silva',
    customerEmail: 'maria@empresa.com',
    customerPhone: '(11) 88888-8888',
    serviceType: 'ecommerce',
    planType: 'pro',
    formData: {
      domain: { needsNew: true, preferredDomain: 'lojaexemplo.com.br' },
      design: { hasLogo: true, colorPreferences: 'Verde e branco' }
    },
    isCompleted: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    lastAccessDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'onb789',
    customerName: 'João Santos',
    customerEmail: 'joao@startup.com',
    serviceType: 'mobile',
    planType: 'enterprise',
    formData: {
      app: {
        platform: 'iOS e Android',
        features: ['Push notifications', 'Login social', 'Pagamentos']
      }
    },
    isCompleted: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'all' | 'completed' | 'pending'
    const serviceType = searchParams.get('serviceType');
    const planType = searchParams.get('planType');

    // Get data from memory store or use fallback
    const storeData = memoryStore.getAllOnboardings();
    const allOnboardings = storeData.length > 0 ? storeData : fallbackOnboardings;
    
    let filtered = [...allOnboardings];

    // Apply filters
    if (filter === 'completed') {
      filtered = filtered.filter(o => o.isCompleted);
    } else if (filter === 'pending') {
      filtered = filtered.filter(o => !o.isCompleted);
    }

    if (serviceType && serviceType !== 'all') {
      filtered = filtered.filter(o => o.serviceType === serviceType);
    }

    if (planType && planType !== 'all') {
      filtered = filtered.filter(o => o.planType === planType);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate stats
    const stats = {
      total: allOnboardings.length,
      completed: allOnboardings.filter(o => o.isCompleted).length,
      pending: allOnboardings.filter(o => !o.isCompleted).length,
      conversionRate: allOnboardings.length > 0 
        ? Math.round((allOnboardings.filter(o => o.isCompleted).length / allOnboardings.length) * 100)
        : 0,
      byService: {
        website: allOnboardings.filter(o => o.serviceType === 'website').length,
        ecommerce: allOnboardings.filter(o => o.serviceType === 'ecommerce').length,
        mobile: allOnboardings.filter(o => o.serviceType === 'mobile').length,
        marketing: allOnboardings.filter(o => o.serviceType === 'marketing').length,
        automation: allOnboardings.filter(o => o.serviceType === 'automation').length,
      },
      byPlan: {
        starter: allOnboardings.filter(o => o.planType === 'starter').length,
        pro: allOnboardings.filter(o => o.planType === 'pro').length,
        enterprise: allOnboardings.filter(o => o.planType === 'enterprise').length,
      }
    };

    return NextResponse.json(filtered);

  } catch (error) {
    console.error('Error fetching onboardings:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, onboardingId, data } = body;

    switch (action) {
      case 'export':
        // In a real implementation, generate and return export file
        const onboarding = mockOnboardings.find(o => o.id === onboardingId);
        if (!onboarding) {
          return NextResponse.json(
            { error: 'Onboarding não encontrado' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: onboarding,
          message: 'Dados exportados com sucesso'
        });

      case 'update_status':
        // In a real implementation, update in database
        const index = mockOnboardings.findIndex(o => o.id === onboardingId);
        if (index === -1) {
          return NextResponse.json(
            { error: 'Onboarding não encontrado' },
            { status: 404 }
          );
        }

        mockOnboardings[index] = {
          ...mockOnboardings[index],
          ...data,
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          data: mockOnboardings[index],
          message: 'Status atualizado com sucesso'
        });

      default:
        return NextResponse.json(
          { error: 'Ação não reconhecida' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing onboarding action:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Get specific onboarding details
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do onboarding é obrigatório' },
        { status: 400 }
      );
    }

    const onboarding = mockOnboardings.find(o => o.id === id);
    if (!onboarding) {
      return NextResponse.json(
        { error: 'Onboarding não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: onboarding
    });

  } catch (error) {
    console.error('Error fetching onboarding details:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}