"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { useRepositories } from '@/hooks/useRepositories'
import RepositoryList from '@/components/repository-list'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Settings, LogOut, User, Plus } from 'lucide-react'
import { DebugGitHubToken } from '@/components/debug-github-token'
import { getGitHubToken } from '@/lib/github'

// UserDropdown Component
function UserDropdown({ user, signOut }: { user: any; signOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 glass-card rounded-lg transition-all hover:bg-white/5"
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || user.email}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm font-medium">{user?.name || user?.username || user?.email?.split('@')[0] || 'User'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden animate-slide-up">
          <div className="p-2">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all hover:bg-white/5"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Settings</span>
            </Link>
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all hover:bg-white/5 text-left"
            >
              <LogOut className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { repositories, loading, error, refresh, deleteRepository } = useRepositories()
  const router = useRouter()
  const [hasGitHubToken, setHasGitHubToken] = useState<boolean | null>(null)
  
  // Check for redirect after auth or if we need to refresh
  useEffect(() => {
    // Check if we're coming from auth
    const urlParams = new URLSearchParams(window.location.search)
    const fromAuth = urlParams.get('from_auth')
    const shouldRefresh = urlParams.get('refresh')
    
    if (fromAuth) {
      // Remove the query parameter
      urlParams.delete('from_auth')
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
      
      // Check for saved redirect
      const redirectAfterAuth = localStorage.getItem('redirectAfterAuth')
      if (redirectAfterAuth) {
        console.log('Found redirect after auth:', redirectAfterAuth)
        localStorage.removeItem('redirectAfterAuth')
        
        // Small delay to ensure session is fully established
        setTimeout(() => {
          router.push(redirectAfterAuth)
        }, 100)
      }
    }
    
    // Force refresh if requested
    if (shouldRefresh === 'true') {
      urlParams.delete('refresh')
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
      
      // Refresh repositories after a small delay
      setTimeout(() => {
        refresh()
      }, 500)
    }
  }, [router, refresh])

  // Check for GitHub token
  useEffect(() => {
    const checkGitHubToken = async () => {
      const token = await getGitHubToken()
      setHasGitHubToken(!!token)
    }
    checkGitHubToken()
  }, [])
  
  // Filter only 5AM Founder repositories
  const filteredRepos = repositories
    .map(repo => ({
      ...repo,
      is_5am_founder: repo.description?.toLowerCase().includes('5am founder') || 
                      repo.description?.toLowerCase().includes('created with 5am founder') ||
                      repo.topics?.includes('5am-founder') ||
                      repo.topics?.includes('5amfounder') ||
                      false
    }))
    .filter(repo => repo.is_5am_founder)
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
          }
          
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.2s ease-out;
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            -webkit-backdrop-filter: blur(20px);
          }
          
          .gradient-border {
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            padding: 1px;
            border-radius: 0.75rem;
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              5AM Founder
            </Link>
            <UserDropdown user={user} signOut={signOut} />
          </div>
        </nav>
        
        <main className="relative px-6 pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-20">
              {/* Welcome Message */}
              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 tracking-tight">
                    Welcome back,
                  </h1>
                  <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text">
                    {user?.name || user?.email?.split('@')[0] || 'Developer'}
                  </h2>
                </div>
                
                <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
                  Ready to build something amazing today?
                </p>
              </div>

              {/* Create New Project CTA */}
              <div className="flex justify-center">
                <Link
                  href="/newproject"
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center space-x-4 px-8 py-4 bg-black rounded-2xl leading-none">
                    <Plus className="w-6 h-6" />
                    <span className="font-semibold text-lg">Create New Project</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Repositories Section */}
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Your Projects</h2>
                  <p className="text-base text-gray-400">
                    {filteredRepos.length === 0 
                      ? 'No projects yet' 
                      : `${filteredRepos.length} ${filteredRepos.length === 1 ? 'project' : 'projects'} created with 5AM Founder`
                    }
                  </p>
                </div>
              </div>
              
              {error ? (
                <div className="glass-card rounded-xl p-6 border-red-500/20 bg-red-900/10">
                  <p className="text-red-400 font-medium">Error: {error}</p>
                  {error.includes('GitHub') && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-4">Debug Information:</p>
                      <DebugGitHubToken />
                    </div>
                  )}
                </div>
              ) : (
                <RepositoryList 
                  repositories={filteredRepos} 
                  loading={loading} 
                  onRefresh={refresh}
                  onDelete={deleteRepository}
                />
              )}
              
              {/* Empty State */}
              {!loading && filteredRepos.length === 0 && !error && (
                <div className="text-center py-20">
                  {hasGitHubToken === false ? (
                    <div className="mb-8">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 mx-auto flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Connect GitHub to view projects</h3>
                      <p className="text-gray-400 max-w-md mx-auto mb-6">
                        You'll need to connect your GitHub account when creating your first project to see repositories here.
                      </p>
                      <div className="flex flex-col items-center gap-3">
                        <Link
                          href="/newproject"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          Create Your First Project
                        </Link>
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-4">
                            <details className="inline-block">
                              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 transition-colors">
                                Debug Info
                              </summary>
                              <div className="mt-2">
                                <DebugGitHubToken />
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">No projects yet</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Create your first project with 5AM Founder to see it here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}