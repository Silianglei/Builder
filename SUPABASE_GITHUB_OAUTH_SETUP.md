# Supabase GitHub OAuth Configuration Guide

## The Core Issue
The "Insufficient permissions" error occurs when the GitHub OAuth token doesn't have the `repo` scope, which is required to create repositories.

## Step-by-Step Fix

### 1. Check Your Current Supabase Configuration

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Click on **GitHub**

### 2. Update GitHub OAuth Settings

In the GitHub provider settings, make sure you have:

```
Client ID: [your-github-oauth-app-client-id]
Client Secret: [your-github-oauth-app-client-secret]
Authorized Scopes: repo user read:org
```

**IMPORTANT**: The "Authorized Scopes" field MUST include `repo`. This is what's likely missing!

### 3. Update Your GitHub OAuth App (if needed)

If you created your own GitHub OAuth app:

1. Go to https://github.com/settings/developers
2. Click on your OAuth App
3. Make sure the **Authorization callback URL** is:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

### 4. Use the Debug Tool

1. Go to `/settings` in your app
2. If in development mode, you'll see a "GitHub OAuth Debug Info" section
3. Click "Run Debug Check"
4. Look for the "GitHub OAuth Scopes" section
5. Check if `repo` is listed in the current scopes

### 5. Force Re-authentication

After updating Supabase settings:

1. Sign out completely (use the "Sign Out" button in Danger Zone)
2. Clear your browser cache/cookies
3. Go to https://github.com/settings/applications and revoke your app
4. Sign in again with GitHub
5. **IMPORTANT**: When GitHub asks for permissions, make sure you see:
   - ✅ Full control of private repositories
   - ✅ Access to your email addresses
   - ✅ Read your organization membership

## What the Debug Info Shows

When you run the debug check, you'll see:

1. **Supabase Session**: Shows if you're authenticated and with which provider
2. **GitHub Token**: Shows if a token exists
3. **Backend API Test**: Tests if the backend can use your token
4. **GitHub OAuth Scopes**: Shows the ACTUAL scopes your token has

The most important part is the "GitHub OAuth Scopes" section. It should show:
```
Current scopes: repo, user, read:org
```

If it shows anything else (or nothing), that's the problem!

## Common Issues

### Issue 1: No scopes shown
This means Supabase isn't configured to request any scopes. Add `repo user read:org` to the Authorized Scopes field.

### Issue 2: Only showing "user" scope
This means the `repo` scope wasn't requested. Update Supabase settings and re-authenticate.

### Issue 3: Token exists but can't create repos
The token was created with old permissions. You need to revoke and re-authenticate.

## Testing After Fix

1. Try creating a simple test repository
2. Check the debug info to confirm you have the right scopes
3. If it works, you're all set!

## If Nothing Works

1. Create a new GitHub OAuth App from scratch
2. Use these settings:
   - Application name: Your App Name
   - Homepage URL: https://your-app.com
   - Authorization callback URL: https://[your-project-ref].supabase.co/auth/v1/callback
3. Update Supabase with the new Client ID and Secret
4. Make sure to add `repo user read:org` to Authorized Scopes

Remember: The key is that the `repo` scope MUST be requested by Supabase and granted by the user!