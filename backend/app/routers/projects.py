from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from datetime import datetime

from ..auth.auth import get_current_user
from ..models.project import ProjectResponse, ProjectUpdate
from ..db.supabase_client import supabase_client

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    current_user: Dict = Depends(get_current_user)
) -> List[ProjectResponse]:
    """List all projects for the current user from the database"""
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Database service is unavailable"
        )
    
    try:
        # Fetch projects for the current user
        result = supabase_client.table("projects").select("*").eq(
            "user_id", current_user.get("id")
        ).eq(
            "is_active", True
        ).order(
            "created_at", desc=True
        ).execute()
        
        projects = []
        for project_data in result.data:
            # Convert database fields to response model
            # Handle potential None values and type conversions
            project = ProjectResponse(
                id=project_data["id"],
                user_id=project_data["user_id"],
                name=project_data["name"],
                description=project_data.get("description"),
                github_repo_url=project_data["github_repo_url"],
                github_repo_id=project_data["github_repo_id"],
                is_private=project_data.get("is_private", False),
                has_supabase_db=project_data.get("has_supabase_db", False),
                auth_providers=project_data.get("auth_providers", []),
                has_stripe=project_data.get("has_stripe", False),
                vercel_deployed=project_data.get("vercel_deployed", False),
                vercel_deployment_url=project_data.get("vercel_deployment_url"),
                github_topics=project_data.get("github_topics", []),
                template_version=project_data.get("template_version", "1.0.0"),
                is_active=project_data.get("is_active", True),
                created_at=datetime.fromisoformat(project_data["created_at"].replace('Z', '+00:00')),
                updated_at=datetime.fromisoformat(project_data["updated_at"].replace('Z', '+00:00')),
                last_github_sync=datetime.fromisoformat(project_data["last_github_sync"].replace('Z', '+00:00')) if project_data.get("last_github_sync") else None,
                deployed_at=datetime.fromisoformat(project_data["deployed_at"].replace('Z', '+00:00')) if project_data.get("deployed_at") else None
            )
            projects.append(project)
        
        return projects
        
    except Exception as e:
        print(f"Error fetching projects: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch projects: {str(e)}"
        )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: Dict = Depends(get_current_user)
) -> ProjectResponse:
    """Get a specific project by ID"""
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Database service is unavailable"
        )
    
    try:
        # Fetch the project and ensure it belongs to the current user
        result = supabase_client.table("projects").select("*").eq(
            "id", project_id
        ).eq(
            "user_id", current_user.get("id")
        ).single().execute()
        
        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )
        
        project_data = result.data
        
        return ProjectResponse(
            id=project_data["id"],
            user_id=project_data["user_id"],
            name=project_data["name"],
            description=project_data.get("description"),
            github_repo_url=project_data["github_repo_url"],
            github_repo_id=project_data["github_repo_id"],
            is_private=project_data.get("is_private", False),
            has_supabase_db=project_data.get("has_supabase_db", False),
            auth_providers=project_data.get("auth_providers", []),
            has_stripe=project_data.get("has_stripe", False),
            vercel_deployed=project_data.get("vercel_deployed", False),
            vercel_deployment_url=project_data.get("vercel_deployment_url"),
            github_topics=project_data.get("github_topics", []),
            template_version=project_data.get("template_version", "1.0.0"),
            is_active=project_data.get("is_active", True),
            created_at=datetime.fromisoformat(project_data["created_at"].replace('Z', '+00:00')),
            updated_at=datetime.fromisoformat(project_data["updated_at"].replace('Z', '+00:00')),
            last_github_sync=datetime.fromisoformat(project_data["last_github_sync"].replace('Z', '+00:00')) if project_data.get("last_github_sync") else None,
            deployed_at=datetime.fromisoformat(project_data["deployed_at"].replace('Z', '+00:00')) if project_data.get("deployed_at") else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching project: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch project: {str(e)}"
        )


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: Dict = Depends(get_current_user)
) -> ProjectResponse:
    """Update a project's configuration"""
    
    if not supabase_client:
        raise HTTPException(
            status_code=503,
            detail="Database service is unavailable"
        )
    
    try:
        # First check if the project exists and belongs to the user
        check_result = supabase_client.table("projects").select("id").eq(
            "id", project_id
        ).eq(
            "user_id", current_user.get("id")
        ).single().execute()
        
        if not check_result.data:
            raise HTTPException(
                status_code=404,
                detail="Project not found"
            )
        
        # Prepare update data (only include non-None values)
        update_data = {
            k: v for k, v in project_update.dict(exclude_unset=True).items() 
            if v is not None
        }
        
        if update_data:
            # Add updated_at timestamp
            update_data["updated_at"] = datetime.utcnow().isoformat()
            
            # Update the project
            result = supabase_client.table("projects").update(update_data).eq(
                "id", project_id
            ).eq(
                "user_id", current_user.get("id")
            ).execute()
        
        # Fetch and return the updated project
        return await get_project(project_id, current_user)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating project: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update project: {str(e)}"
        )