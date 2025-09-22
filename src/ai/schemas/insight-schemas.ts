/**
 * @fileOverview Schemas and types for the insights generator flow.
 *
 * - InsightInput - The input type for the generateInsights function.
 * - InsightOutput - The return type for the generateInsights function.
 * - InsightInputSchema - The Zod schema for the input.
 * - InsightOutputSchema - The Zod schema for the output.
 */

import {z} from 'genkit';

export const InsightInputSchema = z.object({
  question: z.string().describe("The user's question about their visa or travel plans."),
});
export type InsightInput = z.infer<typeof InsightInputSchema>;

export const InsightOutputSchema = z.object({
    insights: z.array(z.object({
        headline: z.string().describe("The key insight or topic header."),
        detail: z.string().describe("A detailed explanation or data point for the insight."),
        url: z.string().optional().describe("An optional, highly relevant URL for the user to learn more."),
    })).describe("A list of 3-5 key insights related to the user's question."),
    costEstimates: z.array(z.object({
        item: z.string().describe("The item or service being estimated."),
        cost: z.number().describe("The estimated cost as a number."),
        currency: z.string().describe("The currency of the cost (e.g., USD, CAD, EUR)."),
    })).describe("A list of key cost estimates."),
    visaAlternatives: z.array(z.object({
        visaName: z.string().describe("The name of the alternative visa."),
        description: z.string().describe("A brief description of the alternative visa."),
    })).describe("A list of alternative visa options."),
    chartData: z.object({
        title: z.string().describe("A descriptive title for the chart."),
        data: z.array(z.object({
            name: z.string().describe("The name of the data point (e.g., a country, a city, a category)."),
            value: z.number().describe("The numeric value of the data point."),
        })).describe("An array of data points for a bar chart.")
    }).optional().describe("Data suitable for generating a simple bar chart. This field is optional.")
});
export type InsightOutput = z.infer<typeof InsightOutputSchema>;
