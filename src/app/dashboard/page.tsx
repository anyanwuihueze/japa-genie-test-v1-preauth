import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('country, destination_country')
    .eq('id', user.id)
    .single();

  if (!profile?.country || !profile?.destination_country) {
    redirect('/kyc-profile');
  }

  return <DashboardClient user={user} />;
}
