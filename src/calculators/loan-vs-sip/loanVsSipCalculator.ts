import { Calculator } from "../types";
import { LoanVsSipInput, LoanVsSipResult } from "./loanVsSipTypes";
import { IndiaSipAssumptions } from "../sip/assumptions";
import { calculateStepUpSip } from "@/lib/sharedCalculations";
import { LumpsumCalculator } from "../lumpsum/lumpsumCalculator";

export class LoanVsSipCalculator
  implements Calculator<LoanVsSipInput, LoanVsSipResult, typeof IndiaSipAssumptions>
{
  private lumpsumCalculator = new LumpsumCalculator();

  calculate(input: LoanVsSipInput, context?: typeof IndiaSipAssumptions): LoanVsSipResult {
    // Calculate loan without prepayments (baseline)
    const originalLoan = this.calculateLoan({
      principal: input.outstandingPrincipal,
      annualRate: input.annualInterestRate,
      tenureMonths: input.remainingTenureMonths
    });

    // Calculate loan with prepayments
    const prepaymentSchedule = this.generatePrepaymentSchedule(input);
    const prepaidLoan = this.calculateLoanWithPrepayments({
      principal: input.outstandingPrincipal,
      annualRate: input.annualInterestRate,
      tenureMonths: input.remainingTenureMonths,
      prepayments: prepaymentSchedule
    });

    const interestSaved = originalLoan.totalInterest - prepaidLoan.totalInterest;

    // Calculate SIP/Investment portion
    const sipPortion = this.calculateSipPortion(input, context);

    // Calculate inflation adjusted values if requested
    let inflationAdjustedSipWealth: number | undefined;
    let inflationAdjustedBenefit: number | undefined;

    if (input.adjustForInflation) {
      const inflationFactor = Math.pow(1 + (input.inflationRate / 100), input.remainingTenureMonths / 12);
      inflationAdjustedSipWealth = sipPortion.maturityValue / inflationFactor;
      inflationAdjustedBenefit = (interestSaved + sipPortion.maturityValue) / inflationFactor;
    }

    return {
      originalTenureMonths: input.remainingTenureMonths,
      newTenureMonths: prepaidLoan.actualTenureMonths,
      interestSaved: Math.round(interestSaved),
      totalSipInvested: Math.round(sipPortion.totalInvested),
      futureSipWealth: Math.round(sipPortion.maturityValue),
      inflationAdjustedSipWealth: inflationAdjustedSipWealth ? Math.round(inflationAdjustedSipWealth) : undefined,
      totalFinancialBenefit: Math.round(interestSaved + sipPortion.maturityValue),
      inflationAdjustedBenefit: inflationAdjustedBenefit ? Math.round(inflationAdjustedBenefit) : undefined,
    };
  }

  private calculateLoan(input: { principal: number; annualRate: number; tenureMonths: number }) {
    const { principal, annualRate, tenureMonths } = input;
    const monthlyRate = annualRate / 100 / 12;
    
    // Calculate EMI using standard formula
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    return {
      emiAmount: emi,
      totalInterest,
      actualTenureMonths: tenureMonths
    };
  }

  private calculateLoanWithPrepayments(input: {
    principal: number;
    annualRate: number;
    tenureMonths: number;
    prepayments: Array<{ month: number; amount: number }>;
  }) {
    const { principal, annualRate, tenureMonths, prepayments } = input;
    const monthlyRate = annualRate / 100 / 12;
    
    // Calculate original EMI
    const originalEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    let outstandingPrincipal = principal;
    let totalInterest = 0;
    let month = 0;
    
    // Create prepayment lookup for efficiency
    const prepaymentMap = new Map(prepayments.map(p => [p.month, p.amount]));

    while (outstandingPrincipal > 1 && month < tenureMonths * 2) { // Safety limit
      month++;
      
      // Calculate interest for this month
      const monthlyInterest = outstandingPrincipal * monthlyRate;
      totalInterest += monthlyInterest;
      
      // Calculate principal portion of EMI
      const principalPortion = originalEmi - monthlyInterest;
      
      // Reduce outstanding principal by EMI principal portion
      outstandingPrincipal = Math.max(0, outstandingPrincipal - principalPortion);
      
      // Apply prepayment if scheduled for this month
      const prepaymentAmount = prepaymentMap.get(month) || 0;
      if (prepaymentAmount > 0) {
        outstandingPrincipal = Math.max(0, outstandingPrincipal - prepaymentAmount);
      }
      
      // Break if loan is fully paid
      if (outstandingPrincipal <= 1) break;
    }

    return {
      totalInterest,
      actualTenureMonths: month,
      emiAmount: originalEmi
    };
  }

  private generatePrepaymentSchedule(input: LoanVsSipInput): Array<{ month: number; amount: number }> {
    const prepaymentAmount = (input.surplusAmount * input.prepaymentPercentage) / 100;
    const schedule: Array<{ month: number; amount: number }> = [];

    if (input.isOnetime) {
      // One-time prepayment at month 1
      if (prepaymentAmount > 0) {
        schedule.push({ month: 1, amount: prepaymentAmount });
      }
    } else {
      // Monthly prepayments with step-up
      let currentPrepayment = prepaymentAmount;
      
      for (let month = 1; month <= input.remainingTenureMonths; month++) {
        if (currentPrepayment > 0) {
          schedule.push({ month, amount: currentPrepayment });
        }

        // Apply annual step-up every 12 months
        if (month % 12 === 0) {
          currentPrepayment *= (1 + input.annualStepUp / 100);
        }
      }
    }

    return schedule;
  }

  private calculateSipPortion(input: LoanVsSipInput, context?: typeof IndiaSipAssumptions) {
    const sipAmount = (input.surplusAmount * (100 - input.prepaymentPercentage)) / 100;
    
    if (sipAmount <= 0) {
      return { totalInvested: 0, maturityValue: 0 };
    }

    if (input.isOnetime) {
      // Use LumpsumCalculator for one-time investment
      const lumpsumResult = this.lumpsumCalculator.calculate({
        initialInvestment: sipAmount,
        annualReturnRate: input.expectedSipReturn,
        investmentYears: input.remainingTenureMonths / 12,
        adjustForInflation: false // We handle inflation at the parent level
      }, context);
      
      return {
        totalInvested: lumpsumResult.totalInvested,
        maturityValue: lumpsumResult.maturityValue
      };
    } else {
      // Use shared step-up SIP calculation for monthly investments
      return calculateStepUpSip({
        monthlyInvestment: sipAmount,
        annualReturnRate: input.expectedSipReturn,
        investmentYears: input.remainingTenureMonths / 12,
        annualIncrement: input.annualStepUp
      });
    }
  }
}