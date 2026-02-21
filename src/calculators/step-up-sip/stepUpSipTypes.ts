export interface StepUpSipInput {
  monthlyInvestment: number;      // ₹
  annualReturnRate: number;       // %
  investmentYears: number;        // years
  annualIncrement: number;        // % (0-40%)
  adjustForInflation?: boolean;
}

export interface StepUpSipResult {
  totalInvested: number;          // ₹
  maturityValue: number;          // ₹
  inflationAdjustedValue?: number;
}