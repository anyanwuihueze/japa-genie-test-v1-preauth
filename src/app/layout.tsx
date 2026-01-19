import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/AuthContext'
import { ChatProvider } from '@/context/ChatContext'
import AppShell from '@/components/pwa/AppShell'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import FloatingChatButton from '@/components/layout/floating-chat-button'
import RegisterServiceWorker from '@/components/pwa/RegisterServiceWorker'

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
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico?v=3" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <AppShell>
              {children}
            </AppShell>
            <div className="hidden md:block">
              <FloatingChatButton />
            </div>
            <InstallPrompt />
            <RegisterServiceWorker />
          </ChatProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
