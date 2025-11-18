// src/app/auth/callback/route.ts - UPDATED WITH SUBSCRIPTION LOGIC
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`);
    }
    
    // ✅ CHECK IF USER HAS COMPLETED KYC AND SUBSCRIPTION
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, country, destination_country, visa_type')
        .eq('id', user.id)
        .single();
      
      // ✅ CHECK SUBSCRIPTION STATUS
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, status, plan_type')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      console.log('🔍 Auth callback check:', { 
        hasUser: !!user, 
        hasProfile: !!profile,
        hasActiveSubscription: !!subscription,
        profileComplete: profile && profile.country && profile.destination_country && profile.visa_type
      });
      
      // ✅ DECISION LOGIC
      if (!profile || !profile.country || !profile.destination_country || !profile.visa_type) {
        console.log('🎯 Redirecting new user to KYC form');
        return NextResponse.redirect(`${origin}/kyc`);
      } else if (!subscription) {
        console.log('🎯 User has KYC but no subscription - redirect to chat with bonus wishes');
        return NextResponse.redirect(`${origin}/chat?bonus=3`);
      } else {
        console.log('✅ User has KYC and subscription - redirect to dashboard');
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
    
    // Check if user was trying to access a specific page
    const next = requestUrl.searchParams.get('next');
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  
  // Default fallback (should rarely hit this)
  return NextResponse.redirect(`${origin}/dashboard`);
}