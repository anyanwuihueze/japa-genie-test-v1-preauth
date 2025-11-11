'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface RejectionAnalysisInput {
  rejectionLetterText: string; // Full text extracted from letter
  visaType: string;
  destination: string;
  userBackground: string;
}

export interface RejectionAnalysisOutput {
  appealEligibility: {
    canAppeal: boolean;
    reason: string;
    legalBasis?: string;
    timeframe?: string;
  };
  rejectionCategory: 'PROCEDURAL' | 'ELIGIBILITY' | 'DOCUMENTATION' | 'FRAUD' | 'SECURITY';
  severityLevel: 'MINOR' | 'MAJOR' | 'CRITICAL' | 'PERMANENT_BAR';
  keyViolations: Array<{
    violation: string;
    lawReference?: string;
    consequence: string;
  }>;
  recommendedAction: 'APPEAL' | 'REAPPLY' | 'WAIT_PERIOD' | 'CONSULT_LAWYER' | 'INELIGIBLE';
  strategy?: {
    introduction: string;
    steps: Array<{
      step: number;
      headline: string;
      details: string;
    }>;
    conclusion: string;
  };
  warnings: string[];
}

export async function analyzeRejectionLetter(
  input: RejectionAnalysisInput
): Promise<RejectionAnalysisOutput> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3, // Lower temp for factual analysis
      maxOutputTokens: 3000
    }
  });

  const prompt = `You are an expert immigration lawyer analyzing a visa rejection letter.

REJECTION LETTER CONTENT:
"""
${input.rejectionLetterText}
"""

APPLICANT CONTEXT:
- Visa Type: ${input.visaType}
- Destination: ${input.destination}
- Background: ${input.userBackground}

CRITICAL ANALYSIS STEPS:

1. LEGAL ELIGIBILITY CHECK (MOST IMPORTANT)
   - Does the rejection cite misrepresentation, fraud, or deception?
   - Is there a stated ban period (1 year, 5 years, 10 years, permanent)?
   - Does it reference immigration violations or criminal conduct?
   - Are there specific legal sections cited (e.g., INA 212(a)(6)(C))?
   
2. APPEAL vs REAPPLY DETERMINATION
   CANNOT APPEAL if:
   - Fraud/misrepresentation found
   - Ban period imposed
   - Security/criminal grounds
   - Explicit "no appeal right" statement
   
   CAN APPEAL if:
   - Procedural errors by embassy
   - Discretionary refusal (weak ties, insufficient funds)
   - Documentation issues only
   - No legal bars mentioned

3. REJECTION CATEGORY
   - PROCEDURAL: Wrong forms, missing signatures
   - ELIGIBILITY: Age, qualifications, financial issues
   - DOCUMENTATION: Incomplete, unclear, unverified docs
   - FRAUD: False statements, fake documents
   - SECURITY: Criminal record, security concerns

4. RECOMMENDED ACTION
   - APPEAL: If procedurally eligible + strong case
   - REAPPLY: If documentation fixable + no legal bars
   - WAIT_PERIOD: If ban imposed, specify duration
   - CONSULT_LAWYER: If complex legal issues
   - INELIGIBLE: If permanently barred

RESPONSE FORMAT (JSON only, no markdown):
{
  "appealEligibility": {
    "canAppeal": false,
    "reason": "Rejection letter cites misrepresentation under INA 212(a)(6)(C)(i), which bars appeal rights",
    "legalBasis": "U.S. Immigration and Nationality Act Section 212(a)(6)(C)(i)",
    "timeframe": "5-year ban from date of rejection"
  },
  "rejectionCategory": "FRAUD",
  "severityLevel": "CRITICAL",
  "keyViolations": [
    {
      "violation": "Material misrepresentation on visa application",
      "lawReference": "INA 212(a)(6)(C)(i)",
      "consequence": "5-year inadmissibility period"
    }
  ],
  "recommendedAction": "WAIT_PERIOD",
  "strategy": null,
  "warnings": [
    "🚨 You are legally barred from entering ${input.destination} for 5 years",
    "⚖️ Attempting to appeal or reapply immediately will result in automatic denial",
    "💼 Consult an immigration attorney to explore waiver options after ban period"
  ]
}

If appealEligibility.canAppeal is TRUE, then include a "strategy" object with comeback steps.
If FALSE, set strategy to null and focus on warnings.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let cleaned = text
      .trim()
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
    
    const parsed: RejectionAnalysisOutput = JSON.parse(cleaned);
    
    // Validation: If AI says can appeal but severity is CRITICAL, override
    if (parsed.appealEligibility.canAppeal && parsed.severityLevel === 'CRITICAL') {
      console.warn('⚠️ AI contradiction detected - overriding appeal eligibility');
      parsed.appealEligibility.canAppeal = false;
      parsed.appealEligibility.reason = 'Critical violation detected - appeal likely not permitted';
      parsed.recommendedAction = 'CONSULT_LAWYER';
    }
    
    return parsed;
    
  } catch (error) {
    console.error('❌ Rejection analysis failed:', error);
    
    // Safe fallback
    return {
      appealEligibility: {
        canAppeal: false,
        reason: 'Unable to determine eligibility - analysis failed',
        timeframe: 'Unknown'
      },
      rejectionCategory: 'ELIGIBILITY',
      severityLevel: 'MAJOR',
      keyViolations: [{
        violation: 'Analysis incomplete',
        consequence: 'Cannot determine without expert review'
      }],
      recommendedAction: 'CONSULT_LAWYER',
      warnings: [
        '⚠️ Automated analysis failed',
        '💼 STRONGLY recommend consulting an immigration lawyer',
        '📋 Do not attempt appeal without professional legal review'
      ]
    };
  }
}