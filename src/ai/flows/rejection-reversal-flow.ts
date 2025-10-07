'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface RejectionStrategyInput {
  visaType: string;
  destination: string;
  rejectionReason: string;
  userBackground: string;
}

interface RejectionStrategyOutput {
  strategy: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateRejectionStrategy(input: RejectionStrategyInput): Promise<RejectionStrategyOutput> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are Japa Genie, an expert immigration consultant. Create a detailed comeback strategy for a visa rejection.

Visa: ${input.visaType}
Destination: ${input.destination}
Rejection Reason: ${input.rejectionReason}
Background: ${input.userBackground}

Provide an encouraging, step-by-step strategy to address the rejection and improve chances on reapplication.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const strategy = response.text().trim();

    return { strategy };
  } catch (error: any) {
    console.error('Rejection strategy error:', error);
    throw new Error('Failed to generate rejection strategy');
  }
}
