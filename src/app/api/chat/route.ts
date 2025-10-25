import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { question, wishCount, conversationHistory = [] } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const authHeader = request.headers.get('Authorization');

  // VISITOR MODE
  if (!authHeader) {
    try {
      const result = await visaChatAssistant({
        question,
        wishCount: wishCount || 1,
        conversationHistory,
        isSignedIn: false,
      });
      return NextResponse.json({
        answer: result.answer,
        subscriptionTier: 'visitor',
        success: true,
      });
    } catch (error: any) {
      return NextResponse.json({
        answer: "I'm having trouble connecting right now. But I'm Japa Genie—here to help with visa questions!",
        success: true,
      });
    }
  }

  // AUTHENTICATED MODE
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    let { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      const { data: newProfile } = await supabase
        .from('user_profiles')
        .insert({ id: user.id, email: user.email, subscription_tier: 'free', wishes_used: 0, wishes_limit: 3 })
        .select()
        .single();
      profile = newProfile;
    }

    if (profile.subscription_tier === 'free') {
      const { data: canAsk } = await supabase.rpc('can_ask_question', { user_uuid: user.id });
      if (!canAsk) {
        return NextResponse.json(
          { error: `You've used all ${profile.wishes_limit} free wishes`, message: 'Upgrade to premium for unlimited visa guidance', needsUpgrade: true },
          { status: 403 }
        );
      }
    }

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(15);

    await supabase.from('messages').insert({ user_id: user.id, role: 'user', content: question });

    const formattedHistory = (history || []).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));
    const userName = profile.preferred_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Pathfinder';
    const userContext = { name: userName, country: profile.country || undefined, destination: profile.destination || undefined, profession: profile.profession || undefined, visaType: profile.visa_type || undefined };

    // 🔥 FIX: Pass 999999 for signed-in users so AI doesn't format "Wish X/3"
    const result = await visaChatAssistant({
      question,
      wishCount: 999999,  // ✅ No wish formatting
      conversationHistory: formattedHistory,
      userContext,
      isSignedIn: true,
    });

    const aiResponse = result.answer;

    await supabase.from('messages').insert({ user_id: user.id, role: 'assistant', content: aiResponse, model: 'gemini-2.0-flash-exp' });
    if (profile.subscription_tier === 'free') await supabase.rpc('increment_question_count', { user_uuid: user.id });

    return NextResponse.json({ answer: aiResponse, subscriptionTier: profile.subscription_tier, success: true });
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'AI processing failed', success: false }, { status: 500 });
  }
}
