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

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert immigration analyst. Generate 3-5 insights with cost estimates, alternatives, and chart data for: "${input.question}". Return ONLY JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Insights API error:', error);
    console.error("🔍 INSIGHTS DEBUG - Actual error:", error);
    console.error("🔍 INSIGHTS DEBUG - API Key present:", !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    return {
      insights: [{ headline: "Temporary Service Issue", detail: "The Genie is experiencing technical difficulties. Please try again in a moment." }],
      costEstimates: [],
      visaAlternatives: [],
      chartData: { title: "Processing Times", data: [{ name: "USA", value: 90 }] }
    };
  }
}
