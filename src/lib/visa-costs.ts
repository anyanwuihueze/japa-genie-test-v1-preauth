/**
 * Official visa costs database
 * Sources: Official embassy websites (last verified: 2025-01-25)
 * Update quarterly or when fees change
 */

export interface VisaCost {
  name: string;
  usdAmount: number;
  officialSource: string;
  notes?: string;
}

export const VISA_COSTS = {
  // CANADA
  canada: {
    studyPermit: {
      name: 'Study Permit',
      usdAmount: 150,
      officialSource: 'IRCC',
      notes: 'CAD $150 = ~$110 USD at current rates',
    },
    visitorVisa: {
      name: 'Visitor Visa (TRV)',
      usdAmount: 100,
      officialSource: 'IRCC',
      notes: 'CAD $100 = ~$75 USD',
    },
    workPermit: {
      name: 'Work Permit',
      usdAmount: 155,
      officialSource: 'IRCC',
      notes: 'CAD $155 = ~$115 USD',
    },
    biometrics: {
      name: 'Biometrics',
      usdAmount: 85,
      officialSource: 'IRCC',
    },
  },

  // USA
  usa: {
    visitorVisa: {
      name: 'B1/B2 Visitor Visa',
      usdAmount: 185,
      officialSource: 'US Embassy',
    },
    studentVisa: {
      name: 'F-1 Student Visa',
      usdAmount: 185,
      officialSource: 'US Embassy',
    },
    sevisFee: {
      name: 'SEVIS I-20 Fee',
      usdAmount: 350,
      officialSource: 'ICE',
      notes: 'Required for F-1 students',
    },
  },

  // UK
  uk: {
    visitorVisa: {
      name: 'Standard Visitor Visa (6 months)',
      usdAmount: 145,
      officialSource: 'UK Visas and Immigration',
      notes: '£115 = ~$145 USD',
    },
    studentVisa: {
      name: 'Student Visa (Tier 4)',
      usdAmount: 490,
      officialSource: 'UK Visas and Immigration',
      notes: '£490 = ~$620 USD',
    },
    ihs: {
      name: 'Immigration Health Surcharge',
      usdAmount: 470,
      officialSource: 'UK Visas and Immigration',
      notes: '£470 per year for students',
    },
  },

  // GERMANY
  germany: {
    nationalVisa: {
      name: 'National Visa (D-Visa)',
      usdAmount: 75,
      officialSource: 'German Embassy',
      notes: '€75 = ~$80 USD',
    },
    blockedAccount: {
      name: 'Blocked Account (Sperrkonto)',
      usdAmount: 11904,
      officialSource: 'German Federal Foreign Office',
      notes: '€11,904 for 2024/25 academic year',
    },
  },

  // AUSTRALIA
  australia: {
    studentVisa: {
      name: 'Student Visa (Subclass 500)',
      usdAmount: 465,
      officialSource: 'Department of Home Affairs',
      notes: 'AUD $710 = ~$465 USD',
    },
    visitorVisa: {
      name: 'Visitor Visa (Subclass 600)',
      usdAmount: 115,
      officialSource: 'Department of Home Affairs',
      notes: 'AUD $190 = ~$125 USD',
    },
  },

  // COMMON COSTS
  common: {
    vfsServiceFee: {
      name: 'VFS Service Fee',
      usdAmount: 40,
      officialSource: 'VFS Global',
      notes: 'Typically $30-50 depending on country',
    },
    medicalExamMin: {
      name: 'Medical Examination (minimum)',
      usdAmount: 100,
      officialSource: 'Panel Physicians',
    },
    medicalExamMax: {
      name: 'Medical Examination (maximum)',
      usdAmount: 200,
      officialSource: 'Panel Physicians',
    },
    translationPerDoc: {
      name: 'Document Translation (per document)',
      usdAmount: 75,
      officialSource: 'Certified Translators',
      notes: '$50-100 average',
    },
    policeClearance: {
      name: 'Police Clearance Certificate',
      usdAmount: 60,
      officialSource: 'Various',
      notes: '$20-100 depending on country',
    },
    travelInsurance: {
      name: 'Travel Insurance (per month)',
      usdAmount: 100,
      officialSource: 'Insurance Providers',
      notes: '$50-150 depending on coverage',
    },
  },
};

/**
 * Build complete cost context for AI prompt
 * Returns pre-formatted cost strings in user's local currency
 */
export function buildCostContext(userCountry: string): Record<string, string> {
  const { formatCost, formatCostRange, formatPerPeriod } = require('./currency-formatter');
  
  return {
    // Canada
    canadaStudyPermit: formatCost(VISA_COSTS.canada.studyPermit.usdAmount, userCountry),
    canadaVisitorVisa: formatCost(VISA_COSTS.canada.visitorVisa.usdAmount, userCountry),
    canadaWorkPermit: formatCost(VISA_COSTS.canada.workPermit.usdAmount, userCountry),
    canadaBiometrics: formatCost(VISA_COSTS.canada.biometrics.usdAmount, userCountry),
    
    // USA
    usaVisitorVisa: formatCost(VISA_COSTS.usa.visitorVisa.usdAmount, userCountry),
    usaStudentVisa: formatCost(VISA_COSTS.usa.studentVisa.usdAmount, userCountry),
    usaSevisFee: formatCost(VISA_COSTS.usa.sevisFee.usdAmount, userCountry),
    
    // UK
    ukVisitorVisa: formatCost(VISA_COSTS.uk.visitorVisa.usdAmount, userCountry),
    ukStudentVisa: formatCost(VISA_COSTS.uk.studentVisa.usdAmount, userCountry),
    ukIHS: formatPerPeriod(VISA_COSTS.uk.ihs.usdAmount, userCountry, 'year'),
    
    // Germany
    germanyNationalVisa: formatCost(VISA_COSTS.germany.nationalVisa.usdAmount, userCountry),
    germanyBlockedAccount: formatCost(VISA_COSTS.germany.blockedAccount.usdAmount, userCountry),
    
    // Australia
    australiaStudentVisa: formatCost(VISA_COSTS.australia.studentVisa.usdAmount, userCountry),
    australiaVisitorVisa: formatCost(VISA_COSTS.australia.visitorVisa.usdAmount, userCountry),
    
    // Common costs
    vfsServiceFee: formatCost(VISA_COSTS.common.vfsServiceFee.usdAmount, userCountry),
    medicalExam: formatCostRange(
      VISA_COSTS.common.medicalExamMin.usdAmount,
      VISA_COSTS.common.medicalExamMax.usdAmount,
      userCountry
    ),
    translationPerDoc: formatCost(VISA_COSTS.common.translationPerDoc.usdAmount, userCountry),
    policeClearance: formatCost(VISA_COSTS.common.policeClearance.usdAmount, userCountry),
    travelInsurance: formatPerPeriod(VISA_COSTS.common.travelInsurance.usdAmount, userCountry, 'month'),
  };
}
