import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Progress creation function
async function createUserProgress(userId: string) {
  const supabase = await createClient();
  
  try {
    console.log('🎯 Creating progress records for user:', userId);
    
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([
        { 
          user_id: userId, 
          step_name: 'onboarding_complete', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'kyc_complete', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'first_chat', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'payment_complete', 
          completed: false,
          created_at: new Date().toISOString()
        }
      ]);

    if (progressError) {
      console.log('⚠️ Progress creation failed (non-critical):', progressError.message);
    } else {
      console.log('✅ User progress records created successfully');
    }
  } catch (error) {
    console.log('⚠️ Progress creation error (non-critical):', error);
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  console.log('🚀 Auth callback started');
  
  if (!code) {
    console.log('❌ No code provided');
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

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
  
  // Get or create profile
  let { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, country, destination_country, visa_type, age, user_type, timeline_urgency')
    .eq('id', user.id)
    .maybeSingle();
  
  console.log('📋 Profile:', profile);
  
  // If no profile, create one
  if (!profile) {
    console.log('📝 Creating new profile...');
    
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{ 
        id: user.id,
        country: null,
        destination_country: null,
        visa_type: null,
        age: null,
        user_type: null,
        timeline_urgency: null
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Profile creation error:', insertError);
    } else {
      profile = newProfile;
      console.log('✅ Profile created');
      
      await createUserProgress(user.id);
    }
  }
  
  // ✅ Check if profile is complete - ALL KYC FIELDS
  const isProfileComplete = profile && 
    profile.country && 
    profile.country.trim() !== '' &&
    profile.destination_country && 
    profile.destination_country.trim() !== '' &&
    profile.visa_type && 
    profile.visa_type.trim() !== '' &&
    profile.age && 
    profile.user_type &&  
    profile.timeline_urgency;
  
  console.log('✅ Profile complete?', isProfileComplete, {
    country: !!profile?.country,
    destination: !!profile?.destination_country, 
    visa_type: !!profile?.visa_type,
    age: !!profile?.age,
    user_type: !!profile?.user_type,
    timeline: !!profile?.timeline_urgency
  });
  
  // Check subscription (for logging only)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  console.log('💳 Subscription:', subscription);
  
  // ✅ FIXED FLOW LOGIC - SIMPLER!
  if (!isProfileComplete) {
    console.log('🎯 REDIRECT → /kyc (incomplete profile)');
    return NextResponse.redirect(`${origin}/kyc`);
  }
  
  // ✅ Profile complete? ALWAYS go to dashboard!
  console.log('🎯 REDIRECT → /dashboard (profile complete)');
  return NextResponse.redirect(`${origin}/dashboard`);
}