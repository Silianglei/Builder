import { useState, useEffect } from "react"
import { Info, Lock, Globe, FileText } from "lucide-react"
import { ProjectConfig } from "../page"

interface ProjectDetailsStepProps {
  config: ProjectConfig
  updateConfig: (updates: Partial<ProjectConfig>) => void
}

export default function ProjectDetailsStep({ config, updateConfig }: ProjectDetailsStepProps) {
  const [projectNameError, setProjectNameError] = useState("")

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

  return (
    <div className="space-y-10">
      {/* Project Name - Simplified */}
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
          Project Name
        </label>
        <input
          id="projectName"
          type="text"
          value={config.projectName}
          onChange={(e) => updateConfig({ projectName: e.target.value })}
          placeholder="my-awesome-saas"
          className={`w-full px-4 py-3 bg-white/5 border rounded-lg transition-all ${
            projectNameError 
              ? 'border-red-500/50 focus:border-red-500' 
              : 'border-white/10 hover:border-white/20 focus:border-blue-500/50'
          } focus:outline-none focus:bg-white/[0.07] placeholder:text-gray-500`}
        />
        {projectNameError && (
          <p className="mt-2 text-sm text-red-400">{projectNameError}</p>
        )}
      </div>

      {/* Repository Visibility - Cleaner */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Repository Visibility
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateConfig({ isPrivate: false })}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              !config.isPrivate 
                ? 'border-blue-500/50 bg-blue-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            }`}
          >
            <Globe className={`w-6 h-6 mb-3 transition-colors ${!config.isPrivate ? 'text-blue-400' : 'text-gray-400'}`} />
            <h4 className="font-medium mb-1">Public</h4>
            <p className="text-xs text-gray-400">Anyone can see this repository</p>
            {!config.isPrivate && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => updateConfig({ isPrivate: true })}
            className={`relative p-6 rounded-lg border-2 transition-all ${
              config.isPrivate 
                ? 'border-purple-500/50 bg-purple-500/10' 
                : 'border-white/10 hover:border-white/20 bg-white/5'
            }`}
          >
            <Lock className={`w-6 h-6 mb-3 transition-colors ${config.isPrivate ? 'text-purple-400' : 'text-gray-400'}`} />
            <h4 className="font-medium mb-1">Private</h4>
            <p className="text-xs text-gray-400">You choose who can see</p>
            {config.isPrivate && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Description - Optional and Minimized */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors">
          + Add description (optional)
        </summary>
        <div className="mt-4">
          <textarea
            value={config.projectDescription}
            onChange={(e) => updateConfig({ projectDescription: e.target.value })}
            placeholder="A brief description of your project..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 focus:border-blue-500/50 focus:outline-none focus:bg-white/[0.07] transition-all placeholder:text-gray-500 resize-none"
          />
        </div>
      </details>

      {/* Initialize with README - Simple Toggle */}
      <label className="flex items-center space-x-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={config.initWithReadme}
            onChange={(e) => updateConfig({ initWithReadme: e.target.checked })}
            className="sr-only"
          />
          <div className={`w-11 h-6 rounded-full transition-colors ${
            config.initWithReadme ? 'bg-blue-500' : 'bg-white/10'
          }`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              config.initWithReadme ? 'translate-x-5' : ''
            }`} />
          </div>
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          Initialize with README
        </span>
      </label>

      <style jsx>{`
        details[open] summary {
          color: #f3f4f6;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}