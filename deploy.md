# Deployment Guide

## Quick Deploy to Render

### Backend Deployment

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET_KEY=your_jwt_secret
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   ENVIRONMENT=production
   ```

### Frontend Deployment

1. Create another **Web Service** on Render
2. Set root directory to `frontend`
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Alternative: Deploy Frontend to Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Docker Deployment (Any Platform)

### Development
```bash
docker-compose --env-file .env.dev up --build
```

### Production
```bash
docker-compose --env-file .env.prod up --build -d
```

## Environment Variables Template

Copy and fill out:

**Backend (.env)**:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET_KEY=your_super_secret_key
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```