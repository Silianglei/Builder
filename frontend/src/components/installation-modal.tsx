'use client'

import { useState } from 'react'
import { Repository } from './repository-card'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Copy, ExternalLink, Trash2, Check, Loader2, Terminal } from 'lucide-react'

interface InstallationModalProps {
  repository: Repository | null
  onClose: () => void
  onDelete: () => Promise<void>
  deleting?: boolean
  deleteError?: string | null
}

export default function InstallationModal({ 
  repository, 
  onClose, 
  onDelete,
  deleting = false,
  deleteError = null
}: InstallationModalProps) {
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!repository) return null

  const commands = [
    `git clone ${repository.clone_url}`,
    `cd ${repository.name}`,
    'npm install',
    'npm run dev'
  ]

  const fullCommand = commands.join(' && ')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }
    await onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <Modal open={!!repository} onOpenChange={() => onClose()}>
      <ModalContent className="max-w-2xl p-8">
        <ModalHeader>
          <ModalTitle className="text-2xl font-bold mb-2">
            {repository.name}
          </ModalTitle>
        </ModalHeader>

        {/* Content */}
        <div className="space-y-6">
          {/* Terminal */}
          <div className="glass-card rounded-xl overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">terminal</div>
              </div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 bg-black/20">
              <div className="font-mono text-sm space-y-2">
                {commands.map((command, index) => (
                  <div key={index} className="text-gray-300">
                    <span className="text-gray-500 mr-2">$</span>
                    {command}
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2 text-green-400 text-xs">
                    <Check className="w-3 h-3" />
                    <span>Server running on http://localhost:3000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {deleteError && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400 whitespace-pre-line">{deleteError}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg transition-all hover:bg-white/5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy Commands</span>
                  </>
                )}
              </button>

              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 glass-card rounded-lg transition-all hover:bg-white/5"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">View on GitHub</span>
              </a>
            </div>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                showDeleteConfirm 
                  ? 'bg-red-600/20 border border-red-500/30 text-red-400' 
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
              }`}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">
                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}