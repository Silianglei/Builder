import { supabase } from './supabase'

export async function getGitHubToken(): Promise<string | null> {
  try {
    // First, check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return null
    }
    
    if (!session) {
      return null
    }

    // Check if user has GitHub linked
    const providers = session.user?.app_metadata?.providers || []
    const hasGitHubLinked = providers.includes('github')
    
    if (!hasGitHubLinked) {
      return null
    }

    // First, try to get the token from current session (if just authenticated)
    if (session.provider_token) {
      // Verify it's actually a GitHub token (should start with 'gho_' or 'ghp_')
      if (session.provider_token.startsWith('gho_') || session.provider_token.startsWith('ghp_')) {
        
        // Store it for future use if we're coming from GitHub auth
        if (session.user?.app_metadata?.provider === 'github') {
          try {
            // Get the access token for authorization
            const { data: { session: authSession } } = await supabase.auth.getSession()
            
            await fetch('/api/github/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authSession?.access_token}`
              },
              body: JSON.stringify({
                access_token: session.provider_token,
                refresh_token: session.provider_refresh_token,
                expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
                github_username: session.user.user_metadata?.user_name || session.user.user_metadata?.preferred_username
              }),
            })
          } catch (error) {
            // Token storage failed, but continue
          }
        }
        
        return session.provider_token
      }
    }

    // If no token in session, try to retrieve from storage
    try {
      const response = await fetch('/api/github/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.token
      }
    } catch (error) {
      // Failed to fetch stored token
    }

    return null
  } catch (error) {
    return null
  }
}