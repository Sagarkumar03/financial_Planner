export interface LoanVsSipInput {
  // Loan Details
  outstandingPrincipal: number;    // ₹
  annualInterestRate: number;      // %
  remainingTenureMonths: number;   // months
  
  // Strategy Details
  isOnetime: boolean;              // true for lumpsum, false for monthly
  surplusAmount: number;           // ₹
  prepaymentPercentage: number;    // % (0-100), remainder goes to SIP
  
  // Advanced Settings (with defaults)
  expectedSipReturn: number;       // % (default 12%)
  annualStepUp: number;           // % (default 5%)
  inflationRate: number;          // % (default 6%)
  adjustForInflation?: boolean;
}

export interface LoanVsSipResult {
  // Loan Results
  originalTenureMonths: number;
  newTenureMonths: number;
  interestSaved: number;           // ₹
  
  // SIP/Investment Results
  totalSipInvested: number;        // ₹
  futureSipWealth: number;         // ₹
  inflationAdjustedSipWealth?: number; // ₹
  
  // Combined Results
  totalFinancialBenefit: number;   // interestSaved + futureSipWealth
  inflationAdjustedBenefit?: number; // Total benefit adjusted for inflation
}

export interface LoanCalculationInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
  prepayments?: PrepaymentSchedule[];
}

export interface PrepaymentSchedule {
  month: number;
  amount: number;
}

export interface LoanCalculationResult {
  totalInterest: number;
  actualTenureMonths: number;
  emiAmount: number;
}