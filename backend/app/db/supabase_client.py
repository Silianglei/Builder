from supabase import create_client, Client
from typing import Optional
from ..config import get_settings

settings = get_settings()

def get_supabase_client() -> Optional[Client]:
    """Get Supabase client instance."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        print("Warning: Supabase configuration is missing.")
        return None
        
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
        return supabase
    except Exception as e:
        print(f"Error creating Supabase client: {str(e)}")
        return None

# Create a global instance for reuse
supabase_client = get_supabase_client()