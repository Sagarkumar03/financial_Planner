"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { FireCalculator } from "@/calculators/fire/fireCalculator";
import { 
  INPUT_LIMITS,
  handleIntegerInput,
  handleDecimalInput,
  parseAndClampInteger,
  parseAndClampDecimal
} from "@/lib/inputValidation";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { CalculatorDisclaimer, CalculatorFAQ, MoreCalculators } from "@/components/calculator/SharedCalculatorComponents";
import { FIRE_CONTENT } from "@/lib/calculatorContent";
import { Section } from "@/components/ui/EnhancedLayouts";
import { 
  FinancialMetric, 
  FinancialDivider,
  HighlightedMetric,
  formatCurrency
} from "@/components/ui/FinancialDisplay";
import { 
  MobileFormInput, 
  MobileToggle
} from "@/components/ui/MobileOptimizedInputs";

const calculator = new FireCalculator();

// Code splitting: Lazy load advanced inputs (only when needed)
const AdvancedFireInputs = dynamic(() => import("./AdvancedFireInputs"), {
  loading: () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="animate-pulse">
        <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
              <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false, // Advanced inputs don't need SSR
});

// Precomputed result for default input values (instant page load)
// Calculated with: Age 30→45, ₹10L expenses, ₹50L existing corpus, ₹30k monthly SIP, 12% returns, 3.3% SWR
// MAINTENANCE: If you add new input parameters that affect calculations:
// 1. Update the calculation script and recalculate these values
// 2. Ensure new parameters use their INPUT_LIMITS defaults in calculation
// 3. Update isUsingDefaults check above to include new parameter
const DEFAULT_FIRE_RESULT = {
  freedomNumber: 72615713, // ₹7.26 Cr needed for FIRE
  projectedCorpus: 53419377, // ₹5.34 Cr projected with current plan (₹2.6Cr SIP + ₹2.74Cr existing corpus growth)
  shortfall: 19196336, // ₹1.92 Cr shortfall (negative = surplus)
  isOnTrack: false, // Not on track with default inputs
  actualRetirementAge: 62, // Will reach FIRE at age 62 (17 years after target)
  actualRetirementDate: "March 2058", // Will reach FIRE in March 2058
  progressPercentage: 73.6, // 73.6% progress towards FIRE goal
  yearlyBreakdown: [], // Will be computed on demand
  extraMonthlyRequired: 22106 // ₹22,106 extra monthly needed to retire by target age
};

export default function FireCalculatorClient() {
  // Primary inputs
  const [currentAge, setCurrentAge] = useState<string>(INPUT_LIMITS.currentAge.default);
  const [targetRetirementAge, setTargetRetirementAge] = useState<string>(INPUT_LIMITS.targetRetirementAge.default);
  const [currentAnnualExpenses, setCurrentAnnualExpenses] = useState<string>(INPUT_LIMITS.currentAnnualExpenses.default);
  const [existingRetirementCorpus, setExistingRetirementCorpus] = useState<string>(INPUT_LIMITS.existingRetirementCorpus.default);
  const [monthlyFireSavings, setMonthlyFireSavings] = useState<string>(INPUT_LIMITS.monthlyFireSavings.default);

  // Advanced inputs
  const [annualSavingsIncrease, setAnnualSavingsIncrease] = useState(INPUT_LIMITS.annualIncrement.default.toString());
  const [postRetirementExpense, setPostRetirementExpense] = useState(INPUT_LIMITS.postRetirementExpense.default.toString());
  const [inflationRate, setInflationRate] = useState(INPUT_LIMITS.inflationRate.default.toString());
  const [preRetirementReturns, setPreRetirementReturns] = useState(INPUT_LIMITS.preRetirementReturns.default.toString());
  const [postRetirementReturns, setPostRetirementReturns] = useState(INPUT_LIMITS.postRetirementReturns.default.toString());
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(INPUT_LIMITS.safeWithdrawalRate.default.toString());
  const [lifeExpectancy, setLifeExpectancy] = useState(INPUT_LIMITS.lifeExpectancy.default.toString());

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFreedomBreakdown, setShowFreedomBreakdown] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [debouncedInputsVersion, setDebouncedInputsVersion] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Debounce calculations to improve performance
  useEffect(() => {
    if (!isHydrated) return;
    
    const timer = setTimeout(() => {
      setDebouncedInputsVersion(prev => prev + 1);
      setIsCalculating(false);
    }, 250); // 250ms debounce for optimal UX

    setIsCalculating(true);
    return () => clearTimeout(timer);
  }, [
    currentAge, targetRetirementAge, currentAnnualExpenses, existingRetirementCorpus,
    monthlyFireSavings, annualSavingsIncrease, postRetirementExpense, inflationRate,
    preRetirementReturns, postRetirementReturns, safeWithdrawalRate, lifeExpectancy,
    isHydrated
  ]);

  // Auto-update target retirement age when current age changes
  useEffect(() => {
    if (!isHydrated) return; // Don't run on server or initial load
    
    const currentAgeNum = parseInt(currentAge) || INPUT_LIMITS.currentAge.min;
    const targetAgeNum = parseInt(targetRetirementAge) || 0;
    const minRequiredAge = currentAgeNum + 1;
    
    // If target retirement age is not greater than current age, update it
    if (targetAgeNum <= currentAgeNum) {
      const newTargetAge = Math.min(minRequiredAge, INPUT_LIMITS.targetRetirementAge.max);
      setTargetRetirementAge(newTargetAge.toString());
    }
  }, [currentAge, isHydrated]);

  // Parse and clamp all inputs
  const parsedInputs = {
    currentAge: parseAndClampInteger(currentAge, INPUT_LIMITS.currentAge),
    targetRetirementAge: parseAndClampInteger(targetRetirementAge, INPUT_LIMITS.targetRetirementAge),
    currentAnnualExpenses: parseAndClampInteger(currentAnnualExpenses, INPUT_LIMITS.currentAnnualExpenses),
    existingRetirementCorpus: parseAndClampInteger(existingRetirementCorpus || "0", INPUT_LIMITS.existingRetirementCorpus),
    monthlyFireSavings: parseAndClampInteger(monthlyFireSavings, INPUT_LIMITS.monthlyFireSavings),
    annualSavingsIncrease: parseAndClampDecimal(annualSavingsIncrease, INPUT_LIMITS.annualIncrement),
    postRetirementExpense: parseAndClampDecimal(postRetirementExpense, INPUT_LIMITS.postRetirementExpense),
    inflationRate: parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate),
    preRetirementReturns: parseAndClampDecimal(preRetirementReturns, INPUT_LIMITS.preRetirementReturns),
    postRetirementReturns: parseAndClampDecimal(postRetirementReturns, INPUT_LIMITS.postRetirementReturns),
    safeWithdrawalRate: parseAndClampDecimal(safeWithdrawalRate, INPUT_LIMITS.safeWithdrawalRate),
    lifeExpectancy: parseAndClampInteger(lifeExpectancy, INPUT_LIMITS.lifeExpectancy),
  };

  const assumptions = useMemo(() => ({
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
  }), []);

  // Smart calculation with precomputed defaults for instant page load
  const result = useMemo(() => {
    if (!isHydrated) {
      // Return precomputed default result for SSR/initial load (instant rendering)
      return DEFAULT_FIRE_RESULT;
    }

    // Check if current inputs match default values (avoid unnecessary calculation)
    // IMPORTANT: When adding new input parameters, ensure they are:
    // 1. Added to this isUsingDefaults check with their INPUT_LIMITS.newParam.default
    // 2. Included in the useMemo dependency array below
    // 3. DEFAULT_FIRE_RESULT is recalculated with the new parameter's default value
    const isUsingDefaults = (
      currentAge === INPUT_LIMITS.currentAge.default &&
      targetRetirementAge === INPUT_LIMITS.targetRetirementAge.default &&
      currentAnnualExpenses === INPUT_LIMITS.currentAnnualExpenses.default &&
      existingRetirementCorpus === INPUT_LIMITS.existingRetirementCorpus.default &&
      monthlyFireSavings === INPUT_LIMITS.monthlyFireSavings.default &&
      annualSavingsIncrease === INPUT_LIMITS.annualIncrement.default.toString() &&
      postRetirementExpense === INPUT_LIMITS.postRetirementExpense.default.toString() &&
      inflationRate === INPUT_LIMITS.inflationRate.default.toString() &&
      preRetirementReturns === INPUT_LIMITS.preRetirementReturns.default.toString() &&
      postRetirementReturns === INPUT_LIMITS.postRetirementReturns.default.toString() &&
      safeWithdrawalRate === INPUT_LIMITS.safeWithdrawalRate.default.toString() &&
      lifeExpectancy === INPUT_LIMITS.lifeExpectancy.default.toString()
      // ADD NEW INPUT PARAMETERS HERE: && newParam === INPUT_LIMITS.newParam.default.toString()
    );

    // Use precomputed result for default values (instant response)
    if (isUsingDefaults) {
      return DEFAULT_FIRE_RESULT;
    }

    // Only compute when inputs have changed from defaults
    return calculator.calculate(parsedInputs, assumptions);
  }, [
    debouncedInputsVersion, // Key dependency: only recalculate when debounced
    assumptions,
    isHydrated,
    // Include all input dependencies for default checking
    // MAINTENANCE NOTE: When adding new input parameters, add them here too
    currentAge, targetRetirementAge, currentAnnualExpenses, 
    existingRetirementCorpus, monthlyFireSavings, annualSavingsIncrease,
    postRetirementExpense, inflationRate, preRetirementReturns,
    postRetirementReturns, safeWithdrawalRate, lifeExpectancy
    // ADD NEW INPUT DEPENDENCIES HERE: , newInputParam
  ]);

  // Memoize expensive formatting operations
  const formattedRetirementExpenses = useMemo(() => {
    return formatCurrency(
      Math.round(
        parsedInputs.currentAnnualExpenses * 
        Math.pow(1 + parsedInputs.inflationRate / 100, parsedInputs.targetRetirementAge - parsedInputs.currentAge) *
        (parsedInputs.postRetirementExpense / 100)
      )
    );
  }, [parsedInputs.currentAnnualExpenses, parsedInputs.inflationRate, parsedInputs.targetRetirementAge, parsedInputs.currentAge, parsedInputs.postRetirementExpense]);

  // Input handlers for primary inputs (memoized for performance)
  const handleCurrentAgeChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setCurrentAge(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, INPUT_LIMITS.currentAge.max);
          setCurrentAge(clampedValue.toString());
        } else {
          setCurrentAge(validInput);
        }
      }
    }
  }, []);

  const handleCurrentAgeBlur = useCallback(() => {
    const value = parseInt(currentAge);
    if (isNaN(value)) {
      setCurrentAge(INPUT_LIMITS.currentAge.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.currentAge.max) setCurrentAge(INPUT_LIMITS.currentAge.max.toString());
    if (value < INPUT_LIMITS.currentAge.min) setCurrentAge(INPUT_LIMITS.currentAge.min.toString());
  }, [currentAge]);

  const handleTargetRetirementAgeChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setTargetRetirementAge(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, "greater than current age" on blur
          const clampedValue = Math.min(numValue, INPUT_LIMITS.targetRetirementAge.max);
          setTargetRetirementAge(clampedValue.toString());
        } else {
          setTargetRetirementAge(validInput);
        }
      }
    }
  }, []);

  const handleTargetRetirementAgeBlur = useCallback(() => {
    const value = parseInt(targetRetirementAge);
    const minAge = Math.max(INPUT_LIMITS.targetRetirementAge.min, parsedInputs.currentAge + 1);
    if (isNaN(value)) {
      setTargetRetirementAge(Math.max(minAge, parseInt(INPUT_LIMITS.targetRetirementAge.default)).toString());
      return;
    }
    if (value > INPUT_LIMITS.targetRetirementAge.max) setTargetRetirementAge(INPUT_LIMITS.targetRetirementAge.max.toString());
    if (value < minAge) setTargetRetirementAge(minAge.toString());
  }, [targetRetirementAge, parsedInputs.currentAge]);

  const handleCurrentAnnualExpensesChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setCurrentAnnualExpenses(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, INPUT_LIMITS.currentAnnualExpenses.max);
          setCurrentAnnualExpenses(clampedValue.toString());
        } else {
          setCurrentAnnualExpenses(validInput);
        }
      }
    }
  }, [currentAnnualExpenses]);

  const handleCurrentAnnualExpensesBlur = useCallback(() => {
    const value = parseInt(currentAnnualExpenses);
    if (isNaN(value)) {
      setCurrentAnnualExpenses(INPUT_LIMITS.currentAnnualExpenses.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.currentAnnualExpenses.max) setCurrentAnnualExpenses(INPUT_LIMITS.currentAnnualExpenses.max.toString());
    if (value < INPUT_LIMITS.currentAnnualExpenses.min) setCurrentAnnualExpenses(INPUT_LIMITS.currentAnnualExpenses.min.toString());
  }, [currentAnnualExpenses]);

  const handleExistingRetirementCorpusChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setExistingRetirementCorpus(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, INPUT_LIMITS.existingRetirementCorpus.max);
          setExistingRetirementCorpus(clampedValue.toString());
        } else {
          setExistingRetirementCorpus(validInput);
        }
      }
    }
  }, [existingRetirementCorpus]);

  const handleExistingRetirementCorpusBlur = useCallback(() => {
    const value = parseInt(existingRetirementCorpus || "0");
    if (isNaN(value)) {
      setExistingRetirementCorpus("");
      return;
    }
    if (value > INPUT_LIMITS.existingRetirementCorpus.max) setExistingRetirementCorpus(INPUT_LIMITS.existingRetirementCorpus.max.toString());
    if (value < INPUT_LIMITS.existingRetirementCorpus.min) setExistingRetirementCorpus("");
  }, [existingRetirementCorpus]);

  const handleMonthlyFireSavingsChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setMonthlyFireSavings(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, INPUT_LIMITS.monthlyFireSavings.max);
          setMonthlyFireSavings(clampedValue.toString());
        } else {
          setMonthlyFireSavings(validInput);
        }
      }
    }
  }, [monthlyFireSavings]);

  const handleMonthlyFireSavingsBlur = useCallback(() => {
    const value = parseInt(monthlyFireSavings);
    if (isNaN(value)) {
      setMonthlyFireSavings(INPUT_LIMITS.monthlyFireSavings.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.monthlyFireSavings.max) setMonthlyFireSavings(INPUT_LIMITS.monthlyFireSavings.max.toString());
    if (value < INPUT_LIMITS.monthlyFireSavings.min) setMonthlyFireSavings(INPUT_LIMITS.monthlyFireSavings.min.toString());
  }, [monthlyFireSavings]);

  if (!isHydrated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <CalculatorLayout
      title="Financial Independence (FIRE) Calculator with Inflation-Adjusted Returns"
      description="Calculate your path to Financial Independence with realistic projections including inflation and step-up savings"
      breadcrumbLabel="FIRE Calculator"
      breadcrumbHref="/fire-calculator"
    >
      {/* Primary Inputs Section */}
      <Section background="default" padding="lg">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Plan Your Financial Independence
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your details to calculate when you can achieve FIRE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MobileFormInput
              label="Current Age"
              value={currentAge}
              onChange={handleCurrentAgeChange}
              onBlur={handleCurrentAgeBlur}
              type="number"
              placeholder="30"
              helperText="Your current age in years"
            />

            <MobileFormInput
              label="Target Retirement Age"
              value={targetRetirementAge}
              onChange={handleTargetRetirementAgeChange}
              onBlur={handleTargetRetirementAgeBlur}
              type="number"
              placeholder="45"
              helperText={`Must be greater than ${parsedInputs.currentAge}`}
            />
          </div>

          <MobileFormInput
            label="Current Annual Expenses"
            value={currentAnnualExpenses}
            onChange={handleCurrentAnnualExpensesChange}
            onBlur={handleCurrentAnnualExpensesBlur}
            type="currency"
            placeholder="100000"
            helperText="Your current yearly living expenses"
          />

          <MobileFormInput
            label="Existing Retirement Corpus"
            value={existingRetirementCorpus}
            onChange={handleExistingRetirementCorpusChange}
            onBlur={handleExistingRetirementCorpusBlur}
            type="currency"
            placeholder="0"
            helperText="Current retirement savings (optional)"
          />

          <MobileFormInput
            label="Monthly FIRE Savings"
            value={monthlyFireSavings}
            onChange={handleMonthlyFireSavingsChange}
            onBlur={handleMonthlyFireSavingsBlur}
            type="currency"
            placeholder="10000"
            helperText="Monthly amount you can save for FIRE"
          />

          {/* Advanced Options Toggle */}
          <MobileToggle
            id="show-advanced-fire"
            checked={showAdvanced}
            onChange={setShowAdvanced}
            label="Show Advanced Options"
            description="Customize assumptions for more accurate calculations"
          />

          {/* Advanced Inputs - Code Split Component */}
          {showAdvanced && (
            <Suspense fallback={
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/3"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
                        <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <AdvancedFireInputs
                annualSavingsIncrease={annualSavingsIncrease}
                postRetirementExpense={postRetirementExpense}
                inflationRate={inflationRate}
                preRetirementReturns={preRetirementReturns}
                postRetirementReturns={postRetirementReturns}
                safeWithdrawalRate={safeWithdrawalRate}
                lifeExpectancy={lifeExpectancy}
                setAnnualSavingsIncrease={setAnnualSavingsIncrease}
                setPostRetirementExpense={setPostRetirementExpense}
                setInflationRate={setInflationRate}
                setPreRetirementReturns={setPreRetirementReturns}
                setPostRetirementReturns={setPostRetirementReturns}
                setSafeWithdrawalRate={setSafeWithdrawalRate}
                setLifeExpectancy={setLifeExpectancy}
              />
            </Suspense>
          )}
        </div>
      </Section>

      {/* Results Section */}
      <Section background="gradient" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your FIRE Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Based on your inputs, here's your path to Financial Independence
            </p>
          </div>

          {/* Loading Indicator for Optimization */}
          {isCalculating && (
            <div className="flex flex-col items-center justify-center py-12 mb-8" aria-live="polite">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" role="status" aria-label="Calculating FIRE projection"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Calculating your FIRE projection...
              </p>
            </div>
          )}

          {/* Results Content - Only show when not calculating */}
          {!isCalculating && (
          <>
          {/* Financial Overview - Full Width on Desktop */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-blue-500">💰</span>
                Financial Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Custom Freedom Number Card with Expandable Breakdown */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800/30 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm">🎯</span>
                    <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Freedom Number
                    </div>
                    <button
                      onClick={() => setShowFreedomBreakdown(!showFreedomBreakdown)}
                      className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1"
                      aria-expanded={showFreedomBreakdown}
                      aria-label={showFreedomBreakdown ? "Hide Freedom Number calculation breakdown" : "Show Freedom Number calculation breakdown"}
                    >
                      {showFreedomBreakdown ? "Hide" : "How?"} 
                      <span className={`transform transition-transform duration-200 ${showFreedomBreakdown ? "rotate-180" : ""}`}>▼</span>
                    </button>
                  </div>
                  
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 text-right tracking-tight">
                    <span aria-label={`Freedom Number: ${formatCurrency(result.freedomNumber)} rupees`}>
                      ₹ {formatCurrency(result.freedomNumber)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-2">
                    Total corpus needed at retirement
                  </div>

                  {/* Expandable Breakdown */}
                  <div className={`transition-all duration-300 ease-in-out ${
                    showFreedomBreakdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                      <div className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                        📊 Calculation Breakdown
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 mb-1">
                            First Retirement Year expenses adjusted to inflation
                          </div>
                          <div className="font-medium text-gray-800 dark:text-gray-200 text-right">
                            ₹{formattedRetirementExpenses}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Safe Withdrawal Rate:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {parsedInputs.safeWithdrawalRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-emerald-200 dark:border-emerald-700">
                          <span className="text-gray-600 dark:text-gray-300">Formula:</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200 text-right">
                            Expenses ÷ {parsedInputs.safeWithdrawalRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <FinancialMetric
                  label="Projected Corpus"
                  amount={result.projectedCorpus}
                  description="What you'll have with current plan"
                />

                <FinancialMetric
                  label={result.isOnTrack ? "Surplus" : "Shortfall"}
                  amount={Math.abs(result.shortfall)}
                  description={result.isOnTrack ? "Extra amount you'll have" : "Amount you'll be short"}
                  color={result.isOnTrack ? "success" : "warning"}
                  className={result.isOnTrack ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                />
              </div>
            </div>
          </div>

          {/* Progress Tracker - Full Width */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-green-500">📈</span>
                Progress Tracker  
              </h3>
              
              <div className="max-w-md mx-auto">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Progress to Goal
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1 text-right tracking-tight">
                  {result.progressPercentage.toFixed(1)}%
                </div>
                
                {/* What they'll achieve with current course */}
                <div className="text-xs mb-3">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    On current course of investment:
                  </div>
                  {result.isOnTrack ? (
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      Goal will be achieved! 🎉
                    </div>
                  ) : (
                    <div className="text-orange-600 dark:text-orange-400 font-medium">
                      Goal will not be reached by target age
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={Math.min(100, Math.max(0, result.progressPercentage))} aria-valuemin={0} aria-valuemax={100} aria-label={`FIRE goal progress: ${result.progressPercentage.toFixed(1)}%`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        result.progressPercentage >= 100 
                          ? "bg-green-500" 
                          : result.progressPercentage >= 75
                          ? "bg-blue-500"
                          : result.progressPercentage >= 50
                          ? "bg-yellow-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, result.progressPercentage))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Achievement Timeline */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">📅</span>
                Target Achievement Timeline
              </h3>
              
              <div className="max-w-md mx-auto">
                {result.actualRetirementDate ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {result.actualRetirementDate}
                      </div>
                      {result.actualRetirementAge && (
                        <>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            You'll reach your Freedom Number at age {result.actualRetirementAge}
                          </div>
                          {result.actualRetirementAge <= parsedInputs.targetRetirementAge ? (
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                              ✅ {result.actualRetirementAge === parsedInputs.targetRetirementAge 
                                ? "On track for your target retirement age!" 
                                : `${parsedInputs.targetRetirementAge - result.actualRetirementAge} year${parsedInputs.targetRetirementAge - result.actualRetirementAge === 1 ? '' : 's'} ahead of schedule! 🎉`}
                            </div>
                          ) : (
                            <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                              ⚠️ {result.actualRetirementAge - parsedInputs.targetRetirementAge} year{result.actualRetirementAge - parsedInputs.targetRetirementAge === 1 ? '' : 's'} after your target retirement
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                        Never Achievable
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Won&apos;t reach Freedom Number within lifetime
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                        🚀 Significantly increase monthly savings required
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Gap Analysis */}
          {!result.isOnTrack && result.extraMonthlyRequired > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 sm:p-6 border border-orange-200 dark:border-orange-800 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-orange-500">💡</span>
                How to Get On Track
              </h3>
              
              {/* Focus on the key action needed */}
              <div className="flex justify-center">
                <FinancialMetric
                  label={`Extra SIP needed to retire by age ${parsedInputs.targetRetirementAge}`}
                  amount={result.extraMonthlyRequired}
                  description="Additional monthly investment required"
                  size="lg"
                  color="warning"
                  weight="bold"
                  className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 max-w-sm"
                />
              </div>
            </div>
          )}

          {/* Assumptions Used */}
          {!showAdvanced && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📊 Key Assumptions Used in Calculation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>• Annual Savings Step-up: {parsedInputs.annualSavingsIncrease}%</div>
                <div>• Inflation Rate: {parsedInputs.inflationRate}%</div>
                <div>• Pre-Retirement Returns: {parsedInputs.preRetirementReturns}%</div>
                <div>• Post-Retirement Returns: {parsedInputs.postRetirementReturns}%</div>
                <div>• Safe Withdrawal Rate: {parsedInputs.safeWithdrawalRate}%</div>
                <div>• Multiplier Factor: {(100 / parsedInputs.safeWithdrawalRate).toFixed(2)}x</div>
                <div>• Post-Retirement Expenses: {parsedInputs.postRetirementExpense}%</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                💡 Click "Show Advanced Options" above to customize these assumptions
              </p>
            </div>
          )}
          </>
          )}
        </div>
      </Section>

      <CalculatorDisclaimer additionalText="This FIRE (Financial Independence, Retire Early) calculator provides estimates for educational purposes only and should not be considered as financial advice. FIRE planning involves significant long-term risks: (1) Projections spanning 15-30+ years are highly uncertain and subject to economic cycles, inflation volatility, and market crashes that can derail plans. (2) The Safe Withdrawal Rate (typically 3-4%) is based on historical data and may not hold during prolonged market downturns or high inflation periods. (3) Early retirees face sequence-of-returns risk - poor market performance in early retirement years can permanently damage portfolio sustainability. (4) Healthcare costs, emergencies, and lifestyle changes over decades are unpredictable and can exceed planned expenses. (5) Life expectancy assumptions are critical - living significantly longer than expected can exhaust funds. (6) This calculator assumes constant growth rates and inflation, which rarely occur in reality. (7) Early retirement may limit access to employer benefits, social security, and other income sources. (8) Consider diversifying with other income streams, conservative withdrawal rates, and flexibility to return to work if needed. Please consult with a qualified financial advisor who specializes in FIRE planning before making major life decisions based on these projections." />
      <CalculatorFAQ specificFAQ={FIRE_CONTENT.faq} />
      <MoreCalculators currentPath="/fire-calculator" />
    </CalculatorLayout>
  );
}