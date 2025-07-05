export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGitHub: () => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<{ error?: string }>
}