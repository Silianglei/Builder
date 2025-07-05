'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface AuthFormProps {
  isLightMode?: boolean;
  onToggleSignUp?: (isSignUp: boolean) => void;
  initialIsSignUp?: boolean;
}

export function AuthForm({ isLightMode = false, onToggleSignUp, initialIsSignUp = false }: AuthFormProps) {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  // Notify parent component when isSignUp changes
  useEffect(() => {
    if (onToggleSignUp) {
      onToggleSignUp(isSignUp);
    }
  }, [isSignUp, onToggleSignUp]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        setShowConfirmation(true);
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (showConfirmation) {
    return (
      <Card className={isLightMode 
        ? "bg-white shadow-md border border-gray-200" 
        : "bg-[#111827]/90 backdrop-blur-sm border border-[#1e293b]/30 shadow-xl"
      }>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#4285F4]/10 border border-[#4285F4]/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#4285F4]" />
              </div>
            </div>
            <h2 className={`text-xl font-medium mb-4 ${isLightMode ? 'text-gray-800' : 'text-white'}`}>
              Check your email
            </h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                We've sent a confirmation link to
              </p>
              <div className={isLightMode 
                ? "px-4 py-3 bg-gray-50 rounded-lg border border-gray-200" 
                : "px-4 py-3 bg-[#0a0d14]/80 rounded-lg border border-[#1e293b]/20"
              }>
                <p className={`font-medium ${isLightMode ? 'text-gray-800' : 'text-white'}`}>{email}</p>
              </div>
              <p className="text-gray-500 text-sm">
                Please check your email and click the link to complete your registration.
              </p>
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setShowConfirmation(false)} 
                    className="text-[#4285F4] hover:text-[#4285F4]/80 transition-colors"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isLightMode 
      ? "bg-white shadow-md border border-gray-200" 
      : "bg-[#111827]/90 backdrop-blur-sm border border-[#1e293b]/30 shadow-xl"
    }>
      <CardContent className="p-6">
        <div className="space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-500">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className={`text-sm block ${isLightMode ? 'text-gray-700' : 'text-gray-400'}`}>
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={isLightMode
                    ? "pl-10 bg-white border-gray-300 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-400"
                    : "pl-10 bg-[#0a0d14]/80 border-[#1e293b]/20 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-600"
                  }
                />
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className={`text-sm block ${isLightMode ? 'text-gray-700' : 'text-gray-400'}`}>
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={isLightMode
                    ? "pl-10 bg-white border-gray-300 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-400"
                    : "pl-10 bg-[#0a0d14]/80 border-[#1e293b]/20 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-600"
                  }
                />
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isLightMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-md bg-[#4285F4] h-10 text-white font-medium transition-all duration-300 hover:bg-[#4285F4]/90 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/50 flex items-center justify-center"
            >
              {/* Animated shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              
              <div className="flex items-center gap-2 relative z-10">
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          </form>
          
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#4285F4] hover:text-[#4285F4]/80 text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}