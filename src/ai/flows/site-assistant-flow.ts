'use server';
import { groq } from '@/lib/groq-client';
import { SITE_ASSISTANT_CONTEXT } from '@/lib/site-assistant-context';
import { BurnRateTracker } from '@/lib/burnrate-sdk';

interface SiteAssistantInput {
  question: string;
}

interface SiteAssistantOutput {
  answer: string;
}


const __burnrateTracker = new BurnRateTracker({ apiKey: process.env.BURNRATE_API_KEY || 'br_live_a8fccc8f-13c4-453c-8d10-3ecc77e9fa45_1772718737561_4f8ba36b5b1f' });

export async function siteAssistant(input: SiteAssistantInput): Promise<SiteAssistantOutput> {
  try {
    // PROPER GROQ STRUCTURE - SYSTEM MESSAGE FIRST
    const completion = await __burnrateTracker.trackGroq('llama-3.3-70b-versatile', () => groq.chat.completions.create({
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
    }));
    
    const answer = completion.choices[0].message.content || '';
    return { answer };
  } catch (error) {
    console.error('Site assistant error:', error);
    return { answer: "I apologize, but I'm having trouble accessing our knowledge base right now. Please try asking about our pricing, services, or specific visa questions." };
  }
}
