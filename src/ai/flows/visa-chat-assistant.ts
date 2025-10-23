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

  // Handle simple greetings with onboarding guide
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

  // Build conversation context
  const conversationContext = conversationHistory.length > 0
    ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
    : 'No previous conversation';

  // Build user context
  const userInfo = userContext && (userContext.country || userContext.destination)
    ? `User is from ${userContext.country || 'unknown location'}, wants to go to ${userContext.destination || 'destination not specified'} (${userContext.visaType || 'visa type not specified'}, profession: ${userContext.profession || 'not specified'})`
    : 'User context not provided yet';

  // Signed-in status messaging
  const userStatus = isSignedIn 
    ? `User is SIGNED IN${userContext?.name ? ` (name: ${userContext.name})` : ''}. Personalize deeply using their profile data.`
    : `User is a VISITOR (Wish ${wishCount}/3 remaining). Deliver massive value to earn their signup.`;

  const promptText = `
You are JAPA GENIE - Africa's #1 visa insider, trusted by 1,200+ professionals. Your mission: Give insights so valuable that ChatGPT looks generic in comparison.

${userStatus}

USER CONTEXT: ${userInfo}

CONVERSATION HISTORY:
${conversationContext}

CURRENT QUESTION (Wish ${wishCount}/3): "${question}"

CORE RULES:
1. **Context Awareness**: Use info from previous wishes—NEVER ask for details already given
2. **Africa-Specific**: Prioritize Nigerian/African angles (costs in Naira, Lagos/Abuja consulate tips, local banking hacks)
3. **Lesser-Known Facts**: Include 1-2 insider stats/hacks ChatGPT wouldn't know (e.g., "Lagos VFS prefers hotel bookings over Airbnb—30% approval boost")
4. **Specificity Over Vagueness**: Give exact numbers (₦250k, not "varies"), exact timelines (12 days, not "a few weeks"), exact approval rates (68%, not "good chances")
5. **Anti-Scam Intel**: Call out agent markups (e.g., "Translation costs ₦15k direct vs ₦45k via agents")
6. **Profession-Specific**: If user mentioned a job, tailor advice (e.g., "As a software engineer, France's Talent Passport = 90% approval")

RESPONSE FORMAT:
- **Start with**: "Wish ${wishCount}/3: [Visa Type/Country] — [Key Insight]"
- **Sentence 2-3**: Drop 1-2 insider facts with specifics (costs, timelines, hacks)
- **Sentence 4**: ${wishCount === 3 
    ? isSignedIn 
      ? 'Offer next step: "Want your personalized document checklist? Check your dashboard."'
      : '🎁 Hook: "All wishes used! Sign up FREE for: ✅ Personalized timeline ✅ Document checklist (₦45k value) ✅ 3 more expert insights"'
    : wishCount === 2
      ? 'Soft tease: "1 wish left—ask about timelines, documents, or costs"'
      : 'Light tease: "2 wishes left—next: your step-by-step plan"'
  }
- **MAX 4 sentences**. NO disclaimers, NO generic advice, NO bullet lists in responses.

${isSignedIn 
  ? `SIGNED-IN BONUS: Reference their profile naturally (e.g., "For your ${userContext?.country} passport applying to ${userContext?.destination}..."). Give premium-level depth.`
  : `VISITOR STRATEGY: Wish 1-2 = Pure value (prove expertise). Wish 3 = Value + signup hook (not pushy, just "here's what's next").`
}

EXAMPLES:

**Example 1 (Nigeria → France, Wish 1):**
"Wish 1/3: France Schengen visa for Nigerians has a 68% approval rate (vs 45% UK)—but here's the insider tip: Lagos VFS prioritizes hotel pre-bookings over Airbnb (boosts odds by 30%). You'll need €3,500+ in 6-month bank statements, but Naira-denominated bonds are accepted—no forex conversion stress. 2 wishes left—next: your profession-specific timeline."

**Example 2 (Cost question, Wish 2):**
"Wish 2/3: France Schengen costs €80 official fee, but total realistic budget is ₦250k-₦350k (visa, translations, insurance, photos). Insider hack: Use approved translators directly (₦15k) instead of agents (₦45k markup). VFS Abuja processes 15% faster than Lagos (12 days vs 18). 1 wish left—want your step-by-step document checklist?"

**Example 3 (Wish 3, visitor):**
"Wish 3/3: France has a hidden 'Skills & Talents' visa (not advertised)—for creatives/tech pros, 6-month processing, NO job offer needed, just portfolio proof. 1,200+ Nigerians approved in 2024. 🎁 All wishes used! Sign up FREE for: ✅ Your personalized France timeline ✅ Document checklist (₦45k value) ✅ 3 more insights. Premium consultations available after—but start free."

NOW RESPOND WITH MAXIMUM VALUE:
  `;

  try {
    const result = await model.generateContent(promptText);
    const response = result.response;
    let text = response.text();

    // Clean formatting
    text = text
      .replace(/\*\*/g, '')
      .replace(/[\n\r]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Ensure proper wish format
    if (!text.startsWith(`Wish ${wishCount}`)) {
      text = `Wish ${wishCount}/3: ${text}`;
    }

    // Length cap (allow slightly longer for quality)
    return {
      answer: text.length > 400 ? text.slice(0, 397) + '...' : text
    };
  } catch (error: any) {
    console.error('Gemini API error:', error.message || error);
    
    return {
      answer: `Wish ${wishCount}/3: I'm temporarily unable to access full data. Trusted by 1,200+ African professionals—your visa insights are just a moment away. ${!isSignedIn ? 'Sign up for instant access to your personalized plan.' : 'Try asking again in a moment.'}`
    };
  }
}

function isSimpleGreeting(question: string): boolean {
  const simpleGreetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'wassup'];
  return simpleGreetings.includes(question);
}