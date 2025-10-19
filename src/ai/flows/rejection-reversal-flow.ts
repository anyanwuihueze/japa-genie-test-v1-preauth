'use server';
/**
 * @fileOverview AI-powered visa rejection reversal strategy generator.
 *
 * This flow analyzes a user's visa rejection details and provides a structured,
 * step-by-step comeback strategy.
 *
 * - generateRejectionStrategy - A Genkit flow that returns a structured plan.
 * - RejectionStrategyInput - The Zod schema for the flow's input.
 * - RejectionStrategyOutput - The Zod schema for the flow's structured output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const RejectionStrategyInputSchema = z.object({
  visaType: z.string().describe('The type of visa that was rejected (e.g., Student Visa, Work Permit).'),
  destination: z.string().describe('The destination country for the visa application.'),
  rejectionReason: z.string().optional().describe('The official reason for rejection, as stated in the letter from the embassy.'),
  userBackground: z.string().describe("A brief summary of the user's profile and circumstances (e.g., profession, purpose of travel)."),
});
export type RejectionStrategyInput = z.infer<typeof RejectionStrategyInputSchema>;

const StrategyStepSchema = z.object({
  step: z.number().describe('The step number in the plan.'),
  headline: z.string().describe('A short, actionable headline for the step.'),
  details: z.string().describe('A detailed explanation of what to do in this step, including specific actions to take or documents to prepare.'),
});

export const RejectionStrategyOutputSchema = z.object({
  introduction: z.string().describe('An encouraging introductory sentence for the user.'),
  strategy: z.array(StrategyStepSchema).describe('A list of 3-5 concrete steps for the user to follow to strengthen their reapplication.'),
  conclusion: z.string().describe('A final sentence of encouragement and a call to action.'),
});
export type RejectionStrategyOutput = z.infer<typeof RejectionStrategyOutputSchema>;

// Export a regular async function that calls the flow
export async function generateRejectionStrategy(input: RejectionStrategyInput): Promise<RejectionStrategyOutput> {
  return await generateRejectionStrategyFlow(input);
}


// Define the AI prompt using Genkit for structured output
const rejectionReversalPrompt = ai.definePrompt({
  name: 'rejectionReversalPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: RejectionStrategyInputSchema },
  output: { schema: RejectionStrategyOutputSchema },
  prompt: `
You are Japa Genie, an expert immigration consultant specializing in visa rejection analysis. A user has provided details of their visa rejection. Your task is to create a detailed, encouraging, and highly actionable comeback strategy.

User's situation:
- Visa Type: {{{visaType}}}
- Destination: {{{destination}}}
- Stated Rejection Reason: {{{rejectionReason}}}
- User Background: {{{userBackground}}}

Based on this information, generate a structured strategy. The strategy should consist of 3 to 5 clear, actionable steps. For each step, provide a clear headline and detailed instructions.

Begin with a single sentence of encouragement.
End with a single sentence of encouragement and a call to action.

Focus on addressing the likely root causes of the rejection, even if the official reason is vague. Provide practical advice that an applicant from Africa can use to strengthen their next application.
`,
});

// Define the main flow, but do not export it directly
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
