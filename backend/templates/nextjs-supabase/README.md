# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## 🚀 Features

- ⚡️ Next.js 15 with App Router
- 🔷 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔐 Supabase Authentication
- 🤖 Claude MCP Integration

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

## 🔧 Configuration

### Environment Variables

Update `.env.local` with your Supabase project details:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### Claude MCP Configuration

The project includes Claude MCP integration. The configuration is in `.claude/settings.json`.

## 💻 Development

```bash
npm run dev
# Open http://localhost:3000
```

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   └── dashboard/    # Protected dashboard
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   │   └── supabase/     # Supabase client setup
│   └── styles/           # Global styles
├── .claude/              # Claude MCP configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔐 Authentication

The app includes a complete authentication system with:
- Email/Password sign in
- OAuth providers (GitHub by default)
- Protected routes
- Session management

## 🚀 Deployment

### Vercel

Deploy directly to Vercel:

```bash
npx vercel
```

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables on your platform
3. Start the server: `npm start`

---

Built with ❤️ by [5AM Founder](https://5amfounder.com)