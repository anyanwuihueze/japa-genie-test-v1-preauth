import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/ai/insights-generator';

export async function POST(request: NextRequest) {
  let userQuestion: string | undefined;
  
  try {
    const body = await request.json();
    const { question, userId } = body;
    userQuestion = question;

    if (!userQuestion) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    console.log('🔄 Calling Genkit insights for question:', userQuestion.substring(0, 50));
    
    const insights = await generateInsights({ question: userQuestion });
    console.log('✅ Genkit insights generated successfully');

    if (userId) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();
        
        await supabase
          .from('user_profiles')
          .upsert({
            user_id: userId,
            insights_snapshot: insights,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
        
        console.log('✅ Insights stored in database for user:', userId);
      } catch (dbError) {
        console.error('❌ Failed to store insights:', dbError);
      }
    }

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('❌ Genkit insights error:', error);
    
    if (userQuestion) {
      try {
        console.log('🔄 Falling back to legacy insights API');
        const legacyResponse = await fetch(`${request.nextUrl.origin}/api/insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userQuestion, aiResponse: '' })
        });
        
        if (legacyResponse.ok) {
          const legacyInsights = await legacyResponse.json();
          console.log('✅ Legacy insights fallback successful');
          return NextResponse.json({
            insights: [
              {
                headline: 'Basic Analysis',
                detail: legacyInsights.recommendations?.[0] || 'Research official requirements',
                url: undefined
              }
            ],
            costEstimates: [],
            visaAlternatives: [],
            chartData: undefined,
            fallback: true
          });
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }
    
    console.log('⚠️ Using ultimate fallback insights');
    return NextResponse.json({
      insights: [
        {
          headline: 'System Temporarily Unavailable',
          detail: 'Please try again in a moment',
          url: undefined
        }
      ],
      costEstimates: [],
      visaAlternatives: [],
      chartData: undefined,
      error: true
    });
  }
}
