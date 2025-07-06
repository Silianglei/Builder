from fastapi import APIRouter, Depends, HTTPException, Request
from github import Github, GithubException
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

from ..models.user import User
from ..auth.auth import get_current_user

router = APIRouter(prefix="/api/v1/github", tags=["github"])


class CreateRepositoryRequest(BaseModel):
    name: str
    description: Optional[str] = None
    private: bool = False
    auto_init: bool = True


class RepositoryResponse(BaseModel):
    id: int
    name: str
    full_name: str
    html_url: str
    clone_url: str
    ssh_url: str
    private: bool
    description: Optional[str] = None


@router.get("/test-access")
async def test_github_access(
    request: Request,
    current_user: User = Depends(get_current_user)
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
        
        return {
            "authenticated": True,
            "github_username": login,
            "github_id": github_user.id,
            "name": github_user.name,
            "email": github_user.email,
            "public_repos": github_user.public_repos,
            "private_repos": github_user.owned_private_repos,
            "can_create_repos": True
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
    current_user: User = Depends(get_current_user)
) -> RepositoryResponse:
    """Create a new GitHub repository with a simple boilerplate"""
    auth_header = request.headers.get("X-GitHub-Token")
    if not auth_header:
        raise HTTPException(
            status_code=401,
            detail="GitHub token not found. Please authenticate with GitHub first."
        )
    
    try:
        g = Github(auth_header)
        github_user = g.get_user()
        
        # Create the repository
        repo = github_user.create_repo(
            name=repo_data.name,
            description=repo_data.description,
            private=repo_data.private,
            auto_init=repo_data.auto_init
        )
        
        # Add a simple README as a boilerplate
        if repo_data.auto_init:
            try:
                readme_content = f"""# {repo_data.name}

{repo_data.description or 'A new project created with 5AM Founder'}

## Getting Started

This project was bootstrapped with [5AM Founder](https://5amfounder.com).

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Features

- ⚡️ Next.js 15 with App Router
- 🎨 Tailwind CSS for styling
- 🔐 Supabase for authentication
- 🚀 Ready for production

## License

MIT
"""
                repo.create_file(
                    "README.md",
                    "Initial commit from 5AM Founder",
                    readme_content,
                    branch="main"
                )
            except Exception as e:
                # Repository was created but we couldn't add the README
                # This is okay, the repo still exists
                print(f"Warning: Could not create README: {str(e)}")
        
        return RepositoryResponse(
            id=repo.id,
            name=repo.name,
            full_name=repo.full_name,
            html_url=repo.html_url,
            clone_url=repo.clone_url,
            ssh_url=repo.ssh_url,
            private=repo.private,
            description=repo.description
        )
        
    except GithubException as e:
        if e.status == 422:
            raise HTTPException(
                status_code=422,
                detail=f"Repository name already exists or is invalid: {e.data.get('message', str(e))}"
            )
        raise HTTPException(
            status_code=e.status,
            detail=f"GitHub API error: {e.data.get('message', str(e))}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create repository: {str(e)}"
        )


@router.get("/repositories")
async def list_repositories(
    request: Request,
    current_user: User = Depends(get_current_user)
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
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list repositories: {str(e)}"
        )