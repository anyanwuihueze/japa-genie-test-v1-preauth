'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface InterviewQuestionInput {
  visaType: string;
  destination: string;
  userBackground: string;
  previousQuestions: string[];
}

interface InterviewQuestionOutput {
  question: string;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestionOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert visa consular officer. Generate ONE realistic visa interview question.

Visa: ${input.visaType}
Destination: ${input.destination} 
Background: ${input.userBackground}
Previous Questions: ${input.previousQuestions.join(', ') || 'None'}

Generate ONE new, relevant question that a real officer would ask.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text().trim();

    return { question };
  } catch (error: any) {
    console.error('Interview error:', error);
    throw new Error('Failed to generate interview question');
  }
}
