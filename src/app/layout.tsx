import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { FloatingChatButton } from '@/components/layout/floating-chat-button'
import LayoutSwitcher from '@/components/layout/LayoutSwitcher'
import { AuthProvider } from '@/lib/AuthContext'
import { ChatProvider } from '@/context/ChatContext'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Japa Genie: Your AI-Powered Visa Guide',
  description: 'Stop getting scammed by visa agents. Start getting real results today with Japa Genie.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Japa Genie',
  },
}

// PWA VIEWPORT - NO ZOOM
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <ChatProvider>
            <LayoutSwitcher>{children}</LayoutSwitcher>
            <Toaster />
            <FloatingChatButton />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
