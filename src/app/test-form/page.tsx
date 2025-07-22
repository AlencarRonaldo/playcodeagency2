'use client'

import { useState } from 'react'

export default function TestFormPage() {
  const [status, setStatus] = useState<string>('idle')
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const testSubmit = async () => {
    setStatus('submitting')
    setResponse(null)
    setError(null)
    
    console.log('🧪 Starting test submission...')
    
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        project_type: 'website',
        message: 'Test message from debug page',
        urgency: 'normal',
        phone: '',
        company: '',
        budget_range: 'starter',
        lead_score: 100,
        submitted_at: new Date().toISOString(),
        source: 'test_page'
      }
      
      console.log('🧪 Test data:', testData)
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      console.log('🧪 Response status:', response.status)
      console.log('🧪 Response ok:', response.ok)
      console.log('🧪 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('🧪 Response data:', responseData)
        setResponse(responseData)
        setStatus('success')
      } else {
        const errorData = await response.text()
        console.error('🧪 Error response:', errorData)
        setError({ status: response.status, message: errorData })
        setStatus('error')
      }
      
    } catch (error) {
      console.error('🧪 Test error:', error)
      setError(error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-console p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-neon-cyan mb-8">
          🧪 Contact Form Debug Test
        </h1>
        
        <div className="gaming-card p-6 mb-6">
          <button 
            onClick={testSubmit}
            disabled={status === 'submitting'}
            className="gaming-button px-6 py-3"
          >
            {status === 'submitting' ? 'Testing...' : 'Test Contact API'}
          </button>
          
          <div className="mt-4 text-sm gaming-mono">
            Status: <span className="text-neon-cyan">{status}</span>
          </div>
        </div>
        
        {response && (
          <div className="gaming-card p-6 mb-6 border-laser-green">
            <h3 className="text-laser-green font-bold mb-3">✅ Success Response:</h3>
            <pre className="text-xs text-led-white bg-controller-black/50 p-4 rounded overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        
        {error && (
          <div className="gaming-card p-6 mb-6 border-red-500">
            <h3 className="text-red-400 font-bold mb-3">❌ Error:</h3>
            <pre className="text-xs text-led-white bg-controller-black/50 p-4 rounded overflow-x-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="gaming-card p-6">
          <h3 className="text-electric-blue font-bold mb-3">📝 Instructions:</h3>
          <ol className="text-sm text-led-white/80 space-y-2">
            <li>1. Open browser developer tools (F12)</li>
            <li>2. Go to Console tab</li>
            <li>3. Click the "Test Contact API" button</li>
            <li>4. Check console logs for detailed information</li>
            <li>5. Check if email arrives at contato@playcodeagency.xyz</li>
          </ol>
        </div>
      </div>
    </div>
  )
}