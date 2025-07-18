'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash from the URL (for implicit flow)
        const hash = window.location.hash
        
        // Log what we received
        console.log('Auth callback received:', {
          hash: hash,
          search: window.location.search,
          hasAccessToken: hash.includes('access_token')
        })

        // If we have a hash with access_token, Supabase will handle it automatically
        if (hash && hash.includes('access_token')) {
          // Give Supabase a moment to process the auth
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // Check if we now have a session
          const { data: { session } } = await supabase.auth.getSession()
          console.log('Session after auth:', session)
          
          if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
            console.log('Storing GitHub token...')
            
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
                console.error('Failed to store GitHub token:', await response.text())
              } else {
                console.log('GitHub token stored successfully')
              }
            } catch (error) {
              console.error('Error storing GitHub token:', error)
            }
          }
        }

        // Get redirect target from query params or localStorage
        const redirectTo = searchParams.get('redirect_to') || localStorage.getItem('redirectAfterAuth') || '/dashboard'
        
        // Clear the saved redirect
        localStorage.removeItem('redirectAfterAuth')
        
        // Navigate to the target
        router.push(redirectTo)
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-lg text-gray-400">Authenticating...</p>
        <p className="text-sm text-gray-600 mt-2">If you are not redirected, <a href="/" className="text-blue-400 hover:underline">click here</a>.</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}