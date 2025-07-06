# 5AM Founder - Automated SaaS Boilerplate Generator

![5AM Founder](https://img.shields.io/badge/5AM_Founder-Ship_Your_SaaS_in_5_Minutes-gradient.svg)

## 🚀 Overview

5AM Founder is an automated SaaS boilerplate generator that helps developers ship their products in minutes, not months. Connect your GitHub account, choose your tech stack, and get a fully customized repository with authentication, payments, database, and more - all pre-configured and ready to deploy.

### Key Features

- **GitHub Integration**: Seamless authentication and repository creation
- **Pre-configured Tech Stack**: Choose from industry-leading tools
- **Zero Configuration**: Everything works out of the box
- **Production Ready**: Includes CI/CD, deployment configs, and best practices
- **Modern UI**: Beautiful, responsive design with dark mode by default

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, PyJWT
- **Database & Auth**: Supabase
- **Payments**: Stripe (pre-configured)
- **Deployment**: Docker, Vercel, GitHub Actions
- **Development**: Hot reload, TypeScript, ESLint, Black (Python)

## 📁 Project Structure

```
/builder/
├── .env.example          # Environment variables template
├── docker-compose.yml    # Docker configuration
├── docker-compose.override.yml  # Development overrides
├── Makefile             # Simplified commands
├── CLAUDE.md            # AI assistant instructions
├── frontend/            # Next.js application
│   ├── public/          # Static assets
│   │   └── avatars/     # User avatar SVGs
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and configs
│   │   └── styles/      # Global CSS
│   ├── package.json
│   └── tailwind.config.ts
├── backend/             # FastAPI application
│   ├── app/
│   │   ├── main.py      # Application entry
│   │   ├── routers/     # API endpoints
│   │   └── models/      # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
└── docs/                # Documentation
    ├── styles.md        # UI/UX style guide
    └── SECURITY_CHECKLIST.md
```

## 📚 Documentation

### Style Guide
The project includes a comprehensive style guide at [`docs/styles.md`](docs/styles.md) that covers:
- Color palette and CSS variables
- Typography system
- Component patterns (buttons, cards, inputs)
- Animation library
- Glass morphism effects
- SVG logo collection
- Best practices for UI consistency

### Security
Security best practices are documented in [`docs/SECURITY_CHECKLIST.md`](docs/SECURITY_CHECKLIST.md).

### AI Development
The [`CLAUDE.md`](CLAUDE.md) file provides instructions for AI-assisted development with Claude.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- Supabase account and project

### One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd builder

# Create environment file from template
make install

# Edit .env with your Supabase credentials
# Required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET_KEY

# Start development environment
make dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000
- API documentation at http://localhost:8000/docs

### Manual Setup (Without Docker)

#### Frontend
```bash
cd frontend/
npm install
npm run dev
```

#### Backend
```bash
cd backend/
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

## 🛠️ Development Commands

### Docker Commands
```bash
make dev        # Start development environment
make prod       # Build for production
make down       # Stop all services
make clean      # Remove containers and volumes
make logs       # View logs
make shell-frontend  # Access frontend container
make shell-backend   # Access backend container
```

### Code Quality
```bash
# Frontend
cd frontend/
npm run lint
npm run type-check

# Backend
cd backend/
black app/        # Format code
isort app/        # Sort imports
flake8 app/       # Lint
pytest           # Run tests
```

## 🌍 Environment Variables

All configuration is managed through a single `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Backend Configuration
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000"]
```

## 🚢 Deployment

### Vercel (Frontend)
```bash
cd frontend && vercel
```

### Render (Full Stack)
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env`

### Docker Production
```bash
make prod
```

## 🎨 UI Features

- **Modern Glass Morphism**: Sleek translucent UI elements
- **Gradient Accents**: Blue to purple gradients for CTAs
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Optimized for developer eyestrain
- **Professional Avatars**: Diverse SVG representations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with modern open-source technologies:
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Docker](https://www.docker.com/) - Containerization platform

---

<p align="center">
  <strong>Stop Building. Start Shipping.</strong><br>
  Built for developers who ship at 5AM ☕
</p>