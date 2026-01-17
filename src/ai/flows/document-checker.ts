'use server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

interface DocumentCheckerInput {
  documentDataUri: string;
  targetCountry?: string;
  visaType?: string;
  userId?: string;
}

interface DocumentAnalysis {
  documentType: string;
  overallStatus: 'pass' | 'warning' | 'critical';
  criticalIssues: Array<{
    issue: string;
    impact: string;
    recommendation: string;
  }>;
  warnings: Array<{
    issue: string;
    recommendation: string;
  }>;
  passed: string[];
  extractedData: {
    dates: string[];
    amounts: string[];
    signatures: string[];
    stamps: string[];
  };
  embassyCompliance: {
    meetsStandards: boolean;
    specificRequirements: string[];
    missingElements: string[];
  };
}

export async function documentChecker(input: DocumentCheckerInput): Promise<DocumentAnalysis> {
  try {
    console.log('🔍 Analyzing document for:', input.visaType, 'visa to', input.targetCountry);
    
    console.log('🌐 Getting embassy requirements...');
    const embassyRequirements = await getEmbassyRequirements(
      input.targetCountry || 'General',
      input.visaType || 'Tourist'
    );
    
    console.log('📸 Analyzing with Gemini Vision...');
    const analysis = await analyzeWithVision(
      input.documentDataUri,
      embassyRequirements,
      input.targetCountry || 'General',
      input.visaType || 'Tourist'
    );
    
    console.log('✅ Analysis complete');
    return analysis;
    
  } catch (error: any) {
    console.error('❌ Analysis failed:', error);
    return createErrorResponse(error.message);
  }
}

async function getEmbassyRequirements(country: string, visaType: string): Promise<string> {
  try {
    const prompt = `List ${country} ${visaType} visa requirements for 2025: documents, financial proof, passport validity, rejection reasons. Concise.`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
  } catch (error) {
    return `${country} ${visaType} visa: Valid passport (6+ months), financial proof, photos, application, supporting documents.`;
  }
}

async function analyzeWithVision(
  imageDataUri: string,
  requirements: string,
  country: string,
  visaType: string
): Promise<DocumentAnalysis> {
  
  try {
    const base64Data = imageDataUri.split(',')[1];
    if (!base64Data) throw new Error('Invalid image data');
    
    const mimeMatch = imageDataUri.match(/data:(image\/[^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    const prompt = `Analyze this ${country} ${visaType} visa document image.

REQUIREMENTS: ${requirements}

Extract ALL visible text, dates, amounts, signatures, stamps. Identify document type and compliance issues for ${country} ${visaType} visa.

Return ONLY valid JSON (no markdown):
{
  "documentType": "passport|bank_statement|employment_letter|travel_itinerary|sponsor_letter|other",
  "overallStatus": "pass|warning|critical",
  "extractedData": {
    "dates": ["all dates with labels"],
    "amounts": ["all amounts with currency"],
    "signatures": ["descriptions"],
    "stamps": ["descriptions"]
  },
  "criticalIssues": [
    {"issue": "specific problem", "impact": "why rejected", "recommendation": "exact fix"}
  ],
  "warnings": [
    {"issue": "concern", "recommendation": "improvement"}
  ],
  "passed": ["met requirements"],
  "embassyCompliance": {
    "meetsStandards": true,
    "specificRequirements": ["checklist"],
    "missingElements": ["missing items"]
  }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Data }}
            ]
          }]
        })
      }
    );
    
    const data = await response.json();
    if (data.error) throw new Error(`Gemini: ${data.error.message}`);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('No response from Gemini');
    
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('Could not parse JSON');
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    if (!analysis.documentType || !analysis.overallStatus) {
      throw new Error('Invalid analysis structure');
    }
    
    return analysis;
    
  } catch (error: any) {
    console.error('❌ Vision failed:', error);
    throw error;
  }
}

function createErrorResponse(message: string): DocumentAnalysis {
  return {
    documentType: 'Unknown',
    overallStatus: 'critical',
    criticalIssues: [{
      issue: 'Analysis Failed',
      impact: message,
      recommendation: 'Upload a clear JPG or PNG image of your document'
    }],
    warnings: [],
    passed: [],
    extractedData: { dates: [], amounts: [], signatures: [], stamps: [] },
    embassyCompliance: { meetsStandards: false, specificRequirements: [], missingElements: [] }
  };
}
