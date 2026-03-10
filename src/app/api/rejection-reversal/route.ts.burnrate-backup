import { groq } from '@/lib/groq-client';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.visaType || !body.destination || !body.userBackground) {
      return NextResponse.json(
        { error: 'Missing required fields: visaType, destination, and userBackground are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert visa rejection reversal strategist.

User Details:
- Visa Type: ${body.visaType}
- Destination: ${body.destination}
- Background: ${body.userBackground}
${body.rejectionReason ? `- Rejection Reason: ${body.rejectionReason}` : ''}
${body.previousAttempts ? `- Previous Attempts: ${body.previousAttempts}` : ''}

Generate a comprehensive rejection reversal strategy with:

1. IMMEDIATE ACTION PLAN (what to do in the next 7 days)
2. DOCUMENTATION FIXES (specific documents to improve)
3. APPEAL/REAPPLICATION STRATEGY (timeline and approach)
4. COMMON PITFALLS TO AVOID
5. SUCCESS RATE ESTIMATE (percentage and reasoning)

Return as JSON in this exact format:
{
  "immediateActions": ["action 1", "action 2", "action 3"],
  "documentationFixes": {
    "required": ["doc 1", "doc 2"],
    "recommended": ["doc 3", "doc 4"]
  },
  "strategy": {
    "timelineWeeks": 8,
    "approach": "Detailed approach description",
    "estimatedSuccessRate": 75
  },
  "pitfalls": ["pitfall 1", "pitfall 2"],
  "professionalHelp": "When to consult an immigration lawyer"
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert immigration consultant specializing in visa rejection reversals. Return ONLY valid JSON, no other text.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || '';
    const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback response
      result = {
        immediateActions: ["Review rejection letter carefully", "Consult with an immigration expert", "Gather all required documents"],
        documentationFixes: {
          required: ["Updated bank statements", "Revised invitation letter"],
          recommended: ["Professional cover letter", "Additional supporting evidence"]
        },
        strategy: {
          timelineWeeks: 8,
          approach: "Reapply with stronger documentation and address all rejection points",
          estimatedSuccessRate: 65
        },
        pitfalls: ["Rushing reapplication", "Not addressing all rejection reasons"],
        professionalHelp: "Consult lawyer if multiple rejections or complex case"
      };
    }

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Rejection reversal error:', error.message || error);
    return NextResponse.json(
      { 
        error: 'Failed to generate strategy',
        fallback: {
          immediateActions: ["Review the rejection reasons carefully", "Consider professional consultation"],
          documentationFixes: { required: [], recommended: [] },
          strategy: { timelineWeeks: 12, approach: "Standard reapplication", estimatedSuccessRate: 50 },
          pitfalls: [],
          professionalHelp: "Recommended for all rejection cases"
        }
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
