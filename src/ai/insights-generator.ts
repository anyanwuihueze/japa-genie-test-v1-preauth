'use server';

import Groq from 'groq-sdk';
import { InsightInput, InsightOutput } from '@/ai/schemas/insight-schemas';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY!
});

export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  const prompt = `You are an expert immigration analyst.

Generate insights for: "${input.question}"

User Profile: ${JSON.stringify(input.userProfile, null, 2)}

Return ONLY valid JSON in this EXACT format (no markdown, no backticks):
{
  "insights": [
    {
      "headline": "Clear headline",
      "detail": "Detailed explanation",
      "url": "optional link"
    }
  ],
  "costEstimates": [
    {
      "item": "Cost item name",
      "cost": 1000,
      "currency": "USD"
    }
  ],
  "visaAlternatives": [
    {
      "visaName": "Alternative visa name",
      "description": "Why this alternative works"
    }
  ],
  "chartData": {
    "title": "Processing Times by Country",
    "data": [
      {"name": "USA", "value": 90},
      {"name": "UK", "value": 60}
    ]
  }
}

Generate 3-5 insights, 2-4 cost estimates, 2-3 alternatives, and chart data with 3-5 countries.`;

  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert immigration analyst. Return ONLY valid JSON, no other text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    let text = completion.choices[0]?.message?.content?.trim() || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse JSON, fallback if invalid
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', text);
      return createFallbackInsights();
    }
  } catch (error) {
    console.error('Insights API error:', error);
    return createFallbackInsights();
  }
}

function createFallbackInsights(): InsightOutput {
  return {
    insights: [{ headline: "Temporary Service Issue", detail: "The Genie is experiencing technical difficulties. Please try again in a moment." }],
    costEstimates: [],
    visaAlternatives: [],
    chartData: { title: "Processing Times", data: [{ name: "USA", value: 90 }] }
  };
}
