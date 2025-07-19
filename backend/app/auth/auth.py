from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional, Dict, Any
import httpx
import json
from functools import lru_cache
from ..config import get_settings
from ..db.supabase_client import get_supabase_client

settings = get_settings()
security = HTTPBearer()

def get_supabase_jwt_secret() -> str:
    """Get the JWT secret from Supabase for token verification."""
    # For production, use the JWT secret from your Supabase dashboard
    # You can find it in Settings > API > JWT Settings
    # Store it as an environment variable
    jwt_secret = settings.JWT_SECRET_KEY
    if not jwt_secret or jwt_secret == "your-jwt-secret-key":
        # In development, we can fetch the public key from Supabase
        # In production, always use the configured secret
        raise ValueError(
            "JWT_SECRET_KEY not configured. "
            "Get it from Supabase Dashboard > Settings > API > JWT Secret"
        )
    return jwt_secret

async def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload."""
    try:
        # Get the JWT secret for verification
        jwt_secret = get_supabase_jwt_secret()
        
        # Verify the token with the secret
        payload = jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={
                "verify_signature": True,
                "verify_aud": True,
                "verify_exp": True
            }
        )
        
        # Additional validation for Supabase tokens
        if not payload.get("sub"):
            raise jwt.InvalidTokenError("Missing subject in token")
            
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        # Log the actual error for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Token verification error: {type(e).__name__}: {str(e)}")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token."""
    token = credentials.credentials
    payload = await verify_jwt_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "id": user_id,
        "email": payload.get("email"),
        "aud": payload.get("aud"),
        "role": payload.get("role", "authenticated")
    }

async def require_auth(current_user: dict = Depends(get_current_user)):
    """Dependency to require authentication."""
    return current_user

# Optional authentication (user can be None)
async def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    """Optional authentication dependency."""
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        payload = await verify_jwt_token(token)
        user_id = payload.get("sub")
        
        if user_id:
            return {
                "id": user_id,
                "email": payload.get("email"),
                "aud": payload.get("aud"),
                "role": payload.get("role", "authenticated")
            }
    except HTTPException:
        # If token is invalid, just return None for optional auth
        pass
    
    return None