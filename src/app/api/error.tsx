'use client'

export default function ApiError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          API Error
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'An error occurred while processing your request.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}