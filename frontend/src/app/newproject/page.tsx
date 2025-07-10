"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getGitHubToken } from "@/lib/github"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

// Step Components (we'll create these next)
import StepIndicator from "./components/StepIndicator"
import ProjectDetailsStep from "./components/ProjectDetailsStep"
import IntegrationsStep from "./components/IntegrationsStep"
import ReviewStep from "./components/ReviewStep"

export interface ProjectConfig {
  // Step 1: Project Details
  projectName: string
  projectDescription: string
  isPrivate: boolean
  initWithReadme: boolean
  
  // Step 2: Integrations
  integrations: {
    supabaseAuth: boolean
    supabaseAuthProviders?: string[]
    stripe: boolean
    database: 'supabase' | 'postgresql' | 'none'
    email: 'resend' | 'sendgrid' | 'none'
    analytics: 'posthog' | 'google' | 'none'
  }
  
  // Step 3: Tech Stack
  techStack: {
    frontend: 'nextjs15'
    styling: 'tailwind'
    typescript: boolean
    testing: 'jest' | 'vitest' | 'none'
    docker: boolean
  }
}

const initialConfig: ProjectConfig = {
  projectName: '',
  projectDescription: '',
  isPrivate: false,
  initWithReadme: true,
  integrations: {
    supabaseAuth: true,
    supabaseAuthProviders: ['github', 'google'],
    stripe: false,
    database: 'supabase',
    email: 'none',
    analytics: 'none'
  },
  techStack: {
    frontend: 'nextjs15',
    styling: 'tailwind',
    typescript: true,
    testing: 'none',
    docker: true
  }
}

export default function NewProjectPage() {
  const router = useRouter()
  const { user, signInWithGitHub } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [config, setConfig] = useState<ProjectConfig>(initialConfig)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldAutoCreate, setShouldAutoCreate] = useState(false)
  const [hasLoadedConfig, setHasLoadedConfig] = useState(false)
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(true)

  // Load saved config from localStorage if exists
  useEffect(() => {
    const savedConfig = localStorage.getItem('projectConfig')
    console.log('Loading config from localStorage:', savedConfig)
    if (savedConfig && !hasLoadedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      console.log('Parsed config:', parsedConfig)
      setIsLoadingFromStorage(true)
      setConfig(parsedConfig)
      setHasLoadedConfig(true)
      // Allow saving after a brief delay
      setTimeout(() => setIsLoadingFromStorage(false), 100)
      
      // Check if we have a complete config (user went through all steps)
      if (parsedConfig.projectName && parsedConfig.projectName.trim() !== '') {
        // Jump to review step if we have a saved config
        setCurrentStep(3)
        
        // Check if we're coming back from auth
        const urlParams = new URLSearchParams(window.location.search)
        const fromAuth = urlParams.get('from_auth')
        
        // If user just authenticated and we have a valid config, mark for auto-create
        if (user && fromAuth === 'true') {
          setShouldAutoCreate(true)
          
          // Clean up the URL
          urlParams.delete('from_auth')
          const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
          window.history.replaceState({}, '', newUrl)
        }
      }
    } else {
      // No saved config, we can start saving immediately
      setIsLoadingFromStorage(false)
    }
  }, [user, hasLoadedConfig])

  // Save config to localStorage on changes
  useEffect(() => {
    // Only save if we're not currently loading from storage
    // This prevents re-saving the config we just loaded
    if (!isLoadingFromStorage) {
      localStorage.setItem('projectConfig', JSON.stringify(config))
    }
  }, [config, isLoadingFromStorage])

  // Auto-create project after authentication
  useEffect(() => {
    if (shouldAutoCreate && user && !isCreating) {
      setShouldAutoCreate(false)
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        handleCreateProject()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [shouldAutoCreate, user, isCreating])

  const updateConfig = (updates: Partial<ProjectConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleCreateProject = async () => {
    if (!user) {
      // Save current config for after auth
      localStorage.setItem('redirectAfterAuth', '/newproject')
      
      // Directly trigger GitHub OAuth instead of going to auth page
      await signInWithGitHub()
      return
    }

    setIsCreating(true)
    setError(null)
    setShouldAutoCreate(false) // Clear auto-create flag
    
    try {
      // Validate project name
      if (!config.projectName || config.projectName.trim() === '') {
        throw new Error('Please enter a project name')
      }
      
      if (!/^[a-zA-Z0-9-_]+$/.test(config.projectName)) {
        throw new Error('Project name can only contain letters, numbers, hyphens, and underscores')
      }
      
      // Get GitHub token
      const githubToken = await getGitHubToken()
      
      if (!githubToken) {
        // User needs to re-authenticate with GitHub
        console.log('No GitHub token found, re-authenticating...')
        localStorage.setItem('redirectAfterAuth', '/newproject')
        await signInWithGitHub()
        return
      }

      // Get Supabase session for backend auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No valid session found. Please sign in again.')
      }

      // Call backend API to create the repository
      // Log the config being sent
      const repoPayload = {
        name: config.projectName,
        description: config.projectDescription || `Created with 5AM Founder - ${new Date().toLocaleDateString()}`,
        private: config.isPrivate,
        auto_init: config.initWithReadme,
        tech_stack: config.techStack,
        integrations: config.integrations
      }
      
      console.log('Creating repository with payload:', repoPayload)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/github/repositories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'X-GitHub-Token': githubToken
        },
        credentials: 'include',
        body: JSON.stringify(repoPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 422) {
          throw new Error('A repository with this name already exists. Please choose a different name.')
        } else if (response.status === 401) {
          // Token might be expired, re-authenticate
          console.log('GitHub token expired, re-authenticating...')
          localStorage.setItem('redirectAfterAuth', '/newproject')
          await signInWithGitHub()
          return
        } else if (response.status === 403) {
          throw new Error('Insufficient permissions. Please make sure you have granted repository creation permissions.')
        }
        throw new Error(errorData.detail || 'Failed to create repository')
      }

      const repoData = await response.json()
      console.log('Repository created successfully:', repoData)
      
      // Clear saved config
      localStorage.removeItem('projectConfig')
      
      // Show success message
      setError(null)
      
      // Open repository in new tab
      window.open(repoData.html_url, '_blank')
      
      // Redirect to dashboard with refresh flag after a short delay
      setTimeout(() => {
        router.push('/dashboard?refresh=true')
      }, 1000)
    } catch (error) {
      console.error('Error creating project:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setIsCreating(false)
    }
  }

  // Set tech stack defaults when reaching step 3
  useEffect(() => {
    if (currentStep === 3) {
      updateConfig({
        techStack: {
          frontend: 'nextjs15',
          styling: 'tailwind',
          typescript: true,
          docker: true,
          testing: 'jest'
        }
      })
    }
  }, [currentStep])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectDetailsStep config={config} updateConfig={updateConfig} />
      case 2:
        return <IntegrationsStep config={config} updateConfig={updateConfig} />
      case 3:
        return <ReviewStep config={config} user={user} onEdit={(step) => setCurrentStep(step)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-border {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          padding: 1px;
          border-radius: 0.75rem;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <span className="text-xl font-semibold">5AM Founder</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Building magic</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative px-6 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Create Your <span className="gradient-text">Project</span>
            </h1>
            <p className="text-base text-gray-400">
              Set up your perfect stack in minutes
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="mt-12 mb-8">
            {renderStep()}
          </div>

          {/* Auto-create overlay */}
          {shouldAutoCreate && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="glass-card rounded-xl p-8 max-w-md text-center">
                <div className="mb-4">
                  <svg className="animate-spin h-12 w-12 mx-auto text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome back!</h3>
                <p className="text-gray-400">Creating your project...</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateProject}
                disabled={isCreating}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>{user ? 'Create Project' : 'Sign in & Create'}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}