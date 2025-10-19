'use server';
/**
 * @fileOverview AI-powered visa rejection reversal strategy generator.
 */

import { ai } from '@/ai/genkit';
import { 
  RejectionStrategyInputSchema, 
  RejectionStrategyOutputSchema,
  type RejectionStrategyInput,
  type RejectionStrategyOutput 
} from '@/ai/schemas/rejection-reversal-schema';

// RE-EXPORT the types so they can be imported from this file
export type { RejectionStrategyInput, RejectionStrategyOutput };

// Define the AI prompt
const rejectionReversalPrompt = ai.definePrompt({
  name: 'rejectionReversalPrompt',
  model: 'gemini-pro', // Switched to a model better for structured output
  input: { schema: RejectionStrategyInputSchema },
  output: { schema: RejectionStrategyOutputSchema },
  prompt: `
You are Japa Genie, an expert immigration consultant specializing in visa rejection analysis. 
A user has provided details of their visa rejection. Your task is to create a detailed, encouraging, and highly actionable comeback strategy.
Return the response ONLY in the specified JSON format.

User's situation:
- Visa Type: {{{visaType}}}
- Destination: {{{destination}}}
- Stated Rejection Reason: {{{rejectionReason}}}
- User Background: {{{userBackground}}}

Based on this information, generate a structured strategy. The strategy should consist of 3 to 5 clear, actionable steps. For each step, provide a clear headline and detailed instructions.

Begin with a single sentence of encouragement.
End with a single sentence of encouragement and a call to action.

Focus on addressing the likely root causes of the rejection, even if the official reason is vague. Provide practical advice that an applicant from Africa can use to strengthen their next application.

Example of the required JSON output format:
{
  "introduction": "A rejection is not the end, but a chance to come back stronger!",
  "strategy": [
    {
      "step": 1,
      "headline": "Strengthen Your Financial Ties",
      "details": "The reason 'lack of funds' often means lack of proof. You need to provide 6 months of bank statements showing a consistent, stable balance..."
    }
  ],
  "conclusion": "With these steps, your next application will be much stronger. Let's get to work!"
}
`,
});

// Define the Genkit flow (NOT exported)
const generateRejectionStrategyFlow = ai.defineFlow(
  {
    name: 'generateRejectionStrategyFlow',
    inputSchema: RejectionStrategyInputSchema,
    outputSchema: RejectionStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await rejectionReversalPrompt(input);
    if (!output) {
      throw new Error('Failed to generate a rejection strategy. The model did not return a valid response.');
    }
    return output;
  }
);

// ONLY export the async function
export async function generateRejectionStrategy(input: RejectionStrategyInput): Promise<RejectionStrategyOutput> {
  try {
    return await generateRejectionStrategyFlow(input);
  } catch (error) {
    console.error('Error generating rejection strategy:', error);
    throw new Error('Failed to generate rejection strategy. Please try again.');
  }
}
