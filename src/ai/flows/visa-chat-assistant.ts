import { getCurrencyInfoWithLiveRate } from "@/lib/currency-live";
'use server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

/* ---------- TYPES ---------- */
interface VisaAssistantInput {
  question: string;
  wishCount: number;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userContext?: {
    name?: string;
    country?: string;
    destination?: string;
    profession?: string;
    visaType?: string;
    age?: number;
    userType?: string;
    timelineUrgency?: string;
  };
  isSignedIn?: boolean;
}

interface VisaAssistantOutput {
  answer: string;
  insights?: {
    suggestedCountries?: Array<{
      name: string;
      visaType: string;
      estimatedCost: number;
      processingTimeMonths: number;
      pros: string[];
      cons: string[];
    }>;
    timeline?: Array<{ step: string; durationWeeks: number }>;
    alternativeStrategies?: string[];
    difficulty?: string;
    recommendations?: string[];
  };
}

/* ---------- SYSTEM PROMPT - SEPARATE FROM USER CONTEXT ---------- */
const SYSTEM_PROMPT = `You are Japa Genie, a world-class visa strategist with 8+ years analyzing African → Global migration patterns.
Speak in Markdown, cite real stats, never guarantee approval.

CRITICAL OUTPUT FORMAT - You MUST return valid JSON with ALL these fields:
{
  "chatResponse": "your detailed markdown answer with stats and citations",
  "suggestedCountries": [
    {
      "name": "Country Name",
      "visaType": "Work Visa Type", 
      "estimatedCost": 5000,
      "processingTimeMonths": 3,
      "pros": ["advantage 1", "advantage 2", "advantage 3"],
      "cons": ["challenge 1", "challenge 2"]
    }
  ],
  "timeline": [
    {"step": "Research and document preparation", "durationWeeks": 2},
    {"step": "Submit application", "durationWeeks": 1},
    {"step": "Wait for processing", "durationWeeks": 8}
  ],
  "alternativeStrategies": ["Alternative path description"]
}

MANDATORY: For ANY visa question, include AT LEAST:
- 2-3 suggestedCountries with complete data
- 4-6 timeline steps showing the full process
- 2-3 alternativeStrategies

Even for simple questions, provide these insights to help users visualize their options.`;

function buildUserPrompt(input: VisaAssistantInput): string {
  const { question, conversationHistory = [], userContext } = input;
  
  // Build conversation history cleanly
  const history = conversationHistory.length
    ? `Previous conversation:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n`
    : '';
    
  // Build user context cleanly
  const ctx = userContext
    ? `User Profile: ${userContext.name || 'User'} (${userContext.age || 'unknown'} years) from ${userContext.country || 'unknown'} → ${userContext.destination || 'unknown'} (${userContext.visaType || 'unknown'}), works as ${userContext.profession || 'unknown'}, timeline: ${userContext.timelineUrgency || 'unknown'}`
    : 'No profile data available';

  return `${history}${ctx}\n\nCurrent Question: ${question}`;
}

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { wishCount, isSignedIn } = input;

  try {
    // PROPER GROQ MESSAGE STRUCTURE - SEPARATE SYSTEM AND USER
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(input) }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const data = JSON.parse(completion.choices[0].message.content || '{}');

    let answer = data.chatResponse?.replace(/\(?\d+\s*wishes?\s*remaining\)?/gi, '').trim() || '';

    if (!isSignedIn) {
      const left = Math.max(0, 3 - wishCount);
      answer += `\n\n_(${left} ${left === 1 ? 'wish' : 'wishes'} remaining)_`;
    }

    const hasInsights =
      (data.suggestedCountries?.length > 0) ||
      (data.timeline?.length > 0) ||
      (data.alternativeStrategies?.length > 0);

    return {
      answer,
      insights: hasInsights
        ? {
            suggestedCountries: data.suggestedCountries || [],
            timeline: data.timeline || [],
            alternativeStrategies: data.alternativeStrategies || [],
            difficulty: data.suggestedCountries?.length ? 'Medium' : undefined,
            recommendations: data.alternativeStrategies || [],
          }
        : undefined,
    };
  } catch (error) {
    console.error('Visa chat assistant error:', error);
    
    // Fallback response
    return {
      answer: "I'm having trouble processing your visa question right now. Please try asking about specific countries, visa types, or your eligibility requirements.",
      insights: undefined
    };
  }
}
