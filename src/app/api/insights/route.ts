import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, aiResponse } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const prompt = `Analyze this visa question and provide insights in JSON format.

Question: "${question}"
AI Response: "${aiResponse || ''}"

Return ONLY valid JSON with this structure:
{
  "category": "Work Visa" | "Student Visa" | "Tourist Visa" | "Other",
  "confidence": 0.85,
  "difficulty": "Low" | "Medium" | "High",
  "timeline": "1–3 months" | "4–6 months" | "6–12 months" | "12+ months",
  "recommendations": ["action 1", "action 2", "action 3"]
}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Clean JSON response
    text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    
    const parsed = JSON.parse(text);
    
    // Validate and return
    return NextResponse.json({
      category: parsed.category || 'Other',
      confidence: parsed.confidence || 0.7,
      difficulty: parsed.difficulty || 'Medium',
      timeline: parsed.timeline || '4–6 months',
      recommendations: Array.isArray(parsed.recommendations) 
        ? parsed.recommendations.slice(0, 3) 
        : ['Research official requirements', 'Prepare documentation', 'Consult an expert']
    });

  } catch (error: any) {
    console.error('Insights error:', error);
    
    // Return fallback insights
    return NextResponse.json({
      category: 'Other',
      confidence: 0.5,
      difficulty: 'Medium',
      timeline: '4–6 months',
      recommendations: [
        'Research official visa requirements',
        'Prepare required documentation',
        'Consider consulting an immigration expert'
      ]
    });
  }
}