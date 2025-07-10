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
            console.error('Failed to clear GitHub token from database')
          } else {
            console.log('GitHub token cleared from database')
          }
        }
      } catch (error) {
        console.error('Error clearing GitHub token:', error)
      }

      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all local storage items related to auth
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('projectConfig')
      localStorage.removeItem('redirectAfterAuth')
      
      // Clear all cookies (in case any are set)
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      })
      
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGitHub = async (forceReauth: boolean = false) => {
    setLoading(true)
    try {
      // Clear any existing session data if forcing reauth
      if (forceReauth) {
        await supabase.auth.signOut()
        localStorage.clear()
        sessionStorage.clear()
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          scopes: 'repo user read:org',
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
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}