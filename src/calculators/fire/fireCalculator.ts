import { FireInput, FireResult, FireAssumptions, YearlyBreakdown } from './fireTypes';
import { calculateStepUpSip, calculateExistingCorpusGrowth } from '@/lib/sharedCalculations';

export class FireCalculator {
  calculate(input: FireInput, assumptions: FireAssumptions): FireResult {
    // Calculate inflation-adjusted annual expenses at retirement
    const yearsToRetirement = input.targetRetirementAge - input.currentAge;
    const inflationAdjustedExpenses = input.currentAnnualExpenses * 
      Math.pow(1 + input.inflationRate / 100, yearsToRetirement);
    
    // Apply post-retirement expense adjustment
    const retirementExpenses = inflationAdjustedExpenses * (input.postRetirementExpense / 100);
    
    // Calculate Freedom Number using Safe Withdrawal Rate with 2-decimal precision multiplier
    const multiplier = parseFloat((100 / input.safeWithdrawalRate).toFixed(2));
    const freedomNumber = Math.round(retirementExpenses * multiplier);
    
    // Calculate Step-up SIP separately (pure calculation)
    const stepUpResult = calculateStepUpSip({
      monthlyInvestment: input.monthlyFireSavings,
      annualReturnRate: input.preRetirementReturns,
      investmentYears: yearsToRetirement,
      annualIncrement: input.annualSavingsIncrease
    });
    
    // Calculate existing corpus growth separately  
    const existingCorpusAtRetirement = calculateExistingCorpusGrowth(
      input.existingRetirementCorpus,
      input.preRetirementReturns,
      yearsToRetirement
    );
    
    // Add them together for total projected corpus
    const projectedCorpus = stepUpResult.maturityValue + existingCorpusAtRetirement;
    
    // Project corpus growth for yearly breakdown
    const projection = this.projectCorpusGrowth(input, assumptions);
    
    // Calculate shortfall
    const shortfall = freedomNumber - projectedCorpus;
    const isOnTrack = shortfall <= 0;
    
    // Calculate actual retirement age and date
    const { actualRetirementAge, actualRetirementDate } = this.calculateActualRetirement(
      projection, freedomNumber, input, assumptions
    );
    
    // Calculate extra monthly savings needed to be on track
    const extraMonthlyRequired = this.calculateExtraMonthlyRequired(
      input, freedomNumber, assumptions
    );
    
    // Calculate progress percentage
    const progressPercentage = Math.min(100, Math.max(0, (projectedCorpus / freedomNumber) * 100));
    
    return {
      freedomNumber,
      projectedCorpus: Math.round(projectedCorpus),
      shortfall: Math.round(shortfall),
      isOnTrack,
      actualRetirementAge,
      actualRetirementDate,
      extraMonthlyRequired: Math.round(extraMonthlyRequired),
      progressPercentage: Math.round(progressPercentage * 100) / 100, // Round to 2 decimal places
      yearlyBreakdown: projection
    };
  }
  
  private projectCorpusGrowth(input: FireInput, assumptions: FireAssumptions): YearlyBreakdown[] {
    const breakdown: YearlyBreakdown[] = [];
    const maxProjectionYears = Math.min(50, input.lifeExpectancy - input.currentAge);
    
    // Generate yearly breakdown using the same calculation method as main calculation
    for (let year = 0; year <= maxProjectionYears; year++) {
      const currentAge = input.currentAge + year;
      const yearsFromStart = year;
      
      let totalCorpus = 0;
      let annualSavings = 0;
      
      if (yearsFromStart > 0) {
        // Calculate Step-up SIP for this number of years using shared calculation
        const stepUpResult = calculateStepUpSip({
          monthlyInvestment: input.monthlyFireSavings,
          annualReturnRate: input.preRetirementReturns,
          investmentYears: yearsFromStart,
          annualIncrement: input.annualSavingsIncrease
        });
        
        // Calculate existing corpus growth
        const existingCorpusGrowth = calculateExistingCorpusGrowth(
          input.existingRetirementCorpus,
          input.preRetirementReturns,
          yearsFromStart
        );
        
        totalCorpus = stepUpResult.maturityValue + existingCorpusGrowth;
        
        // Calculate current year's monthly savings (step-up applied)
        const currentMonthlySIP = input.monthlyFireSavings * Math.pow(1 + input.annualSavingsIncrease / 100, yearsFromStart - 1);
        annualSavings = currentMonthlySIP * 12;
      } else {
        // Year 0: just existing corpus
        totalCorpus = input.existingRetirementCorpus;
        annualSavings = 0;
      }
      
      // Calculate investment growth for this year
      const previousYearCorpus = year > 0 ? breakdown[year - 1].endBalance : input.existingRetirementCorpus;
      const investmentGrowth = totalCorpus - previousYearCorpus - annualSavings;
      
      // Calculate required values for this year
      const inflationAdjustedExpenses = input.currentAnnualExpenses * 
        Math.pow(1 + input.inflationRate / 100, yearsFromStart);
      const retirementExpenses = inflationAdjustedExpenses * (input.postRetirementExpense / 100);
      const multiplier = parseFloat((100 / input.safeWithdrawalRate).toFixed(2));
      const freedomNumberRequired = retirementExpenses * multiplier;
      
      breakdown.push({
        year: assumptions.currentYear + year,
        age: currentAge,
        beginBalance: Math.round(previousYearCorpus),
        monthlySavings: Math.round(yearsFromStart > 0 ? 
          input.monthlyFireSavings * Math.pow(1 + input.annualSavingsIncrease / 100, yearsFromStart - 1) : 
          input.monthlyFireSavings),
        annualSavings: Math.round(annualSavings),
        investmentGrowth: Math.round(investmentGrowth),
        endBalance: Math.round(totalCorpus),
        inflationAdjustedExpenses: Math.round(inflationAdjustedExpenses),
        freedomNumberRequired: Math.round(freedomNumberRequired)
      });
      
      // Stop investing after target retirement age, switch to post-retirement growth
      if (yearsFromStart >= (input.targetRetirementAge - input.currentAge)) {
        // Post-retirement: corpus grows at post-retirement returns, no new investments
        const postRetirementYears = yearsFromStart - (input.targetRetirementAge - input.currentAge);
        if (postRetirementYears > 0) {
          // Apply post-retirement growth to the corpus from target retirement age
          const corpusAtRetirement = year > 0 ? 
            breakdown.find(b => b.age === input.targetRetirementAge)?.endBalance || totalCorpus :
            totalCorpus;
          
          totalCorpus = corpusAtRetirement * Math.pow(1 + input.postRetirementReturns / 100, postRetirementYears);
          breakdown[breakdown.length - 1].endBalance = Math.round(totalCorpus);
          breakdown[breakdown.length - 1].investmentGrowth = Math.round(totalCorpus - previousYearCorpus);
        }
      }
    }
    
    return breakdown;
  }
  
  private calculateActualRetirement(
    projection: YearlyBreakdown[], 
    targetFreedomNumber: number, 
    input: FireInput,
    assumptions: FireAssumptions
  ): { actualRetirementAge: number | null; actualRetirementDate: string | null } {
    
    // Find the first year where corpus meets or exceeds the freedom number required for that year
    for (const yearData of projection) {
      if (yearData.endBalance >= yearData.freedomNumberRequired && yearData.age >= input.currentAge) {
        const retirementMonth = assumptions.currentMonth;
        const retirementYear = yearData.year;
        
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        return {
          actualRetirementAge: yearData.age,
          actualRetirementDate: `${monthNames[retirementMonth - 1]} ${retirementYear}`
        };
      }
    }
    
    // If no retirement possible within projection period
    return {
      actualRetirementAge: null,
      actualRetirementDate: null
    };
  }
  
  private calculateExtraMonthlyRequired(
    input: FireInput, 
    freedomNumber: number, 
    assumptions: FireAssumptions
  ): number {
    if (freedomNumber <= input.existingRetirementCorpus) {
      return 0; // Already have enough
    }
    
    const yearsToRetirement = input.targetRetirementAge - input.currentAge;
    if (yearsToRetirement <= 0) {
      return 0;
    }
    
    // Use binary search to find required monthly savings
    let low = 0;
    let high = 1000000; // 10 lakh max monthly savings
    let iterations = 0;
    const maxIterations = 50;
    
    while (low < high && iterations < maxIterations) {
      const mid = Math.floor((low + high) / 2);
      
      // Test this monthly savings amount
      const testInput = { ...input, monthlyFireSavings: mid };
      const testProjection = this.projectCorpusGrowth(testInput, assumptions);
      const targetYearProjection = testProjection.find(p => p.age === input.targetRetirementAge);
      const projectedCorpus = targetYearProjection ? targetYearProjection.endBalance : 0;
      
      if (projectedCorpus >= freedomNumber) {
        high = mid;
      } else {
        low = mid + 1;
      }
      
      iterations++;
    }
    
    const requiredMonthlySavings = low;
    return Math.max(0, requiredMonthlySavings - input.monthlyFireSavings);
  }
}