// src/lib/visa-documents/requirements.ts
export const visaDocumentRequirements = {
    // CANADA VISAS
    'student-canada': {
      required: [
        { id: 'passport', name: 'Valid Passport (6+ months validity)', critical: true },
        { id: 'acceptance_letter', name: 'Letter of Acceptance from DLI', critical: true },
        { id: 'financial_proof', name: 'Proof of Financial Support (GIC + Tuition)', critical: true },
        { id: 'english_test', name: 'English Test Results (IELTS 6.0+)', critical: true },
        { id: 'educational_docs', name: 'Educational Transcripts & Certificates', critical: true },
        { id: 'purpose_statement', name: 'Statement of Purpose', critical: false },
        { id: 'medical', name: 'Medical Examination', critical: false }
      ],
      totalRequired: 5,
      description: 'Canadian Study Permit Requirements'
    },
    
    'work-canada': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'job_offer', name: 'LMIA-approved Job Offer', critical: true },
        { id: 'resume', name: 'Detailed Professional Resume', critical: true },
        { id: 'educational_docs', name: 'Educational Credentials Assessment', critical: true },
        { id: 'financial_proof', name: 'Proof of Settlement Funds', critical: true },
        { id: 'work_experience', name: 'Work Experience Letters', critical: true },
        { id: 'language_test', name: 'English/French Test Results', critical: false }
      ],
      totalRequired: 5,
      description: 'Canadian Work Permit Requirements'
    },
  
    'tourist-canada': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'financial_proof', name: 'Proof of Financial Support', critical: true },
        { id: 'travel_itinerary', name: 'Travel Itinerary & Return Ticket', critical: true },
        { id: 'accommodation', name: 'Hotel Bookings or Invitation Letter', critical: true },
        { id: 'employment_letter', name: 'Employment Verification Letter', critical: false },
        { id: 'family_ties', name: 'Proof of Family Ties to Home Country', critical: false }
      ],
      totalRequired: 4,
      description: 'Canadian Visitor Visa Requirements'
    },
  
    // USA VISAS
    'student-usa': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'i20_form', name: 'Form I-20 from SEVP School', critical: true },
        { id: 'financial_proof', name: 'Financial Support Documents', critical: true },
        { id: 'english_test', name: 'English Proficiency Proof', critical: true },
        { id: 'educational_docs', name: 'Academic Transcripts & Diplomas', critical: true },
        { id: 'visa_application', name: 'DS-160 Confirmation Page', critical: true }
      ],
      totalRequired: 5,
      description: 'US F-1 Student Visa Requirements'
    },
  
    'work-usa': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'petition', name: 'Approved I-129 Petition', critical: true },
        { id: 'resume', name: 'Professional Resume/CV', critical: true },
        { id: 'educational_docs', name: 'Degree Certificates & Transcripts', critical: true },
        { id: 'employment_letter', name: 'Employment Offer Letter', critical: true },
        { id: 'visa_application', name: 'DS-160 Application', critical: true }
      ],
      totalRequired: 5,
      description: 'US H-1B Work Visa Requirements'
    },
  
    // UK VISAS
    'student-uk': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'cas_letter', name: 'CAS (Confirmation of Acceptance)', critical: true },
        { id: 'financial_proof', name: 'Financial Evidence (28-day rule)', critical: true },
        { id: 'english_test', name: 'English Language Test (IELTS/SELT)', critical: true },
        { id: 'academic_docs', name: 'Academic Qualifications', critical: true },
        { id: 'tb_test', name: 'TB Test Certificate', critical: false }
      ],
      totalRequired: 5,
      description: 'UK Student Visa (Tier 4) Requirements'
    },
  
    'work-uk': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'cos_letter', name: 'Certificate of Sponsorship', critical: true },
        { id: 'financial_proof', name: 'Personal Savings Evidence', critical: true },
        { id: 'english_test', name: 'English Language Proof', critical: true },
        { id: 'resume', name: 'Professional Resume/CV', critical: true },
        { id: 'educational_docs', name: 'Degree Certificates', critical: true }
      ],
      totalRequired: 5,
      description: 'UK Skilled Worker Visa Requirements'
    },
  
    // AUSTRALIA VISAS
    'student-australia': {
      required: [
        { id: 'passport', name: 'Valid Passport', critical: true },
        { id: 'coe_letter', name: 'Confirmation of Enrolment (CoE)', critical: true },
        { id: 'financial_proof', name: 'Financial Capacity Evidence', critical: true },
        { id: 'english_test', name: 'English Test Results (IELTS)', critical: true },
        { id: 'educational_docs', name: 'Academic Transcripts', critical: true },
        { id: 'health_insurance', name: 'Overseas Student Health Cover', critical: true }
      ],
      totalRequired: 5,
      description: 'Australian Student Visa (Subclass 500) Requirements'
    }
  };
  
  // Fallback for unknown visa types
  export const getFallbackRequirements = () => ({
    required: [
      { id: 'passport', name: 'Valid Passport', critical: true },
      { id: 'financial_proof', name: 'Proof of Financial Support', critical: true },
      { id: 'purpose_document', name: 'Purpose of Travel Document', critical: true },
      { id: 'accommodation', name: 'Accommodation Proof', critical: false },
      { id: 'employment_letter', name: 'Employment Verification', critical: false }
    ],
    totalRequired: 3,
    description: 'General Visa Requirements'
  });
  
  export const getVisaSpecificRequirements = (visaType: string, destination: string) => {
    const visaKey = `${visaType}-${destination}`.toLowerCase().replace(/\s+/g, '');
    return visaDocumentRequirements[visaKey] || getFallbackRequirements();
  };