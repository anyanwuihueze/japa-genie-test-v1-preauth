import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';

// Simple function to read knowledge files (no Genkit dependency)
async function getKnowledgeFromFAQ(query: string): Promise<string> {
  try {
    const knowledgePath = path.join(process.cwd(), 'src', 'ai', 'knowledge');
    const files = await fs.readdir(knowledgePath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    let allKnowledge = '';
    for (const file of markdownFiles) {
      const filePath = path.join(knowledgePath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      allKnowledge += `\n=== ${file} ===\n${content}\n`;
    }
    
    return allKnowledge || 'No knowledge base found.';
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return 'Could not access knowledge base.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], sessionId, emailCaptured } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const context = conversationHistory
      ?.slice(-5)
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') || '';

    // GET ACTUAL KNOWLEDGE FROM FAQ
    const knowledge = await getKnowledgeFromFAQ(message);

    const prompt = `You are Japa Genie, a world-class visa strategist site assistant.

ACTUAL KNOWLEDGE BASE (FAQ):
${knowledge}

${context ? `CONVERSATION HISTORY:\n${context}\n\n` : ''}
USER QUESTION: "${message}"

${emailCaptured ? 'User has provided email - unlimited questions.' : 'User is in free tier.'}

INSTRUCTIONS:
1. Use the KNOWLEDGE BASE above to answer questions
2. Answer ONLY if about Japa Genie features, pricing, app usage
3. If visa-specific question: "That's a great visa question! Sign up for personalized answers."
4. Keep responses under 100 words
5. Be friendly and helpful
6. If knowledge base doesn't have answer, say you don't know

YOUR RESPONSE:`;

    // Use the environment variable for the API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are Japa Genie site assistant. Use the provided knowledge base to answer questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      // Handle rate limits (429) or other API errors
      const errorText = await response.text();
      console.error(`Groq API error ${response.status}:`, errorText);
      throw new Error(`Groq API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Visitor-chat error:', error);
    // Return a friendly, non-technical fallback message
    return NextResponse.json({
      response: "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?"
    });
  }
}
