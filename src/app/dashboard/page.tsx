// src/app/dashboard/page.tsx - FIXED VERSION
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // ✅ ONLY check subscription - NO KYC redirect
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  // If no active subscription, redirect to pricing
  if (!subscription) {
    redirect('/pricing?reason=dashboard_access');
  }

  // ✅ User is authenticated and has subscription - show dashboard
  return <DashboardClient user={user} />;
}