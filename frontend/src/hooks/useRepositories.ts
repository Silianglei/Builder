'use client'

import { useState, useEffect, useCallback } from 'react'
import { getGitHubToken } from '@/lib/github'
import { Repository } from '@/components/repository-card'

export function useRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRepositories = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setError('Your session has expired. Please sign in again.')
        return
      }

      const githubToken = await getGitHubToken()
      
      if (!githubToken) {
        // Don't show error, just set empty repositories
        // This is expected on initial sign in before GitHub is connected
        setRepositories([])
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/repositories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'X-GitHub-Token': githubToken,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to fetch repositories')
      }

      const data = await response.json()
      setRepositories(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Failed to fetch repositories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRepository = useCallback(async (repository: Repository) => {
    const [owner, repo] = repository.full_name.split('/')
    
    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('Your session has expired. Please sign in again.')
    }
    
    const githubToken = await getGitHubToken()
    
    if (!githubToken) {
      throw new Error('Unable to access GitHub. Please sign in with GitHub again.')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/repositories/${owner}/${repo}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'X-GitHub-Token': githubToken,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to delete repository')
    }

    // Remove from local state
    setRepositories(prev => prev.filter(r => r.id !== repository.id))
  }, [])

  useEffect(() => {
    fetchRepositories()
  }, [fetchRepositories])

  return {
    repositories,
    loading,
    error,
    refresh: fetchRepositories,
    deleteRepository
  }
}