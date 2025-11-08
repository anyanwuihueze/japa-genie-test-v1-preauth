'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useChat } from '@/context/ChatContext';
import React, { useState, useEffect } from 'react';

export default function HelpButtonWrapper({ 
  href, 
  children 
}: { 
  href: string; 
  children: React.ReactNode;
}) {
  const { setIsChatOpen } = useChat();
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Always open chat immediately
    setIsChatOpen(true);
    
    // Navigate if needed
    if (pathname !== href) {
      router.push(href);
    }
  };

  // During SSR, render a simple link
  if (!isMounted) {
    return (
      <a 
        href={href}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      >
        {children}
      </a>
    );
  }

  // After hydration, render with click handler
  return (
    <button
      onClick={handleClick}
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
    >
      {children}
    </button>
  );
}
