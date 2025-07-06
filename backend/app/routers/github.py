from fastapi import APIRouter, Depends, HTTPException, Request
from github import Github, GithubException
from typing import Dict, List, Optional, Any
from pydantic import BaseModel

from ..auth.auth import get_current_user

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
        
        # Add a comprehensive README as a boilerplate
        if repo_data.auto_init:
            try:
                # Extract tech stack and integrations info
                tech_stack = repo_data.tech_stack or {}
                integrations = repo_data.integrations or {}
                
                # Build features list based on selections
                features = []
                
                # Tech stack features
                if tech_stack.get('frontend') == 'nextjs15':
                    features.append("⚡️ Next.js 15 with App Router")
                if tech_stack.get('typescript', True):
                    features.append("🔷 TypeScript for type safety")
                if tech_stack.get('styling') == 'tailwind':
                    features.append("🎨 Tailwind CSS for styling")
                if tech_stack.get('docker'):
                    features.append("🐳 Docker support for containerization")
                
                # Integration features
                if integrations.get('supabaseAuth'):
                    features.append("🔐 Supabase Authentication")
                    auth_providers = integrations.get('supabaseAuthProviders', [])
                    if auth_providers:
                        features.append(f"   - OAuth providers: {', '.join(auth_providers)}")
                if integrations.get('database') == 'supabase':
                    features.append("💾 Supabase Database (PostgreSQL)")
                elif integrations.get('database') == 'postgresql':
                    features.append("🐘 PostgreSQL Database")
                if integrations.get('stripe'):
                    features.append("💳 Stripe Payment Integration")
                if integrations.get('email') == 'resend':
                    features.append("📧 Resend Email Service")
                elif integrations.get('email') == 'sendgrid':
                    features.append("📧 SendGrid Email Service")
                if integrations.get('analytics') == 'posthog':
                    features.append("📊 PostHog Analytics")
                elif integrations.get('analytics') == 'google':
                    features.append("📊 Google Analytics")
                
                features_str = '\n'.join(f"- {feature}" for feature in features)
                
                # Build setup instructions based on tech stack
                setup_commands = []
                dev_commands = []
                build_commands = []
                
                if tech_stack.get('docker'):
                    setup_commands.append("# Using Docker\nmake install  # Create .env from template\nmake dev      # Start development environment")
                    dev_commands.append("make dev      # Docker with hot reload")
                    build_commands.append("make prod     # Production build")
                else:
                    setup_commands.append("npm install   # Install dependencies")
                    dev_commands.append("npm run dev   # Start development server")
                    build_commands.append("npm run build # Build for production")
                
                setup_str = '\n'.join(setup_commands)
                dev_str = '\n'.join(dev_commands)
                build_str = '\n'.join(build_commands)
                
                # Create comprehensive README
                readme_content = f"""# {repo_data.name}

{repo_data.description or 'A new SaaS project created with 5AM Founder'}

## 🚀 Features

{features_str}

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
{"- Docker (optional)" if tech_stack.get('docker') else ""}
{"- Supabase account" if integrations.get('database') == 'supabase' or integrations.get('supabaseAuth') else ""}
{"- Stripe account" if integrations.get('stripe') else ""}

## 🛠️ Installation

```bash
# Clone the repository
git clone {repo.clone_url}
cd {repo_data.name}

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

{setup_str}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

{"# Supabase Configuration" if integrations.get('database') == 'supabase' or integrations.get('supabaseAuth') else ""}
{"NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" if integrations.get('database') == 'supabase' or integrations.get('supabaseAuth') else ""}
{"NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" if integrations.get('database') == 'supabase' or integrations.get('supabaseAuth') else ""}
{"SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key" if integrations.get('database') == 'supabase' or integrations.get('supabaseAuth') else ""}

{"# Stripe Configuration" if integrations.get('stripe') else ""}
{"STRIPE_SECRET_KEY=your_stripe_secret_key" if integrations.get('stripe') else ""}
{"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key" if integrations.get('stripe') else ""}

{"# Email Configuration" if integrations.get('email') != 'none' else ""}
{"RESEND_API_KEY=your_resend_api_key" if integrations.get('email') == 'resend' else ""}
{"SENDGRID_API_KEY=your_sendgrid_api_key" if integrations.get('email') == 'sendgrid' else ""}

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
```

## 💻 Development

```bash
{dev_str}

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🏗️ Building for Production

```bash
{build_str}
```

## 📁 Project Structure

```
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and libraries
│   │   └── styles/       # Global styles and Tailwind config
│   └── public/           # Static assets
├── backend/              # FastAPI backend application
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── models/       # Pydantic models
│   │   ├── auth/         # Authentication logic
│   │   └── main.py       # Application entry point
│   └── requirements.txt  # Python dependencies
{"├── docker-compose.yml    # Docker configuration" if tech_stack.get('docker') else ""}
{"├── Makefile              # Development commands" if tech_stack.get('docker') else ""}
└── README.md             # This file
```

## 🧪 Testing

```bash
{"npm test         # Run tests" if tech_stack.get('testing') != 'none' else "# Testing not configured"}
{"npm run test:e2e # Run end-to-end tests" if tech_stack.get('testing') != 'none' else ""}
```

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd frontend && vercel
```

### Render (Backend)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🛟 Support

For support, email support@5amfounder.com or open an issue in this repository.

---

Built with ❤️ by [5AM Founder](https://5amfounder.com) - Ship your SaaS at 5AM
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