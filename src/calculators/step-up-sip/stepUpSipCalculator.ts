import { Calculator } from "../types";
import { StepUpSipInput, StepUpSipResult } from "./stepUpSipTypes";
import { IndiaSipAssumptions } from "../sip/assumptions";
import { calculateStepUpSip } from "@/lib/sharedCalculations";

export class StepUpSipCalculator
  implements Calculator<StepUpSipInput, StepUpSipResult, typeof IndiaSipAssumptions>
{
  calculate(input: StepUpSipInput, context?: typeof IndiaSipAssumptions): StepUpSipResult {
    const assumptions = context || IndiaSipAssumptions;

    // Use shared calculation function (pure Step-up SIP)
    const result = calculateStepUpSip({
      monthlyInvestment: input.monthlyInvestment,
      annualReturnRate: input.annualReturnRate,
      investmentYears: input.investmentYears,
      annualIncrement: input.annualIncrement
    });

    let inflationAdjustedValue: number | undefined;

    if (input.adjustForInflation) {
      const inflationRate = assumptions.inflationRate * 100; // Convert to percentage
      // Final Real Value (Inflation Adjusted)
      inflationAdjustedValue = result.maturityValue / Math.pow(1 + (inflationRate / 100), input.investmentYears);
    }

    return {
      totalInvested: result.totalInvested,
      maturityValue: result.maturityValue,
      inflationAdjustedValue: inflationAdjustedValue
        ? Math.round(inflationAdjustedValue)
        : undefined,
    };
  }
}