'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Admin Panel Error
        </h2>
        
        <p className="text-gray-400 mb-6">
          Something went wrong in the admin panel. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all duration-300"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/admin'}
            className="w-full px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            Back to Admin Dashboard
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-gray-500 text-sm hover:text-gray-300">
              Error Details
            </summary>
            <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-400 overflow-auto max-h-40">
              {error.message}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  )
}