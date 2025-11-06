
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useChat } from '@/context/ChatContext'; // Import the useChat hook
import { cn } from '@/lib/utils';
import React from 'react';

export default function HelpButtonWrapper({ href, children }: { href: string; children: React.ReactNode }) {
  const { setIsChatOpen } = useChat();
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsChatOpen(true);
    // Navigate to the href after opening the chat
    router.push(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
        pathname === href && "text-primary"
      )}
    >
      {children}
    </a>
  );
}
