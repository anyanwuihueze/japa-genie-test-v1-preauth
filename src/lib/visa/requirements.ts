import { createClient } from '@/lib/supabase/server';

export interface VisaRequirement {
  id: string;
  country_code: string;
  country_name: string;
  visa_category: string;
  visa_subtype?: string;
  required_documents: {
    document: string;
    mandatory: boolean;
    stage: string;
    description: string;
    common_issues?: string[];
  }[];
  processing_timeline?: any;
  financial_requirements?: any;
  eligibility_criteria?: any;
  success_factors?: any;
  common_rejection_reasons?: any;
  is_active: boolean;
}

export class VisaRequirementsService {
  async getRequirements(countryName: string, visaCategory: string): Promise<VisaRequirement> {
    const supabase = await createClient();
    
    console.log(`🔍 Fetching requirements for ${countryName} - ${visaCategory}`);
    
    // Try exact match first
    let { data: requirements } = await supabase
      .from('visa_requirements')
      .select('*')
      .eq('country_name', countryName)
      .eq('visa_category', visaCategory.toLowerCase())
      .eq('is_active', true)
      .single();

    if (requirements) {
      console.log(`✅ Found exact match for ${countryName}`);
      return requirements;
    }

    // Try case-insensitive search
    const { data: allRequirements } = await supabase
      .from('visa_requirements')
      .select('*')
      .eq('visa_category', visaCategory.toLowerCase())
      .eq('is_active', true);

    if (allRequirements && allRequirements.length > 0) {
      const matched = allRequirements.find(req => 
        req.country_name.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(req.country_name.toLowerCase())
      );
      if (matched) {
        console.log(`✅ Found similar match for ${countryName}`);
        return matched;
      }
    }

    // Fallback to generic requirements for ANY country
    console.log(`🌍 Using generic requirements for ${countryName}`);
    return this.getGenericRequirements(countryName, visaCategory);
  }

  private getGenericRequirements(countryName: string, visaCategory: string): VisaRequirement {
    const baseRequirements = {
      student: [
        { document: "Passport", mandatory: true, stage: "identity", description: "Valid passport with 6+ months validity", common_issues: ["Expiry less than 6 months", "Damaged passport"] },
        { document: "Financial Proof", mandatory: true, stage: "financial", description: "Evidence of sufficient funds for tuition and living expenses", common_issues: ["Insufficient funds", "Recent large deposits"] },
        { document: "Educational Documents", mandatory: true, stage: "qualifications", description: "Academic transcripts and certificates", common_issues: ["Unverified documents", "Incomplete transcripts"] },
        { document: "Language Test", mandatory: true, stage: "qualifications", description: "English or local language proficiency test", common_issues: ["Score below requirement", "Expired test results"] },
        { document: "Letter of Acceptance", mandatory: true, stage: "application", description: "Admission letter from educational institution" },
        { document: "Statement of Purpose", mandatory: false, stage: "application", description: "Study plans and career goals" }
      ],
      work: [
        { document: "Passport", mandatory: true, stage: "identity", description: "Valid passport", common_issues: ["Expiry soon", "Missing pages"] },
        { document: "Job Offer", mandatory: true, stage: "employment", description: "Formal job offer from employer", common_issues: ["Salary below requirement", "Job not genuine"] },
        { document: "Qualifications", mandatory: true, stage: "qualifications", description: "Professional qualifications and degrees", common_issues: ["Unrecognized institution", "Incomplete certificates"] },
        { document: "Work Experience", mandatory: true, stage: "employment", description: "Previous employment verification letters", common_issues: ["Gaps in employment", "Unverifiable experience"] },
        { document: "Resume/CV", mandatory: true, stage: "employment", description: "Detailed professional background" },
        { document: "Professional Licenses", mandatory: false, stage: "qualifications", description: "Industry-specific certifications" }
      ],
      tourist: [
        { document: "Passport", mandatory: true, stage: "identity", description: "Valid passport with 6+ months validity", common_issues: ["Expiry soon", "Insufficient blank pages"] },
        { document: "Financial Proof", mandatory: true, stage: "financial", description: "Bank statements showing sufficient funds", common_issues: ["Inconsistent income", "Recent large deposits"] },
        { document: "Travel Itinerary", mandatory: true, stage: "travel", description: "Flight and accommodation details", common_issues: ["Unconfirmed bookings", "Unrealistic itinerary"] },
        { document: "Employment Proof", mandatory: true, stage: "employment", description: "Employment letter or business registration", common_issues: ["No employment proof", "Suspicious company"] },
        { document: "Travel Insurance", mandatory: false, stage: "travel", description: "Medical and travel insurance coverage" },
        { document: "Invitation Letter", mandatory: false, stage: "travel", description: "If visiting friends or family" }
      ],
      business: [
        { document: "Passport", mandatory: true, stage: "identity", description: "Valid passport" },
        { document: "Business Invitation", mandatory: true, stage: "business", description: "Invitation from host company" },
        { document: "Company Documents", mandatory: true, stage: "business", description: "Business registration and financials" },
        { document: "Financial Proof", mandatory: true, stage: "financial", description: "Company and personal financial statements" },
        { document: "Meeting Schedule", mandatory: false, stage: "business", description: "Business meetings and appointments" }
      ],
      family: [
        { document: "Passport", mandatory: true, stage: "identity", description: "Valid passport" },
        { document: "Relationship Proof", mandatory: true, stage: "relationship", description: "Marriage certificate, birth certificates" },
        { document: "Sponsor Documents", mandatory: true, stage: "financial", description: "Sponsor's financial evidence and status" },
        { document: "Accommodation Proof", mandatory: true, stage: "living", description: "Proof of living arrangements" },
        { document: "Family Photos", mandatory: false, stage: "relationship", description: "Evidence of genuine relationship" }
      ],
      asylum: [
        { document: "Passport/ID", mandatory: true, stage: "identity", description: "Identity documents" },
        { document: "Personal Statement", mandatory: true, stage: "evidence", description: "Detailed account of persecution" },
        { document: "Evidence of Persecution", mandatory: true, stage: "evidence", description: "Police reports, medical records, threats" },
        { document: "Witness Statements", mandatory: false, stage: "evidence", description: "Statements from family/friends" },
        { document: "Country Condition Evidence", mandatory: false, stage: "evidence", description: "News reports, human rights reports" }
      ]
    };

    const categoryKey = visaCategory.toLowerCase() as keyof typeof baseRequirements;
    const documents = baseRequirements[categoryKey] || baseRequirements.tourist;

    return {
      id: 'generic-' + Date.now(),
      country_code: 'GEN',
      country_name: countryName,
      visa_category: visaCategory,
      required_documents: documents,
      processing_timeline: { min_weeks: 4, max_weeks: 12, expedited: false },
      financial_requirements: { min_balance: 5000, currency: "USD" },
      is_active: true
    };
  }

  // Get all available countries for a visa type
  async getAvailableCountries(visaCategory: string): Promise<string[]> {
    const supabase = await createClient();
    
    const { data: requirements } = await supabase
      .from('visa_requirements')
      .select('country_name')
      .eq('visa_category', visaCategory.toLowerCase())
      .eq('is_active', true);

    if (requirements && requirements.length > 0) {
      return [...new Set(requirements.map(r => r.country_name))].sort();
    }

    // Fallback to common countries
    return [
      "United States", "Canada", "United Kingdom", "Australia", "Germany", 
      "France", "Japan", "South Korea", "Singapore", "United Arab Emirates",
      "Netherlands", "Sweden", "Ireland", "New Zealand", "Spain"
    ];
  }
}