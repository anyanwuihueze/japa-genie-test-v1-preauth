'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function PWANavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  
  useEffect(() => {
    // This only runs on client, avoids hydration mismatch
    setCanGoBack(window.history.length > 1);
  }, []);
  
  const isHomePage = pathname === '/';
  
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Visa Matchmaker', path: '/visa-matchmaker' },
    { name: 'Document Check', path: '/document-check' },
    { name: 'Chat', path: '/chat' },
    { name: 'Progress', path: '/progress' },
    { name: 'Experts', path: '/experts' },
  ];

  return (
    <>
      {/* Main Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-2 shadow-lg md:hidden">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            disabled={!canGoBack}
            className={`flex-1 mx-1 ${!canGoBack ? 'opacity-30' : ''}`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className={`flex-1 mx-1 ${isHomePage ? 'bg-gray-100' : ''}`}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
          
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="flex-1 mx-1"
          >
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      
      {/* Quick Menu Modal */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-xl z-50 p-4 animate-slide-up">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push(link.path);
                    setShowMenu(false);
                  }}
                  className={`justify-start ${pathname === link.path ? 'bg-blue-50' : ''}`}
                >
                  {link.name}
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-gray-500 text-center">
                Japa Genie PWA • Swipe to navigate
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
