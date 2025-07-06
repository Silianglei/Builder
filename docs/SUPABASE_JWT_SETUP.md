# 🔐 Supabase JWT Secret Configuration

## How to Get Your JWT Secret

1. **Log in to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click on **Settings** in the sidebar
   - Go to **API** section

3. **Find JWT Settings**
   - Scroll down to **JWT Settings**
   - You'll see **JWT Secret** (hidden by default)
   - Click the **Reveal** button
   - Copy the entire JWT secret

4. **Update Your .env File**
   ```bash
   JWT_SECRET_KEY=your-copied-jwt-secret-here
   ```

## Important Notes

### JWT Secret vs Anon Key
- **JWT Secret**: Used to VERIFY tokens (keep this SECRET!)
- **Anon Key**: Used in frontend to make requests (safe to expose)

### Security Best Practices
1. **Never commit JWT secret to git**
2. **Use different secrets for dev/staging/production**
3. **Rotate secrets if compromised**
4. **Store securely in environment variables**

### Token Structure
Supabase JWTs contain:
```json
{
  "aud": "authenticated",
  "exp": 1234567890,
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "iat": 1234567890
}
```

### Troubleshooting

**"Invalid token" errors:**
- Verify JWT_SECRET_KEY is correctly set
- Check if token has expired
- Ensure audience is "authenticated"

**"Token verification failed":**
- JWT secret might be incorrect
- Token might be malformed
- Check algorithm (should be HS256)

### Example Backend Verification
```python
import jwt

# This is what the backend does
payload = jwt.decode(
    token,
    settings.JWT_SECRET_KEY,  # From .env
    algorithms=["HS256"],
    audience="authenticated"
)
```