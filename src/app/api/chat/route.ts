import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Please sign in', needsAuth: true },
      { status: 401 }
    );
  }

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

  const { data: canAsk } = await supabase.rpc('can_ask_question', {
    user_uuid: user.id
  });

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

  const { question, wishCount } = await request.json();
  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  const { data: history } = await supabase
    .from('messages')
    .select('role, content, created_at')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .limit(15);

  const { data: userMessage } = await supabase
    .from('messages')
    .insert({ user_id: user.id, role: 'user', content: question })
    .select()
    .single();

  const contextMessages = (history || [])
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `You are Japa Genie, a helpful visa assistant specializing in helping people relocate internationally.

User Profile:
- Email: ${user.email}
- Subscription: ${profile.data.subscription_tier}
- Wishes used: ${profile.data.wishes_used}/${profile.data.wishes_limit}
- Current wish: ${wishCount}

${contextMessages ? `Previous conversation:\n${contextMessages}\n\n` : ''}

Current question: ${question}

Provide helpful, accurate visa guidance. Remember the context of our conversation.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000
    }
  });

  const result = await model.generateContent(fullPrompt);
  const aiResponse = await result.response.text();

  const { data: assistantMessage } = await supabase
    .from('messages')
    .insert({
      user_id: user.id,
      role: 'assistant',
      content: aiResponse,
      model: 'gemini-2.0-flash'
    })
    .select()
    .single();

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
}