'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MessageCircle } from 'lucide-react';
import ChatPanel from '@/components/layout/chat-panel';

export default function VisitorChatPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-transform hover:scale-110"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Japa Genie Assistant</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <ChatPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
