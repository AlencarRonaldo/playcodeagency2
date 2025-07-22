'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Clock, 
  Users, 
  Rocket,
  ArrowRight,
  Download,
  Mail,
  Phone
} from 'lucide-react';

interface OnboardingData {
  id: string;
  customerName: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  completedAt: string;
}

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

const nextSteps = [
  {
    icon: Users,
    title: 'Análise pela Equipe',
    description: 'Nossa equipe técnica analisará todas as informações fornecidas',
    timeline: '1-2 dias úteis',
    status: 'pending'
  },
  {
    icon: Calendar,
    title: 'Reunião de Kickoff',
    description: 'Agendaremos uma reunião para alinhar detalhes e tirar dúvidas',
    timeline: '3-5 dias úteis',
    status: 'pending'
  },
  {
    icon: FileText,
    title: 'Proposta Técnica',
    description: 'Enviaremos a proposta técnica detalhada e cronograma',
    timeline: '5-7 dias úteis',
    status: 'pending'
  },
  {
    icon: Rocket,
    title: 'Início do Desenvolvimento',
    description: 'Começaremos o desenvolvimento após aprovação da proposta',
    timeline: '7-10 dias úteis',
    status: 'pending'
  }
];

export default function OnboardingSuccessPage() {
  const params = useParams();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      const response = await fetch(`/api/onboarding/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOnboardingData(data);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCall = () => {
    // Open WhatsApp for scheduling
    const message = encodeURIComponent(`Olá! Acabei de completar o onboarding (ID: ${params.id}) e gostaria de agendar nossa reunião de kickoff. Quando podemos conversar?`);
    window.open(`https://wa.me/551195653496?text=${message}`, '_blank');
  };

  const handleDownloadGuide = () => {
    // Download project guide PDF
    const link = document.createElement('a');
    link.href = '/api/download/project-guide';
    link.download = 'Guia-do-Projeto-PlayCode-Agency.pdf';
    link.click();
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
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-black" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Onboarding Concluído!
          </h1>
          
          {onboardingData && (
            <div className="bg-gray-800 rounded-lg p-6 inline-block">
              <p className="text-xl text-white mb-2">
                Obrigado, <span className="text-cyan-400 font-medium">{onboardingData.customerName}</span>!
              </p>
              <p className="text-gray-400">
                Seu {serviceNames[onboardingData.serviceType]} ({planNames[onboardingData.planType]}) está pronto para começar
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Concluído em {new Date(onboardingData.completedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-400" />
            O que acontece agora?
          </h2>
          
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600"
                >
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">{step.timeline}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Etapa {index + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Schedule Call Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-lg border border-cyan-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-white">Agendar Reunião</h3>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Que tal agendarmos nossa reunião de kickoff? Podemos alinhar todos os detalhes e tirar suas dúvidas.
            </p>
            
            <button
              onClick={handleScheduleCall}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-black py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Agendar Agora
            </button>
          </motion.div>

          {/* Download Guide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Guia do Projeto</h3>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Baixe nosso guia completo com tudo que você precisa saber sobre o processo de desenvolvimento.
            </p>
            
            <button
              onClick={handleDownloadGuide}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-black py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Baixar Guia
            </button>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-800 rounded-lg border border-gray-700 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-green-400" />
            Dúvidas? Estamos Aqui!
          </h3>
          
          <p className="text-gray-400 mb-6">
            Nossa equipe está disponível para esclarecer qualquer dúvida durante todo o processo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <Mail className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-1">Email</p>
              <a 
                href="mailto:contato@playcodeagency.xyz"
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                contato@playcodeagency.xyz
              </a>
            </div>
            
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <Phone className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-1">WhatsApp</p>
              <a 
                href="https://wa.me/551195653496"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-sm"
              >
                (11) 95653-4963
              </a>
            </div>
            
            <div className="text-center p-4 bg-gray-900/50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-1">Agenda</p>
              <button
                onClick={handleScheduleCall}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Agendar Reunião
              </button>
            </div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-lg border border-cyan-500/20"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            🚀 Estamos Animados para Trabalhar com Você!
          </h3>
          <p className="text-gray-400">
            Prepare-se para ver sua ideia se transformar em realidade digital. 
            Vamos criar algo incrível juntos! 🎮✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}