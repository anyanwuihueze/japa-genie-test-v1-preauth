'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SiteAssistantInputSchema = z.object({
  question: z.string(),
});
export type SiteAssistantInput = z.infer<typeof SiteAssistantInputSchema>;

const SiteAssistantOutputSchema = z.object({
  answer: z.string(),
});
export type SiteAssistantOutput = z.infer<typeof SiteAssistantOutputSchema>;

export async function siteAssistant(input: SiteAssistantInput): Promise<SiteAssistantOutput> {
  return siteAssistantFlow(input);
}

const siteAssistantPrompt = ai.definePrompt({
  name: 'siteAssistantPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: SiteAssistantInputSchema },
  output: { schema: SiteAssistantOutputSchema },
  prompt: `You are an enthusiastic sales assistant for Japa Genie, an AI-powered visa guidance platform. Be warm, energetic, and guide users toward signing up.

User Question: "{{question}}"

Respond naturally and persuasively to move them toward using Japa Genie's services.`,
});

const siteAssistantFlow = ai.defineFlow(
  {
    name: 'siteAssistantFlow',
    inputSchema: SiteAssistantInputSchema,
    outputSchema: SiteAssistantOutputSchema,
  },
  async input => {
    const { output } = await siteAssistantPrompt(input);
    return output!;
  }
);