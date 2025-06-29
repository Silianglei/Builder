"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { AuthForm } from "@/components/auth/auth-form"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Animation with useEffect
  useEffect(() => {
    // Animate the elements on load
    const animateElements = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, 150 * index);
      });
    };

    animateElements();
  }, []);

  const handleToggleSignUp = (signUpState: boolean) => {
    setIsSignUp(signUpState);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <style jsx global>{`
        .fade-in {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          animation: float 8s ease-in-out infinite;
          opacity: 0.08;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        
        @keyframes shine {
          from { left: -100%; }
          to { left: 100%; }
        }
        
        .group:hover .group-hover\\:animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
      
      <main className="flex flex-col lg:flex-row h-screen">
        {/* Left side - Product description (dark) */}
        <div className="w-full lg:w-[45%] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Background blobs for left side only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="blob bg-[#4285F4] w-[600px] h-[600px] -top-[200px] -left-[300px]"></div>
            <div className="blob bg-[#121d40] w-[500px] h-[500px] bottom-[5%] right-[5%]"></div>
          </div>
          
          {/* Subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
          
          <div className="max-w-md mx-auto relative z-10">
            <div className="inline-flex items-center mb-8 fade-in">
              <div className="w-8 h-8 rounded-lg bg-[#4285F4] flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-2xl font-medium">Template App</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 fade-in" style={{ transitionDelay: '150ms' }}>
              <span className="text-[#4285F4]">Build amazing products</span>
              <br />
              with this scalable template
            </h1>
            
            <p className="text-gray-400 mb-6 fade-in" style={{ transitionDelay: '300ms' }}>
              A production-ready template with authentication, security best practices, and modern tooling to kickstart your next project.
            </p>
            
            <div className="space-y-3 mb-4 fade-in" style={{ transitionDelay: '450ms' }}>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#4285F4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#4285F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Supabase authentication & database</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#4285F4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#4285F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Next.js 15 with TypeScript</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-[#4285F4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#4285F4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Production-ready architecture</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth form (white) */}
        <div className="w-full lg:w-[55%] p-6 md:p-8 lg:pl-4 flex flex-col justify-center bg-white text-gray-800">
          <div className="max-w-md mx-auto w-full px-0 fade-in" style={{ transitionDelay: '150ms' }}>
            <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">
              {loading ? "Loading..." : isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <AuthForm isLightMode={true} onToggleSignUp={handleToggleSignUp} />
          </div>
        </div>
      </main>
    </div>
  )
}