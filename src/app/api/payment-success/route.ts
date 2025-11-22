// src/app/api/payment-success/route.ts → FINAL VERSION
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(`${requestUrl.origin}/auth`);

  const planType = requestUrl.searchParams.get('plan') || 'pro';
  const returnTo = requestUrl.searchParams.get('returnTo') || '/dashboard';

  // 1. Create/lookup subscription (loose status check)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .neq('status', 'canceled')
    .maybeSingle();

  if (!sub) {
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      status: 'active',
      plan_type: planType,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // 2. THIS IS THE MISSING PIECE → CREATE PROFILE SO KYC STOPS POPPING
  await supabase
    .from('user_profiles')
    .upsert(
      {
        id: user.id,
        subscription_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  return NextResponse.redirect(`${requestUrl.origin}${returnTo}`);
}