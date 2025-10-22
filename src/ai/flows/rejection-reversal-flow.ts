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
    // Match the working chat route configuration EXACTLY
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
    
    console.log('Raw AI response:', text);
    
    // Clean up response more aggressively
    let cleaned = text
      .trim()
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '') // Remove any text before first {
      .replace(/[^}]*$/, '') // Remove any text after last }
      .trim();
    
    console.log('Cleaned response:', cleaned);
    
    // Parse JSON
    const parsed = JSON.parse(cleaned);
    
    // Validate and structure output
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
    console.error('Error details:', error instanceof Error ? error.message : error);
    
    // Return robust fallback response
    return {
      introduction: "Don't let this rejection discourage you - there's always a path forward.",
      strategy: [
        {
          step: 1,
          headline: "Analyze the Rejection Letter",
          details: `Carefully review the official rejection letter for your ${input.destination} ${input.visaType}. Identify the specific reasons cited by the visa officer. Common issues include insufficient documentation, unclear purpose of visit, or concerns about ties to home country.`
        },
        {
          step: 2,
          headline: "Address the Core Issues",
          details: `The rejection reason "${input.rejectionReason || 'not specified'}" indicates specific weaknesses in your application. Focus on gathering evidence and documentation that directly addresses these concerns.`
        },
        {
          step: 3,
          headline: "Strengthen Your Documentation",
          details: `Based on your background: "${input.userBackground}", compile comprehensive supporting documents. This includes proof of financial stability, ties to home country, employment/study records, and purpose of visit documentation.`
        },
        {
          step: 4,
          headline: "Prepare a Stronger Application",
          details: "Organize all documents logically. Include a cover letter that acknowledges the previous rejection and explains how you've addressed each concern. Ensure all documents are properly formatted, translated if necessary, and current."
        },
        {
          step: 5,
          headline: "Consider Professional Review",
          details: "Before reapplying, have your complete application package reviewed by an experienced immigration consultant. They can identify potential red flags and suggest improvements you might have missed."
        }
      ],
      conclusion: "Many applicants succeed on their second attempt with proper preparation. Take your time, address each concern thoroughly, and reapply with confidence!"
    };
  }
}