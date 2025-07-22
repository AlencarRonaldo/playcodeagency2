'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Glitch-style error icon */}
          <div className="relative inline-block mb-8">
            <div className="text-8xl font-bold text-primary animate-pulse">
              <span className="relative">
                <span className="absolute inset-0 text-accent/50 animate-glitch-1">⚠️</span>
                <span className="absolute inset-0 text-accent/50 animate-glitch-2">⚠️</span>
                <span>⚠️</span>
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="text-primary">ERROR</span> DETECTED
          </h1>
          
          <p className="text-gray-400 mb-8 text-lg">
            Something went wrong in the game matrix. Our dev team is on it!
          </p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              🔄 Try Again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              🏠 Return to Home
            </button>
          </div>

          {/* Gaming-style error details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-300 transition-colors">
                🔍 Debug Info
              </summary>
              <pre className="mt-4 p-4 bg-gray-900 rounded-lg text-xs text-gray-400 overflow-auto">
                {error.stack || error.message}
              </pre>
            </details>
          )}
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  )
}