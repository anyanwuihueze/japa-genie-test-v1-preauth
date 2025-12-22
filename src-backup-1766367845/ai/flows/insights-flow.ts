'use server';
/**
 * src/ai/flows/insights-flow.ts
 *
 * Flow wrapper for generating contextual insights.
 *
 * Exports:
 *  - generateInsightsFlow: the ai.defineFlow flow (keeps flow semantics)
 *  - generateInsights: an async helper function (so client code can call generateInsights directly)
 *
 * NOTE: This file expects:
 *  - src/ai/insights-generator.ts exporting `generateInsights(input)`
 *  - src/ai/schemas/insight-schemas.ts exporting the zod/types:
 *      InsightInput, InsightInputSchema, InsightOutput, InsightOutputSchema
 */
import { ai } from '@/ai/genkit';
import { generateInsights as runGenerator } from '../insights-generator';
import {
  InsightInput,
  InsightInputSchema,
  InsightOutput,
  InsightOutputSchema,
} from '@/ai/schemas/insight-schemas';

export const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: InsightInputSchema,
    outputSchema: InsightOutputSchema,
  },
  async (input: InsightInput): Promise<InsightOutput> => {
    return await runGenerator(input);
  }
);

/**
 * Helper function for convenience.
 * Many client files expect `generateInsights(...)` to be callable directly.
 * This wrapper calls the flow (so any flow-level behavior runs), with a fallback to the generator.
 */
export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  try {
    return await (generateInsightsFlow as any)(input);
  } catch (err) {
    return await runGenerator(input);
  }
}
