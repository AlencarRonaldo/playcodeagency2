'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home, Shield, Users, CheckSquare, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ElementType
}

const breadcrumbConfig: Record<string, BreadcrumbItem> = {
  '/admin': {
    label: 'Dashboard',
    href: '/admin',
    icon: Shield
  },
  '/admin/onboarding': {
    label: 'Onboarding de Clientes',
    href: '/admin/onboarding',
    icon: Users
  },
  '/admin/approval': {
    label: 'Sistema de Aprovações',
    href: '/admin/approval',
    icon: CheckSquare
  },
  '/admin/login': {
    label: 'Login',
    href: '/admin/login',
    icon: FileText
  }
}

// Função para obter o nome da página dinamicamente
const getPageName = (pathname: string): string => {
  const config = breadcrumbConfig[pathname]
  if (config) return config.label
  
  // Fallback para paths não configurados
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  // Gerar breadcrumbs baseado no pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: Home }
    ]
    
    // Se não estiver no admin, retorna apenas home
    if (!pathname.startsWith('/admin')) {
      return items
    }
    
    // Adiciona o dashboard admin
    items.push(breadcrumbConfig['/admin'])
    
    // Se estiver em uma subpágina do admin, adiciona ela também
    if (pathname !== '/admin' && breadcrumbConfig[pathname]) {
      items.push(breadcrumbConfig[pathname])
    }
    
    return items
  }
  
  const breadcrumbs = generateBreadcrumbs()
  const isLastItem = (index: number) => index === breadcrumbs.length - 1
  
  // Para mobile, mostrar apenas o último item e o anterior
  const mobileBreadcrumbs = breadcrumbs.length > 2 
    ? [breadcrumbs[breadcrumbs.length - 2], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
      aria-label="Breadcrumb"
    >
      <div className="gaming-card-sm bg-gray-800/50 backdrop-blur-sm">
        {/* Desktop breadcrumbs */}
        <ol className="hidden md:flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const Icon = item.icon
            const isLast = isLastItem(index)
            
            return (
              <React.Fragment key={item.href}>
                <li className="flex items-center">
                  {isLast ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-neon-cyan font-medium gaming-mono"
                    >
                      {Icon && <Icon size={16} className="text-neon-cyan" />}
                      <span>{item.label}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors duration-200 gaming-mono group"
                      >
                        {Icon && (
                          <Icon size={16} className="text-gray-500 group-hover:text-neon-cyan transition-colors" />
                        )}
                        <span className="hover:underline">{item.label}</span>
                      </Link>
                    </motion.div>
                  )}
                </li>
                
                {!isLast && (
                  <motion.li
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                    className="text-gray-600"
                  >
                    <ChevronRight size={16} />
                  </motion.li>
                )}
              </React.Fragment>
            )
          })}
        </ol>
        
        {/* Mobile breadcrumbs - mostra apenas os últimos 2 items */}
        <ol className="flex md:hidden items-center space-x-2 text-sm">
          {mobileBreadcrumbs.map((item, index) => {
            const Icon = item.icon
            const isLast = index === mobileBreadcrumbs.length - 1
            const isFirst = index === 0 && breadcrumbs.length > 2
            
            return (
              <React.Fragment key={item.href}>
                {isFirst && (
                  <>
                    <li className="text-gray-500">...</li>
                    <li className="text-gray-600">
                      <ChevronRight size={16} />
                    </li>
                  </>
                )}
                <li className="flex items-center">
                  {isLast ? (
                    <div className="flex items-center gap-2 text-neon-cyan font-medium gaming-mono">
                      {Icon && <Icon size={16} className="text-neon-cyan" />}
                      <span className="truncate max-w-[150px]">{item.label}</span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors duration-200 gaming-mono"
                    >
                      {Icon && <Icon size={16} className="text-gray-500" />}
                      <span className="truncate max-w-[100px]">{item.label}</span>
                    </Link>
                  )}
                </li>
                {!isLast && (
                  <li className="text-gray-600">
                    <ChevronRight size={16} />
                  </li>
                )}
              </React.Fragment>
            )
          })}
        </ol>
        
        {/* Linha de progresso animada */}
        <div className="relative h-0.5 bg-gray-700 mt-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute h-full bg-gradient-to-r from-neon-cyan to-magenta-power"
          />
        </div>
      </div>
      
      {/* Quick Stats - Mostra informações contextuais baseadas na página */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center gap-4 text-xs text-gray-400 gaming-mono"
      >
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-laser-green rounded-full animate-pulse" />
          Sistema Online
        </span>
        <span>•</span>
        
        {pathname === '/admin' && (
          <span>Dashboard Principal</span>
        )}
        
        {pathname === '/admin/onboarding' && (
          <span>Gerenciamento de Onboarding</span>
        )}
        
        {pathname === '/admin/approval' && (
          <span>Sistema de Aprovações</span>
        )}
        
        <span>•</span>
        <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
      </motion.div>
    </motion.nav>
  )
}