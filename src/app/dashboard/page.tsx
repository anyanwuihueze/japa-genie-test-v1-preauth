import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/chat');
  }

  // FETCH USER PROFILE ON SERVER (NEW)
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // PASS BOTH USER AND USERPROFILE TO CLIENT (NEW)
  return <DashboardClient user={user} userProfile={userProfile} />;
}