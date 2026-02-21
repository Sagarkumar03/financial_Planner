import { Calculator } from "../types";
import { StepUpSipInput, StepUpSipResult } from "./stepUpSipTypes";
import { IndiaSipAssumptions } from "../sip/assumptions";

export class StepUpSipCalculator
  implements Calculator<StepUpSipInput, StepUpSipResult, typeof IndiaSipAssumptions>
{
  calculate(input: StepUpSipInput, context?: typeof IndiaSipAssumptions): StepUpSipResult {
    const assumptions = context || IndiaSipAssumptions;

    const P0 = input.monthlyInvestment;
    const annualRate = input.annualReturnRate; // Already in percentage (e.g., 12)
    const totalYears = input.investmentYears;
    const stepUpPercent = input.annualIncrement; // Already in percentage (e.g., 10)

    // Edge cases
    if (P0 <= 0 || totalYears <= 0) {
      return {
        totalInvested: 0,
        maturityValue: 0,
        inflationAdjustedValue: input.adjustForInflation ? 0 : undefined,
      };
    }

    let totalInvested = 0;
    let maturityValue = 0;
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

    let inflationAdjustedValue: number | undefined;

    if (input.adjustForInflation) {
      const inflationRate = assumptions.inflationRate * 100; // Convert to percentage
      // Final Real Value (Inflation Adjusted)
      inflationAdjustedValue = maturityValue / Math.pow(1 + (inflationRate / 100), totalYears);
    }

    return {
      totalInvested: Math.round(totalInvested),
      maturityValue: Math.round(maturityValue),
      inflationAdjustedValue: inflationAdjustedValue
        ? Math.round(inflationAdjustedValue)
        : undefined,
    };
  }
}