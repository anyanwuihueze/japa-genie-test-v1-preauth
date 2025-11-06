import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { FloatingChatButton } from '@/components/layout/floating-chat-button'
import LayoutSwitcher from '@/components/layout/LayoutSwitcher'
import { AuthProvider } from '@/lib/AuthContext'
import { ChatProvider } from '@/context/ChatContext' // Import ChatProvider

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Japa Genie: Your AI-Powered Visa Guide',
  description:
    'Stop getting scammed by visa agents. Start getting real results today with Japa Genie. AI-powered visa guidance, eligibility checks, and personalized roadmaps.',
}

// FIXED VIEWPORT - allows zoom and proper scaling
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg ' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>"
        />
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
