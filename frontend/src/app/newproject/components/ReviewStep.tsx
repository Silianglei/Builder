import { Globe, Lock, AlertCircle, ArrowRight } from "lucide-react"
import { ProjectConfig } from "../page"
import { User } from "@/types/auth"

interface ReviewStepProps {
  config: ProjectConfig
  user: User | null
}

export default function ReviewStep({ config, user }: ReviewStepProps) {
  const getEssentials = () => {
    const items = []
    if (config.integrations.supabaseAuth) items.push("Authentication")
    if (config.integrations.database === 'supabase') items.push("Database")
    if (config.integrations.stripe) items.push("Payments")
    if (config.integrations.email !== 'none') items.push("Email")
    if (config.integrations.analytics !== 'none') items.push("Analytics")
    if (config.techStack.typescript) items.push("TypeScript")
    if (config.techStack.docker) items.push("Docker")
    if (config.techStack.testing !== 'none') items.push("Testing")
    return items
  }

  const essentials = getEssentials()

  return (
    <div className="space-y-8">
      {/* Sign In Alert */}
      {!user && (
        <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Sign in to continue</p>
              <p className="text-xs text-gray-400 mt-1">
                You'll need GitHub access to create your repository
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Summary - Simplified */}
      <div className="space-y-6">
        {/* Name & Visibility */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {config.projectName || "my-project"}
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              {config.isPrivate ? (
                <>
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">Private repository</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400">Public repository</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selected Features */}
        {essentials.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-3">Includes</p>
            <div className="flex flex-wrap gap-2">
              {essentials.map((item) => (
                <span 
                  key={item}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/10">
        <h4 className="text-sm font-medium mb-4">Your project will be ready in</h4>
        <div className="text-3xl font-bold gradient-text mb-4">~60 seconds</div>
        
        <div className="space-y-3 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <span>Repository created in your GitHub</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <span>Custom code generated with your stack</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <span>Ready to clone and start building</span>
          </div>
        </div>
      </div>

      {/* Quick Start Preview */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-gray-400 mb-3">After creation, run:</p>
        <div className="font-mono text-xs space-y-2">
          <div className="text-green-400">$ git clone https://github.com/{user ? 'you' : 'username'}/{config.projectName || 'my-project'}</div>
          <div className="text-green-400">$ cd {config.projectName || 'my-project'}</div>
          <div className="text-green-400">$ npm install</div>
          <div className="text-green-400">$ npm run dev</div>
        </div>
      </div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}