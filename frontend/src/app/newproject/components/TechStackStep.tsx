import React from 'react'
import { Check } from "lucide-react"
import { ProjectConfig } from "../page"

interface TechStackStepProps {
  config: ProjectConfig
  updateConfig: (updates: Partial<ProjectConfig>) => void
}

export default function TechStackStep({ config, updateConfig }: TechStackStepProps) {
  // Always set these as defaults when this step is rendered
  React.useEffect(() => {
    updateConfig({
      techStack: {
        ...config.techStack,
        frontend: 'nextjs15',
        styling: 'tailwind',
        typescript: true,
        docker: true,
        testing: 'jest'
      }
    })
  }, [])

  const includedFeatures = [
    { name: "Next.js 15", description: "Latest React framework", icon: "⚡" },
    { name: "TypeScript", description: "Type safety & better DX", icon: "🔷" },
    { name: "Tailwind CSS", description: "Utility-first styling", icon: "🎨" },
    { name: "Docker", description: "Container deployment ready", icon: "🐳" },
    { name: "Jest", description: "Testing framework included", icon: "🧪" },
    { name: "ESLint + Prettier", description: "Code quality tools", icon: "✨" },
    { name: "GitHub Actions", description: "CI/CD pipeline ready", icon: "🚀" },
    { name: "Environment Config", description: "Secure secrets management", icon: "🔐" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Everything You Need</h3>
        <p className="text-sm text-gray-400">Modern stack with best practices built-in</p>
      </div>

      {/* Included Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {includedFeatures.map((feature, index) => (
          <div 
            key={index}
            className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10"
          >
            <span className="text-2xl" role="img" aria-label={feature.name}>
              {feature.icon}
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white flex items-center space-x-2">
                <span>{feature.name}</span>
                <Check className="w-3 h-3 text-green-400" />
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Note */}
      <div className="p-4 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10 rounded-lg">
        <p className="text-sm text-gray-300">
          All features are pre-configured and ready to use. You can customize everything after project creation.
        </p>
      </div>
    </div>
  )
}