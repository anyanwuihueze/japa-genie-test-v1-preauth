// src/ai/flows/document-checker.ts
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface DocumentCheckerInput {
  documentDataUri: string;
  targetCountry?: string;
  visaType?: string;
  userId?: string;
}

export interface DocumentCheckerOutput {
  documentType: string;
  isVisaRelated: boolean;
  overallRiskScore: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  strengths: string[];
  criticalIssues: Array<{
    issue: string;
    impact: string;
    recommendation: string;
  }>;
  warnings: Array<{
    issue: string;
    impact: string;
    recommendation: string;
  }>;
  missingInformation: string[];
  qualityIssues: string[];
  complianceChecks: {
    validityPeriod: string;
    formatCompliance: string;
    signatures: string;
    dates: string;
  };
  actionItems: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    action: string;
    reason: string;
  }>;
  countrySpecificNotes?: string;
  detailedReport: string;
  visaRelevance: {
    isRequiredForVisa: boolean;
    requiredStage?: string;
    importance: 'CRITICAL' | 'IMPORTANT' | 'SUPPORTING' | 'OPTIONAL';
    specificRequirements: string[];
  };
  progressImpact: {
    milestoneProgress: number;
    nextRecommendedActions: string[];
    estimatedTimelineImpact: string;
  };
}

export async function documentChecker(input: DocumentCheckerInput): Promise<DocumentCheckerOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const targetCountry = input.targetCountry || 'General';
  const visaType = input.visaType || 'Tourist';
  
  console.log('🔍 Analyzing document for', visaType, 'visa to', targetCountry);
  
  // Extract base64 image data from data URI
  const base64Match = input.documentDataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    throw new Error('Invalid data URI format');
  }
  
  const mimeType = base64Match[1];
  const base64Data = base64Match[2];
  
  console.log('📄 Document type:', mimeType);

  const prompt = `
ACT AS: Elite visa document reviewer with 20+ years experience across 50+ countries.

DOCUMENT CONTEXT:
- Target Country: ${targetCountry}
- Visa Type: ${visaType}
- Analysis Date: ${new Date().toISOString().split('T')[0]}

YOUR MISSION:
Perform FORENSIC-LEVEL analysis of this visa document. Embassy officers reject 80% of applications for document issues - find EVERY problem before they do.

CRITICAL ANALYSIS AREAS:

1. DOCUMENT IDENTIFICATION
   - What type of document is this? (passport, bank statement, employment letter, etc.)
   - Is it REQUIRED for ${visaType} visa to ${targetCountry}?
   - Which application stage does it belong to?

2. AUTHENTICITY & VALIDITY
   - Are there official stamps, signatures, letterheads?
   - Is the document recent (within 30-90 days)?
   - Does it show signs of alteration or forgery?
   - Are dates consistent and logical?

3. CONTENT QUALITY
   - Is all required information present?
   - Are numbers/amounts clearly visible?
   - Is text legible and professionally formatted?
   - Any spelling errors or poor grammar?

4. COMPLIANCE CHECKS (${targetCountry} Standards)
   - Does it meet embassy formatting requirements?
   - Are all mandatory fields filled?
   - Does it include required certifications?
   - Is it translated if needed?

5. RED FLAGS & REJECTION RISKS
   - Missing signatures or dates
   - Expired validity periods
   - Insufficient amounts (for financial docs)
   - Inconsistent information
   - Poor image quality
   - Suspicious patterns

6. VISA-SPECIFIC REQUIREMENTS
   For ${visaType} visa to ${targetCountry}:
   - Does this document fulfill specific checklist items?
   - How critical is it for approval?
   - What additional documents should accompany it?

OUTPUT FORMAT: Return ONLY valid JSON (no markdown, no backticks):
{
  "documentType": "Passport Bio Page",
  "isVisaRelated": true,
  "overallRiskScore": "LOW",
  "summary": "Valid passport with 2+ years validity remaining. All information clearly visible.",
  "strengths": [
    "Clear, high-quality scan",
    "Passport valid until 2027",
    "All fields legible"
  ],
  "criticalIssues": [
    {
      "issue": "Passport expires within 6 months of travel",
      "impact": "Automatic rejection - most embassies require 6+ months validity",
      "recommendation": "Renew passport immediately before applying"
    }
  ],
  "warnings": [
    {
      "issue": "Photo partially obscured by glare",
      "impact": "May require re-submission",
      "recommendation": "Rescan without flash/glare"
    }
  ],
  "missingInformation": ["No visible MRZ (Machine Readable Zone)"],
  "qualityIssues": ["Slight blur in signature area"],
  "complianceChecks": {
    "validityPeriod": "PASS - Valid until 2027",
    "formatCompliance": "PASS - Standard ICAO format",
    "signatures": "PASS - Signature present",
    "dates": "PASS - Issue/expiry dates clear"
  },
  "actionItems": [
    {
      "priority": "HIGH",
      "action": "Verify passport expiry extends 6 months beyond intended stay",
      "reason": "Embassy requirement for ${targetCountry}"
    }
  ],
  "countrySpecificNotes": "${targetCountry} requires bio-data page + all used pages. Include blank pages showing 'no stamps'.",
  "detailedReport": "Comprehensive 2-3 sentence analysis of document readiness",
  "visaRelevance": {
    "isRequiredForVisa": true,
    "requiredStage": "Initial application",
    "importance": "CRITICAL",
    "specificRequirements": [
      "Must be valid for 6+ months beyond stay",
      "Bio-data page must be clear",
      "All used pages required"
    ]
  },
  "progressImpact": {
    "milestoneProgress": 100,
    "nextRecommendedActions": [
      "✅ Passport ready - proceed to financial documents",
      "📋 Next: Upload bank statements (last 6 months)"
    ],
    "estimatedTimelineImpact": "On track - no delays"
  }
}`;

  let rawText = '';
  
  try {
    console.log('🤖 Sending document to Gemini Vision...');
    
    // Send image + prompt to Gemini Vision
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      { text: prompt }
    ]);
    
    const response = await result.response;
    rawText = response.text();
    
    console.log('✅ Raw Document Analysis:', rawText.substring(0, 500) + '...');
    
    // Clean up response
    let cleanedText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}]*$/, '')
      .trim();
    
    console.log('🧹 Cleaned response');
    
    const parsed = JSON.parse(cleanedText);
    
    console.log('🎉 Document analysis complete!');
    
    return parsed;
    
  } catch (error) {
    console.error('❌ Document Analysis Error:', error);
    console.error('Failed raw text:', rawText.substring(0, 1000));
    
    // Return fallback response
    console.log('⚠️ Using fallback document analysis');
    
    return {
      documentType: "Document (analysis incomplete)",
      isVisaRelated: true,
      overallRiskScore: "MEDIUM",
      summary: `AI had trouble analyzing this document. Please ensure it's a clear, high-quality image or PDF.`,
      strengths: [
        "Document uploaded successfully"
      ],
      criticalIssues: [
        {
          issue: "Document quality may be insufficient",
          impact: "AI couldn't extract all details - embassy may also struggle",
          recommendation: "Try uploading a clearer scan or photo"
        }
      ],
      warnings: [
        {
          issue: "Incomplete automated analysis",
          impact: "Manual review recommended",
          recommendation: "Consider professional document verification service"
        }
      ],
      missingInformation: ["AI couldn't verify all fields"],
      qualityIssues: ["Image quality may be too low"],
      complianceChecks: {
        validityPeriod: "Unable to verify",
        formatCompliance: "Unable to verify",
        signatures: "Unable to verify",
        dates: "Unable to verify"
      },
      actionItems: [
        {
          priority: "HIGH",
          action: "Re-upload document with better quality",
          reason: "Current quality insufficient for automated analysis"
        },
        {
          priority: "MEDIUM",
          action: "Verify document meets embassy standards manually",
          reason: "AI analysis incomplete"
        }
      ],
      countrySpecificNotes: `For ${targetCountry} ${visaType} visa, ensure all documents are recent, certified, and clearly legible.`,
      detailedReport: "Automated analysis encountered difficulties. Please ensure your document is a clear, complete, and recent scan or photo. Consider re-uploading or consulting our expert review service for manual verification.",
      visaRelevance: {
        isRequiredForVisa: true,
        requiredStage: "Application",
        importance: "IMPORTANT",
        specificRequirements: [
          "Document must be clear and legible",
          "Should be recent (within 30-90 days)",
          "Must meet embassy formatting requirements"
        ]
      },
      progressImpact: {
        milestoneProgress: 30,
        nextRecommendedActions: [
          "🔧 Re-upload document with better quality",
          "📋 Ensure document meets embassy requirements",
          "💡 Consider professional document review"
        ],
        estimatedTimelineImpact: "Minor delay - quality issues need resolution"
      }
    };
  }
}