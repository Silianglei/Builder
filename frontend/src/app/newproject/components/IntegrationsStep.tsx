import { useState } from "react"
import { Shield, CreditCard, Database, Mail, BarChart3 } from "lucide-react"
import { ProjectConfig } from "../page"
import IntegrationCard from "./IntegrationCard"

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
    <div className="space-y-8">
      {/* Core Features */}
      <div className="space-y-3">
        <IntegrationCard
          name="Authentication"
          description="User accounts, OAuth, and secure sessions"
          icon={<Shield className="w-5 h-5" />}
          selected={config.integrations.supabaseAuth}
          onClick={() => updateIntegrations({ supabaseAuth: !config.integrations.supabaseAuth })}
          badge="Essential"
        />

        {/* OAuth Providers - Show inline when auth is selected */}
        {config.integrations.supabaseAuth && (
          <div className="ml-16 space-y-3">
            <p className="text-xs text-gray-400 mb-2">OAuth Providers</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'github', name: 'GitHub' },
                { id: 'google', name: 'Google' },
              ].map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => toggleAuthProvider(provider.id)}
                  className={`px-3 py-2 text-sm rounded-md border transition-all ${
                    config.integrations.supabaseAuthProviders?.includes(provider.id)
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                      : 'border-white/10 hover:border-white/20 text-gray-400'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <IntegrationCard
          name="Database"
          description="PostgreSQL with real-time subscriptions"
          icon={<Database className="w-5 h-5" />}
          selected={config.integrations.database === 'supabase'}
          onClick={() => updateIntegrations({ 
            database: config.integrations.database === 'supabase' ? 'none' : 'supabase' 
          })}
          badge="Essential"
        />

        <IntegrationCard
          name="Payments"
          description="Stripe integration for subscriptions"
          icon={<CreditCard className="w-5 h-5" />}
          selected={config.integrations.stripe}
          onClick={() => updateIntegrations({ stripe: !config.integrations.stripe })}
        />
      </div>

      {/* Optional Features */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Optional</p>
        <div className="space-y-3">
          <IntegrationCard
            name="Email"
            description="Send transactional emails"
            icon={<Mail className="w-5 h-5" />}
            selected={config.integrations.email !== 'none'}
            onClick={() => updateIntegrations({ 
              email: config.integrations.email === 'none' ? 'resend' : 'none' 
            })}
            compact
          />

          <IntegrationCard
            name="Analytics"
            description="Track user behavior and metrics"
            icon={<BarChart3 className="w-5 h-5" />}
            selected={config.integrations.analytics !== 'none'}
            onClick={() => updateIntegrations({ 
              analytics: config.integrations.analytics === 'none' ? 'posthog' : 'none' 
            })}
            compact
          />
        </div>
      </div>

      {/* Quick tip */}
      <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 Start with essentials. You can always add more integrations later.
        </p>
      </div>
    </div>
  )
}