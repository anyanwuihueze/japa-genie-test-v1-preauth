import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProofOfFundsClient from './client';

export default async function ProofOfFundsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Try user_profiles first, fallback to profiles
  let userProfile = null;
  
  const { data: profile1 } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (profile1) {
    userProfile = profile1;
  } else {
    const { data: profile2 } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    userProfile = profile2;
  }

  // Create basic profile if doesn't exist
  if (!userProfile) {
    userProfile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    };
  }

  return <ProofOfFundsClient user={user} userProfile={userProfile} />;
}
