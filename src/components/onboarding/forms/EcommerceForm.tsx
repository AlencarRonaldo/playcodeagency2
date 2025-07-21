'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, CreditCard, Truck, Building, Receipt } from 'lucide-react';
import FileUpload from '../FileUpload';
import { cn } from '@/lib/utils';

interface EcommerceFormData {
  // Products & Catalog
  products: {
    hasExistingCatalog: boolean;
    catalogFiles?: any[];
    productCategories: string[];
    estimatedProducts: string;
    hasVariations: boolean;
    variationTypes: string[];
    needsPhotography: boolean;
  };
  
  // Payment & Pricing
  payment: {
    preferredGateways: string[];
    currentGateway?: string;
    acceptsCrypto: boolean;
    needsInstallments: boolean;
    maxInstallments: number;
    hasSpecialPricing: boolean;
  };
  
  // Shipping & Logistics
  shipping: {
    shippingMethods: string[];
    hasLocalDelivery: boolean;
    deliveryRadius?: string;
    currentLogistics?: string;
    needsPickupPoint: boolean;
    internationalShipping: boolean;
  };
  
  // Integrations
  integrations: {
    hasERP: boolean;
    currentERP?: string;
    hasCRM: boolean;
    currentCRM?: string;
    needsMarketplace: boolean;
    marketplaces: string[];
    hasEmailMarketing: boolean;
    emailProvider?: string;
  };
  
  // Legal & Fiscal
  legal: {
    businessType: string;
    taxRegime: string;
    needsNFE: boolean;
    hasAccountant: boolean;
    gdprCompliance: boolean;
    hasTermsPolicy: boolean;
  };
}

const steps = [
  {
    id: 'products',
    title: 'Produtos & Catálogo',
    icon: Package,
    description: 'Informações sobre produtos e categorias'
  },
  {
    id: 'payment',
    title: 'Pagamentos',
    icon: CreditCard,
    description: 'Gateways e formas de pagamento'
  },
  {
    id: 'shipping',
    title: 'Entrega & Logística',
    icon: Truck,
    description: 'Métodos de envio e entrega'
  },
  {
    id: 'integrations',
    title: 'Integrações',
    icon: Building,
    description: 'ERP, CRM e marketplaces'
  },
  {
    id: 'legal',
    title: 'Legal & Fiscal',
    icon: Receipt,
    description: 'Aspectos legais e tributários'
  }
];

const productCategories = [
  'Roupas e Acessórios',
  'Eletrônicos',
  'Casa e Decoração',
  'Beleza e Cosméticos',
  'Esportes e Fitness',
  'Livros e Educação',
  'Alimentação',
  'Saúde e Bem-estar',
  'Automóveis',
  'Informática',
  'Outros'
];

const paymentGateways = [
  'PagSeguro',
  'Mercado Pago',
  'PayPal',
  'Stripe',
  'PagBank',
  'Cielo',
  'Rede',
  'GetNet',
  'Stone',
  'Outros'
];

interface EcommerceFormProps {
  data: EcommerceFormData;
  onChange: (data: Partial<EcommerceFormData>) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function EcommerceForm({ data, onChange, currentStep, onStepChange }: EcommerceFormProps) {
  const [formData, setFormData] = useState<EcommerceFormData>(data);

  const updateData = (section: keyof EcommerceFormData, values: any) => {
    const newData = {
      ...formData,
      [section]: { ...formData[section], ...values }
    };
    setFormData(newData);
    onChange(newData);
  };

  const toggleArrayItem = (section: keyof EcommerceFormData, field: string, item: string) => {
    const current = (formData[section] as any)[field] || [];
    const updated = current.includes(item) 
      ? current.filter((i: string) => i !== item)
      : [...current, item];
    updateData(section, { [field]: updated });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Products & Catalog
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                Catálogo de Produtos
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.products.hasExistingCatalog}
                      onChange={(e) => updateData('products', { hasExistingCatalog: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Já tenho catálogo de produtos organizado
                  </label>
                  
                  {formData.products.hasExistingCatalog && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <FileUpload
                        accept=".xlsx,.csv,.pdf"
                        title="Upload do Catálogo"
                        description="Envie planilhas ou PDFs com informações dos produtos"
                        maxFiles={3}
                        onFilesChange={(files) => updateData('products', { catalogFiles: files })}
                        files={formData.products.catalogFiles || []}
                      />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <label className="block text-white mb-3">
                    Categorias de Produtos (selecione todas que se aplicam)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {productCategories.map((category) => (
                      <label key={category} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.products.productCategories.includes(category)}
                          onChange={() => toggleArrayItem('products', 'productCategories', category)}
                          className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Quantidade estimada de produtos
                  </label>
                  <select
                    value={formData.products.estimatedProducts}
                    onChange={(e) => updateData('products', { estimatedProducts: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="1-50">1 a 50 produtos</option>
                    <option value="51-200">51 a 200 produtos</option>
                    <option value="201-500">201 a 500 produtos</option>
                    <option value="501-1000">501 a 1.000 produtos</option>
                    <option value="1000+">Mais de 1.000 produtos</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.products.hasVariations}
                      onChange={(e) => updateData('products', { hasVariations: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Produtos têm variações (tamanho, cor, modelo, etc.)
                  </label>
                  
                  {formData.products.hasVariations && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        placeholder="ex: Tamanho (P,M,G), Cor (Azul, Vermelho), Material..."
                        value={formData.products.variationTypes.join(', ')}
                        onChange={(e) => updateData('products', { variationTypes: e.target.value.split(', ') })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.products.needsPhotography}
                      onChange={(e) => updateData('products', { needsPhotography: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-cyan-400"
                    />
                    Preciso de fotografia profissional dos produtos
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Payment
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                Gateways de Pagamento
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-3">
                    Gateways preferidos (selecione todos que deseja)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {paymentGateways.map((gateway) => (
                      <label key={gateway} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.payment.preferredGateways.includes(gateway)}
                          onChange={() => toggleArrayItem('payment', 'preferredGateways', gateway)}
                          className="rounded border-gray-600 bg-gray-700 text-green-400"
                        />
                        {gateway}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-2">
                    Gateway atual (se já possui)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: PagSeguro, Mercado Pago..."
                    value={formData.payment.currentGateway || ''}
                    onChange={(e) => updateData('payment', { currentGateway: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.acceptsCrypto}
                      onChange={(e) => updateData('payment', { acceptsCrypto: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-green-400"
                    />
                    Aceitar criptomoedas
                  </label>
                  
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.needsInstallments}
                      onChange={(e) => updateData('payment', { needsInstallments: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-green-400"
                    />
                    Parcelamento
                  </label>
                  
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.payment.hasSpecialPricing}
                      onChange={(e) => updateData('payment', { hasSpecialPricing: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-green-400"
                    />
                    Preços especiais por grupo
                  </label>
                </div>
                
                {formData.payment.needsInstallments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <label className="block text-white mb-2">
                      Máximo de parcelas
                    </label>
                    <select
                      value={formData.payment.maxInstallments}
                      onChange={(e) => updateData('payment', { maxInstallments: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value={1}>1x (à vista)</option>
                      <option value={3}>3x</option>
                      <option value={6}>6x</option>
                      <option value={12}>12x</option>
                      <option value={18}>18x</option>
                      <option value={24}>24x</option>
                    </select>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Shipping
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                Entrega & Logística
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-3">
                    Métodos de envio desejados
                  </label>
                  <div className="space-y-2">
                    {['Correios', 'Transportadora', 'Entrega própria', 'Retirada no local', 'Motoboy'].map((method) => (
                      <label key={method} className="flex items-center gap-2 text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.shipping.shippingMethods.includes(method)}
                          onChange={() => toggleArrayItem('shipping', 'shippingMethods', method)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-400"
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping.hasLocalDelivery}
                      onChange={(e) => updateData('shipping', { hasLocalDelivery: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-blue-400"
                    />
                    Entrega local (mesma cidade)
                  </label>
                  
                  {formData.shipping.hasLocalDelivery && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <input
                        type="text"
                        placeholder="ex: 10km, zona sul, cidade toda..."
                        value={formData.shipping.deliveryRadius || ''}
                        onChange={(e) => updateData('shipping', { deliveryRadius: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                      />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping.needsPickupPoint}
                      onChange={(e) => updateData('shipping', { needsPickupPoint: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-blue-400"
                    />
                    Pontos de retirada
                  </label>
                  
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping.internationalShipping}
                      onChange={(e) => updateData('shipping', { internationalShipping: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-700 text-blue-400"
                    />
                    Envio internacional
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

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