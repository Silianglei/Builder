from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from dotenv import load_dotenv
import logging
import uuid

from .config import get_settings
from .routers import auth, users, github, projects
from .db.supabase_client import get_supabase_client
from .middleware import SecurityHeadersMiddleware, RateLimitMiddleware
from .websocket_manager import manager

# Load environment variables
load_dotenv()
settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Template FastAPI backend with Supabase integration",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,  # Disable docs in production
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# Add security middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, calls=100, period=60)

# Add trusted host middleware (prevents host header attacks)
if settings.ENVIRONMENT == "production":
    # Add your production domains here
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.yourdomain.com", "yourdomain.com"]
    )

# Configure CORS with tighter settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),  # Specific origins only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Specific methods
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With", "X-GitHub-Token"],  # Specific headers
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(github.router, tags=["github"])
app.include_router(projects.router, tags=["projects"])

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


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time updates"""
    connection_id = str(uuid.uuid4())
    await manager.connect(websocket, connection_id, user_id)
    
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
            # Echo back to confirm connection
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(connection_id, user_id)
        logger.info(f"WebSocket disconnected for user {user_id}")