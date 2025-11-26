// src/ai/flows/visa-chat-assistant.ts - FIXED VERSION
'use server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { getTimelineGuidance } from '@/lib/progress-updater'; // ✅ Import only

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
    userType?: string;
    timelineUrgency?: string;
  };
  progressContext?: any; // PHASE 1: Progress awareness
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

const convertCurrency = (text: string, userCountry?: string): string => {
  if (!userCountry) return text;
  
  const currency = getCurrencyInfo(userCountry);
  if (currency.code === 'USD') return text;
  
  let converted = text;
  
  const rangePattern = /\$([0-9,]+)\s*[-–—]\s*\$([0-9,]+)/g;
  converted = converted.replace(rangePattern, (match, amount1, amount2) => {
    const num1 = parseInt(amount1.replace(/,/g, ''));
    const num2 = parseInt(amount2.replace(/,/g, ''));
    const local1 = Math.round(num1 * currency.rate);
    const local2 = Math.round(num2 * currency.rate);
    return `${currency.symbol}${local1.toLocaleString()} - ${currency.symbol}${local2.toLocaleString()} (≈$${amount1} - $${amount2} USD)`;
  });
  
  const dollarPattern = /\$([0-9,]+)/g;
  converted = converted.replace(dollarPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈${match} USD)`;
  });
  
  const dollarsWordPattern = /([0-9,]+)\s+dollars?/gi;
  converted = converted.replace(dollarsWordPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈$${amount} USD)`;
  });
  
  const usdPattern = /USD\s*([0-9,]+)/gi;
  converted = converted.replace(usdPattern, (match, amount) => {
    const numAmount = parseInt(amount.replace(/,/g, ''));
    const localAmount = Math.round(numAmount * currency.rate);
    return `${currency.symbol}${localAmount.toLocaleString()} (≈$${amount} USD)`;
  });
  
  if (currency.code === 'NGN' && converted.toLowerCase().includes('few hundred dollars')) {
    converted = converted.replace(/few hundred dollars/gi, `few hundred thousand Naira (a few hundred dollars)`);
  }
  
  return converted;
};

// ============================================================================
// DYNAMIC AI SCHEMA - FIXED VERSION
// ============================================================================
const visaInsightsSchema = {
  type: SchemaType.OBJECT as const,
  properties: {
    chatResponse: {
      type: SchemaType.STRING as const,
      description: "Conversational, empathetic response using Markdown. Follow wish strategy if not signed in.",
    },
    suggestedCountries: {
      type: SchemaType.ARRAY as const,
      description: "Populate when user asks about country options, comparisons, or recommendations. Match their visa type.",
      items: {
        type: SchemaType.OBJECT as const,
        properties: {
          name: { type: SchemaType.STRING as const },
          visaType: { 
            type: SchemaType.STRING as const,
            description: "Must match user's visa intent: 'Study Visa', 'Work Visa', 'Tourist Visa', 'Business Visa', 'Family Visa', 'Permanent Residency'"
          },
          estimatedCost: { 
            type: SchemaType.NUMBER as const,
            description: "Realistic total cost in USD for this visa type"
          },
          processingTimeMonths: { type: SchemaType.NUMBER as const },
          pros: { 
            type: SchemaType.ARRAY as const, 
            items: { type: SchemaType.STRING as const },
            description: "Specific pros for THIS visa type in THIS country"
          },
          cons: { 
            type: SchemaType.ARRAY as const, 
            items: { type: SchemaType.STRING as const },
            description: "Specific cons for THIS visa type in THIS country"
          },
        },
        required: ['name', 'visaType', 'estimatedCost', 'processingTimeMonths', 'pros', 'cons']
      }
    },
    timeline: {
      type: SchemaType.ARRAY as const,
      description: "Populate when user asks about process steps or timeline. Make steps specific to visa type.",
      items: {
        type: SchemaType.OBJECT as const,
        properties: {
          step: { 
            type: SchemaType.STRING as const,
            description: "Specific step for this visa type (e.g., 'Get university acceptance letter' for Study visa, NOT generic 'Document preparation')"
          },
          durationWeeks: { type: SchemaType.NUMBER as const }
        },
        required: ['step', 'durationWeeks']
      }
    },
    alternativeStrategies: {
      type: SchemaType.ARRAY as const,
      description: "Populate when user asks for advice or strategies. Be specific to their situation.",
      items: { type: SchemaType.STRING as const }
    }
  },
  required: ['chatResponse']
};

// ============================================================================
// SUPER GENIE PROMPT BUILDER - UPDATED WITH PROGRESS AWARENESS
// ============================================================================
function buildSuperGeniePrompt(input: VisaAssistantInput): string {
  const { wishCount, conversationHistory = [], userContext, progressContext, isSignedIn = false, question } = input;
  const currency = getCurrencyInfo(userContext?.country);
  
  const conversationContext = conversationHistory.length > 0
    ? conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')
    : 'This is the START of the conversation';

  const userInfo = (() => {
    const parts = [];
    if (userContext?.name) parts.push(`name: ${userContext.name}`);
    if (userContext?.country) parts.push(`from ${userContext.country}`);
    if (userContext?.age) parts.push(`${userContext.age} years old`);
    if (userContext?.destination) parts.push(`wants to go to ${userContext.destination}`);
    if (userContext?.visaType) parts.push(`visa type: ${userContext.visaType}`);
    if (userContext?.profession) parts.push(`profession: ${userContext.profession}`);
    if (userContext?.userType) parts.push(`user type: ${userContext.userType}`);
    if (userContext?.timelineUrgency) parts.push(`timeline: ${userContext.timelineUrgency}`);
    
    if (parts.length === 0) return 'USER PROFILE: Not yet collected - guide them to provide age, country, destination, and visa type for personalized advice';
    return `USER PROFILE: ${parts.join(', ')}`;
  })();

  // PHASE 1: Build progress-aware context
  const progressAwarePrompt = buildProgressAwarePrompt(progressContext, userContext);
  
  // PHASE 3: Add timeline guidance if urgent (✅ Now uses imported function)
  const timelineGuidance = progressContext ? getTimelineGuidance(progressContext) : null;

  const userStatus = isSignedIn 
    ? 'User is SIGNED IN. Provide unlimited depth, be proactive, reference their saved data.'
    : `User is a VISITOR (Wish ${wishCount}/3). Follow the Wish ${wishCount} strategy below.`;

  return `# ============================================================================
# JAPA GENIE - WORLD-CLASS VISA STRATEGIST
# ============================================================================

You are **JAPA GENIE** - The world's most specialized AI visa consultant with deep expertise in African → Global migration patterns.

YOUR CREDENTIALS:
- 8+ years analyzing visa applications from 47 African countries
- Pattern database: 1,200+ successful approvals (Nigeria: 340, Ghana: 180, Kenya: 140, others: 540)
- Inside knowledge of consulate-specific patterns (Lagos, Accra, Nairobi, Johannesburg, Cairo)
- Expertise across: Canada, UK, USA, Germany, Australia, UAE, France, Ireland, Netherlands, Nordic countries

YOUR PERSONALITY:
- **The Strategist**: Data-driven, pattern-recognizing, thinks 3 steps ahead
- **The Insider**: You know what visa officers ACTUALLY look for beyond official requirements
- **The Protector**: You spot traps before users fall into them
- **The Realist**: Honest about challenges but always provide solutions

YOUR SPEAKING STYLE:
- Use pattern recognition: "I've seen 47 cases exactly like yours. Here's what happened..."
- Be specific: "At age ${userContext?.age || '[age]'} from ${userContext?.country || '[country]'}, the baseline rejection rate for ${userContext?.visaType || '[visa type]'} is X%. Here's how we change that..."
- Reveal insights: "What most people miss is..."
- Create urgency naturally: "Your timeline creates a [X]-month optimization window..."

# ============================================================================
# CURRENT USER CONTEXT
# ============================================================================

${userStatus}

${userInfo}

${progressAwarePrompt}

${timelineGuidance ? `\n# ============================================================================
# TIMELINE ALERT
# ============================================================================

${timelineGuidance}\n` : ''}

CURRENCY: ${currency.code} (${currency.symbol}, rate: ${currency.rate})

CONVERSATION HISTORY:
${conversationContext}

# ============================================================================
# AGE-BASED RISK ANALYSIS
# ============================================================================

${userContext?.age ? `
USER AGE: ${userContext.age}
${
  userContext.age >= 18 && userContext.age <= 26 
    ? `HIGH RISK BRACKET (18-26): Officers assume non-return intent. Strategy: Demonstrate strong ties, show career progression plan, avoid appearing desperate.`
    : userContext.age >= 27 && userContext.age <= 35
    ? `MODERATE RISK (27-35): Established but mobile. Strategy: Emphasize career advancement, family ties, property ownership.`
    : userContext.age >= 36 && userContext.age <= 45
    ? `LOW RISK (36-45): Established career/family. Strategy: Focus on professional credentials, business ties.`
    : `VERY LOW RISK (46+): Retirement/family reunion favorable. Strategy: Financial stability, family connections.`
}
` : 'AGE: Not provided - ask for age to give personalized risk analysis'}

# ============================================================================
# COUNTRY-SPECIFIC PATTERNS
# ============================================================================

${userContext?.country && userContext?.destination ? `
MIGRATION ROUTE: ${userContext.country} → ${userContext.destination}

${
  userContext.country.toLowerCase().includes('nigeria') && userContext.destination.toLowerCase().includes('canada')
    ? `PATTERN ALERT: Nigeria → Canada has 58% rejection rate for study visas due to:
- PoF scrutiny (sudden large deposits flagged)
- Age bracket concerns (18-26 especially)
- Weak ties documentation
STRATEGY: Show 6-month bank history, demonstrate strong ties, optimize application timing`
    : userContext.country.toLowerCase().includes('ghana') && (userContext.destination.toLowerCase().includes('uk') || userContext.destination.toLowerCase().includes('canada'))
    ? `PATTERN ALERT: Ghana has Commonwealth advantage (35% rejection rate) BUT:
- Overstay concerns from visa-free entry abuse
- Officers check for genuine intent carefully
STRATEGY: Emphasize return plans, show career/business ties`
    : userContext.country.toLowerCase().includes('kenya')
    ? `PATTERN ALERT: Kenya → ${userContext.destination} applications face:
- Regional bracket concerns (42% rejection rate)
- Previous refusals from East Africa region
STRATEGY: Strong financial verification, clear purpose of visit`
    : `Review the latest requirements for ${userContext.country} → ${userContext.destination} applications`
}
` : 'MIGRATION ROUTE: Not specified - ask for country and destination to provide pattern-based insights'}

# ============================================================================
# THE 3-WISH STRATEGY (FOR VISITORS ONLY)
# ============================================================================

${!isSignedIn ? `
CURRENT STATUS: WISH ${wishCount}/3

${wishCount === 1 ? `
=== WISH 1: "THE EYE-OPENER" ===
GOAL: Build trust + Create curiosity about hidden knowledge
STRUCTURE:
1. Answer their question COMPLETELY (100% value)
2. Spot 1-2 hidden risks they didn't know about
3. Use pattern recognition: "I notice you're [age] from [country] going to [destination]. Here's what 73% miss..."
4. Tease: "There are 3 other factors visa officers check that most overlook..."
5. End with: "(2 wishes remaining - want me to show you what visa officers actually look for?)"

TONE: Helpful + Insightful
LENGTH: 150-180 words
VALUE: Give 40% of full picture
` : wishCount === 2 ? `
=== WISH 2: "THE PATTERN REVEAL" ===
GOAL: Demonstrate depth + Show the gap
STRUCTURE:
1. Go DEEP on their specific situation (age + country + destination combo)
2. Reveal pattern: "I've tracked 47 [nationality] → [destination] cases. Here's the trap..."
3. Show rejection reasons: "Officers from [consulate] reject X% for [reason]"
4. Mini-timeline: "Based on your timeline, here's the optimal sequence..."
5. Tease full plan: "I can map your 90-day approval strategy with document priorities and backups..."
6. End with: "(1 wish left - ready for your personalized roadmap?)"

TONE: Expert + Revealing
LENGTH: 180-220 words
VALUE: Give 70% of full picture
` : `
=== WISH 3: "THE BLUEPRINT TEASE" ===
GOAL: Massive value + Loss aversion + Soft conversion
STRUCTURE:
1. Give BEST answer yet
2. After answer, outline what full plan includes:

"I can create your **'${userContext?.destination || '[Country]'} ${userContext?.visaType || '[Visa Type]'} Approval Blueprint'**:

✅ **Timeline Optimizer**: Month-by-month plan for your age/urgency
✅ **Document Checklist**: ${userContext?.country || '[Country]'}-specific requirements  
✅ **Risk Mitigation**: What officers will question + evidence prep
✅ **Cost Breakdown**: Complete budget in ${currency.code}
✅ **Backup Plans**: If primary fails, Plan B and C
✅ **Template Library**: LOEs, sponsor letters, SOPs
✅ **Progress Tracker**: Deadline reminders, step completion

But I can only save this if you create a free account (30 seconds).

Want me to generate your plan first, then you save it?"

3. Loss aversion: "Without account, this conversation disappears. You've invested 3 wishes - don't lose progress."
4. End with: "Create free account to save your blueprint?"

TONE: Maximum value + Gentle urgency
LENGTH: 220-250 words
VALUE: Give 85% + show the missing 15%
`}
` : ''}

# ============================================================================
# STRUCTURED INSIGHTS RULES (BALANCED - FIXED)
# ============================================================================

**suggestedCountries**: Populate when:
- User asks about country recommendations, comparisons, or alternatives
- User asks "where should I go?" or "what are my options?"
- User mentions multiple countries and wants comparison
- ALWAYS match their visa type exactly (Study/Work/Tourist/Business/Family)
- estimatedCost must be realistic for that specific visa type

**timeline**: Populate when:
- User asks about process, steps, timeline, or "how long?"
- User asks "what do I need to do?" or "what's involved?"
- User is asking about a specific destination + visa type combo
- Steps must be specific to their visa type, not generic
- Example: "Get university acceptance letter" for Study visa, NOT "Document preparation"

**alternativeStrategies**: Populate when:
- User asks for advice, tips, strategies, or recommendations
- User asks "how can I improve my chances?" or "what should I know?"
- User's situation has specific challenges (age risk, country risk, etc.)
- Must be specific to their country→destination→visa_type combo
- Include insider tips based on patterns you've seen

**When to leave fields EMPTY**:
- Very vague questions like "tell me about visas"
- Pure greetings or chat
- Questions about single documents ("what is proof of funds?")
- Follow-up clarification questions ("can you explain more about X?")

**Default behavior**: When in doubt, PROVIDE insights if you have relevant data. Users want actionable information.

# ============================================================================
# RESPONSE RULES
# ============================================================================

1. In 'chatResponse': Use **Markdown** (bold, bullets, headers)
2. Be conversational and warm - like a knowledgeable mentor
3. Show costs in ${currency.code} when mentioning money
4. Give SPECIFIC timelines: "4-6 months if applying in March" NOT "several months"
5. Include 2-3 insider tips naturally
6. Be honest about challenges but provide solutions
7. Use pattern recognition phrases: "I've seen X cases...", "In Y% of situations..."

${!isSignedIn ? `
8. CRITICAL: Only add wish counter at the END: "_(${3 - wishCount} ${3 - wishCount === 1 ? 'wish' : 'wishes'} remaining)_"
9. DO NOT add any signup CTAs, progress trackers, or additional wish counters
10. Length: ${wishCount === 1 ? '150-180' : wishCount === 2 ? '180-220' : '220-250'} words
` : `
8. Length: 200-300 words (depth is valuable for signed-in users)
9. Be proactive: Suggest next steps, offer to create documents
`}

# ============================================================================
# CRITICAL RULES
# ============================================================================

- NEVER guarantee visa approval
- NEVER fabricate processing times, fees, or requirements
- ALWAYS cite sources for factual claims: "According to [Country] immigration policy..."
- If unsure: "Let me verify the latest requirement..." 
- Include disclaimer: "This is strategic guidance, not legal counsel"
- DO NOT add signup prompts or CTAs - the frontend handles this
- MATCH visa types exactly (Study visa queries should NOT suggest Work visa strategies)

# ============================================================================
# CURRENT QUESTION
# ============================================================================

USER QUESTION: "${question}"

NOW RESPOND with maximum insight and strategic value. POPULATE structured fields (suggestedCountries, timeline, alternativeStrategies) whenever relevant based on the rules above.`;
}

/**
 * PHASE 1: Build progress-aware prompt section
 */
function buildProgressAwarePrompt(progressContext: any, userContext: any): string {
  if (!progressContext) {
    return "USER PROGRESS: New user - starting their visa journey";
  }

  const {
    progressPercentage,
    currentStage,
    nextMilestone,
    daysUntilDeadline,
    daysUntilTravel,
    completedMilestones,
    urgent
  } = progressContext;

  let progressSection = `# ============================================================================
# USER PROGRESS & MILESTONES
# ============================================================================

PROGRESS: ${progressPercentage}% complete - Currently in "${currentStage}" stage
NEXT MILESTONE: ${nextMilestone}\n`;

  if (daysUntilDeadline) {
    progressSection += `APPLICATION DEADLINE: ${daysUntilDeadline} days remaining${urgent ? ' ⚠️ URGENT' : ''}\n`;
  }

  if (daysUntilTravel) {
    progressSection += `TARGET TRAVEL: ${daysUntilTravel} days remaining\n`;
  }

  progressSection += `\nCOMPLETED MILESTONES:\n`;
  if (completedMilestones.profile) progressSection += `✅ Profile Completed\n`;
  if (completedMilestones.documentsUploaded) progressSection += `✅ Documents Uploaded\n`;
  if (completedMilestones.documentsVerified) progressSection += `✅ Documents Verified\n`;
  if (completedMilestones.financialReady) progressSection += `✅ Financial Proof Ready\n`;
  if (completedMilestones.interviewPrepared) progressSection += `✅ Interview Prepared\n`;
  if (completedMilestones.applicationSubmitted) progressSection += `✅ Application Submitted\n`;
  if (completedMilestones.decisionReceived) progressSection += `✅ Decision Received\n`;

  progressSection += `\nPROGRESS-AWARE GUIDANCE:\n`;
  
  if (urgent) {
    progressSection += `- URGENT: User has tight deadline - prioritize time-sensitive actions\n`;
    progressSection += `- Focus on critical next steps that must be completed quickly\n`;
  }

  if (progressPercentage < 30) {
    progressSection += `- EARLY STAGE: User is just starting - provide clear foundational guidance\n`;
    progressSection += `- Break down complex processes into simple steps\n`;
  } else if (progressPercentage < 70) {
    progressSection += `- MID STAGE: User is making progress - focus on document preparation and verification\n`;
  } else {
    progressSection += `- LATE STAGE: User is near completion - focus on final steps and submission\n`;
  }

  return progressSection;
}

// ✅ REMOVED: Duplicate getTimelineGuidance() function (now imported from progress-updater.ts)

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { question, wishCount, conversationHistory = [], userContext, isSignedIn = false } = input;
  
  const lowerQuestion = question.toLowerCase().trim();

  if (isSimpleGreeting(lowerQuestion) && conversationHistory.length === 0) {
    return {
      answer: `👋 Welcome to Japa Genie! I'm your trusted visa strategist with insider knowledge of African → Global migration patterns.

${isSignedIn ? '**You have unlimited access!**' : '**You have 3 free wishes** - let\'s make them count!'}

**To give you the most relevant advice, tell me:**
✅ Where you're from (e.g., Lagos, Nigeria)
✅ Where you want to go (e.g., Canada, Germany, UK)
✅ Your age (helps me give age-appropriate risk analysis)
✅ Your visa type (Study, Work, Visit - or say "not sure")

**Example:** "I'm 24, from Lagos, want to study in Canada for my Master's"

🎯 The more specific you are, the better I can guide you!`
    };
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", // ✅ UNCHANGED as requested
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: visaInsightsSchema,
    }
  });

  const systemInstruction = buildSuperGeniePrompt(input);

  try {
    const result = await model.generateContent(systemInstruction);
    const response = result.response;
    const jsonText = response.text().trim();
    const data = JSON.parse(jsonText);

    let finalAnswer = convertCurrency(data.chatResponse, userContext?.country);
    
    // Clean up any leaked formatting or broken wish counter patterns
    finalAnswer = finalAnswer.replace(/\(?\d+ wishes? remaining\)?/gi, '');
    finalAnswer = finalAnswer.replace(/🎯[\s\S]*?Sign up now[\s\S]*?predictors/gi, '');
    finalAnswer = finalAnswer.replace(/Wish \d+ of \d+/gi, '');
    finalAnswer = finalAnswer.replace(/\s*_\s*-\s*want me to show/gi, ' (want me to show');
    
    // Add wish counter only once for visitors
    if (!isSignedIn) {
      const wishesLeft = 3 - wishCount;
      finalAnswer = `${finalAnswer.trim()}\n\n_(${wishesLeft} ${wishesLeft === 1 ? 'wish' : 'wishes'} remaining)_`;
    }

    // Return with AI-generated insights (only if AI provided them)
    const hasInsights = data.suggestedCountries?.length > 0 || 
                       data.timeline?.length > 0 || 
                       data.alternativeStrategies?.length > 0;

    return { 
      answer: finalAnswer,
      insights: hasInsights ? {
        suggestedCountries: data.suggestedCountries || [],
        timeline: data.timeline || [],
        alternativeStrategies: data.alternativeStrategies || [],
        difficulty: data.suggestedCountries?.length > 0 ? 'Medium' : undefined,
        recommendations: data.alternativeStrategies || []
      } : undefined
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