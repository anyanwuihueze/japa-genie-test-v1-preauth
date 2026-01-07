'use server';
import { groq } from '@/lib/groq-client';

export interface ProofOfFundsInput {
  userProfile: {
    destination_country: string;
    visa_type: string;
    nationality?: string;
  };
  financialData: string | object;
  familyMembers: number;
}

export interface ProofOfFundsAnalysis {
  summary: {
    totalScore: number;
    meetsRequirements: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
  };
  financialAnalysis: {
    totalAssets: number;
    liquidAssets: number;
    seasoningDays: number;
    seasoningRequired: number; // 🔥 NEW: Required seasoning period
    seasoningStatus: 'meets' | 'insufficient' | 'risky'; // 🔥 NEW
    currency: string;
    stabilityScore: number;
  };
  complianceCheck: {
    passes: boolean;
    issues: string[];
    specificAdvice: string[];
  };
  accountBreakdown: Array<{
    institution: string;
    balance: number;
    seasoning: number;
    seasoningRequired: number; // 🔥 NEW: Per-account requirement
    type: string;
    status: string;
    notes: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeline: string;
    impact: string;
  }>;
  embassySpecific: {
    minimumFunds: number;
    seasoningRequirements: number; // 🔥 ENHANCED: Days required
    seasoningExplanation: string; // 🔥 NEW: Why seasoning matters
    documentChecklist: string[];
    commonRejectionReasons: string[];
    countrySpecificRules: string[]; // 🔥 NEW: Country-specific notes
  };
}

export interface ProofOfFundsOutput {
  success: boolean;
  analysis?: ProofOfFundsAnalysis;
  error?: string;
}

/**
 * 🔥 ENHANCED PROOF OF FUNDS ANALYZER
 * - Calculates account seasoning requirements
 * - Country-specific rules
 * - Real embassy requirements
 */
export async function analyzeProofOfFunds(
  input: ProofOfFundsInput
): Promise<ProofOfFundsOutput> {
  try {
    console.log('🤖 Starting POF analysis for:', input.userProfile.destination_country);

    // STEP 1: Get country-specific seasoning requirements
    const seasoningRules = getSeasoningRequirements(
      input.userProfile.destination_country,
      input.userProfile.visa_type
    );

    // STEP 2: Get minimum fund requirements
    const fundRequirements = getMinimumFundRequirements(
      input.userProfile.destination_country,
      input.userProfile.visa_type,
      input.familyMembers
    );

    // Convert financial data to string
    const financialDataStr = typeof input.financialData === 'string'
      ? input.financialData
      : JSON.stringify(input.financialData, null, 2);

    // STEP 3: Build comprehensive prompt with real requirements
    const prompt = `You are an expert visa financial analyst with deep knowledge of embassy requirements.

APPLICANT PROFILE:
- Destination: ${input.userProfile.destination_country}
- Visa Type: ${input.userProfile.visa_type}
- Nationality: ${input.userProfile.nationality || 'Not specified'}
- Family Members: ${input.familyMembers}

EMBASSY REQUIREMENTS FOR ${input.userProfile.destination_country}:
${fundRequirements}

ACCOUNT SEASONING REQUIREMENTS:
${seasoningRules}

FINANCIAL DATA PROVIDED:
${financialDataStr}

YOUR CRITICAL TASKS:
1. Extract ALL account balances, dates, and transaction patterns
2. Calculate how long funds have been maintained (seasoning period)
3. Check if seasoning meets embassy requirements (${seasoningRules.split('\n')[0]})
4. Identify recent large deposits (RED FLAG for embassies)
5. Calculate total liquid assets
6. Assess stability of funds over time
7. Check compliance with specific country rules

SEASONING ANALYSIS IS CRITICAL:
- Embassies reject applications with "sudden wealth" (funds deposited recently)
- They want to see funds maintained consistently for required period
- Large deposits within seasoning period are RED FLAGS
- Calculate: days between earliest transaction and today

Return your analysis as a JSON object with this structure (use REAL calculated values):
{
  "summary": {
    "totalScore": <0-10 based on analysis>,
    "meetsRequirements": <true/false>,
    "riskLevel": "<low/medium/high>",
    "confidence": <0-100>
  },
  "financialAnalysis": {
    "totalAssets": <calculated total>,
    "liquidAssets": <liquid funds only>,
    "seasoningDays": <days funds have been maintained>,
    "seasoningRequired": ${seasoningRules.match(/\d+/)?.[0] || 90},
    "seasoningStatus": "<meets/insufficient/risky>",
    "currency": "<detected currency>",
    "stabilityScore": <1-10>
  },
  "complianceCheck": {
    "passes": <true/false>,
    "issues": [<list specific issues>],
    "specificAdvice": [<actionable advice>]
  },
  "accountBreakdown": [
    {
      "institution": "<bank name>",
      "balance": <amount>,
      "seasoning": <days this account shows>,
      "seasoningRequired": ${seasoningRules.match(/\d+/)?.[0] || 90},
      "type": "<savings/checking/etc>",
      "status": "<meets/insufficient/risky>",
      "notes": "<observations about this account>"
    }
  ],
  "recommendations": [
    {
      "priority": "<high/medium/low>",
      "action": "<specific action>",
      "timeline": "<timeframe>",
      "impact": "<expected outcome>"
    }
  ],
  "embassySpecific": {
    "minimumFunds": <required amount>,
    "seasoningRequirements": ${seasoningRules.match(/\d+/)?.[0] || 90},
    "seasoningExplanation": "${seasoningRules.replace(/\n/g, ' ')}",
    "documentChecklist": [<required documents>],
    "commonRejectionReasons": [<common issues>],
    "countrySpecificRules": [<specific rules>]
  }
}

IMPORTANT: 
- Calculate REAL seasoning days from transaction history
- Flag ANY deposits within seasoning period as potential issues
- Be specific about what needs to be fixed
- Return ONLY valid JSON, no markdown`;

    // STEP 4: Call Groq AI for analysis
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert visa financial analyst.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_completion_tokens: 2048,
    });

    const responseText = completion.choices[0].message.content || '{}';
    
    // Clean the response
    let cleanedText = responseText.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse JSON
    let analysis: ProofOfFundsAnalysis;
    try {
      analysis = JSON.parse(cleanedText);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ JSON parse failed, attempting extraction...');
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from AI response');
      }
    }

    // Validate structure
    if (!analysis.summary || !analysis.summary.riskLevel) {
      throw new Error('AI returned incomplete analysis structure');
    }

    console.log('✅ POF analysis completed successfully');
    return { success: true, analysis };

  } catch (error: any) {
    console.error('❌ POF analysis failed:', error.message);
    return {
      success: false,
      error: error.message || 'Analysis failed'
    };
  }
}

/**
 * 🔥 Get account seasoning requirements by country and visa type
 */
function getSeasoningRequirements(country: string, visaType: string): string {
  const seasoningRules: Record<string, Record<string, string>> = {
    'Canada': {
      'student': '90 days minimum. Canadian Student Direct Stream requires 4-6 months of bank statements showing consistent balance. Large deposits within 90 days will be questioned.',
      'work': '90 days minimum. IRCC scrutinizes account history for sudden increases.',
      'visitor': '90 days recommended. Short-term visitors should show stable funds.',
    },
    'United Kingdom': {
      'student': '28 consecutive days. CRITICAL: UK has strict 28-day rule. Funds must be in account for 28 consecutive days before application. Bank letter must be dated within 31 days of visa application.',
      'work': '90 days recommended. Show employment stability and consistent income.',
      'visitor': '90 days recommended. Recent large deposits raise red flags.',
    },
    'United States': {
      'student': '90-180 days. US embassy wants to see funds maintained for 3-6 months. Recent deposits (within 60 days) will be questioned during interview.',
      'work': '90 days minimum. Must demonstrate financial stability.',
      'visitor': '90 days minimum. Show travel history and financial ties to home country.',
    },
    'Australia': {
      'student': '90 days minimum. Australian Immigration requires genuine access to funds. Recent large deposits indicate lack of genuine capacity.',
      'work': '90 days minimum. Consistent income and savings pattern preferred.',
      'visitor': '90 days recommended. Show financial stability and reason to return home.',
    },
  };

  const countryRules = seasoningRules[country];
  if (countryRules) {
    return countryRules[visaType] || countryRules['visitor'] || '90 days minimum seasoning required';
  }

  return '90 days minimum seasoning required for most visa types';
}

/**
 * 🔥 Get minimum fund requirements by country, visa type, and family size
 */
function getMinimumFundRequirements(
  country: string,
  visaType: string,
  familyMembers: number
): string {
  const fundRules: Record<string, any> = {
    'Canada': {
      student: {
        base: 20635,
        perPerson: 4000,
        currency: 'CAD',
        notes: 'Must show tuition + CAD $20,635 for living expenses (as of 2025). Add CAD $4,000 per additional family member.'
      },
      work: {
        base: 15000,
        perPerson: 3000,
        currency: 'CAD',
        notes: 'Proof of employment and settlement funds required.'
      }
    },
    'United Kingdom': {
      student: {
        base: 13356, // £1,483 x 9 months
        perPerson: 6000,
        currency: 'GBP',
        notes: '£1,483/month in London (£1,136 outside London) for 9 months. Add £6,000 per family member.'
      }
    },
    'United States': {
      student: {
        base: 30000,
        perPerson: 8000,
        currency: 'USD',
        notes: 'Amount varies by university. Typically $30,000-$70,000 per year including tuition.'
      }
    },
    'Australia': {
      student: {
        base: 29710,
        perPerson: 7362,
        currency: 'AUD',
        notes: 'AUD $29,710 for 12 months. Add AUD $7,362 per family member.'
      }
    }
  };

  const countryRule = fundRules[country];
  if (countryRule && countryRule[visaType]) {
    const rule = countryRule[visaType];
    const totalRequired = rule.base + (rule.perPerson * (familyMembers - 1));
    return `Minimum Required: ${rule.currency} $${totalRequired.toLocaleString()}
Base Amount: ${rule.currency} $${rule.base.toLocaleString()}
Additional per family member: ${rule.currency} $${rule.perPerson.toLocaleString()}
Notes: ${rule.notes}`;
  }

  return 'Minimum $20,000 USD or equivalent recommended for most visa types';
}