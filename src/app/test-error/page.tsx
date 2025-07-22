'use client'

export default function TestError() {
  const throwError = () => {
    throw new Error('This is a test error to verify error boundaries are working!')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Error Boundary Test Page
        </h1>
        <p className="text-gray-400 mb-6">
          Click the button below to trigger an error and test the error boundary.
        </p>
        <button
          onClick={throwError}
          className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Trigger Test Error
        </button>
      </div>
    </div>
  )
}