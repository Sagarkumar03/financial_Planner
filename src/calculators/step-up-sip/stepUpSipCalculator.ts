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

    // Calculate year by year with step-ups
    for (let year = 1; year <= years; year++) {
      // Calculate SIP amount for this year (with annual increment)
      const yearlyInvestmentAmount = initialMonthlyInvestment * Math.pow(1 + annualIncrement, year - 1);
      
      // Calculate total investment for this year
      const yearlyInvestment = yearlyInvestmentAmount * 12;
      totalInvested += yearlyInvestment;

      // Calculate future value of this year's SIPs
      const remainingYears = years - year + 1;
      const totalMonthsForThisYear = remainingYears * 12;
      
      let yearMaturityValue: number;
      
      if (monthlyRate === 0) {
        yearMaturityValue = yearlyInvestmentAmount * 12 * remainingYears;
      } else {
        // Calculate FV for each month's investment in this year
        let yearTotal = 0;
        for (let month = 1; month <= 12; month++) {
          const monthsToMaturity = (remainingYears - 1) * 12 + (12 - month + 1);
          yearTotal += yearlyInvestmentAmount * Math.pow(1 + monthlyRate, monthsToMaturity);
        }
        yearMaturityValue = yearTotal;
      }
      
      maturityValue += yearMaturityValue;
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