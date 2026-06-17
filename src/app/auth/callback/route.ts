import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function createUserProgress(userId: string) {
  const supabase = await createClient();
  try {
    console.log('Creating progress records for user:', userId);
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([
        { user_id: userId, step_name: 'onboarding_complete', completed: false, created_at: new Date().toISOString() },
        { user_id: userId, step_name: 'kyc_complete', completed: false, created_at: new Date().toISOString() },
        { user_id: userId, step_name: 'first_chat', completed: false, created_at: new Date().toISOString() },
        { user_id: userId, step_name: 'payment_complete', completed: false, created_at: new Date().toISOString() }
      ]);
    if (progressError) {
      console.log('Progress creation failed (non-critical):', progressError.message);
    } else {
      console.log('User progress records created successfully');
    }
  } catch (error) {
    console.log('Progress creation error (non-critical):', error);
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const origin = requestUrl.origin;
  console.log('Auth callback started');

  const state = requestUrl.searchParams.get('state');
  let kycSessionId = null;
  let nextPath = '/dashboard';

  if (state) {
    const params = new URLSearchParams(state);
    kycSessionId = params.get('kyc_session_id');
    const nextParam = params.get('next');
    if (nextParam) {
      nextPath = decodeURIComponent(nextParam);
      console.log('Next path from state:', nextPath);
    }
  }

  const queryNext = requestUrl.searchParams.get('next');
  if (queryNext) {
    nextPath = decodeURIComponent(queryNext);
    console.log('Next path from query:', nextPath);
  }

  console.log('Extracted from OAuth:', { kycSessionId, nextPath });
  const supabase = await createClient();

  if (code) {
    console.log('Exchanging OAuth code for session...');
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error('Exchange error:', exchangeError);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(exchangeError.message)}`);
    }
    console.log('Waiting for cookie propagation...');
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log('Cookie propagation complete');
  }

  if (token_hash && type) {
    console.log(`Verifying ${type} with token_hash...`);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (verifyError) {
      console.error('Verification error:', verifyError);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(verifyError.message)}`);
    }
    console.log('Waiting for cookie propagation after magic link verification...');
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log('Cookie propagation complete');
  }

  if (!code && !token_hash) {
    console.log('No code or token_hash provided');
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  console.log('Session established');
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('User error:', userError);
    return NextResponse.redirect(`${origin}/?error=no_user`);
  }
  console.log('User ID:', user.id);

  let { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, country, destination_country, visa_type, age, user_type, timeline_urgency')
    .eq('id', user.id)
    .maybeSingle();
  console.log('Profile:', profile);

  if (!profile) {
    console.log('Creating new profile...');
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{
        id: user.id, country: null, destination_country: null, visa_type: null,
        age: null, user_type: null, timeline_urgency: null
      }])
      .select()
      .single();
    if (insertError) {
      console.error('Profile creation error:', insertError);
    } else {
      profile = newProfile;
      console.log('Profile created');
      await createUserProgress(user.id);
    }
  }

  let isProfileComplete = profile &&
    profile.country && profile.country.trim() !== '' &&
    profile.destination_country && profile.destination_country.trim() !== '' &&
    profile.visa_type && profile.visa_type.trim() !== '' &&
    profile.age &&
    profile.user_type && String(profile.user_type).trim() !== '' &&
    profile.timeline_urgency;

  console.log('Profile complete?', isProfileComplete, {
    country: !!profile?.country, destination: !!profile?.destination_country,
    visa_type: !!profile?.visa_type, age: !!profile?.age,
    user_type: !!profile?.user_type, timeline: !!profile?.timeline_urgency
  });

  if (kycSessionId && !isProfileComplete) {
    console.log('Attempting KYC transfer from session:', kycSessionId);
    const { data: kycData } = await supabase
      .from('kyc_sessions')
      .select('country, destination_country, age, visa_type, profession, user_type, timeline_urgency, budget')
      .eq('session_id', kycSessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (kycData) {
      console.log('Found KYC data to transfer:', kycData);
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          country: kycData.country, destination_country: kycData.destination_country,
          age: kycData.age, visa_type: kycData.visa_type, profession: kycData.profession,
          user_type: kycData.user_type, timeline_urgency: kycData.timeline_urgency,
          kyc_completed: true, kyc_last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      if (!updateError) {
        console.log('KYC transferred to user profile');
        const { data: updatedProfile } = await supabase
          .from('user_profiles')
          .select('id, country, destination_country, visa_type, age, user_type, timeline_urgency')
          .eq('id', user.id)
          .single();
        if (updatedProfile) {
          profile = updatedProfile;
          isProfileComplete = profile &&
            profile.country && profile.country.trim() !== '' &&
            profile.destination_country && profile.destination_country.trim() !== '' &&
            profile.visa_type && profile.visa_type.trim() !== '' &&
            profile.age &&
            profile.user_type && String(profile.user_type).trim() !== '' &&
            profile.timeline_urgency;
          console.log('Profile after KYC transfer complete?', isProfileComplete);
        }
      } else {
        console.error('KYC transfer failed:', updateError);
      }
    } else {
      console.log('No KYC data found for session:', kycSessionId);
    }
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  console.log('Subscription:', subscription);

  if (!isProfileComplete) {
    console.log('REDIRECT -> /kyc (incomplete profile, no KYC transfer)');
    return NextResponse.redirect(`${origin}/kyc`);
  }
  console.log('REDIRECT ->', nextPath, '(profile complete)');
  return NextResponse.redirect(`${origin}${nextPath}`);
}
