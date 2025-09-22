'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { siteAssistant } from '@/ai/flows/site-assistant-flow';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

const MAX_FREE_QUESTIONS = 5;

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?",
      sender: 'assistant',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [showUpgradeSheet, setShowUpgradeSheet] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 100);
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (questionsAsked >= MAX_FREE_QUESTIONS) {
      setShowUpgradeSheet(true);
    }
  }, [questionsAsked]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (questionsAsked >= MAX_FREE_QUESTIONS) {
        setShowUpgradeSheet(true);
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await siteAssistant({ question: inputValue });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.answer,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setQuestionsAsked(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend/CRM
    localStorage.setItem('prospectEmail', userEmail);
    setShowUpgradeSheet(false);
    // Redirect to the main chat page after signup
    window.location.href = '/chat';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-card text-card-foreground rounded-bl-none shadow-sm border'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card rounded-2xl px-4 py-2 shadow-sm border rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || questionsAsked >= MAX_FREE_QUESTIONS}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || questionsAsked >= MAX_FREE_QUESTIONS}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {MAX_FREE_QUESTIONS - questionsAsked > 0 
            ? `${MAX_FREE_QUESTIONS - questionsAsked} questions remaining.`
            : "You've reached the question limit."}
        </p>
      </div>

      <Sheet open={showUpgradeSheet} onOpenChange={setShowUpgradeSheet}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                    <Sparkles className="text-amber-500" />
                    Unlock Your Visa Journey
                </SheetTitle>
                <SheetDescription>
                    You've asked all the right questions! To get unlimited, personalized visa guidance from Japa Genie, enter your email below.
                </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleEmailSubmit} className="py-8 space-y-4">
                <Input 
                    type="email"
                    placeholder="you@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
                <Button type="submit" className="w-full">
                    Unlock Your 3 Visa Wishes
                </Button>
            </form>
             <p className="text-xs text-center text-muted-foreground">
                You'll be redirected to the full AI assistant to start your journey.
            </p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
