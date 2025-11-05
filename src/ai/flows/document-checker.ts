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
  prompt: `You are an expert visa application document reviewer. Analyze the provided document thoroughly and check for:

REQUIRED INFORMATION TO VERIFY:
1. Personal Information:
   - Full legal name (must match passport)
   - Date of birth
   - Passport number and expiry date
   - Nationality
   - Contact details (address, phone, email)

2. Travel Information:
   - Purpose of visit (tourism, business, study, etc.)
   - Intended dates of travel
   - Duration of stay
   - Accommodation details
   - Return flight information

3. Financial Documentation:
   - Bank statements (typically last 3-6 months)
   - Proof of employment/income
   - Sponsorship letters (if applicable)
   - Evidence of sufficient funds

4. Supporting Documents:
   - Passport copy (valid for at least 6 months)
   - Photos (correct size and format)
   - Travel insurance
   - Invitation letters (if applicable)
   - Previous visa pages

5. Document Quality Issues:
   - Blurry or unclear text
   - Missing pages or sections
   - Expired documents
   - Incorrect format or size
   - Missing signatures or stamps

Provide a DETAILED report that includes:
- List of ALL documents found in the submission
- What information is present and correct
- What information is MISSING or incomplete
- What information appears INCORRECT or inconsistent
- Any quality issues with the documents
- Specific recommendations for what needs to be fixed

Be thorough and specific. If everything is truly complete and correct, explain what you verified.

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