import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🚀 CALLBACK STARTED - DEBUG VERSION');
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  console.log('URL:', request.url);
  console.log('Code exists:', !!code);
  
  try {
    if (!code) {
      return NextResponse.redirect(`${origin}/?error=no_code`);
    }

    console.log('🔧 Creating Supabase client...');
    const supabase = await createClient();
    console.log('✅ Supabase client created');

    console.log('🔄 Exchanging code for session...');
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError);
      return NextResponse.redirect(`${origin}/?error=exchange_${exchangeError.message}`);
    }
    console.log('✅ Session exchange successful');

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User error:', userError);
      return NextResponse.redirect(`${origin}/?error=no_user`);
    }
    
    console.log('✅ User found:', user.id);
    
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
        return NextResponse.redirect(`${origin}/?error=profile_create_${insertError.message}`);
      } else {
        console.log('✅ Profile created:', newProfile);
      }
    }
    
    return NextResponse.redirect(`${origin}/kyc`);
    
  } catch (error: any) {
    console.error('💥 UNEXPECTED ERROR:', error);
    return NextResponse.redirect(`${origin}/?error=unexpected_${error.message}`);
  }
}
