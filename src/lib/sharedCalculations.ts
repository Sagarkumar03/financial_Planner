/**
 * Shared mathematical calculations for financial calculators
 */

export interface StepUpSipCalculationInput {
  monthlyInvestment: number;
  annualReturnRate: number; // in percentage (e.g., 12 for 12%)
  investmentYears: number;
  annualIncrement: number; // in percentage (e.g., 10 for 10%)
}

export interface StepUpSipCalculationResult {
  totalInvested: number;
  maturityValue: number;
}

/**
 * Core Step-up SIP calculation logic - PURE calculation (no existing corpus)
 */
export function calculateStepUpSip(input: StepUpSipCalculationInput): StepUpSipCalculationResult {
  const P0 = input.monthlyInvestment;
  const annualRate = input.annualReturnRate;
  const totalYears = input.investmentYears;
  const stepUpPercent = input.annualIncrement;

  // Edge cases
  if (P0 <= 0 || totalYears <= 0) {
    return {
      totalInvested: 0,
      maturityValue: 0,
    };
  }

  let totalInvested = 0;
  let maturityValue = 0; // Pure Step-up SIP starts from 0
  let currentMonthlySIP = P0;
  const monthlyRate = annualRate / 100 / 12;

  for (let month = 1; month <= totalYears * 12; month++) {
    // 1. Add to total invested
    totalInvested += currentMonthlySIP;

    // 2. Add current SIP to maturity value
    maturityValue += currentMonthlySIP;

    // 3. Apply 1 month of interest to the entire bucket
    // This mimics the "Annuity Due" (investment at start of month)
    maturityValue *= (1 + monthlyRate);

    // 4. Every 12 months, increase the SIP amount
    if (month % 12 === 0) {
      currentMonthlySIP *= (1 + (stepUpPercent / 100));
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    maturityValue: Math.round(maturityValue),
  };
}

/**
 * Calculate existing corpus growth separately (compound interest)
 */
export function calculateExistingCorpusGrowth(
  existingCorpus: number, 
  annualReturnRate: number, 
  years: number
): number {
  if (existingCorpus <= 0 || years <= 0) {
    return existingCorpus;
  }
  
  return Math.round(existingCorpus * Math.pow(1 + annualReturnRate / 100, years));
}