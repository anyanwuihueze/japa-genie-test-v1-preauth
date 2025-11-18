import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  console.log('🔄 Callback received with code:', !!code);
  
  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(exchangeError.message)}`);
    }
    
    console.log('✅ Session established');
    
    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User error:', userError);
      return NextResponse.redirect(`${origin}/?error=no_user`);
    }
    
    console.log('👤 User ID:', user.id);
    
    // Try to get profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, country, destination_country, visa_type')
      .eq('id', user.id)
      .maybeSingle();
    
    console.log('📋 Profile fetch result:', { profile, error: profileError?.message });
    
    // If no profile exists, CREATE IT NOW
    if (!profile) {
      console.log('📝 No profile found, creating...');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          { 
            id: user.id,
            country: null,
            destination_country: null,
            visa_type: null
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Profile creation error:', insertError);
        // Try to continue anyway
      } else {
        console.log('✅ Profile created:', newProfile);
      }
    }
    
    // Check if profile is complete (has all required fields)
    const isProfileComplete = profile && 
      profile.country && 
      profile.country.trim() !== '' &&
      profile.destination_country && 
      profile.destination_country.trim() !== '' &&
      profile.visa_type && 
      profile.visa_type.trim() !== '';
    
    console.log('✅ Profile complete?', isProfileComplete);
    
    // NEW USER or INCOMPLETE PROFILE → KYC
    if (!isProfileComplete) {
      console.log('🎯 REDIRECT → /kyc (incomplete profile)');
      return NextResponse.redirect(`${origin}/kyc`);
    }
    
    // Check subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status, plan_type')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    console.log('💳 Subscription:', subscription);
    
    // COMPLETE PROFILE, NO SUBSCRIPTION → Chat with bonus
    if (!subscription) {
      console.log('🎯 REDIRECT → /chat?bonus=3');
      return NextResponse.redirect(`${origin}/chat?bonus=3`);
    }
    
    // COMPLETE PROFILE + SUBSCRIPTION → Dashboard
    console.log('🎯 REDIRECT → /dashboard');
    return NextResponse.redirect(`${origin}/dashboard`);
  }
  
  console.log('⚠️ No code, redirecting to home');
  return NextResponse.redirect(`${origin}/`);
}
