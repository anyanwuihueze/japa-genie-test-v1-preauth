
'use server';
import Groq from 'groq-sdk';
import { SITE_ASSISTANT_CONTEXT } from '@/lib/site-assistant-context'; // <-- IMPORT THE KNOWLEDGE

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface SiteAssistantInput {
  question: string;
}

interface SiteAssistantOutput {
  answer: string;
}

export async function siteAssistant(input: SiteAssistantInput): Promise<SiteAssistantOutput> {
  // NEW, MORE DETAILED PROMPT
  const prompt = `${SITE_ASSISTANT_CONTEXT}

User Question: "${input.question}"`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5, // Lower temperature for more factual answers
    });
    
    return { answer: completion.choices[0].message.content || '' };
  } catch (error) {
    console.error('Site assistant error:', error);
    return { answer: "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?" };
  }
}
