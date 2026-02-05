import { CostEstimate } from './types';

export function calculateTotalCost(estimates: Partial<CostEstimate>): CostEstimate {
  const defaults = {
    embassyFee: 0,
    documentAuthentication: 0,
    travelToEmbassy: 0,
    bankStatementCosts: 0,
    translationCosts: 0,
    medicalExam: 0,
    currency: 'USD'
  };
  
  const merged = { ...defaults, ...estimates };
  const total = merged.embassyFee + merged.documentAuthentication + 
                merged.travelToEmbassy + merged.bankStatementCosts + 
                merged.translationCosts + merged.medicalExam;
  
  return { ...merged, total };
}
