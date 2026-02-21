import { Calculator } from "../types";
import { LumpsumInput, LumpsumResult } from "./lumpsumTypes";
import { IndiaSipAssumptions } from "../sip/assumptions";

export class LumpsumCalculator
  implements Calculator<LumpsumInput, LumpsumResult, typeof IndiaSipAssumptions>
{
  calculate(input: LumpsumInput, context?: typeof IndiaSipAssumptions): LumpsumResult {
    const assumptions = context || IndiaSipAssumptions;

    const P = input.initialInvestment;
    const annualRate = input.annualReturnRate; // Already in percentage (e.g., 12)
    const totalYears = input.investmentYears;

    // Edge cases
    if (P <= 0 || totalYears <= 0) {
      return {
        totalInvested: 0,
        maturityValue: 0,
        inflationAdjustedValue: input.adjustForInflation ? 0 : undefined,
      };
    }

    // Compound Interest Formula: A = P(1 + r/100)^t
    const maturityValue = P * Math.pow(1 + (annualRate / 100), totalYears);

    let inflationAdjustedValue: number | undefined;

    if (input.adjustForInflation) {
      const inflationRate = assumptions.inflationRate * 100; // Convert to percentage
      // Real Value (Inflation Adjusted)
      inflationAdjustedValue = maturityValue / Math.pow(1 + (inflationRate / 100), totalYears);
    }

    return {
      totalInvested: Math.round(P),
      maturityValue: Math.round(maturityValue),
      inflationAdjustedValue: inflationAdjustedValue
        ? Math.round(inflationAdjustedValue)
        : undefined,
    };
  }
}