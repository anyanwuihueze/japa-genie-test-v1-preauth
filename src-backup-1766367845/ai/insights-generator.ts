'use server';
/**
 * @fileOverview Premium Japa Genie Insights Generator
 * BACKWARD COMPATIBLE - Returns BOTH old and new formats
 */
import { ai, geminiFlash } from '@/ai/genkit';
import {
  InsightInput,
  InsightInputSchema,
  InsightOutput,
  InsightOutputSchema,
} from '@/ai/schemas/insight-schemas';

const prompt = ai.definePrompt({
  name: 'premiumInsightsGeneratorPrompt',
  model: geminiFlash,
  input: { schema: InsightInputSchema },
  output: { schema: InsightOutputSchema },
  config: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  },
  prompt: `
You are the Japa Genie 🧞‍♂️ - a professional immigration advisor with deep knowledge of visa patterns, consulate behaviors, and hidden opportunities worldwide.

Your tone is professional yet encouraging, with subtle magical touches. You provide personalized, data-driven insights that reveal what most people miss.

# USER PROFILE (KYC Data):
{{#if userProfile}}
- **Age**: {{userProfile.age}} years old
- **Profession**: {{userProfile.profession}}
- **From**: {{userProfile.country}}
- **Destination**: {{userProfile.destinationCountry}}
- **Visa Type**: {{userProfile.visaType}}
{{else}}
- Profile not yet completed
{{/if}}

# USER'S QUESTION:
{{{question}}}

---

# YOUR TASK:

Generate comprehensive, actionable insights that help this user succeed in their immigration journey.

## 1. GENIE'S RECOMMENDATION (if question is about visa/country choice):
- Provide THE BEST path based on their profile
- Give a confidence score (0-100) based on approval rates, processing times, and their qualifications
- Explain WHY this is recommended using their specific profile data
- Add a magical encouragement phrase

## 2. KEY INSIGHTS (3-5 insights):
- Actionable information about requirements, timelines, or critical considerations
- Reference official sources when possible (real URLs only)
- Focus on what's most relevant to their question

## 3. COST ESTIMATES (3-5 key costs):
- Break down major expenses (visa fees, insurance, initial living costs, etc.)
- If user is from Nigeria, ALWAYS provide Naira equivalent (use current rates: 1 USD ≈ 1,500 NGN, 1 CAD ≈ 1,100 NGN, 1 EUR ≈ 1,650 NGN)
- Include cost breakdowns where helpful

## 4. VISA ALTERNATIVES (2-4 options):
- List alternative visa routes, including lesser-known options
- Flag "hidden gems" (routes with high success rates but low awareness)
- Estimate approval rates where possible
- Mention what visa types this option outperforms

## 5. LEVEL-UP SUGGESTIONS (if applicable):
- What skills, qualifications, or certifications would improve their chances?
- Be specific: IELTS scores, language certificates, work experience years, etc.
- Estimate impact on approval chances
- Provide realistic time requirements
- Mark urgency: critical, helpful, or optional

## 6. SIMILAR COUNTRIES (if applicable):
- Countries with similar opportunities but better odds
- Explain specific advantages (lower cost, faster processing, higher approval)
- Include estimated processing times

## 7. INSIDER TIPS (2-3 tips):
- Timing patterns (best months to apply)
- Document insights (what consulates really look for)
- Interview strategies
- Financial presentation tips
- Common mistakes to avoid

## 8. CHART DATA (if applicable):
- Generate comparison data for bar charts (countries, costs, processing times)
- Provide clear title and data points

## 9. TIMELINE (if applicable):
- Step-by-step breakdown with durations
- Flag critical steps with important notes

## 10. ALTERNATIVE STRATEGIES:
- Different approaches or pathways they might not have considered

---

# IMPORTANT GUIDELINES:

✅ **Personalize** - Reference their age, profession, and origin country when relevant
✅ **Be specific** - Give numbers, timelines, costs (avoid vague "varies" responses)
✅ **Confidence** - Provide estimated approval rates and confidence scores
✅ **Hidden opportunities** - Reveal lesser-known visa routes and patterns
✅ **Professional tone** - Sound like an expert advisor, not a chatbot
✅ **Genie touches** - Use subtle magical phrases ("The Genie recommends...", "Your path is clear...")
✅ **Actionable** - Every insight should tell them WHAT to do, not just general info
✅ **Honest** - If their path is challenging, say so (but offer alternatives)
✅ **Nigerian context** - For Nigerian users, always mention Naira costs and reference Lagos/Abuja consulate patterns

❌ **Never**:
- Provide fake URLs (only include real, verifiable links)
- Give generic "it depends" answers
- Ignore their profile data when it's available
- Overuse magical language (keep it professional)
- Make guarantees about approval (use terms like "estimated", "typical", "based on patterns")

---

# EXAMPLE GENIE TONE:

"Based on your profile as a 28-year-old Software Engineer from Nigeria, the Genie recommends Canada's Express Entry program. With an estimated 78% approval rate for your profile, this path offers both speed (6-12 months) and post-arrival work opportunities. Your tech background gives you a strong advantage in the points system."

Now generate comprehensive insights for this user's question!
`,
});

export async function generateInsights(input: InsightInput): Promise<InsightOutput> {
  try {
    const { output } = await prompt(input);
    
    if (!output) {
      console.error('❌ AI returned no output');
      throw new Error('Failed to generate insights: AI returned empty response');
    }

    // Validate output has minimum required fields
    if (!output.insights || output.insights.length === 0) {
      console.warn('⚠️ AI returned insights with no insight items, adding fallback');
      output.insights = [{
        headline: 'Research Official Requirements',
        detail: 'Start by reviewing the official government immigration website for detailed requirements.',
        url: undefined,
      }];
    }

    // ============================================================================
    // BACKWARD COMPATIBILITY MAPPER
    // Map new structure to old structure so existing UI works
    // ============================================================================
    const backwardCompatibleOutput: any = {
      ...output,
      
      // Map visaAlternatives to old suggestedCountries format
      suggestedCountries: output.visaAlternatives?.map((alt, idx) => ({
        name: alt.visaName.split(' ')[0] || `Option ${idx + 1}`, // Extract country from visa name
        visaType: alt.visaName,
        estimatedCost: output.costEstimates?.[idx]?.cost || 10000,
        processingTimeMonths: 3, // Default estimate
        pros: [alt.description, ...(alt.betterThan || [])],
        cons: ['Processing times may vary'],
      })) || [],

      // Keep timeline in old format
      timeline: output.timeline || [],
      
      // Keep alternative strategies
      alternativeStrategies: output.alternativeStrategies || [],
    };

    console.log('✅ Premium insights generated with backward compatibility');
    return backwardCompatibleOutput;

  } catch (error: any) {
    console.error('❌ Error generating premium insights:', error);
    
    // Fallback response
    return {
      insights: [
        {
          headline: 'Temporary Service Issue',
          detail: 'The Genie is experiencing technical difficulties. Please try again in a moment.',
          url: undefined,
        }
      ],
      costEstimates: [],
      visaAlternatives: [],
      genieRecommendation: undefined,
      levelUpSuggestions: undefined,
      similarCountries: undefined,
      insiderTips: undefined,
      chartData: undefined,
      timeline: undefined,
      alternativeStrategies: undefined,
      
      // OLD FORMAT FALLBACK
      suggestedCountries: [],
    } as any;
  }
}