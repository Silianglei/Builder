"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'
import GitHubTest from '@/components/github-test'
import GitHubDebug from '@/components/github-debug'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  
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
        
        <main className="relative px-6 pt-24 pb-20">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'Developer'}</span>
              </h1>
              <p className="text-gray-400">
                Your projects and GitHub integration status
              </p>
            </div>

            {/* GitHub Test Component */}
            <div className="mb-12 space-y-6">
              <GitHubDebug />
              <GitHubTest />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="glass-card rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Projects Created</div>
                <div className="text-3xl font-bold gradient-text">0</div>
                <p className="text-xs text-gray-500 mt-1">Start creating</p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">GitHub Repos</div>
                <div className="text-3xl font-bold gradient-text">--</div>
                <p className="text-xs text-gray-500 mt-1">Connect GitHub</p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">Deploy Status</div>
                <div className="text-3xl font-bold text-green-400">Ready</div>
                <p className="text-xs text-gray-500 mt-1">All systems go</p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="text-sm text-gray-400 mb-2">API Status</div>
                <div className="text-3xl font-bold text-green-400">Online</div>
                <p className="text-xs text-gray-500 mt-1">100% uptime</p>
              </div>
            </div>

            {/* Recent Projects Section */}
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-6">No projects yet</p>
                <Link
                  href="/newproject"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Your First Project</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}