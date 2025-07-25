export function AuthLoading({ message = "Authenticating..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="relative">
        {/* Modern minimal spinner */}
        <div className="w-12 h-12 border-2 border-gray-800 border-t-gray-400 rounded-full animate-spin" />
        
        {/* Optional message */}
        {message && (
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}