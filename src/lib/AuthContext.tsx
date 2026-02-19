'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from './supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: (redirectPath?: string) => Promise<void>
  signInWithEmail: (email: string, password: string, isSignUp?: boolean) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) console.error('Error getting session:', error)
        console.log('🔐 Session check:', session ? 'Logged in' : 'Not logged in')
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setLoading(false)
      }
    }
    initAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event)
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN') console.log('✅ User signed in, forcing UI update')
    })
    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async (redirectPath?: string): Promise<void> => {
    try {
      console.log('🚀 Starting Google sign in...')
      const kycSessionId = sessionStorage.getItem('kyc_session_id')
      console.log('📋 KYC Session ID found:', kycSessionId)
      let stateParams = ''
      if (redirectPath) stateParams += `next=${encodeURIComponent(redirectPath)}`
      if (kycSessionId) {
        if (stateParams) stateParams += '&'
        stateParams += `kyc_session_id=${encodeURIComponent(kycSessionId)}`
      }
      let callbackUrl = `${window.location.origin}/auth/callback`
      if (redirectPath) callbackUrl += `?next=${encodeURIComponent(redirectPath)}`
      console.log('🌐 Callback URL:', callbackUrl)
      console.log('🔑 State params:', stateParams)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
          ...(stateParams && { state: stateParams })
        },
      })
      if (error) {
        console.error('❌ Sign in error:', error)
        alert(`Login failed: ${error.message}`)
        throw error
      }
      console.log('✅ OAuth initiated with KYC context')
    } catch (err) {
      console.error('💥 Error:', err)
      alert('An unexpected error occurred during login')
      throw err
    }
  }

  const signInWithEmail = async (email: string, password: string, isSignUp = false): Promise<void> => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: any) {
      alert(`Email login failed: ${err.message}`)
      throw err
    }
  }

  const signOut = async () => {
    console.log('👋 Signing out...')
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
