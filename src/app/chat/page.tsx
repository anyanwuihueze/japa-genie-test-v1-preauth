// src/app/chat/page.tsx - FIXED VERSION
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

  // 🚨 FIXED: Read KYC from URL params OR sessionStorage
  useEffect(() => {
    console.log('🔍 Chat page checking for KYC data...');
    
    // Check URL params first (from KYC redirect)
    const country = searchParams.get('country');
    const destination = searchParams.get('destination');
    const age = searchParams.get('age');
    const visaType = searchParams.get('visaType');
    const profession = searchParams.get('profession');
    const sessionId = searchParams.get('sessionId');

    if (country && destination && age && visaType) {
      console.log('✅ Found KYC in URL params, saving to sessionStorage');
      
      const kycData = {
        country,
        destination,
        age,
        visaType,
        profession: profession || undefined,
        userType: searchParams.get('userType') || undefined,
        timelineUrgency: searchParams.get('timelineUrgency') || undefined
      };
      
      sessionStorage.setItem('kycData', JSON.stringify(kycData));
      
      // Save session ID if provided
      if (sessionId) {
        sessionStorage.setItem('kyc_session_id', sessionId);
      }
      
      console.log('🎯 KYC data saved from URL:', kycData);
    } else {
      // Check if KYC already exists in sessionStorage
      const existingKYC = sessionStorage.getItem('kycData');
      if (existingKYC) {
        console.log('✅ KYC already in sessionStorage:', JSON.parse(existingKYC));
      } else {
        console.log('⚠️ No KYC data found in URL or sessionStorage');
      }
    }
  }, [searchParams]);

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