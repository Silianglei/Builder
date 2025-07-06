"use client"

import { useState } from 'react'
import { getGitHubToken } from '@/lib/github'
import { supabase } from '@/lib/supabase'

export default function GitHubDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkGitHubAccess = async () => {
    setLoading(true)
    const info: any = {}

    try {
      // 1. Check Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      info.session = {
        exists: !!session,
        error: sessionError?.message,
        userId: session?.user?.id,
        email: session?.user?.email,
        provider: session?.user?.app_metadata?.provider,
        providers: session?.user?.app_metadata?.providers,
        hasProviderToken: !!session?.provider_token,
        tokenPrefix: session?.provider_token?.substring(0, 4),
        sessionCreated: session?.user?.created_at,
        lastSignIn: session?.user?.last_sign_in_at
      }

      // 2. Check GitHub token
      const token = await getGitHubToken()
      info.githubToken = {
        exists: !!token,
        prefix: token?.substring(0, 4)
      }

      // 3. Test GitHub API access
      if (token && session?.access_token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/test-access`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'X-GitHub-Token': token
            },
            credentials: 'include'
          })
          
          if (response.ok) {
            const data = await response.json()
            info.githubApi = {
              success: true,
              data
            }
          } else {
            const error = await response.json()
            info.githubApi = {
              success: false,
              status: response.status,
              error: error.detail
            }
          }
        } catch (error) {
          info.githubApi = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      }

      // 4. Check OAuth scopes from GitHub directly
      if (token) {
        try {
          const response = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })
          
          info.githubScopes = {
            status: response.status,
            scopes: response.headers.get('x-oauth-scopes'),
            rateLimit: response.headers.get('x-ratelimit-remaining')
          }
          
          if (response.ok) {
            const userData = await response.json()
            info.githubUser = {
              login: userData.login,
              id: userData.id,
              canCreatePrivateRepo: userData.plan?.private_repos !== 0
            }
          }
        } catch (error) {
          info.githubScopes = {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      }

    } catch (error) {
      info.error = error instanceof Error ? error.message : 'Unknown error'
    }

    setDebugInfo(info)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">GitHub OAuth Debug Info</h3>
        <button
          onClick={checkGitHubAccess}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Run Debug Check'}
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          {/* Session Info */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-2 text-yellow-400">Supabase Session</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo.session, null, 2)}
            </pre>
          </div>

          {/* GitHub Token */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-2 text-green-400">GitHub Token</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo.githubToken, null, 2)}
            </pre>
          </div>

          {/* GitHub API Test */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-400">Backend API Test</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo.githubApi, null, 2)}
            </pre>
          </div>

          {/* GitHub OAuth Scopes */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-medium mb-2 text-purple-400">GitHub OAuth Scopes</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo.githubScopes, null, 2)}
            </pre>
            {debugInfo.githubScopes?.scopes && (
              <div className="mt-2 p-2 bg-white/5 rounded">
                <p className="text-sm">
                  <strong>Current scopes:</strong> {debugInfo.githubScopes.scopes || 'none'}
                </p>
                <p className="text-sm text-yellow-400 mt-1">
                  <strong>Required scopes:</strong> repo, user, read:org
                </p>
                {!debugInfo.githubScopes.scopes?.includes('repo') && (
                  <p className="text-sm text-red-400 mt-2">
                    ⚠️ Missing 'repo' scope - this is required to create repositories!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}