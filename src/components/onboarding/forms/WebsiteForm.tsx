'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Palette, FileText, Search, BarChart3 } from 'lucide-react';
import FileUpload from '../FileUpload';
import { cn } from '@/lib/utils';

interface WebsiteFormData {
  // Domain & Hosting
  domain: {
    hasExisting: boolean;
    currentDomain?: string;
    needsNew: boolean;
    preferredDomain?: string;
  };
  hosting: {
    hasExisting: boolean;
    currentProvider?: string;
    needsNew: boolean;
    performanceRequirements: string;
  };
  
  // Design & Branding
  design: {
    hasLogo: boolean;
    logoFiles?: any[];
    colorPreferences: string;
    designReferences: string;
    stylePreference: string;
  };
  
  // Content
  content: {
    hasExistingContent: boolean;
    contentFiles?: any[];
    needsContentCreation: boolean;
    contentAreas: string[];
    targetAudience: string;
  };
  
  // Features & Functionality
  features: {
    contactForm: boolean;
    livechat: boolean;
    newsletter: boolean;
    blog: boolean;
    ecommerce: boolean;
    multiLanguage: boolean;
    customFeatures: string;
  };
  
  // SEO & Analytics
  seo: {
    keywords: string;
    competitors: string;
    hasGoogleAnalytics: boolean;
    hasGoogleAds: boolean;
    seoGoals: string;
  };
}

const steps = [
  {
    id: 'domain-hosting',
    title: 'Domínio & Hospedagem',
    icon: Globe,
    description: 'Configurações de domínio e hospedagem do seu website'
  },
  {
    id: 'design-branding',
    title: 'Design & Identidade',
    icon: Palette,
    description: 'Visual, cores, logo e referências de design'
  },
  {
    id: 'content',
    title: 'Conteúdo',
    icon: FileText,
    description: 'Textos, imagens e materiais do website'
  },
  {
    id: 'features',
    title: 'Funcionalidades',
    icon: BarChart3,
    description: 'Recursos e integrações necessárias'
  },
  {
    id: 'seo-analytics',
    title: 'SEO & Analytics',
    icon: Search,
    description: 'Otimização para mecanismos de busca'
  }
];

interface WebsiteFormProps {
  data: WebsiteFormData;
  onChange: (data: Partial<WebsiteFormData>) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function WebsiteForm({ data, onChange, currentStep, onStepChange }: WebsiteFormProps) {
  const [formData, setFormData] = useState<WebsiteFormData>(data);

  const updateData = (section: keyof WebsiteFormData, values: any) => {
    const newData = {
      ...formData,
      [section]: { ...formData[section], ...values }
    };
    setFormData(newData);
    onChange(newData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Domain & Hosting
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Domínio
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.domain.hasExisting}
                      onChange={(e) => updateData('domain', { hasExisting: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Já tenho um domínio
                  </label>
                  
                  {formData.domain.hasExisting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        placeholder="ex: meusite.com.br"
                        value={formData.domain.currentDomain || ''}
                        onChange={(e) => updateData('domain', { currentDomain: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.domain.needsNew}
                      onChange={(e) => updateData('domain', { needsNew: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Preciso de um novo domínio
                  </label>
                  
                  {formData.domain.needsNew && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        placeholder="ex: minhaempresa.com.br"
                        value={formData.domain.preferredDomain || ''}
                        onChange={(e) => updateData('domain', { preferredDomain: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Sugestão de domínio (verificaremos disponibilidade)
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Hospedagem
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hosting.hasExisting}
                      onChange={(e) => updateData('hosting', { hasExisting: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-purple-400"
                    />
                    Já tenho hospedagem
                  </label>
                  
                  {formData.hosting.hasExisting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        placeholder="ex: HostGator, GoDaddy, Hostinger"
                        value={formData.hosting.currentProvider || ''}
                        onChange={(e) => updateData('hosting', { currentProvider: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Requisitos de Performance
                  </label>
                  <select
                    value={formData.hosting.performanceRequirements}
                    onChange={(e) => updateData('hosting', { performanceRequirements: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="basic">Básico - Site institucional simples</option>
                    <option value="medium">Médio - Site com mais tráfego</option>
                    <option value="high">Alto - E-commerce ou alta demanda</option>
                    <option value="enterprise">Enterprise - Máxima performance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Design & Branding
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                Identidade Visual
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.design.hasLogo}
                      onChange={(e) => updateData('design', { hasLogo: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Já tenho logo/identidade visual
                  </label>
                  
                  {formData.design.hasLogo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <FileUpload
                        accept="image/*,.pdf,.ai,.eps"
                        title="Upload do Logo/Identidade"
                        description="Envie arquivos do logo em alta qualidade (PNG, SVG, AI, PDF)"
                        maxFiles={5}
                        onFilesChange={(files) => updateData('design', { logoFiles: files })}
                        files={formData.design.logoFiles || []}
                      />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Preferências de Cores
                  </label>
                  <textarea
                    placeholder="ex: Azul corporativo, verde natureza, tons neutros..."
                    value={formData.design.colorPreferences}
                    onChange={(e) => updateData('design', { colorPreferences: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Estilo de Design
                  </label>
                  <select
                    value={formData.design.stylePreference}
                    onChange={(e) => updateData('design', { stylePreference: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Selecione um estilo...</option>
                    <option value="modern">Moderno e Minimalista</option>
                    <option value="corporate">Corporativo e Profissional</option>
                    <option value="creative">Criativo e Inovador</option>
                    <option value="elegant">Elegante e Sofisticado</option>
                    <option value="playful">Descontraído e Divertido</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Sites de Referência
                  </label>
                  <textarea
                    placeholder="Cole links de sites que você gosta do design..."
                    value={formData.design.designReferences}
                    onChange={(e) => updateData('design', { designReferences: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      // Add cases for steps 2, 3, 4...
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Conteúdo do step {currentStep + 1} em desenvolvimento...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Step Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => onStepChange(index)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                index === currentStep
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {step.title}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>
    </div>
  );
}