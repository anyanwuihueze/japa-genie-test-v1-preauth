import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question, aiResponse } = await request.json();
    console.log('Insights API called for:', question);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert immigration analyst. Analyze this visa consultation and generate strategic insights.

USER QUESTION: "${question}"
AI RESPONSE: "${aiResponse}"

Generate insights in this EXACT JSON format:
{
  "category": "Country Immigration (e.g., Spanish Immigration, Japanese Immigration, etc.)",
  "confidence": [number 75-95 based on response quality],
  "recommendations": [
    "Specific actionable step 1",
    "Specific actionable step 2", 
    "Specific actionable step 3",
    "Specific actionable step 4"
  ],
  "timeline": "X-Y months (realistic estimate)",
  "difficulty": "Low/Moderate/High based on requirements"
}

ANALYSIS RULES:
- Extract the target country from question/response
- Confidence should reflect visa complexity (simple tourist=90+, complex work visa=75-85)
- Recommendations must be SPECIFIC actions, not generic advice
- Timeline should be realistic for that country's processing
- Difficulty based on document requirements, language needs, sponsorship needs

IMPORTANT: Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up response - remove any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const insights = JSON.parse(text);
      console.log('Generated dynamic insights:', insights);
      return NextResponse.json(insights);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw AI response:', text);
      
      // Fallback insights if JSON parsing fails
      const fallbackInsights = {
        category: "Immigration Analysis",
        confidence: 80,
        recommendations: [
          "Research official government requirements",
          "Prepare required documentation early",
          "Consider professional consultation",
          "Check current processing times"
        ],
        timeline: "Variable",
        difficulty: "Moderate"
      };
      
      return NextResponse.json(fallbackInsights);
    }
    
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' }, 
      { status: 500 }
    );
  }
}