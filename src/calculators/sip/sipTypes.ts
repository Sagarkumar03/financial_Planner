export interface SipInput {
  monthlyInvestment: number;      // ₹
  annualReturnRate: number;       // %
  investmentYears: number;        // years
  adjustForInflation?: boolean;
}

export interface SipResult {
  totalInvested: number;          // ₹
  maturityValue: number;          // ₹
  inflationAdjustedValue?: number;
}
