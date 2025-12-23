'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { JapaGenieLogo } from '@/components/icons';
import SimpleHeader from '@/components/SimpleHeader';
import SkeletonLoader from './SkeletonLoader';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  
  // Get skeleton type based on route
  const getSkeletonType = () => {
    if (pathname === '/') return 'full';
    if (pathname.includes('/chat')) return 'card';
    if (pathname.includes('/progress')) return 'text';
    return 'card';
  };

  // Handle launch animation (client-side only)
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('japa-first-visit');
    if (isFirstVisit) {
      setShowLaunch(true);
      setTimeout(() => {
      document.body.style.overflow = "auto";
        setShowLaunch(false);
        localStorage.setItem('japa-first-visit', 'true');
      }, 1500);
    }
    
    const handleComplete = () => setTimeout(() => setIsLoading(false), 300);
    handleComplete();
  }, []);

  return (
    <div className="min-h-screen bg-white transition-all duration-300">
      {/* Progress indicator for route changes */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-purple-600 z-50 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-purple-600 animate-progress-bar"></div>
        </div>
      )}

      {/* Launch animation (client-side only) */}
      {showLaunch && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 pwa-launch-logo">
          <JapaGenieLogo className="w-32 h-32 animate-pulse" />
        </div>
      )}

      {/* App Shell Header */}
      <div className="sticky top-0 z-40">
        <SimpleHeader />
      </div>

      {/* Main Content */}
      <main className="relative">
        {/* Show skeleton while loading */}
        {isLoading ? (
          <div className="p-4 md:p-6">
            <SkeletonLoader 
              type={getSkeletonType()} 
              count={2}
              className="max-w-6xl mx-auto"
            />
          </div>
        ) : (
          /* Show actual content with fade-in */
          <div className="pwa-content-fade">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
