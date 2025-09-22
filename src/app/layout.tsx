import type { Metadata } from 'next'
import './globals.css' // Styles from globals.css will apply
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { FloatingChatButton } from '@/components/layout/floating-chat-button'
import LayoutSwitcher from '@/components/layout/LayoutSwitcher'

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

              export default function RootLayout({ children }: { children: React.ReactNode }) {
                return (
                    <html lang="en" className={`${inter.variable} h-full`}>
                          <body className="font-sans antialiased h-full bg-background text-foreground m-0 p-0">
                                  <LayoutSwitcher>{children}</LayoutSwitcher>
                                          <Toaster />
                                                  <FloatingChatButton />
                                                        </body>
                                                            </html>
                                                              )
                                                              }
                                                              