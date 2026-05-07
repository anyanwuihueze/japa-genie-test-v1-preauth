'use server';

// Dual AI Strategy: Groq primary (fast/cheap), Gemini fallback (accurate)
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
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
  confidence: number;
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
  aiProvider?: 'groq' | 'gemini' | 'error';
}

export async function documentChecker(input: DocumentCheckerInput): Promise<DocumentAnalysis> {
  try {
    console.log('🔍 Analyzing document for:', input.visaType, 'visa to', input.targetCountry);
    console.log('🔑 Groq API Key exists:', !!GROQ_API_KEY);
    console.log('🔑 Gemini API Key exists:', !!GEMINI_API_KEY);
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    console.log('🌐 Getting embassy requirements...');
    const embassyRequirements = await getEmbassyRequirements(
      input.targetCountry || 'General',
      input.visaType || 'Tourist'
    );
    
    // Dual-AI Strategy: Try Groq first, fallback to Gemini if needed
    console.log('📸 Starting vision analysis (Groq primary)...');
    
    try {
      const groqResult = await analyzeWithGroq(
        input.documentDataUri,
        embassyRequirements,
        input.targetCountry || 'General',
        input.visaType || 'Tourist'
      );
      
      // If Groq gives low confidence or critical status, try Gemini for better accuracy
      if (groqResult.confidence < 0.7 || groqResult.overallStatus === 'critical') {
        console.log('⚠️ Groq confidence low or critical status, falling back to Gemini...');
        throw new Error('Fallback to Gemini');
      }
      
      console.log('✅ Groq analysis successful');
      return { ...groqResult, aiProvider: 'groq' as const };
      
    } catch (groqError: any) {
      console.log('❌ Groq failed or triggered fallback:', groqError.message);
      
      // Fallback to Gemini
      if (!GEMINI_API_KEY) {
        console.error('❌ Gemini API key not configured, cannot fallback');
        throw groqError;
      }
      
      try {
        console.log('🔄 Falling back to Gemini...');
        const geminiResult = await analyzeWithGemini(
          input.documentDataUri,
          embassyRequirements,
          input.targetCountry || 'General',
          input.visaType || 'Tourist'
        );
        
        console.log('✅ Gemini analysis successful');
        return { ...geminiResult, aiProvider: 'gemini' as const };
        
      } catch (geminiError: any) {
        console.error('❌ Both AI providers failed:', geminiError.message);
        throw new Error('Both AI providers failed');
      }
    }
    
  } catch (error: any) {
    console.error('❌ Analysis failed:', error);
    return createErrorResponse(error.message);
  }
}

async function getEmbassyRequirements(country: string, visaType: string): Promise<string> {
  try {
    const prompt = 'List ' + country + ' ' + visaType + ' visa requirements for 2025: documents, financial proof, passport validity, rejection reasons. Concise.';
    
    const response = await fetch(
      GROQ_BASE_URL + '/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + GROQ_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 2000
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Requirements API error:', response.status, errorText);
      throw new Error('API error: ' + response.status);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    return data.choices?.[0]?.message?.content || '';
    
  } catch (error) {
    console.error('Requirements fetch failed:', error);
    return country + ' ' + visaType + ' visa: Valid passport (6+ months), financial proof, photos, application, supporting documents.';
  }
}

async function analyzeWithGroq(
  imageDataUri: string,
  requirements: string,
  country: string,
  visaType: string
): Promise<DocumentAnalysis> {
  
  try {
    // Validate image data
    if (!imageDataUri.startsWith('data:image/')) {
      throw new Error('Invalid image format. Must be data:image/...');
    }

    console.log('🖼️ Image data URI length:', imageDataUri.length);
    console.log('🖼️ Image format:', imageDataUri.split(';')[0]);
    
    const prompt = `Analyze this ${country} ${visaType} visa document image.

REQUIREMENTS: ${requirements}

Extract ALL visible text, dates, amounts, signatures, stamps. Identify document type and compliance issues for ${country} ${visaType} visa.

Assign a confidence score (0.0-1.0) based on image clarity and analysis certainty.

Return ONLY valid JSON (no markdown):
{
  "documentType": "passport|bank_statement|employment_letter|travel_itinerary|sponsor_letter|other",
  "overallStatus": "pass|warning|critical",
  "confidence": 0.0,
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

    console.log('🚀 Sending request to Groq API...');
    console.log('🚀 URL:', GROQ_BASE_URL + '/chat/completions');
    console.log('🚀 Model:', GROQ_MODEL);

    const response = await fetch(
      GROQ_BASE_URL + '/chat/completions',
      {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + GROQ_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageDataUri
                  }
                }
              ]
            }
          ],
          temperature: 0.2,
          max_tokens: 8000
        })
      }
    );
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error('Groq API error: ' + response.status + ' - ' + errorText);
    }
    
    const data = await response.json();
    console.log('📡 Response received, parsing...');
    
    if (data.error) {
      throw new Error('Groq: ' + data.error.message);
    }
    
    const text = data.choices?.[0]?.message?.content || '';
    if (!text) {
      throw new Error('No response content from Groq');
    }
    
    console.log('📝 Response text length:', text.length);
    console.log('📝 Response preview:', text.substring(0, 200));
    
    return parseAIResponse(text);
    
  } catch (error: any) {
    console.error('❌ Vision analysis failed:', error);
    throw error;
  }
}

async function analyzeWithGemini(
  imageDataUri: string,
  requirements: string,
  country: string,
  visaType: string
): Promise<DocumentAnalysis> {
  
  try {
    // Validate image data
    if (!imageDataUri.startsWith('data:image/')) {
      throw new Error('Invalid image format. Must be data:image/...');
    }

    // Extract base64 from data URI for Gemini
    const base64Data = imageDataUri.split(',')[1];
    const mimeType = imageDataUri.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

    console.log('🖼️ Gemini - Image data length:', base64Data?.length);
    console.log('🖼️ Gemini - MIME type:', mimeType);

    const prompt = `You are an expert visa document analyst with 10+ years embassy experience.
  
Analyze this ${country} ${visaType} visa document image.

REQUIREMENTS: ${requirements}

Extract ALL visible text, dates, amounts, signatures, stamps. Identify document type and compliance issues for ${country} ${visaType} visa.

Provide detailed analysis with high accuracy.

Return ONLY valid JSON (no markdown):
{
  "documentType": "passport|bank_statement|employment_letter|travel_itinerary|sponsor_letter|other",
  "overallStatus": "pass|warning|critical",
  "confidence": 0.0,
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

    console.log('🚀 Sending request to Gemini API...');
    console.log('🚀 Model:', GEMINI_MODEL);

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error response:', errorText);
      throw new Error('Gemini API error: ' + response.status + ' - ' + errorText);
    }

    const data = await response.json();
    console.log('📡 Gemini response received, parsing...');

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      throw new Error('No response content from Gemini');
    }
    
    console.log('📝 Gemini response preview:', text.substring(0, 200));
    
    return parseAIResponse(text);
    
  } catch (error: any) {
    console.error('❌ Gemini analysis failed:', error);
    throw error;
  }
}

function parseAIResponse(text: string): DocumentAnalysis {
  try {
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('❌ No JSON found in response:', text);
      throw new Error('Could not parse JSON from response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    if (!analysis.documentType || !analysis.overallStatus) {
      throw new Error('Invalid analysis structure - missing required fields');
    }
    
    // Ensure confidence field exists (default to 0.5 if missing)
    if (typeof analysis.confidence !== 'number') {
      analysis.confidence = 0.5;
    }
    
    return analysis as DocumentAnalysis;
    
  } catch (error: any) {
    console.error('❌ JSON parsing failed:', error);
    throw new Error('Failed to parse AI response: ' + error.message);
  }
}

function createErrorResponse(message: string): DocumentAnalysis {
  return {
    documentType: 'Unknown',
    overallStatus: 'critical',
    confidence: 0,
    criticalIssues: [{
      issue: 'Analysis Failed',
      impact: message,
      recommendation: 'Upload a clear JPG or PNG image of your document'
    }],
    warnings: [],
    passed: [],
    extractedData: { dates: [], amounts: [], signatures: [], stamps: [] },
    embassyCompliance: { meetsStandards: false, specificRequirements: [], missingElements: [] },
    aiProvider: 'error'
  };
}
