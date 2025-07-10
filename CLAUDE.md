# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the 5AM Founder project - an automated SaaS boilerplate generator.

## Project Overview

5AM Founder helps developers ship their SaaS products in minutes by:
1. Connecting to GitHub for repository creation
2. Allowing selection of tech stack components
3. Automatically generating a customized, production-ready codebase

## Workflow with Claude

### Documentation Structure
- **`docs/master.md`** - Living document tracking project evolution, implementation history, and upcoming features
- **`docs/workers/`** - Used only for drafting feature descriptions before feeding to Claude

### Working Process
1. **Feature Planning**: User drafts feature descriptions in workers directory
2. **Implementation**: Claude implements features based on provided descriptions
3. **Documentation**: Claude updates `master.md` after completing features or rollbacks
   - Only update after significant changes (feature additions, major modifications, rollbacks)
   - Do NOT update on every message or minor change
   - Include implementation history and what's coming next

### Master.md Structure
The `master.md` file should maintain:
- **Project Vision**: Overall goals and direction
- **Implementation History**: Chronological record of major changes
- **Current State**: What features exist and how they work
- **Upcoming Features**: What's planned next
- **Technical Decisions**: Key architectural choices and rationale

## Quick Start

```bash
# One-time setup
make install   # Creates .env file - edit with your Supabase credentials

# Development (choose one)
make dev       # Docker with hot reload (recommended)
make local     # Local development instructions

# Production
make prod      # Docker production build
```

## Tech Stack

**Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Supabase Auth  
**Backend**: FastAPI + Python 3.11 + PyJWT + Supabase  
**Styling**: Modern UI with glassmorphism, gradients, and animations  
**Deployment**: Docker + Vercel/Render + GitHub Actions

## Environment Configuration (ULTRA-SIMPLIFIED!)

**ONE file to rule them all**: `.env`

Copy `.env.example` to `.env` and add your Supabase credentials. That's it!

```bash
make install  # Creates .env from .env.example
# Edit .env with your actual Supabase credentials
```

### Supabase Project Details
- **Production Project**: Builder (ID: cuwvinwquecivxrmdxkz)
- **Region**: us-east-2

### GitHub Authentication Setup
**CRITICAL**: Enable provider token access in Supabase Dashboard:
1. Go to Authentication > Providers > GitHub
2. Under "Advanced Settings", enable "Return provider tokens"
3. Save changes

**Database Schema**:
- `github_tokens` table stores GitHub access tokens securely
- Row Level Security (RLS) ensures users can only access their own tokens
- Tokens are persisted across sessions for seamless GitHub integration

## Development Commands

### Docker Development (Recommended)
```bash
make dev      # Starts both services with hot reload
```

This automatically:
- Builds containers
- Mounts code for hot reload
- Starts frontend on http://localhost:3000
- Starts backend on http://localhost:8000
- API docs at http://localhost:8000/docs

### All Make Commands
```bash
make install        # Create .env from template
make dev           # Start development environment
make prod          # Build for production
make down          # Stop all services
make clean         # Remove containers and volumes
make logs          # View all logs
make logs-frontend # View frontend logs only
make logs-backend  # View backend logs only
make shell-frontend # Access frontend container
make shell-backend  # Access backend container
make local         # Show local dev instructions
```

### Local Development (No Docker)
```bash
make local    # Shows instructions
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend/
pip install -r requirements-dev.txt
uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend/
npm install
npm run dev
```

### Code Quality
```bash
# Frontend
cd frontend/
npm run lint      # ESLint
npm run type-check # TypeScript

# Backend
cd backend/
black app/        # Format
isort app/        # Sort imports
flake8 app/       # Lint
pytest            # Test
```

## Dependencies Management

### Backend (Simple pip)
- **Production**: `requirements.txt` (7 packages)
- **Development**: `requirements-dev.txt` (adds testing/linting)

### Frontend (Minimal)
- **10 essential packages** only
- Removed all unused dependencies

## Architecture

### Authentication
- Supabase handles auth (signup/login/OAuth)
- JWT tokens in httpOnly cookies
- Backend validates with PyJWT (not python-jose)
- Frontend: `ProtectedRoute` wrapper
- Backend: `get_current_user` dependency

### API Structure
- Routes: `backend/app/routers/`
- Models: `backend/app/models/` (Pydantic)
- Docs: http://localhost:8000/docs

### Frontend Structure
- Pages: `src/app/` (App Router)
- Components: `src/components/`
- Hooks: `src/hooks/`
- Styling: Tailwind + `styles.md`

## Deployment

### Render (Easiest)
1. **Backend Service**: `pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. **Frontend Service**: `npm install && npm run build && npm start`
3. Add environment variables from your `.env` file

### Vercel (Frontend only)
```bash
cd frontend && vercel
```

## Common Tasks

### UI/UX Updates
When modifying the UI:
1. Refer to `docs/styles.md` for design patterns
2. Use existing glass card effects and gradients
3. Follow the established color palette
4. Maintain responsive design (mobile-first)
5. Use the SVG logos from the style guide

### Add Dependencies
```bash
# Frontend
cd frontend && npm install <package>

# Backend
cd backend && pip install <package>
pip freeze | grep <package> >> requirements.txt
```

### Add API Endpoint
1. Create route in `backend/app/routers/`
2. Add Pydantic model in `backend/app/models/`
3. Use `current_user: User = Depends(get_current_user)` for auth

### Add Page
1. Create `src/app/new-page/page.tsx`
2. Use `ProtectedRoute` if auth required
3. Follow the modern UI patterns (glass cards, gradients)
4. Ensure mobile responsiveness

### Working with the Landing Page
The landing page (`frontend/src/app/page.tsx`) features:
- Modern glassmorphism design
- 3-step workflow visualization
- Integration grid with actual logos
- Terminal preview section
- Floating background elements
- Gradient text and borders

## Debugging

### Health Checks
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000

### Common Issues
- **CORS errors**: Check CORS_ORIGINS in .env
- **401 errors**: Check JWT_SECRET_KEY and Supabase config
- **Docker issues**: `make clean` then `make dev`

## Project Structure
```
/builder/
├── .env              # Single config file!
├── .env.example      # Template
├── README.md         # Project documentation
├── docker-compose.yml
├── docker-compose.override.yml  # Dev hot reload
├── Makefile          # Simple commands
├── frontend/         # Next.js app
│   ├── public/
│   │   └── avatars/  # Professional avatar SVGs
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/  # React components
│   │   ├── hooks/    # Custom React hooks
│   │   └── styles/   # Global CSS with modern effects
│   └── package.json
├── backend/          # FastAPI app
│   ├── app/
│   │   ├── main.py   # Entry point
│   │   ├── routers/  # API endpoints
│   │   └── models/   # Pydantic models
│   └── requirements.txt
├── docs/             # Documentation
│   ├── styles.md     # Comprehensive UI/UX style guide
│   └── SECURITY_CHECKLIST.md
└── CLAUDE.md         # This file
```

## Key Documentation

### styles.md
Located at `docs/styles.md`, contains:
- Complete color palette and CSS variables
- Modern UI components (glass cards, gradients, animations)
- Typography system
- SVG logo collection for all integrations
- Animation patterns and best practices
- Responsive design patterns

## Why This Setup?

**Before**: Confusing mess of .env.dev, .env.prod, .env.local files everywhere  
**Now**: ONE .env file that works for everything

- ✅ Local development: reads .env
- ✅ Docker development: reads .env  
- ✅ Production: override environment variables as needed
- ✅ No confusion about which file to edit

Simple is better!

## UI/Brand Guidelines

### Brand Name
The project is called "5AM Founder" - targeting developers who ship at 5AM.

### Design Philosophy
- **Modern & Minimalistic**: Clean, uncluttered interfaces
- **Dark by Default**: Optimized for developer eyestrain
- **Glassmorphism**: Translucent UI elements with backdrop blur
- **Gradient Accents**: Blue (#3B82F6) to Purple (#8B5CF6) for CTAs
- **Professional**: No unnecessary animations or effects

### Key UI Elements
1. **Glass Cards**: `glass-card` class for translucent containers
2. **Gradient Borders**: For primary CTAs and emphasis
3. **Gradient Text**: For headlines and important text
4. **Floating Backgrounds**: Subtle animated blur effects
5. **Professional Avatars**: Diverse SVG representations
6. **Terminal Preview**: Realistic command-line interface

### Color Palette
- **Background**: #0a0a0a (pure black)
- **Primary Blue**: #3B82F6
- **Purple Accent**: #8B5CF6
- **Success Green**: #10B981
- **Text Gray**: Various opacity levels of white

### When Building Features
- Always check `docs/styles.md` for existing patterns
- Maintain consistency with the modern, professional aesthetic
- Ensure all new components are mobile-responsive
- Use the established animation library (no new animations)
- Follow the typography hierarchy