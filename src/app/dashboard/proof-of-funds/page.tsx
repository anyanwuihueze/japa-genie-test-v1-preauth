import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProofOfFundsClient from './client';

export default async function ProofOfFundsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Try user_profiles first (main table)
  let userProfile = null;
  let needsKYC = false;
  
  const { data: profile1, error: error1 } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (profile1) {
    userProfile = profile1;
    console.log('✅ Found profile in user_profiles');
  } else {
    console.log('⚠️ user_profiles lookup failed:', error1?.message);
    
    // Fallback: Try profiles table
    const { data: profile2, error: error2 } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profile2) {
      userProfile = profile2;
      console.log('✅ Found profile in profiles table');
    } else {
      console.log('⚠️ No profile found in either table');
      needsKYC = true;
    }
  }

  // Create minimal profile if nothing found
  if (!userProfile) {
    userProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      // These will be filled via modal if needed
      destination_country: null,
      visa_type: null,
      country: null
    };
  }

  return (
    <ProofOfFundsClient 
      user={user} 
      userProfile={userProfile} 
      needsKYC={needsKYC}
    />
  );
}
