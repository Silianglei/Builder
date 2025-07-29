from supabase import create_client, Client
from typing import Optional
from ..config import get_settings

settings = get_settings()

def get_supabase_client() -> Optional[Client]:
    """Get Supabase client instance with service role for backend operations."""
    if not settings.SUPABASE_URL:
        print("Warning: Supabase URL is missing.")
        return None
    
    # Use service role key if available for backend operations
    # This bypasses RLS policies
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
    
    if not key:
        print("Warning: Supabase key is missing.")
        return None
        
    try:
        supabase = create_client(settings.SUPABASE_URL, key)
        return supabase
    except Exception as e:
        print(f"Error creating Supabase client: {str(e)}")
        return None

# Create a global instance for reuse
supabase_client = get_supabase_client()