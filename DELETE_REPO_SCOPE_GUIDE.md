# Repository Deletion Permission Guide

## The Issue
You can create repositories but not delete them because:
- **Creating repos**: Requires `repo` scope (which you have)
- **Deleting repos**: Requires `delete_repo` scope (which you don't have)

## Why This Happens
The `delete_repo` scope is considered more dangerous than `repo`, so GitHub keeps them separate. This is a safety feature to prevent accidental deletion of important repositories.

## Options to Handle This

### Option 1: Add delete_repo Scope (If You Need It)
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Providers → GitHub
3. Update the "Authorized Scopes" field to:
   ```
   repo user read:org delete_repo
   ```
4. Save the changes
5. Sign out from your app completely
6. Go to https://github.com/settings/applications and revoke the app
7. Sign in again - GitHub will show the new permission request

### Option 2: Keep It As Is (Recommended for Most Users)
- You can create repositories through the app
- Delete repositories manually on GitHub when needed
- This is actually safer as it prevents accidental deletions

### Option 3: Alternative Approach
Instead of deleting repositories, you could:
- Archive them on GitHub (keeps the code but marks as inactive)
- Make them private if you don't want them public
- Use GitHub's built-in repository management

## Security Note
The `delete_repo` scope is powerful and should only be granted if you really need programmatic deletion. For most applications, it's better to handle deletions manually through GitHub's interface as an extra safety measure.

## What the App Does Now
- Shows a clear error message when you try to delete
- Explains that additional permissions are needed
- Still allows you to create and manage repositories
- Provides a link to view the repository on GitHub where you can delete it manually

This is working as designed - the separation of create and delete permissions is a GitHub security feature, not a bug in the application.