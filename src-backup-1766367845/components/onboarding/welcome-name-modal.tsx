// src/components/onboarding/welcome-name-modal.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

interface WelcomeNameModalProps {
  user: any;
  onComplete: () => void;
}

export function WelcomeNameModal({ user, onComplete }: WelcomeNameModalProps) {
  const [preferredName, setPreferredName] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredName.trim() || !user) return;

    setLoading(true);
    
    // SAVE TO SUPABASE - FEED THE AGENT
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ preferred_name: preferredName.trim() })
        .eq('id', user.id);

      if (error) {
        console.error('Supabase save error:', error);
        // CONTINUE ANYWAY - DON'T BLOCK USER
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      // CONTINUE ANYWAY - DON'T BLOCK USER
    }
    
    // GUARANTEED CLOSE - ALWAYS EXECUTES
    localStorage.setItem('name_onboarding_complete', 'true');
    setOpen(false);
    onComplete();
    setLoading(false);
  };

  const handleClose = () => {
    // STILL MARK AS COMPLETE BUT DON'T SAVE NAME
    localStorage.setItem('name_onboarding_complete', 'true');
    setOpen(false);
    onComplete();
  };

  if (!user || !open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome! Let's Get Personal 🎉</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold">What should we call you?</h2>
            <p className="text-sm text-gray-600">You're signed in as: <span className="font-medium">{user.email}</span></p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredName" className="text-sm font-medium">Preferred Name</Label>
              <Input
                id="preferredName"
                type="text"
                placeholder="Enter your preferred name"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full"
                autoFocus
              />
              <p className="text-xs text-gray-500">This is how I'll address you in our conversations</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">Skip</Button>
              <Button type="submit" className="flex-1" disabled={loading || !preferredName.trim()}>
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}