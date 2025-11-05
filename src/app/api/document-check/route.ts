export const runtime = 'edge';

import { documentChecker } from '@/ai/flows/document-checker';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('📄 Document check request received');

    if (!body.documentDataUri) {
      return new Response(
        JSON.stringify({ error: 'Missing documentDataUri' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const base64Data = body.documentDataUri.split(',')[1];
    if (!base64Data) {
      return new Response(
        JSON.stringify({ error: 'Malformed data URI' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🤖 Calling AI document checker...');
    
    // Call the actual AI flow
    const result = await documentChecker({
      documentDataUri: body.documentDataUri,
      targetCountry: body.targetCountry || 'General',
      visaType: body.visaType || 'Tourist',
    });

    console.log('✅ AI analysis complete');

    return new Response(
      JSON.stringify(result), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: any) {
    console.error('❌ /api/document-check crash:', e);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze document',
        details: e.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}