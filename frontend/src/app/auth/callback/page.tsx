'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Prevent multiple processing
      if (processed) return
      setProcessed(true)

      // Check for OAuth errors in URL parameters
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')
      const errorCode = searchParams.get('error_code')

      if (errorParam) {
        let errorMessage = 'Authentication failed'
        
        switch (errorParam) {
          case 'access_denied':
            errorMessage = 'You cancelled the sign-in process'
            break
          case 'unauthorized_client':
            errorMessage = 'OAuth configuration error'
            break
          case 'invalid_request':
            errorMessage = 'Invalid authentication request'
            break
          case 'server_error':
            errorMessage = 'Server error during authentication'
            break
          default:
            errorMessage = errorDescription || `Authentication error: ${errorParam}`
        }
        
        console.error('OAuth callback error:', { errorParam, errorDescription, errorCode })
        setError(errorMessage)
        
        // Redirect to auth page with error after a delay
        setTimeout(() => {
          router.push(`/auth?error=${encodeURIComponent(errorMessage)}`)
        }, 3000)
        return
      }

      // For successful OAuth, let the AuthProvider handle the session
      // We'll wait for the auth state to update and then redirect
    }

    handleAuthCallback()
  }, [searchParams, processed, router])

  // Handle successful authentication
  useEffect(() => {
    if (!loading && user && processed) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else if (!loading && !user && processed && !error) {
      // No user after processing and no error - something went wrong
      setTimeout(() => {
        router.push('/auth?error=Authentication+failed')
      }, 2000)
    }
  }, [user, loading, processed, error, router])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirecting you back to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4285F4]"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-gray-400">Please wait while we sign you in</p>
      </div>
    </div>
  )
}