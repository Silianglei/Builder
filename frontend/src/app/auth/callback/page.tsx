'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { AuthLoading } from '@/components/auth/auth-loading'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const storeGitHubToken = async (session: Session, retryCount = 0): Promise<boolean> => {
    const maxRetries = 3
    
    try {
      const response = await fetch('/api/github/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          access_token: session.provider_token,
          refresh_token: session.provider_refresh_token,
          expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
          github_username: session.user.user_metadata?.user_name || session.user.user_metadata?.preferred_username
        })
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('Failed to store GitHub token:', response.status, errorData)
        
        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          console.log(`Retrying GitHub token storage (attempt ${retryCount + 1}/${maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
          return storeGitHubToken(session, retryCount + 1)
        }
        
        throw new Error(`Failed to store GitHub token after ${maxRetries} attempts`)
      }
      
      console.log('GitHub token stored successfully')
      return true
    } catch (error) {
      console.error('Error storing GitHub token:', error)
      
      if (retryCount < maxRetries) {
        console.log(`Retrying GitHub token storage (attempt ${retryCount + 1}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return storeGitHubToken(session, retryCount + 1)
      }
      
      return false
    }
  }

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL (for implicit flow)
        const hash = window.location.hash
        let tokenStored = true
        
        // Process the authentication callback
        if (hash && hash.includes('access_token')) {
          // Wait for Supabase to process the authentication
          // Use event listener instead of arbitrary delay
          const checkSession = async (): Promise<Session | null> => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) throw error
            return session
          }
          
          // Try to get session with retries
          let session = null
          let attempts = 0
          const maxAttempts = 10
          
          while (!session && attempts < maxAttempts) {
            session = await checkSession()
            if (!session) {
              await new Promise(resolve => setTimeout(resolve, 200))
              attempts++
            }
          }
          
          if (!session) {
            throw new Error('Failed to establish session after authentication')
          }
          
          // Store GitHub token if we have a provider token that looks like a GitHub token
          console.log('Auth callback session info:', {
            hasProviderToken: !!session.provider_token,
            tokenPrefix: session.provider_token?.substring(0, 4),
            providers: session.user?.app_metadata?.providers,
            provider: session.user?.app_metadata?.provider
          })
          
          // Check if the token starts with GitHub token prefix (gho_ or ghp_)
          if (session.provider_token && 
              (session.provider_token.startsWith('gho_') || 
               session.provider_token.startsWith('ghp_') ||
               session.user?.app_metadata?.providers?.includes('github'))) {
            tokenStored = await storeGitHubToken(session)
            
            if (!tokenStored) {
              // Show warning but continue - user is authenticated
              setError('GitHub integration may be limited. You can still use the app but repository creation might not work.')
              console.warn('Failed to store GitHub token - repository operations may fail')
              
              // Don't block auth flow, just show warning for 5 seconds
              setTimeout(() => {
                continueToApp()
              }, 5000)
              return
            }
          }
        }

        // Continue to app immediately if everything worked
        continueToApp()
        
      } catch (error) {
        console.error('Auth callback error:', error)
        setError('Authentication failed. Please try again.')
        
        // Redirect to auth page after showing error
        setTimeout(() => {
          router.push('/auth?error=' + encodeURIComponent('Authentication failed'))
        }, 3000)
      }
    }

    const continueToApp = () => {
      // Get redirect target from query params or localStorage
      const redirectTo = searchParams.get('redirect_to') || localStorage.getItem('redirectAfterAuth') || '/dashboard'
      
      // Clear the saved redirect
      localStorage.removeItem('redirectAfterAuth')
      
      // Navigate to the target
      router.push(redirectTo)
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="mb-4">
            <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg text-white mb-2">{error}</p>
          <p className="text-sm text-gray-400">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <AuthLoading />
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthCallbackContent />
    </Suspense>
  )
}