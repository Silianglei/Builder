import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Debug info
    const debugInfo: any = {
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    }

    // Try to get user session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError) {
      debugInfo.userError = userError.message
    } else {
      debugInfo.userId = user?.id
      debugInfo.userEmail = user?.email
      debugInfo.providers = user?.app_metadata?.providers || []
      debugInfo.provider = user?.app_metadata?.provider
    }

    // Try to check github_tokens table if we have service role key
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && user?.id) {
      const supabaseAdmin = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // Check if table exists
      const { data: tables, error: tableError } = await supabaseAdmin
        .from('github_tokens')
        .select('user_id')
        .limit(0)

      if (tableError) {
        debugInfo.tableError = tableError.message
        debugInfo.tableErrorCode = tableError.code
      } else {
        debugInfo.tableExists = true

        // Try to get token
        const { data: tokenData, error: tokenError } = await supabaseAdmin
          .from('github_tokens')
          .select('user_id, github_username, created_at, updated_at, expires_at')
          .eq('user_id', user.id)
          .single()

        if (tokenError) {
          debugInfo.tokenError = tokenError.message
          debugInfo.tokenErrorCode = tokenError.code
        } else {
          debugInfo.hasStoredToken = true
          debugInfo.tokenData = {
            githubUsername: tokenData.github_username,
            createdAt: tokenData.created_at,
            updatedAt: tokenData.updated_at,
            expiresAt: tokenData.expires_at,
            isExpired: tokenData.expires_at ? new Date(tokenData.expires_at) < new Date() : false
          }
        }
      }
    }

    return NextResponse.json({ debug: debugInfo })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}