'use server';
import { groq } from '@/lib/groq-client';
import { BurnRateTracker } from '@/lib/burnrate-sdk';

interface InterviewQuestionInput {
  visaType: string;
  destination: string;
  userBackground: string;
  previousQuestions: string[];
}

interface InterviewQuestionOutput {
  question: string;
}


const __burnrateTracker = new BurnRateTracker({ apiKey: process.env.BURNRATE_API_KEY || 'br_live_a8fccc8f-13c4-453c-8d10-3ecc77e9fa45_1772718737561_4f8ba36b5b1f' });

export async function generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestionOutput> {
  try {
    const prompt = `You are an expert visa consular officer. Generate ONE realistic visa interview question.

Visa: ${input.visaType}
Destination: ${input.destination} 
Background: ${input.userBackground}
Previous Questions: ${input.previousQuestions.join(', ') || 'None'}

Generate ONE new, relevant question that a real officer would ask.`;

    const completion = await __burnrateTracker.trackGroq('llama-3.3-70b-versatile', () => groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }));
    
    const question = completion.choices[0].message.content?.trim() || '';
    return { question };
  } catch (error: any) {
    console.error('Interview error:', error);
    throw new Error('Failed to generate interview question');
  }
}
