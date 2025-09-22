'use server';
/**
 * @fileOverview AI flow to generate mock visa interview questions.
 *
 * - generateInterviewQuestion - A function that generates a visa interview question based on user's visa type, destination and background.
 * - InterviewQuestionInput - The input type for the generateInterviewQuestion function.
 * - InterviewQuestionOutput - The return type for the generateInterviewQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewQuestionInputSchema = z.object({
  visaType: z.string().describe('The type of visa the user is applying for (e.g., Student, Work, Tourist).'),
  destination: z.string().describe('The country the user is applying to.'),
  userBackground: z.string().describe("A brief summary of the user's background and purpose of travel."),
  previousQuestions: z.array(z.string()).describe('A list of questions that have already been asked in this session to avoid repetition.'),
});
export type InterviewQuestionInput = z.infer<typeof InterviewQuestionInputSchema>;

const InterviewQuestionOutputSchema = z.object({
  question: z.string().describe('A single, relevant, and realistic visa interview question.'),
});
export type InterviewQuestionOutput = z.infer<typeof InterviewQuestionOutputSchema>;

export async function generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestionOutput> {
  return generateInterviewQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: {schema: InterviewQuestionInputSchema},
  output: {schema: InterviewQuestionOutputSchema},
  prompt: `You are an expert visa consular officer conducting a mock interview. Your task is to generate a single, realistic interview question.

  The applicant's details are as follows:
  - Visa Type: {{{visaType}}}
  - Destination Country: {{{destination}}}
  - Background: {{{userBackground}}}

  You have already asked the following questions in this session:
  {{#if previousQuestions}}
  {{#each previousQuestions}}
  - {{{this}}}
  {{/each}}
  {{else}}
  (No questions asked yet)
  {{/if}}

  Based on all this information, generate ONE new, relevant, and distinct question for the applicant. Do not repeat any of the previous questions. The question should be something a real consular officer would ask.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const generateInterviewQuestionFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionFlow',
    inputSchema: InterviewQuestionInputSchema,
    outputSchema: InterviewQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate interview question. The AI model did not return a valid response.');
    }
    return output;
  }
);
