"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getGitHubToken } from "@/lib/github"
import { ChevronLeft, Github, RefreshCw, LogOut, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import GitHubDebug from "@/components/github-debug"

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut, signInWithGitHub } = useAuth()
  const [hasGitHubToken, setHasGitHubToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    checkGitHubConnection()
  }, [])

  const checkGitHubConnection = async () => {
    setIsLoading(true)
    try {
      const token = await getGitHubToken()
      setHasGitHubToken(!!token)
    } catch (error) {
      console.error('Error checking GitHub connection:', error)
      setHasGitHubToken(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReconnectGitHub = async () => {
    setIsReconnecting(true)
    try {
      // Force re-authentication with GitHub
      await signInWithGitHub(true)
    } catch (error) {
      console.error('Error reconnecting GitHub:', error)
      setIsReconnecting(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-semibold">Settings</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative px-6 pt-24 pb-20">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-xl font-semibold mb-6">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-base">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">User ID</label>
                  <p className="text-xs font-mono text-gray-500">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* GitHub Connection */}
            <div className="glass-card p-8 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">GitHub Connection</h2>
                <Github className="w-6 h-6 text-gray-400" />
              </div>

              {isLoading ? (
                <div className="flex items-center space-x-3 text-gray-400">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Checking connection...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${hasGitHubToken ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm">
                        {hasGitHubToken ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <button
                      onClick={handleReconnectGitHub}
                      disabled={isReconnecting}
                      className="flex items-center space-x-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isReconnecting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>{hasGitHubToken ? 'Reconnect' : 'Connect'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {!hasGitHubToken && (
                    <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm text-yellow-500">GitHub connection required</p>
                        <p className="text-xs text-gray-400">
                          You need to connect your GitHub account to create repositories. 
                          Make sure to grant the "repo" permission when prompted.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Required permissions:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>repo - Full control of private repositories</li>
                      <li>user - Read access to profile data</li>
                      <li>read:org - Read access to organization membership</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="glass-card p-8 rounded-xl border border-blue-500/20">
                <GitHubDebug />
              </div>
            )}

            {/* Danger Zone */}
            <div className="glass-card p-8 rounded-xl border border-red-500/20">
              <h2 className="text-xl font-semibold mb-6 text-red-400">Danger Zone</h2>
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <p className="text-xs text-gray-500">
                  This will clear all your session data and cached tokens.
                </p>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </div>
    </ProtectedRoute>
  )
}