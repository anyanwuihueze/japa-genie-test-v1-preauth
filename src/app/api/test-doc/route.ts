import { NextResponse } from 'next/server';
import { documentChecker } from '@/ai/flows/document-checker';
import fs from 'fs';

export async function GET() {
  try {
    const pdfBuffer = fs.readFileSync('/home/user/uploads/statement.pdf');
    const base64 = pdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64}`;
    
    const result = await documentChecker({
      documentDataUri: dataUri,
      targetCountry: 'USA',
      visaType: 'Tourist'
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
