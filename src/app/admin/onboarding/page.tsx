'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Eye,
  Download,
  Calendar,
  Mail,
  Phone,
  Globe,
  ShoppingCart,
  Smartphone,
  BarChart3,
  Zap
} from 'lucide-react';

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

const serviceIcons = {
  website: Globe,
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

export default function AdminOnboardingPage() {
  const [onboardings, setOnboardings] = useState<OnboardingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedOnboarding, setSelectedOnboarding] = useState<OnboardingRecord | null>(null);

  useEffect(() => {
    loadOnboardings();
  }, []);

  const loadOnboardings = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const response = await fetch('/api/admin/onboarding');
      
      if (response.ok) {
        const data = await response.json();
        setOnboardings(data);
      } else {
        console.error('Erro ao carregar onboardings:', response.statusText);
        // Fallback para dados de exemplo se a API falhar
        const mockData: OnboardingRecord[] = [
          {
            id: 'test123',
            customerName: 'Ronaldo Alencar',
            customerEmail: 'ronaldoalencar2009@hotmail.com',
            customerPhone: '(11) 99999-9999',
            serviceType: 'website',
            planType: 'starter',
            formData: {
              domain: { hasExisting: true, currentDomain: 'exemplo.com.br' },
              design: { hasLogo: false, colorPreferences: 'Azul corporativo' },
              content: { needsContentCreation: true, targetAudience: 'Empresas de tecnologia' },
              features: { contactForm: true, blog: true, newsletter: false },
              seo: { keywords: 'desenvolvimento web, sites responsivos' }
            },
            isCompleted: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            lastAccessDate: new Date().toISOString()
          }
        ];
        setOnboardings(mockData);
      }
    } catch (error) {
      console.error('Erro ao carregar onboardings:', error);
      setOnboardings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOnboardings = onboardings.filter(onb => {
    if (filter === 'completed') return onb.isCompleted;
    if (filter === 'pending') return !onb.isCompleted;
    return true;
  });

  const stats = {
    total: onboardings.length,
    completed: onboardings.filter(o => o.isCompleted).length,
    pending: onboardings.filter(o => !o.isCompleted).length,
    conversionRate: onboardings.length > 0 
      ? Math.round((onboardings.filter(o => o.isCompleted).length / onboardings.length) * 100)
      : 0
  };

  const exportOnboardingData = async (onboarding: OnboardingRecord) => {
    try {
      const response = await fetch('/api/export/onboarding-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboardingData: onboarding
        }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `onboarding-${onboarding.customerName.replace(/\s+/g, '-')}-${onboarding.id}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('Erro ao gerar PDF:', response.statusText);
        alert('Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-console flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white">Carregando onboardings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 gaming-card"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-magenta-power rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Onboarding de Clientes
            </h2>
            <p className="text-gray-300">
              Gerencie e visualize todos os questionários de onboarding
            </p>
          </div>
        </div>
      </motion.div>

        {/* Stats Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gaming-card-sm hover:border-neon-cyan/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Players</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gaming-card-sm hover:border-laser-green/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Quest Complete</p>
                <p className="text-3xl font-bold text-laser-green">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gaming-card-sm hover:border-plasma-yellow/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">In Progress</p>
                <p className="text-3xl font-bold text-plasma-yellow">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="gaming-card-sm hover:border-magenta-power/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-3xl font-bold text-magenta-power">{stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gaming-card mb-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-white font-medium flex items-center gap-2">
              🎯 Battle Filters:
            </span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: '⚔️ All Warriors', color: 'neon-cyan' },
                { key: 'completed', label: '👑 Champions', color: 'laser-green' },
                { key: 'pending', label: '⏳ Training', color: 'plasma-yellow' }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filter === key
                      ? `bg-${color} text-black shadow-lg shadow-${color}/30`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Onboarding List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="gaming-card"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🚀 Active Missions ({filteredOnboardings.length})
          </h3>

          {filteredOnboardings.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">🎯 Nenhuma missão encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOnboardings.map((onboarding, index) => {
                const ServiceIcon = serviceIcons[onboarding.serviceType];
                return (
                  <motion.div
                    key={onboarding.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-neon-cyan/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-neon-cyan to-magenta-power p-2 rounded-lg">
                          <ServiceIcon className="w-5 h-5 text-black" />
                        </div>
                        
                        <div>
                          <h4 className="text-white font-medium">{onboarding.customerName}</h4>
                          <p className="text-gray-400 text-sm">
                            {serviceNames[onboarding.serviceType]} - {planNames[onboarding.planType]}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Criado: {new Date(onboarding.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            onboarding.isCompleted
                              ? 'bg-laser-green/20 text-laser-green border border-laser-green/30'
                              : 'bg-plasma-yellow/20 text-plasma-yellow border border-plasma-yellow/30'
                          }`}>
                            {onboarding.isCompleted ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Concluído
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Pendente
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOnboarding(onboarding)}
                            className="btn-secondary-sm"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => exportOnboardingData(onboarding)}
                            className="btn-primary-sm"
                            title="Exportar dados"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Onboarding Details Modal */}
        {selectedOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOnboarding(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="gaming-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Detalhes do Onboarding
                </h3>
                <button
                  onClick={() => setSelectedOnboarding(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Client Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Informações do Cliente</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-neon-cyan" />
                      <span className="text-gray-300">{selectedOnboarding.customerName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-neon-cyan" />
                      <span className="text-gray-300">{selectedOnboarding.customerEmail}</span>
                    </div>
                    {selectedOnboarding.customerPhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-neon-cyan" />
                        <span className="text-gray-300">{selectedOnboarding.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4">Informações do Projeto</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Serviço:</span>
                      <p className="text-white">{serviceNames[selectedOnboarding.serviceType]}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Plano:</span>
                      <p className="text-white">{planNames[selectedOnboarding.planType]}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Status:</span>
                      <p className={selectedOnboarding.isCompleted ? 'text-laser-green' : 'text-plasma-yellow'}>
                        {selectedOnboarding.isCompleted ? 'Concluído' : 'Pendente'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Data */}
              <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4">Dados do Formulário</h4>
                <pre className="text-sm text-gray-300 bg-black/50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(selectedOnboarding.formData, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => exportOnboardingData(selectedOnboarding)}
                  className="btn-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}