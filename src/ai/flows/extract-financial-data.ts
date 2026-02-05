'use server';

import { callGemini } from '@/lib/gemini-client';

export interface FinancialData {
  bankAccounts: Array<{
    bank: string;
    balance: number;
    currency: string;
    opened: string;
    accountType: string;
  }>;
  totalAssets: number;
  liquidAssets: number;
  lastUpdated: string;
}

export interface ExtractFinancialDataInput {
  documentContent: string;
  documentName: string;
}

export interface ExtractFinancialDataOutput {
  success: boolean;
  financialData?: FinancialData;
  error?: string;
}

/**
 * AI extracts financial data from bank statement text
 */
export async function extractFinancialData(
  input: ExtractFinancialDataInput
): Promise<ExtractFinancialDataOutput> {
  try {
    const prompt = `Extract financial information from this bank statement:

DOCUMENT NAME: ${input.documentName}

CONTENT:
${input.documentContent}

Extract and return as JSON:
{
  "bankAccounts": [
    {
      "bank": "Bank Name",
      "balance": 25000,
      "currency": "USD",
      "opened": "2023-01-15",
      "accountType": "savings"
    }
  ],
  "totalAssets": 25000,
  "liquidAssets": 25000,
  "lastUpdated": "2024-01-15"
}

Be precise with numbers and dates. Return ONLY valid JSON.`;

    const response = await callGemini(prompt, true);
    const financialData = JSON.parse(response);
    
    return {
      success: true,
      financialData
    };
  } catch (error: any) {
    console.error('Financial extraction failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
