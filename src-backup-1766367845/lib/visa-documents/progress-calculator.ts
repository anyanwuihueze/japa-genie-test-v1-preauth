// src/lib/visa-documents/progress-calculator.ts
import { getVisaSpecificRequirements } from './requirements';

export interface DocumentProgress {
  progress: number;
  completed: number;
  total: number;
  requirements: Array<{
    id: string;
    name: string;
    critical: boolean;
  }>;
  missing: Array<{
    id: string;
    name: string;
    critical: boolean;
  }>;
  description: string;
}

export const calculateDocumentProgress = (
  userProfile: any, 
  uploadedDocuments: any[]
): DocumentProgress => {
  if (!userProfile?.visa_type || !userProfile?.destination_country) {
    return {
      progress: 0,
      completed: 0,
      total: 0,
      requirements: [],
      missing: [],
      description: 'Complete your profile to see document requirements'
    };
  }

  const requirements = getVisaSpecificRequirements(
    userProfile.visa_type,
    userProfile.destination_country
  );

  // Calculate completed critical documents
  const completedCritical = requirements.required.filter(req => 
    req.critical && uploadedDocuments.some(doc => 
      doc.type === req.id && (doc.status === 'completed' || doc.status === 'verified')
    )
  ).length;

  const progress = requirements.totalRequired > 0 
    ? (completedCritical / requirements.totalRequired) * 100 
    : 0;

  const missingDocuments = requirements.required.filter(req => 
    req.critical && !uploadedDocuments.some(doc => 
      doc.type === req.id && (doc.status === 'completed' || doc.status === 'verified')
    )
  );

  return {
    progress: Math.round(progress),
    completed: completedCritical,
    total: requirements.totalRequired,
    requirements: requirements.required,
    missing: missingDocuments,
    description: requirements.description
  };
};