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
    
    // Store GitHub token immediately if available and user authenticated with GitHub
    if (data.session?.provider_token && data.session.user?.app_metadata?.provider === 'github') {
      console.log('Storing GitHub provider token immediately...')
      
      try {
        // Get the service role key for admin operations
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (serviceRoleKey) {
          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          )
          
          // Store the GitHub token
          const { error: storeError } = await supabaseAdmin
            .from('github_tokens')
            .upsert({
              user_id: data.session.user.id,
              access_token: data.session.provider_token,
              refresh_token: data.session.provider_refresh_token,
              github_username: data.session.user.user_metadata?.user_name || data.session.user.user_metadata?.preferred_username,
              expires_at: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : undefined,
              token_type: 'bearer',
              scopes: ['repo', 'user', 'read:org'],
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })
          
          if (storeError) {
            console.error('Error storing GitHub token:', storeError)
          } else {
            console.log('GitHub token stored successfully')
          }
        } else {
          console.warn('SUPABASE_SERVICE_ROLE_KEY not configured - cannot store GitHub token in callback')
        }
      } catch (error) {
        console.error('Error storing GitHub token in callback:', error)
      }
    } else if (!data.session?.provider_token) {
      console.warn('No provider token in session - ensure "Return provider tokens" is enabled in Supabase GitHub settings')
    }
  }

  // Check for redirect intention - we'll pass this as a query parameter
  // to the dashboard which will handle the actual redirect
  // (we can't access localStorage from the server-side route handler)
  const redirectTo = requestUrl.searchParams.get('redirect_to')
  
  // If we have a specific redirect target, go there directly
  if (redirectTo && redirectTo !== '/dashboard') {
    const redirectUrl = new URL(redirectTo, requestUrl.origin)
    // Add a flag to indicate we're coming from auth
    redirectUrl.searchParams.set('from_auth', 'true')
    return NextResponse.redirect(redirectUrl)
  }
  
  // Otherwise go to dashboard and let it handle any saved redirects
  const dashboardUrl = new URL('/dashboard', requestUrl.origin)
  dashboardUrl.searchParams.set('from_auth', 'true')
  return NextResponse.redirect(dashboardUrl)
}