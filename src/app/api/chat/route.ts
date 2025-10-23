import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Parse request body ONCE
  const body = await request.json();
  const { question, wishCount, conversationHistory = [] } = body;
  
  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  // VISITOR MODE (No Auth)
  if (authError || !user) {
    try {
      const result = await visaChatAssistant({
        question,
        wishCount: wishCount || 1,
        conversationHistory, // NOW receives history from frontend
        isSignedIn: false,
      });

      return NextResponse.json({
        answer: result.answer,
        questionsRemaining: null,
        questionsUsed: 0,
        questionsLimit: 3,
        subscriptionTier: 'visitor',
        success: true
      });
    } catch (error) {
      console.error('Visitor chat error:', error);
      return NextResponse.json({
        answer: "I'm having trouble connecting right now. But I'm Japa Genie—here to help with visa questions. Try asking about France, Canada, UK visas!",
        success: true
      });
    }
  }

  // AUTHENTICATED MODE
  let profile = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile.data) {
    const { data: newProfile } = await supabase
      .from('user_profiles')
      .insert({ 
        id: user.id, 
        email: user.email, 
        subscription_tier: 'free', 
        wishes_used: 0, 
        wishes_limit: 3 
      })
      .select()
      .single();
    profile.data = newProfile;
  }

  // Check wish limit for free users
  const { data: canAsk } = await supabase.rpc('can_ask_question', { user_uuid: user.id });
  if (!canAsk) {
    return NextResponse.json(
      {
        error: `You've used all ${profile.data.wishes_limit} free wishes`,
        message: 'Upgrade to premium for unlimited visa guidance',
        questionsUsed: profile.data.wishes_used,
        questionsLimit: profile.data.wishes_limit,
        needsUpgrade: true
      },
      { status: 403 }
    );
  }

  // Get conversation history from database
  const { data: history } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .limit(15);

  // Save user message
  const { data: userMessage } = await supabase
    .from('messages')
    .insert({ user_id: user.id, role: 'user', content: question })
    .select()
    .single();

  // Format conversation history for visa-chat-assistant
  const formattedHistory = (history || []).map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content
  }));

  // Get user profile data for context
  const userContext = {
    name: user.user_metadata?.name || user.email?.split('@')[0],
    country: profile.data.country || undefined,
    destination: profile.data.destination || undefined,
    profession: profile.data.profession || undefined,
    visaType: profile.data.visa_type || undefined,
  };

  try {
    // Call the powerful visa-chat-assistant
    const result = await visaChatAssistant({
      question,
      wishCount: wishCount || 1,
      conversationHistory: formattedHistory,
      userContext,
      isSignedIn: true,
    });

    const aiResponse = result.answer;

    // Save assistant message
    const { data: assistantMessage } = await supabase
      .from('messages')
      .insert({ 
        user_id: user.id, 
        role: 'assistant', 
        content: aiResponse, 
        model: 'gemini-2.0-flash-exp' 
      })
      .select()
      .single();

    // Increment wish count for free users
    if (profile.data.subscription_tier === 'free') {
      await supabase.rpc('increment_question_count', { user_uuid: user.id });
    }

    const updatedWishesUsed = profile.data.wishes_used + 
      (profile.data.subscription_tier === 'free' ? 1 : 0);
    const wishesRemaining = profile.data.subscription_tier === 'free' 
      ? profile.data.wishes_limit - updatedWishesUsed 
      : null;

    return NextResponse.json({
      answer: aiResponse,
      userMessageId: userMessage.id,
      assistantMessageId: assistantMessage.id,
      questionsRemaining: wishesRemaining,
      questionsUsed: updatedWishesUsed,
      questionsLimit: profile.data.wishes_limit,
      subscriptionTier: profile.data.subscription_tier,
      success: true
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        error: 'Temporary AI error. Try again or upgrade for priority support.',
        success: false 
      },
      { status: 500 }
    );
  }
}
