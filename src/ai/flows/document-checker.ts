'use server';
import { groq } from '@/lib/groq-client';

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

export async function documentChecker(
  input: DocumentCheckerInput
): Promise<DocumentAnalysis> {
  try {
    console.log('👁️ Starting VISION analysis with LLaVA for:', input.visaType, 'visa to', input.targetCountry);

    const embassyRequirements = fetchEmbassyRequirements(
      input.targetCountry || 'General',
      input.visaType || 'Tourist'
    );

    console.log('📋 Embassy requirements fetched');

    const visionAnalysis = await analyzeDocumentWithVision(
      input.documentDataUri,
      embassyRequirements
    );

    console.log('✅ LLaVA vision analysis complete');
    return visionAnalysis;

  } catch (error: any) {
    console.error('❌ Document checker error:', error);
    
    return {
      documentType: 'Unknown',
      overallStatus: 'critical',
      criticalIssues: [{
        issue: 'Document Analysis Failed',
        impact: error.message || 'Could not analyze document',
        recommendation: 'Please upload a clear, high-resolution document (minimum 100x100 pixels)'
      }],
      warnings: [],
      passed: [],
      extractedData: { dates: [], amounts: [], signatures: [], stamps: [] },
      embassyCompliance: {
        meetsStandards: false,
        specificRequirements: [],
        missingElements: ['Analysis could not be completed']
      }
    };
  }
}

function fetchEmbassyRequirements(country: string, visaType: string): string {
  const requirements = `
${country} ${visaType} Visa Requirements (2025):

CRITICAL REQUIREMENTS:
1. Valid passport (6+ months validity beyond travel dates)
2. Recent passport photos (specific size requirements)
3. Bank statements (last 6 months, showing consistent balance)
4. Official bank letter on letterhead with signature and stamp
5. Proof of ties to home country
6. Travel itinerary and accommodation proof
7. Employment/enrollment letter
8. All documents dated within last 30 days

COMMON REJECTION REASONS:
- Missing signatures or stamps on bank documents
- Insufficient account seasoning (funds recently deposited)
- Inconsistent information across documents
- Poor quality scans (unreadable text)
- Expired or invalid passport
- Missing required supporting documents

COUNTRY-SPECIFIC FOR ${country}:
${getCountrySpecificRequirements(country, visaType)}
  `.trim();

  return requirements;
}

function getCountrySpecificRequirements(country: string, visaType: string): string {
  const rules: Record<string, string> = {
    'Canada': '- Bank statements must show 4-6 months history\n- Minimum funds: CAD $20,635 + tuition\n- Account seasoning: 90+ days required\n- GIC certificate required for Student Direct Stream',
    'United Kingdom': '- 28-day financial rule (funds held for 28 consecutive days)\n- Minimum: £1,483/month (London) or £1,136/month (outside London) for 9 months.\n- Account seasoning: 28+ days before application\n- Bank letter must be dated within 31 days of application',
    'United States': '- Bank statements for last 3-6 months\n- I-20 form required (students)\n- DS-160 confirmation required\n- Proof of strong ties to home country essential\n- Interview required for most applicants',
    'Australia': '- Genuine Temporary Entrant (GTE) requirement\n- Financial capacity for 12 months minimum\n- Health insurance (OSHC for students)\n- English language proficiency proof\n- Character requirements and police certificates',
  };
  return rules[country] || 'Standard visa requirements apply.';
}

async function analyzeDocumentWithVision(
  documentDataUri: string,
  embassyRequirements: string
): Promise<DocumentAnalysis> {
  
  const prompt = `You are an expert visa document analyst. Analyze this document image based on the provided embassy requirements.

EMBASSY REQUIREMENTS TO CHECK AGAINST:
${embassyRequirements}

YOUR ANALYSIS MUST:
1. Identify the document type (e.g., passport, bank statement).
2. Extract all visible text, focusing on names, dates, amounts, and official numbers.
3. Find all signatures and official stamps.
4. Check for any missing elements required by the embassy rules.
5. Assess the document's quality (readability, blurriness, authenticity markers).
6. Flag any inconsistencies or red flags.

Return your analysis as a JSON object with this EXACT structure:
{
  "documentType": "<type of document identified>",
  "overallStatus": "<pass|warning|critical>",
  "extractedData": {
    "dates": ["<all dates found>"],
    "amounts": ["<all monetary amounts found>"],
    "signatures": ["<signature status: present/missing/unclear>"],
    "stamps": ["<stamp status: present/missing/unclear>"]
  },
  "criticalIssues": [
    {
      "issue": "<specific critical problem>",
      "impact": "<why this will cause rejection>",
      "recommendation": "<exact fix needed>"
    }
  ],
  "warnings": [
    {
      "issue": "<potential concern>",
      "recommendation": "<how to improve>"
    }
  ],
  "passed": ["<requirements that are met>"],
  "embassyCompliance": {
    "meetsStandards": <true/false>,
    "specificRequirements": ["<embassy requirements checked>"],
    "missingElements": ["<what's missing or unclear>"]
  }
}

CRITICAL: Base your analysis ONLY on what you can actually see in the document. Respond with ONLY the valid JSON object.`;

  try {
    console.log('🔄 Calling Groq Vision API (LLaVA)...');
    
    const completion = await groq.chat.completions.create({
      model: 'llava-v1.5-7b-hf', // <-- VISION-ENABLED MODEL
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: documentDataUri }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    return await parseGroqResponse(completion);

  } catch (error: any) {
    console.error('❌ Vision analysis failed:', error);
    throw new Error(`Vision API error: ${error.message || 'Unknown error'}`);
  }
}

async function parseGroqResponse(completion: any): Promise<DocumentAnalysis> {
  console.log('✅ Groq Vision API responded');

  const responseText = completion.choices[0].message.content || '{}';
  
  // Clean the response: remove markdown and trim whitespace
  let cleanedText = responseText.trim()
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  let analysis: DocumentAnalysis;
  try {
    analysis = JSON.parse(cleanedText);
    console.log('✅ JSON parsed successfully');
  } catch (parseError) {
    console.error('❌ JSON parse failed, attempting extraction from mixed content...');
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
      console.log('✅ JSON extracted and parsed');
    } else {
      throw new Error('Could not parse AI response as JSON');
    }
  }

  if (!analysis.documentType || !analysis.overallStatus) {
    throw new Error('AI returned incomplete analysis structure');
  }

  return analysis;
}
