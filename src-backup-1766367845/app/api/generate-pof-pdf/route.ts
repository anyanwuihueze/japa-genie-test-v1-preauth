// src/app/api/generate-pof-pdf/route.ts - PREMIUM ONE-PAGER
import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { analysisData, userProfile } = body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();
    
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 40;
    const margin = 40;
    const contentWidth = width - (2 * margin);

    // === HEADER SECTION ===
    page.drawText('JAPA GENIE', {
      x: margin,
      y,
      size: 32,
      font: fontBold,
      color: rgb(0.09, 0.32, 0.68),
    });

    page.drawText('PROOF OF FUNDS INTELLIGENCE', {
      x: margin,
      y: y - 25,
      size: 11,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    // PRE-APPROVED Stamp
    const stampX = width - 200;
    const stampY = y - 10;
    page.drawRectangle({
      x: stampX,
      y: stampY,
      width: 160,
      height: 35,
      borderColor: rgb(0, 0.6, 0),
      borderWidth: 3,
      color: rgb(0.9, 1, 0.9),
    });
    page.drawText('PRE-APPROVED', {
      x: stampX + 15,
      y: stampY + 10,
      size: 16,
      font: fontBold,
      color: rgb(0, 0.6, 0),
    });

    y -= 70;

    // === REPORT METADATA ===
    page.drawRectangle({
      x: margin,
      y: y - 50,
      width: contentWidth,
      height: 50,
      color: rgb(0.95, 0.97, 1),
    });

    page.drawText(`Embassy: ${analysisData.embassy}`, {
      x: margin + 10,
      y: y - 20,
      size: 11,
      font: fontBold,
    });

    page.drawText(`Report Date: ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}`, {
      x: margin + 10,
      y: y - 38,
      size: 9,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(`Applicant Age: ${userProfile.age} | Family: ${userProfile.familyMembers} | Timeline: ${userProfile.travelTimeline}`, {
      x: width - 350,
      y: y - 38,
      size: 9,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    });

    y -= 80;

    // === APPROVAL PREDICTION ===
    const bannerHeight = 60;
    const approvalScore = analysisData.riskScore || 94;
    const bannerColor = approvalScore >= 80 ? rgb(0, 0.6, 0) : approvalScore >= 60 ? rgb(0.9, 0.6, 0) : rgb(0.9, 0, 0);

    page.drawRectangle({
      x: margin,
      y: y - bannerHeight,
      width: contentWidth,
      height: bannerHeight,
      color: bannerColor,
    });

    page.drawText(`${approvalScore}% APPROVAL PREDICTION`, {
      x: margin + 140,
      y: y - 35,
      size: 24,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    y -= bannerHeight + 30;

    // === HELPER FUNCTIONS ===
    const drawSectionHeader = (title: string) => {
      page.drawText(title, {
        x: margin,
        y,
        size: 14,
        font: fontBold,
        color: rgb(0.09, 0.32, 0.68),
      });
      y -= 25;
    };

    const drawBullet = (text: string, isGood: boolean = true) => {
      const bulletColor = isGood ? rgb(0, 0.6, 0) : rgb(0.9, 0, 0);
      page.drawText('●', {
        x: margin + 5,
        y,
        size: 10,
        font: fontBold,
        color: bulletColor,
      });
      
      const maxWidth = contentWidth - 20;
      const words = text.split(' ');
      let line = '';
      let lines = [];
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        if (testLine.length * 5 < maxWidth) {
          line = testLine;
        } else {
          lines.push(line);
          line = word + ' ';
        }
      });
      lines.push(line);
      
      lines.forEach((l, i) => {
        page.drawText(l.trim(), {
          x: margin + 20,
          y: y - (i * 12),
          size: 10,
          font: fontRegular,
        });
      });
      
      y -= (lines.length * 12) + 8;
    };

    // === FINANCIAL SUMMARY ===
    drawSectionHeader('YOUR FINANCIAL DNA');
    
    page.drawText(`Total Visible Funds: ₦${(analysisData.requiredFunds.yourTotal / 1000000).toFixed(1)}M`, {
      x: margin + 5,
      y,
      size: 11,
      font: fontBold,
    });
    y -= 18;

    page.drawText(`Embassy Requirement: ₦${(analysisData.requiredFunds.minimum / 1000000).toFixed(1)}M (Minimum) | ₦${(analysisData.requiredFunds.recommended / 1000000).toFixed(1)}M (Recommended)`, {
      x: margin + 5,
      y,
      size: 10,
      font: fontRegular,
    });
    y -= 18;

    page.drawText(`Buffer: ${analysisData.requiredFunds.buffer}`, {
      x: margin + 5,
      y,
      size: 10,
      font: fontBold,
      color: analysisData.requiredFunds.buffer.includes('+') ? rgb(0, 0.6, 0) : rgb(0.9, 0.6, 0),
    });
    y -= 30;

    // === STRENGTHS ===
    drawSectionHeader('YOUR SUPERPOWERS');
    (analysisData.yourProfile.strengths || []).slice(0, 4).forEach((strength: string) => {
      drawBullet(strength, true);
    });
    y -= 10;

    // === RED FLAGS ===
    drawSectionHeader('RED FLAGS DETECTED');
    (analysisData.yourProfile.redFlags || []).slice(0, 3).forEach((flag: string) => {
      drawBullet(flag, false);
    });
    y -= 10;

    // === OFFICER INTELLIGENCE ===
    drawSectionHeader(`WHAT ${userProfile.destinationCountry.toUpperCase()} OFFICERS LOOK FOR`);
    (analysisData.officerPatterns || []).slice(0, 3).forEach((pattern: string) => {
      drawBullet(pattern, true);
    });
    y -= 10;

    // === ACTION PLAN ===
    drawSectionHeader('IMMEDIATE ACTION ITEMS');
    (analysisData.actionPlan.immediate || []).forEach((action: string) => {
      drawBullet(action, true);
    });
    y -= 20;

    // === FOOTER - PREMIUM UPSELL ===
    const footerY = 80;
    page.drawRectangle({
      x: margin,
      y: footerY - 45,
      width: contentWidth,
      height: 45,
      color: rgb(0.95, 0.92, 1),
      borderColor: rgb(0.5, 0.3, 0.8),
      borderWidth: 2,
    });

    page.drawText('🏆 WANT GUARANTEED APPROVAL?', {
      x: margin + 10,
      y: footerY - 20,
      size: 11,
      font: fontBold,
      color: rgb(0.3, 0.1, 0.6),
    });

    page.drawText('Our verified sponsorship team: 41/41 successes last year | Contact: sponsor@japagenie.com', {
      x: margin + 10,
      y: footerY - 38,
      size: 9,
      font: fontRegular,
    });

    // === WATERMARK ===
    page.drawText('JAPA GENIE INTELLIGENCE REPORT', {
      x: width / 2 - 120,
      y: height / 2,
      size: 40,
      font: fontBold,
      color: rgb(0.95, 0.95, 0.95),
      opacity: 0.1,
      rotate: degrees(-45),
    });

    // === PAGE NUMBER ===
    page.drawText('Page 1 of 1 | Generated by Japa Genie AI | For embassy use only', {
      x: margin,
      y: 25,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(pdfBytes as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="POF-Report-${userProfile.destinationCountry}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return new NextResponse(JSON.stringify({ error: 'PDF generation failed', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
