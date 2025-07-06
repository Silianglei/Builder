from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, Optional
import httpx
from pydantic import BaseModel

from ..models.user import User
from ..auth.auth import get_current_user
from ..config import get_settings
from ..db.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/v1/auth/github", tags=["auth-github"])
settings = get_settings()


class GitHubTokenExchange(BaseModel):
    code: str
    state: Optional[str] = None


class StoredTokenResponse(BaseModel):
    has_token: bool
    github_username: Optional[str] = None


@router.post("/exchange-code")
async def exchange_github_code(
    token_data: GitHubTokenExchange,
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Exchange GitHub OAuth code for access token.
    This is a backup method if Supabase doesn't provide the token.
    """
    # This would require implementing OAuth flow directly
    # For now, we'll return an error indicating the proper setup
    raise HTTPException(
        status_code=501,
        detail="Direct OAuth flow not implemented. Please enable 'Return provider tokens' in Supabase GitHub settings."
    )


@router.get("/check-token")
async def check_stored_token(
    current_user: User = Depends(get_current_user)
) -> StoredTokenResponse:
    """
    Check if we have a stored GitHub token for the user.
    In a real implementation, you'd check a secure token store.
    """
    # For now, we'll just check if the user authenticated with GitHub
    supabase = get_supabase_client()
    
    # Get user details
    user_response = supabase.auth.admin.get_user_by_id(current_user.id)
    if user_response and user_response.user:
        provider = user_response.user.app_metadata.get('provider')
        if provider == 'github':
            # In a real app, you'd check your token store here
            return StoredTokenResponse(
                has_token=False,
                github_username=user_response.user.user_metadata.get('user_name')
            )
    
    return StoredTokenResponse(has_token=False)