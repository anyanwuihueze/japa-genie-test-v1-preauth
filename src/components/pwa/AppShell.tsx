'use client';

import { useEffect, useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { JapaGenieLogo } from '@/components/icons';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if first visit
    const hasVisited = localStorage.getItem('japa-first-visit');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('japa-first-visit', 'true');
    }

    // Simulate loading (you can replace with actual loading logic)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle route changes for progress bar
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setIsLoading(false), 300);
    };

    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white transition-all duration-300">
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

      {/* Main Content with fade-in effect */}
      <main className="relative">
        <div className={`pwa-content-fade ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}