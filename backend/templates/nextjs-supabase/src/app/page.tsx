import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to <span className="text-blue-600">{{PROJECT_NAME}}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your Next.js app with Supabase is ready!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}