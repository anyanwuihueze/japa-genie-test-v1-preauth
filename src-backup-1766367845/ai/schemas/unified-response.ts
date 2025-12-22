/**
 * Unified response schema - single AI call returns both chat + structured insights
 */

export interface UnifiedVisaResponse {
  // Natural chat response
  answer: string;
  
  // Structured insights (like mini-app)
  insights?: {
    // Key insights with headlines
    keyInsights: Array<{
      headline: string;
      detail: string;
      url?: string;
    }>;
    
    // Cost breakdown
    costEstimates: Array<{
      item: string;
      cost: number;
      currency: string;
      localCost?: string; // Converted to user's currency
    }>;
    
    // Visa alternatives
    visaAlternatives: Array<{
      visaName: string;
      description: string;
      pros: string[];
      cons: string[];
    }>;
    
    // Chart data for beautiful visualizations
    chartData?: {
      title: string;
      data: Array<{
        name: string;
        value: number;
        color?: string;
      }>;
      type: 'bar' | 'line' | 'pie';
    };
    
    // Action buttons (stay in-app)
    actions: Array<{
      label: string;
      action: 'document-checklist' | 'compare-visas' | 'timeline-view' | 'cost-breakdown';
      icon?: string;
    }>;
  };
}
