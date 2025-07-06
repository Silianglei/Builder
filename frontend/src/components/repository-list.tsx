'use client'

import { useState } from 'react'
import RepositoryCard, { Repository } from './repository-card'
import InstallationModal from './installation-modal'
import { Loader2 } from 'lucide-react'

interface RepositoryListProps {
  repositories: Repository[]
  loading?: boolean
  onRefresh?: () => void
  onDelete?: (repo: Repository) => Promise<void>
}

export default function RepositoryList({ 
  repositories, 
  loading = false, 
  onRefresh,
  onDelete 
}: RepositoryListProps) {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!selectedRepository || !onDelete) return
    
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(selectedRepository)
      setSelectedRepository(null)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Failed to delete repository:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete repository'
      
      // Check if it's a scope permission error
      if (errorMessage.includes('delete_repo')) {
        setDeleteError(
          "Repository deletion requires additional permissions. To enable deletion, you'll need to:\n" +
          "1. Update your Supabase GitHub OAuth settings to include 'delete_repo' scope\n" +
          "2. Sign out and reconnect your GitHub account\n" +
          "3. Grant the additional permission when prompted by GitHub"
        )
      } else {
        setDeleteError(errorMessage)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-gray-400 mb-6">No repositories found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onClick={() => setSelectedRepository(repo)}
          />
        ))}
      </div>

      <InstallationModal
        repository={selectedRepository}
        onClose={() => {
          setSelectedRepository(null)
          setDeleteError(null)
        }}
      />
    </>
  )
}