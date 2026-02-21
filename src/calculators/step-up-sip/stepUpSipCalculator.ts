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

    const monthlyRate = annualRate / 12 / 100; // e.g., 12% -> 0.01
    const yearlyGrowthRate = 1 + (annualRate / 100); // e.g., 1.12

    for (let t = 1; t <= totalYears; t++) {
      // 1. Current SIP amount for this year
      let currentMonthlySIP = P0 * Math.pow(1 + (stepUpPercent / 100), t - 1);
      
      // 2. Total invested this year
      totalInvested += currentMonthlySIP * 12;

      // 3. Future Value of this year's 12 installments at the END of this year
      let fvYearEnd: number;
      
      if (monthlyRate === 0) {
        // If no returns, just sum the payments
        fvYearEnd = currentMonthlySIP * 12;
      } else {
        // Formula: P * [((1+m)^12 - 1) / m] * (1+m)
        fvYearEnd = currentMonthlySIP * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) * (1 + monthlyRate);
      }

      // 4. Grow that year's total to the very end of the total tenure
      let yearsRemainingAfterThisYear = totalYears - t;
      maturityValue += fvYearEnd * Math.pow(yearlyGrowthRate, yearsRemainingAfterThisYear);
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