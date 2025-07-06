"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

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
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          <div className="flex items-center space-x-3">
            <span className="text-xl font-semibold">5AM Founder</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/newproject" 
              className="flex items-center space-x-2 px-5 py-2.5 glass-card rounded-lg font-medium transition-all hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 glass-card rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Live in 60 seconds</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight px-4">
              Ship Your SaaS<br />
              <span className="gradient-text">in 5 Minutes</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Connect GitHub. Choose integrations. Get your custom codebase instantly. 
              No more boilerplate hell.
            </p>
            
            {/* CTA Button */}
            <div className="mb-16">
              <Link 
                href="/newproject"
                className="inline-flex items-center space-x-3 px-8 py-4 gradient-border group"
              >
                <div className="flex items-center space-x-3 px-6 py-3 bg-[#0a0a0a] rounded-[0.65rem] transition-all group-hover:bg-[#0a0a0a]/50">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
                  </svg>
                  <span className="font-semibold text-lg">Create New Project</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img 
                    key={i} 
                    src={`/avatars/avatar${i}.svg`} 
                    alt={`Developer ${i}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0a0a0a] hover:scale-110 transition-transform"
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex text-yellow-400 mb-1 justify-center sm:justify-start">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Join 500+ developers shipping faster</p>
              </div>
            </div>
          </div>

          {/* 3-Step Workflow */}
          <div className="relative mb-32">
            <div className="text-center mb-16">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">How It Works</p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Three Simple Steps
                <span className="block text-2xl sm:text-3xl text-gray-400 font-normal mt-2">From zero to deployed in minutes</span>
              </h2>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
              {/* Connection Line */}
              <div className="hidden sm:block absolute top-[88px] left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 px-4 sm:px-0 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Connect GitHub",
                    description: "Authenticate with your GitHub account to create repositories",
                    icon: (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )
                  },
                  {
                    step: "02",
                    title: "Choose Stack",
                    description: "Pick your tech stack: Auth, Payments, Database, and more",
                    icon: (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.958 15.077l-1.41.513m14.095-7.026l-1.41.513M8.5 12v.75m0-5.25v.75m7 4v.75m0-5.25v.75" />
                      </svg>
                    )
                  },
                  {
                    step: "03",
                    title: "Start Building",
                    description: "Get your customized repo and start shipping immediately",
                    icon: (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                    )
                  }
                ].map((item, index) => (
                  <div key={item.step} className="relative group text-center">
                    <div className="transition-all duration-300">
                      {/* Step Number */}
                      <div className="text-6xl font-bold mb-6 text-white/20">
                        {item.step}
                      </div>
                      
                      {/* Icon Container */}
                      <div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center mx-auto bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-blue-500/25">
                        <div className="text-white">
                          {item.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-semibold mb-3 text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400 max-w-xs mx-auto">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration Grid */}
          <div className="mb-32 px-4 sm:px-0">
            <div className="text-center mb-16">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Powered by Industry Leaders</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need
                <span className="block text-2xl sm:text-3xl text-gray-400 font-normal mt-2">Pre-configured and Ready</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                { 
                  name: "Supabase", 
                  desc: "Auth + Database",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M13.976 22.013c-.34.355-.933.106-.933-.392V13.38l8.212-9.24c.653-.735 1.88-.147 1.74.833l-1.842 12.94c-.067.468-.416.85-.885.895l-8.292 1.205Z" fill="#3FCF8E"/>
                      <path d="M10.024 1.987c.34-.355.933-.106.933.392v8.24L2.745 19.86c-.653.735-1.88.147-1.74-.833L2.847 6.087c.067-.468.416-.85.885-.895l8.292-1.205Z" fill="#3FCF8E" opacity=".7"/>
                    </svg>
                  )
                },
                { 
                  name: "Stripe", 
                  desc: "Payments",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#635BFF"/>
                    </svg>
                  )
                },
                { 
                  name: "Next.js 15", 
                  desc: "React Framework",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.17 0-.33.06-.46.14-.86.3-1.75.46-2.66.46-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 .91-.15 1.8-.46 2.66-.08.13-.14.29-.14.46 0 .43.35.78.78.78.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10zm0 0"/>
                      <path d="M15 9v6l-4.5-6H9v6h1.5v-3.5l3 4V15H15V9z"/>
                    </svg>
                  )
                },
                { 
                  name: "Tailwind CSS", 
                  desc: "Styling",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.51 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35-.98-1-2.09-2.15-4.59-2.15z" fill="#06B6D4"/>
                    </svg>
                  )
                },
                { 
                  name: "TypeScript", 
                  desc: "Type Safety",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" fill="#3178C6"/>
                      <path d="M13.5 11V17H12V11H10V9.5H15.5V11H13.5Z" fill="white"/>
                      <path d="M19 14.5C19 15.3284 18.3284 16 17.5 16C16.6716 16 16 15.3284 16 14.5V11H17.5V14.5H19Z" fill="white"/>
                    </svg>
                  )
                },
                { 
                  name: "Docker", 
                  desc: "Deployment",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M4.82 10.5h2.61v2.34H4.82V10.5zm2.97 0h2.61v2.34H7.79V10.5zm2.97 0h2.61v2.34h-2.61V10.5zm2.97 0h2.61v2.34h-2.61V10.5zM7.79 7.53h2.61v2.34H7.79V7.53zm2.97 0h2.61v2.34h-2.61V7.53zm2.97 0h2.61v2.34h-2.61V7.53zm0-2.97h2.61v2.34h-2.61V4.56z" fill="#2496ED"/>
                      <path d="M22.43 9.69c-.52-.38-1.73-.53-2.66-.33-.14-.97-.71-1.81-1.74-2.51l-.59-.4-.4.59c-.5.75-.65 1.98-.1 2.79-.36.2-.81.37-1.19.52-1.54.3-3.19.23-4.71-.21H.57l-.05.29c-.17 1.01-.17 4.17 1.84 6.6 1.54 1.86 3.84 2.8 6.84 2.8 6.5 0 11.31-2.99 13.59-8.42.89.02 2.8.01 3.78-1.87.06-.1.2-.36.61-1.16l.11-.21-.58-.43z" fill="#2496ED"/>
                    </svg>
                  )
                },
                { 
                  name: "GitHub Actions", 
                  desc: "CI/CD",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                    </svg>
                  )
                },
                { 
                  name: "Vercel", 
                  desc: "Hosting",
                  icon: (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 19.5h20L12 2z"/>
                    </svg>
                  )
                }
              ].map((tech) => (
                <div key={tech.name} className="group relative">
                  <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/5">
                    <div className="flex items-center justify-center mb-4 text-white opacity-80 group-hover:opacity-100 transition-opacity">
                      {tech.icon}
                    </div>
                    <h3 className="font-semibold mb-1 text-base sm:text-lg">{tech.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Preview */}
          <div className="relative mb-32">
            <div className="text-center mb-16">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Ready to Code</p>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Up and Running
                <span className="block text-2xl sm:text-3xl text-gray-400 font-normal mt-2">In less than 60 seconds</span>
              </h2>
            </div>
            
            <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
              
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-sm text-gray-500 font-mono">builder@terminal</div>
                  </div>
                </div>
                
                {/* Terminal Content */}
                <div className="p-6 sm:p-8">
                  <div className="font-mono text-sm sm:text-base space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">$</span>
                      <span className="text-green-400">git clone</span>
                      <span className="text-blue-400 ml-2">https://github.com/yourusername/your-saas.git</span>
                    </div>
                    
                    <div className="text-gray-500 text-xs sm:text-sm pl-4">
                      Cloning into 'your-saas'...<br/>
                      Receiving objects: 100% (127/127), done.
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">$</span>
                      <span className="text-green-400">cd</span>
                      <span className="text-blue-400 ml-2">your-saas</span>
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">$</span>
                      <span className="text-green-400">npm install</span>
                    </div>
                    
                    <div className="text-gray-500 text-xs sm:text-sm pl-4">
                      Installing dependencies...<br/>
                      Added 342 packages in 8.2s
                    </div>
                    
                    <div className="flex items-start">
                      <span className="text-gray-500 mr-2">$</span>
                      <span className="text-green-400">npm run dev</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-green-400 font-semibold">Ready</span>
                        <span className="text-gray-400">- Local server started on</span>
                        <span className="text-blue-400 underline">http://localhost:3000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="relative py-32">
            <div className="text-center max-w-3xl mx-auto px-4">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Stop Building.<br/>
                <span className="gradient-text">Start Shipping.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12">
                Join hundreds of developers who are building their SaaS faster with our automated boilerplate generator.
              </p>
              
              <Link 
                href="/newproject"
                className="inline-flex items-center space-x-3 px-8 py-4 gradient-border group"
              >
                <div className="flex items-center space-x-3 px-6 py-3 bg-[#0a0a0a] rounded-[0.65rem] transition-all group-hover:bg-[#0a0a0a]/50">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
                  </svg>
                  <span className="font-semibold text-lg">Get Started Now</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              
              <p className="mt-8 text-sm text-gray-600">
                No credit card required. Start building in minutes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}