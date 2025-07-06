"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'
import { useRepositories } from '@/hooks/useRepositories'
import RepositoryList from '@/components/repository-list'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { repositories, loading, error, refresh, deleteRepository } = useRepositories()
  
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
          
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
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
            <div className="flex items-center space-x-4">
              <Link 
                href="/newproject" 
                className="flex items-center space-x-2 px-5 py-2.5 glass-card rounded-lg font-medium transition-all hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Project</span>
              </Link>
              <button 
                onClick={signOut} 
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        
        <main className="relative px-6 pt-32 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 glass-card rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">GitHub Connected</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your <span className="gradient-text">Repositories</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                Manage and deploy your projects with a single click
              </p>
            </div>

            {/* Repositories Section */}
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">GitHub Projects</h2>
                  <p className="text-sm text-gray-500 mt-1">{repositories.length} repositories found</p>
                </div>
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg font-medium transition-all hover:bg-white/5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
              
              {error ? (
                <div className="glass-card rounded-xl p-6 border-red-500/20 bg-red-900/10">
                  <p className="text-red-400 font-medium">Error: {error}</p>
                </div>
              ) : (
                <RepositoryList 
                  repositories={repositories} 
                  loading={loading} 
                  onRefresh={refresh}
                  onDelete={deleteRepository}
                />
              )}
              
              {/* Empty State CTA */}
              {!loading && repositories.length === 0 && !error && (
                <div className="text-center py-20">
                  <div className="mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mx-auto flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No repositories yet</h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Create your first project to see it here. We'll help you set up everything you need.
                    </p>
                  </div>
                  <Link
                    href="/newproject"
                    className="inline-flex items-center space-x-3 px-8 py-4 gradient-border group"
                  >
                    <div className="flex items-center space-x-3 px-6 py-3 bg-[#0a0a0a] rounded-[0.65rem] transition-all group-hover:bg-[#0a0a0a]/50">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-semibold text-lg">Create New Project</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}