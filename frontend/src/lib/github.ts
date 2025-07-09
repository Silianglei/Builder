import { supabase } from './supabase'

export async function getGitHubToken(): Promise<string | null> {
  try {
    // First, check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return null
    }
    
    if (!session) {
      console.log('No active session')
      return null
    }

    // Log session details for debugging
    console.log('Session user metadata:', {
      provider: session.user?.app_metadata?.provider,
      providers: session.user?.app_metadata?.providers,
      hasProviderToken: !!session.provider_token,
      hasProviderRefreshToken: !!session.provider_refresh_token
    })

    // Check if the user authenticated with GitHub
    const currentProvider = session.user?.app_metadata?.provider
    const providers = session.user?.app_metadata?.providers || []
    const hasGitHubLinked = providers.includes('github')
    
    if (!hasGitHubLinked) {
      console.log('User has not linked GitHub account')
      return null
    }

    // Check if the current session is from GitHub authentication
    if (currentProvider !== 'github') {
      console.log(`Current auth provider is ${currentProvider}, not GitHub. User needs to sign in with GitHub.`)
      return null
    }

    // The provider token should be available in the session
    if (session.provider_token) {
      // Verify it's actually a GitHub token (should start with 'gho_' or 'ghp_')
      if (session.provider_token.startsWith('gho_') || session.provider_token.startsWith('ghp_')) {
        console.log('Found valid GitHub token in session')
        return session.provider_token
      } else {
        console.log('Provider token exists but is not a GitHub token')
        return null
      }
    }

    // If not in session, try to get it from the user's identities
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      return null
    }

    // Check if we have GitHub in the user's identities
    const githubIdentity = user?.identities?.find(identity => identity.provider === 'github')
    if (githubIdentity) {
      console.log('Found GitHub identity, but no provider token available')
      // Provider tokens are not stored in identities, they're session-specific
    }

    console.log('No provider token found. User may need to re-authenticate.')
    return null
  } catch (error) {
    console.error('Error getting GitHub token:', error)
    return null
  }
}