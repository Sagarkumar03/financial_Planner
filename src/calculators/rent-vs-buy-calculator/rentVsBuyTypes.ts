// Rent vs Buy Calculator Types

export interface RentVsBuyInputs {
  // Primary inputs
  propertyPrice: number;
  downPaymentPercent: number;
  loanInterestRate: number;
  loanTenure: number;
  monthlyMaintenance: number;
  propertyAppreciationRate: number;
  monthlyRent: number;
  annualRentHike: number;
  sipReturn: number;
  
  // Advanced inputs
  inflationRate: number;
  securityDepositMonths: number;
  transactionCostPercent: number;
  maintenanceIncreasePercent: number;
}

export interface RentVsBuyResult {
  // Final verdict
  winner: 'buying' | 'renting';
  advantageAmount: number;
  
  // Financial outcomes
  finalPropertyValue: number;
  finalRenterWealth: number;
  totalRentPaid: number;
  
  // Key metrics
  breakEvenYear: number | null;
  monthlyEMI: number;
  totalUpfrontBuying: number;
  totalUpfrontRenting: number;
  
  // Inflation-adjusted values
  inflationAdjustedAdvantage: number;
  inflationAdjustedPropertyValue: number;
  inflationAdjustedRenterWealth: number;
  
  // Additional insights
  totalInterestPaid: number;
  initialRenterAdvantage: number;
  yearlyBreakdown?: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  cumulativeRentPaid: number;
  propertyValue: number;
  renterSIPBalance: number;
  
  // Inflation-adjusted values (purchasing power in today's money)
  inflationAdjustedBuyerNetWorth: number;
  inflationAdjustedRenterNetWorth: number;
  inflationAdjustedAdvantage: number;
}

export interface RentVsBuyAssumptions {
  currentYear: number;
  currentMonth: number;
}