import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';

export async function POST(request: NextRequest) {
  console.log('🚀 Chat API called');
  
  const body = await request.json();
  const { question, wishCount, conversationHistory = [] } = body;
  
  console.log('📝 Request:', { 
    question: question?.substring(0, 50), 
    wishCount,
    hasAuthHeader: !!request.headers.get('Authorization'),
    historyLength: conversationHistory.length 
  });
  
  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  // Get Authorization header
  const authHeader = request.headers.get('Authorization');
  
  // VISITOR MODE (no auth header)
  if (!authHeader) {
    console.log('👤 Visitor mode - no auth header');
    try {
      const result = await visaChatAssistant({
        question,
        wishCount: wishCount || 1,
        conversationHistory,
        isSignedIn: false,
      });

      console.log('✅ Visitor response generated');
      return NextResponse.json({
        answer: result.answer,
        questionsRemaining: null,
        questionsUsed: 0,
        questionsLimit: 3,
        subscriptionTier: 'visitor',
        success: true
      });
    } catch (error: any) {
      console.error('❌ Visitor chat error:', error.message);
      return NextResponse.json({
        answer: "I'm having trouble connecting right now. But I'm Japa Genie—here to help with visa questions!",
        success: true
      });
    }
  }

  // AUTHENTICATED MODE
  console.log('🔐 Authenticated request detected');
  
  try {
    // 🔥 CORRECT: Use ANON_KEY with user's JWT token
    // This enforces Row Level Security (RLS) - users can only access their own data
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  // ✅ Public key
      {
        global: {
          headers: {
            Authorization: authHeader  // ✅ User's token
          }
        }
      }
    );

    // Verify user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ Auth error:', authError?.message);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError?.message },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.email);

    // Get or create profile
    let { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log('⚠️ Creating new profile');
      const { data: newProfile, error: insertError } = await supabase
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
      
      if (insertError) {
        console.error('❌ Profile creation error:', insertError);
        throw insertError;
      }
      profile = newProfile;
    }

    console.log('📊 Profile loaded:', {
      tier: profile.subscription_tier,
      wishesUsed: profile.wishes_used
    });

    // Check wish limit for free users only
    if (profile.subscription_tier === 'free') {
      const { data: canAsk, error: rpcError } = await supabase
        .rpc('can_ask_question', { user_uuid: user.id });
      
      if (rpcError) {
        console.error('❌ RPC error:', rpcError);
      }
      
      if (!canAsk) {
        console.log('🚫 Free user hit limit');
        return NextResponse.json(
          {
            error: `You've used all ${profile.wishes_limit} free wishes`,
            message: 'Upgrade to premium for unlimited visa guidance',
            needsUpgrade: true
          },
          { status: 403 }
        );
      }
    }

    // Get conversation history
    console.log('📚 Loading chat history...');
    const { data: history, error: historyError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(15);

    if (historyError) {
      console.error('❌ History error:', historyError.message);
    } else {
      console.log('✅ History loaded:', history?.length || 0, 'messages');
    }

    // Save user message
    console.log('💾 Saving user message...');
    const { error: saveError } = await supabase
      .from('messages')
      .insert({ user_id: user.id, role: 'user', content: question });

    if (saveError) {
      console.error('❌ Save error:', saveError.message);
    } else {
      console.log('✅ User message saved');
    }

    const formattedHistory = (history || []).map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    // Get preferred name
    const userName = profile.preferred_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 
                     'Pathfinder';

    const userContext = {
      name: userName,
      country: profile.country || undefined,
      destination: profile.destination || undefined,
      profession: profile.profession || undefined,
      visaType: profile.visa_type || undefined,
    };

    console.log('🤖 Calling AI with context:', { name: userName });

    // Call AI
    const result = await visaChatAssistant({
      question,
      wishCount: wishCount || 1,
      conversationHistory: formattedHistory,
      userContext,
      isSignedIn: true,
    });

    console.log('✅ AI response received:', result.answer?.substring(0, 100));

    const aiResponse = result.answer;

    // Save assistant message
    console.log('💾 Saving AI response...');
    const { error: aiSaveError } = await supabase
      .from('messages')
      .insert({ 
        user_id: user.id, 
        role: 'assistant', 
        content: aiResponse,
        model: 'gemini-2.0-flash-exp' 
      });

    if (aiSaveError) {
      console.error('❌ AI save error:', aiSaveError.message);
    } else {
      console.log('✅ AI response saved');
    }

    // Increment count for free users only
    if (profile.subscription_tier === 'free') {
      console.log('📈 Incrementing wish count');
      const { error: incrementError } = await supabase
        .rpc('increment_question_count', { user_uuid: user.id });
      
      if (incrementError) {
        console.error('❌ Increment error:', incrementError.message);
      }
    }

    console.log('✅ Request complete');
    return NextResponse.json({
      answer: aiResponse,
      subscriptionTier: profile.subscription_tier,
      success: true
    });

  } catch (error: any) {
    console.error('💥 CRITICAL ERROR in authenticated flow:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'AI processing failed',
        details: error.message,
        errorType: error.name,
        success: false 
      },
      { status: 500 }
    );
  }
}
