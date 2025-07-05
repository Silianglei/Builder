"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .tech-circle {
          background: radial-gradient(circle at 30% 30%, rgba(66, 133, 244, 0.1), transparent 70%);
          border: 1px solid rgba(66, 133, 244, 0.1);
          backdrop-filter: blur(10px);
        }
      `}</style>
      
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#4285F4] flex items-center justify-center">
              <span className="text-white font-bold text-lg">5</span>
            </div>
            <span className="text-xl font-semibold">5am Founder</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Wall of love</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/auth"
              className="px-4 py-2 bg-[#4285F4] hover:bg-[#4285F4]/90 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-sm text-gray-300">Trusted by 500+ founders</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Launch your startup<br />
                in minutes, not months
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                The complete SaaS boilerplate with auth, database, payments, and AI integration. 
                Stop building the same features. Start shipping your product.
              </p>
              
              {/* CTA Button */}
              <div className="mb-8">
                <Link 
                  href="/auth"
                  className="inline-flex items-center px-8 py-4 bg-[#4285F4] hover:bg-[#4285F4]/90 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#4285F4]/20"
                >
                  Start building
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#0a0a0a]" />
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">500+ founders shipping faster</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Tech Stack Circle */}
            <div className="relative lg:flex justify-center items-center hidden">
              <div className="relative w-[500px] h-[500px]">
                {/* Main circle */}
                <div className="absolute inset-0 tech-circle rounded-full animate-pulse-glow"></div>
                
                {/* Tech logos positioned around the circle */}
                <div className="absolute top-[10%] left-[50%] -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-black text-xs">N</div>
                    <span className="text-sm font-medium">Next.js</span>
                  </div>
                </div>
                
                <div className="absolute top-[30%] right-[5%] bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">Tw</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Tailwind</div>
                      <div className="text-xs text-gray-400">• components</div>
                      <div className="text-xs text-gray-400">• animations</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-[30%] right-[10%] bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Stripe</div>
                      <div className="text-xs text-gray-400">• subscriptions</div>
                      <div className="text-xs text-gray-400">• webhooks</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Supabase</div>
                      <div className="text-xs text-gray-400">• auth + database</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-[30%] left-[5%] bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🤖</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Claude AI</div>
                      <div className="text-xs text-gray-400">• rapid development</div>
                    </div>
                  </div>
                </div>
                
                {/* Center text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-sm text-gray-500 mb-2">+ all the boring stuff</p>
                  <p className="text-xs text-gray-600">(SEO, emails, analytics)</p>
                </div>
              </div>
              
              {/* Terminal snippet */}
              <div className="absolute bottom-0 right-0 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-800 font-mono text-sm">
                <span className="text-gray-500">$</span> <span className="text-green-400">git clone</span> <span className="text-yellow-400">5am-founder</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}