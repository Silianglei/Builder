"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import SessionDebugButton from './session-debug-button'

export default function GitHubDebug() {
  const { user } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSessionInfo(session)
    }
    checkSession()
  }, [])

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">GitHub OAuth Status</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>User Email:</strong> {user?.email || 'Not logged in'}</p>
        <p><strong>Auth Provider:</strong> {sessionInfo?.user?.app_metadata?.provider || 'Unknown'}</p>
        <p className={sessionInfo?.provider_token ? 'text-green-400' : 'text-red-400'}>
          <strong>GitHub Token:</strong> {sessionInfo?.provider_token ? '✓ Available' : '✗ Not Available'}
        </p>
        
        {!sessionInfo?.provider_token && sessionInfo?.user?.app_metadata?.provider === 'github' && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 font-medium mb-2">⚠️ Provider Token Not Found</p>
            <p className="text-sm text-gray-300 mb-3">
              The GitHub access token is not available in your session. This can happen for a few reasons:
            </p>
            <ol className="mt-2 text-sm text-gray-300 list-decimal list-inside space-y-2">
              <li><strong>Most Common:</strong> The OAuth scopes weren't properly requested during authentication</li>
              <li>The token might have expired (GitHub tokens expire after a period of time)</li>
              <li>There might be an issue with the OAuth callback</li>
            </ol>
            <p className="text-sm text-gray-300 mt-3">
              <strong>To fix this:</strong> Try signing out and signing in again with GitHub.
            </p>
          </div>
        )}
      </div>

      <details className="text-xs">
        <summary className="cursor-pointer text-gray-400">Full Session (click to expand)</summary>
        <pre className="mt-2 p-2 bg-white/5 rounded overflow-auto max-h-48">
          {JSON.stringify(sessionInfo, null, 2)}
        </pre>
      </details>

      <div className="pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400 mb-2">Debug Tools:</p>
        <SessionDebugButton />
      </div>
    </div>
  )
}