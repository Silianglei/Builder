import React from "react"
import { Globe, Lock, Shield, Database, CreditCard, Check, Edit2, Package, ChevronRight } from "lucide-react"
import { ProjectConfig } from "../page"
import { User } from "@/types/auth"

interface ReviewStepProps {
  config: ProjectConfig
  user: User | null
  onEdit?: (step: number) => void
}

export default function ReviewStep({ config, user, onEdit }: ReviewStepProps) {
  const getSelectedFeatures = () => {
    const features = []
    if (config.integrations.supabaseAuth) {
      const providers = config.integrations.supabaseAuthProviders || []
      features.push({
        name: "Authentication",
        icon: <Shield className="w-5 h-5" />,
        details: providers.length > 0 ? `${providers.join(', ')} OAuth` : 'Enabled',
        color: 'blue'
      })
    }
    if (config.integrations.database === 'supabase') {
      features.push({
        name: "Database",
        icon: <Database className="w-5 h-5" />,
        details: "PostgreSQL with real-time",
        color: 'emerald'
      })
    }
    if (config.integrations.stripe) {
      features.push({
        name: "Payments",
        icon: <CreditCard className="w-5 h-5" />,
        details: "Stripe subscriptions",
        color: 'purple'
      })
    }
    return features
  }

  const techStackItems = [
    { name: "Next.js 15", emoji: "⚡" },
    { name: "TypeScript", emoji: "🔷" },
    { name: "Tailwind CSS", emoji: "🎨" },
    { name: "Docker", emoji: "🐳" },
    { name: "Jest", emoji: "🧪" },
    { name: "GitHub Actions", emoji: "🚀" },
  ]

  const selectedFeatures = getSelectedFeatures()

  return (
    <div className="space-y-6">
      {/* Project Overview Card */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {config.projectName || "my-project"}
            </h2>
            {config.projectDescription && (
              <p className="text-sm text-gray-400 max-w-md">
                {config.projectDescription}
              </p>
            )}
          </div>
          {onEdit && (
            <button
              onClick={() => onEdit(1)}
              className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
            config.isPrivate 
              ? 'bg-purple-500/10 border border-purple-500/20' 
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}>
            {config.isPrivate ? (
              <>
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">Private</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">Public</span>
              </>
            )}
          </div>
          
          {config.initWithReadme && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">README included</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Features */}
      {selectedFeatures.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Selected Features</h3>
            {onEdit && (
              <button
                onClick={() => onEdit(2)}
                className="text-xs text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {selectedFeatures.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 bg-gradient-to-br ${
                  feature.color === 'blue' 
                    ? 'border-blue-500/30 from-blue-500/10 to-transparent' 
                    : feature.color === 'emerald'
                    ? 'border-emerald-500/30 from-emerald-500/10 to-transparent'
                    : 'border-purple-500/30 from-purple-500/10 to-transparent'
                }`}
              >
                <div className={`inline-flex p-2 rounded-lg mb-3 ${
                  feature.color === 'blue' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : feature.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {feature.icon}
                </div>
                <h4 className="font-medium mb-1">{feature.name}</h4>
                <p className="text-xs text-gray-400">{feature.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-4">Tech Stack Included</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {techStackItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <span className="text-xl" role="img" aria-label={item.name}>
                {item.emoji}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ready to Create */}
      <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Package className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Ready to Create</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your project will be created with all selected features pre-configured and ready to use.
            </p>
            
            {!user && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-400">
                  Sign in with GitHub to create your repository
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}