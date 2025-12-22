// src/lib/pdf-generator.ts - PROFESSIONAL PDF GENERATOR
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFData {
  analysisData: any;
  userProfile: any;
  destinationCountry: string;
  visaType: string;
  familyMembers: number;
}

export function generatePOFPDF(data: PDFData): Buffer {
  const { analysisData, userProfile, destinationCountry, visaType, familyMembers } = data;
  
  // Create PDF (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // ============================================================================
  // HEADER SECTION
  // ============================================================================
  
  // Logo/Title
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('JAPA GENIE', margin, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Proof of Funds Analysis Report', margin, 30);
  
  yPos = 50;

  // ============================================================================
  // APPLICANT INFORMATION
  // ============================================================================
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Applicant Information', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const applicantInfo = [
    ['Name:', userProfile?.full_name || userProfile?.email?.split('@')[0] || 'N/A'],
    ['Destination Country:', destinationCountry],
    ['Visa Type:', visaType],
    ['Family Members:', familyMembers.toString()],
    ['Report Generated:', new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })],
  ];

  applicantInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, yPos);
    yPos += 7;
  });

  yPos += 5;

  // ============================================================================
  // ANALYSIS SUMMARY
  // ============================================================================
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Summary', margin, yPos);
  yPos += 10;

  // Summary box
  const summary = analysisData.summary;
  const boxColor = summary.riskLevel === 'low' ? [34, 197, 94] : 
                   summary.riskLevel === 'medium' ? [234, 179, 8] : [239, 68, 68];
  
  doc.setFillColor(boxColor[0], boxColor[1], boxColor[2], 0.1);
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 35, 3, 3, 'F');
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Compliance Score: ${summary.totalScore}/10`, margin + 5, yPos);
  yPos += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Risk Level: ${summary.riskLevel.toUpperCase()}`, margin + 5, yPos);
  yPos += 7;
  doc.text(`Meets Requirements: ${summary.meetsRequirements ? 'YES' : 'NO'}`, margin + 5, yPos);
  yPos += 7;
  doc.text(`Confidence Level: ${summary.confidence}%`, margin + 5, yPos);
  
  yPos += 15;

  // ============================================================================
  // FINANCIAL ANALYSIS
  // ============================================================================
  
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = margin;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Analysis', margin, yPos);
  yPos += 10;

  const financial = analysisData.financialAnalysis;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Assets', `$${financial.totalAssets?.toLocaleString() || '0'}`],
      ['Liquid Assets', `$${financial.liquidAssets?.toLocaleString() || '0'}`],
      ['Account Seasoning', `${Math.floor((financial.seasoningDays || 0) / 30)} months`],
      ['Currency', financial.currency || 'USD'],
      ['Stability Score', `${financial.stabilityScore || 0}/10`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // ============================================================================
  // EMBASSY REQUIREMENTS
  // ============================================================================
  
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = margin;
  }

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Embassy Requirements', margin, yPos);
  yPos += 10;

  const embassy = analysisData.embassySpecific;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [['Requirement', 'Details']],
    body: [
      ['Minimum Funds Required', `$${embassy.minimumFunds?.toLocaleString() || 'N/A'}`],
      ['Seasoning Period', `${Math.floor((embassy.seasoningRequirements || 0) / 30)} months`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Document Checklist
  if (embassy.documentChecklist?.length > 0) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Required Documents:', margin, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    embassy.documentChecklist.forEach((doc_item: string, index: number) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(`${index + 1}. ${doc_item}`, margin + 5, yPos);
      yPos += 6;
    });
    
    yPos += 5;
  }

  // ============================================================================
  // RECOMMENDATIONS
  // ============================================================================
  
  if (analysisData.recommendations?.length > 0) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Action Plan & Recommendations', margin, yPos);
    yPos += 10;

    analysisData.recommendations.forEach((rec: any, index: number) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      // Priority badge
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] :
                           rec.priority === 'medium' ? [234, 179, 8] : [59, 130, 246];
      
      doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2], 0.2);
      doc.roundedRect(margin, yPos - 3, pageWidth - 2 * margin, 20, 2, 2, 'F');

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${rec.action}`, margin + 3, yPos + 3);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      if (rec.timeline) {
        doc.text(`Timeline: ${rec.timeline}`, margin + 3, yPos + 9);
      }
      if (rec.impact) {
        const impactText = doc.splitTextToSize(rec.impact, pageWidth - 2 * margin - 10);
        doc.text(impactText, margin + 3, yPos + 15);
      }

      yPos += 25;
    });
  }

  // ============================================================================
  // COMPLIANCE CHECK
  // ============================================================================
  
  if (analysisData.complianceCheck) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Compliance Check', margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Status: ${analysisData.complianceCheck.passes ? '✓ PASSED' : '✗ ISSUES FOUND'}`, margin, yPos);
    yPos += 10;

    // Issues
    if (analysisData.complianceCheck.issues?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Issues Identified:', margin, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      analysisData.complianceCheck.issues.forEach((issue: string) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        const wrapped = doc.splitTextToSize(`• ${issue}`, pageWidth - 2 * margin - 10);
        doc.text(wrapped, margin + 5, yPos);
        yPos += wrapped.length * 6;
      });
    }

    // Advice
    if (analysisData.complianceCheck.specificAdvice?.length > 0) {
      yPos += 5;
      if (yPos > pageHeight - margin - 20) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Specific Advice:', margin, yPos);
      yPos += 7;
      
      doc.setFont('helvetica', 'normal');
      analysisData.complianceCheck.specificAdvice.forEach((advice: string) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        const wrapped = doc.splitTextToSize(`• ${advice}`, pageWidth - 2 * margin - 10);
        doc.text(wrapped, margin + 5, yPos);
        yPos += wrapped.length * 6;
      });
    }
  }

  // ============================================================================
  // FOOTER
  // ============================================================================
  
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | Generated by Japa Genie | Confidential Report`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    
    doc.text(
      'This is strategic guidance, not legal counsel. Consult immigration professionals for legal advice.',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Return PDF as Buffer
  return Buffer.from(doc.output('arraybuffer'));
}
