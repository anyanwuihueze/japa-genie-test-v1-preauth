// src/ai/flows/visa-matchmaker.ts - PRODUCTION CODE
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface UserProfile {
  age: number;
  education: string;
  profession: string;
  workExperience: number;
  englishProficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
  budget: number;
  primaryGoal: 'Study' | 'Work' | 'Business' | 'Family' | 'Tourism';
  preferredRegions: string[];
  hasSpouse?: boolean;
  hasDependents?: boolean;
  currentCountry: string;
}

interface VisaMatchmakerInput {
  userProfile: UserProfile;
  isPremium: boolean;
}

interface CountryMatch {
  country: string;
  visaType: string;
  matchScore: number;
  successProbability: number;
  requirements: {
    mustHave: string[];
    recommended: string[];
    commonPitfalls: string[];
  };
  strengths: string[];
  redFlags: string[];
}

interface VisaMatchmakerOutput {
  topMatches: CountryMatch[];
  overallAnalysis: string;
  nextSteps: string[];
  warningsAndCautions: string[];
}

export async function visaMatchmaker(input: VisaMatchmakerInput): Promise<VisaMatchmakerOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `
ACT AS: Expert immigration consultant specializing in African professionals with 15+ years experience
ANALYZE THIS PROFILE FOR GLOBAL VISA OPPORTUNITIES:

APPLICANT DETAILS:
- Age: ${input.userProfile.age}
- Education: ${input.userProfile.education}
- Profession: ${input.userProfile.profession}
- Experience: ${input.userProfile.workExperience} years
- English: ${input.userProfile.englishProficiency}
- Budget: $${input.userProfile.budget}
- Goal: ${input.userProfile.primaryGoal}
- Preferred Regions: ${input.userProfile.preferredRegions.join(', ')}
- Current Country: ${input.userProfile.currentCountry}
${input.userProfile.hasSpouse ? '- Has Spouse' : ''}
${input.userProfile.hasDependents ? '- Has Dependents' : ''}

Premium Status: ${input.isPremium ? 'YES' : 'NO'}

PROVIDE DETAILED ANALYSIS WITH:
1. Top 3-5 matching countries with visa types
2. Match scores (0-100) and success probabilities
3. Requirements (must-have, recommended, common pitfalls)
4. Applicant's strengths and red flags for each option
5. Overall analysis and strategic recommendations
6. Next steps prioritized by urgency
7. Warnings and cautions

Return as JSON matching this structure:
{
  "topMatches": [
    {
      "country": "string",
      "visaType": "string",
      "matchScore": number,
      "successProbability": number,
      "requirements": {
        "mustHave": ["string"],
        "recommended": ["string"],
        "commonPitfalls": ["string"]
      },
      "strengths": ["string"],
      "redFlags": ["string"]
    }
  ],
  "overallAnalysis": "string",
  "nextSteps": ["string"],
  "warningsAndCautions": ["string"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Clean up the response if it has markdown code blocks
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      topMatches: [],
      overallAnalysis: "Failed to generate analysis",
      nextSteps: [],
      warningsAndCautions: ["AI service temporarily unavailable"]
    };
  }
}
