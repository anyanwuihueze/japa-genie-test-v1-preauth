// FILE: src/components/chat/visitor-chat-gate.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VisitorChatGateProps {
  questionsUsed: number;
  maxQuestions: number;
  onEmailSubmit: (email: string) => void;
  onUpgrade: () => void;
}

export default function VisitorChatGate({ 
  questionsUsed, 
  maxQuestions, 
  onEmailSubmit,
  onUpgrade 
}: VisitorChatGateProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsLeft = maxQuestions - questionsUsed;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onEmailSubmit(email);
      // Email submitted successfully, trigger upgrade
      onUpgrade();
    } catch (error) {
      console.error('Email submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (questionsLeft > 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Trial Mode
              </span>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {questionsLeft} questions left
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-primary" />
          Get Your Personalized Visa Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You've experienced the power of Japa Genie! Get unlimited access to:
        </p>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Unlimited AI chat assistance
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Real-time visa insights & cost estimates
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Personalized visa alternatives
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Progress tracking & document checklists
          </li>
        </ul>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !email.trim()}
              className="px-6"
            >
              {isSubmitting ? 'Starting...' : 'Start Free'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No spam. Get your personalized visa assessment in your inbox.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}