'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface WelcomeNameModalProps {
  user: User;
  onComplete: (name: string) => void;
}

export function WelcomeNameModal({ user, onComplete }: WelcomeNameModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Pre-fill with OAuth name or email username
    const defaultName = 
      user.user_metadata?.full_name || 
      user.user_metadata?.name || 
      user.email?.split('@')[0] || 
      '';
    setName(defaultName);
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ preferred_name: name.trim() })
        .eq('id', user.id);

      if (error) throw error;

      // Mark onboarding complete in localStorage
      localStorage.setItem('name_onboarding_complete', 'true');
      
      onComplete(name.trim());
    } catch (error) {
      console.error('Error saving preferred name:', error);
      alert('Failed to save name. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Mark as skipped so modal doesn't show again
    localStorage.setItem('name_onboarding_complete', 'true');
    onComplete(name || user.email?.split('@')[0] || 'Pathfinder');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to Japa Genie!
            </h2>
            <p className="text-sm text-gray-600">
              You're signed in as: <span className="font-medium">{user.email}</span>
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="preferred-name" className="block text-sm font-medium text-gray-700 mb-2">
              What should we call you?
            </label>
            <Input
              id="preferred-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your preferred name"
              className="text-base"
              maxLength={50}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-2">
              This helps us personalize your visa journey and build trust as we work together on your application.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={!name.trim() || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save & Continue →'
              )}
            </Button>

            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg transition-all"
            >
              Skip for now
            </Button>
          </div>

          {/* Encouragement Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💡 Adding your name makes your visa journey feel more personal.{' '}
              <button
                onClick={() => document.getElementById('preferred-name')?.focus()}
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                It only takes 2 seconds
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
