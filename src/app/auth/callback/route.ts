import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('❌ Auth callback error:', error);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`);
    }
    
    console.log('✅ Session established');
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      console.log('👤 User ID:', user.id);
      
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, country, destination_country, visa_type')
        .eq('id', user.id)
        .maybeSingle();
      
      console.log('📋 Profile:', profile);
      console.log('📋 Profile Error:', profileError);
      
      // Check if profile is COMPLETE (all fields filled)
      const isProfileComplete = profile && 
        profile.country && 
        profile.country.trim() !== '' &&
        profile.destination_country && 
        profile.destination_country.trim() !== '' &&
        profile.visa_type && 
        profile.visa_type.trim() !== '';
      
      console.log('✅ Profile complete?', isProfileComplete);
      
      // Build redirect URL
      let redirectUrl: string;
      
      if (!isProfileComplete) {
        console.log('🎯 REDIRECT → /kyc');
        redirectUrl = `${origin}/kyc`;
      } else {
        // Check subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id, status, plan_type')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        
        console.log('💳 Subscription:', subscription);
        
        if (!subscription) {
          console.log('🎯 REDIRECT → /chat?bonus=3');
          redirectUrl = `${origin}/chat?bonus=3`;
        } else {
          console.log('🎯 REDIRECT → /dashboard');
          redirectUrl = `${origin}/dashboard`;
        }
      }
      
      // Create response with proper headers to ensure cookies are set
      const response = NextResponse.redirect(redirectUrl);
      
      // Force cache bypass to ensure fresh session check
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      
      return response;
    }
  }
  
  console.log('⚠️ FALLBACK REDIRECT → /');
  return NextResponse.redirect(`${origin}/`);
}
