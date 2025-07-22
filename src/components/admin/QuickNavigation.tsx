'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, 
  CheckSquare, 
  BarChart3, 
  ArrowRight,
  Zap,
  FileText,
  Settings,
  TrendingUp
} from 'lucide-react'

interface QuickNavItem {
  label: string
  href: string
  icon: React.ElementType
  count?: number
  trend?: 'up' | 'down' | 'stable'
  color: string
}

const quickNavItems: QuickNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    color: 'neon-cyan'
  },
  {
    label: 'Onboardings Pendentes',
    href: '/admin/onboarding?filter=pending',
    icon: Users,
    count: 3,
    trend: 'up',
    color: 'plasma-yellow'
  },
  {
    label: 'Aprovações',
    href: '/admin/approval',
    icon: CheckSquare,
    count: 2,
    color: 'magenta-power'
  },
  {
    label: 'Relatórios',
    href: '/admin/reports',
    icon: FileText,
    color: 'electric-blue'
  }
]

export default function QuickNavigation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-5 h-5 text-neon-cyan" />
        <h3 className="text-lg font-bold text-white gaming-mono">
          NAVEGAÇÃO RÁPIDA
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickNavItems.map((item, index) => {
          const Icon = item.icon
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`
                  gaming-card-sm hover:border-${item.color}/50 
                  transition-all duration-300 group block
                  relative overflow-hidden
                `}
              >
                {/* Background gradient on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br 
                  from-${item.color}/10 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                `} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-6 h-6 text-${item.color}`} />
                    {item.count !== undefined && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        bg-${item.color}/20 text-${item.color}
                        gaming-mono
                      `}>
                        {item.count}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-white mb-1 gaming-mono">
                    {item.label}
                  </h4>
                  
                  {item.trend && (
                    <div className="flex items-center gap-1">
                      <TrendingUp 
                        size={12} 
                        className={`
                          ${item.trend === 'up' ? 'text-laser-green' : ''}
                          ${item.trend === 'down' ? 'text-red-500 rotate-180' : ''}
                          ${item.trend === 'stable' ? 'text-gray-500' : ''}
                        `}
                      />
                      <span className="text-xs text-gray-400">
                        {item.trend === 'up' && '+12%'}
                        {item.trend === 'down' && '-5%'}
                        {item.trend === 'stable' && '0%'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Arrow indicator */}
                <ArrowRight 
                  size={16} 
                  className={`
                    absolute bottom-3 right-3 
                    text-gray-600 group-hover:text-${item.color}
                    transform group-hover:translate-x-1
                    transition-all duration-300
                  `} 
                />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}