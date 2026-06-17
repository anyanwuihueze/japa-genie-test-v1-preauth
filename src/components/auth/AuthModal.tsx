'use client'

import { useState } from 'react'
import { X, Mail, Loader2, Sparkles, KeyRound, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function AuthModal({ isOpen, onClose, redirectPath }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  if (!isOpen) return null

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      if (data.session) {
        onClose()
        window.location.href = redirectPath || '/dashboard'
      }
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
          {!sent ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-blue-600" size={22} />
                <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              </div>
              <p className="text-center text-gray-500 text-sm mb-6">Enter your email to continue your visa journey</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-gray-400">Works with any email. No password needed.</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <KeyRound className="text-blue-600" size={22} />
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
              </div>
              <p className="text-center text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
              <p className="text-center font-semibold text-blue-600 mb-6">{email}</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full text-center text-3xl tracking-widest py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  {loading ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-3">Didn't get it? Check spam folder.</p>
              <button onClick={() => { setSent(false); setOtp(''); setError('') }} className="w-full text-sm text-blue-600 hover:underline mt-2">
                Try a different email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
