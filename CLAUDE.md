# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Environment Configuration (ULTRA-SIMPLIFIED!)

**ONE file to rule them all**: `.env`

Copy `.env.example` to `.env` and add your Supabase credentials. That's it!

```bash
make install  # Creates .env from .env.example
# Edit .env with your actual Supabase credentials
```

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

## Debugging

### Health Checks
- Backend: http://localhost:8000/health
- Frontend: http://localhost:3000

### Common Issues
- **CORS errors**: Check CORS_ORIGINS in .env
- **401 errors**: Check JWT_SECRET_KEY and Supabase config
- **Docker issues**: `make clean` then `make dev`

## File Structure
```
/builder/
├── .env              # Single config file!
├── .env.example      # Template
├── docker-compose.yml
├── docker-compose.override.yml  # Dev hot reload
├── Makefile          # Simple commands
├── frontend/         # Next.js
├── backend/          # FastAPI
└── CLAUDE.md         # This file
```

## Why This Setup?

**Before**: Confusing mess of .env.dev, .env.prod, .env.local files everywhere  
**Now**: ONE .env file that works for everything

- ✅ Local development: reads .env
- ✅ Docker development: reads .env  
- ✅ Production: override environment variables as needed
- ✅ No confusion about which file to edit

Simple is better!