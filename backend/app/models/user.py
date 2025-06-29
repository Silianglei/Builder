from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr

class UserCreate(UserBase):
    """User creation model."""
    password: str

class UserUpdate(BaseModel):
    """User update model."""
    email: Optional[EmailStr] = None

class UserInDB(UserBase):
    """User model as stored in database."""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    email_confirmed_at: Optional[datetime] = None
    last_sign_in_at: Optional[datetime] = None

class User(UserInDB):
    """User model for API responses."""
    pass

class UserProfile(BaseModel):
    """Extended user profile information."""
    id: str
    email: EmailStr
    created_at: datetime
    last_sign_in_at: Optional[datetime] = None