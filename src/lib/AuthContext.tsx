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
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      console.log('🚀 Starting Google sign in...')
      
      // Build callback URL with redirect info
      let callbackUrl = `${window.location.origin}/auth/callback`
      if (redirectPath) {
        callbackUrl += `?next=${encodeURIComponent(redirectPath)}`
      }
      
      console.log('🌐 Redirect URL will be:', callbackUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
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
      } else {
        console.log('✅ Sign in initiated successfully:', data)
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err)
      alert('An unexpected error occurred during login')
    }
  }

  const signOut = async () => {
    console.log('👋 Signing out...')
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
