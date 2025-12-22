import { z } from 'zod';

export const RejectionStrategyInputSchema = z.object({
  visaType: z.string().describe('The type of visa that was rejected (e.g., Student Visa, Work Permit).'),
  destination: z.string().describe('The destination country for the visa application.'),
  rejectionReason: z.string().optional().describe('The official reason for rejection, as stated in the letter from the embassy.'),
  userBackground: z.string().describe("A brief summary of the user's profile and circumstances (e.g., profession, purpose of travel)."),
});

export type RejectionStrategyInput = z.infer<typeof RejectionStrategyInputSchema>;

export const StrategyStepSchema = z.object({
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