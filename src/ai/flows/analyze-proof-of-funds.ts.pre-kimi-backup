'use server';
import { createClient } from '@/lib/supabase/server';
import { callGeminiServer } from '@/lib/gemini-server';

export interface ProofOfFundsInput {
  userProfile: {
    destination_country: string;
    visa_type: string;
    nationality?: string;
    family_size?: number;
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
    seasoningRequired: number;
    seasoningStatus: 'meets' | 'insufficient' | 'risky';
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
    seasoningRequired: number;
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
    seasoningRequirements: number;
    seasoningExplanation: string;
    documentChecklist: string[];
    commonRejectionReasons: string[];
    countrySpecificRules: string[];
  };
}

export interface ProofOfFundsOutput {
  success: boolean;
  analysis?: ProofOfFundsAnalysis;
  isCached?: boolean;
  cacheAge?: string;
  error?: string;
}

/**
 * AI-POWERED PROOF OF FUNDS ANALYZER WITH CACHING
 */
export async function analyzeProofOfFunds(
  input: ProofOfFundsInput
): Promise<ProofOfFundsOutput> {
  try {
    console.log('🤖 Starting AI-Powered POF analysis for:', input.userProfile.destination_country);
    
    // FIXED: Await the async client creation
    const supabase = await createClient();
    const { destination_country, visa_type } = input.userProfile;
    const familyMembers = input.familyMembers || 1;

    // STEP 1: CHECK CACHE FIRST (30-day validity)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: cachedData, error: cacheError } = await supabase
      .from('pof_requirements_cache')
      .select('*')
      .eq('country', destination_country)
      .eq('visa_type', visa_type)
      .eq('family_members', familyMembers)
      .gt('created_at', thirtyDaysAgo.toISOString())
      .single();

    if (cachedData && !cacheError) {
      console.log('✅ Using cached POF requirements');
      return {
        success: true,
        analysis: cachedData.requirements_json as ProofOfFundsAnalysis,
        isCached: true,
        cacheAge: cachedData.created_at
      };
    }

    console.log('🔍 Cache miss, calling Gemini AI...');

    // STEP 2: CALL GEMINI AI FOR REQUIREMENTS
    const requirements = await getAIPOFRequirements(
      destination_country,
      visa_type,
      familyMembers
    );

    // STEP 3: ANALYZE USER'S FINANCIAL DATA
    const financialDataStr = typeof input.financialData === 'string'
      ? input.financialData
      : JSON.stringify(input.financialData, null, 2);

    const analysis = await analyzeFinancialData(
      financialDataStr,
      requirements,
      destination_country,
      visa_type,
      familyMembers
    );

    // STEP 4: SAVE TO CACHE FOR FUTURE USE
    // FIXED: Await the upsert
    await supabase
      .from('pof_requirements_cache')
      .upsert({
        country: destination_country,
        visa_type: visa_type,
        family_members: familyMembers,
        minimum_funds: requirements.minimumFunds,
        seasoning_days: requirements.seasoningDays,
        currency: requirements.currency,
        requirements_json: analysis,
        source: 'gemini-ai',
        confidence_score: 0.85,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'country,visa_type,family_members'
      });

    console.log('✅ AI analysis completed and cached');
    return {
      success: true,
      analysis,
      isCached: false
    };

  } catch (error: any) {
    console.error('❌ POF analysis failed:', error.message);
    return {
      success: false,
      error: error.message || 'Analysis failed. Please try again or contact support.'
    };
  }
}

/**
 * AI FUNCTION: Get POF requirements from Gemini
 */
async function getAIPOFRequirements(
  country: string,
  visaType: string,
  familyMembers: number
): Promise<{
  minimumFunds: number;
  seasoningDays: number;
  currency: string;
  requirementsText: string;
}> {
  const prompt = `You are an expert visa consultant with up-to-date knowledge of financial requirements.

RESEARCH TASK:
Find the CURRENT (2024-2025) Proof of Funds requirements for:
- Destination Country: ${country}
- Visa Type: ${visaType}
- Family Size: ${familyMembers} ${familyMembers > 1 ? 'people' : 'person'}

SEARCH FOR:
1. Minimum funds required (convert to USD if needed)
2. Account seasoning period (how long funds must be maintained)
3. Currency required for the application
4. Specific embassy/immigration requirements
5. Document checklist
6. Common rejection reasons

IMPORTANT:
- Use RELIABLE sources: official immigration websites, embassy guidelines
- If exact data not found, provide ESTIMATES based on similar countries
- Always specify your confidence level

RETURN AS JSON:
{
  "minimumFunds": 25000,
  "seasoningDays": 90,
  "currency": "USD",
  "requirementsText": "Detailed explanation...",
  "documentChecklist": ["Bank statements", "Employment letter", "Tax returns"],
  "commonRejectionReasons": ["Insufficient seasoning", "Large recent deposits"],
  "confidence": 0.9,
  "sourceNote": "Based on official immigration website"
}

Be accurate and practical. People's visa applications depend on this information.`;

  try {
    const response = await callGeminiServer(prompt, true);
    const data = JSON.parse(response);
    
    return {
      minimumFunds: data.minimumFunds || 20000,
      seasoningDays: data.seasoningDays || 90,
      currency: data.currency || 'USD',
      requirementsText: data.requirementsText || 'Standard requirements apply'
    };
  } catch (error) {
    console.warn('Gemini failed, using fallback values');
    return {
      minimumFunds: 20000,
      seasoningDays: 90,
      currency: 'USD',
      requirementsText: `Standard requirements: $20,000 minimum, 90-day seasoning period. For exact ${country} requirements, check official immigration website.`
    };
  }
}

/**
 * AI FUNCTION: Analyze user's financial data against requirements
 */
async function analyzeFinancialData(
  financialData: string,
  requirements: any,
  country: string,
  visaType: string,
  familyMembers: number
): Promise<ProofOfFundsAnalysis> {
  const prompt = `You are a strict visa financial analyst. Analyze this financial data:

DESTINATION: ${country}
VISA TYPE: ${visaType}
FAMILY SIZE: ${familyMembers}

REQUIREMENTS:
- Minimum Funds: ${requirements.currency} ${requirements.minimumFunds.toLocaleString()}
- Seasoning Period: ${requirements.seasoningDays} days
- Currency: ${requirements.currency}

USER'S FINANCIAL DATA:
${financialData}

ANALYSIS TASKS:
1. Calculate total liquid assets
2. Calculate account seasoning (how long funds maintained)
3. Check if meets minimum funds requirement
4. Check if meets seasoning requirement
5. Identify red flags (large recent deposits, unstable balance)
6. Provide specific recommendations

RETURN AS JSON with this EXACT structure:
{
  "summary": {
    "totalScore": 7.5,
    "meetsRequirements": true,
    "riskLevel": "medium",
    "confidence": 85
  },
  "financialAnalysis": {
    "totalAssets": 28500,
    "liquidAssets": 27000,
    "seasoningDays": 45,
    "seasoningRequired": ${requirements.seasoningDays},
    "seasoningStatus": "insufficient",
    "currency": "${requirements.currency}",
    "stabilityScore": 6
  },
  "complianceCheck": {
    "passes": false,
    "issues": ["Insufficient seasoning (45/90 days)"],
    "specificAdvice": ["Maintain funds for 45 more days"]
  },
  "accountBreakdown": [
    {
      "institution": "Bank Name",
      "balance": 15000,
      "seasoning": 45,
      "seasoningRequired": ${requirements.seasoningDays},
      "type": "savings",
      "status": "insufficient",
      "notes": "Funds deposited 45 days ago"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "action": "Wait 45 more days before applying",
      "timeline": "45 days",
      "impact": "Will meet seasoning requirement"
    }
  ],
  "embassySpecific": {
    "minimumFunds": ${requirements.minimumFunds},
    "seasoningRequirements": ${requirements.seasoningDays},
    "seasoningExplanation": "${requirements.requirementsText}",
    "documentChecklist": ["6 months bank statements", "Employment letter", "Tax returns"],
    "commonRejectionReasons": ["Insufficient seasoning", "Unstable income"],
    "countrySpecificRules": ["${country} embassy requires original bank statements"]
  }
}

Be realistic and strict. Visa officers are very thorough.`;

  const response = await callGeminiServer(prompt, true);
  return JSON.parse(response);
}
