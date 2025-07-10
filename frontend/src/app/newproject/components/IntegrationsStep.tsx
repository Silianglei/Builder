import React from 'react'
import { Shield, Database, CreditCard, Github, Chrome, Mail } from "lucide-react"
import { ProjectConfig } from "../page"

interface IntegrationsStepProps {
  config: ProjectConfig
  updateConfig: (updates: Partial<ProjectConfig>) => void
}

export default function IntegrationsStep({ config, updateConfig }: IntegrationsStepProps) {
  const updateIntegrations = (updates: Partial<typeof config.integrations>) => {
    updateConfig({
      integrations: { ...config.integrations, ...updates }
    })
  }

  const toggleAuthProvider = (provider: string) => {
    const currentProviders = config.integrations.supabaseAuthProviders || []
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(p => p !== provider)
      : [...currentProviders, provider]
    updateIntegrations({ supabaseAuthProviders: newProviders })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Authentication Box */}
      <div className="relative group">
        <div className={`h-full rounded-xl border transition-all duration-300 ${
          config.integrations.supabaseAuth 
            ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent' 
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          {/* Header with Toggle */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  config.integrations.supabaseAuth ? 'bg-blue-500/20' : 'bg-white/10'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    config.integrations.supabaseAuth ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">Authentication</h3>
                  <p className="text-xs text-gray-400 mt-0.5">User accounts & sessions</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => updateIntegrations({ supabaseAuth: !config.integrations.supabaseAuth })}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ backgroundColor: config.integrations.supabaseAuth ? '#3B82F6' : 'rgba(255,255,255,0.1)' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.integrations.supabaseAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Auth Providers */}
          <div className={`p-6 space-y-3 transition-all duration-300 ${
            config.integrations.supabaseAuth ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Sign-in methods</p>
            
            {/* GitHub */}
            <label className="flex items-center justify-between py-2 cursor-pointer group/item">
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-gray-400" />
                <span className="text-sm">GitHub</span>
              </div>
              <input
                type="checkbox"
                checked={config.integrations.supabaseAuthProviders?.includes('github')}
                onChange={() => toggleAuthProvider('github')}
                disabled={!config.integrations.supabaseAuth}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
            </label>

            {/* Google */}
            <label className="flex items-center justify-between py-2 cursor-pointer group/item">
              <div className="flex items-center space-x-3">
                <Chrome className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Google</span>
              </div>
              <input
                type="checkbox"
                checked={config.integrations.supabaseAuthProviders?.includes('google')}
                onChange={() => toggleAuthProvider('google')}
                disabled={!config.integrations.supabaseAuth}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
            </label>

            {/* Email */}
            <label className="flex items-center justify-between py-2 cursor-pointer group/item">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Email/Password</span>
              </div>
              <input
                type="checkbox"
                checked={config.integrations.supabaseAuthProviders?.includes('email')}
                onChange={() => toggleAuthProvider('email')}
                disabled={!config.integrations.supabaseAuth}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Database Box */}
      <div className="relative group">
        <div className={`h-full rounded-xl border transition-all duration-300 ${
          config.integrations.database === 'supabase' 
            ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent' 
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          {/* Header with Toggle */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  config.integrations.database === 'supabase' ? 'bg-emerald-500/20' : 'bg-white/10'
                }`}>
                  <Database className={`w-5 h-5 ${
                    config.integrations.database === 'supabase' ? 'text-emerald-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">Database</h3>
                  <p className="text-xs text-gray-400 mt-0.5">PostgreSQL with real-time</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => updateIntegrations({ 
                  database: config.integrations.database === 'supabase' ? 'none' : 'supabase' 
                })}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ backgroundColor: config.integrations.database === 'supabase' ? '#10B981' : 'rgba(255,255,255,0.1)' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.integrations.database === 'supabase' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Database Features */}
          <div className={`p-6 space-y-3 transition-all duration-300 ${
            config.integrations.database === 'supabase' ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Instant PostgreSQL database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Real-time subscriptions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Row level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span>Auto-generated APIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Box */}
      <div className="relative group">
        <div className={`h-full rounded-xl border transition-all duration-300 ${
          config.integrations.stripe 
            ? 'border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent' 
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          {/* Header with Toggle */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  config.integrations.stripe ? 'bg-purple-500/20' : 'bg-white/10'
                }`}>
                  <CreditCard className={`w-5 h-5 ${
                    config.integrations.stripe ? 'text-purple-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">Payments</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Stripe subscriptions</p>
                </div>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => updateIntegrations({ stripe: !config.integrations.stripe })}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
                style={{ backgroundColor: config.integrations.stripe ? '#8B5CF6' : 'rgba(255,255,255,0.1)' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.integrations.stripe ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Payment Features */}
          <div className={`p-6 space-y-3 transition-all duration-300 ${
            config.integrations.stripe ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <span>Subscription management</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <span>Customer portal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <span>Webhook handlers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <span>Usage-based billing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}