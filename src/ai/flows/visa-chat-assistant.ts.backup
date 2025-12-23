import { getCurrencyInfoWithLiveRate } from "@/lib/currency-live";
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

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

/* ---------- SCHEMA (bypass TS strictness) ---------- */
const visaInsightsSchema = {
  type: 'OBJECT',
  properties: {
    chatResponse: { type: 'STRING' },
    suggestedCountries: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          visaType: { type: 'STRING' },
          estimatedCost: { type: 'NUMBER' },
          processingTimeMonths: { type: 'NUMBER' },
          pros: { type: 'ARRAY', items: { type: 'STRING' } },
          cons: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['name', 'visaType', 'estimatedCost', 'processingTimeMonths', 'pros', 'cons'],
      },
    },
    timeline: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          step: { type: 'STRING' },
          durationWeeks: { type: 'NUMBER' },
        },
        required: ['step', 'durationWeeks'],
      },
    },
    alternativeStrategies: {
      type: 'ARRAY',
      items: { type: 'STRING' },
    },
  },
  required: ['chatResponse'],
};

/* ---------- PROMPT BUILDER ---------- */
const SYSTEM_PROMPT = `You are Japa Genie, a world-class visa strategist with 8+ years analyzing African → Global migration patterns.
Speak in Markdown, cite real stats, never guarantee approval.
Use the EXACT user details (age, country, destination, etc.) provided in the prompt below.`;

function buildPrompt(input: VisaAssistantInput): string {
  const { question, conversationHistory = [], userContext } = input;
  const ctx = userContext
    ? `${userContext.name || 'User'} (${userContext.age || 'unknown'} years) from ${userContext.country || 'unknown'} → ${userContext.destination || 'unknown'} (${userContext.visaType || 'unknown'}), works as ${userContext.profession || 'unknown'}, timeline: ${userContext.timelineUrgency || 'unknown'}`
    : 'Profile not yet collected';
  const history = conversationHistory.length
    ? `History:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n`
    : '';
  return `${history}Context: ${ctx}\nQuestion: ${question}`;
}

/* ---------- EXPORTED ACTION ---------- */
export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { wishCount, isSignedIn } = input;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', 
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: visaInsightsSchema as any,
    },
  });

  const result = await model.generateContent(buildPrompt(input));
  const data = JSON.parse(result.response.text());

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
}