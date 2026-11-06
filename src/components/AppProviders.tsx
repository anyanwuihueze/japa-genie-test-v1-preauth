'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { AuthProvider } from '@/lib/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import AppShell from '@/components/pwa/AppShell';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import FloatingChatButton from '@/components/layout/floating-chat-button';
import RegisterServiceWorker from '@/components/pwa/RegisterServiceWorker';
import { Toaster } from '@/components/ui/toaster';

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Keep the training sandbox independent of application services.
  if (pathname?.startsWith('/training-demo')) {
    return <>{children}</>;
  }

  // Preserve the existing Japa Genie application providers.
  return (
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
  );
}
