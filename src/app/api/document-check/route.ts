export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('📄 Incoming body:', body);

    if (!body.documentDataUri) {
      return new Response(JSON.stringify({ error: 'Missing documentDataUri' }), { status: 400 });
    }

    const base64Data = body.documentDataUri.split(',')[1];
    if (!base64Data) {
      return new Response(JSON.stringify({ error: 'Malformed data URI' }), { status: 400 });
    }

    // TODO: your AI analysis here
    const report = 'Document appears valid. No obvious errors detected.';

    return new Response(JSON.stringify({ report }), { status: 200 });
  } catch (e: any) {
    console.error('❌ /api/document-check crash:', e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}