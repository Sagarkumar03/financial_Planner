import { Calculator } from "../types";
import { SipInput, SipResult } from "./sipTypes";
import { IndiaSipAssumptions } from "./assumptions";

export class SipCalculator
  implements Calculator<SipInput, SipResult, typeof IndiaSipAssumptions>
{
  calculate(input: SipInput, context?: typeof IndiaSipAssumptions): SipResult {
    const assumptions = context || IndiaSipAssumptions;

    const monthlyInvestment = input.monthlyInvestment;
    const annualReturnRate = input.annualReturnRate / 100;
    const years = input.investmentYears;

    const totalMonths = years * assumptions.compoundingPerYear;
    const monthlyRate = annualReturnRate / assumptions.compoundingPerYear;

    // Edge cases
    if (monthlyInvestment <= 0 || years <= 0) {
      return {
        totalInvested: 0,
        maturityValue: 0,
        inflationAdjustedValue: input.adjustForInflation ? 0 : undefined,
      };
    }

    let maturityValue: number;

    if (monthlyRate === 0) {
      maturityValue = monthlyInvestment * totalMonths;
    } else {
      maturityValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    const totalInvested = monthlyInvestment * totalMonths;

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
