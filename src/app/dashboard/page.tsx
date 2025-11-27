import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  // Add retry logic to handle propagation delay
  let profile = null;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data?.country && data?.destination_country) {
      profile = data;
      break;
    }
    
    attempts++;
    if (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Only redirect if genuinely incomplete after retries
  if (!profile?.country) {
    redirect('/kyc-profile');
  }

  return <DashboardClient user={user} />;
}