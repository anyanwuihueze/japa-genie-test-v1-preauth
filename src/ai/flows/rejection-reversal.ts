'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  type RejectionStrategyInput,
  type RejectionStrategyOutput 
} from '@/ai/schemas/rejection-reversal-schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type { RejectionStrategyInput, RejectionStrategyOutput };

export async function generateRejectionStrategy(input: RejectionStrategyInput): Promise<RejectionStrategyOutput> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    });

    const prompt = `You are Japa Genie, an expert immigration consultant specializing in visa rejection analysis.

User's situation:
- Visa Type: ${input.visaType}
- Destination: ${input.destination}
- Rejection Reason: ${input.rejectionReason || 'Not provided'}
- Background: ${input.userBackground}

Create a comeback strategy with 3-5 actionable steps. Each step needs: step number, headline, and detailed instructions.

CRITICAL: Respond with ONLY valid JSON. No markdown, no code blocks, no explanations. Just pure JSON.

Format:
{
  "introduction": "One encouraging sentence here",
  "strategy": [
    {"step": 1, "headline": "Action headline", "details": "Detailed explanation"},
    {"step": 2, "headline": "Action headline", "details": "Detailed explanation"},
    {"step": 3, "headline": "Action headline", "details": "Detailed explanation"}
  ],
  "conclusion": "One encouraging conclusion with call to action"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    let cleaned = text
      .trim()
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
    
    const parsed = JSON.parse(cleaned);
    
    if (!parsed.introduction || !Array.isArray(parsed.strategy)) {
      throw new Error('Invalid AI response structure');
    }
    
    const output: RejectionStrategyOutput = {
      introduction: parsed.introduction,
      strategy: parsed.strategy.map((s: any, i: number) => ({
        step: typeof s.step === 'number' ? s.step : i + 1,
        headline: s.headline || `Step ${i + 1}`,
        details: s.details || s.description || 'Follow this guidance.'
      })),
      conclusion: parsed.conclusion || "With proper preparation, you can successfully reapply!"
    };
    
    return output;
    
  } catch (error) {
    console.error('❌ Rejection strategy generation failed:', error);
    
    return {
      introduction: "Don't let this rejection discourage you - there's always a path forward.",
      strategy: [
        {
          step: 1,
          headline: "Analyze the Rejection Letter",
          details: `Review the official rejection letter for your ${input.destination} ${input.visaType} visa.`
        },
        {
          step: 2,
          headline: "Address the Core Issues",
          details: `The rejection reason "${input.rejectionReason || 'not specified'}" indicates specific weaknesses.`
        },
        {
          step: 3,
          headline: "Strengthen Your Documentation",
          details: `Based on your background, compile comprehensive supporting documents.`
        }
      ],
      conclusion: "Many applicants succeed on their second attempt with proper preparation!"
    };
  }
}
