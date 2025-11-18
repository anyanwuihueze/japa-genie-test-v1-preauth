// src/app/auth/callback/route.ts - FIXED
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
    
    // ✅ CHECK IF USER HAS COMPLETED KYC
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, country, destination_country, visa_type')
        .eq('id', user.id)
        .single();
      
      console.log('🔍 User profile check:', { 
        hasUser: !!user, 
        hasProfile: !!profile,
        profileData: profile 
      });
      
      // ✅ IF NO PROFILE OR INCOMPLETE PROFILE → REDIRECT TO KYC
      if (!profile || !profile.country || !profile.destination_country || !profile.visa_type) {
        console.log('🎯 Redirecting new user to KYC form');
        return NextResponse.redirect(`${origin}/kyc`);
      }
      
      console.log('✅ Returning user with complete profile, going to dashboard');
    }
    
    // Check if user was trying to access a specific page
    const next = requestUrl.searchParams.get('next');
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  
  // Default to dashboard (only for users with complete profiles)
  return NextResponse.redirect(`${origin}/dashboard`);
}