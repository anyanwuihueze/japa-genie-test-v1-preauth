// src/ai/flows/analyze-proof-of-funds.ts - FIXED
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ProofOfFundsInput {
  userProfile: any;
  financialData: any;
  familyMembers: number;
}

export interface ProofOfFundsOutput {
  analysis: any;
}

export async function analyzeProofOfFunds(input: ProofOfFundsInput): Promise<ProofOfFundsOutput> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",  // ← CHANGED FROM -exp
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2000
    }
  });
  
  const prompt = `Analyze proof of funds: ${JSON.stringify(input)}`;
  
  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  return {
    analysis: JSON.parse(responseText.replace(/```json\n?|\n?```/g, '').trim())
  };
}
