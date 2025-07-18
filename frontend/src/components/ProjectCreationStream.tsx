'use client'

import React, { useEffect, useState, useRef } from 'react'
import { CheckCircle2, Circle, Loader2, AlertCircle, Zap, GitBranch, Upload, Package, Sparkles, Code2 } from 'lucide-react'

interface StreamUpdate {
  type: 'project_update'
  update_type: string
  timestamp: string
  data: any
}

interface ProjectCreationStreamProps {
  userId: string
  isCreating: boolean
}

const updateIcons: { [key: string]: React.ReactNode } = {
  repository_created: <GitBranch className="w-4 h-4" />,
  preparing_template: <Package className="w-4 h-4" />,
  template_ready: <Zap className="w-4 h-4" />,
  upload_started: <Upload className="w-4 h-4" />,
  upload_progress: <Upload className="w-4 h-4" />,
  creating_commit: <GitBranch className="w-4 h-4" />,
  upload_complete: <CheckCircle2 className="w-4 h-4" />,
  file_error: <AlertCircle className="w-4 h-4" />
}

export default function ProjectCreationStream({ userId, isCreating }: ProjectCreationStreamProps) {
  const [updates, setUpdates] = useState<StreamUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percentage: 0 })
  const wsRef = useRef<WebSocket | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCreating || !userId) return

    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/ws/${userId}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data) as StreamUpdate
        
        if (update.type === 'project_update') {
          setUpdates(prev => [...prev, update])
          
          // Update progress for upload_progress events
          if (update.update_type === 'upload_progress') {
            setUploadProgress(update.data)
          }
          
          // Auto scroll to bottom
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
          }
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [userId, isCreating])

  if (!isCreating) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse" />
        
        {/* Main modal */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-white/10">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/10 bg-black/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Creating Your Project
                </h2>
                <p className="text-sm text-gray-400">Setting up your Next.js + Supabase application</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Loading Animation */}
            <div className="relative mb-8">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Orbiting dots */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full" />
                  </div>
                  <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full" />
                  </div>
                  <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '1s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full" />
                  </div>
                  
                  {/* Center icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Updates Terminal */}
            <div className="rounded-xl bg-black/50 border border-white/10 overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-gray-400 ml-2">Build Output</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'} ${isConnected ? 'animate-pulse' : ''}`} />
                  <span className="text-xs text-gray-400">
                    {isConnected ? 'Live' : 'Connecting...'}
                  </span>
                </div>
              </div>
              
              {/* Terminal Content */}
              <div
                ref={containerRef}
                className="p-4 font-mono text-xs space-y-2 max-h-64 overflow-y-auto custom-scrollbar"
              >
                {updates.map((update, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-blue-400 select-none">❯</span>
                    <div className="flex-1">
                      <span className={`
                        ${update.update_type === 'upload_complete' ? 'text-green-400' :
                          update.update_type === 'file_error' ? 'text-red-400' :
                          'text-gray-300'}
                      `}>
                        {update.data.message || update.update_type.replace(/_/g, ' ')}
                      </span>
                      {update.data.current_file && (
                        <span className="text-gray-500 ml-2">
                          [{update.data.current_file}]
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Blinking cursor */}
                {updates.length > 0 && uploadProgress.percentage < 100 && (
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 select-none">❯</span>
                    <span className="text-gray-300">
                      <span className="inline-block w-2 h-4 bg-gray-300 animate-blink" />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Summary */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              {uploadProgress.total > 0 && (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2">
                    {uploadProgress.percentage === 100 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">Complete!</span>
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-sm text-gray-300">
                          Processing {uploadProgress.current} of {uploadProgress.total} files
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-blink {
          animation: blink 1s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  )
}