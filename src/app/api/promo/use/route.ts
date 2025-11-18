import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Please log in to use promo codes' }, { status: 401 });
    }

    const { promoCode } = await request.json();

    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code required' }, { status: 400 });
    }

    console.log('🎯 Checking promo code:', promoCode, 'for user:', user.id);

    // Check if promo code exists and is valid
    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase())
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (promoError || !promo) {
      return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 400 });
    }

    // Check if promo code has reached max uses
    if (promo.uses_count >= promo.max_uses) {
      return NextResponse.json({ error: 'Promo code has reached maximum uses' }, { status: 400 });
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json({ error: 'You already have an active subscription' }, { status: 400 });
    }

    // Calculate subscription end date (duration_days from now)
    const periodEnd = new Date(Date.now() + promo.duration_days * 24 * 60 * 60 * 1000);

    // Create subscription using promo code
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        status: 'active',
        plan_type: promo.plan_type,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
        promo_code_id: promo.id,
        is_trial: true
      })
      .select()
      .single();

    if (subError) {
      console.error('❌ Subscription creation error:', subError);
      return NextResponse.json({ error: 'Failed to activate promo code' }, { status: 500 });
    }

    // Increment promo code uses
    await supabase
      .from('promo_codes')
      .update({ uses_count: promo.uses_count + 1 })
      .eq('id', promo.id);

    console.log(`✅ Promo code ${promoCode} activated for user ${user.id}`);
    console.log(`📅 Access granted until: ${periodEnd.toISOString()}`);

    return NextResponse.json({ 
      success: true, 
      message: `Promo code activated! You now have ${promo.duration_days} days of premium access.`,
      plan: promo.plan_type,
      expires_at: periodEnd.toISOString(),
      duration_days: promo.duration_days
    });

  } catch (error: any) {
    console.error('💥 Promo code error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
