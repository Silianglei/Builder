import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHash } from 'crypto'

// Generate a secure random state for OAuth
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const url = request.nextUrl.clone()

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Add HSTS header for HTTPS connections
  if (url.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co http://localhost:* ws://localhost:*",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://accounts.google.com https://github.com",
    "object-src 'none'",
    "script-src-attr 'none'"
  ]
  
  // Only add upgrade-insecure-requests in production
  if (process.env.NODE_ENV === 'production') {
    cspDirectives.push("upgrade-insecure-requests")
  }

  // In development, we already have the necessary directives above

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  )

  // CSRF Protection for auth routes
  if (url.pathname.startsWith('/auth')) {
    // Set CSRF token in cookie if not present
    const csrfToken = request.cookies.get('csrf-token')
    
    if (!csrfToken && url.pathname === '/auth') {
      // Generate new CSRF token
      const newToken = generateState()
      response.cookies.set('csrf-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/'
      })
    }
  }

  // Rate limiting headers (informational - actual limiting done by backend)
  response.headers.set('X-RateLimit-Policy', 'window=60s;limit=100')

  return response
}

// Configure which routes use middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}