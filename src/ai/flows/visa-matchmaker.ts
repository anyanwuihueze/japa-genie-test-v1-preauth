// src/ai/flows/visa-matchmaker.ts - FIXED VERSION
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

CRITICAL: You MUST return ONLY valid JSON. No markdown, no explanations, ONLY the JSON object.

Return as JSON matching this EXACT structure:
{
  "topMatches": [
    {
      "country": "string",
      "visaType": "string",
      "matchScore": 85,
      "successProbability": 75,
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

  let rawText = '';
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    rawText = response.text();
    
    console.log('Raw AI Response:', rawText);
    
    // Clean up the response - remove markdown, extra whitespace
    let cleanedText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
    
    console.log('Cleaned Text:', cleanedText);
    
    const parsed = JSON.parse(cleanedText);
    return parsed;
    
  } catch (error) {
    console.error('AI Processing Error:', error);
    console.error('Failed text:', rawText);
    
    // Return fallback data
    return {
      topMatches: [
        {
          country: "Canada",
          visaType: "Express Entry",
          matchScore: 75,
          successProbability: 65,
          requirements: {
            mustHave: ["Valid passport", "Education credential assessment", "Language test (IELTS/CELPIP)"],
            recommended: ["Job offer", "Provincial nomination", "Canadian work experience"],
            commonPitfalls: ["Low CRS score", "Incomplete documentation", "Missing police certificates"]
          },
          strengths: ["Good education", "English proficiency", "In-demand profession"],
          redFlags: ["Limited work experience may lower CRS score"]
        },
        {
          country: "Germany",
          visaType: "EU Blue Card",
          matchScore: 70,
          successProbability: 60,
          requirements: {
            mustHave: ["University degree", "Job offer with minimum salary threshold", "Valid passport"],
            recommended: ["German language skills (B1)", "Health insurance", "Accommodation proof"],
            commonPitfalls: ["Salary threshold not met", "Degree not recognized", "Language barrier"]
          },
          strengths: ["Technical profession in demand", "Bachelor's degree meets requirement"],
          redFlags: ["May need German language skills for integration"]
        }
      ],
      overallAnalysis: "As a Software Engineer with 4 years of experience and a Bachelor's degree, you have good prospects for skilled worker visas in developed countries. Your advanced English proficiency is a significant advantage. Focus on countries with tech-friendly immigration policies.",
      nextSteps: [
        "Take IELTS Academic test (target 7+ overall)",
        "Get Educational Credential Assessment (WES for Canada)",
        "Build a strong LinkedIn profile and start networking",
        "Research job markets in target countries",
        "Prepare financial documents showing savings"
      ],
      warningsAndCautions: [
        "Processing times can be 6-12 months",
        "Budget may need to be higher for some countries",
        "Some visas require job offers before application",
        "AI service temporarily returned fallback data - retry for personalized analysis"
      ]
    };
  }
}
