'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

interface InsightInput {
  question: string;
}

interface InsightOutput {
  insights: Array<{
    headline: string;
    detail: string;
    url?: string;
  }>;
  costEstimates: Array<{
    item: string;
    cost: number;
    currency: string;
  }>;
  visaAlternatives: Array<{
    visaName: string;
    description: string;
  }>;
  chartData?: {
    title: string;
    data: Array<{
      name: string;
      value: number;
    }>;
  };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an expert immigration analyst. Generate 3-5 insights with cost estimates, alternatives, and chart data for: "${input.question}". Return ONLY JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Insights API error:', error);
    return {
      insights: [{ headline: "Research Official Requirements", detail: "Start with government websites.", url: "https://travel.state.gov" }],
      costEstimates: [{ item: "Application Fee", cost: 160, currency: "USD" }],
      visaAlternatives: [{ visaName: "Student Visa", description: "Alternative option." }],
      chartData: { title: "Processing Times", data: [{ name: "USA", value: 90 }] }
    };
  }
}