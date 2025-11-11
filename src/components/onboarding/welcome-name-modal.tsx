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
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredName.trim() || !user) return;

    setLoading(true);
    try {
      console.log('🔄 Saving name to Supabase...');
      
      // Try BOTH table names to ensure it works
      let error = null;
      
      // Try 'profiles' table first
      const result1 = await supabase
        .from('profiles')
        .update({ preferred_name: preferredName.trim() })
        .eq('id', user.id);

      error = result1.error;

      // If 'profiles' fails, try 'user_profiles'
      if (error) {
        console.log('❌ profiles table failed, trying user_profiles...');
        const result2 = await supabase
          .from('user_profiles')
          .update({ preferred_name: preferredName.trim() })
          .eq('id', user.id);
        error = result2.error;
      }

      if (error) throw error;

      console.log('✅ Name saved successfully!');
      localStorage.setItem('name_onboarding_complete', 'true');
      onComplete();
      
    } catch (error) {
      console.error('❌ Error saving name:', error);
      // Even if Supabase fails, close modal and continue
      localStorage.setItem('name_onboarding_complete', 'true');
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={true}>
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
            <Button type="submit" className="w-full" disabled={loading || !preferredName.trim()}>
              {loading ? 'Saving...' : 'Continue to Chat'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}