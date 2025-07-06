import { FileCode2, TestTube2, Package } from "lucide-react"
import { ProjectConfig } from "../page"

interface TechStackStepProps {
  config: ProjectConfig
  updateConfig: (updates: Partial<ProjectConfig>) => void
}

export default function TechStackStep({ config, updateConfig }: TechStackStepProps) {
  const updateTechStack = (updates: Partial<typeof config.techStack>) => {
    updateConfig({
      techStack: { ...config.techStack, ...updates }
    })
  }

  return (
    <div className="space-y-8">
      {/* Pre-selected Stack */}
      <div>
        <p className="text-sm text-gray-400 mb-4">Your stack includes</p>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.17 0-.33.06-.46.14-.86.3-1.75.46-2.66.46-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 .91-.15 1.8-.46 2.66-.08.13-.14.29-.14.46 0 .43.35.78.78.78.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10zm0 0"/>
                  <path d="M15 9v6l-4.5-6H9v6h1.5v-3.5l3 4V15H15V9z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium">Next.js 15</h4>
                <p className="text-xs text-gray-400">Latest React framework</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.51 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35-.98-1-2.09-2.15-4.59-2.15z" fill="#06B6D4"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium">Tailwind CSS</h4>
                <p className="text-xs text-gray-400">Utility-first styling</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div>
        <p className="text-sm text-gray-400 mb-4">Configuration</p>
        <div className="space-y-3">
          {/* TypeScript Toggle */}
          <label className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <FileCode2 className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm font-medium">TypeScript</span>
                <p className="text-xs text-gray-400">Type safety and better DX</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={config.techStack.typescript}
                onChange={(e) => updateTechStack({ typescript: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                config.techStack.typescript ? 'bg-blue-500' : 'bg-white/10'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  config.techStack.typescript ? 'translate-x-5' : ''
                }`} />
              </div>
            </div>
          </label>

          {/* Docker Toggle */}
          <label className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-sm font-medium">Docker</span>
                <p className="text-xs text-gray-400">Container deployment ready</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={config.techStack.docker}
                onChange={(e) => updateTechStack({ docker: e.target.checked })}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                config.techStack.docker ? 'bg-blue-500' : 'bg-white/10'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  config.techStack.docker ? 'translate-x-5' : ''
                }`} />
              </div>
            </div>
          </label>

          {/* Testing - Simple Select */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <TestTube2 className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Testing</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'none', label: 'None' },
                { value: 'jest', label: 'Jest' },
                { value: 'vitest', label: 'Vitest' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateTechStack({ testing: option.value as any })}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                    config.techStack.testing === option.value
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Also Included */}
      <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-purple-400 mb-2">Also included</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• ESLint & Prettier configured</li>
          <li>• GitHub Actions CI/CD</li>
          <li>• Environment variables setup</li>
        </ul>
      </div>
    </div>
  )
}