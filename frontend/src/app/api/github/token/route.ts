import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Create a function to get the admin client lazily
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required environment variables for Supabase admin client')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get the auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify the token and get user
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Retrieve stored GitHub token
    const { data, error } = await supabaseAdmin
      .from('github_tokens')
      .select('access_token, expires_at, github_username')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return NextResponse.json({ error: 'GitHub token not found' }, { status: 404 })
      }
      console.error('Error retrieving GitHub token:', error)
      return NextResponse.json({ error: 'Failed to retrieve token' }, { status: 500 })
    }

    // Check if token is expired
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at)
      if (expiresAt < new Date()) {
        return NextResponse.json({ error: 'GitHub token expired' }, { status: 401 })
      }
    }

    return NextResponse.json({ 
      token: data.access_token,
      github_username: data.github_username 
    })
  } catch (error) {
    console.error('Error in GitHub token API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const body = await request.json()
    const { access_token, refresh_token, expires_at, github_username } = body

    // Get the auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify the token and get user
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Store or update GitHub token
    const { data, error } = await supabaseAdmin
      .from('github_tokens')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
        github_username,
        expires_at,
        token_type: 'bearer',
        scopes: ['repo', 'user', 'read:org'],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('Error storing GitHub token:', error)
      return NextResponse.json({ error: 'Failed to store token' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in GitHub token API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check if we have the required environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get the auth token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Verify the token and get user
    const supabaseAdmin = getSupabaseAdmin()
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Delete GitHub token
    const { error } = await supabaseAdmin
      .from('github_tokens')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting GitHub token:', error)
      return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in GitHub token API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}