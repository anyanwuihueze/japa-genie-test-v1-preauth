import { z } from 'zod';

export const InsightInputSchema = z.object({
  question: z.string().optional(),
  userProfile: z.object({
    age: z.number().optional(),
    profession: z.string().optional(),
    country: z.string().optional(),
    destinationCountry: z.string().optional(),
    visaType: z.string().optional(),
  }).optional(),
});

export type InsightInput = z.infer<typeof InsightInputSchema>;

// ✅ MATCHES YOUR WORKING insights-generator.ts
export const InsightOutputSchema = z.object({
  insights: z.array(z.object({
    headline: z.string(),
    detail: z.string(),
    url: z.string().optional(),
  })),
  costEstimates: z.array(z.object({
    item: z.string(),
    cost: z.number(),
    currency: z.string(),
  })),
  visaAlternatives: z.array(z.object({
    visaName: z.string(),
    description: z.string(),
  })),
  chartData: z.object({
    title: z.string(),
    data: z.array(z.object({
      name: z.string(),
      value: z.number(),
    })),
  }).optional(),
});

export type InsightOutput = z.infer<typeof InsightOutputSchema>;
