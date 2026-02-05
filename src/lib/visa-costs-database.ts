// COMPLETE VISA COSTS DATABASE - PRODUCTION READY
// Countries: 15 (UK, Canada, USA + 12 from Kimi)
// Last Updated: 2025-02-03

export interface VisaCosts {
  application_fee: number;
  biometrics: number;
  health_surcharge?: number;
  sevis_fee?: number;
  blocked_account?: number;
  financial_requirement: number;
  hidden_costs: {
    flight: number;
    medical_exam: number;
    police_clearance: number;
    translation: number;
    notarization: number;
    apostille: number;
    courier: number;
    photos: number;
    priority_processing?: number;
    language_test?: number;
    accommodation_deposit: number;
    travel_insurance: number;
    visa_appointment_travel?: number;
    skills_assessment?: number;
    other?: number;
  };
  total_basic: number;
  total_hidden: number;
  grand_total_min: number;
  grand_total_max: number;
}

export interface VisaTypeData {
  costs: VisaCosts;
  pof_seasoning: {
    required: boolean;
    duration_days: number;
    calculation_method: string;
  };
  processing: {
    standard_days: number;
    expedited_days?: number;
    biometric_wait_lagos?: number;
    interview_required: boolean;
  };
  african_quirks?: {
    rejection_rate_nigeria?: number;
    common_issues: string[];
    special_requirements?: string[];
  };
  work_rights?: {
    allowed: boolean;
    max_hours_week?: number;
    notes?: string;
  };
}

export interface CountryVisaData {
  country: string;
  flag_emoji: string;
  visa_types: {
    Student?: VisaTypeData;
    Work?: VisaTypeData;
    Business?: VisaTypeData;
  };
  metadata: {
    sources: string[];
    confidence_score: number;
    last_updated: string;
  };
}

export const VISA_COSTS_DATABASE: Record<string, CountryVisaData> = {
  'UK': {
    country: 'United Kingdom',
    flag_emoji: '🇬🇧',
    visa_types: {
      Student: {
        costs: {
          application_fee: 490,
          biometrics: 30,
          health_surcharge: 1164,
          financial_requirement: 16050,
          hidden_costs: {
            flight: 800,
            medical_exam: 350,
            police_clearance: 50,
            translation: 200,
            notarization: 50,
            apostille: 0,
            courier: 50,
            photos: 20,
            priority_processing: 250,
            language_test: 250,
            accommodation_deposit: 1500,
            travel_insurance: 500,
            visa_appointment_travel: 100,
            other: 150
          },
          total_basic: 1684,
          total_hidden: 4270,
          grand_total_min: 22004,
          grand_total_max: 22254
        },
        pof_seasoning: {
          required: true,
          duration_days: 28,
          calculation_method: 'Funds must be held for 28 consecutive days ending no more than 31 days before visa application'
        },
        processing: {
          standard_days: 21,
          expedited_days: 5,
          biometric_wait_lagos: 14,
          interview_required: false
        },
        african_quirks: {
          rejection_rate_nigeria: 45.9,
          common_issues: ['Insufficient POF seasoning', 'Unclear ties to home country', 'Fraudulent documents'],
          special_requirements: ['TB test mandatory for Nigerians', 'CAC documents if showing business income']
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Part-time work during term, full-time during holidays'
        }
      }
    },
    metadata: {
      sources: ['https://www.gov.uk/student-visa ', 'VFS Global UK'],
      confidence_score: 95,
      last_updated: '2025-02-03'
    }
  },

  'Canada': {
    country: 'Canada',
    flag_emoji: '🇨🇦',
    visa_types: {
      Student: {
        costs: {
          application_fee: 150,
          biometrics: 85,
          financial_requirement: 10000,
          hidden_costs: {
            flight: 1200,
            medical_exam: 450,
            police_clearance: 100,
            translation: 300,
            notarization: 75,
            apostille: 0,
            courier: 75,
            photos: 20,
            language_test: 300,
            accommodation_deposit: 1500,
            travel_insurance: 500,
            visa_appointment_travel: 50,
            other: 150
          },
          total_basic: 235,
          total_hidden: 4720,
          grand_total_min: 14955,
          grand_total_max: 15200
        },
        pof_seasoning: {
          required: true,
          duration_days: 120,
          calculation_method: 'GIC or 4 months of funds in bank account'
        },
        processing: {
          standard_days: 42,
          biometric_wait_lagos: 10,
          interview_required: false
        },
        african_quirks: {
          rejection_rate_nigeria: 38.2,
          common_issues: ['Insufficient ties to home country', 'Study plan unclear', 'POF source unexplained'],
          special_requirements: ['GIC strongly recommended for SDS stream']
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Off-campus work allowed, PGWP after graduation'
        }
      }
    },
    metadata: {
      sources: ['https://www.canada.ca/en/immigration ', 'VFS Global Canada'],
      confidence_score: 95,
      last_updated: '2025-02-03'
    }
  },

  'USA': {
    country: 'United States',
    flag_emoji: '🇺🇸',
    visa_types: {
      Student: {
        costs: {
          application_fee: 185,
          biometrics: 0,
          sevis_fee: 350,
          financial_requirement: 25000,
          hidden_costs: {
            flight: 900,
            medical_exam: 200,
            police_clearance: 50,
            translation: 250,
            notarization: 50,
            apostille: 0,
            courier: 50,
            photos: 20,
            language_test: 250,
            accommodation_deposit: 2000,
            travel_insurance: 600,
            visa_appointment_travel: 100,
            other: 100
          },
          total_basic: 535,
          total_hidden: 4570,
          grand_total_min: 30105,
          grand_total_max: 30500
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'No specific seasoning period, but funds must be readily available'
        },
        processing: {
          standard_days: 35,
          biometric_wait_lagos: 21,
          interview_required: true
        },
        african_quirks: {
          rejection_rate_nigeria: 52.1,
          common_issues: ['Immigrant intent suspected', 'Insufficient ties to Nigeria', 'I-20 discrepancies'],
          special_requirements: ['Interview mandatory at US Embassy Lagos/Abuja']
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'On-campus work only, OPT/CPT available'
        }
      }
    },
    metadata: {
      sources: ['https://travel.state.gov ', 'US Embassy Lagos'],
      confidence_score: 95,
      last_updated: '2025-02-03'
    }
  },

  'Malta': {
    country: 'Malta',
    flag_emoji: '🇲🇹',
    visa_types: {
      Student: {
        costs: {
          application_fee: 110,
          biometrics: 33,
          financial_requirement: 12000,
          hidden_costs: {
            flight: 700,
            medical_exam: 100,
            police_clearance: 50,
            translation: 150,
            notarization: 0,
            apostille: 50,
            courier: 30,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 800,
            travel_insurance: 400,
            visa_appointment_travel: 0,
            other: 50
          },
          total_basic: 143,
          total_hidden: 2350,
          grand_total_min: 14493,
          grand_total_max: 14600
        },
        pof_seasoning: {
          required: true,
          duration_days: 90,
          calculation_method: '3-6 months bank statements showing €10,000-12,000'
        },
        processing: {
          standard_days: 42,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Work allowed after 90 days with Jobsplus permit'
        }
      }
    },
    metadata: {
      sources: ['https://identitymalta.com ', 'VFS Global Malta'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Vietnam': {
    country: 'Vietnam',
    flag_emoji: '🇻🇳',
    visa_types: {
      Student: {
        costs: {
          application_fee: 50,
          biometrics: 0,
          financial_requirement: 5000,
          hidden_costs: {
            flight: 800,
            medical_exam: 80,
            police_clearance: 30,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 0,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 400,
            travel_insurance: 200,
            visa_appointment_travel: 0,
            other: 35
          },
          total_basic: 50,
          total_hidden: 1565,
          grand_total_min: 6615,
          grand_total_max: 6700
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'Bank statements showing sufficient funds'
        },
        processing: {
          standard_days: 7,
          interview_required: false
        },
        work_rights: {
          allowed: false,
          max_hours_week: 0,
          notes: 'Work not permitted on student visa'
        }
      }
    },
    metadata: {
      sources: ['https://evisa.gov.vn ', 'Vietnam Immigration'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Poland': {
    country: 'Poland',
    flag_emoji: '🇵🇱',
    visa_types: {
      Student: {
        costs: {
          application_fee: 88,
          biometrics: 0,
          financial_requirement: 6000,
          hidden_costs: {
            flight: 600,
            medical_exam: 150,
            police_clearance: 50,
            translation: 200,
            notarization: 0,
            apostille: 0,
            courier: 50,
            photos: 20,
            language_test: 220,
            accommodation_deposit: 800,
            travel_insurance: 400,
            visa_appointment_travel: 75,
            other: 100
          },
          total_basic: 88,
          total_hidden: 2665,
          grand_total_min: 8753,
          grand_total_max: 8900
        },
        pof_seasoning: {
          required: true,
          duration_days: 90,
          calculation_method: 'Bank statements showing funds for tuition + living'
        },
        processing: {
          standard_days: 30,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Part-time work permitted during studies'
        }
      }
    },
    metadata: {
      sources: ['https://www.gov.pl/web/diplomacy ', 'Poland Consulate'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Qatar': {
    country: 'Qatar',
    flag_emoji: '🇶🇦',
    visa_types: {
      Student: {
        costs: {
          application_fee: 55,
          biometrics: 55,
          financial_requirement: 19200,
          hidden_costs: {
            flight: 800,
            medical_exam: 135,
            police_clearance: 50,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 50,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 1200,
            travel_insurance: 330,
            visa_appointment_travel: 0,
            other: 275
          },
          total_basic: 110,
          total_hidden: 2860,
          grand_total_min: 22170,
          grand_total_max: 22400
        },
        pof_seasoning: {
          required: true,
          duration_days: 180,
          calculation_method: '6-12 months bank statements or sponsorship letter'
        },
        processing: {
          standard_days: 21,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'On-campus work or internships with approval'
        }
      }
    },
    metadata: {
      sources: ['https://www.moi.gov.qatar ', 'Qatar Embassy'],
      confidence_score: 85,
      last_updated: '2025-02-03'
    }
  },

  'Cyprus': {
    country: 'Cyprus',
    flag_emoji: '🇨🇾',
    visa_types: {
      Student: {
        costs: {
          application_fee: 77,
          biometrics: 0,
          financial_requirement: 10000,
          hidden_costs: {
            flight: 700,
            medical_exam: 100,
            police_clearance: 50,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 30,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 700,
            travel_insurance: 300,
            visa_appointment_travel: 0,
            other: 50
          },
          total_basic: 77,
          total_hidden: 1950,
          grand_total_min: 12027,
          grand_total_max: 12100
        },
        pof_seasoning: {
          required: true,
          duration_days: 90,
          calculation_method: 'Bank statements showing sufficient funds'
        },
        processing: {
          standard_days: 30,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Part-time work with permit'
        }
      }
    },
    metadata: {
      sources: ['https://www.mfa.gov.cy ', 'Cyprus Immigration'],
      confidence_score: 85,
      last_updated: '2025-02-03'
    }
  },

  'Saudi Arabia': {
    country: 'Saudi Arabia',
    flag_emoji: '🇸🇦',
    visa_types: {
      Student: {
        costs: {
          application_fee: 135,
          biometrics: 0,
          financial_requirement: 20000,
          hidden_costs: {
            flight: 900,
            medical_exam: 200,
            police_clearance: 50,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 50,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 1000,
            travel_insurance: 0,
            visa_appointment_travel: 0,
            other: 150
          },
          total_basic: 135,
          total_hidden: 2370,
          grand_total_min: 22505,
          grand_total_max: 22700
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'Bank statements or sponsorship letter'
        },
        processing: {
          standard_days: 21,
          interview_required: false
        },
        work_rights: {
          allowed: false,
          max_hours_week: 0,
          notes: 'Work not permitted on student visa'
        }
      }
    },
    metadata: {
      sources: ['https://visa.mofa.gov.sa ', 'Saudi Embassy'],
      confidence_score: 80,
      last_updated: '2025-02-03'
    }
  },

  'Czech Republic': {
    country: 'Czech Republic',
    flag_emoji: '🇨🇿',
    visa_types: {
      Student: {
        costs: {
          application_fee: 121,
          biometrics: 0,
          financial_requirement: 5400,
          hidden_costs: {
            flight: 700,
            medical_exam: 200,
            police_clearance: 50,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 50,
            photos: 20,
            language_test: 200,
            accommodation_deposit: 900,
            travel_insurance: 500,
            visa_appointment_travel: 0,
            other: 100
          },
          total_basic: 121,
          total_hidden: 2720,
          grand_total_min: 8241,
          grand_total_max: 8400
        },
        pof_seasoning: {
          required: true,
          duration_days: 90,
          calculation_method: 'Bank statements showing sufficient funds'
        },
        processing: {
          standard_days: 60,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Part-time work permitted'
        }
      }
    },
    metadata: {
      sources: ['https://mzv.gov.cz ', 'Czech Embassy'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Indonesia': {
    country: 'Indonesia',
    flag_emoji: '🇮🇩',
    visa_types: {
      Student: {
        costs: {
          application_fee: 135,
          biometrics: 0,
          financial_requirement: 6000,
          hidden_costs: {
            flight: 900,
            medical_exam: 100,
            police_clearance: 40,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 30,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 500,
            travel_insurance: 200,
            visa_appointment_travel: 0,
            other: 50
          },
          total_basic: 135,
          total_hidden: 1840,
          grand_total_min: 7975,
          grand_total_max: 8100
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'Minimum USD 2,000 showing'
        },
        processing: {
          standard_days: 21,
          interview_required: false
        },
        work_rights: {
          allowed: false,
          max_hours_week: 0,
          notes: 'Work not permitted'
        }
      }
    },
    metadata: {
      sources: ['https://www.imigrasi.go.id ', 'Indonesia Immigration'],
      confidence_score: 85,
      last_updated: '2025-02-03'
    }
  },

  'Taiwan': {
    country: 'Taiwan',
    flag_emoji: '🇹🇼',
    visa_types: {
      Student: {
        costs: {
          application_fee: 45,
          biometrics: 0,
          financial_requirement: 8000,
          hidden_costs: {
            flight: 900,
            medical_exam: 100,
            police_clearance: 50,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 30,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 600,
            travel_insurance: 200,
            visa_appointment_travel: 0,
            other: 100
          },
          total_basic: 45,
          total_hidden: 2000,
          grand_total_min: 10045,
          grand_total_max: 10200
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'Bank statements showing sufficient funds'
        },
        processing: {
          standard_days: 21,
          interview_required: false
        },
        african_quirks: {
          common_issues: [],
          special_requirements: ['Students from Ghana, Nigeria require special visa process']
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Work permit required'
        }
      }
    },
    metadata: {
      sources: ['https://www.immigration.gov.tw ', 'Taiwan BOCA'],
      confidence_score: 85,
      last_updated: '2025-02-03'
    }
  },

  'Thailand': {
    country: 'Thailand',
    flag_emoji: '🇹🇭',
    visa_types: {
      Student: {
        costs: {
          application_fee: 80,
          biometrics: 0,
          financial_requirement: 6000,
          hidden_costs: {
            flight: 700,
            medical_exam: 80,
            police_clearance: 30,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 0,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 400,
            travel_insurance: 200,
            visa_appointment_travel: 0,
            other: 60
          },
          total_basic: 80,
          total_hidden: 1490,
          grand_total_min: 7570,
          grand_total_max: 7700
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: '20,000 THB minimum bank solvency'
        },
        processing: {
          standard_days: 25,
          interview_required: false
        },
        work_rights: {
          allowed: false,
          max_hours_week: 0,
          notes: 'Work NOT permitted on ED visa'
        }
      }
    },
    metadata: {
      sources: ['https://www.immigration.go.th ', 'Thai Embassy'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Malaysia': {
    country: 'Malaysia',
    flag_emoji: '🇲🇾',
    visa_types: {
      Student: {
        costs: {
          application_fee: 373,
          biometrics: 0,
          financial_requirement: 8000,
          hidden_costs: {
            flight: 700,
            medical_exam: 60,
            police_clearance: 30,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 0,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 500,
            travel_insurance: 110,
            visa_appointment_travel: 0,
            other: 15
          },
          total_basic: 373,
          total_hidden: 1435,
          grand_total_min: 9808,
          grand_total_max: 10000
        },
        pof_seasoning: {
          required: false,
          duration_days: 0,
          calculation_method: 'Bank statements showing sufficient funds'
        },
        processing: {
          standard_days: 14,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 20,
          notes: 'Work during holidays/breaks only'
        }
      }
    },
    metadata: {
      sources: ['https://educationmalaysia.gov.my ', 'EMGS'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  },

  'Turkey': {
    country: 'Turkey',
    flag_emoji: '🇹🇷',
    visa_types: {
      Student: {
        costs: {
          application_fee: 60,
          biometrics: 0,
          financial_requirement: 7000,
          hidden_costs: {
            flight: 600,
            medical_exam: 100,
            police_clearance: 40,
            translation: 0,
            notarization: 0,
            apostille: 0,
            courier: 30,
            photos: 20,
            language_test: 0,
            accommodation_deposit: 600,
            travel_insurance: 200,
            visa_appointment_travel: 0,
            other: 35
          },
          total_basic: 60,
          total_hidden: 1625,
          grand_total_min: 8685,
          grand_total_max: 8800
        },
        pof_seasoning: {
          required: true,
          duration_days: 90,
          calculation_method: 'Last 3 months bank statements'
        },
        processing: {
          standard_days: 21,
          interview_required: false
        },
        work_rights: {
          allowed: true,
          max_hours_week: 24,
          notes: 'Work permit required'
        }
      }
    },
    metadata: {
      sources: ['https://www.visa.gov.tr ', 'Turkey e-ikamet'],
      confidence_score: 90,
      last_updated: '2025-02-03'
    }
  }
};

export function getAllCountries(): string[] {
  return Object.keys(VISA_COSTS_DATABASE);
}

export function getVisaTypes(country: string): string[] {
  const countryData = VISA_COSTS_DATABASE[country];
  return countryData ? Object.keys(countryData.visa_types) : [];
}

export function calculateWithDependents(costs: VisaCosts, dependents: number = 0): VisaCosts {
  const multiplier = 1 + dependents * 0.5;
  return {
    ...costs,
    financial_requirement: Math.round(costs.financial_requirement * multiplier),
    grand_total_min: Math.round(costs.grand_total_min * multiplier),
    grand_total_max: Math.round(costs.grand_total_max * multiplier)
  };
}