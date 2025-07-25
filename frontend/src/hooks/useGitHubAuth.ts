'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getGitHubToken } from '@/lib/github'

export function useGitHubAuth() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isReconnecting, setIsReconnecting] = useState(false)

  const checkConnection = async () => {
    const token = await getGitHubToken()
    setIsConnected(!!token)
    return !!token
  }

  const reconnectGitHub = async () => {
    if (isReconnecting) return
    
    setIsReconnecting(true)
    
    try {
      // Store current location for redirect after auth
      const currentPath = window.location.pathname + window.location.search
      localStorage.setItem('redirectAfterAuth', currentPath)
      
      // Trigger GitHub OAuth
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'repo user read:org',
          redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent(currentPath)}`
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
    isConnected,
    isReconnecting,
    checkConnection,
    reconnectGitHub
  }
}