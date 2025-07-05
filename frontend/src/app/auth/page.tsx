"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithGitHub, signInWithGoogle, loading } = useAuth()
  const [error, setError] = useState("")

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleGitHubSignIn = async () => {
    setError("")
    try {
      const result = await signInWithGitHub()
      if (result.error) {
        // Handle specific GitHub OAuth errors
        if (result.error.includes('popup')) {
          setError("Please allow popups and try again, or check if you have popup blockers enabled.")
        } else if (result.error.includes('network')) {
          setError("Network error. Please check your connection and try again.")
        } else {
          setError(result.error)
        }
      }
      // GitHub OAuth will redirect automatically on success
    } catch (error) {
      console.error("GitHub sign in error:", error)
      setError("Failed to sign in with GitHub. Please try again.")
    }
  }

  const handleGoogleSignIn = async () => {
    setError("")
    try {
      const result = await signInWithGoogle()
      if (result.error) {
        // Handle specific Google OAuth errors
        if (result.error.includes('popup')) {
          setError("Please allow popups and try again, or check if you have popup blockers enabled.")
        } else if (result.error.includes('network')) {
          setError("Network error. Please check your connection and try again.")
        } else if (result.error.includes('invalid_request')) {
          setError("OAuth configuration error. Please contact support.")
        } else {
          setError(result.error)
        }
      }
      // Google OAuth will redirect automatically on success
    } catch (error) {
      console.error("Google sign in error:", error)
      setError("Failed to sign in with Google. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#4285F4] flex items-center justify-center">
              <span className="text-white font-bold text-lg">5</span>
            </div>
            <span className="text-xl font-semibold">5am Founder</span>
          </Link>
        </div>
      </nav>

      {/* Auth Options */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to 5am Founder</h1>
            <p className="text-gray-400">Sign in to start building your startup</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-8">
              <div className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* OAuth Options */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                        />
                        <path
                          fill="#34A853"
                          d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                        />
                      </svg>
                    )}
                    <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
                  </button>

                  <button
                    onClick={handleGitHubSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Github className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Redirecting to GitHub...' : 'Continue with GitHub'}</span>
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-6">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-[#4285F4] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#4285F4] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Build your startup before sunrise ⚡
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}