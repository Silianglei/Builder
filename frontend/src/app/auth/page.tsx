"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Github } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

function AuthContent() {
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign in to Your Account</h1>
          <p className="text-muted-foreground mt-2">
            Choose your preferred sign-in method
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Card>
          <CardContent className="pt-6 space-y-4">
            <button
              onClick={handleGitHubSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#24292e] hover:bg-[#1a1e22] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  More options coming soon
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <AuthContent />
    </Suspense>
  )
}