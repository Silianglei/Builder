"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SessionDebugButton() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSession = async () => {
    setLoading(true)
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setSessionData({ error: error.message })
      } else if (!session) {
        setSessionData({ error: 'No session found' })
      } else {
        setSessionData({
          user: {
            id: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata?.provider,
            providers: session.user.app_metadata?.providers,
          },
          hasProviderToken: !!session.provider_token,
          hasProviderRefreshToken: !!session.provider_refresh_token,
          tokenExpiresAt: session.expires_at,
          providerTokenPreview: session.provider_token 
            ? `${session.provider_token.substring(0, 20)}...` 
            : 'Not available',
          // Full session for debugging
          fullSession: session
        })
      }
    } catch (err: any) {
      setSessionData({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={checkSession}
        disabled={loading}
        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Debug Session'}
      </button>

      {sessionData && (
        <div className="p-4 bg-white/5 rounded-lg text-xs font-mono overflow-auto max-h-96">
          <pre>{JSON.stringify(sessionData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}