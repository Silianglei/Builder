from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Dict, Any
from ..auth.auth import require_auth, optional_auth
from ..db.supabase_client import get_supabase_client

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """
    Login endpoint. 
    Note: In this template, we rely on Supabase for authentication.
    This endpoint is for demonstration - actual auth should happen on the frontend.
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection unavailable"
            )
        
        # In a real implementation, you would handle login through Supabase
        # This is just a template endpoint
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if response.user and response.session:
            return TokenResponse(
                access_token=response.session.access_token,
                user={
                    "id": response.user.id,
                    "email": response.user.email,
                    "created_at": response.user.created_at
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

@router.post("/register")
async def register(user_data: RegisterRequest):
    """
    Registration endpoint.
    Note: In this template, registration should typically happen on the frontend.
    This endpoint is for demonstration purposes.
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database connection unavailable"
            )
        
        # In a real implementation, you would handle registration through Supabase
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })
        
        if response.user:
            return {
                "message": "Registration successful. Please check your email for confirmation.",
                "user_id": response.user.id
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration failed"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(require_auth)):
    """Logout endpoint."""
    try:
        supabase = get_supabase_client()
        if supabase:
            supabase.auth.sign_out()
        
        return {"message": "Logged out successfully"}
    except Exception as e:
        # Even if logout fails, we'll return success
        # as the client should clear the token anyway
        return {"message": "Logged out successfully"}

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(require_auth)):
    """Get current user information."""
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user.get("role", "authenticated")
    }

@router.get("/verify")
async def verify_token(current_user: dict = Depends(require_auth)):
    """Verify if the current token is valid."""
    return {
        "valid": True,
        "user_id": current_user["id"]
    }