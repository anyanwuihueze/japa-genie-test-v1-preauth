'use client'

import { useState } from 'react'
import { X, Mail, Loader2, Sparkles, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function AuthModal({ isOpen, onClose, redirectPath }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  if (!isOpen) return null

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const kycSessionId = sessionStorage.getItem('kyc_session_id')
      let stateParams = ''
      if (redirectPath) stateParams += `next=${encodeURIComponent(redirectPath)}`
      if (kycSessionId) {
        if (stateParams) stateParams += '&'
        stateParams += `kyc_session_id=${encodeURIComponent(kycSessionId)}`
      }
      const callbackUrl = `${window.location.origin}/auth/callback${redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ''}`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
          ...(stateParams && { state: stateParams })
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback${redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ''}`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <X size={20} />
        </button>
        <div className="p-8">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your inbox!</h2>
              <p className="text-gray-600">We sent a magic link to</p>
              <p className="font-semibold text-blue-600">{email}</p>
              <p className="text-sm text-gray-500">Click the link in the email to sign in instantly. No password needed.</p>
              <p className="text-xs text-gray-400">Didn't get it? Check your spam folder.</p>
              <button onClick={() => { setSent(false); setEmail('') }} className="text-sm text-blue-600 hover:underline mt-2">
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-blue-600" size={22} />
                <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              </div>
              <p className="text-center text-gray-500 text-sm mb-6">Sign in or create an account to continue your visa journey</p>
              <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={loading || !email} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
              </form>
              <p className="mb-6 text-center text-xs text-gray-400">Works with Gmail, Yahoo, Hotmail or any email. No password needed.</p>
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
              </div>
              <div className="space-y-3">
                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium text-gray-600">Continue with Google</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
