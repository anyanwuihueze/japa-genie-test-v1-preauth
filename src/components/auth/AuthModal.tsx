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
              {/* Google auth hidden — logic intact for future use */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
