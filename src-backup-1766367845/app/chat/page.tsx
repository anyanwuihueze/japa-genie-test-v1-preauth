// src/app/chat/page.tsx - FIXED WITH SUSPENSE
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { WelcomeNameModal } from '@/components/onboarding/welcome-name-modal';
import ChatClient from './client';
import { useSearchParams } from 'next/navigation';

function ChatPageContent() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const supabase = createClient();
  const searchParams = useSearchParams();

  // KYC DATA READING - ONLY ADDITION
  useEffect(() => {
    const country = searchParams.get('country');
    const destination = searchParams.get('destination');
    const age = searchParams.get('age');
    const visaType = searchParams.get('visaType');
    const profession = searchParams.get('profession');

    if (country && destination && age && visaType) {
      sessionStorage.setItem('kycData', JSON.stringify({
        country,
        destination,
        age,
        visaType,
        profession: profession || undefined
      }));
    }
  }, [searchParams]);
  // END OF KYC DATA READING

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
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('preferred_name')
          .eq('id', user.id)
          .single();

        // ✅ FIXED LINE: Only show modal if no name AND not completed onboarding
        if ((error || !profile?.preferred_name) && !localStorage.getItem('name_onboarding_complete')) {
          setShowModal(true);
        }

        setIsCheckingProfile(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsCheckingProfile(false);
      }
    }

    checkOnboarding();
  }, [user, authLoading, supabase]);

  if (authLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <WelcomeNameModal 
          user={user}
          onComplete={() => setShowModal(false)}
        />
      )}
      <ChatClient />
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}