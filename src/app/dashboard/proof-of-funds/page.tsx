import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProofOfFundsClient from './client';

export default async function ProofOfFundsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/signin');

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <ProofOfFundsClient userProfile={userProfile || {}} />;
}
