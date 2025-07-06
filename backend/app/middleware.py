from fastapi import Request, Response
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
import time
import asyncio
from collections import defaultdict
from datetime import datetime, timedelta

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Security headers for production
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Content Security Policy
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]
        response.headers["Content-Security-Policy"] = "; ".join(csp_directives)
        
        # HSTS (only in production)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Permissions Policy
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware to prevent abuse."""
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = timedelta(seconds=period)
        self.clients = defaultdict(list)
        self.cleanup_interval = 300  # Clean up old entries every 5 minutes
        self.last_cleanup = time.time()
        
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Get client identifier (IP address)
        client_id = request.client.host if request.client else "unknown"
        
        # Special rate limits for auth endpoints
        if request.url.path.startswith("/api/v1/auth"):
            # Stricter limits for auth endpoints
            calls_limit = 20  # 20 attempts per minute
            period = timedelta(seconds=60)
        else:
            calls_limit = self.calls
            period = self.period
        
        now = datetime.now()
        
        # Clean up old entries periodically
        if time.time() - self.last_cleanup > self.cleanup_interval:
            self._cleanup_old_entries()
            self.last_cleanup = time.time()
        
        # Get the client's request history
        requests = self.clients[client_id]
        
        # Remove old requests outside the time window
        requests[:] = [req_time for req_time in requests if req_time > now - period]
        
        # Check if rate limit exceeded
        if len(requests) >= calls_limit:
            response = Response(
                content="Rate limit exceeded. Please try again later.",
                status_code=429,
                headers={
                    "Retry-After": str(period.seconds),
                    "X-RateLimit-Limit": str(calls_limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((now + period).timestamp()))
                }
            )
            return response
        
        # Record this request
        requests.append(now)
        
        # Process the request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(calls_limit)
        response.headers["X-RateLimit-Remaining"] = str(calls_limit - len(requests))
        response.headers["X-RateLimit-Reset"] = str(int((now + period).timestamp()))
        
        return response
    
    def _cleanup_old_entries(self):
        """Remove old entries to prevent memory bloat."""
        now = datetime.now()
        for client_id in list(self.clients.keys()):
            # Remove entries older than 1 hour
            self.clients[client_id] = [
                req_time for req_time in self.clients[client_id]
                if req_time > now - timedelta(hours=1)
            ]
            # Remove client if no recent requests
            if not self.clients[client_id]:
                del self.clients[client_id]