
// src/app/chat/page.tsx - FINAL FIX VERSION
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
  const [initialKycData, setInitialKycData] = useState(null);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('🔍 ChatPageContent: Mounted. Checking for KYC data...');
    
    // Read from URL params once on component mount
    const country = searchParams.get('country');
    const destination = searchParams.get('destination');
    const age = searchParams.get('age');
    const visaType = searchParams.get('visaType');
    const sessionId = searchParams.get('sessionId');

    if (country && destination && age && visaType) {
      console.log('✅ Found KYC data in URL params. Saving to sessionStorage...');
      
      const kycData = {
        country,
        destination,
        age,
        visaType,
        profession: searchParams.get('profession') || undefined,
        userType: searchParams.get('userType') || undefined,
        timelineUrgency: searchParams.get('timelineUrgency') || undefined,
      };
      
      sessionStorage.setItem('kycData', JSON.stringify(kycData));
      if (sessionId) {
        sessionStorage.setItem('kyc_session_id', sessionId);
      }
      
      setInitialKycData(kycData); // Pass data directly to client
      console.log('✅ KYC data ready to be passed to ChatClient:', kycData);
    } else {
      console.log('⚠️ No KYC data found in URL. ChatClient will check sessionStorage.');
    }

    // This effect should only run once to grab initial URL params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function checkOnboarding() {
      if (authLoading || !user) {
        setIsCheckingProfile(false);
        return;
      }

      const onboardingComplete = localStorage.getItem('name_onboarding_complete');
      if (onboardingComplete === 'true') {
        setIsCheckingProfile(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('preferred_name')
          .eq('id', user.id)
          .single();

        if (!profile?.preferred_name) {
          setShowModal(true);
        } else {
          localStorage.setItem('name_onboarding_complete', 'true');
        }
      } catch (error) {
        console.error('Error checking profile for onboarding:', error);
      } finally {
        setIsCheckingProfile(false);
      }
    }

    checkOnboarding();
  }, [user, authLoading, supabase]);

  if (authLoading || isCheckingProfile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && user && (
        <WelcomeNameModal user={user} onComplete={() => setShowModal(false)} />
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
