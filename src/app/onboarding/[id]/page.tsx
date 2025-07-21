'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, FileText, Smartphone, ShoppingCart, BarChart3, Zap } from 'lucide-react';
import MultiStepForm from '@/components/onboarding/MultiStepForm';
import WebsiteForm from '@/components/onboarding/forms/WebsiteForm';
import EcommerceForm from '@/components/onboarding/forms/EcommerceForm';
import { OnboardingService } from '@/lib/services/onboarding';

interface OnboardingData {
  id: string;
  customerName: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  formData: Record<string, any>;
  currentStep: number;
  isCompleted: boolean;
  createdAt: string;
}

const serviceIcons = {
  website: FileText,
  ecommerce: ShoppingCart,
  mobile: Smartphone,
  marketing: BarChart3,
  automation: Zap
};

const serviceNames = {
  website: 'Website/Landing Page',
  ecommerce: 'E-commerce',
  mobile: 'Aplicativo Mobile',
  marketing: 'Marketing Digital',
  automation: 'Automação de Processos'
};

const planNames = {
  starter: 'Starter Pack',
  pro: 'Pro Guild',
  enterprise: 'Enterprise'
};

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(0);

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/onboarding/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Onboarding não encontrado');
      }

      const data = await response.json();
      setOnboardingData(data);
      setFormStep(data.currentStep || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/onboarding/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          isCompleted: true,
          completedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      // Redirect to success page
      router.push(`/onboarding/${params.id}/success`);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  };

  const handleFormSave = async (formData: any) => {
    try {
      await fetch(`/api/onboarding/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          currentStep: formStep,
          lastAccessDate: new Date().toISOString()
        }),
      });
    } catch (err) {
      console.error('Error saving form:', err);
    }
  };

  const renderServiceForm = () => {
    if (!onboardingData) return null;

    const commonProps = {
      data: onboardingData.formData,
      onChange: (data: any) => {
        setOnboardingData(prev => prev ? {
          ...prev,
          formData: { ...prev.formData, ...data }
        } : null);
      },
      currentStep: formStep,
      onStepChange: setFormStep
    };

    switch (onboardingData.serviceType) {
      case 'website':
        return <WebsiteForm {...commonProps} />;
      case 'ecommerce':
        return <EcommerceForm {...commonProps} />;
      case 'mobile':
        // return <MobileForm {...commonProps} />;
        return <div className="text-center py-8 text-gray-400">Formulário Mobile em desenvolvimento...</div>;
      case 'marketing':
        // return <MarketingForm {...commonProps} />;
        return <div className="text-center py-8 text-gray-400">Formulário Marketing em desenvolvimento...</div>;
      case 'automation':
        // return <AutomationForm {...commonProps} />;
        return <div className="text-center py-8 text-gray-400">Formulário Automação em desenvolvimento...</div>;
      default:
        return <div className="text-center py-8 text-gray-400">Tipo de serviço não reconhecido</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white">Carregando onboarding...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg border border-red-500">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Erro</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  if (!onboardingData) {
    return null;
  }

  if (onboardingData.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg border border-green-500">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Onboarding Concluído!</h1>
          <p className="text-gray-300 mb-6">
            Obrigado por completar o onboarding. Nossa equipe entrará em contato em breve.
          </p>
          <button
            onClick={() => router.push(`/onboarding/${params.id}/success`)}
            className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            Ver Próximos Passos
          </button>
        </div>
      </div>
    );
  }

  const ServiceIcon = serviceIcons[onboardingData.serviceType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-lg">
              <ServiceIcon className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Onboarding - {serviceNames[onboardingData.serviceType]}
              </h1>
              <p className="text-gray-400">
                Plano: {planNames[onboardingData.planType]}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <p className="text-white mb-2">
              Olá, <span className="text-cyan-400 font-medium">{onboardingData.customerName}</span>! 👋
            </p>
            <p className="text-gray-400 text-sm">
              Vamos coletar as informações necessárias para iniciar seu projeto
            </p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-white font-medium">Status do Onboarding</p>
                <p className="text-gray-400 text-sm">
                  Iniciado em {new Date(onboardingData.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-cyan-400 font-medium">Em Progresso</p>
              <p className="text-gray-400 text-sm">
                Tempo estimado: 10-15 minutos
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 rounded-lg border border-gray-700 p-6"
        >
          {renderServiceForm()}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mt-8"
        >
          <button
            onClick={handleFormSave}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
          >
            Salvar Progresso
          </button>
          
          <button
            onClick={() => handleFormSubmit(onboardingData.formData)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-medium rounded-lg hover:scale-105 transition-transform"
          >
            Finalizar Onboarding
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Help Section */}
        <div className="text-center mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-white font-medium mb-2">Precisa de Ajuda?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Nossa equipe está aqui para ajudar você durante todo o processo
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={`mailto:suporte@playcode.com.br?subject=Ajuda%20Onboarding%20${params.id}`}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              📧 suporte@playcode.com.br
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 text-sm"
            >
              📱 WhatsApp Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}