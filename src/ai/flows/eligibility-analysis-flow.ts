'use server';

import { callGeminiServer } from '@/lib/gemini-server';
import type { UserProfile } from '@/lib/visa-readiness-calculator';

interface EligibilityInput {
  country: string;
  visaType: string;
  answers: Partial<UserProfile>;
}

interface EligibilityOutput {
  topWeaknesses: string[];
  actionPlan: string[];
  countrySpecificTips: string[];
  readinessScore: number;
}

export async function analyzeEligibility(input: EligibilityInput): Promise<EligibilityOutput> {
  try {
    const prompt = `You are an expert visa consultant analyzing an applicant's readiness for ${input.country} ${input.visaType}.

APPLICANT PROFILE:
- Valid Passport: ${input.answers.hasValidPassport ? 'Yes' : 'No'}
- Forms Completed: ${input.answers.allFormsCompleted ? 'Yes' : 'No'}
- Adequate Bank Balance: ${input.answers.bankBalanceAdequate ? 'Yes' : 'No'}
- Bank Statement Duration: ${input.answers.savingsDurationMonths || 0} months
- Language Certification: ${input.answers.hasLanguageCertification ? 'Yes' : 'No'}
- Previous Visas: ${input.answers.hasPreviousVisas ? 'Yes' : 'No'}
- Never Overstayed: ${input.answers.neverOverstayed ? 'Yes' : 'No'}
- Education Verified: ${input.answers.educationVerified ? 'Yes' : 'No'}
- Work Experience Matches: ${input.answers.workExperienceMatchesJob ? 'Yes' : 'No'}
- Practiced Interview: ${input.answers.practicedMockInterview ? 'Yes' : 'No'}
- Dependents at Home: ${input.answers.dependentsInHomeCountry ? 'Yes' : 'No'}
- Property Ownership: ${input.answers.propertyOwnership ? 'Yes' : 'No'}

Analyze this profile specifically for ${input.country} ${input.visaType} requirements.

Return ONLY a JSON object with this structure:
{
  "topWeaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "actionPlan": ["action 1", "action 2", "action 3"],
  "countrySpecificTips": ["tip 1", "tip 2", "tip 3"],
  "readinessScore": 75
}

Focus on ${input.country}-specific requirements. Be specific and actionable.`;

    const response = await callGeminiServer(prompt, true);
    
    // Parse JSON response
    const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanResponse);
    
    return {
      topWeaknesses: parsed.topWeaknesses || [],
      actionPlan: parsed.actionPlan || [],
      countrySpecificTips: parsed.countrySpecificTips || [],
      readinessScore: parsed.readinessScore || 50
    };
    
  } catch (error: any) {
    console.error('Eligibility analysis error:', error);
    
    // Fallback response
    return {
      topWeaknesses: [
        'Unable to analyze at this time',
        'Please check your internet connection',
        'Try again in a moment'
      ],
      actionPlan: [
        'Ensure all required documents are complete',
        'Verify your financial documentation',
        'Review country-specific requirements'
      ],
      countrySpecificTips: [
        'Check the official embassy website',
        'Consider consulting with a visa expert',
        'Allow extra time for processing'
      ],
      readinessScore: 50
    };
  }
}
