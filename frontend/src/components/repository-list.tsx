'use client'

import { useState } from 'react'
import RepositoryCard, { Repository } from './repository-card'
import InstallationModal from './installation-modal'
import DeleteConfirmationModal from './delete-confirmation-modal'
import { Loader2 } from 'lucide-react'
import { useGitHubAuth } from '@/hooks/useGitHubAuth'

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
  const [repositoryToDelete, setRepositoryToDelete] = useState<Repository | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { scopes } = useGitHubAuth()
  
  const hasDeletePermission = scopes.includes('delete_repo')

  const handleCardClick = (repo: Repository) => {
    setSelectedRepository(repo)
  }

  const handleDeleteRequest = (repo: Repository) => {
    setRepositoryToDelete(repo)
  }

  const handleDeleteConfirm = async () => {
    if (!repositoryToDelete || !onDelete) return
    
    setDeleting(true)
    try {
      await onDelete(repositoryToDelete)
      setRepositoryToDelete(null)
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error('Failed to delete repository:', error)
      // Error handling is done in the parent component
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
    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repositories.map((repo) => (
          <RepositoryCard
            key={repo.id}
            repository={repo}
            onClick={() => handleCardClick(repo)}
            onDelete={onDelete ? handleDeleteRequest : undefined}
            canDelete={hasDeletePermission && !!onDelete}
          />
        ))}
      </div>

      <InstallationModal
        repository={selectedRepository}
        onClose={() => setSelectedRepository(null)}
      />
      
      <DeleteConfirmationModal
        isOpen={!!repositoryToDelete}
        onClose={() => setRepositoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        repository={repositoryToDelete}
        isDeleting={deleting}
      />
    </>
  )
}