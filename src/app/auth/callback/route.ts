import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Progress creation function - ADD THIS
async function createUserProgress(userId: string) {
  const supabase = await createClient();
  
  try {
    console.log('🎯 Creating progress records for user:', userId);
    
    // Create initial progress records - SILENTLY IGNORE ERRORS
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
    .select('id, country, destination_country, visa_type')
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
        visa_type: null
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Profile creation error:', insertError);
    } else {
      profile = newProfile;
      console.log('✅ Profile created');
      
      // 🎯 SAFE PROGRESS CREATION - ADDED HERE
      await createUserProgress(user.id);
    }
  }
  
  // Check if profile is complete - FIXED LOGIC
  const isProfileComplete = profile && 
    profile.country && 
    profile.country.trim() !== '' &&
    profile.destination_country && 
    profile.destination_country.trim() !== '' &&
    profile.visa_type && 
    profile.visa_type.trim() !== '';
  
  console.log('✅ Profile complete?', isProfileComplete);
  
  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  console.log('💳 Subscription:', subscription);
  
  // 🎯 FIXED FLOW LOGIC:
  if (!isProfileComplete) {
    console.log('🎯 REDIRECT → /kyc (incomplete profile)');
    return NextResponse.redirect(`${origin}/kyc`);
  }
  
  if (isProfileComplete && !subscription) {
    console.log('🎯 REDIRECT → /chat?bonus=3 (complete profile, no subscription)');
    return NextResponse.redirect(`${origin}/chat?bonus=3`);
  }
  
  if (isProfileComplete && subscription) {
    console.log('🎯 REDIRECT → /dashboard (complete profile + subscription)');
    return NextResponse.redirect(`${origin}/dashboard`);
  }
  
  // Fallback
  console.log('🎯 REDIRECT → /kyc (fallback)');
  return NextResponse.redirect(`${origin}/kyc`);
}