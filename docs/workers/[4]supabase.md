# Supabase Integration Workflow

## Overview
This document outlines the infrastructure and workflow for integrating users' personal Supabase accounts with 5AM Founder, allowing automatic project creation and environment variable configuration.

## Current Template Infrastructure

### Template Files
- **Location**: `backend/templates/nextjs-supabase/`
- **Total Files**: 23 files including full Next.js setup
- **Supabase Integration Points**:
  - `/src/lib/supabase/client.ts` - Browser client
  - `/src/lib/supabase/server.ts` - Server client
  - `/src/lib/supabase/middleware.ts` - Auth middleware
  - `/src/middleware.ts` - Next.js middleware integration
  - `/src/app/auth/` - Authentication pages
  - `/.env.example` - Environment variable template
  - `/.env.local.template` - Auto-populated env file
  - `/.claude/settings.json` - MCP configuration

### Current Variable System
```
{{PROJECT_NAME}} - Repository name
{{PROJECT_DESCRIPTION}} - User's description
{{SUPABASE_URL}} - Placeholder for Supabase URL
{{SUPABASE_ANON_KEY}} - Placeholder for anon key
{{SUPABASE_SERVICE_ROLE_KEY}} - Placeholder for service key
{{SUPABASE_PROJECT_ID}} - For MCP configuration
```

## Proposed Supabase Integration Flow

### Phase 1: Supabase OAuth Integration

#### 1.1 User Authentication with Supabase
- Add "Connect Supabase Account" button in user settings
- Use Supabase Management API OAuth flow
- Required scopes:
  - `projects:read` - List user's projects
  - `projects:write` - Create new projects
  - `organizations:read` - Access org information
- Store access token securely in database

#### 1.2 Database Schema
```sql
-- Store Supabase account connections
CREATE TABLE supabase_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supabase_access_token TEXT ENCRYPTED,
  supabase_refresh_token TEXT ENCRYPTED,
  supabase_user_id TEXT,
  organizations JSONB, -- Cache of user's orgs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store project mappings
CREATE TABLE project_supabase_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_repo_id TEXT NOT NULL,
  supabase_project_id TEXT NOT NULL,
  supabase_project_ref TEXT NOT NULL,
  api_url TEXT NOT NULL,
  anon_key TEXT ENCRYPTED,
  service_role_key TEXT ENCRYPTED,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 2: Project Creation Workflow

#### 2.1 Enhanced Project Creation UI
1. **Step 1**: Project Details (existing)
2. **Step 2**: Integrations (existing)
3. **Step 3**: Supabase Setup (NEW)
   - Option A: Create new Supabase project
   - Option B: Link existing project
   - Option C: Skip (use placeholders)
4. **Step 4**: Review & Create

#### 2.2 Supabase Project Creation
```typescript
// When user selects "Create new Supabase project"
interface SupabaseProjectCreation {
  organizationId: string  // Selected from user's orgs
  name: string           // Default to GitHub repo name
  region: string         // User selects region
  plan: 'free' | 'pro'  // Based on user's subscription
}

// API call to Supabase Management API
POST https://api.supabase.com/v1/projects
Authorization: Bearer {user_supabase_token}
{
  "organization_id": "org_id",
  "name": "my-saas-project",
  "region": "us-east-1",
  "plan": "free"
}
```

#### 2.3 Environment Variable Injection
After Supabase project is created:
1. Wait for project to be ready (poll status)
2. Retrieve project details:
   - API URL
   - Anon Key
   - Service Role Key (if available)
   - Project ID
3. Update template files with actual values
4. Upload to GitHub with real credentials

### Phase 3: Post-Creation Features

#### 3.1 Project Dashboard Enhancement
- Show Supabase project status
- Direct links to Supabase dashboard
- Environment variable viewer (masked)
- One-click database migrations

#### 3.2 Environment File Download
```typescript
// New API endpoint
GET /api/v1/projects/{github_repo_id}/env-file

// Returns .env.local file with actual values
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### 3.3 MCP Configuration
Update `.claude/settings.json` with actual project ID:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp"],
      "env": {
        "SUPABASE_PROJECT_ID": "actual-project-id"
      }
    }
  }
}
```

## Implementation Steps

### Step 1: Supabase OAuth Setup
1. Register 5AM Founder as OAuth app in Supabase
2. Implement OAuth flow in settings page
3. Create database tables for storing connections
4. Add connection status to user profile

### Step 2: Project Creation Integration
1. Add Supabase step to project wizard
2. Implement organization selector
3. Add region selector with latency indicators
4. Implement project creation API calls
5. Add polling for project readiness

### Step 3: Template Enhancement
1. Update template service to handle real values
2. Implement secure credential storage
3. Add credential masking in UI
4. Create download endpoint for env files

### Step 4: Error Handling
1. Handle quota limits (free tier restrictions)
2. Handle region availability
3. Implement retry logic for API calls
4. Provide manual setup fallback

## Security Considerations

1. **Token Storage**
   - Encrypt all tokens at rest
   - Use short-lived access tokens
   - Implement token refresh logic
   - Never expose tokens in logs

2. **API Key Management**
   - Service role keys only available to project owner
   - Implement audit logging
   - Add key rotation reminders
   - Mask keys in UI (show only last 4 chars)

3. **Access Control**
   - Verify GitHub repo ownership
   - Verify Supabase project ownership
   - Implement RLS policies
   - Add rate limiting

## UI/UX Mockups

### Supabase Connection Screen
```
┌─────────────────────────────────────┐
│  Connect Your Supabase Account      │
│                                     │
│  [Supabase Logo]                    │
│                                     │
│  Link your Supabase account to:     │
│  • Auto-create projects             │
│  • Configure environments           │
│  • Enable one-click deployments     │
│                                     │
│  [Connect with Supabase] →          │
│                                     │
│  Skip for now (use placeholders)    │
└─────────────────────────────────────┘
```

### Project Creation - Supabase Step
```
┌─────────────────────────────────────┐
│  Configure Supabase                 │
│                                     │
│  ○ Create new project               │
│    Organization: [Dropdown ▼]       │
│    Region: [US East ▼]              │
│                                     │
│  ○ Link existing project            │
│    Project: [Select project ▼]      │
│                                     │
│  ○ Skip (manual setup later)        │
│                                     │
│  [Previous] [Next]                  │
└─────────────────────────────────────┘
```

### Environment Download Modal
```
┌─────────────────────────────────────┐
│  Download Environment Variables     │
│                                     │
│  Your project is configured!        │
│                                     │
│  📄 .env.local                      │
│  Contains your Supabase credentials │
│                                     │
│  ⚠️ Keep this file secure           │
│  Never commit to version control    │
│                                     │
│  [Download .env.local] [Copy Values]│
└─────────────────────────────────────┘
```

## Future Enhancements

1. **Database Migrations**
   - Auto-run initial schema setup
   - Provide migration templates
   - Track migration history

2. **Monitoring Integration**
   - Show API usage stats
   - Database size monitoring
   - Performance metrics

3. **Team Collaboration**
   - Share projects with team members
   - Role-based access control
   - Collaborative environment management

4. **CI/CD Integration**
   - GitHub Actions secrets setup
   - Vercel environment sync
   - Automated deployments

## Success Metrics

1. **Adoption Rate**
   - % of users connecting Supabase
   - % using auto-creation vs manual

2. **Time Savings**
   - Time from project creation to first deployment
   - Reduction in setup-related support tickets

3. **User Satisfaction**
   - Post-creation survey scores
   - Feature usage analytics

## Technical Requirements

1. **Supabase Management API**
   - API documentation review
   - Rate limit understanding
   - Error response handling

2. **Security Infrastructure**
   - Encryption key management
   - Secure token storage
   - Audit logging system

3. **Performance**
   - Async project creation
   - Progress tracking
   - Timeout handling