"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getGitHubToken } from '@/lib/github'

export default function GitHubTest() {
  const { user, signInWithGitHub } = useAuth()
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [repoName, setRepoName] = useState('')
  const [repoDescription, setRepoDescription] = useState('')
  const [createResult, setCreateResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testGitHubAccess = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      // Get the GitHub token using our helper
      const githubToken = await getGitHubToken()
      
      if (!githubToken) {
        throw new Error('GitHub token not found. Please sign in with GitHub.')
      }

      // Get the Supabase session for API auth
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please sign in.')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/test-access`, {
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
        throw new Error(errorData.detail || 'Failed to test GitHub access')
      }

      const data = await response.json()
      setTestResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createRepository = async () => {
    if (!repoName.trim()) {
      setError('Repository name is required')
      return
    }

    setLoading(true)
    setError(null)
    setCreateResult(null)

    try {
      // Get the GitHub token using our helper
      const githubToken = await getGitHubToken()
      
      if (!githubToken) {
        throw new Error('GitHub token not found. Please sign in with GitHub.')
      }

      // Get the Supabase session for API auth
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Not authenticated. Please sign in.')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/repositories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'X-GitHub-Token': githubToken,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: repoName,
          description: repoDescription || `Created with 5AM Founder`,
          private: false,
          auto_init: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create repository')
      }

      const data = await response.json()
      setCreateResult(data)
      setRepoName('')
      setRepoDescription('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold gradient-text">GitHub Integration Test</h2>
      
      {/* Test Access Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test GitHub Access</h3>
        <button
          onClick={testGitHubAccess}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test GitHub Access'}
        </button>

        {testResult && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-medium mb-2">✓ GitHub Access Confirmed</p>
            <div className="space-y-1 text-sm text-gray-300">
              <p>Username: {testResult.github_username}</p>
              <p>Name: {testResult.name}</p>
              <p>Email: {testResult.email}</p>
              <p>Public Repos: {testResult.public_repos}</p>
              <p>Private Repos: {testResult.private_repos}</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Repository Section */}
      <div className="space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-lg font-semibold">Create Test Repository</h3>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Repository name"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            placeholder="Description (optional)"
            value={repoDescription}
            onChange={(e) => setRepoDescription(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={createRepository}
            disabled={loading || !repoName.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Repository'}
          </button>
        </div>

        {createResult && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-medium mb-2">✓ Repository Created Successfully</p>
            <div className="space-y-1 text-sm text-gray-300">
              <p>Name: {createResult.name}</p>
              <p>URL: <a href={createResult.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{createResult.html_url}</a></p>
              <p>Clone URL: <code className="text-xs bg-white/10 px-2 py-1 rounded">{createResult.clone_url}</code></p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-medium">Error: {error}</p>
          {error.includes('GitHub token not found') && (
            <button
              onClick={signInWithGitHub}
              className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Re-authenticate with GitHub
            </button>
          )}
        </div>
      )}
    </div>
  )
}