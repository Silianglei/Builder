'use client'

import { useState } from 'react'
import { Repository } from './repository-card'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal'
import { Copy, ExternalLink, Check, Terminal, Github } from 'lucide-react'

interface InstallationModalProps {
  repository: Repository | null
  onClose: () => void
}

export default function InstallationModal({ 
  repository, 
  onClose
}: InstallationModalProps) {
  const [copied, setCopied] = useState(false)

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

  return (
    <Modal open={!!repository} onOpenChange={() => onClose()}>
      <ModalContent className="max-w-3xl p-0 overflow-hidden">
        <ModalHeader className="p-8 pb-0">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Github className="w-5 h-5 text-blue-400" />
            </div>
            <ModalTitle className="text-3xl font-bold gradient-text">
              {repository.name}
            </ModalTitle>
          </div>
        </ModalHeader>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Terminal */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Quick Start</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                title="Copy commands"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                    <span className="text-xs text-gray-400 group-hover:text-white">Copy</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              <div className="space-y-3">
                {commands.map((command, index) => (
                  <div key={index} className="flex items-start space-x-3 group">
                    <span className="text-blue-400 select-none">❯</span>
                    <span className="text-gray-100 flex-1">{command}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm">Server running on http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center space-x-3 px-6 py-3 bg-black rounded-xl leading-none">
                <Github className="w-5 h-5" />
                <span className="font-medium">View on GitHub</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </div>
            </a>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}