'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function DebugGitHubToken() {
  const { supabase } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setDebugInfo({ error: 'No session found' })
        return
      }

      const response = await fetch('/api/debug/github-token', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-black/50 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-4">GitHub Token Debug</h3>
      
      <button
        onClick={runDebug}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Running...' : 'Run Debug'}
      </button>

      {debugInfo && (
        <pre className="text-xs overflow-auto p-3 bg-black/50 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  )
}