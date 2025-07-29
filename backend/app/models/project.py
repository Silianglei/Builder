from pydantic import BaseModel, computed_field
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    github_repo_url: str
    github_repo_id: int
    is_private: bool = False
    has_supabase_db: bool = False
    auth_providers: List[str] = []
    has_stripe: bool = False
    vercel_deployed: bool = False
    vercel_deployment_url: Optional[str] = None
    github_topics: List[str] = []
    template_version: str = "1.0.0"
    is_active: bool = True


class ProjectCreate(ProjectBase):
    user_id: str


class ProjectUpdate(BaseModel):
    description: Optional[str] = None
    has_supabase_db: Optional[bool] = None
    auth_providers: Optional[List[str]] = None
    has_stripe: Optional[bool] = None
    vercel_deployed: Optional[bool] = None
    vercel_deployment_url: Optional[str] = None
    github_topics: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    last_github_sync: Optional[datetime] = None
    deployed_at: Optional[datetime] = None
    
    # Computed fields for frontend compatibility
    @computed_field
    @property
    def full_name(self) -> str:
        """Extract full name from GitHub URL for compatibility"""
        # URL format: https://github.com/username/repo-name
        parts = self.github_repo_url.rstrip('/').split('/')
        if len(parts) >= 2:
            return f"{parts[-2]}/{parts[-1]}"
        return self.name
    
    @computed_field
    @property
    def html_url(self) -> str:
        """Alias for github_repo_url for compatibility"""
        return self.github_repo_url
    
    @computed_field
    @property
    def clone_url(self) -> str:
        """Generate clone URL from github_repo_url"""
        return f"{self.github_repo_url}.git"
    
    @computed_field
    @property
    def ssh_url(self) -> str:
        """Generate SSH URL from github_repo_url"""
        # Convert https://github.com/user/repo to git@github.com:user/repo.git
        parts = self.github_repo_url.replace('https://github.com/', '').rstrip('/')
        return f"git@github.com:{parts}.git"
    
    @computed_field
    @property
    def private(self) -> bool:
        """Alias for is_private for compatibility"""
        return self.is_private
    
    @computed_field
    @property
    def topics(self) -> List[str]:
        """Alias for github_topics for compatibility"""
        return self.github_topics
    
    class Config:
        orm_mode = True


class ProjectListResponse(BaseModel):
    projects: List[ProjectResponse]
    total: int