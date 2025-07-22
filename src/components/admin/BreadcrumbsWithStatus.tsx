'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, Info } from 'lucide-react'

interface StatusBreadcrumbProps {
  status?: 'info' | 'success' | 'warning' | 'pending'
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function BreadcrumbsWithStatus({ 
  status = 'info', 
  message,
  action 
}: StatusBreadcrumbProps) {
  const statusConfig = {
    info: {
      icon: Info,
      color: 'text-electric-blue',
      bgColor: 'bg-electric-blue/10',
      borderColor: 'border-electric-blue/30'
    },
    success: {
      icon: CheckCircle,
      color: 'text-laser-green',
      bgColor: 'bg-laser-green/10',
      borderColor: 'border-laser-green/30'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-plasma-yellow',
      bgColor: 'bg-plasma-yellow/10',
      borderColor: 'border-plasma-yellow/30'
    },
    pending: {
      icon: Clock,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      borderColor: 'border-neon-cyan/30'
    }
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        gaming-card-sm ${config.bgColor} ${config.borderColor} border
        flex items-center justify-between gap-4 mb-6
      `}
    >
      <div className="flex items-center gap-3">
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
        <p className={`text-sm gaming-mono ${config.color}`}>
          {message}
        </p>
      </div>
      
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={`
            px-4 py-1.5 rounded-lg text-xs font-bold gaming-mono
            ${config.bgColor} ${config.borderColor} border
            ${config.color} hover:opacity-80 transition-opacity
          `}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}