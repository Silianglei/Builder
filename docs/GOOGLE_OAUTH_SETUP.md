# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for your 5AM Founder application.

## Step 1: Google Cloud Console Setup

### 1.1 Create or Select a Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown in the top navigation bar
3. Click "New Project" or select an existing project
4. Name it something like "5AM Founder" and click "Create"

### 1.2 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Enabled APIs**
2. Click **+ ENABLE APIS AND SERVICES**
3. Search for "Google+ API"
4. Click on it and then click **ENABLE**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace account)
3. Click **CREATE**
4. Fill in the required fields:
   - **App name**: 5AM Founder
   - **User support email**: Your email
   - **App logo**: Optional (upload your logo if you have one)
   - **Application home page**: http://localhost:3000 (for development)
   - **Application privacy policy**: Your privacy policy URL (or use http://localhost:3000/privacy for now)
   - **Application terms of service**: Your terms URL (or use http://localhost:3000/terms for now)
   - **Authorized domains**: localhost (for development)
   - **Developer contact information**: Your email
5. Click **SAVE AND CONTINUE**

### 1.4 Add Scopes
1. Click **ADD OR REMOVE SCOPES**
2. Select these scopes:
   - `openid`
   - `email`
   - `profile`
3. Click **UPDATE** and then **SAVE AND CONTINUE**

### 1.5 Add Test Users (if in testing mode)
1. If your app is in testing mode, add test users here
2. Add your email and any other test emails
3. Click **SAVE AND CONTINUE**

## Step 2: Create OAuth 2.0 Credentials

### 2.1 Create OAuth Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application** as the application type
4. Name it "5AM Founder Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL when ready (e.g., `https://5amfounder.com`)
6. Add Authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - Your Supabase callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Your production callback URL when ready
7. Click **CREATE**

### 2.2 Save Your Credentials
After creation, you'll see a modal with:
- **Client ID**: Copy this (looks like: xxxxx.apps.googleusercontent.com)
- **Client Secret**: Copy this (keep it secure!)

## Step 3: Configure Supabase

### 3.1 Add Google Provider
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list and click to expand
5. Toggle **Enable Google provider** to ON
6. Fill in:
   - **Client ID**: Paste your Google OAuth Client ID
   - **Client Secret**: Paste your Google OAuth Client Secret
7. Copy the **Redirect URL** shown (you'll need this for Google Console)
8. Click **Save**

### 3.2 Update Google Console with Supabase Redirect
1. Go back to Google Cloud Console
2. Go to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add the Supabase redirect URL to **Authorized redirect URIs**
5. Click **SAVE**

## Step 4: Test Your Setup

1. Start your development server: `make dev`
2. Go to http://localhost:3000/auth
3. Click "Continue with Google"
4. You should see Google's sign-in page
5. After signing in, you should be redirected back to your app

## Troubleshooting

### Common Issues

1. **"Access blocked" error**
   - Make sure you've added your domain to authorized domains
   - Check that redirect URIs match exactly (including http/https)

2. **"Invalid redirect_uri" error**
   - The redirect URI in your app must match exactly what's in Google Console
   - Check for trailing slashes

3. **"App is not verified" warning**
   - This is normal for development
   - For production, you'll need to submit your app for verification

### Production Checklist

Before going to production:
- [ ] Update all localhost URLs to your production domain
- [ ] Add production redirect URIs in Google Console
- [ ] Update Supabase environment variables in production
- [ ] Consider app verification if you'll have many users
- [ ] Use HTTPS for all production URLs

## Environment Variables

Make sure your `.env` file has these Supabase variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

That's it! Google OAuth should now be working in your application.