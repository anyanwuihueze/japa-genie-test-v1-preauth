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
  themeColor: '#0F172A',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Japa Genie',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <AppShell>
              {children}
            </AppShell>
            {/* Floating button hidden on mobile, shown on desktop */}
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
