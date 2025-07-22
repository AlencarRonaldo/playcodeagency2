'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  CheckSquare, 
  Shield, 
  ArrowLeft,
  Home,
  Settings,
  ChevronRight,
  BarChart3,
  LogOut
} from 'lucide-react'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

interface AdminNavItem {
  name: string
  href: string
  icon: React.ElementType
  description: string
}

const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    description: 'Visão geral do sistema'
  },
  {
    name: 'Onboarding',
    href: '/admin/onboarding',
    icon: Users,
    description: 'Gerencie questionários de clientes'
  },
  {
    name: 'Aprovações',
    href: '/admin/approval',
    icon: CheckSquare,
    description: 'Sistema de aprovação de propostas'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    // Remove admin cookie
    document.cookie = 'playcode_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    // Redirect to login
    window.location.href = '/admin/login'
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-console">
      {/* Admin Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-deep-space/95 backdrop-blur-md border-b border-magenta-power/30 sticky top-16 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Admin Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-magenta-power to-gaming-purple rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white gaming-mono">
                  🎮 ADMIN CONSOLE
                </h1>
                <p className="text-sm text-gray-400">
                  Sistema de gerenciamento PlayCode Agency
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/10 text-neon-cyan
                           border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan/50
                           transition-all duration-300 gaming-mono text-sm font-bold"
              >
                <ArrowLeft size={16} />
                <Home size={16} />
                <span>VOLTAR AO SITE</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400
                           border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50
                           transition-all duration-300 gaming-mono text-sm font-bold"
              >
                <LogOut size={16} />
                <span>SAIR</span>
              </button>
            </div>
          </div>


          {/* Admin Navigation */}
          <nav className="mt-2">
            <div className="flex gap-2">
              {ADMIN_NAVIGATION.map((item) => {
                const isActive = pathname === item.href
                const ItemIcon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg gaming-mono text-sm font-bold
                      transition-all duration-300 group
                      ${isActive 
                        ? 'text-magenta-power bg-magenta-power/10 border border-magenta-power/50' 
                        : 'text-led-white/70 hover:text-magenta-power hover:bg-magenta-power/5 border border-transparent hover:border-magenta-power/30'
                      }
                    `}
                  >
                    <ItemIcon size={16} />
                    {item.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="adminActiveIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-magenta-power"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="gaming-card p-3 min-w-48 border border-magenta-power/30">
                        <div className="gaming-mono text-xs text-magenta-power font-bold mb-1">
                          {item.name.toUpperCase()}
                        </div>
                        <div className="text-xs text-led-white/80">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Admin Content */}
      <main className="pb-8">
        <div className="container mx-auto px-6 pt-6">
          <Breadcrumbs />
        </div>
        {children}
      </main>
    </div>
  )
}