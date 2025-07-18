import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-4">You're signed in as:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">{user.email}</p>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">User ID:</h3>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{user.id}</p>
          </div>

          <form action="/api/auth/signout" method="POST" className="mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}