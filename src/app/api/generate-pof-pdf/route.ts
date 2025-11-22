// src/app/api/generate-pof-pdf/route.ts - WITH NODEJS RUNTIME
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePOFPDF } from '@/lib/pdf-generator';

// ✅ CRITICAL: Use nodejs runtime for jsPDF
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisData, userProfile, destinationCountry, visaType, familyMembers } = await request.json();

    // Validate required data
    if (!analysisData || !analysisData.summary) {
      return NextResponse.json(
        { error: 'Invalid analysis data - please run analysis first' },
        { status: 400 }
      );
    }

    console.log('📄 Generating PDF for user:', user.id);

    // Generate PDF
    const pdfBuffer: Buffer = generatePOFPDF({
      analysisData,
      userProfile,
      destinationCountry,
      visaType,
      familyMembers
    });

    console.log('✅ PDF generated successfully');

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="POF-Report-${destinationCountry}-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('❌ PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed: ' + error.message },
      { status: 500 }
    );
  }
}