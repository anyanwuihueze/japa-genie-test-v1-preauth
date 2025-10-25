'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { WelcomeNameModal } from '@/components/onboarding/welcome-name-modal';
import ChatClient from './client';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkOnboarding() {
      if (authLoading || !user) {
        setIsCheckingProfile(false);
        return;
      }

      // Check if onboarding already completed
      const onboardingComplete = localStorage.getItem('name_onboarding_complete');
      if (onboardingComplete === 'true') {
        setIsCheckingProfile(false);
        return;
      }

      try {
        // Check if user has preferred_name in database
        const { data, error } = await supabase
          .from('user_profiles')
          .select('preferred_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking profile:', error);
          setIsCheckingProfile(false);
          return;
        }

        // Show modal only if preferred_name is null/empty
        if (!data?.preferred_name) {
          setShowModal(true);
        } else {
          // User already has a name, mark as complete
          localStorage.setItem('name_onboarding_complete', 'true');
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
      } finally {
        setIsCheckingProfile(false);
      }
    }

    checkOnboarding();
  }, [user, authLoading, supabase]);

  const handleModalComplete = (name: string) => {
    console.log('✅ User onboarding complete, name:', name);
    setShowModal(false);
  };

  // Show loading while checking
  if (authLoading || isCheckingProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && user && (
        <WelcomeNameModal user={user} onComplete={handleModalComplete} />
      )}
      <ChatClient />
    </>
  );
}
