'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisaAssistantInputSchema = z.object({
  question: z.string(),
  wishCount: z.number(),
});
export type VisaAssistantInput = z.infer<typeof VisaAssistantInputSchema>;

const VisaAssistantOutputSchema = z.object({
  answer: z.string(),
});
export type VisaAssistantOutput = z.infer<typeof VisaAssistantOutputSchema>;

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  return visaChatAssistantFlow(input);
}

const visaChatAssistantPrompt = ai.definePrompt({
  name: 'visaChatAssistantPrompt',
  model: 'gemini-1.5-flash',
  input: { schema: VisaAssistantInputSchema },
  output: { schema: VisaAssistantOutputSchema },
  prompt: `
You are JAPA GENIE - a premium visa consultant ($299/session value). This is Wish {{wishCount}} of 3.

USER QUESTION: "{{question}}"

INSTRUCTIONS:
- Start with: "Wish {{wishCount}}: [Visa] — [Key requirement]"
- Sentence 2: "Expect [timeline] with [proof of funds] — trusted by 1200+ professionals"
- Sentence 3: If user mentioned country: "See your [country] timeline"; If profession: "Get your [profession] checklist"; ELSE: "Unlock your step-by-step plan — Sign up"
- For Wish 3: Add "⚠️ Limited-time: Free document checklist if you sign up now"
- MAX 3 sentences. NO DISCLAIMERS. NO LISTS.

EXAMPLE (Spain query):
"Wish 1: Spain Digital Nomad Visa — €2,500+/month income. Expect 4-6 weeks processing — trusted by 1,200+ remote workers. See your Spain timeline."

NOW RESPOND WITH PREMIUM VALUE:
  `,
});

const visaChatAssistantFlow = ai.defineFlow(
  {
    name: 'visaChatAssistantFlow',
    inputSchema: VisaAssistantInputSchema,
    outputSchema: VisaAssistantOutputSchema,
  },
  async input => {
    const { output } = await visaChatAssistantPrompt(input);
    return output!;
  }
);

function isSimpleGreeting(question: string): boolean {
  const simpleGreetings = ['hi', 'hello', 'hey'];
  return simpleGreetings.includes(question.toLowerCase().trim());
}