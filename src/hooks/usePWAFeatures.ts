'use client';

import { useState, useEffect } from 'react';

// Type guard for iOS standalone
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

export function usePWAFeatures() {
  const [isPWA, setIsPWA] = useState(false);
  const [hasNetwork, setHasNetwork] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Check if running as PWA
  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebApp = (navigator as any).standalone === true;
      setIsPWA(isStandalone || isInWebApp);
    };

    checkPWA();

    // Network status
    const handleOnline = () => setHasNetwork(true);
    const handleOffline = () => setHasNetwork(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Native-like page transitions
  const navigateWithTransition = (url: string, callback?: () => void) => {
    setIsLoading(true);
    
    // Add transition class to body
    document.body.classList.add('page-transition-exit');
    
    setTimeout(() => {
      window.location.href = url;
      if (callback) callback();
    }, 300);
  };

  // Pull-to-refresh simulation
  const simulatePullToRefresh = (callback: () => Promise<void>) => {
    return new Promise<void>(async (resolve) => {
      const indicator = document.createElement('div');
      indicator.className = 'pull-to-refresh visible';
      indicator.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-blue-600 font-medium">Refreshing...</span>
        </div>
      `;
      document.body.appendChild(indicator);
      
      await callback();
      
      setTimeout(() => {
        indicator.classList.remove('visible');
        setTimeout(() => indicator.remove(), 300);
        resolve();
      }, 1000);
    });
  };

  return {
    isPWA,
    hasNetwork,
    isLoading,
    navigateWithTransition,
    simulatePullToRefresh,
  };
}
