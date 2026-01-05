'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
}

const MAX_FREE_QUESTIONS = 999;
const SESSION_KEY = 'chat_session_id';
const QUESTIONS_KEY = 'chat_questions_count';
const EMAIL_KEY = 'user_email_captured';

export default function ChatPanel() {
  // Generate or retrieve session ID (persists across page refreshes)
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  });

  // Track questions across refreshes
  const [questionsAsked, setQuestionsAsked] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(QUESTIONS_KEY);
    return stored ? parseInt(stored) : 0;
  });

  // Check if email already captured
  const [emailCaptured, setEmailCaptured] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(EMAIL_KEY) === 'true';
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: emailCaptured 
        ? "Welcome back! I can answer any questions about Japa Genie's features, pricing, and how to use the app. For visa-specific guidance, click 'Start Your Journey' to use our full AI assistant."
        : "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?",
      sender: 'assistant',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeSheet, setShowUpgradeSheet] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Improved auto-scroll function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update localStorage whenever questions change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(QUESTIONS_KEY, questionsAsked.toString());
    }
  }, [questionsAsked]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // If email NOT captured and hit limit, show upgrade sheet
    if (!emailCaptured && questionsAsked >= MAX_FREE_QUESTIONS) {
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
      const response = await fetch('/api/visitor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages,
          sessionId: sessionId,
          emailCaptured: emailCaptured,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Only increment question count if email NOT captured
      if (!emailCaptured) {
        setQuestionsAsked((prev) => prev + 1);
      }
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
    
    if (typeof window !== 'undefined') {
      // Mark email as captured
      localStorage.setItem(EMAIL_KEY, 'true');
      localStorage.setItem('prospect_email', userEmail);
      
      // Reset question count (unlimited general questions now)
      localStorage.setItem(QUESTIONS_KEY, '0');
      setQuestionsAsked(0);
    }
    
    setEmailCaptured(true);
    setShowUpgradeSheet(false);
    
    // Show success message
    const successMessage: Message = {
      id: Date.now().toString(),
      content: "Great! You now have unlimited access to ask about Japa Genie's features and pricing. For personalized visa guidance, click 'Start Your Journey' at the top to use the full AI assistant.",
      sender: 'assistant',
    };
    setMessages((prev) => [...prev, successMessage]);
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
          {/* Invisible element at the bottom for auto-scroll */}
          <div ref={messagesEndRef} />
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
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {emailCaptured ? (
            "Unlimited general questions available ✨"
          ) : (
            `${MAX_FREE_QUESTIONS - questionsAsked} ${MAX_FREE_QUESTIONS - questionsAsked === 1 ? 'question' : 'questions'} remaining`
          )}
        </p>
      </div>

      <Sheet open={showUpgradeSheet} onOpenChange={setShowUpgradeSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="text-amber-500" />
              Unlock Unlimited Questions
            </SheetTitle>
            <SheetDescription>
              You've used your 5 free questions! Enter your email to continue asking about Japa Genie's features, pricing, and services.
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
              Continue Asking Questions
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground">
            For personalized visa guidance, you'll need to create a full account.
          </p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
