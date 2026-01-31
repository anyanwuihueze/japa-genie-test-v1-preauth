interface UserProfile {
  country?: string;
  destination_country?: string;
  visa_type?: string;
}

interface ProgressResult {
  progressPercentage: number;
  nextMilestone: string;
  currentStage: string;
  daysToDeadline: number;
  moneySaved: number;
  aheadOfPercentage: number;
  successProbability: number;
  estimatedTimeline: string;
  kycComplete: boolean;
  documentProgress: number;
  chatProgress: number;
}

export function calculateProgress(
  profile: UserProfile | undefined | null,
  messageCount: number,
  documentCount: number
): ProgressResult {
  let progressPercentage = 0;
  let nextMilestone = "Complete Your Profile";
  let currentStage = "Onboarding";
  let kycComplete = false;

  // Phase 1: KYC (30%)
  if (profile?.country && profile?.destination_country && profile?.visa_type) {
    progressPercentage += 30;
    nextMilestone = "Upload Documents";
    currentStage = "Document Preparation";
    kycComplete = true;
  }

  // Phase 2: Chat (20%)
  if (messageCount > 0) {
    const messageProgress = Math.min((messageCount / 20) * 20, 20);
    progressPercentage += messageProgress;
  }

  // Phase 3: Documents (30%)
  if (documentCount > 0) {
    const docProgress = Math.min((documentCount / 8) * 30, 30);
    progressPercentage += docProgress;
    if (progressPercentage >= 60) {
      nextMilestone = "Schedule Mock Interview";
      currentStage = "Interview Preparation";
    }
  }

  // Phase 4: Advanced (20%)
  if (progressPercentage >= 70) {
    progressPercentage += 10;
    nextMilestone = "Final Review & Submission";
    currentStage = "Application Submission";
  }

  progressPercentage = Math.min(progressPercentage, 100);

  const daysToDeadline = Math.max(30 - Math.floor(progressPercentage / 3), 7);
  const moneySaved = Math.round(progressPercentage * 24000);
  const aheadOfPercentage = Math.floor(progressPercentage * 0.8);
  const successProbability = Math.min(65 + Math.floor(progressPercentage / 2), 95);
  const estimatedTimeline = progressPercentage > 50 ? "4-5 months" : "6-8 months";
  const documentProgress = Math.min((documentCount / 8) * 100, 100);
  const chatProgress = Math.min((messageCount / 20) * 100, 100);

  return {
    progressPercentage: Math.round(progressPercentage),
    nextMilestone,
    currentStage,
    daysToDeadline,
    moneySaved,
    aheadOfPercentage,
    successProbability,
    estimatedTimeline,
    kycComplete,
    documentProgress: Math.round(documentProgress),
    chatProgress: Math.round(chatProgress)
  };
}

export function calculateDocumentProgress(documentCount: number): number {
  return Math.min((documentCount / 8) * 100, 100);
}

export function calculateChatProgress(messageCount: number): number {
  return Math.min((messageCount / 20) * 100, 100);
}

export function calculatePofProgress(seasons: any[]): number {
  if (!seasons.length) return 0;
  const totalSeasons = seasons.length;
  const completedSeasons = seasons.filter((s: any) => s.status === 'completed').length;
  return Math.round((completedSeasons / totalSeasons) * 100);
}

export function calculateConfidenceScore(
  profileComplete: boolean,
  documentProgress: number,
  chatProgress: number,
  pofProgress: number
): {
  overall: number;
  profile: number;
  documents: number;
  aiGuidance: number;
  journeyProgress: number;
  expertSupport: number;
} {
  return {
    overall: Math.round((profileComplete ? 85 : 0 + documentProgress + chatProgress + pofProgress) / 4),
    profile: profileComplete ? 85 : 0,
    documents: Math.round(documentProgress),
    aiGuidance: Math.round(chatProgress),
    journeyProgress: Math.round(pofProgress),
    expertSupport: 0
  };
}
