'use server';
/**
 * @fileOverview AI generator function for structured visa insights.
 *
 * This is the core logic that produces:
 * - Key insights (headline + detail + optional URL)
 * - Cost estimates
 * - Visa alternatives
 * - Chart-ready data
 *
 * Called by: insights-flow.ts
 */
import { ai, geminiFlash } from '@/ai/genkit';
import {
  InsightInput,
  InsightInputSchema,
  InsightOutput,
  InsightOutputSchema,
} from '@/ai/schemas/insight-schemas';

// Define the AI prompt using Genkit
const prompt = ai.definePrompt({
  name: 'insightsGeneratorPrompt',
  model: geminiFlash,
  input: { schema: InsightInputSchema },
  output: { schema: InsightOutputSchema },
  prompt: `
You are an expert immigration analyst. Based on the user's question, generate 3–5 highly relevant, actionable, and factual insights.

For each insight:
- Provide a clear headline
- A concise detail
- An official URL if available (e.g., government site, university portal). Only include real, specific links — never generic ones.

Additionally, generate:
1. **Cost Estimates**: Break down 3–5 key costs (e.g., application fee, insurance, rent).
2. **Visa Alternatives**: List 2–3 alternative visa paths or related options.
3. **Chart Data**: Create simple bar chart data comparing 3–5 items (e.g., processing times, cost of living). Include a title and data points (name + value).

User Question: {{{question}}}

Generate all structured data that would be genuinely helpful for someone asking this question. Focus on facts, requirements, timelines, or key considerations.
`
});

// Main export — this is what insights-flow.ts calls
export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  const { output } = await prompt(input);
  if (!output) {
    throw new Error('Failed to generate insights. The AI model did not return a valid response.');
  }
  return output;
}
