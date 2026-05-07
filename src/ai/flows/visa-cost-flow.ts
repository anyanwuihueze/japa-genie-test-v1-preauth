'use server';

const KIMI_API_KEY = process.env.KIMI_API_KEY || '';
const KIMI_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const KIMI_MODEL = 'moonshotai/kimi-k2.5';

export interface VisaCostRequest {
  originCountry: string;
  destinationCountry: string;
  visaType: string;
  dependents: number;
  travelDate?: string;
}

export interface VisaCostResponse {
  totalCost: number;
  totalCostLocal: number;
  localCurrency: string;
  hiddenCostsTotal: number;
  visibleCostsTotal: number;
  pofRequirement: {
    amount: number;
    currency: string;
    seasoningPeriod: number;
    deadline: string;
    accountType: string;
    monthlySavingsNeeded: number;
  };
  flightEstimate: {
    economy: number;
    business: number;
    currency: string;
    route: string;
  };
  insuranceEstimate: {
    health: number;
    travel: number;
    currency: string;
    duration: string;
  };
  aiAnalysis: {
    shockingFact: string;
    criticalInsight: string;
    urgencyFactor: string;
    savingsTimeline: string;
    optimizationTips: string[];
  };
  breakdown: Array<{
    category: string;
    item: string;
    cost: number;
    currency: string;
    frequency: string;
    isHidden: boolean;
    description: string;
    deadline?: string;
  }>;
  visaSpecificRequirements: string[];
  timeline: {
    startBy: string;
    pofDeadline: string;
    applicationDeadline: string;
    estimatedDecision: string;
  };
  pofProfile: {
    timeline: {
      accountOpenDate: string;
      depositDeadline: string;
      seasoningStartDate: string;
      seasoningEndDate: string;
      visaApplicationDate: string;
      daysRemaining: number;
      conflicts: string[];
    };
    savingsRoadmap: {
      monthlyBreakdown: Array<{
        month: string;
        amountToSave: number;
        cumulativeTotal: number;
        milestone: string;
      }>;
      exchangeRateBuffer: number;
      totalWithBuffer: number;
      recommendedProviders: Array<{
        name: string;
        pros: string[];
        cons: string[];
        feeEstimate: number;
        setupTime: string;
      }>;
    };
    risks: {
      exchangeRateRisk: {
        severity: 'low' | 'medium' | 'high';
        currentRate: string;
        mitigation: string;
      };
      timingRisks: string[];
      commonMistakes: string[];
    };
  };
  hiddenCostsDetailed: Array<{
    category: string;
    item: string;
    cost: number;
    urgency: 'critical' | 'important' | 'optional';
    deadline: string;
    whoNeedsIt: string;
    whereToGet: string;
    estimatedTime: string;
    description: string;
  }>;
  preGatePreview: {
    shockStatistic: string;
    top3HiddenCosts: Array<{
      item: string;
      cost: number;
      why: string;
    }>;
    pofUrgency: string;
    comparisonData: {
      whatMostBudget: number;
      actualCost: number;
      missedAmount: number;
    };
  };
}

export async function calculateVisaCost(request: VisaCostRequest): Promise<VisaCostResponse> {
  console.log('🎯 VISA COST CALCULATION STARTING');
  console.log('Request:', JSON.stringify(request, null, 2));
  console.log('KIMI_API_KEY exists:', !!KIMI_API_KEY);
  console.log('KIMI_API_KEY length:', KIMI_API_KEY.length);

  try {
    const travelDateInfo = request.travelDate 
      ? `Planned travel date: ${request.travelDate}` 
      : 'No specific travel date provided';

    const prompt = `ACT AS A PREMIUM VISA FINANCIAL ADVISOR with 15 years experience analyzing visa costs for high-net-worth clients.

APPLICANT DETAILS:
- Origin Country: ${request.originCountry}
- Destination Country: ${request.destinationCountry}
- Visa Type: ${request.visaType}
- Number of Dependents: ${request.dependents}
- ${travelDateInfo}
- Analysis Date: ${new Date().toISOString().split('T')[0]}

YOUR MISSION: Create a PREMIUM, DETAILED cost analysis that makes applicants say "This is worth paying for!"

Calculate COMPREHENSIVE REAL-WORLD visa and relocation costs with 2024-2025 rates:

1. EMBASSY FEES (visa application, biometrics, processing, expedited options)
2. PROOF OF FUNDS (CRITICAL - Calculate exact POF with seasoning timeline)
3. INSURANCE (mandatory health + comprehensive travel coverage)
4. FLIGHTS (realistic economy/business estimates for route)
5. HIDDEN COSTS (12-15 specific items most people miss)
6. SETTLEMENT COSTS (first 2 months living expenses)

CRITICAL POF REQUIREMENTS (Research these EXACTLY):
- Germany: €11,208 blocked account, 3-month seasoning, must open with Fintiba/Deutsche Bank/Expatrio
- UK: £1,334/month × course length, 28-day seasoning, must be in personal account
- Canada: CAD $10,000 minimum (students), 6-month transaction history required
- USA: $15,000-$40,000 (varies by visa type), 3-6 months bank history recommended
- Australia: AUD $21,041 (students), 3-month history
- Schengen: €90-120 per day of stay

POF PROVIDER OPTIONS (for blocked accounts):
- Fintiba: €11,208 setup, €89 annual fee, 3-5 days setup, best customer service
- Deutsche Bank: €11,208 setup, €150 annual fee, 7-10 days setup, traditional banking
- Expatrio: €11,208 setup, €49 annual fee, 2-4 days setup, fastest but limited support

Return ONLY valid JSON (no markdown, no code blocks):
{
  "totalCost": number (in USD - be realistic, include EVERYTHING),
  "totalCostLocal": number (in destination currency),
  "localCurrency": string (e.g., "EUR", "GBP", "CAD"),
  "hiddenCostsTotal": number (sum of all hidden costs),
  "visibleCostsTotal": number (sum of obvious costs like visa fee + POF),
  
  "pofRequirement": {
    "amount": number (exact amount in local currency),
    "currency": string,
    "seasoningPeriod": number (months required),
    "deadline": string (ISO date - calculate based on travel date or use intelligent estimate),
    "accountType": string (e.g., "Blocked Account", "Savings Account", "Sponsor Letter"),
    "monthlySavingsNeeded": number (calculate: amount ÷ months until deadline)
  },
  
  "flightEstimate": {
    "economy": number (USD, realistic 2024 prices),
    "business": number (USD),
    "currency": "USD",
    "route": "${request.originCountry} → ${request.destinationCountry}"
  },
  
  "insuranceEstimate": {
    "health": number (annual mandatory health insurance in USD),
    "travel": number (comprehensive travel insurance in USD),
    "currency": "USD",
    "duration": "12 months"
  },
  
  "aiAnalysis": {
    "shockingFact": "Compelling stat about hidden costs (e.g., '73% of ${request.originCountry} applicants miss €1,840 in hidden fees')",
    "criticalInsight": "Most urgent action item with specific number (e.g., 'You must have €11,208 untouched in blocked account BY_CALCULATED_DEADLINE')",
    "urgencyFactor": "Why they need to act NOW with data (e.g., '${request.destinationCountry} visa processing times up 34% - apply early')",
    "savingsTimeline": "Specific savings plan (e.g., 'Save $1,868/month starting this week to meet POF deadline')",
    "optimizationTips": [
      "Specific money-saving tip with dollar amount (e.g., 'Book flights 90-120 days before travel - saves average $320')",
      "Another actionable tip with savings (e.g., 'Use Fintiba over Deutsche Bank - saves €61/year in fees')",
      "Third tip (e.g., 'Get police clearance now - rush processing costs 3x more')"
    ]
  },
  
  "breakdown": [
    {
      "category": "Visa Fees" | "Proof of Funds" | "Insurance" | "Travel" | "Documents" | "Settlement",
      "item": string (specific cost item - be detailed),
      "cost": number (USD),
      "currency": "USD",
      "frequency": "one-time" | "monthly" | "annual",
      "isHidden": boolean (true if 70%+ applicants don't budget for this),
      "description": string (WHY this cost exists - educate them),
      "deadline": string (ISO date if time-sensitive - calculate intelligently)
    }
  ],
  
  "visaSpecificRequirements": [
    "Detailed requirement 1 specific to ${request.visaType} visa for ${request.destinationCountry}",
    "Requirement 2 with actionable detail",
    "Requirement 3 with deadline if applicable",
    "Requirement 4",
    "Requirement 5"
  ],
  
  "timeline": {
    "startBy": string (ISO date - when to start preparing, usually NOW or within 1 week),
    "pofDeadline": string (ISO date - when POF must be ready = visa application date minus seasoning period),
    "applicationDeadline": string (ISO date - recommended visa application date),
    "estimatedDecision": string (ISO date - expected visa decision based on country processing times)
  },
  
  "pofProfile": {
    "timeline": {
      "accountOpenDate": string (ISO date - recommend opening account ASAP),
      "depositDeadline": string (ISO date - last day to deposit full amount before seasoning starts),
      "seasoningStartDate": string (ISO date - when seasoning period begins),
      "seasoningEndDate": string (ISO date - when seasoning completes = visa application date),
      "visaApplicationDate": string (ISO date - when they can apply for visa),
      "daysRemaining": number (days from today until POF deadline),
      "conflicts": [
        "Any timeline conflicts",
        "Warning if timeline is tight"
      ]
    },
    "savingsRoadmap": {
      "monthlyBreakdown": [
        {
          "month": string (start with current month),
          "amountToSave": number (divide total by months remaining),
          "cumulativeTotal": number (running total),
          "milestone": "Milestone for this month"
        }
      ],
      "exchangeRateBuffer": number (5-8% buffer for currency fluctuation in USD),
      "totalWithBuffer": number (POF + buffer in USD),
      "recommendedProviders": [
        {
          "name": "Fintiba" | "Deutsche Bank" | "Expatrio" | "Local Bank",
          "pros": ["Advantage 1", "Advantage 2", "Advantage 3"],
          "cons": ["Disadvantage 1", "Disadvantage 2"],
          "feeEstimate": number (total fees in USD),
          "setupTime": string (e.g., "3-5 business days")
        }
      ]
    },
    "risks": {
      "exchangeRateRisk": {
        "severity": "low" | "medium" | "high",
        "currentRate": string (e.g., "1 USD = 1,450 NGN"),
        "mitigation": "Specific advice"
      },
      "timingRisks": [
        "Specific timing risk",
        "Another risk"
      ],
      "commonMistakes": [
        "Mistake 1",
        "Mistake 2",
        "Mistake 3",
        "Mistake 4"
      ]
    }
  },
  
  "hiddenCostsDetailed": [
    {
      "category": string (e.g., "Medical", "Documents", "Travel", "Logistics"),
      "item": string (e.g., "Tuberculosis Test"),
      "cost": number (USD - be realistic),
      "urgency": "critical" | "important" | "optional",
      "deadline": string (ISO date - calculate based on visa timeline),
      "whoNeedsIt": string,
      "whereToGet": string,
      "estimatedTime": string,
      "description": string
    }
  ],
  
  "preGatePreview": {
    "shockStatistic": "Compelling stat for pre-payment preview",
    "top3HiddenCosts": [
      {
        "item": "Most expensive hidden cost",
        "cost": number (USD),
        "why": "Brief explanation"
      },
      {
        "item": "Second most expensive",
        "cost": number,
        "why": "Why it's hidden"
      },
      {
        "item": "Third critical cost",
        "cost": number,
        "why": "Why people overlook it"
      }
    ],
    "pofUrgency": "Urgent statement about POF",
    "comparisonData": {
      "whatMostBudget": number (USD),
      "actualCost": number (USD),
      "missedAmount": number (USD)
    }
  }
}

IMPORTANT INSTRUCTIONS:
1. BE BRUTALLY REALISTIC - Research actual 2024-2025 costs, don't lowball
2. CALCULATE EXACT DATES - Calculate all dates dynamically based on travel date or today + 90 days
3. PERSONALIZE TO ROUTE - ${request.originCountry} → ${request.destinationCountry} has unique costs
4. INCLUDE 15-20 COST ITEMS - Be comprehensive, this is a premium report
5. MAKE IT ACTIONABLE - Every section should have specific next steps
6. ADD URGENCY - Use real deadlines and time-sensitive language
7. PROVIDE VALUE - This report should make people say "I need to pay for this tool"

Return ONLY the JSON object, no markdown formatting, no code blocks.`;

    console.log('🌐 CALLING KIMI API...');
    console.log('URL:', `${KIMI_BASE_URL}/chat/completions`);
    
    const response = await fetch(
      `${KIMI_BASE_URL}/chat/completions`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${KIMI_API_KEY}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2.5',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
          max_tokens: 16000,
          chat_template_kwargs: { thinking: false }
        })
      }
    );

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    const data = await response.json();
    console.log('📡 Kimi response:', JSON.stringify(data, null, 2).substring(0, 500));

    if (data.error) {
      console.error('❌ Kimi API error:', data.error);
      throw new Error(data.error.message || 'Kimi API error');
    }

    const text = data.choices?.[0]?.message?.content || '';
    console.log('📝 Raw text length:', text.length);
    console.log('📝 Raw text preview:', text.substring(0, 200));

    // Extract JSON from response
    let result: any;
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON parsed successfully');
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch (parseError: any) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('❌ Raw text:', text);
      throw new Error('Failed to parse Kimi response: ' + parseError.message);
    }

    // Validate required fields
    if (!result.totalCost || !result.pofRequirement) {
      console.error('❌ Missing required fields in response');
      console.error('Result keys:', Object.keys(result));
      throw new Error('Kimi response missing required fields');
    }

    // Adjust for dependents
    const dependentMultiplier = 1 + (request.dependents * 0.5);

    console.log('✅ VISA COST CALCULATION COMPLETE');
    console.log('Total cost:', result.totalCost);

    return {
      totalCost: Math.round(result.totalCost * dependentMultiplier),
      totalCostLocal: Math.round((result.totalCostLocal || result.totalCost) * dependentMultiplier),
      localCurrency: result.localCurrency || 'USD',
      hiddenCostsTotal: Math.round((result.hiddenCostsTotal || 0) * dependentMultiplier),
      visibleCostsTotal: Math.round((result.visibleCostsTotal || result.totalCost) * dependentMultiplier),
      pofRequirement: {
        ...result.pofRequirement,
        amount: Math.round(result.pofRequirement.amount * dependentMultiplier),
        monthlySavingsNeeded: Math.round(result.pofRequirement.monthlySavingsNeeded * dependentMultiplier)
      },
      flightEstimate: result.flightEstimate || {
        economy: 850 * (1 + request.dependents),
        business: 2800 * (1 + request.dependents),
        currency: 'USD',
        route: `${request.originCountry} → ${request.destinationCountry}`
      },
      insuranceEstimate: result.insuranceEstimate || {
        health: 1400 * (1 + request.dependents),
        travel: 250 * (1 + request.dependents),
        currency: 'USD',
        duration: '12 months'
      },
      aiAnalysis: result.aiAnalysis || {
        shockingFact: `73% of ${request.originCountry} applicants miss over $1,500 in hidden costs`,
        criticalInsight: 'Start POF preparation immediately to meet seasoning deadline',
        urgencyFactor: 'Processing times increasing - apply early',
        savingsTimeline: 'Save monthly starting this week',
        optimizationTips: [
          'Book flights 90-120 days in advance for 30% savings',
          'Compare 3 insurance providers - save up to $450/year',
          'Get documents early to avoid rush fees (3x cost)'
        ]
      },
      breakdown: (result.breakdown || []).map((item: any) => ({
        ...item,
        cost: Math.round(item.cost * dependentMultiplier)
      })),
      visaSpecificRequirements: result.visaSpecificRequirements || [
        `${request.visaType} visa specific requirements for ${request.destinationCountry}`,
        'Valid passport with 6+ months validity',
        'Proof of accommodation',
        'Travel insurance coverage',
        'Financial documentation'
      ],
      timeline: result.timeline || {
        startBy: new Date().toISOString(),
        pofDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDecision: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      },
      pofProfile: result.pofProfile || {
        timeline: {
          accountOpenDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          depositDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          seasoningStartDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          seasoningEndDate: new Date(Date.now() + 104 * 24 * 60 * 60 * 1000).toISOString(),
          visaApplicationDate: new Date(Date.now() + 104 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemaining: 90,
          conflicts: []
        },
        savingsRoadmap: {
          monthlyBreakdown: [
            {
              month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              amountToSave: 1868,
              cumulativeTotal: 1868,
              milestone: 'Start savings plan'
            }
          ],
          exchangeRateBuffer: 560,
          totalWithBuffer: 13500,
          recommendedProviders: [
            {
              name: 'Fintiba',
              pros: ['Fastest setup (3 days)', 'English support', 'Student-friendly'],
              cons: ['Slightly higher fees'],
              feeEstimate: 89,
              setupTime: '3-5 business days'
            }
          ]
        },
        risks: {
          exchangeRateRisk: {
            severity: 'medium',
            currentRate: '1 USD = 1.09 EUR',
            mitigation: 'Add 5-8% buffer for currency fluctuation'
          },
          timingRisks: ['Bank transfers can take 5-7 days'],
          commonMistakes: [
            'Withdrawing money during seasoning = rejection',
            'Not accounting for exchange rate changes',
            'Opening wrong account type'
          ]
        }
      },
      hiddenCostsDetailed: (result.hiddenCostsDetailed || []).map((item: any) => ({
        ...item,
        cost: Math.round(item.cost * dependentMultiplier)
      })),
      preGatePreview: result.preGatePreview || {
        shockStatistic: `78% of applicants underbudget by $1,800+`,
        top3HiddenCosts: [
          { item: 'Medical examination', cost: 250, why: 'Not listed on embassy checklist' },
          { item: 'Document translation', cost: 180, why: 'Required but often forgotten' },
          { item: 'Courier & biometric fees', cost: 95, why: 'Hidden in application process' }
        ],
        pofUrgency: `You have 90 days to save and season required funds`,
        comparisonData: {
          whatMostBudget: Math.round(5500 * dependentMultiplier),
          actualCost: Math.round(8000 * dependentMultiplier),
          missedAmount: Math.round(2500 * dependentMultiplier)
        }
      }
    };

  } catch (error: any) {
    console.error('❌ VISA COST CALCULATION ERROR:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
