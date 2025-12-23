import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/AuthContext'
import SimpleHeader from '@/components/SimpleHeader'
import FloatingChatButton from '@/components/layout/floating-chat-button'
import { ChatProvider } from '@/context/ChatContext' // ← ADD THIS IMPORT

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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {/* WRAP with ChatProvider - fixes the error */}
          <ChatProvider>
            <SimpleHeader />
            <main>{children}</main>
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
