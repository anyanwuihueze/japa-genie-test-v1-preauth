import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SiteAssistantInput {
  question: string;
}

interface SiteAssistantOutput {
  answer: string;
}

export async function siteAssistant(input: SiteAssistantInput): Promise<SiteAssistantOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an enthusiastic sales assistant for Japa Genie, an AI-powered visa guidance platform. Be warm, energetic, and guide users toward signing up.

User Question: "${input.question}"

Respond naturally and persuasively to move them toward using Japa Genie's services.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { answer: response.text() };
  } catch (error) {
    console.error('Site assistant error:', error);
    return { answer: "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?" };
  }
}