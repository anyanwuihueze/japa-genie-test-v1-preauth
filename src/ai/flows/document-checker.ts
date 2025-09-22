'use server';

/**
 * @fileOverview AI-powered document checker flow.
 *
 * This flow allows users to upload visa application documents and identifies any missing or incorrectly formatted information.
 *
 * - documentChecker - A function that accepts document data and returns a report of errors.
 * - DocumentCheckerInput - The input type for the documentChecker function.
 * - DocumentCheckerOutput - The return type for the documentChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: DocumentCheckerInputSchema},
  output: {schema: DocumentCheckerOutputSchema},
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
    const {output} = await documentCheckerPrompt(input);
    return output!;
  }
);
