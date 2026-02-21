export interface LumpsumInput {
  initialInvestment: number;
  annualReturnRate: number;
  investmentYears: number;
  adjustForInflation?: boolean;
}

export interface LumpsumResult {
  totalInvested: number;
  maturityValue: number;
  inflationAdjustedValue?: number;
}