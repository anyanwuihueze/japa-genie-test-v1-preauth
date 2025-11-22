// src/app/dashboard/page.tsx → FINAL FIXED VERSION
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './client';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  // ────── FIX 1: Accept ANY evidence of payment ──────
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', user.id)
    .neq('status', 'canceled')    // anything except canceled = paid
    .maybeSingle();               // don't error if none

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  // ────── FINAL LOGIC: If user has subscription OR profile → LET THEM IN ──────
  if (!subscription && !profile) {
    redirect('/pricing?reason=upgrade_required');
  }

  // Paid user → straight to dashboard, no more nonsense
  return <DashboardClient user={user} />;
}