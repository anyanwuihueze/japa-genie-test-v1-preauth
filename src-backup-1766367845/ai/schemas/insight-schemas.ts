/**
 * @fileOverview Premium Japa Genie Insights Schemas
 * 
 * Enhanced with:
 * - Genie's personalized recommendation
 * - Level-up suggestions (skills/qualifications)
 * - Similar countries comparison
 * - Hidden gem visa routes
 * - Insider tips
 */

import { z } from 'genkit';

// ============================================================================
// INPUT SCHEMA
// ============================================================================

export const InsightInputSchema = z.object({
  question: z.string().describe("The user's question about their visa or travel plans."),
  
  // NEW: KYC data for personalization
  userProfile: z.object({
    age: z.number().optional().describe("User's age"),
    profession: z.string().optional().describe("User's profession"),
    country: z.string().optional().describe("User's origin country"),
    destinationCountry: z.string().optional().describe("User's destination country"),
    visaType: z.string().optional().describe("User's target visa type"),
  }).optional().describe("User's KYC profile data for personalized insights"),
});

export type InsightInput = z.infer<typeof InsightInputSchema>;

// ============================================================================
// OUTPUT SCHEMA (PREMIUM)
// ============================================================================

export const InsightOutputSchema = z.object({
  
  // ✨ GENIE'S MAIN RECOMMENDATION
  genieRecommendation: z.object({
    path: z.string().describe("The recommended visa/immigration path (e.g., 'Canada Express Entry')"),
    confidence: z.number().min(0).max(100).describe("Genie's confidence percentage (0-100)"),
    reasoning: z.string().describe("Personalized explanation referencing user's profile"),
    magicPhrase: z.string().describe("A short encouraging phrase (e.g., '✨ Your best path revealed!')"),
  }).optional().describe("The Genie's primary recommendation based on the user's profile"),

  // 📚 KEY INSIGHTS (EXISTING - Keep as is)
  insights: z.array(z.object({
    headline: z.string().describe("The key insight or topic header"),
    detail: z.string().describe("A detailed explanation or data point"),
    url: z.string().optional().describe("An optional official URL (government/university)"),
  })).describe("3-5 key insights related to the user's question"),

  // 💰 COST ESTIMATES (ENHANCED)
  costEstimates: z.array(z.object({
    item: z.string().describe("The cost item (e.g., 'Visa Application Fee')"),
    cost: z.number().describe("The estimated cost as a number"),
    currency: z.string().describe("Currency code (USD, CAD, EUR, etc.)"),
    nairaEquivalent: z.number().optional().describe("Cost in Nigerian Naira (if user is Nigerian)"),
    breakdown: z.string().optional().describe("Cost breakdown percentages"),
  })).describe("Key cost estimates with Naira conversion for Nigerian users"),

  // 🔄 VISA ALTERNATIVES (ENHANCED - Hidden Gems!)
  visaAlternatives: z.array(z.object({
    visaName: z.string().describe("The name of the alternative visa"),
    description: z.string().describe("A brief description of this visa option"),
    hiddenGem: z.boolean().describe("True if this is a lesser-known but advantageous route"),
    estimatedApprovalRate: z.number().optional().describe("Estimated approval rate (0-100)"),
    betterThan: z.array(z.string()).optional().describe("List of visa types this option outperforms"),
  })).describe("2-4 alternative visa options, including hidden opportunities"),

  // 🎓 LEVEL UP SUGGESTIONS (NEW!)
  levelUpSuggestions: z.array(z.object({
    skill: z.string().describe("The skill/qualification to acquire (e.g., 'IELTS 7.5', 'French B2')"),
    impact: z.string().describe("How this improves chances (e.g., 'Increases approval by 40%')"),
    timeRequired: z.string().describe("Estimated time to acquire (e.g., '3 months', '1 year')"),
    urgency: z.enum(['critical', 'helpful', 'optional']).describe("Priority level for this skill"),
  })).optional().describe("Recommended skills/qualifications to improve visa chances"),

  // 🌍 SIMILAR COUNTRIES (NEW!)
  similarCountries: z.array(z.object({
    country: z.string().describe("Alternative country name"),
    comparedTo: z.string().describe("The country it's being compared to"),
    whyBetter: z.string().describe("Specific advantages (e.g., 'Higher approval, lower cost')"),
    estimatedProcessingTime: z.number().optional().describe("Processing time in months"),
  })).optional().describe("Countries with better odds or similar opportunities"),

  // 💡 INSIDER TIPS (NEW!)
  insiderTips: z.array(z.object({
    category: z.enum(['document', 'timing', 'interview', 'financial', 'general']).describe("Tip category"),
    tip: z.string().describe("The insider knowledge or pattern to know"),
    source: z.string().optional().describe("Source of the insight (e.g., 'Based on Lagos consulate data')"),
  })).optional().describe("Insider knowledge and patterns most people miss"),

  // 📊 CHART DATA (EXISTING - Keep as is)
  chartData: z.object({
    title: z.string().describe("Chart title"),
    data: z.array(z.object({
      name: z.string().describe("Data point name (country, category, etc.)"),
      value: z.number().describe("Numeric value for the data point"),
    })).describe("Array of data points for bar chart"),
  }).optional().describe("Data for generating comparison charts"),

  // 📅 TIMELINE (ENHANCED)
  timeline: z.array(z.object({
    step: z.string().describe("The step name (e.g., 'Document Preparation')"),
    durationWeeks: z.number().describe("Estimated duration in weeks"),
    criticalNotes: z.string().optional().describe("Important notes about this step"),
  })).optional().describe("Step-by-step timeline for the visa process"),

  // 🎯 ALTERNATIVE STRATEGIES (EXISTING - Keep)
  alternativeStrategies: z.array(z.string()).optional().describe("Alternative approaches or strategies"),
});

export type InsightOutput = z.infer<typeof InsightOutputSchema>;