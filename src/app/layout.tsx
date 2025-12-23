import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/AuthContext'
import { ChatProvider } from '@/context/ChatContext'
import AppShell from '@/components/pwa/AppShell' // ← NEW IMPORT
import FloatingChatButton from '@/components/layout/floating-chat-button'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Japa Genie',
  description: 'Your AI-Powered Visa Guide',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            {/* AppShell now handles SimpleHeader AND skeleton loading */}
            <AppShell>
              {children}
            </AppShell>
            {/* Floating button hidden on mobile, shown on desktop */}
            <div className="hidden md:block">
              <FloatingChatButton />
            </div>
          </ChatProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}