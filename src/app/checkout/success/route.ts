// src/app/api/payment-success/route.ts - COMPLETE VERSION
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(`${origin}/auth?returnTo=/dashboard`);
    }
    
    // Get plan type from URL or use default
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
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to create subscription:', error);
      } else {
        console.log('✅ Subscription created successfully:', subscription);
      }
    } else {
      console.log('📊 Subscription already exists:', existingSubscription);
    }
    
    // Redirect to wherever they wanted to go
    console.log('🔄 Redirecting to:', returnTo);
    return NextResponse.redirect(`${origin}${returnTo}`);
    
  } catch (error) {
    console.error('💥 Payment success error:', error);
    return NextResponse.redirect(`${origin}/dashboard`);
  }
}