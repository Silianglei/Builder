'use client'

import { AlertTriangle, X } from 'lucide-react'
import { Repository } from './repository-card'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  repository: Repository | null
  isDeleting?: boolean
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  repository,
  isDeleting = false
}: DeleteConfirmationModalProps) {
  if (!isOpen || !repository) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#111827] border border-white/10 shadow-2xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">
                Delete Repository
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-white">{repository.name}</span>?
              </p>
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">
                  <strong>Warning:</strong> This action cannot be undone. This will permanently delete the repository and all of its contents.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Repository</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}