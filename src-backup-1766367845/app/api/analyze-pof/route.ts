// src/app/api/analyze-pof/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface AnalysisRequest {
  destinationCountry: string;
  visaType: string;
  age: number;
  familyMembers: number;
  travelTimeline: string;
  currentSavings: number;
  hasStatement: boolean;
  files?: Array<{
    dataUri: string;
    mimeType: string;
    name: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AnalysisRequest = await request.json();
    console.log('📊 POF Analysis request for:', body.destinationCountry, body.visaType);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      }
    });

    let prompt = `You are an expert visa financial analyst with deep knowledge of embassy requirements worldwide.

APPLICANT PROFILE:
- Destination Country: ${body.destinationCountry}
- Visa Type: ${body.visaType}
- Applicant Age: ${body.age}
- Family Members: ${body.familyMembers}
- Travel Timeline: ${body.travelTimeline}
- Declared Savings: ₦${body.currentSavings.toLocaleString()}
- Bank Statements: ${body.hasStatement ? 'Provided' : 'Not provided'}

YOUR TASK:
Based on your knowledge of ${body.destinationCountry} embassy requirements for ${body.visaType}, provide a comprehensive proof of funds analysis.

`;

    // If files are provided, add them to the analysis
    const parts: any[] = [{ text: prompt }];
    
    if (body.files && body.files.length > 0) {
      prompt += `\nBANK STATEMENTS PROVIDED:\nAnalyze the bank statements attached and extract:\n- Actual balances\n- Account types\n- Transaction history\n- Seasoning period (how long funds maintained)\n- Any red flags\n\n`;
      
      for (const file of body.files) {
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.dataUri.split(',')[1] // Remove data:image/png;base64, prefix
          }
        });
      }
    } else {
      prompt += `\nNote: Analysis based on declared savings amount only. User has not uploaded bank statements.\n\n`;
    }

    prompt += `PROVIDE A DETAILED ANALYSIS IN THIS JSON FORMAT:

{
  "embassy": "${body.destinationCountry} ${body.visaType} — Embassy/VFS Analysis",
  "officerPatterns": [
    "<Real insight about what visa officers look for>",
    "<Common rejection reasons for this embassy>",
    "<Red flags officers watch for>",
    "<What strengthens applications>"
  ],
  "yourProfile": {
    "age": ${body.age},
    "nationality": "Nigerian",
    "seasoningMonths": <calculated from statements or estimated>,
    "averageMonthlyBalance": <calculated from statements or declared amount>,
    "largestDeposit": <extracted from statements or estimated>,
    "redFlags": [
      "<Any issues found in statements or profile>"
    ],
    "strengths": [
      "<Positive aspects of financial profile>"
    ]
  },
  "requiredFunds": {
    "minimum": <actual embassy requirement in NGN>,
    "recommended": <recommended amount in NGN (usually 1.4-1.5x minimum)>,
    "yourTotal": ${body.currentSavings},
    "buffer": "<comparison: how much over/under>"
  },
  "approvalPrediction": "<percentage>% approval chance at ${body.destinationCountry} embassy",
  "seasoningData": [
    {"month": "Jan", "balance": <amount in millions>},
    {"month": "Feb", "balance": <amount>},
    {"month": "Mar", "balance": <amount>},
    {"month": "Apr", "balance": <amount>},
    {"month": "May", "balance": <amount>},
    {"month": "Jun", "balance": <amount>}
  ],
  "riskScore": <0-100 based on analysis>,
  "actionPlan": {
    "immediate": [
      "<Specific action item>",
      "<Another action item>",
      "<Priority action>"
    ],
    "premiumUpgrade": {
      "offer": "Guaranteed Approval Package",
      "includes": [
        "Verified ${body.destinationCountry} sponsor with proven track record",
        "Embassy-ready affidavit + cover letter",
        "Interview prep with former visa officer",
        "Document review by immigration lawyer"
      ],
      "successRate": "High success rate for similar profiles",
      "cta": "CONNECT WITH SPONSORSHIP TEAM"
    }
  }
}

CRITICAL REQUIREMENTS:
1. Use REAL embassy requirements from your training data for ${body.destinationCountry} ${body.visaType}
2. If bank statements are provided, extract ACTUAL numbers from them
3. If no statements, base analysis on declared amount but flag this as a limitation
4. Consider family size (${body.familyMembers}) in fund requirements
5. Factor in applicant age (${body.age}) for risk assessment
6. Provide actionable, specific advice
7. NO placeholder values - calculate everything based on real data

Return ONLY the JSON object, no markdown formatting, no code blocks.`;

    // Update parts array with final prompt
    parts[0] = { text: prompt };

    console.log('🤖 Sending to Gemini AI...');
    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    
    console.log('📥 Received response, length:', responseText.length);

    // Clean and parse response
    let cleanedText = responseText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();

    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
      console.log('✅ Analysis parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parse failed, attempting extraction...');
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON extracted and parsed');
      } else {
        throw new Error('Could not parse AI response as JSON');
      }
    }

    // Save to database
    try {
      await supabase.from('pof_analyses').insert({
        user_id: user.id,
        analysis_data: analysis,
        destination_country: body.destinationCountry,
        visa_type: body.visaType,
        family_members: body.familyMembers,
        user_age: body.age,
        current_savings: body.currentSavings,
        has_documents: body.hasStatement
      });
      console.log('💾 Analysis saved to database');
    } catch (dbError) {
      console.log('⚠️ DB save failed (non-critical):', dbError);
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('❌ POF API error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}