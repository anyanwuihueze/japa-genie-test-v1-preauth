'use client';

import { useEffect, useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { AppFooter } from '@/components/layout/app-footer';
import { PWANavigation } from '@/components/pwa/PWANavigation';
import { JapaGenieLogo } from '@/components/icons';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('japa-first-visit');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('japa-first-visit', 'true');
      
      // FORCE HIDE SPLASH AFTER 3 SECONDS AS BACKUP
      const forceHideTimer = setTimeout(() => {
        setIsFirstVisit(false);
      }, 3000);
      
      return () => clearTimeout(forceHideTimer);
    }

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Launch Animation - Only on first visit */}
      {isFirstVisit && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 pwa-launch-logo animate-fade-out">
          <JapaGenieLogo className="w-32 h-32 animate-pulse" />
        </div>
      )}

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-40">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-progress-bar" />
        </div>
      )}

      {/* App Shell Header */}
      <div className="sticky top-0 z-40">
        <SimpleHeader />
      </div>

      {/* Main Content - FLEX GROW TO PUSH FOOTER DOWN */}
      <main className="flex-grow pb-16"> {/* Added padding for bottom nav */}
        <div className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {children}
        </div>
      </main>

      {/* PWA Navigation Bar (Mobile only) */}
      <PWANavigation />

      {/* App Footer */}
      <AppFooter />
    </div>
  );
}
