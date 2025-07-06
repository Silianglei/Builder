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
}

interface RepositoryCardProps {
  repository: Repository
  onClick: () => void
}

export default function RepositoryCard({ repository, onClick }: RepositoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:border-white/20 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">
              {repository.name}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
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
        
        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
      </div>

      {repository.description && (
        <p className="text-sm text-gray-500 line-clamp-2">
          {repository.description}
        </p>
      )}
    </div>
  )
}