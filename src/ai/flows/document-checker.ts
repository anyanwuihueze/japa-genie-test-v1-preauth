'use server';

import { ai, geminiFlash } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentCheckerInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A visa application document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DocumentCheckerInput = z.infer<typeof DocumentCheckerInputSchema>;

const DocumentCheckerOutputSchema = z.object({
  report: z.string().describe('A report of any missing or incorrectly formatted information found in the document.'),
});
export type DocumentCheckerOutput = z.infer<typeof DocumentCheckerOutputSchema>;

export async function documentChecker(input: DocumentCheckerInput): Promise<DocumentCheckerOutput> {
  return documentCheckerFlow(input);
}

const documentCheckerPrompt = ai.definePrompt({
  name: 'documentCheckerPrompt',
  model: geminiFlash,
  input: { schema: DocumentCheckerInputSchema },
  output: { schema: DocumentCheckerOutputSchema },
  prompt: `You are an AI assistant that checks visa application documents for errors.

You will receive the document as a data URI. Extract the text from the document and check for any missing or incorrectly formatted information.

Return a report of any errors found.

Document: {{media url=documentDataUri}}`,
});

const documentCheckerFlow = ai.defineFlow(
  {
    name: 'documentCheckerFlow',
    inputSchema: DocumentCheckerInputSchema,
    outputSchema: DocumentCheckerOutputSchema,
  },
  async input => {
    const { output } = await documentCheckerPrompt(input);
    return output!;
  }
);
