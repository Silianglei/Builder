from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging

from .config import get_settings
from .routers import auth, users
from .db.supabase_client import get_supabase_client

# Load environment variables
load_dotenv()
settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Template FastAPI backend with Supabase integration"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])

# Set up logging
logger = logging.getLogger("uvicorn")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": f"{settings.PROJECT_NAME} API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test Supabase connection
        supabase = get_supabase_client()
        if supabase:
            return {
                "status": "healthy",
                "database": "connected",
                "api": "operational"
            }
        else:
            return {
                "status": "degraded",
                "database": "disconnected",
                "api": "operational"
            }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "error",
            "api": "operational",
            "error": str(e)
        }