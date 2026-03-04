export interface FireInput {
  currentAge: number;                    // years
  targetRetirementAge: number;           // years
  currentAnnualExpenses: number;         // ₹
  existingRetirementCorpus: number;      // ₹
  monthlyFireSavings: number;            // ₹
  annualSavingsIncrease: number;         // % (step-up)
  postRetirementExpense: number;         // % of current expenses
  inflationRate: number;                 // %
  preRetirementReturns: number;          // %
  postRetirementReturns: number;         // %
  safeWithdrawalRate: number;            // %
  lifeExpectancy: number;                // years
}

export interface FireResult {
  freedomNumber: number;                 // ₹ - Total amount needed at retirement
  projectedCorpus: number;               // ₹ - What they'll actually have with current plan
  shortfall: number;                     // ₹ - Gap (positive if short, negative if excess)
  isOnTrack: boolean;                    // Whether they can retire by target age
  actualRetirementAge: number | null;    // When they can actually retire (null if never)
  actualRetirementDate: string | null;   // Formatted date string
  extraMonthlyRequired: number;          // ₹ - Additional monthly savings needed to be on track
  progressPercentage: number;            // 0-100% progress towards goal
  yearlyBreakdown: YearlyBreakdown[];    // Year by year progression
}

export interface YearlyBreakdown {
  year: number;
  age: number;
  beginBalance: number;                  // ₹
  monthlySavings: number;                // ₹ (with step-up applied)
  annualSavings: number;                 // ₹
  investmentGrowth: number;              // ₹
  endBalance: number;                    // ₹
  inflationAdjustedExpenses: number;     // ₹ - What expenses will be that year
  freedomNumberRequired: number;         // ₹ - What FIRE number is needed that year
}

export interface FireAssumptions {
  currentYear: number;
  currentMonth: number;
}