'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  type RejectionStrategyInput,
  type RejectionStrategyOutput 
} from '@/ai/schemas/rejection-reversal-schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type { RejectionStrategyInput, RejectionStrategyOutput };

export async function generateRejectionStrategy(input: RejectionStrategyInput): Promise<RejectionStrategyOutput> {
  // Use EXACT same model as your working site assistant
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are Japa Genie, an expert immigration consultant specializing in visa rejection analysis.

User's situation:
- Visa Type: ${input.visaType}
- Destination: ${input.destination}
- Rejection Reason: ${input.rejectionReason || 'Not provided'}
- Background: ${input.userBackground}

Create a comeback strategy with 3-5 actionable steps. Each step needs: step number, headline, and detailed instructions.

Respond with valid JSON in this EXACT format:
{
  "introduction": "One encouraging sentence here",
  "strategy": [
    {"step": 1, "headline": "Action headline", "details": "Detailed explanation"},
    {"step": 2, "headline": "Action headline", "details": "Detailed explanation"},
    {"step": 3, "headline": "Action headline", "details": "Detailed explanation"}
  ],
  "conclusion": "One encouraging conclusion with call to action"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response
    let cleaned = text.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    
    // Validate structure and provide defaults if needed
    const output: RejectionStrategyOutput = {
      introduction: parsed.introduction || "Let's turn this rejection into a successful reapplication.",
      strategy: Array.isArray(parsed.strategy) 
        ? parsed.strategy.map((s: any, i: number) => ({
            step: s.step || i + 1,
            headline: s.headline || `Step ${i + 1}`,
            details: s.details || s.description || 'Follow this guidance.'
          }))
        : [
            {
              step: 1,
              headline: "Review Your Application",
              details: `Review your ${input.visaType} application for ${input.destination} and identify areas for improvement.`
            },
            {
              step: 2,
              headline: "Strengthen Documentation",
              details: "Gather additional supporting documents that address the rejection reason."
            },
            {
              step: 3,
              headline: "Prepare for Reapplication",
              details: "Create a comprehensive application package with all improvements implemented."
            }
          ],
      conclusion: parsed.conclusion || "With proper preparation, you can successfully reapply!"
    };
    
    return output;
    
  } catch (error) {
    console.error('Rejection strategy error:', error);
    
    // Return fallback response instead of throwing
    return {
      introduction: "Don't let this rejection discourage you - there's always a path forward.",
      strategy: [
        {
          step: 1,
          headline: "Analyze the Rejection",
          details: `Review the rejection letter carefully. For ${input.destination} ${input.visaType} applications, common issues include insufficient documentation, unclear purpose of visit, or concerns about ties to home country.`
        },
        {
          step: 2,
          headline: "Address the Core Issue",
          details: `The rejection reason "${input.rejectionReason || 'not specified'}" suggests you need to strengthen specific areas of your application. Focus on providing clear, verifiable documentation.`
        },
        {
          step: 3,
          headline: "Strengthen Your Profile",
          details: `Based on your background as ${input.userBackground}, gather evidence that demonstrates strong ties to your home country and clear intentions for your visit.`
        },
        {
          step: 4,
          headline: "Prepare Comprehensive Documentation",
          details: "Compile all required documents plus additional supporting evidence. Ensure everything is properly formatted, translated if necessary, and organized logically."
        }
      ],
      conclusion: "With thorough preparation and the right documentation, many rejected applicants succeed on their second attempt. Let's get your application approved!"
    };
  }
}