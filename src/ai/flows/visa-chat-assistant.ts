'use server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface VisaAssistantInput {
  question: string;
  wishCount: number;
  conversationHistory?: Array<{ role: 'user' | 'assistant', content: string }>;
  userContext?: {
    name?: string;
    country?: string;
    destination?: string;
    profession?: string;
    visaType?: string;
    age?: number;
    dateOfBirth?: string;
  };
  isSignedIn?: boolean;
}

interface VisaAssistantOutput {
  answer: string;
  insights?: {
    suggestedCountries?: Array<{
      name: string;
      visaType: string;
      estimatedCost: number;
      processingTimeMonths: number;
      pros: string[];
      cons: string[];
    }>;
    timeline?: Array<{
      step: string;
      durationWeeks: number;
    }>;
    alternativeStrategies?: string[];
    difficulty?: string;
    recommendations?: string[];
  };
}

const getCurrencyInfo = (country?: string): { symbol: string; code: string; rate: number } => {
  const countryLower = country?.toLowerCase() || '';
  
  if (countryLower.includes('nigeria')) {
    return { symbol: '₦', code: 'NGN', rate: 1650 };
  }
  if (countryLower.includes('ghana')) {
    return { symbol: '₵', code: 'GHS', rate: 12 };
  }
  if (countryLower.includes('kenya')) {
    return { symbol: 'KSh', code: 'KES', rate: 130 };
  }
  if (countryLower.includes('south africa')) {
    return { symbol: 'R', code: 'ZAR', rate: 18 };
  }
  if (countryLower.includes('egypt')) {
    return { symbol: 'E£', code: 'EGP', rate: 31 };
  }
  
  return { symbol: '$', code: 'USD', rate: 1 };
};

const detectCountries = (question: string, answer: string): string[] => {
  const text = `${question} ${answer}`.toLowerCase();
  
  const countryMap: { [key: string]: string } = {
    'japan': 'Japan',
    'canada': 'Canada',
    'germany': 'Germany',
    'australia': 'Australia',
    'usa': 'USA',
    'united states': 'USA',
    'america': 'USA',
    'uk': 'UK',
    'united kingdom': 'UK',
    'britain': 'UK',
    'france': 'France',
    'italy': 'Italy',
    'spain': 'Spain',
    'netherlands': 'Netherlands',
    'sweden': 'Sweden',
    'norway': 'Norway',
    'denmark': 'Denmark',
    'finland': 'Finland',
    'switzerland': 'Switzerland',
    'austria': 'Austria',
    'belgium': 'Belgium',
    'portugal': 'Portugal',
    'ireland': 'Ireland',
    'new zealand': 'New Zealand',
    'singapore': 'Singapore',
    'dubai': 'UAE',
    'uae': 'UAE'
  };
  
  const detected: string[] = [];
  
  for (const [keyword, country] of Object.entries(countryMap)) {
    if (text.includes(keyword) && !detected.includes(country)) {
      detected.push(country);
    }
  }
  
  return detected.length > 0 ? detected.slice(0, 3) : ['Canada', 'Germany', 'Australia'];
};

const generateInsights = (question: string, answer: string, userCountry?: string): VisaAssistantOutput['insights'] => {
  if (!question || !answer || question.length < 3) {
    return undefined;
  }
  
  const detectedCountries = detectCountries(question, answer);
  const currency = getCurrencyInfo(userCountry);
  
  const suggestedCountries = detectedCountries.map(country => {
    const baseUSD = 5000;
    const localCost = currency.code !== 'USD' ? Math.round(baseUSD * currency.rate) : baseUSD;
    
    return {
      name: country,
      visaType: 'Skilled Worker Visa',
      estimatedCost: localCost,
      processingTimeMonths: 6,
      pros: [
        "Points-based immigration system",
        "Pathway to permanent residency", 
        "Strong economy and job market"
      ],
      cons: [
        "Competitive application process",
        "High cost of living",
        "Lengthy processing times"
      ]
    };
  });
  
  return {
    suggestedCountries,
    timeline: [
      { step: "Document preparation", durationWeeks: 2 },
      { step: "Application submission", durationWeeks: 1 },
      { step: "Processing & review", durationWeeks: 12 },
      { step: "Biometrics & interview", durationWeeks: 2 },
      { step: "Decision & visa issuance", durationWeeks: 2 }
    ],
    alternativeStrategies: [
      "Consider applying during off-peak seasons for faster processing",
      "Look into provincial nomination programs for additional points",
      "Research employer-sponsored visa options for direct placement"
    ],
    difficulty: 'Medium',
    recommendations: [
      "Consider applying during off-peak seasons for faster processing",
      "Look into provincial nomination programs for additional points",
      "Research employer-sponsored visa options for direct placement"
    ]
  };
};

const visaInsightsSchema = {
  type: SchemaType.OBJECT as const,
  properties: {
    chatResponse: {
      type: SchemaType.STRING as const,
      description: "A conversational, empathetic response using Markdown formatting (e.g., **bold**, bullet points, headers). Be warm and helpful.",
    },
    suggestedCountries: {
      type: SchemaType.ARRAY as const,
      description: "2-3 recommended countries based on user's profile.",
      items: {
        type: SchemaType.OBJECT as const,
        properties: {
          name: { type: SchemaType.STRING as const },
          visaType: { type: SchemaType.STRING as const },
          estimatedCost: { type: SchemaType.NUMBER as const },
          processingTimeMonths: { type: SchemaType.NUMBER as const },
          pros: { 
            type: SchemaType.ARRAY as const, 
            items: { type: SchemaType.STRING as const } 
          },
          cons: { 
            type: SchemaType.ARRAY as const, 
            items: { type: SchemaType.STRING as const } 
          },
        },
        required: ['name', 'visaType', 'estimatedCost', 'processingTimeMonths', 'pros', 'cons']
      }
    },
    timeline: {
      type: SchemaType.ARRAY as const,
      description: "Key steps in the immigration process.",
      items: {
        type: SchemaType.OBJECT as const,
        properties: {
          step: { type: SchemaType.STRING as const },
          durationWeeks: { type: SchemaType.NUMBER as const }
        },
        required: ['step', 'durationWeeks']
      }
    },
    alternativeStrategies: {
      type: SchemaType.ARRAY as const,
      description: "2-3 alternative strategies to consider.",
      items: { type: SchemaType.STRING as const }
    }
  },
  required: ['chatResponse', 'suggestedCountries', 'timeline', 'alternativeStrategies']
};

// FIXED: COMPLETE currency conversion - catches ALL patterns including ranges
const convertCurrency = (text: string, userCountry?: string): string => {
  if (!userCountry) return text;
  
  const currency = getCurrencyInfo(userCountry);
  if (currency.code === 'USD') return text;
  
  let converted = text;
  
  // Pattern 1: $2,000 - $3,000 (ranges with hyphens or dashes)
  const rangePattern = /\$([0-9,]+)\s*[-–—]\s*\$([0-9,]+)/g;
  converted = converted.replace(rangePattern, (match, amount1, amount2) => {
    const num1 = parseInt(amount1.replace(/,/g, ''));
    const num2 = parseInt(amount2.replace(/,/g, ''));
    const local1 = Math.round(num1 * currency.rate);
    const local2 = Math.round(num2 * currency.rate);
    return `${currency.symbol}${local1.toLocaleString()} - ${currency.symbol}${local2.toLocaleString()} (≈$${amount1} - $${amount2} USD)`;
  });
  
  // Pattern 2: $30, $5,000, $5000 (standard dollar amounts)
  const dollarPattern = /\$([0-9,]+)/g;
  converted = converted.replace(dollarPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈${match} USD)`;
  });
  
  // Pattern 3: 5000 dollars or 30 dollars
  const dollarsWordPattern = /([0-9,]+)\s+dollars?/gi;
  converted = converted.replace(dollarsWordPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈$${amount} USD)`;
  });
  
  // Pattern 4: USD 5000 or USD 30
  const usdPattern = /USD\s*([0-9,]+)/gi;
  converted = converted.replace(usdPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈$${amount} USD)`;
  });
  
  // Pattern 5: Generic mentions for Nigerian context
  if (currency.code === 'NGN' && converted.toLowerCase().includes('few hundred dollars')) {
    converted = converted.replace(/few hundred dollars/gi, `few hundred thousand Naira (a few hundred dollars)`);
  }
  
  return converted;
};

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { question, wishCount, conversationHistory = [], userContext, isSignedIn = false } = input;
  
  const lowerQuestion = question.toLowerCase().trim();

  if (isSimpleGreeting(lowerQuestion) && conversationHistory.length === 0) {
    return {
      answer: `👋 Welcome to Japa Genie! I'm your trusted visa guide with insider knowledge that goes beyond what you'll find anywhere else.

${isSignedIn ? 'You have unlimited access!' : 'You have **3 free wishes** - let\'s make them count!'}

**To give you the most relevant advice, tell me:**
✅ Where you're from (e.g., Lagos, Nigeria)
✅ Where you want to go (e.g., Canada, Germany, UK)
✅ Your age or date of birth (helps me give age-appropriate advice)
✅ Your visa type (Study, Work, Visit - or just say "not sure")

**Example:** "I'm 24, from Lagos, want to study in Canada for my Master's"

🎯 The more specific you are, the better I can guide you!`
    };
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: visaInsightsSchema,
    }
  });

  const conversationContext = conversationHistory.length > 0
    ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    : 'No previous conversation';

  const currency = getCurrencyInfo(userContext?.country);

  const userInfo = (() => {
    const parts = [];
    if (userContext?.country) parts.push(`from ${userContext.country}`);
    if (userContext?.age) parts.push(`${userContext.age} years old`);
    if (userContext?.destination) parts.push(`wants to go to ${userContext.destination}`);
    if (userContext?.visaType) parts.push(`visa type: ${userContext.visaType}`);
    if (userContext?.profession) parts.push(`profession: ${userContext.profession}`);
    
    if (parts.length === 0) return 'User context not provided yet';
    return `User is ${parts.join(', ')}`;
  })();

  const userStatus = isSignedIn 
    ? `User is SIGNED IN${userContext?.name ? ` (name: ${userContext.name})` : ''}. Provide thorough, premium guidance.`
    : `User is a VISITOR (Wish ${wishCount}/3 remaining). Deliver exceptional value.`;

  const systemInstruction = `You are JAPA GENIE - Africa's most trusted visa consultant. You've helped 1,200+ professionals successfully relocate.

${userStatus}

USER CONTEXT: ${userInfo}

CURRENCY: ${currency.code} (${currency.symbol})

CONVERSATION HISTORY:
${conversationContext}

RESPONSE RULES:
1. In 'chatResponse': Use **Markdown formatting** (bold, bullets, headers)
2. Be conversational and warm - write like a knowledgeable friend
3. Show costs in ${currency.code} when mentioning money
4. Give specific timelines (not "several months" - say "4-6 months")
5. Include 2-3 insider tips naturally
6. Be honest about challenges but provide solutions
7. For visitors: Keep response 150-200 words
8. For signed-in: Can be 180-220 words with more detail

${!isSignedIn ? `\nVISITOR STRATEGY:\n- Answer completely (never hold back)\n- Build trust with specific, actionable advice\n- After answer, add: "_(${3 - wishCount} ${3 - wishCount === 1 ? 'wish' : 'wishes'} remaining)_"` : ''}

Now respond to: "${question}"`;

  try {
    const result = await model.generateContent(systemInstruction);
    const response = result.response;
    const jsonText = response.text().trim();
    const data = JSON.parse(jsonText);

    // Apply COMPLETE currency conversion (catches $30, $2,000 - $3,000, etc.)
    let finalAnswer = convertCurrency(data.chatResponse, userContext?.country);
    
    if (!isSignedIn && !finalAnswer.includes('wish') && !finalAnswer.includes('Wish')) {
      const wishesLeft = 3 - wishCount;
      finalAnswer = `${finalAnswer}\n\n_(${wishesLeft} ${wishesLeft === 1 ? 'wish' : 'wishes'} remaining)_`;
    }

    const insights = generateInsights(question, finalAnswer, userContext?.country);

    return { 
      answer: finalAnswer,
      insights: insights
    };
  } catch (error: any) {
    console.error('Gemini API error:', error.message || error);
    
    return {
      answer: isSignedIn 
        ? `I'm temporarily having trouble connecting. Please try asking again.`
        : `I hit a temporary connection issue. You still have ${3 - wishCount} wishes remaining. Try asking again in a moment.`
    };
  }
}

function isSimpleGreeting(question: string): boolean {
  const simpleGreetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'wassup', 'hola', 'bonjour', 'hi there', 'hello there', 'good morning', 'good afternoon', 'good evening'];
  return simpleGreetings.some(greeting => question === greeting || question.startsWith(greeting + ' ') || question.startsWith(greeting + ','));
}