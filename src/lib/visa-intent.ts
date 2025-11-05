'use server';
import { ai, geminiFlash } from '@/ai/genkit';
import { z } from 'genkit';
import { createClient } from '@/lib/supabase/server';

// Schema for chat intent extraction
const VisaIntentSchema = z.object({
  destination_country: z.string().describe("The target country for visa application"),
  visa_type: z.enum(['Student', 'Work', 'Tourist', 'Business', 'Family', 'Asylum', 'Other']).describe("Type of visa being sought"),
  timeline: z.string().describe("Expected or desired timeline for visa application"),
  key_concerns: z.array(z.string()).describe("Main concerns or questions about the visa process"),
  certainty_level: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe("How certain the user is about their visa plans"),
});

export type VisaIntent = z.infer<typeof VisaIntentSchema>;

// Function to extract visa intent from chat messages
export async function extractVisaIntent(chatMessages: any[]): Promise<VisaIntent | null> {
  try {
    const recentMessages = chatMessages.slice(-10); // Last 10 messages for context
    
    const prompt = ai.definePrompt({
      name: 'visaIntentExtraction',
      model: geminiFlash,
      input: { schema: z.object({ messages: z.array(z.any()) })},
      output: { schema: VisaIntentSchema },
      prompt: `Analyze these chat messages and extract the user's visa intentions. Be specific about country and visa type.

Chat Context:
{{JSON.stringify(messages)}}

Extract:
1. Destination Country: Which country are they targeting?
2. Visa Type: Student, Work, Tourist, Business, Family, Asylum, or Other?
3. Timeline: When do they want to go? (estimate if not specified)
4. Key Concerns: What are their main worries or questions?
5. Certainty: How sure are they about their plans?

Return NULL if no clear visa intent can be determined.`,
    });

    const { output } = await prompt({ messages: recentMessages });
    return output;
  } catch (error) {
    console.error('Error extracting visa intent:', error);
    return null;
  }
}

// Function to auto-configure user profile and progress based on extracted intent
export async function configureUserFromIntent(userId: string, intent: VisaIntent) {
  const supabase = await createClient();
  
  try {
    // Update user profile with extracted intent
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        destination_country: intent.destination_country,
        visa_type: intent.visa_type,
        timeline: intent.timeline,
        concerns: intent.key_concerns,
        certainty_level: intent.certainty_level,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error updating user profile:', profileError);
      return;
    }

    // Initialize visa progress tracking
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        visa_type: intent.visa_type,
        target_country: intent.destination_country,
        progress_percentage: 0,
        completed_documents: [],
        missing_documents: await getRequiredDocuments(intent.destination_country, intent.visa_type),
        current_milestone: 'Profile Setup',
        last_updated: new Date().toISOString(),
      });

    if (progressError) {
      console.error('Error initializing progress:', progressError);
    }

    // Log the auto-configuration event
    await supabase
      .from('user_journey_events')
      .insert({
        user_id: userId,
        event_type: 'auto_configured',
        event_category: 'setup',
        event_data: {
          source: 'chat_intent',
          destination_country: intent.destination_country,
          visa_type: intent.visa_type,
          timeline: intent.timeline,
        },
      });

    console.log(`✅ Auto-configured user ${userId} for ${intent.visa_type} visa to ${intent.destination_country}`);
    
  } catch (error) {
    console.error('Error configuring user from intent:', error);
  }
}

// Helper function to get required documents for a visa type
async function getRequiredDocuments(country: string, visaType: string): Promise<string[]> {
  const supabase = await createClient();
  
  try {
    const { data: requirements } = await supabase
      .from('visa_requirements')
      .select('required_documents')
      .eq('country', country)
      .eq('visa_type', visaType)
      .single();

    if (requirements?.required_documents) {
      return requirements.required_documents
        .filter((doc: any) => doc.mandatory)
        .map((doc: any) => doc.document);
    }
  } catch (error) {
    console.error('Error fetching required documents:', error);
  }

  // Fallback to common documents
  const commonDocs: any = {
    student: ['Passport', 'Letter of Acceptance', 'Proof of Funds', 'Language Test'],
    work: ['Passport', 'Job Offer Letter', 'Qualifications', 'Work Experience'],
    tourist: ['Passport', 'Bank Statements', 'Travel Itinerary', 'Employment Letter'],
    business: ['Passport', 'Business Invitation', 'Company Documents', 'Financial Proof'],
    family: ['Passport', 'Relationship Proof', 'Sponsor Documents', 'Accommodation Proof'],
    asylum: ['Passport', 'Personal Statement', 'Evidence of Persecution'],
  };

  return commonDocs[visaType.toLowerCase()] || ['Passport', 'Financial Documents'];
}