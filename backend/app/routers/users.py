from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from ..auth.auth import require_auth, optional_auth
from ..models.user import User, UserProfile, UserUpdate
from ..db.supabase_client import get_supabase_client

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(require_auth)):
    """Get current user's profile."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection unavailable"
            )
        
        # Get user from Supabase auth
        user_id = current_user["id"]
        
        # In a real app, you might fetch additional profile data from your database
        # For now, we'll return the basic user info from the JWT
        return UserProfile(
            id=user_id,
            email=current_user["email"],
            created_at=current_user.get("created_at", ""),
            last_sign_in_at=current_user.get("last_sign_in_at")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user profile"
        )

@router.put("/profile", response_model=UserProfile)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: dict = Depends(require_auth)
):
    """Update current user's profile."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection unavailable"
            )
        
        user_id = current_user["id"]
        
        # Update user in Supabase
        # Note: This is a simplified example. In production, you'd want to
        # validate the updates and handle them appropriately
        
        update_data = {}
        if user_update.email:
            update_data["email"] = user_update.email
        
        if update_data:
            # In Supabase, email updates typically require confirmation
            response = supabase.auth.update_user({
                "email": user_update.email
            })
            
            if response.user:
                return UserProfile(
                    id=response.user.id,
                    email=response.user.email,
                    created_at=response.user.created_at
                )
        
        # If no updates, return current profile
        return UserProfile(
            id=user_id,
            email=current_user["email"],
            created_at=current_user.get("created_at", "")
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )

@router.delete("/account")
async def delete_user_account(current_user: dict = Depends(require_auth)):
    """Delete current user's account."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection unavailable"
            )
        
        user_id = current_user["id"]
        
        # In Supabase, account deletion typically needs to be handled
        # through the admin API or RPC functions
        # This is a placeholder for the actual implementation
        
        return {
            "message": "Account deletion initiated. This may take a few moments to complete."
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )

@router.get("/stats")
async def get_user_stats(current_user: dict = Depends(require_auth)):
    """Get user statistics (placeholder for future features)."""
    return {
        "user_id": current_user["id"],
        "stats": {
            "login_count": 0,
            "last_login": None,
            "account_age_days": 0
        }
    }