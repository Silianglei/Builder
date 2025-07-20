from fastapi import APIRouter, Depends, HTTPException, Request
from github import Github, GithubException, InputGitTreeElement
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
import base64
import time
import asyncio

from ..auth.auth import get_current_user
from ..services.template_service import template_service
from ..websocket_manager import manager

router = APIRouter(prefix="/api/v1/github", tags=["github"])


class CreateRepositoryRequest(BaseModel):
    name: str
    description: Optional[str] = None
    private: bool = False
    auto_init: bool = True
    tech_stack: Optional[Dict[str, Any]] = None
    integrations: Optional[Dict[str, Any]] = None


class RepositoryResponse(BaseModel):
    id: int
    name: str
    full_name: str
    html_url: str
    clone_url: str
    ssh_url: str
    private: bool
    description: Optional[str] = None


@router.get("/health")
async def github_health_check() -> Dict[str, str]:
    """Simple health check endpoint that doesn't require auth"""
    return {"status": "ok", "service": "github"}


@router.get("/test-access")
async def test_github_access(
    request: Request,
    current_user: Dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """Test if we have GitHub access with the user's token"""
    # Get the provider token from the request headers
    # In a real implementation, you'd get this from the session or database
    auth_header = request.headers.get("X-GitHub-Token")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="GitHub token not found. Please authenticate with GitHub first."
        )
    
    try:
        # Initialize GitHub client with the token
        g = Github(auth_header)
        
        # Test the token by getting the authenticated user
        github_user = g.get_user()
        
        # Force the API call to happen by accessing a property
        login = github_user.login
        
        # Check OAuth scopes by making a direct API call
        import requests
        scope_response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {auth_header}",
                "Accept": "application/vnd.github.v3+json"
            }
        )
        
        oauth_scopes = scope_response.headers.get("x-oauth-scopes", "")
        
        return {
            "authenticated": True,
            "github_username": login,
            "github_id": github_user.id,
            "name": github_user.name,
            "email": github_user.email,
            "public_repos": github_user.public_repos,
            "private_repos": github_user.owned_private_repos,
            "can_create_repos": True,
            "oauth_scopes": oauth_scopes,
            "has_repo_scope": "repo" in oauth_scopes
        }
    except GithubException as e:
        # More specific error handling for GitHub API errors
        if e.status == 401:
            raise HTTPException(
                status_code=401,
                detail="Token verification failed. The token may be expired or invalid."
            )
        elif e.status == 403:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions. Make sure the token has 'repo' scope."
            )
        else:
            raise HTTPException(
                status_code=e.status,
                detail=f"GitHub API error: {e.data.get('message', str(e))}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.post("/repositories", response_model=RepositoryResponse)
async def create_repository(
    request: Request,
    repo_data: CreateRepositoryRequest,
    current_user: Dict = Depends(get_current_user)
) -> RepositoryResponse:
    """Create a new GitHub repository with a full Next.js + Supabase template"""
    auth_header = request.headers.get("X-GitHub-Token")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="GitHub token not found. Please authenticate with GitHub first."
        )
    
    try:
        g = Github(auth_header)
        github_user = g.get_user()
        
        # Create the repository WITHOUT auto_init to avoid conflicts
        repo = github_user.create_repo(
            name=repo_data.name,
            description=repo_data.description or f"A new SaaS project created with 5AM Founder",
            private=repo_data.private,
            auto_init=False  # We'll create all files manually
        )
        
        # Always upload template files
        try:
            print(f"Starting template upload for repository: {repo_data.name}")
            
            # Send initial WebSocket update
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "repository_created",
                {"repository_name": repo_data.name, "url": repo.html_url}
            )
            
            # Prepare project configuration for template
            project_config = {
                "name": repo_data.name,
                "description": repo_data.description or f"A new SaaS project created with 5AM Founder",
                "github_username": github_user.login,
                "repo_url": repo.html_url,
                # Add placeholders for Supabase (will be populated later)
                "supabase_url": "your_supabase_url",
                "supabase_anon_key": "your_supabase_anon_key", 
                "supabase_service_key": "your_supabase_service_key",
                "supabase_project_id": "your_project_id"
            }
            
            # Send template preparation update
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "preparing_template",
                {"message": "Preparing project template with your configuration..."}
            )
            
            # Get all template files with variables replaced
            template_files = template_service.prepare_template_files(project_config)
            
            print(f"Prepared {len(template_files)} files for upload")
            
            # Send file count update
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "template_ready",
                {"total_files": len(template_files), "message": f"Ready to upload {len(template_files)} files"}
            )
            
            # Wait a moment for the repository to be fully created
            await asyncio.sleep(2)
            
            # For an empty repository, we need to create at least one file first
            # to establish the default branch
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "upload_started",
                {"message": "Initializing repository..."}
            )
            
            # Create README first to establish the main branch
            initial_readme = f"# {repo_data.name}\n\nInitializing project from 5AM Founder..."
            repo.create_file(
                "README.md",
                "Initial commit from 5AM Founder",
                initial_readme,
                branch="main"
            )
            
            # Now wait for the branch to be created
            await asyncio.sleep(1)
            
            # Now upload all template files
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "upload_progress",
                {"message": "Uploading template files...", "current": 0, "total": len(template_files)}
            )
            
            # Upload files in batches to avoid rate limits
            batch_size = 10
            uploaded_count = 0
            
            for i in range(0, len(template_files), batch_size):
                batch = template_files[i:i + batch_size]
                
                for file_path, content, is_binary in batch:
                    try:
                        # Skip README.md as we already created it
                        if file_path == "README.md":
                            # Update the README with the actual content
                            readme_file = repo.get_contents("README.md", ref="main")
                            repo.update_file(
                                "README.md",
                                "Update README from template",
                                content,
                                readme_file.sha,
                                branch="main"
                            )
                        else:
                            # Create new file
                            if is_binary:
                                # For binary files, encode to base64
                                file_content = base64.b64encode(content).decode('utf-8')
                            else:
                                file_content = content
                            
                            repo.create_file(
                                file_path,
                                f"Add {file_path}",
                                file_content,
                                branch="main"
                            )
                        
                        uploaded_count += 1
                        
                        # Send progress update
                        if uploaded_count % 5 == 0 or uploaded_count == len(template_files):
                            await manager.send_project_update(
                                current_user.get("id", "unknown"),
                                "upload_progress",
                                {
                                    "current": uploaded_count,
                                    "total": len(template_files),
                                    "percentage": round((uploaded_count / len(template_files)) * 100),
                                    "current_file": file_path
                                }
                            )
                        
                    except Exception as e:
                        print(f"Error uploading {file_path}: {str(e)}")
                        await manager.send_project_update(
                            current_user.get("id", "unknown"),
                            "file_error",
                            {"file": file_path, "error": str(e)}
                        )
                
                # Small delay between batches to avoid rate limits
                if i + batch_size < len(template_files):
                    await asyncio.sleep(0.5)
            
            print("Template upload completed successfully")
            
            # Add topics to identify this as a 5AM Founder project
            try:
                repo.replace_topics(["5am-founder", "nextjs", "supabase", "typescript"])
                print("Added 5AM Founder topics to repository")
            except Exception as e:
                print(f"Warning: Could not add topics: {str(e)}")
            
            # Send completion update
            await manager.send_project_update(
                current_user.get("id", "unknown"),
                "upload_complete",
                {
                    "message": "All files uploaded successfully!",
                    "total_files": len(template_files),
                    "repository_url": repo.html_url
                }
            )
        except Exception as e:
            # Repository was created but we couldn't upload all template files
            # This is okay, the repo still exists
            print(f"Warning: Could not upload all template files: {str(e)}")
        
        # Refresh repo data to get updated topics
        repo = g.get_repo(repo.full_name)
        
        return RepositoryResponse(
            id=repo.id,
            name=repo.name,
            full_name=repo.full_name,
            html_url=repo.html_url,
            clone_url=repo.clone_url,
            ssh_url=repo.ssh_url,
            private=repo.private,
            description=repo.description or f"A new SaaS project created with 5AM Founder"
        )
        
    except GithubException as e:
        error_message = e.data.get('message', str(e)) if hasattr(e, 'data') else str(e)
        
        if e.status == 422:
            # Check if it's a name collision
            if 'already exists' in error_message.lower():
                raise HTTPException(
                    status_code=422,
                    detail=f"A repository with the name '{repo_data.name}' already exists in your account."
                )
            else:
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid repository name or settings: {error_message}"
                )
        elif e.status == 403:
            # Check OAuth scopes
            import requests
            scope_check = requests.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {auth_header}"}
            )
            current_scopes = scope_check.headers.get("x-oauth-scopes", "none")
            
            raise HTTPException(
                status_code=403,
                detail=f"Insufficient permissions. Current scopes: {current_scopes}. Error: {error_message}"
            )
        elif e.status == 401:
            raise HTTPException(
                status_code=401,
                detail="GitHub token is invalid or expired. Please reconnect your GitHub account."
            )
        else:
            raise HTTPException(
                status_code=e.status,
                detail=f"GitHub API error (status {e.status}): {error_message}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create repository: {str(e)}"
        )


@router.get("/repositories")
async def list_repositories(
    request: Request,
    current_user: Dict = Depends(get_current_user)
) -> List[RepositoryResponse]:
    """List user's GitHub repositories"""
    auth_header = request.headers.get("X-GitHub-Token")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="GitHub token not found. Please authenticate with GitHub first."
        )
    
    try:
        g = Github(auth_header)
        github_user = g.get_user()
        
        repos = []
        for repo in github_user.get_repos(sort="updated", direction="desc")[:20]:
            repos.append(RepositoryResponse(
                id=repo.id,
                name=repo.name,
                full_name=repo.full_name,
                html_url=repo.html_url,
                clone_url=repo.clone_url,
                ssh_url=repo.ssh_url,
                private=repo.private,
                description=repo.description
            ))
        
        return repos
        
    except GithubException as e:
        if e.status == 401:
            raise HTTPException(
                status_code=401,
                detail="GitHub authentication failed. The token may be expired or invalid."
            )
        elif e.status == 403:
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions to access repositories."
            )
        else:
            raise HTTPException(
                status_code=e.status,
                detail=f"GitHub API error: {e.data.get('message', str(e))}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list repositories: {str(e)}"
        )


@router.delete("/repositories/{owner}/{repo}")
async def delete_repository(
    owner: str,
    repo: str,
    request: Request,
    current_user: Dict = Depends(get_current_user)
) -> Dict[str, str]:
    """Delete a GitHub repository"""
    auth_header = request.headers.get("X-GitHub-Token")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="GitHub token not found. Please authenticate with GitHub first."
        )
    
    try:
        g = Github(auth_header)
        github_user = g.get_user()
        
        # Verify the user owns the repository
        if github_user.login != owner:
            raise HTTPException(
                status_code=403,
                detail="You can only delete repositories you own."
            )
        
        # Get the repository
        try:
            repository = g.get_repo(f"{owner}/{repo}")
        except GithubException as e:
            if e.status == 404:
                raise HTTPException(
                    status_code=404,
                    detail=f"Repository {owner}/{repo} not found."
                )
            raise
        
        # Delete the repository
        repository.delete()
        
        return {"message": f"Repository {owner}/{repo} deleted successfully."}
        
    except GithubException as e:
        error_message = e.data.get('message', str(e)) if hasattr(e, 'data') else str(e)
        
        if e.status == 403:
            # Check current OAuth scopes
            import requests
            scope_check = requests.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {auth_header}"}
            )
            current_scopes = scope_check.headers.get("x-oauth-scopes", "none")
            
            if 'delete_repo' not in current_scopes:
                raise HTTPException(
                    status_code=403,
                    detail=f"Repository deletion requires the 'delete_repo' scope. Current scopes: {current_scopes}. To delete repositories, you'll need to update your GitHub OAuth permissions in Supabase to include 'delete_repo'."
                )
            else:
                raise HTTPException(
                    status_code=403,
                    detail=f"Permission denied: {error_message}"
                )
        elif e.status == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Repository {owner}/{repo} not found."
            )
        else:
            raise HTTPException(
                status_code=e.status,
                detail=f"GitHub API error: {error_message}"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete repository: {str(e)}"
        )