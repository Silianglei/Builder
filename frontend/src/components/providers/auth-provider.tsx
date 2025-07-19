'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContextType, User } from '@/types/auth'

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(transformUser(session.user))
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(transformUser(session.user))
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const transformUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email!,
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at || supabaseUser.created_at,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
    avatar_url: supabaseUser.user_metadata?.avatar_url,
    username: supabaseUser.user_metadata?.user_name || supabaseUser.user_metadata?.preferred_username,
  })

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      setLoading(false)
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // Clear GitHub tokens from database BEFORE signing out
      // (because we need authentication to delete the token)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          const response = await fetch('/api/github/token', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
          })
          
          if (!response.ok) {
            // Token cleanup failed, but continue with logout
          }
        }
      } catch (error) {
        // Token cleanup failed, but continue with logout
      }

      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all local storage items related to auth
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('redirectAfterAuth')
      // Keep projectConfig - user might want to continue their draft later
      
      // Clear all cookies (in case any are set)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      })
      
      setUser(null)
    } catch (error) {
      // Sign out failed, but clear local state anyway
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGitHub = async (forceReauth: boolean = false, requestRepoScope: boolean = false) => {
    setLoading(true)
    try {
      // Clear any existing session data if forcing reauth
      if (forceReauth) {
        await supabase.auth.signOut()
        
        // Selectively clear auth-related items but preserve project config
        const projectConfig = localStorage.getItem('projectConfig')
        const redirectAfterAuth = localStorage.getItem('redirectAfterAuth')
        
        // Clear auth-related items
        localStorage.removeItem('supabase.auth.token')
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        
        // Restore preserved items
        if (projectConfig) localStorage.setItem('projectConfig', projectConfig)
        if (redirectAfterAuth) localStorage.setItem('redirectAfterAuth', redirectAfterAuth)
        
        sessionStorage.clear()
      }
      
      // Check if we have a redirect intention stored
      const redirectAfterAuth = localStorage.getItem('redirectAfterAuth')
      let redirectTo = `${window.location.origin}/auth/callback`
      
      // If we have a redirect intention, pass it through the OAuth flow
      if (redirectAfterAuth) {
        const callbackUrl = new URL(redirectTo)
        callbackUrl.searchParams.set('redirect_to', redirectAfterAuth)
        redirectTo = callbackUrl.toString()
      }
      
      // Determine scopes based on whether we need repo access
      const scopes = requestRepoScope ? 'repo user read:org' : 'user:email'
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
          skipBrowserRedirect: false,
          scopes,
          queryParams: forceReauth ? {
            // Force GitHub to show the authorization page again
            prompt: 'consent'
          } : undefined
        }
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      // Don't set loading to false here - the redirect will happen
      // Loading state will be reset when the page redirects
      return {}
    } catch (error) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      
      if (error) {
        setLoading(false)
        return { error: error.message }
      }
      
      // Don't set loading to false here - the redirect will happen
      // Loading state will be reset when the page redirects
      return {}
    } catch (error) {
      setLoading(false)
      return { error: 'An unexpected error occurred' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGitHub,
    signInWithGoogle,
    supabase,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}