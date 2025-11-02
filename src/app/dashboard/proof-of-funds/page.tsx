import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProofOfFundsClient from './client';

export default async function ProofOfFundsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/chat');
  }
  
  return <ProofOfFundsClient user={user} />;
}
