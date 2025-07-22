'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  CheckSquare, 
  BarChart3,
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Shield,
  ArrowRight,
  Activity,
  FileText,
  Zap
} from 'lucide-react';
import QuickNavigation from '@/components/admin/QuickNavigation';
import BreadcrumbsWithStatus from '@/components/admin/BreadcrumbsWithStatus';

interface DashboardStats {
  totalOnboardings: number;
  completedOnboardings: number;
  pendingOnboardings: number;
  conversionRate: number;
  totalApprovals: number;
  pendingApprovals: number;
  recentActivity: number;
}

const ADMIN_MODULES = [
  {
    name: 'Onboarding de Clientes',
    href: '/admin/onboarding',
    icon: Users,
    color: 'from-neon-cyan to-electric-blue',
    description: 'Gerencie questionários e dados de novos clientes',
    stats: 'onboardings',
    action: 'Ver Onboardings'
  },
  {
    name: 'Sistema de Aprovações',
    href: '/admin/approval',
    icon: CheckSquare,
    color: 'from-magenta-power to-gaming-purple',
    description: 'Controle aprovações de propostas e orçamentos',
    stats: 'approvals',
    action: 'Gerenciar Aprovações'
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOnboardings: 0,
    completedOnboardings: 0,
    pendingOnboardings: 0,
    conversionRate: 0,
    totalApprovals: 0,
    pendingApprovals: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load onboarding stats
      const onboardingResponse = await fetch('/api/admin/onboarding');
      let onboardings = [];
      
      if (onboardingResponse.ok) {
        onboardings = await onboardingResponse.json();
      } else {
        // Mock data for development
        onboardings = [
          {
            id: 'test123',
            isCompleted: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }

      const completedOnboardings = onboardings.filter((o: any) => o.isCompleted).length;
      const conversionRate = onboardings.length > 0 
        ? Math.round((completedOnboardings / onboardings.length) * 100)
        : 0;

      setStats({
        totalOnboardings: onboardings.length,
        completedOnboardings,
        pendingOnboardings: onboardings.length - completedOnboardings,
        conversionRate,
        totalApprovals: 5, // Mock data
        pendingApprovals: 2, // Mock data
        recentActivity: onboardings.filter((o: any) => {
          const daysSince = (Date.now() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysSince <= 7;
        }).length
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gaming-card mb-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-magenta-power rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 gaming-mono">
              🎮 PAINEL ADMINISTRATIVO
            </h1>
            <p className="text-gray-300 text-lg">
              Centro de comando PlayCode Agency - Gerencie clientes e aprovações
            </p>
          </div>
        </div>
      </motion.div>

      {/* Status Breadcrumb */}
      <BreadcrumbsWithStatus 
        status="info"
        message={`Você tem ${stats.pendingOnboardings} onboardings pendentes e ${stats.pendingApprovals} aprovações aguardando`}
        action={{
          label: 'Ver Pendências',
          onClick: () => window.location.href = '/admin/onboarding?filter=pending'
        }}
      />

      {/* Quick Navigation */}
      <QuickNavigation />

      {/* Stats Overview */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card-sm hover:border-neon-cyan/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Players</p>
              <p className="text-3xl font-bold text-white">{stats.totalOnboardings}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-electric-blue rounded-lg flex items-center justify-center">
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
              <p className="text-3xl font-bold text-laser-green">{stats.completedOnboardings}</p>
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
              <p className="text-gray-400 text-sm mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-plasma-yellow">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
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
              <p className="text-gray-400 text-sm mb-1">Atividade 7d</p>
              <p className="text-3xl font-bold text-magenta-power">{stats.recentActivity}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Admin Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="gaming-card mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-neon-cyan" />
          Módulos Administrativos
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {ADMIN_MODULES.map((module, index) => {
            const ModuleIcon = module.icon;
            const moduleStats = module.stats === 'onboardings' 
              ? `${stats.totalOnboardings} total, ${stats.pendingOnboardings} pendentes`
              : `${stats.totalApprovals} total, ${stats.pendingApprovals} pendentes`;

            return (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-neon-cyan/50 transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                      <ModuleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 gaming-mono">
                        {module.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {module.description}
                      </p>
                      <p className="text-neon-cyan text-sm font-medium">
                        📊 {moduleStats}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={module.href}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-700/50 text-white hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-300 group-hover:border-neon-cyan/30 border border-transparent"
                  >
                    <span className="font-medium gaming-mono text-sm">
                      {module.action}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="gaming-card"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-magenta-power" />
          Ações Rápidas
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/admin/onboarding"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-neon-cyan/10 hover:border-neon-cyan/50 border border-gray-700 transition-all duration-300 group"
          >
            <Users className="w-5 h-5 text-neon-cyan" />
            <div>
              <p className="text-white font-medium">Novos Clientes</p>
              <p className="text-gray-400 text-sm">Ver onboardings pendentes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          <Link
            href="/admin/approval"
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-magenta-power/10 hover:border-magenta-power/50 border border-gray-700 transition-all duration-300 group"
          >
            <CheckSquare className="w-5 h-5 text-magenta-power" />
            <div>
              <p className="text-white font-medium">Aprovações</p>
              <p className="text-gray-400 text-sm">Processar solicitações</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-magenta-power group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-laser-green/10 hover:border-laser-green/50 border border-gray-700 transition-all duration-300 group"
          >
            <Activity className="w-5 h-5 text-laser-green" />
            <div>
              <p className="text-white font-medium">Atualizar Dados</p>
              <p className="text-gray-400 text-sm">Recarregar estatísticas</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-laser-green group-hover:translate-x-1 transition-all duration-300" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}