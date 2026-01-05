'use server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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
  successRate: number;
  processingTime: string;
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
  const prompt = `ACT AS: Expert immigration consultant specializing in African professionals with 15+ years experience
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

Return as JSON matching this EXACT structure:
{
  "topMatches": [
    {
      "country": "string",
      "visaType": "string",
      "matchScore": 85,
      "successRate": 75,
      "processingTime": "6-8 months",
      "requirements": {
        "mustHave": ["string"],
        "recommended": ["string"],
        "commonPitfalls": ["string"]
      },
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "redFlags": ["string"]
    }
  ],
  "overallAnalysis": "string",
  "nextSteps": ["string"],
  "warningsAndCautions": ["string"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const rawText = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(rawText);
    
    return parsed;
    
  } catch (error) {
    console.error('Visa matchmaker error:', error);
    
    // Fallback response
    return {
      topMatches: [
        {
          country: "Canada",
          visaType: "Express Entry",
          matchScore: 75,
          successRate: 65,
          processingTime: "6-8 months",
          requirements: {
            mustHave: ["Valid passport", "Education credential assessment", "Language test"],
            recommended: ["Job offer", "Provincial nomination"],
            commonPitfalls: ["Low CRS score", "Incomplete documentation"]
          },
          strengths: ["Good education match", "English proficiency meets requirement", "Profession in demand"],
          redFlags: ["Limited work experience may lower CRS score"]
        }
      ],
      overallAnalysis: "Strong candidate for skilled worker visas with good prospects.",
      nextSteps: ["Take language test", "Get credential assessment", "Build professional network"],
      warningsAndCautions: ["Consider premium upgrade for personalized guidance"]
    };
  }
}
