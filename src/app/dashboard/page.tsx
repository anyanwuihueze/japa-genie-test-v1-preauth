// src/app/dashboard/page.tsx - FIXED VERSION (no subscription prop)
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/chat');
  }

  // ✅ CHECK IF USER HAS COMPLETED KYC
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile or incomplete profile, redirect to KYC
  if (!userProfile || !userProfile.country || !userProfile.destination_country || !userProfile.visa_type) {
    redirect('/kyc?returnTo=/dashboard');
  }

  // ✅ CHECK SUBSCRIPTION STATUS
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  // If no active subscription, redirect to pricing
  if (!subscription) {
    redirect('/pricing?reason=dashboard_access&returnTo=/dashboard');
  }

  // ✅ User has everything: auth + KYC + subscription
  // Pass only user and userProfile (DashboardClient doesn't need subscription)
  return <DashboardClient user={user} userProfile={userProfile} />;
}