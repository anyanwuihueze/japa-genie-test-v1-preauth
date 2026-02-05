export interface CostEstimate {
  embassyFee: number;
  documentAuthentication: number;
  agentFee?: number;
  travelToEmbassy: number;
  bankStatementCosts: number;
  translationCosts: number;
  medicalExam: number;
  total: number;
  currency: string;
}

export interface UserBudget {
  userId: string;
  totalBudget: number;
  spentToDate: number;
  remaining: number;
  country: string;
  visaType: string;
}
