'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ChatPanel from './chat-panel';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function HelpButtonWrapper({ href, children }: { href: string; children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsChatOpen(true);
    // You might want to delay navigation slightly to ensure the sheet opens,
    // but for now, we'll let it open while the page navigates.
    // Or, we could use router.push(href) after a small delay.
  };

  return (
    <>
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
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent className="w-full max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Japa Genie Assistant</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <ChatPanel />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
