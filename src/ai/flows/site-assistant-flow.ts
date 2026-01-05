'use server';
import Groq from 'groq-sdk';
import { SITE_ASSISTANT_CONTEXT } from '@/lib/site-assistant-context';

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
  try {
    // PROPER GROQ STRUCTURE - SYSTEM MESSAGE FIRST
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are Japa Genie site assistant with this knowledge: ${SITE_ASSISTANT_CONTEXT}. 
          Answer based ONLY on this knowledge. Be concise and helpful.`
        },
        { role: 'user', content: input.question }
      ],
      temperature: 0.3, // Lower for factual consistency
    });
    
    const answer = completion.choices[0].message.content || '';
    return { answer };
  } catch (error) {
    console.error('Site assistant error:', error);
    return { answer: "I apologize, but I'm having trouble accessing our knowledge base right now. Please try asking about our pricing, services, or specific visa questions." };
  }
}
