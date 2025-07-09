# Fixing GitHub Permissions Issue

## The Problem
When you're getting "Insufficient permissions" errors, it's because the GitHub OAuth token doesn't have the necessary scopes to create repositories. This often happens when:
1. The token was cached from a previous authentication
2. The GitHub OAuth app doesn't have the right permissions
3. The user didn't grant the requested permissions during OAuth flow

## Quick Fix Steps

### 1. Clear Everything and Start Fresh
1. Go to `/settings` in your app
2. Click "Sign Out" in the Danger Zone (this clears all tokens and cookies)
3. Clear your browser cache/cookies for your app domain
4. Also clear localStorage by opening browser console and running:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```

### 2. Check Your Supabase GitHub OAuth Settings
1. Go to your Supabase dashboard
2. Navigate to Authentication → Providers → GitHub
3. Make sure the "Authorized scopes" field includes:
   ```
   repo user read:org
   ```
   These are REQUIRED for creating repositories

### 3. Revoke App Access on GitHub
1. Go to https://github.com/settings/applications
2. Find your Supabase app in "Authorized OAuth Apps"
3. Click on it and then click "Revoke access"
4. This ensures a fresh authorization next time

### 4. Re-authenticate with Force Option
1. Go back to your app
2. Either:
   - Go to `/settings` and click "Connect" under GitHub Connection
   - Or try creating a project again - it will prompt for auth
3. When GitHub asks for permissions, make sure you see and approve:
   - Full control of private repositories (repo)
   - Read access to user profile (user)
   - Read access to organization membership (read:org)

## What I've Implemented

### 1. Enhanced Sign Out
The sign out function now:
- Clears Supabase session
- Removes all localStorage items
- Clears all cookies
- Ensures complete token removal

### 2. Force Re-authentication
- Added a settings page at `/settings`
- Shows GitHub connection status
- Has a "Reconnect" button that forces fresh authentication
- Uses `prompt: 'consent'` to force GitHub to show permissions again

### 3. Better Error Handling
- Shows specific error messages for different failure types
- Automatically prompts for re-authentication on 401 errors
- Validates project names before attempting creation

## Debugging Tips

### Check if Token Has Right Permissions
In browser console when on your app:
```javascript
// This will show what provider you're using
const { data: { session } } = await supabase.auth.getSession()
console.log('Provider:', session?.user?.app_metadata?.provider)
console.log('Has token:', !!session?.provider_token)
```

### Manual Token Test
You can test if your token works by using the GitHub test endpoint:
1. Open browser DevTools Network tab
2. Try creating a project
3. Look for the request to `/api/v1/github/test-access`
4. Check the response to see what permissions the token has

## If Nothing Works

1. **Check Supabase Logs**: Go to your Supabase dashboard → Logs → Auth to see if there are any errors

2. **Verify GitHub OAuth App**: 
   - In Supabase, check that your GitHub OAuth is properly configured
   - Make sure the callback URL is correct: `https://[your-project].supabase.co/auth/v1/callback`

3. **Try Incognito/Private Mode**: Sometimes browser extensions or settings interfere with OAuth

4. **Check Browser Console**: Look for any JavaScript errors during the auth flow

## The Nuclear Option
If absolutely nothing works:
1. Delete the user from Supabase Auth dashboard
2. Clear ALL browser data for your domain
3. Revoke the app on GitHub
4. Re-register from scratch

The key is ensuring that when GitHub shows the authorization page, you see ALL the required permissions listed, especially the "repo" scope for creating repositories.