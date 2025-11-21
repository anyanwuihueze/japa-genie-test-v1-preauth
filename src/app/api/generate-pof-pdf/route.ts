// src/app/api/generate-pof-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { analysisData, userProfile, destinationCountry, visaType, familyMembers } = await request.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });

    const prompt = `
    Generate a PROFESSIONAL EMBASSY-READY Proof of Funds Analysis Report.

    APPLICANT: ${userProfile.full_name || userProfile.email}
    DESTINATION: ${destinationCountry}
    VISA TYPE: ${visaType}
    FAMILY SIZE: ${familyMembers}
    ANALYSIS DATE: ${new Date().toISOString().split('T')[0]}

    ANALYSIS RESULTS:
    ${JSON.stringify(analysisData, null, 2)}

    Create a comprehensive, formal report with these sections:

    # PROOF OF FUNDS ANALYSIS REPORT
    ## Executive Summary
    - Overall Compliance Status
    - Risk Assessment Level
    - Key Recommendations

    ## Financial Position Analysis
    - Total Available Funds
    - Liquid Assets Breakdown
    - Account Seasoning Assessment
    - Financial Stability Score

    ## Embassy Requirements Compliance
    - Minimum Funds Requirement Analysis
    - Account Seasoning Compliance
    - Documentation Adequacy
    - Identified Risk Factors

    ## Account-by-Account Breakdown
    Detailed analysis of each financial account

    ## Recommendations & Action Plan
    ### High Priority Actions
    ### Medium Priority Improvements  
    ### Documentation Preparation

    ## Embassy Submission Checklist
    - Required Documents
    - Verification Steps
    - Timeline Recommendations

    Format this as professional markdown suitable for embassy submission.
    Use clear sections, bullet points, and emphasize critical compliance information.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reportContent = response.text();

    // For now return markdown - you can integrate with React PDF later
    return new NextResponse(reportContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="POF-Report-${destinationCountry}-${new Date().toISOString().split('T')[0]}.md"`
      }
    });

  } catch (error) {
    console.error('PDF Generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}