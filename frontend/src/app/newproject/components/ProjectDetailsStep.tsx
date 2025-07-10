import React, { useState, useEffect } from "react"
import { Globe, Lock, FileText, Sparkles, Plus } from "lucide-react"
import { ProjectConfig } from "../page"

interface ProjectDetailsStepProps {
  config: ProjectConfig
  updateConfig: (updates: Partial<ProjectConfig>) => void
}

export default function ProjectDetailsStep({ config, updateConfig }: ProjectDetailsStepProps) {
  const [projectNameError, setProjectNameError] = useState("")
  const [showDescription, setShowDescription] = useState(false)

  const validateProjectName = (name: string) => {
    if (name.length === 0) {
      setProjectNameError("")
      return
    }
    
    // GitHub repo name validation
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      setProjectNameError("Only letters, numbers, hyphens, and underscores allowed")
    } else if (name.startsWith('-') || name.endsWith('-')) {
      setProjectNameError("Cannot start or end with a hyphen")
    } else if (name.length > 100) {
      setProjectNameError("Name must be 100 characters or less")
    } else {
      setProjectNameError("")
    }
  }

  useEffect(() => {
    validateProjectName(config.projectName)
  }, [config.projectName])

  // Show description field if there's already a description
  useEffect(() => {
    if (config.projectDescription) {
      setShowDescription(true)
    }
  }, [config.projectDescription])

  return (
    <div className="space-y-8">
      {/* Project Name - Enhanced Design */}
      <div className="relative">
        <div className="mb-3">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
            Project Name
          </label>
          <p className="text-xs text-gray-500">This will be your GitHub repository name</p>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          <input
            id="projectName"
            type="text"
            value={config.projectName}
            onChange={(e) => updateConfig({ projectName: e.target.value })}
            placeholder="my-awesome-saas"
            className={`relative w-full px-6 py-4 text-lg bg-white/5 border-2 rounded-xl transition-all duration-300 ${
              projectNameError 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-white/10 hover:border-white/20 focus:border-blue-500/50'
            } focus:outline-none focus:bg-white/[0.07] placeholder:text-gray-500 font-medium`}
          />
          
          {/* Visual feedback for valid name */}
          {config.projectName && !projectNameError && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
            </div>
          )}
        </div>
        
        {projectNameError && (
          <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            <span>{projectNameError}</span>
          </p>
        )}
      </div>

      {/* Description - Modern Design */}
      <div className="relative">
        {!showDescription ? (
          <button
            onClick={() => setShowDescription(true)}
            className="w-full group"
          >
            <div className="flex items-center justify-between px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Add description <span className="text-gray-500">(optional)</span>
                </span>
              </div>
            </div>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <button
                onClick={() => {
                  setShowDescription(false)
                  updateConfig({ projectDescription: '' })
                }}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Remove
              </button>
            </div>
            <textarea
              id="description"
              value={config.projectDescription}
              onChange={(e) => updateConfig({ projectDescription: e.target.value })}
              placeholder="A brief description of your project..."
              rows={3}
              autoFocus
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 focus:border-blue-500/50 focus:outline-none focus:bg-white/[0.07] transition-all placeholder:text-gray-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Repository Visibility - Visual Cards */}
      <div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Repository Visibility
          </label>
          <p className="text-xs text-gray-500">Control who can see and contribute to your project</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Public Option */}
          <button
            onClick={() => updateConfig({ isPrivate: false })}
            className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              !config.isPrivate 
                ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-transparent' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg transition-colors ${
                  !config.isPrivate ? 'bg-blue-500/20' : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Globe className={`w-6 h-6 transition-colors ${
                    !config.isPrivate ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                </div>
                {!config.isPrivate && (
                  <div className="flex items-center space-x-1 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold mb-2 text-left">Public</h4>
              <p className="text-sm text-gray-400 text-left">
                Anyone on the internet can see this repository
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Sparkles className="w-3 h-3" />
                  <span>Great for open source</span>
                </div>
              </div>
            </div>
          </button>

          {/* Private Option */}
          <button
            onClick={() => updateConfig({ isPrivate: true })}
            className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 ${
              config.isPrivate 
                ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent' 
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg transition-colors ${
                  config.isPrivate ? 'bg-purple-500/20' : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <Lock className={`w-6 h-6 transition-colors ${
                    config.isPrivate ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                </div>
                {config.isPrivate && (
                  <div className="flex items-center space-x-1 text-purple-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Selected</span>
                  </div>
                )}
              </div>
              
              <h4 className="font-semibold mb-2 text-left">Private</h4>
              <p className="text-sm text-gray-400 text-left">
                You choose who can see and commit to this repository
              </p>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Lock className="w-3 h-3" />
                  <span>Secure by default</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Initialize with README - Modern Toggle */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <span className="text-sm font-medium">Initialize with README</span>
              <p className="text-xs text-gray-500 mt-0.5">Adds a README.md file to your repository</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => updateConfig({ initWithReadme: !config.initWithReadme })}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            style={{ backgroundColor: config.initWithReadme ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.initWithReadme ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  )
}