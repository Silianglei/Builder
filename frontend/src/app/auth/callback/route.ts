import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error_description) {
    console.error('OAuth error:', error_description)
    return NextResponse.redirect(new URL('/auth?error=' + encodeURIComponent(error_description), requestUrl.origin))
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth?error=' + encodeURIComponent(error.message), requestUrl.origin))
    }
    
    // Log what we received for debugging
    console.log('Session data received:', {
      hasSession: !!data.session,
      hasProviderToken: !!data.session?.provider_token,
      hasProviderRefreshToken: !!data.session?.provider_refresh_token,
      provider: data.session?.user?.app_metadata?.provider
    })
    
    // Store GitHub token if available and user authenticated with GitHub
    if (data.session?.provider_token && data.session.user?.app_metadata?.provider === 'github') {
      console.log('GitHub provider token is available, will be stored after redirect')
    } else if (!data.session?.provider_token) {
      console.warn('No provider token in session - ensure "Return provider tokens" is enabled in Supabase GitHub settings')
    }
  }

  // Redirect to dashboard after successful auth
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}