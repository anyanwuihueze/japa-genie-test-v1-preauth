// src/app/api/payment-success/route.ts - CREATE THIS FILE
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No user found in payment success handler');
      return NextResponse.redirect(`${requestUrl.origin}/auth?returnTo=/dashboard`);
    }
    
    // Get parameters from URL
    const planType = requestUrl.searchParams.get('plan') || 'pro';
    const returnTo = requestUrl.searchParams.get('returnTo') || '/dashboard';
    
    console.log('🎯 Payment success handler called for user:', user.id);
    console.log('📦 Plan:', planType, 'Redirect to:', returnTo);
    
    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    let subscriptionId = existingSubscription?.id;

    // Only create subscription if it doesn't exist
    if (!existingSubscription) {
      console.log('🆕 Creating new subscription...');
      
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'active',
          plan_type: planType,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to create subscription:', error);
      } else {
        console.log('✅ Subscription created successfully:', subscription);
        subscriptionId = subscription.id;
      }
    } else {
      console.log('📊 Subscription already exists:', existingSubscription);
    }
    
    // Redirect to wherever they wanted to go
    console.log('🔄 Redirecting to:', returnTo);
    return NextResponse.redirect(`${requestUrl.origin}${returnTo}`);
    
  } catch (error) {
    console.error('💥 Payment success error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  }
}