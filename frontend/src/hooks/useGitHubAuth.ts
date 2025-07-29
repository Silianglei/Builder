'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface GitHubAuthState {
  isConnected: boolean | null
  hasRepoScope: boolean
  hasDeleteRepoScope: boolean
  scopes: string[]
  githubUsername: string | null
}

export function useGitHubAuth() {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    isConnected: null,
    hasRepoScope: false,
    hasDeleteRepoScope: false,
    scopes: [],
    githubUsername: null
  })
  const [isReconnecting, setIsReconnecting] = useState(false)

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setAuthState({
          isConnected: false,
          hasRepoScope: false,
          hasDeleteRepoScope: false,
          scopes: [],
          githubUsername: null
        })
        return false
      }

      const response = await fetch('/api/github/token', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        setAuthState({
          isConnected: false,
          hasRepoScope: false,
          hasDeleteRepoScope: false,
          scopes: [],
          githubUsername: null
        })
        return false
      }

      const data = await response.json()
      setAuthState({
        isConnected: true,
        hasRepoScope: data.has_repo_scope || false,
        hasDeleteRepoScope: data.scopes ? data.scopes.includes('delete_repo') : false,
        scopes: data.scopes || [],
        githubUsername: data.github_username
      })
      return true
    } catch (error) {
      console.error('Error checking GitHub connection:', error)
      setAuthState({
        isConnected: false,
        hasRepoScope: false,
        hasDeleteRepoScope: false,
        scopes: [],
        githubUsername: null
      })
      return false
    }
  }

  const reconnectGitHub = async (requireRepoScope: boolean = true) => {
    if (isReconnecting) return
    
    setIsReconnecting(true)
    
    try {
      // Store current location for redirect after auth
      const currentPath = window.location.pathname + window.location.search
      localStorage.setItem('redirectAfterAuth', currentPath)
      
      // Force sign out first to ensure fresh OAuth flow
      await supabase.auth.signOut()
      
      // Trigger GitHub OAuth with appropriate scopes
      const scopes = requireRepoScope ? 'repo delete_repo user read:org' : 'user:email'
      
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes,
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(currentPath)}`,
          queryParams: {
            prompt: 'consent' // Force GitHub to show authorization page
          }
        }
      })
    } catch (error) {
      console.error('Failed to reconnect GitHub:', error)
      setIsReconnecting(false)
    }
  }

  useEffect(() => {
    checkConnection()
    
    // Check connection status every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    isConnected: authState.isConnected,
    hasRepoScope: authState.hasRepoScope,
    hasDeleteRepoScope: authState.hasDeleteRepoScope,
    scopes: authState.scopes,
    githubUsername: authState.githubUsername,
    isReconnecting,
    checkConnection,
    reconnectGitHub
  }
}