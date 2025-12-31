'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const checkAlreadyInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(false);
      }
    };

    checkAlreadyInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install');
      setIsVisible(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleIOSInstructions = () => {
    alert('To install Japa Genie:\n1. Tap the Share button\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in top right');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-primary p-2 rounded-lg">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Install Japa Genie</h3>
              <p className="text-sm text-gray-600">Get the app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isIOS ? (
          <Button
            onClick={handleIOSInstructions}
            className="w-full bg-gradient-to-r from-amber-400 to-primary text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Add to Home Screen
          </Button>
        ) : (
          <Button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-amber-400 to-primary text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        )}
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Works offline • Fast loading • No ads
        </p>
      </div>
    </div>
  );
}
