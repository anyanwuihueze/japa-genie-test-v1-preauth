// src/ai/flows/visa-chat-assistant.ts
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

interface VisaAssistantInput {
  question: string;
  wishCount: number;
}

interface VisaAssistantOutput {
  answer: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { question, wishCount } = input;

  // Determine wish ordinal and counter
  const ordinal = wishCount === 1 ? 'first' : wishCount === 2 ? 'second' : 'final';
  const wishCounter = `${wishCount}/3`;

  // Handle greetings without AI
  const lowerQuestion = question.toLowerCase().trim();
  if (isSimpleGreeting(lowerQuestion)) {
    return {
      answer: `Hello, Pathfinder! Welcome to your ${ordinal} wish with Japa Genie. I'm here to guide you through the magical world of visas. What visa journey would you like to explore today?`
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 🔥 PREMIUM CONVERSION PROMPT (COPY-PASTE READY)
  const promptText = `
You are JAPA GENIE - a premium visa consultant ($299/session value). This is Wish ${wishCount} of 3.

USER QUESTION: "${question}"

INSTRUCTIONS:
- Start with: "Wish ${wishCount}: [Visa] — [Key requirement]"
- Sentence 2: "Expect [timeline] with [proof of funds] — trusted by ${Math.floor(Math.random() * 500) + 750}+ professionals"
- Sentence 3: If user mentioned country: "See your [country] timeline"; If profession: "Get your [profession] checklist"; ELSE: "Unlock your step-by-step plan — Sign up"
- For Wish 3: Add "⚠️ Limited-time: Free document checklist if you sign up now"
- MAX 3 sentences. NO DISCLAIMERS. NO LISTS.

EXAMPLE (Spain query):
"Wish 1: Spain Digital Nomad Visa — €2,500+/month income. Expect 4-6 weeks processing — trusted by 1,200+ remote workers. See your Spain timeline."

NOW RESPOND WITH PREMIUM VALUE:
`;

  try {
    // ✅ CORRECT GEMINI API CALL (FIXES RED FLAG)
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: promptText }] as Part[],
      }],
      generationConfig: {
        maxOutputTokens: 90,
        temperature: 0.6,
        topP: 0.9,
        topK: 30,
      },
    });

    const response = result.response;
    let text = response.text();

    // Clean and cap response
    text = text
      .replace(/\*\*/g, '')
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Enforce premium structure
    if (!text.startsWith(`Wish ${wishCount}:`)) {
      text = `Wish ${wishCount}: ${text}`;
    }

    // Final length cap (UI-safe)
    return {
      answer: text.length > 320 ? text.slice(0, 317) + '...' : text
    };

  } catch (error: any) {
    console.error('Gemini API error:', error.message || error);
    
    // Premium fallback with conversion CTA
    const socialProof = Math.floor(Math.random() * 500) + 750;
    return {
      answer: `Wish ${wishCount}: I'm temporarily unable to access full data. Trusted by ${socialProof}+ professionals — Unlock your step-by-step plan — Sign up`
    };
  }
}

function isSimpleGreeting(question: string): boolean {
  const simpleGreetings = ['hi', 'hello', 'hey'];
  return simpleGreetings.includes(question);
}