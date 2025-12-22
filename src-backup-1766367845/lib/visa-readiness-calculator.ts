// Visa Readiness Assessment Algorithm
// Based on aggregated data from visa forums and embassy requirements

export interface UserProfile {
  hasValidPassport: boolean;
  allFormsCompleted: boolean;
  photosMeetRequirements: boolean;
  employmentHistoryConsistent: boolean;
  bankBalanceAdequate: boolean;
  fundsInOwnName: boolean;
  savingsDurationMonths: number;
  noLargeRecentDeposits: boolean;
  languageTestScore?: number;
  canUnderstandBasicInstructions: boolean;
  hasLanguageCertification: boolean;
  hasPreviousVisas: boolean;
  neverOverstayed: boolean;
  returnedHomeAfterTrips: boolean;
  internationalTravelCount: number;
  educationVerified: boolean;
  workExperienceMatchesJob: boolean;
  skillsInDemand: boolean;
  employmentGapsExplained: boolean;
  knowsCommonQuestions: boolean;
  practicedMockInterview: boolean;
  clearPurposeStatement: boolean;
  dependentsInHomeCountry: boolean;
  propertyOwnership: boolean;
  familyObligations: boolean;
}

export interface RiskScoreResult {
  totalScore: number;
  readinessLevel: 'Excellent' | 'Good' | 'Needs Improvement';
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
    weight: number;
    feedback: string[];
  }[];
  topWeaknesses: string[];
}

const ASSESSMENT_FACTORS = {
  DOCUMENT_COMPLETENESS: { weight: 20, maxScore: 100 },
  PROOF_OF_FUNDS: { weight: 25, maxScore: 100 },
  LANGUAGE_PROFICIENCY: { weight: 15, maxScore: 100 },
  TRAVEL_HISTORY: { weight: 10, maxScore: 100 },
  EDUCATION_BACKGROUND: { weight: 10, maxScore: 100 },
  INTERVIEW_READINESS: { weight: 15, maxScore: 100 },
  FAMILY_TIES: { weight: 5, maxScore: 100 }
} as const;

export function calculateVisaReadiness(profile: UserProfile): RiskScoreResult {
  const breakdown = Object.entries(ASSESSMENT_FACTORS).map(([category, config]) => {
    let rawScore = 0;
    const feedback: string[] = [];

    switch (category) {
      case 'DOCUMENT_COMPLETENESS':
        if (!profile.hasValidPassport) {
          feedback.push("Ensure passport is valid for 6+ months beyond travel dates");
          rawScore += 25;
        }
        if (!profile.allFormsCompleted) {
          feedback.push("Complete all application forms with accurate information");
          rawScore += 30;
        }
        if (!profile.photosMeetRequirements) {
          feedback.push("Submit photos meeting embassy specifications");
          rawScore += 20;
        }
        if (!profile.employmentHistoryConsistent) {
          feedback.push("Document any employment gaps with supporting evidence");
          rawScore += 25;
        }
        break;

      case 'PROOF_OF_FUNDS':
        if (!profile.bankBalanceAdequate) {
          feedback.push("Build savings to meet minimum financial requirements");
          rawScore += 40;
        }
        if (!profile.fundsInOwnName) {
          feedback.push("Transfer funds to your name or get affidavit of support");
          rawScore += 30;
        }
        if (profile.savingsDurationMonths < 6) {
          feedback.push("Maintain consistent bank balance for 6+ months");
          rawScore += 20;
        }
        if (!profile.noLargeRecentDeposits) {
          feedback.push("Explain source of any large recent deposits");
          rawScore += 10;
        }
        break;

      case 'LANGUAGE_PROFICIENCY':
        if (!profile.hasLanguageCertification && !profile.languageTestScore) {
          feedback.push("Consider obtaining language certification for your destination");
          rawScore += 50;
        } else if (profile.languageTestScore && profile.languageTestScore < 3) {
          feedback.push("Improve language skills to intermediate level or higher");
          rawScore += 30;
        }
        if (!profile.canUnderstandBasicInstructions) {
          feedback.push("Practice basic communication in destination language");
          rawScore += 20;
        }
        break;

      case 'TRAVEL_HISTORY':
        if (!profile.hasPreviousVisas) {
          feedback.push("Consider visiting neighboring countries to build travel history");
          rawScore += 20;
        }
        if (!profile.neverOverstayed) {
          feedback.push("Previous overstays significantly impact new applications");
          rawScore += 50;
        }
        if (!profile.returnedHomeAfterTrips) {
          feedback.push("Establish pattern of returning home after international travel");
          rawScore += 20;
        }
        if (profile.internationalTravelCount === 0) {
          feedback.push("Start with short trips to build credible travel record");
          rawScore += 10;
        }
        break;

      case 'EDUCATION_BACKGROUND':
        if (!profile.educationVerified) {
          feedback.push("Get educational credentials officially verified");
          rawScore += 30;
        }
        if (!profile.workExperienceMatchesJob) {
          feedback.push("Align work experience with intended visa category");
          rawScore += 30;
        }
        if (!profile.skillsInDemand) {
          feedback.push("Develop skills matching destination country's labor needs");
          rawScore += 20;
        }
        if (!profile.employmentGapsExplained) {
          feedback.push("Prepare documentation explaining employment gaps");
          rawScore += 20;
        }
        break;

      case 'INTERVIEW_READINESS':
        if (!profile.knowsCommonQuestions) {
          feedback.push("Research and prepare for common visa interview questions");
          rawScore += 30;
        }
        if (!profile.practicedMockInterview) {
          feedback.push("Practice mock interviews to build confidence");
          rawScore += 25;
        }
        if (!profile.clearPurposeStatement) {
          feedback.push("Develop clear, consistent explanation of your travel purpose");
          rawScore += 25;
        }
        break;

      case 'FAMILY_TIES':
        if (!profile.dependentsInHomeCountry) {
          feedback.push("Document family obligations in home country");
          rawScore += 30;
        }
        if (!profile.propertyOwnership) {
          feedback.push("Property ownership demonstrates home country ties");
          rawScore += 35;
        }
        if (!profile.familyObligations) {
          feedback.push("Highlight family responsibilities requiring your return");
          rawScore += 35;
        }
        break;
    }

    const successScore = Math.max(0, config.maxScore - rawScore);
    
    return {
      category: category.replace(/_/g, ' '),
      score: successScore,
      maxScore: config.maxScore,
      weight: config.weight,
      feedback
    };
  });

  const totalWeightedScore = breakdown.reduce((sum, item) => {
    return sum + ((item.score / item.maxScore) * item.weight);
  }, 0);

  let readinessLevel: 'Excellent' | 'Good' | 'Needs Improvement';
  if (totalWeightedScore >= 80) {
    readinessLevel = 'Excellent';
  } else if (totalWeightedScore >= 60) {
    readinessLevel = 'Good';
  } else {
    readinessLevel = 'Needs Improvement';
  }

  const topWeaknesses = [...breakdown]
    .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))
    .filter(item => item.feedback.length > 0)
    .slice(0, 3)
    .flatMap(item => item.feedback);

  return {
    totalScore: Math.round(totalWeightedScore),
    readinessLevel,
    breakdown,
    topWeaknesses
  };
}
