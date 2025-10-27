# 5AM Founder - Automated SaaS Boilerplate Generator

![5AM Founder](https://img.shields.io/badge/5AM_Founder-Ship_Your_SaaS_in_5_Minutes-gradient.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<p align="center">
  <strong>Stop Building Boilerplate. Start Shipping Products.</strong><br>
  Built for developers who ship at 5AM ☕
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What Makes This Different](#-what-makes-this-different)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [License](#-license)

---

## 🚀 Overview

**5AM Founder** is an automated SaaS boilerplate generator that helps developers ship their products in minutes instead of months. Connect your GitHub account, choose your tech stack components, and get a fully customized, production-ready repository with authentication, database integration, and deployment configurations - all pre-configured and ready to go.

### Core Value Proposition

- **Save 40+ hours** of initial setup per project
- **Ship in minutes**, not days or weeks
- **Production-ready** codebase from day one
- **AI-optimized** structure and documentation
- **Toggle-based flexibility** - only include what you need

### How It Works

1. **Connect GitHub** - Authenticate with your GitHub account
2. **Configure Project** - Choose your tech stack and integrations
3. **Generate** - Watch in real-time as your repository is created
4. **Ship** - Get a fully configured project ready to deploy

---

## 🎯 What Makes This Different

Unlike other boilerplate generators, 5AM Founder:

- ✅ **Actually generates code**, not just configuration files
- ✅ **Real-time progress streaming** with WebSocket updates
- ✅ **Complete Next.js 15 + Supabase template** with auth built-in
- ✅ **Claude MCP integration** pre-configured for AI-assisted development
- ✅ **Docker support** out of the box
- ✅ **Modern UI** with glassmorphism and dark theme
- ✅ **Secure token storage** - GitHub tokens persist across sessions

---

## ✨ Features

### Implemented Features

#### 🔐 Authentication & Security
- GitHub OAuth integration with Supabase
- JWT-based session management
- Protected routes with automatic redirects
- Secure token storage with Row Level Security (RLS)
- httpOnly cookies for enhanced security

#### 📦 Project Creation
- **Multi-step wizard** with intuitive UI
- **Real-time progress streaming** via WebSocket
- **Template system** with 23+ files:
  - Complete Next.js 15 App Router setup
  - Supabase authentication (client/server/middleware)
  - Protected routes and dashboard
  - API routes with examples
  - Tailwind CSS configuration
  - Docker support
  - Claude MCP integration
- **Customization options**:
  - Project name and description
  - Public/private repository
  - Tech stack selection
  - Integration toggles
- **Smart file generation**:
  - Variable substitution system
  - Binary and text file handling
  - Batch upload to avoid rate limits

#### 📊 Dashboard
- Project listing with repository cards
- GitHub repository management
- Quick actions (view, edit, delete)
- User statistics and activity
- Professional avatar system

#### 🎨 Modern UI/UX
- **Glassmorphism design** with translucent elements
- **Dark theme** optimized for developers
- **Gradient accents** (Blue to Purple)
- **Responsive** mobile-first design
- **Smooth animations** and micro-interactions
- **Terminal-style** build output

#### 🔄 Real-time Features
- WebSocket connection for live updates
- Progress tracking during creation:
  - Repository creation
  - Template preparation
  - File upload progress
  - Completion status
- Futuristic streaming UI with animated effects

### Coming Soon

- 💳 **Stripe integration** for paid plans
- 🔧 **Project updates** and patches
- 🏪 **Template marketplace** with multiple options
- 👥 **Team management** and collaboration
- 🚀 **One-click deployment** to Vercel/Render
- 📈 **Usage analytics** and monitoring
- 🛠️ **CLI tool** for local generation

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth
- **State Management**: React Hooks
- **API Client**: Fetch API
- **WebSocket**: Native WebSocket API

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Auth**: PyJWT + Supabase
- **GitHub Integration**: PyGithub
- **Real-time**: WebSocket Manager
- **Template Engine**: Custom file processor

### Database & Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: GitHub Repositories
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload for both services

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)
- **Database**: Supabase Cloud
- **CI/CD**: GitHub Actions (planned)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Docker & Docker Compose** (for containerized development)
- **Node.js 18+** (for local development)
- **Python 3.11+** (for local development)
- **Supabase account** - [Sign up free](https://supabase.com)
- **GitHub account** - For OAuth and repository creation

### One-Command Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/5am-founder.git
cd 5am-founder

# 2. Create environment file from template
make install

# 3. Edit .env with your credentials (see Environment Setup section)
nano .env

# 4. Start the development environment
make dev
```

This will start:
- **Frontend** at http://localhost:3000
- **Backend** at http://localhost:8000
- **API Documentation** at http://localhost:8000/docs

### Manual Setup (Without Docker)

If you prefer not to use Docker:

```bash
# Terminal 1 - Backend
cd backend/
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend/
npm install
npm run dev
```

---

## 🔧 Environment Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (note the region for best performance)
3. Navigate to **Settings > API**
4. Copy the following values:
   - Project URL
   - `anon` public key
   - `service_role` secret key
   - JWT Secret (under **JWT Settings**)

### 2. Configure GitHub OAuth

#### Enable GitHub Provider in Supabase

1. Go to **Authentication > Providers > GitHub**
2. Enable the GitHub provider
3. Keep this tab open (you'll add credentials here)

#### Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps > New OAuth App**
3. Fill in the details:
   - **Application name**: `5AM Founder` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (development) or your production URL
   - **Authorization callback URL**: Get from Supabase (step 1)
4. Click **Register application**
5. Copy the **Client ID**
6. Generate a **Client Secret** and copy it

#### Configure Supabase with GitHub Credentials

1. Return to Supabase **Authentication > Providers > GitHub**
2. Paste your GitHub **Client ID** and **Client Secret**
3. Under **Advanced Settings**, find **"Return provider tokens"**
4. ⚠️ **CRITICAL**: Enable **"Return provider tokens"**
   - This allows the app to receive the GitHub access token
   - Without this, repository creation will not work!
5. Save configuration

### 3. Set Up Database Tables

The `github_tokens` table is required for persistent GitHub authentication:

```sql
-- Run this in Supabase SQL Editor

-- Create github_tokens table
CREATE TABLE IF NOT EXISTS public.github_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.github_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only access their own tokens
CREATE POLICY "Users can manage own tokens" ON public.github_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_github_tokens_updated_at
  BEFORE UPDATE ON public.github_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration (from Supabase Dashboard > Settings > API > JWT Secret)
JWT_SECRET_KEY=your-supabase-jwt-secret

# Environment
ENVIRONMENT=development
```

### Why One .env File?

**Before**: Confusing mess of `.env.dev`, `.env.prod`, `.env.local` files everywhere  
**Now**: ONE `.env` file that works for everything

- ✅ Local development: reads `.env`
- ✅ Docker development: reads `.env`
- ✅ Production: override via environment variables
- ✅ No confusion about which file to edit

---

## 💻 Development

### Available Make Commands

```bash
# Setup
make install        # Create .env from template

# Development
make dev           # Start development environment with hot reload
make down          # Stop all services
make clean         # Remove containers and volumes
make restart       # Clean and restart services

# Logs
make logs          # View all logs
make logs-frontend # View frontend logs only
make logs-backend  # View backend logs only

# Shell Access
make shell-frontend # Access frontend container shell
make shell-backend  # Access backend container shell

# Production
make prod          # Build and run production environment

# Local Development
make local         # Show local development instructions
```

### Development Workflow

#### 1. Hot Reload

Both frontend and backend support hot reload in development mode:

- **Frontend**: File changes automatically refresh the browser
- **Backend**: FastAPI reloads on Python file changes

#### 2. Code Quality

```bash
# Frontend - Linting and Type Checking
cd frontend/
npm run lint           # ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run type-check     # TypeScript validation

# Backend - Formatting and Linting
cd backend/
black app/             # Format code (auto-fix)
isort app/             # Sort imports (auto-fix)
flake8 app/            # Lint code
mypy app/              # Type checking (if configured)
```

#### 3. Adding Dependencies

```bash
# Frontend
cd frontend/
npm install <package-name>
npm install --save-dev <dev-package>

# Backend
cd backend/
pip install <package-name>
pip freeze | grep <package-name> >> requirements.txt
```

#### 4. Database Migrations

```bash
# Access Supabase Dashboard
# Go to Database > SQL Editor
# Run migration scripts
```

### Common Development Tasks

#### Adding a New API Endpoint

1. Create a router file in `backend/app/routers/`:

```python
# backend/app/routers/my_feature.py
from fastapi import APIRouter, Depends
from app.auth.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/my-feature", tags=["my-feature"])

@router.get("/")
async def get_my_feature(current_user: User = Depends(get_current_user)):
    return {"message": "Hello from my feature"}
```

2. Register the router in `backend/app/main.py`:

```python
from app.routers import my_feature

app.include_router(my_feature.router)
```

#### Adding a New Page

1. Create a page file in `frontend/src/app/`:

```tsx
// frontend/src/app/my-page/page.tsx
import ProtectedRoute from '@/components/auth/protected-route';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="glass-card">
        <h1 className="gradient-text">My Page</h1>
      </div>
    </ProtectedRoute>
  );
}
```

#### Adding a UI Component

Follow the design system in `docs/styles.md`:

```tsx
// Use existing patterns
<div className="glass-card">
  <button className="btn-gradient">
    Click Me
  </button>
</div>
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │   Pages    │  │ Components  │  │  Hooks & Utils   │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
│         │               │                    │              │
│         └───────────────┴────────────────────┘              │
│                         │                                    │
│                    API Client                                │
└────────────────────────┼────────────────────────────────────┘
                         │
                    HTTP/WebSocket
                         │
┌────────────────────────┼────────────────────────────────────┐
│                         │                                    │
│                   Backend (FastAPI)                          │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────────┐     │
│  │   Routers   │  │ Services │  │ WebSocket Manager  │     │
│  └─────────────┘  └──────────┘  └────────────────────┘     │
│         │               │                    │              │
│         └───────────────┴────────────────────┘              │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
              ┌───────────┴──────────┐
              │                      │
    ┌─────────▼────────┐   ┌────────▼─────────┐
    │ Supabase          │   │ GitHub API       │
    │ - Auth            │   │ - Repositories   │
    │ - Database        │   │ - OAuth          │
    │ - Storage (RLS)   │   │ - File Upload    │
    └───────────────────┘   └──────────────────┘
```

### Authentication Flow

```
1. User clicks "Sign in with GitHub"
   │
   ├─> Supabase initiates GitHub OAuth
   │
2. GitHub redirects to callback URL
   │
   ├─> Supabase exchanges code for tokens
   │
3. Frontend receives session with JWT
   │
   ├─> JWT stored in httpOnly cookie
   │
4. Backend validates JWT on each request
   │
   ├─> User data extracted from token
   │
5. GitHub token stored in database
   │
   └─> Available for repository operations
```

### Project Creation Flow

```
1. User fills project creation form
   │
   ├─> Project details, integrations, etc.
   │
2. Frontend establishes WebSocket connection
   │
   ├─> Real-time progress updates
   │
3. Backend creates GitHub repository
   │
   ├─> Initial README commit
   │
4. Template service prepares files
   │
   ├─> Variable substitution
   │   ├─> {{PROJECT_NAME}}
   │   ├─> {{PROJECT_DESCRIPTION}}
   │   └─> {{SUPABASE_*}} placeholders
   │
5. Files uploaded in batches
   │
   ├─> Progress streamed via WebSocket
   │   ├─> "Uploading files... (5/23)"
   │   ├─> "Uploading files... (10/23)"
   │   └─> "Uploading files... (23/23)"
   │
6. Project metadata saved
   │
   ├─> Topics added for filtering
   │
7. Success notification
   │
   └─> Installation modal shown
```

### WebSocket Communication

```typescript
// Frontend establishes connection
const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);

// Backend sends progress updates
await websocket.send_json({
  "type": "progress",
  "message": "Creating repository...",
  "step": 1,
  "total": 4
});

// Frontend displays in real-time UI
onMessage((data) => {
  setProgress(data.message);
});
```

### Template System

The template system uses a variable substitution approach:

**Template File** (`backend/templates/nextjs-supabase/.env.local.example`):
```env
NEXT_PUBLIC_SUPABASE_URL={{SUPABASE_URL}}
NEXT_PUBLIC_SUPABASE_ANON_KEY={{SUPABASE_ANON_KEY}}
```

**After Substitution**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Available Variables**:
- `{{PROJECT_NAME}}` - Repository name
- `{{PROJECT_DESCRIPTION}}` - User's description
- `{{SUPABASE_URL}}` - Supabase project URL
- `{{SUPABASE_ANON_KEY}}` - Anon key placeholder
- `{{SUPABASE_SERVICE_ROLE_KEY}}` - Service key placeholder
- `{{SUPABASE_PROJECT_ID}}` - For MCP configuration

---

## 📁 Project Structure

```
/5am-founder/
├── .env                    # Single configuration file
├── .env.example            # Environment template
├── docker-compose.yml      # Docker orchestration
├── docker-compose.override.yml  # Dev-specific overrides
├── Makefile               # Development commands
├── README.md              # This file
├── CLAUDE.md              # AI assistant instructions
├── LICENSE                # MIT License
│
├── frontend/              # Next.js Application
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   │
│   ├── public/
│   │   └── avatars/       # Professional SVG avatars
│   │
│   └── src/
│       ├── app/           # Next.js 15 App Router
│       │   ├── layout.tsx # Root layout
│       │   ├── page.tsx   # Landing page
│       │   ├── dashboard/ # User dashboard
│       │   ├── newproject/ # Project creation wizard
│       │   ├── settings/  # User settings
│       │   └── auth/      # Auth pages
│       │
│       ├── components/
│       │   ├── auth/      # Auth components
│       │   ├── layout/    # Layout components
│       │   ├── ui/        # Reusable UI components
│       │   └── providers/ # React context providers
│       │
│       ├── hooks/
│       │   ├── useAuth.ts       # Authentication hook
│       │   ├── useGitHubAuth.ts # GitHub integration
│       │   └── useRepositories.ts # Repository management
│       │
│       ├── lib/
│       │   ├── supabase.ts # Supabase client
│       │   ├── github.ts   # GitHub utilities
│       │   └── utils.ts    # Helper functions
│       │
│       ├── types/
│       │   └── auth.ts    # TypeScript types
│       │
│       ├── styles/
│       │   └── globals.css # Global styles + Tailwind
│       │
│       └── middleware.ts  # Next.js middleware
│
├── backend/               # FastAPI Application
│   ├── Dockerfile
│   ├── requirements.txt   # Production dependencies
│   ├── requirements-dev.txt # Development dependencies
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # Application entry point
│   │   ├── config.py      # Configuration management
│   │   ├── middleware.py  # CORS & other middleware
│   │   │
│   │   ├── auth/
│   │   │   └── auth.py    # JWT validation
│   │   │
│   │   ├── db/
│   │   │   └── supabase_client.py # Supabase connection
│   │   │
│   │   ├── models/
│   │   │   ├── user.py    # User Pydantic models
│   │   │   └── project.py # Project models
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py        # Auth endpoints
│   │   │   ├── auth_github.py # GitHub OAuth
│   │   │   ├── users.py       # User management
│   │   │   ├── projects.py    # Project CRUD
│   │   │   └── github.py      # GitHub operations
│   │   │
│   │   ├── services/
│   │   │   └── template_service.py # Template processing
│   │   │
│   │   └── websocket_manager.py # WebSocket handler
│   │
│   └── templates/
│       └── nextjs-supabase/ # Base template (23 files)
│           ├── package.json
│           ├── next.config.js
│           ├── tailwind.config.ts
│           ├── tsconfig.json
│           ├── README.md
│           ├── .gitignore
│           ├── .env.local.example
│           ├── .claude/
│           │   └── settings.json # Claude MCP config
│           └── src/
│               ├── app/
│               │   ├── layout.tsx
│               │   ├── page.tsx
│               │   ├── dashboard/
│               │   └── api/
│               └── middleware.ts
│
└── docs/                  # Documentation
    ├── master.md          # Project evolution & roadmap
    ├── styles.md          # Comprehensive UI/UX guide
    ├── deploy.md          # Deployment instructions
    ├── GOOGLE_OAUTH_SETUP.md
    └── workers/           # Feature drafts
        ├── [0]project-creation.md
        ├── [1]newuserflow.md
        ├── [2]templatecreation.md
        └── [4]supabase.md
```

---

## 📚 API Documentation

### Interactive Documentation

When running the backend, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication Endpoints

#### POST `/api/v1/auth/signup`
Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "user": { "id": "...", "email": "user@example.com" },
  "session": { "access_token": "...", "refresh_token": "..." }
}
```

#### POST `/api/v1/auth/login`
Authenticate existing user.

#### POST `/api/v1/auth/logout`
End user session.

#### GET `/api/v1/auth/me`
Get current user information.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GitHub Endpoints

#### GET `/api/v1/github/repositories`
List user's repositories.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "repositories": [
    {
      "name": "my-project",
      "full_name": "username/my-project",
      "html_url": "https://github.com/username/my-project",
      "private": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/v1/github/repositories`
Create a new repository with template.

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "name": "my-saas-app",
  "description": "My awesome SaaS application",
  "private": true,
  "integrations": {
    "supabase": true,
    "stripe": false,
    "analytics": true
  }
}
```

**Response**:
```json
{
  "repository_url": "https://github.com/username/my-saas-app",
  "status": "created"
}
```

#### DELETE `/api/v1/github/repositories/{owner}/{name}`
Delete a repository.

**Headers**: `Authorization: Bearer <token>`

### WebSocket Endpoints

#### WS `/ws/{user_id}`
Real-time project creation updates.

**Connection**: `ws://localhost:8000/ws/{user_id}`

**Message Format**:
```json
{
  "type": "progress",
  "message": "Creating repository...",
  "step": 1,
  "total": 4,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Message Types**:
- `progress` - Progress update
- `success` - Operation completed
- `error` - Error occurred

---

## 🗄️ Database Schema

### Supabase Tables

#### `auth.users` (Managed by Supabase)
- `id` - UUID (Primary Key)
- `email` - String (Unique)
- `encrypted_password` - String
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `public.profiles`
Extended user information.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `public.github_tokens`
Secure GitHub token storage.

```sql
CREATE TABLE public.github_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE public.github_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tokens" 
  ON public.github_tokens FOR ALL 
  USING (auth.uid() = user_id);
```

#### `public.projects`
Project metadata and tracking.

```sql
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  repository_url TEXT NOT NULL,
  private BOOLEAN DEFAULT false,
  integrations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
```

### Row Level Security (RLS)

All tables use RLS to ensure users can only access their own data:

```sql
-- Users can only read their own projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create projects for themselves
CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🚢 Deployment

### Deployment Architecture

**Recommended Setup**:
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Render (easy Docker deployment)
- **Database**: Supabase Cloud (managed PostgreSQL)

### Deploy to Vercel (Frontend)

#### Option 1: Vercel CLI

```bash
cd frontend/
npm install -g vercel
vercel
```

#### Option 2: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Select `frontend/` as the root directory
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```
5. Deploy

**Build Settings**:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Deploy to Render (Backend)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New > Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `5am-founder-backend`
   - **Root Directory**: `backend/`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Instance Type**: Starter or higher

5. Add environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET_KEY=your_jwt_secret
   CORS_ORIGINS=["https://your-app.vercel.app"]
   ENVIRONMENT=production
   ```

6. Deploy

**Dockerfile** (already included):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deploy with Docker (Self-hosted)

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Run in production mode
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables for Production

Update your production `.env`:

```env
# Production URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CORS_ORIGINS=["https://yourdomain.com"]
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
JWT_SECRET_KEY=your_production_jwt_secret

# Environment
ENVIRONMENT=production
```

### Post-Deployment Checklist

- [ ] Update GitHub OAuth callback URL to production domain
- [ ] Update Supabase site URL in authentication settings
- [ ] Enable Supabase "Return provider tokens" for GitHub
- [ ] Test authentication flow end-to-end
- [ ] Test project creation with real GitHub account
- [ ] Set up monitoring and error tracking
- [ ] Configure custom domain (if desired)
- [ ] Set up SSL certificates (automatic with Vercel/Render)
- [ ] Enable rate limiting (if needed)
- [ ] Set up backup strategy for database

---

## 🧪 Testing

### Frontend Testing

```bash
cd frontend/

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e
```

### Backend Testing

```bash
cd backend/

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run specific test
pytest tests/test_auth.py::test_login

# Linting
flake8 app/

# Type checking
mypy app/

# Format check
black --check app/
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] Sign up with email/password
- [ ] Log in with GitHub OAuth
- [ ] GitHub token persists across sessions
- [ ] Protected routes redirect when not authenticated
- [ ] Logout clears session properly

#### Project Creation
- [ ] Multi-step wizard works
- [ ] Real-time WebSocket updates display
- [ ] Repository created in GitHub
- [ ] Template files uploaded correctly
- [ ] Installation modal shows after completion
- [ ] Project appears in dashboard

#### Dashboard
- [ ] Projects list displays correctly
- [ ] Repository cards have correct information
- [ ] Delete confirmation works
- [ ] Links open to GitHub

---

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom**: Frontend can't connect to backend, browser console shows CORS errors.

**Solution**:
```env
# In .env, ensure CORS_ORIGINS matches your frontend URL
CORS_ORIGINS=http://localhost:3000

# For production
CORS_ORIGINS=["https://your-domain.com","https://www.your-domain.com"]
```

#### 2. GitHub Authentication Not Working

**Symptom**: Can login but can't create repositories.

**Solution**:
1. Check Supabase Dashboard > Authentication > Providers > GitHub
2. Ensure "Return provider tokens" is enabled
3. Verify GitHub OAuth app credentials are correct
4. Check callback URL matches: `https://<project-ref>.supabase.co/auth/v1/callback`

#### 3. JWT Validation Errors (401)

**Symptom**: Getting 401 Unauthorized on API calls.

**Solution**:
```env
# Ensure JWT_SECRET_KEY matches Supabase JWT secret
# Get it from: Supabase Dashboard > Settings > API > JWT Settings
JWT_SECRET_KEY=your-supabase-jwt-secret
```

#### 4. WebSocket Connection Failed

**Symptom**: No real-time updates during project creation.

**Solution**:
- Check backend logs: `make logs-backend`
- Verify WebSocket endpoint is accessible
- Ensure no proxy blocking WebSocket connections
- Check browser console for connection errors

#### 5. Docker Issues

**Symptom**: Containers won't start or build failures.

**Solution**:
```bash
# Clean everything and restart
make clean
make dev

# If still having issues
docker system prune -a  # Warning: removes all unused containers/images
make dev
```

#### 6. Template Files Not Uploading

**Symptom**: Repository created but empty or missing files.

**Solution**:
- Check backend logs for rate limit errors
- Verify GitHub token has `repo` scope
- Check file permissions in `backend/templates/`
- Ensure template files exist: `ls backend/templates/nextjs-supabase/`

### Health Checks

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000

# Check API docs
open http://localhost:8000/docs
```

### Debug Mode

Enable debug logging:

```env
# Backend .env
ENVIRONMENT=development
LOG_LEVEL=DEBUG

# Frontend
NEXT_PUBLIC_DEBUG=true
```

### Getting Help

1. **Check Documentation**:
   - `docs/master.md` - Project evolution and features
   - `docs/styles.md` - UI/UX guidelines
   - `CLAUDE.md` - Development workflow

2. **Search Issues**: Check GitHub Issues for similar problems

3. **Enable Debug Logging**: See error details in console/logs

4. **Create an Issue**: 
   - Include error messages
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Relevant logs

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Follow code style**:
   ```bash
   # Frontend
   npm run lint:fix
   npm run type-check
   
   # Backend
   black app/
   isort app/
   flake8 app/
   ```
5. **Commit your changes**:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   (Follow [Conventional Commits](https://www.conventionalcommits.org/))
6. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Message Format

We use Conventional Commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add Stripe payment integration
fix: resolve WebSocket connection timeout
docs: update deployment instructions
style: apply consistent formatting to auth components
refactor: simplify template variable substitution
test: add unit tests for GitHub service
chore: update dependencies
```

### Code Review Process

1. Maintainer reviews your PR
2. Address any feedback
3. Once approved, your PR will be merged
4. Your contribution will be credited in releases

### Development Guidelines

- **Write tests** for new features
- **Update documentation** when changing functionality
- **Follow existing patterns** in the codebase
- **Keep PRs focused** - one feature/fix per PR
- **Add comments** for complex logic
- **Check for linting errors** before committing

---

## ❓ FAQ

### General

**Q: Is this really free?**  
A: Yes! 5AM Founder is open source (MIT License). You can use it, modify it, and deploy it freely.

**Q: What's the difference between this and other boilerplates?**  
A: Unlike static boilerplates, 5AM Founder generates customized code based on your selections, includes real-time progress streaming, and comes with AI-assisted development pre-configured.

**Q: Can I use this for commercial projects?**  
A: Absolutely! The MIT License allows commercial use.

### Technical

**Q: Why Next.js and FastAPI?**  
A: Next.js provides excellent developer experience and performance for React apps. FastAPI gives us Python's rich ecosystem (especially for GitHub integration) with modern async support.

**Q: Can I use a different database?**  
A: Currently optimized for Supabase, but you can adapt it for any PostgreSQL database with some modifications.

**Q: Does this work with GitHub Enterprise?**  
A: Not yet, but it's on the roadmap. Currently supports github.com only.

**Q: Can I add my own templates?**  
A: Yes! Add them to `backend/templates/` and update the template service. Full marketplace support coming soon.

### Deployment

**Q: What are the hosting costs?**  
A: With free tiers: $0/month for small projects. Recommended paid tiers: ~$20-30/month for production.

**Q: Can I self-host everything?**  
A: Yes! Use Docker to deploy on any VPS. See the deployment section.

**Q: How do I scale this?**  
A: Vercel and Render scale automatically. For self-hosted, use Docker Swarm or Kubernetes.

### Features

**Q: When will Stripe integration be available?**  
A: It's in development! Expected in the next major release.

**Q: Can I create private repositories?**  
A: Yes! Toggle the "Private Repository" option during project creation.

**Q: How many projects can I create?**  
A: Currently unlimited. Usage limits may be added in future paid tiers.

**Q: Can I update existing projects?**  
A: Not yet - this feature is planned for a future release.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 5AM Founder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Built with modern open-source technologies:

- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Docker](https://www.docker.com/) - Containerization platform
- [PyGithub](https://github.com/PyGithub/PyGithub) - GitHub API library
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with types

Special thanks to all contributors and the open-source community!

---

## 📞 Support

### Documentation
- **Comprehensive Guide**: `docs/master.md`
- **Style Guide**: `docs/styles.md`
- **API Docs**: http://localhost:8000/docs (when running)

### Community
- **GitHub Issues**: Report bugs or request features
- **Discussions**: Share ideas and ask questions
- **Pull Requests**: Contribute improvements

### Stay Updated
- ⭐ Star the repository to stay updated
- 👀 Watch for new releases and features
- 🐦 Follow for announcements (if applicable)

---

<p align="center">
  <strong>Stop Building Boilerplate. Start Shipping Products.</strong><br>
  Built for developers who ship at 5AM ☕
</p>

<p align="center">
  <sub>Made with ❤️ by developers, for developers</sub>
</p>
