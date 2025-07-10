'use client'

import { GitBranch, Lock, Unlock, ArrowRight } from 'lucide-react'

export interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  clone_url: string
  ssh_url: string
  private: boolean
  description: string | null
  created_at?: string
  updated_at?: string
  topics?: string[]
  is_5am_founder?: boolean
}

interface RepositoryCardProps {
  repository: Repository
  onClick: () => void
}

export default function RepositoryCard({ repository, onClick }: RepositoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer transition-all duration-300"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
      <div className="relative glass-card rounded-xl p-6 h-full">

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300">
            <GitBranch className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-xl group-hover:text-white transition-colors">
              {repository.name}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              {repository.private ? (
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Unlock className="w-3 h-3" />
                  <span>Public</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-all group-hover:translate-x-0.5" />
        </div>
      </div>

      {repository.description && (
        <p className="text-sm text-gray-400 line-clamp-2 mt-4">
          {repository.description}
        </p>
      )}
      
      </div>
    </div>
  )
}