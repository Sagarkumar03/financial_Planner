import { Calculator } from "../types";
import { StepUpSipInput, StepUpSipResult } from "./stepUpSipTypes";
import { IndiaSipAssumptions } from "../sip/assumptions";

export class StepUpSipCalculator
  implements Calculator<StepUpSipInput, StepUpSipResult, typeof IndiaSipAssumptions>
{
  calculate(input: StepUpSipInput, context?: typeof IndiaSipAssumptions): StepUpSipResult {
    const assumptions = context || IndiaSipAssumptions;

    const initialMonthlyInvestment = input.monthlyInvestment;
    const annualReturnRate = input.annualReturnRate / 100;
    const years = input.investmentYears;
    const annualIncrement = input.annualIncrement / 100;

    const monthlyRate = annualReturnRate / assumptions.compoundingPerYear;

    // Edge cases
    if (initialMonthlyInvestment <= 0 || years <= 0) {
      return {
        totalInvested: 0,
        maturityValue: 0,
        inflationAdjustedValue: input.adjustForInflation ? 0 : undefined,
      };
    }

    let totalInvested = 0;
    let maturityValue = 0;

    // Industry Standard Step-Up SIP Formula
    for (let t = 1; t <= years; t++) {
      // Step 1: Calculate SIP amount for year t
      const P_t = initialMonthlyInvestment * Math.pow(1 + annualIncrement, t - 1);
      
      // Step 2: Add to total invested
      totalInvested += P_t * 12;

      // Step 3: Calculate FV of this year's 12 payments at end of year
      let FV_year: number;
      
      if (monthlyRate === 0) {
        // If no returns, just sum the payments
        FV_year = P_t * 12;
      } else {
        // Annuity Due formula: P_t × [(1+m)^12 - 1]/m × (1+m)
        FV_year = P_t * (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate * (1 + monthlyRate);
      }

      // Step 4: Compound this year's result to final maturity
      const remainingYears = years - t;
      
      if (remainingYears > 0) {
        // Compound for remaining years: FV_year × (1+r)^(n-t)
        const FV_final = FV_year * Math.pow(1 + annualReturnRate, remainingYears);
        maturityValue += FV_final;
      } else {
        // Last year, no additional compounding needed
        maturityValue += FV_year;
      }
    }

    let inflationAdjustedValue: number | undefined;

    if (input.adjustForInflation) {
      const inflationRate = assumptions.inflationRate;
      inflationAdjustedValue =
        maturityValue / Math.pow(1 + inflationRate, years);
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