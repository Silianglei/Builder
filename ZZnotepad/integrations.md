# Integration Permission Tracking System

## Overview

5AM Founder tracks user permissions for various third-party services to enable seamless SaaS project generation. Currently, only GitHub integration is fully implemented, with placeholders for future integrations.

## Current Implementation Status

### ✅ GitHub Integration (Fully Implemented)

#### Database Schema
The `github_tokens` table in Supabase stores GitHub OAuth tokens:

```sql
github_tokens:
  - id: uuid (primary key)
  - user_id: uuid (foreign key to auth.users, unique)
  - github_username: text
  - access_token: text (encrypted)
  - refresh_token: text (nullable)
  - token_type: text (default: 'bearer')
  - expires_at: timestamp with time zone
  - scopes: text[] (array of granted permissions)
  - created_at: timestamp with time zone
  - updated_at: timestamp with time zone
```

#### Required OAuth Scopes
- `repo` - Full control of private repositories
- `user` - Read access to profile data
- `read:org` - Read access to organization membership

#### Permission Flow

1. **Initial Authentication**:
   - User authenticates via Supabase Auth with GitHub provider
   - **CRITICAL**: "Return provider tokens" must be enabled in Supabase Dashboard
   - Provider tokens are captured from the session

2. **Token Storage**:
   - Frontend calls `/api/github/token` (POST) to store tokens
   - Tokens are persisted in `github_tokens` table
   - Row Level Security (RLS) ensures users can only access their own tokens

3. **Token Retrieval**:
   - `getGitHubToken()` in `frontend/src/lib/github.ts`:
     - First checks current Supabase session for provider tokens
     - Falls back to stored tokens via `/api/github/token` (GET)
     - Returns null if no valid token found

4. **Token Validation**:
   - Backend endpoint `/api/v1/github/test-access` validates:
     - Token validity with GitHub API
     - OAuth scopes availability
     - Returns user info and permission status

5. **Token Usage**:
   - All GitHub API requests use `X-GitHub-Token` header
   - Backend validates token on each request
   - Checks expiration and required scopes

#### UI/UX Integration

**Settings Page** (`/settings`):
- Visual connection status (green/red indicator)
- "Connect/Reconnect" button for re-authentication
- Lists required permissions
- Shows GitHub username when connected

**Dashboard**:
- Dropdown shows GitHub as "connected" in integrations tab
- Quick access to GitHub-related features

**API Endpoints**:
- `/api/github/token` - Store/retrieve GitHub tokens (Next.js route)
- `/api/v1/github/test-access` - Validate GitHub access (FastAPI)
- `/api/v1/github/repositories` - List/create repositories

### 🚧 Supabase Integration (Planned)

**Current State**:
- UI toggles exist in project creation flow
- Template files contain placeholders for Supabase credentials
- No backend implementation

**Planned Implementation** (from `docs/workers/[4]supabase.md`):
```sql
supabase_connections:
  - user_id: uuid (primary key)
  - access_token: text (encrypted)
  - refresh_token: text (encrypted)
  - organizations: jsonb (array of orgs)
  - default_org_id: text
  - project_mappings: jsonb
```

### 🚧 Google OAuth (Planned)

**Current State**:
- Listed as authentication provider option
- No token storage or permission tracking
- Would follow similar pattern to GitHub

### 🚧 Stripe Integration (Planned)

**Current State**:
- Toggle available in project creation
- No actual Stripe API integration
- Would require webhook endpoints and API key storage

## Implementation Patterns

### Security Best Practices

1. **Token Storage**:
   - All tokens stored encrypted in database
   - Never exposed in frontend code
   - Transmitted only via secure headers

2. **Access Control**:
   - Row Level Security (RLS) on all token tables
   - Users can only read/write their own tokens
   - Service role key required for admin operations

3. **Token Validation**:
   - Validate on every use, not just on storage
   - Check expiration timestamps
   - Verify required scopes are present

### Adding New Integrations

To add a new integration (e.g., Stripe), follow this pattern:

1. **Create Database Table**:
```sql
CREATE TABLE service_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own tokens" ON service_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON service_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON service_tokens
  FOR UPDATE USING (auth.uid() = user_id);
```

2. **Create API Routes**:
   - Next.js route handler for token CRUD operations
   - FastAPI endpoints for service-specific operations
   - Token validation endpoint

3. **Update Frontend**:
   - Add connection status to Settings page
   - Create service-specific helper functions
   - Update project creation flow

4. **Add to UI**:
   - Settings page connection card
   - Dashboard integration status
   - Project builder toggle

## Current Limitations

1. **Single Integration**: Only GitHub is functional
2. **No Token Refresh**: Expired tokens require manual reconnection
3. **Limited Scope Management**: Can't request additional scopes without full re-auth
4. **No Bulk Operations**: Each service requires separate authentication

## Future Enhancements

1. **Unified Integration Dashboard**: Single view for all connected services
2. **Automatic Token Refresh**: Background token renewal
3. **Scope Upgrade Flow**: Request additional permissions as needed
4. **Integration Health Checks**: Periodic validation of all connections
5. **Webhook Management**: Centralized webhook configuration for all services

## Developer Notes

### Testing Integrations

1. **GitHub Token Testing**:
```bash
# Check token validity
curl -X GET http://localhost:8000/api/v1/github/test-access \
  -H "X-GitHub-Token: YOUR_TOKEN"
```

2. **Frontend Token Retrieval**:
```javascript
import { getGitHubToken } from '@/lib/github'

const token = await getGitHubToken()
console.log('Has GitHub access:', !!token)
```

### Common Issues

1. **"Provider tokens not returned"**:
   - Enable "Return provider tokens" in Supabase Dashboard
   - Under Authentication > Providers > GitHub > Advanced Settings

2. **Token not persisting**:
   - Check SUPABASE_SERVICE_ROLE_KEY is set
   - Verify RLS policies are correct
   - Ensure user is authenticated

3. **403 Forbidden on GitHub API**:
   - Token missing required scopes
   - User needs to re-authenticate with correct permissions

### Environment Variables

Required for GitHub integration:
```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Backend (for token storage)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## References

- GitHub OAuth Scopes: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
- Supabase Auth Providers: https://supabase.com/docs/guides/auth/social-login/auth-github
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security