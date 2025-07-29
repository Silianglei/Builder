from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from typing import List
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Project Information
    PROJECT_NAME: str = "Template API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # Optional - for backend operations
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-jwt-secret-key"  # MUST be updated from Supabase Dashboard
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Configuration - Simple string that we'll parse
    CORS_ORIGINS: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(',')]

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()