import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { FloatingChatButton } from '@/components/layout/floating-chat-button'
import LayoutSwitcher from '@/components/layout/LayoutSwitcher'
import { AuthProvider } from '@/lib/AuthContext'

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-sans antialiased h-full bg-background text-foreground m-0 p-0">
        <AuthProvider>
          <LayoutSwitcher>{children}</LayoutSwitcher>
          <Toaster />
          <FloatingChatButton />
        </AuthProvider>
      </body>
    </html>
  )
}
