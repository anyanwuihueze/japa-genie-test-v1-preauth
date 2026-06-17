'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from './supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signInWithGoogle: (redirectPath?: string) => Promise<void>
  signInWithEmail: (email: string, password: string, isSignUp?: boolean) => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const MAX_RETRIES = 5
const INITIAL_DELAY_MS = 200

async function getSessionWithRetry(
  supabase: ReturnType<typeof createClient>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_DELAY_MS
): Promise<{ session: Session | null; user: User | null }> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error(`getSession error (attempt ${attempt + 1}/${maxRetries}):`, error)
    }
    if (session?.user) {
      console.log(`Session found on attempt ${attempt + 1}`)
      return { session, user: session.user }
    }
    if (attempt < maxRetries - 1) {
      const delay = initialDelay * Math.pow(2, attempt)
      console.log(`No session yet, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  console.log('No session found after all retries')
  return { session: null, user: null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refreshSession = useCallback(async () => {
    console.log('Manually refreshing session...')
    const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('Session refresh error:', error)
    }
    if (refreshedSession?.user) {
      console.log('Session refreshed successfully')
      setSession(refreshedSession)
      setUser(refreshedSession.user)
    } else {
      const { session: currentSession } = await getSessionWithRetry(supabase, 3, 100)
      if (currentSession?.user) {
        setSession(currentSession)
        setUser(currentSession.user)
      }
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true
    let authSubscription: { unsubscribe: () => void } | null = null

    const initAuth = async () => {
      try {
        console.log('Initializing auth...')
        const { session: initialSession, user: initialUser } = await getSessionWithRetry(supabase)
        if (!mounted) return
        if (initialSession && initialUser) {
          console.log('Initial session found:', initialUser.email)
          setSession(initialSession)
          setUser(initialUser)
        } else {
          console.log('No initial session found')
          setSession(null)
          setUser(null)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setUser(null)
          setSession(null)
          setLoading(false)
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event)
      if (!mounted) return
      switch (event) {
        case 'INITIAL_SESSION':
          console.log('INITIAL_SESSION detected')
          if (currentSession?.user) {
            setSession(currentSession)
            setUser(currentSession.user)
          }
          setLoading(false)
          break
        case 'SIGNED_IN':
          console.log('User signed in, updating UI')
          if (currentSession?.user) {
            setSession(currentSession)
            setUser(currentSession.user)
          }
          setLoading(false)
          break
        case 'SIGNED_OUT':
          console.log('User signed out')
          setSession(null)
          setUser(null)
          setLoading(false)
          break
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed')
          if (currentSession?.user) {
            setSession(currentSession)
            setUser(currentSession.user)
          }
          break
        case 'USER_UPDATED':
          console.log('User updated')
          if (currentSession?.user) {
            setUser(currentSession.user)
          }
          break
        default:
          if (currentSession?.user) {
            setSession(currentSession)
            setUser(currentSession.user)
          }
      }
    })

    authSubscription = subscription

    return () => {
      mounted = false
      if (authSubscription) {
        authSubscription.unsubscribe()
      }
    }
  }, [supabase])

  const signInWithGoogle = async (redirectPath?: string): Promise<void> => {
    try {
      console.log('Starting Google sign in...')
      const kycSessionId = sessionStorage.getItem('kyc_session_id')
      console.log('KYC Session ID found:', kycSessionId)
      let stateParams = ''
      if (redirectPath) stateParams += `next=${encodeURIComponent(redirectPath)}`
      if (kycSessionId) {
        if (stateParams) stateParams += '&'
        stateParams += `kyc_session_id=${encodeURIComponent(kycSessionId)}`
      }
      let callbackUrl = `${window.location.origin}/auth/callback`
      if (redirectPath) callbackUrl += `?next=${encodeURIComponent(redirectPath)}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          ...(stateParams ? { queryParams: { state: stateParams } } : {}),
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string, isSignUp?: boolean): Promise<void> => {
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error) {
      console.error('Email auth error:', error)
      throw error
    }
  }

  const sendMagicLink = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (error) {
      console.error('Magic link error:', error)
      throw error
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user, session, loading,
    isAuthenticated: !!user,
    signInWithGoogle, signInWithEmail,
    sendMagicLink, signOut, refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
