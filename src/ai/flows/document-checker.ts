'use server';
import { ai, geminiFlash } from '@/ai/genkit';
import { z } from 'genkit';
import { createClient } from '@/lib/supabase/server';
import { VisaRequirementsService } from '@/lib/visa/requirements';

// Define schemas FIRST
const DocumentCheckerInputSchema = z.object({
  documentDataUri: z.string(),
  targetCountry: z.string().optional(),
  visaType: z.string().optional(),
  userId: z.string().optional(),
});

const DocumentCheckerOutputSchema = z.object({
  documentType: z.string(),
  isVisaRelated: z.boolean(),
  overallRiskScore: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  summary: z.string(),
  strengths: z.array(z.string()),
  criticalIssues: z.array(z.object({
    issue: z.string(),
    impact: z.string(),
    recommendation: z.string(),
  })),
  warnings: z.array(z.object({
    issue: z.string(),
    impact: z.string(),
    recommendation: z.string(),
  })),
  missingInformation: z.array(z.string()),
  qualityIssues: z.array(z.string()),
  complianceChecks: z.object({
    validityPeriod: z.string(),
    formatCompliance: z.string(),
    signatures: z.string(),
    dates: z.string(),
  }),
  actionItems: z.array(z.object({
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    action: z.string(),
    reason: z.string(),
  })),
  countrySpecificNotes: z.string().optional(),
  detailedReport: z.string(),
  // NEW: Visa-specific fields
  visaRelevance: z.object({
    isRequiredForVisa: z.boolean(),
    requiredStage: z.string().optional(),
    importance: z.enum(['CRITICAL', 'IMPORTANT', 'SUPPORTING', 'OPTIONAL']),
    specificRequirements: z.array(z.string()),
  }),
  progressImpact: z.object({
    milestoneProgress: z.number(),
    nextRecommendedActions: z.array(z.string()),
    estimatedTimelineImpact: z.string(),
  }),
});

// Export types
export type DocumentCheckerInput = z.infer<typeof DocumentCheckerInputSchema>;
export type DocumentCheckerOutput = z.infer<typeof DocumentCheckerOutputSchema>;

// Enhanced document checker function
export async function documentChecker(input: DocumentCheckerInput): Promise<DocumentCheckerOutput> {
  const requirementsService = new VisaRequirementsService();
  
  let visaRequirements = null;
  if (input.targetCountry && input.visaType) {
    visaRequirements = await requirementsService.getRequirements(input.targetCountry, input.visaType);
  }

  return documentCheckerFlow({ 
    ...input, 
    visaRequirements,
    targetCountry: input.targetCountry || 'General',
    visaType: input.visaType || 'Tourist'
  });
}

// Define prompt with CORRECT schema
const documentCheckerPrompt = ai.definePrompt({
  name: 'documentCheckerPrompt',
  model: geminiFlash,
  input: { 
    schema: z.object({
      documentDataUri: z.string(),
      targetCountry: z.string(),
      visaType: z.string(),
      visaRequirements: z.any().optional(),
    })
  },
  output: { 
    schema: DocumentCheckerOutputSchema.omit({ 
      visaRelevance: true, 
      progressImpact: true 
    }) 
  },
  prompt: `You are an expert visa document reviewer with 15+ years of experience.

TARGET COUNTRY: {{targetCountry}}
VISA TYPE: {{visaType}}

{{#if visaRequirements}}
VISA-SPECIFIC REQUIREMENTS FOR {{visaType}} VISA TO {{targetCountry}}:
Required Documents: {{JSON.stringify(visaRequirements.required_documents)}}
{{/if}}

YOUR ENHANCED TASK:
1. Analyze this document thoroughly
2. Determine if it matches ANY required document for this visa type
3. Check if it meets specific country/visa requirements
4. Assess progress impact for the user's visa journey

FOR VISA-RELATED ANALYSIS:
- Is this document REQUIRED for {{visaType}} visa to {{targetCountry}}?
- Which application stage does it belong to?
- How critical is it for approval?
- Does it meet country-specific formatting/validity rules?
- What specific requirements from the visa checklist does it fulfill?

PROGRESS ASSESSMENT:
- If this is a required document, how much does it advance the application?
- What's the estimated timeline impact?
- What should the user do next in their visa journey?

Document to analyze: {{media url=documentDataUri}}`,
});

// Helper functions with proper typing
async function determineVisaRelevance(report: any, targetCountry: string, visaType: string, requirements: any) {
  const requirementsService = new VisaRequirementsService();
  
  if (!targetCountry || !visaType) {
    return {
      isRequiredForVisa: report.isVisaRelated,
      requiredStage: 'unknown',
      importance: 'SUPPORTING' as const,
      specificRequirements: ['Document appears visa-related but no specific visa context provided'],
    };
  }

  // Get requirements if not provided
  const visaReqs = requirements || await requirementsService.getRequirements(targetCountry, visaType);
  const requiredDocs = visaReqs.required_documents || [];

  const isRequired = requiredDocs.some((doc: any) => 
    report.documentType.toLowerCase().includes(doc.document.toLowerCase()) ||
    doc.document.toLowerCase().includes(report.documentType.toLowerCase())
  );

  const matchingDoc = requiredDocs.find((doc: any) => 
    report.documentType.toLowerCase().includes(doc.document.toLowerCase()) ||
    doc.document.toLowerCase().includes(report.documentType.toLowerCase())
  );

  const importance = matchingDoc?.mandatory ? 'CRITICAL' : 
                    isRequired ? 'IMPORTANT' : 'SUPPORTING';

  return {
    isRequiredForVisa: isRequired,
    requiredStage: matchingDoc?.stage || 'application',
    importance: importance as 'CRITICAL' | 'IMPORTANT' | 'SUPPORTING' | 'OPTIONAL',
    specificRequirements: matchingDoc ? [matchingDoc.description] : 
                         isRequired ? ['Document matches general visa requirements'] : 
                         ['Document may be supporting but not explicitly required'],
  };
}

async function calculateProgressImpact(report: any, targetCountry: string, visaType: string, requirements: any) {
  if (!targetCountry || !visaType || !report.isVisaRelated) {
    return {
      milestoneProgress: 0,
      nextRecommendedActions: ['Continue gathering required documents for your visa application'],
      estimatedTimelineImpact: 'Minimal - document not visa-specific',
    };
  }

  const requirementsService = new VisaRequirementsService();
  const visaReqs = requirements || await requirementsService.getRequirements(targetCountry, visaType);
  
  const progress = report.overallRiskScore === 'LOW' ? 100 : 
                   report.overallRiskScore === 'MEDIUM' ? 75 :
                   report.overallRiskScore === 'HIGH' ? 25 : 0;

  const nextActions = [];
  if (report.overallRiskScore === 'LOW') {
    nextActions.push('✅ Document ready for submission');
    nextActions.push('➡️ Proceed to next required document');
  } else {
    nextActions.push(...report.actionItems.map((item: any) => `🔧 Fix: ${item.action}`));
    nextActions.push('📋 Review other required documents');
  }

  // Add visa-specific next steps
  const requiredDocs = visaReqs.required_documents || [];
  const criticalDocs = requiredDocs.filter((doc: any) => doc.mandatory && doc.stage === 'financial');
  if (criticalDocs.length > 0) {
    nextActions.push(`💡 Next critical document: ${criticalDocs[0].document}`);
  }

  return {
    milestoneProgress: progress,
    nextRecommendedActions: nextActions,
    estimatedTimelineImpact: report.overallRiskScore === 'LOW' ? 'On track - no delays expected' : 
                            report.overallRiskScore === 'MEDIUM' ? 'Minor delay - fix issues promptly' :
                            'Significant delay - document needs major revisions',
  };
}

// Fixed flow definition
const documentCheckerFlow = ai.defineFlow(
  {
    name: 'documentCheckerFlow',
    inputSchema: z.object({
      documentDataUri: z.string(),
      targetCountry: z.string(),
      visaType: z.string(),
      visaRequirements: z.any().optional(),
    }),
    outputSchema: DocumentCheckerOutputSchema,
  },
  async (input) => {
    const { output: baseOutput } = await documentCheckerPrompt(input);
    
    if (!baseOutput) {
      throw new Error('AI analysis failed');
    }

    // Enhance output with visa-specific analysis
    const visaRelevance = await determineVisaRelevance(
      baseOutput, 
      input.targetCountry, 
      input.visaType, 
      input.visaRequirements
    );
    
    const progressImpact = await calculateProgressImpact(
      baseOutput, 
      input.targetCountry, 
      input.visaType, 
      input.visaRequirements
    );
    
    const enhancedOutput: DocumentCheckerOutput = {
      ...baseOutput,
      visaRelevance,
      progressImpact,
    };
    
    return enhancedOutput;
  }
);