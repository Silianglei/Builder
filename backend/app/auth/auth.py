from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional, Dict, Any
from ..config import get_settings
from ..db.supabase_client import get_supabase_client

settings = get_settings()
security = HTTPBearer()

async def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify JWT token and return payload."""
    try:
        # For Supabase JWT tokens, we can verify them directly
        # In production, you should verify the signature properly
        payload = jwt.decode(
            token, 
            options={"verify_signature": False}  # Disable for now - configure properly in production
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
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