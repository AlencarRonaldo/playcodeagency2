'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Critical error icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full animate-pulse">
                <svg 
                  className="w-12 h-12 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              CRITICAL ERROR
            </h1>
            
            <p className="text-gray-400 mb-8">
              A critical error occurred. The application needs to restart.
            </p>

            <button
              onClick={reset}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
              style={{
                backgroundColor: '#ff0066',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Restart Application
            </button>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left">
                <div className="text-gray-500 text-sm mb-2">Error Details:</div>
                <div 
                  className="p-4 bg-gray-900 rounded-lg text-xs text-gray-400 overflow-auto"
                  style={{
                    backgroundColor: '#1a1a1a',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#999',
                    overflow: 'auto',
                    maxHeight: '200px',
                  }}
                >
                  {error.message}
                </div>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}