'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from './supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: (redirectPath?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initAuth = async () => {
      try {
        // FORCE refresh session from cookies
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        console.log('🔐 Session check:', session ? 'Logged in' : 'Not logged in')
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('�� Auth state changed:', event)
      setUser(session?.user ?? null)
      
      // Force reload on sign in to ensure UI updates
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in, forcing UI update')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async (redirectPath?: string): Promise<void> => {
    try {
      console.log('🚀 Starting Google sign in...')
      
      let callbackUrl = `${window.location.origin}/auth/callback`
      if (redirectPath) {
        callbackUrl += `?next=${encodeURIComponent(redirectPath)}`
      }
      
      console.log('🌐 Callback URL:', callbackUrl)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        alert(`Login failed: ${error.message}`)
        throw error
      }
      
      console.log('✅ OAuth initiated')
    } catch (err) {
      console.error('💥 Error:', err)
      alert('An unexpected error occurred during login')
      throw err
    }
  }

  const signOut = async () => {
    console.log('👋 Signing out...')
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/' // Force redirect to home
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
