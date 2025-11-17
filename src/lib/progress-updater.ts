// src/lib/progress-updater.ts
import { createClient } from '@/lib/supabase/server';

export interface MilestoneUpdate {
  field: string;
  value: boolean;
  message: string;
  confidence: number;
}

export async function detectMilestoneFromMessage(
  message: string, 
  userId: string
): Promise<MilestoneUpdate | null> {
  const lowerMessage = message.toLowerCase();
  
  let update: MilestoneUpdate | null = null;

  if (containsDocumentKeywords(lowerMessage)) {
    const confidence = calculateDocumentConfidence(lowerMessage);
    if (confidence > 0.7) {
      update = {
        field: 'documents_uploaded',
        value: true,
        message: 'Detected document upload from chat message',
        confidence
      };
    }
  }

  if (containsFinancialKeywords(lowerMessage)) {
    const confidence = calculateFinancialConfidence(lowerMessage);
    if (confidence > 0.7) {
      update = {
        field: 'financial_ready', 
        value: true,
        message: 'Detected financial proof completion',
        confidence
      };
    }
  }

  if (containsInterviewKeywords(lowerMessage)) {
    const confidence = calculateInterviewConfidence(lowerMessage);
    if (confidence > 0.75) {
      update = {
        field: 'interview_prep_done',
        value: true, 
        message: 'Detected interview preparation',
        confidence
      };
    }
  }

  if (containsSubmissionKeywords(lowerMessage)) {
    const confidence = calculateSubmissionConfidence(lowerMessage);
    if (confidence > 0.8) {
      update = {
        field: 'application_submitted',
        value: true,
        message: 'Detected application submission',
        confidence
      };
    }
  }

  if (update) {
    try {
      await updateUserProgress(userId, { [update.field]: update.value });
      return update;
    } catch (error) {
      console.error('❌ Failed to update milestone:', error);
      return null;
    }
  }

  return null;
}

export async function updateUserProgress(userId: string, updates: any) {
  try {
    const supabase = await createClient();
    
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (!currentProgress) {
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          ...updates,
          overall_progress: calculateProgress({ ...updates }),
          current_stage: determineCurrentStage({ ...updates })
        });
      
      if (insertError) throw insertError;
      console.log('✅ Created initial progress for user:', userId);
      return;
    }

    const newProgress = { ...currentProgress, ...updates };
    const overallProgress = calculateProgress(newProgress);
    const currentStage = determineCurrentStage(newProgress);

    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        ...updates,
        overall_progress: overallProgress,
        current_stage: currentStage,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    console.log('✅ Progress updated:', { userId, updates, overallProgress, currentStage });

  } catch (error) {
    console.error('❌ Error updating user progress:', error);
    throw error;
  }
}

function calculateProgress(progress: any): number {
  const milestones = [
    progress.profile_completed,
    progress.documents_uploaded, 
    progress.documents_verified,
    progress.financial_ready,
    progress.interview_prep_done,
    progress.application_submitted,
    progress.decision_received
  ];

  const completed = milestones.filter(Boolean).length;
  return Math.round((completed / 7) * 100);
}

function determineCurrentStage(progress: any): string {
  const completed = [
    progress.profile_completed,
    progress.documents_uploaded,
    progress.documents_verified, 
    progress.financial_ready,
    progress.interview_prep_done,
    progress.application_submitted,
    progress.decision_received
  ].filter(Boolean).length;

  if (completed === 0) return 'Getting Started';
  if (completed <= 2) return 'Building Profile';
  if (completed <= 4) return 'Preparing Documents';
  if (completed <= 5) return 'Ready to Apply';
  if (completed === 6) return 'Application Submitted';
  return 'Completed';
}

function calculateDocumentConfidence(message: string): number {
  let score = 0;
  
  if (/\b(uploaded|submitted|attached|sent|provided)\b/i.test(message)) score += 0.5;
  if (/\b(passport|certificate|degree|diploma|transcript|bank statement)\b/i.test(message)) score += 0.3;
  if (/\b(done|completed|finished|ready|prepared)\b/i.test(message)) score += 0.2;
  if (/\b(how|what|where|when|should i|do i need)\b/i.test(message)) score -= 0.3;
  
  return Math.max(0, Math.min(1, score));
}

function calculateFinancialConfidence(message: string): number {
  let score = 0;
  
  if (/\b(prepared|ready|have|got|completed)\b.*\b(bank statement|financial|funds|proof)\b/i.test(message)) score += 0.6;
  if (/\b(bank statement|financial proof|sponsor letter)\b/i.test(message)) score += 0.3;
  if (/\b(\$|₦|£|€|CAD|USD|NGN)\s*\d+/i.test(message)) score += 0.2;
  if (/\b(how much|need|required|should i)\b/i.test(message)) score -= 0.4;
  
  return Math.max(0, Math.min(1, score));
}

function calculateInterviewConfidence(message: string): number {
  let score = 0;
  
  if (/\b(completed|finished|done|attended)\b.*\b(interview|mock|practice)\b/i.test(message)) score += 0.7;
  if (/\b(practiced|rehearsed|prepared)\b/i.test(message)) score += 0.3;
  if (/\b(how|what|tips|advice|help)\b/i.test(message)) score -= 0.4;
  
  return Math.max(0, Math.min(1, score));
}

function calculateSubmissionConfidence(message: string): number {
  let score = 0;
  
  if (/\b(submitted|applied|sent|lodged|filed)\b.*\b(application|visa)\b/i.test(message)) score += 0.8;
  if (/\b(application|visa)\b.*\b(submitted|sent|done)\b/i.test(message)) score += 0.8;
  if (/\b(waiting|pending|processing)\b/i.test(message)) score += 0.3;
  if (/\b(should i|when|how|ready to)\b/i.test(message)) score -= 0.5;
  
  return Math.max(0, Math.min(1, score));
}

function containsDocumentKeywords(message: string): boolean {
  return /\b(upload|submit|attach|provide|send|share|document|passport|certificate|degree|resume|cv|bank statement|transcript)\b/i.test(message);
}

function containsFinancialKeywords(message: string): boolean {
  return /\b(bank statement|financial|funds|money|savings|balance|sponsor|affidavit|support|proof|income|salary)\b/i.test(message);
}

function containsInterviewKeywords(message: string): boolean {
  return /\b(interview|mock|practice|prepared|ready|rehearse|simulation|questions)\b/i.test(message);
}

function containsSubmissionKeywords(message: string): boolean {
  return /\b(submitted|applied|sent|lodged|filed|completed|done|application)\b/i.test(message);
}

export function getTimelineGuidance(progressContext: any): string | null {
  if (!progressContext.daysUntilDeadline || progressContext.daysUntilDeadline > 30) {
    return null;
  }

  const { daysUntilDeadline, completedMilestones } = progressContext;

  if (daysUntilDeadline < 7 && !completedMilestones.applicationSubmitted) {
    return `🚨 TIMELINE CRITICAL: User has ONLY ${daysUntilDeadline} DAYS until deadline! Application not submitted - this requires immediate action.`;
  }

  if (daysUntilDeadline < 14 && !completedMilestones.financialReady) {
    return `⚠️ TIMELINE URGENT: ${daysUntilDeadline} DAYS until deadline! Financial proof not ready - prioritize immediately.`;
  }

  if (daysUntilDeadline < 21 && !completedMilestones.documentsUploaded) {
    return `📅 TIMELINE PRIORITY: ${daysUntilDeadline} DAYS until deadline! Upload all documents this week.`;
  }

  return `📋 TIMELINE AWARE: ${daysUntilDeadline} DAYS until deadline - maintain steady progress.`;
}
