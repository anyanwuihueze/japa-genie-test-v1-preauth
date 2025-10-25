'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  };
  isSignedIn?: boolean;
}

interface VisaAssistantOutput {
  answer: string;
}

export async function visaChatAssistant(input: VisaAssistantInput): Promise<VisaAssistantOutput> {
  const { question, wishCount, conversationHistory = [], userContext, isSignedIn = false } = input;
  
  const ordinal = wishCount === 1 ? 'first' : wishCount === 2 ? 'second' : 'final';
  const lowerQuestion = question.toLowerCase().trim();

  if (isSimpleGreeting(lowerQuestion) && conversationHistory.length === 0) {
    return {
      answer: `👋 Welcome to Japa Genie! I'm here to give you insider visa knowledge that ChatGPT can't match. You have **3 wishes**—let's make them count!

**To get the most value, tell me:**
✅ Where you're from (e.g., Nigeria, Ghana, Kenya)
✅ Where you want to go (e.g., France, Canada, UK)
✅ Your visa type (Study, Work, Visit—or just say "not sure")
✅ Your profession (optional—helps me give specific tips)

**Example:** "I'm from Lagos, Nigeria. I want to study in Canada (Master's in Data Science)"

🎯 The more details you give, the more insider hacks I can drop! What's your visa dream?`
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const conversationContext = conversationHistory.length > 0
    ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    : 'No previous conversation';

  const userInfo = userContext && (userContext.country || userContext.destination)
    ? `User is from ${userContext.country || 'unknown location'}, wants to go to ${userContext.destination || 'destination not specified'} (${userContext.visaType || 'visa type not specified'}, profession: ${userContext.profession || 'not specified'})`
    : 'User context not provided yet';

  const userStatus = isSignedIn 
    ? `User is SIGNED IN${userContext?.name ? ` (name: ${userContext.name})` : ''}. Give detailed, premium responses.`
    : `User is a VISITOR (Wish ${wishCount}/3 remaining). Deliver massive value to earn their signup.`;

  const promptText = `
You are JAPA GENIE - Africa's #1 visa insider, trusted by 1,200+ professionals. Your mission: Give insights so valuable that ChatGPT looks generic in comparison.

${userStatus}

USER CONTEXT: ${userInfo}

CONVERSATION HISTORY:
${conversationContext}

CURRENT QUESTION (Wish ${wishCount}${isSignedIn ? '' : '/3'}): "${question}"

CORE RULES:
1. **Context Awareness**: Use info from previous wishes—NEVER ask for details already given
2. **Africa-Specific**: Prioritize Nigerian/African angles (costs in Naira, Lagos/Abuja consulate tips, local banking hacks)
3. **Lesser-Known Facts**: Include 1-2 insider stats/hacks ChatGPT wouldn't know (e.g., "Lagos VFS prefers hotel bookings over Airbnb—30% approval boost")
4. **Specificity Over Vagueness**: Give exact numbers (₦250k, not "varies"), exact timelines (12 days, not "a few weeks"), exact approval rates (68%, not "good chances")
5. **Anti-Scam Intel**: Call out agent markups (e.g., "Translation costs ₦15k direct vs ₦45k via agents")
6. **Profession-Specific**: If user mentioned a job, tailor advice (e.g., "As a software engineer, France's Talent Passport = 90% approval")

RESPONSE FORMAT:
${isSignedIn 
  ? `- Give detailed, comprehensive answers (no length limit)
- Include ALL relevant details, timelines, costs, and insider tips
- Be thorough - signed-in users deserve premium responses`
  : `- **Start with**: "Wish ${wishCount}/3: [Visa Type/Country] — [Key Insight]"
- **Sentence 2-3**: Drop 1-2 insider facts with specifics (costs, timelines, hacks)
- **Sentence 4**: ${wishCount === 3 
    ? '🎁 Hook: "All wishes used! Sign up FREE for: ✅ Personalized timeline ✅ Document checklist (₦45k value) ✅ 3 more expert insights"'
    : wishCount === 2
      ? 'Soft tease: "1 wish left—ask about timelines, documents, or costs"'
      : 'Light tease: "2 wishes left—next: your step-by-step plan"'
  }
- **MAX 4 sentences**. NO disclaimers, NO generic advice, NO bullet lists in responses.`
}

${isSignedIn 
  ? `SIGNED-IN USERS GET PREMIUM RESPONSES:
- Comprehensive, detailed answers with no length restrictions
- Full breakdowns of costs, timelines, and processes
- Multiple insider tips and hacks
- Reference their profile naturally when relevant`
  : `VISITOR STRATEGY: 
Wish 1-2 = Pure value (prove expertise). 
Wish 3 = Value + signup hook (not pushy, just "here's what's next").`
}

NOW RESPOND WITH MAXIMUM VALUE:
  `;

  try {
    const result = await model.generateContent(promptText);
    const response = result.response;
    let text = response.text();

    text = text
      .replace(/\*\*/g, '')
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!isSignedIn && !text.startsWith(`Wish ${wishCount}`)) {
      text = `Wish ${wishCount}/3: ${text}`;
    }

    // NO LENGTH LIMIT FOR SIGNED-IN USERS
    // Only truncate visitors at 400 chars
    if (!isSignedIn && text.length > 400) {
      text = text.slice(0, 397) + '...';
    }

    return { answer: text };
  } catch (error: any) {
    console.error('Gemini API error:', error.message || error);
    
    return {
      answer: `Wish ${wishCount}${isSignedIn ? '' : '/3'}: I'm temporarily unable to access full data. Trusted by 1,200+ African professionals—your visa insights are just a moment away. ${!isSignedIn ? 'Sign up for instant access to your personalized plan.' : 'Try asking again in a moment.'}`
    };
  }
}

function isSimpleGreeting(question: string): boolean {
  const simpleGreetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'wassup'];
  return simpleGreetings.includes(question);
}
