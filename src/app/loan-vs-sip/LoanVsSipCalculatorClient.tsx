"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { LoanVsSipCalculator } from "@/calculators/loan-vs-sip/loanVsSipCalculator";
import { IndiaSipAssumptions } from "@/calculators/sip/assumptions";
import { 
  INPUT_LIMITS,
  handleIntegerInput,
  handleDecimalInput,
  parseAndClampInteger,
  parseAndClampDecimal
} from "@/lib/inputValidation";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { CommonCalculatorInputs } from "@/components/calculator/CommonCalculatorInputs";
import { CalculatorDisclaimer, CalculatorFAQ, MoreCalculators } from "@/components/calculator/SharedCalculatorComponents";
import { LOAN_VS_SIP_CONTENT } from "@/lib/calculatorContent";
import { MobileFormInput, MobileToggle } from "@/components/ui/MobileOptimizedInputs";
import { InflationAwareResults } from "@/components/ui/InflationComponents";
import { 
  FinancialMetric, 
  FinancialDivider,
  HighlightedMetric,
  formatCurrency
} from "@/components/ui/FinancialDisplay";

const calculator = new LoanVsSipCalculator();

// Code splitting: Lazy load advanced inputs (only when needed)
const AdvancedLoanVsSipInputs = dynamic(() => import("./AdvancedLoanVsSipInputs"), {
  loading: () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="animate-pulse">
        <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded mb-4 w-1/3"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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

// Precomputed default results for instant page load (eliminates calculation delay)
const DEFAULT_LOAN_VS_SIP_RESULT = {
  originalTenureMonths: 120,
  newTenureMonths: 90,
  interestSaved: 663046,
  totalSipInvested: 1912491,
  futureSipWealth: 3374326,
  inflationAdjustedSipWealth: 1884206,
  totalFinancialBenefit: 4037372,
  inflationAdjustedBenefit: 2254448,
};

// Modular component for loan details
interface LoanDetailsCardProps {
  outstandingPrincipal: string;
  annualInterestRate: string;
  tenureMode: "months" | "years";
  tenureValue: string;
  onPrincipalChange: (value: string) => void;
  onInterestRateChange: (value: string) => void;
  onTenureModeChange: (mode: "months" | "years") => void;
  onTenureValueChange: (value: string) => void;
}

function LoanDetailsCard({
  outstandingPrincipal,
  annualInterestRate,
  tenureMode,
  tenureValue,
  onPrincipalChange,
  onInterestRateChange,
  onTenureModeChange,
  onTenureValueChange
}: LoanDetailsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="text-red-500 mr-2">🏠</span>
        Loan Details (The Liability)
      </h3>
      
      <div className="space-y-6">
        <MobileFormInput
          label="Outstanding Principal"
          value={outstandingPrincipal}
          onChange={onPrincipalChange}
          type="currency"
          unit="₹"
          placeholder="50,00,000"
          icon="💵"
          helperText="Remaining loan amount to be repaid"
        />

        <MobileFormInput
          label="Annual Interest Rate"
          value={annualInterestRate}
          onChange={onInterestRateChange}
          type="percentage"
          unit="%"
          placeholder="9.0"
          icon="📋"
          helperText="Current annual interest rate on your loan"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>⏰</span>
            Remaining Tenure
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onTenureModeChange("years")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                tenureMode === "years"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Years
            </button>
            <button
              type="button"
              onClick={() => onTenureModeChange("months")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                tenureMode === "months"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Months
            </button>
          </div>
        </div>
        <MobileFormInput
          label=""
          value={tenureValue}
          onChange={onTenureValueChange}
          type="number"
          unit={tenureMode === "years" ? "Years" : "Months"}
          placeholder={tenureMode === "years" ? "10" : "120"}
          helperText="Time left to complete loan repayment"
        />
      </div>
    </div>
  );
}

// Modular component for strategy settings
interface StrategyCardProps {
  isOnetime: boolean;
  surplusAmount: string;
  prepaymentPercentage: number;
  onOnetimeChange: (value: boolean) => void;
  onSurplusAmountChange: (value: string) => void;
  onPrepaymentPercentageChange: (value: number) => void;
  isHydrated: boolean;
}

function StrategyCard(props: StrategyCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="text-green-500 mr-2">💡</span>
        The Strategy (The Surplus)
      </h3>

      {/* Monthly vs One-time Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Investment Frequency
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => props.onOnetimeChange(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
              !props.isOnetime
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-2 border-transparent"
            }`}
          >
            <span className="font-bold">Monthly</span>
          </button>
          <button
            type="button"
            onClick={() => props.onOnetimeChange(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
              props.isOnetime
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-2 border-transparent"
            }`}
          >
            <span className="font-bold">Lumpsum</span>
          </button>
        </div>
      </div>

      <MobileFormInput
        label={props.isOnetime ? "One-time Surplus Amount" : "Monthly Surplus Amount"}
        value={props.surplusAmount}
        onChange={props.onSurplusAmountChange}
        type="currency"
        unit="₹"
        placeholder={props.isOnetime ? "5,00,000" : "20,000"}
        icon="💰"
        helperText={props.isOnetime ? "Available lumpsum for investment/prepayment" : "Extra amount available monthly"}
      />

      {/* Split Slider */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          The Split Strategy
        </label>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Invest {100 - props.prepaymentPercentage}%</span>
            <span>Prepay {props.prepaymentPercentage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={props.prepaymentPercentage}
            onChange={(e) => props.onPrepaymentPercentageChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label={`Split strategy: ${100 - props.prepaymentPercentage}% invest, ${props.prepaymentPercentage}% prepay`}
            aria-valuetext={`${100 - props.prepaymentPercentage} percent invest, ${props.prepaymentPercentage} percent prepay`}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
            <span>All to Investment</span>
            <span className="font-medium">50/50</span>
            <span>All to Prepayment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoanVsSipCalculatorClient() {
  // Loan Details
  const [outstandingPrincipal, setOutstandingPrincipal] = useState("5000000");
  const [annualInterestRate, setAnnualInterestRate] = useState("9");
  const [tenureMode, setTenureMode] = useState<"months" | "years">("years");
  const [tenureValue, setTenureValue] = useState("10");

  // Strategy Details
  const [isOnetime, setIsOnetime] = useState(false);
  const [surplusAmount, setSurplusAmount] = useState("20000");
  const [prepaymentPercentage, setPrepaymentPercentage] = useState(50);

  // Common calculator inputs (reuse from existing calculators)
  const [expectedSipReturn, setExpectedSipReturn] = useState("12");
  const [annualStepUp, setAnnualStepUp] = useState("10");
  const [inflationRate, setInflationRate] = useState("6");
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  
  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [debouncedInputsVersion, setDebouncedInputsVersion] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Debounced calculations for better performance
  useEffect(() => {
    if (!isHydrated) return;
    
    const timer = setTimeout(() => {
      setDebouncedInputsVersion(prev => prev + 1);
      setIsCalculating(false);
    }, 250); // 250ms debounce

    setIsCalculating(true);
    return () => clearTimeout(timer);
  }, [
    outstandingPrincipal,
    annualInterestRate,
    tenureMode,
    tenureValue,
    isOnetime,
    surplusAmount,
    prepaymentPercentage,
    expectedSipReturn,
    annualStepUp,
    inflationRate,
    adjustForInflation,
    isHydrated
  ]);

  // Update lumpsum default when outstanding principal changes (only in lumpsum mode)
  useEffect(() => {
    if (isOnetime) {
      const principal = parseAndClampInteger(outstandingPrincipal, INPUT_LIMITS.outstandingPrincipal);
      const lumpsumDefault = principal < 200000 ? Math.floor(principal / 2).toString() : "200000";
      setSurplusAmount(lumpsumDefault);
    }
  }, [outstandingPrincipal, isOnetime]);

  // Handle toggle between Monthly and Lumpsum - set appropriate defaults
  const handleOnetimeToggle = (isLumpsum: boolean) => {
    setIsOnetime(isLumpsum);
    
    if (isLumpsum) {
      // Lumpsum: Use 200000 or half of outstanding principal if less than 200000
      const principal = parseAndClampInteger(outstandingPrincipal, INPUT_LIMITS.outstandingPrincipal);
      const lumpsumDefault = principal < 200000 ? Math.floor(principal / 2).toString() : "200000";
      setSurplusAmount(lumpsumDefault);
    } else {
      // Monthly: Always use 20000 as default
      setSurplusAmount("20000");
    }
  };

  // Parse inputs
  const parsedOutstandingPrincipal = parseAndClampInteger(outstandingPrincipal, INPUT_LIMITS.outstandingPrincipal);
  const parsedAnnualInterestRate = parseAndClampDecimal(annualInterestRate, INPUT_LIMITS.loanInterestRate);
  const parsedTenureValue = parseAndClampDecimal(tenureValue, tenureMode === "years" ? INPUT_LIMITS.remainingTenureYears : INPUT_LIMITS.remainingTenureMonths);
  const remainingTenureMonths = tenureMode === "years" ? Math.round(parsedTenureValue * 12) : Math.round(parsedTenureValue);
  const parsedSurplusAmount = parseAndClampInteger(surplusAmount, INPUT_LIMITS.surplusAmount);
  const parsedExpectedSipReturn = parseAndClampDecimal(expectedSipReturn, INPUT_LIMITS.expectedSipReturn);
  const parsedAnnualStepUp = parseAndClampDecimal(annualStepUp, INPUT_LIMITS.annualIncrement);
  const parsedInflationRate = parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate);

  // Calculate results with performance optimization
  const result = useMemo(() => {
    // Check if current inputs match the default values used for precomputed result
    const isDefaultInputs = 
      parsedOutstandingPrincipal === parseAndClampInteger("5000000", INPUT_LIMITS.outstandingPrincipal) &&
      parsedAnnualInterestRate === parseAndClampDecimal("9", INPUT_LIMITS.loanInterestRate) &&
      remainingTenureMonths === 120 && // 10 years in months
      !isOnetime &&
      parsedSurplusAmount === parseAndClampInteger("20000", INPUT_LIMITS.surplusAmount) &&
      prepaymentPercentage === 50 &&
      parsedExpectedSipReturn === parseAndClampDecimal("12", INPUT_LIMITS.expectedSipReturn) &&
      parsedAnnualStepUp === parseAndClampDecimal("10", INPUT_LIMITS.annualIncrement) &&
      parsedInflationRate === parseAndClampDecimal("6", INPUT_LIMITS.inflationRate) &&
      adjustForInflation === true;

    // Use precomputed results only for default inputs during loading states
    if ((!isHydrated || isCalculating) && isDefaultInputs) {
      return DEFAULT_LOAN_VS_SIP_RESULT;
    }

    return calculator.calculate({
      outstandingPrincipal: parsedOutstandingPrincipal,
      annualInterestRate: parsedAnnualInterestRate,
      remainingTenureMonths: remainingTenureMonths,
      isOnetime: isOnetime,
      surplusAmount: parsedSurplusAmount,
      prepaymentPercentage: prepaymentPercentage,
      expectedSipReturn: parsedExpectedSipReturn,
      annualStepUp: parsedAnnualStepUp,
      inflationRate: parsedInflationRate,
      adjustForInflation: adjustForInflation,
    });
  }, [
    isHydrated,
    isCalculating,
    parsedOutstandingPrincipal,
    parsedAnnualInterestRate,
    remainingTenureMonths,
    isOnetime,
    parsedSurplusAmount,
    prepaymentPercentage,
    parsedExpectedSipReturn,
    parsedAnnualStepUp,
    parsedInflationRate,
    adjustForInflation,
    debouncedInputsVersion // This triggers recalculation after debounce
  ]);

  // Input handlers
  const handleOutstandingPrincipalChange = (value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      const numValue = parseInt(validInput) || 0;
      const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.outstandingPrincipal.min), INPUT_LIMITS.outstandingPrincipal.max);
      setOutstandingPrincipal(clampedValue.toString());
    }
  };

  const handleInterestRateChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setAnnualInterestRate(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.loanInterestRate.min), INPUT_LIMITS.loanInterestRate.max);
          setAnnualInterestRate(clampedValue.toString());
        }
      }
    }
  };

  const handleTenureChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setTenureValue(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const limits = tenureMode === "years" ? INPUT_LIMITS.remainingTenureYears : INPUT_LIMITS.remainingTenureMonths;
          const clampedValue = Math.min(Math.max(numValue, limits.min), limits.max);
          setTenureValue(clampedValue.toString());
        }
      }
    }
  };

  const handleSurplusAmountChange = (value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      const numValue = parseInt(validInput) || 0;
      const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.surplusAmount.min), INPUT_LIMITS.surplusAmount.max);
      setSurplusAmount(clampedValue.toString());
    }
  };

  // Common calculator input handlers (reused from existing calculators)
  const handleExpectedSipReturnChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setExpectedSipReturn(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.expectedSipReturn.min), INPUT_LIMITS.expectedSipReturn.max);
          setExpectedSipReturn(clampedValue.toString());
        }
      }
    }
  };

  const handleExpectedSipReturnBlur = () => {
    const value = parseFloat(expectedSipReturn);
    if (isNaN(value)) {
      setExpectedSipReturn(INPUT_LIMITS.expectedSipReturn.default);
      return;
    }
    if (value > INPUT_LIMITS.expectedSipReturn.max) setExpectedSipReturn(INPUT_LIMITS.expectedSipReturn.max.toString());
    if (value < INPUT_LIMITS.expectedSipReturn.min) setExpectedSipReturn(INPUT_LIMITS.expectedSipReturn.min.toString());
  };

  const handleAnnualStepUpChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setAnnualStepUp(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.annualIncrement.min), INPUT_LIMITS.annualIncrement.max);
          setAnnualStepUp(clampedValue.toString());
        }
      }
    }
  };

  const handleAnnualStepUpBlur = () => {
    const value = parseFloat(annualStepUp);
    if (isNaN(value)) {
      setAnnualStepUp(INPUT_LIMITS.annualIncrement.default);
      return;
    }
    if (value > INPUT_LIMITS.annualIncrement.max) setAnnualStepUp(INPUT_LIMITS.annualIncrement.max.toString());
    if (value < INPUT_LIMITS.annualIncrement.min) setAnnualStepUp(INPUT_LIMITS.annualIncrement.min.toString());
  };

  const handleInflationRateChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setInflationRate(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.inflationRate.min), INPUT_LIMITS.inflationRate.max);
          setInflationRate(clampedValue.toString());
        }
      }
    }
  };

  const handleInflationRateBlur = () => {
    const value = parseFloat(inflationRate);
    if (isNaN(value)) {
      setInflationRate(INPUT_LIMITS.inflationRate.default);
      return;
    }
    if (value > INPUT_LIMITS.inflationRate.max) setInflationRate(INPUT_LIMITS.inflationRate.max.toString());
    if (value < INPUT_LIMITS.inflationRate.min) setInflationRate(INPUT_LIMITS.inflationRate.min.toString());
  };

  // Calculate time saved
  const timeSavedMonths = result.originalTenureMonths - result.newTenureMonths;
  const timeSavedYears = Math.floor(timeSavedMonths / 12);
  const timeSavedRemainingMonths = timeSavedMonths % 12;

  const strategicSummary = `By splitting your surplus ${prepaymentPercentage}/${100-prepaymentPercentage}, you finish your loan ${timeSavedYears > 0 ? `${timeSavedYears} year${timeSavedYears > 1 ? 's' : ''}` : ''}${timeSavedYears > 0 && timeSavedRemainingMonths > 0 ? ', ' : ''}${timeSavedRemainingMonths > 0 ? `${timeSavedRemainingMonths} month${timeSavedRemainingMonths > 1 ? 's' : ''}` : ''} early AND build a ${formatCurrency(result.futureSipWealth)} nest egg${result.inflationAdjustedSipWealth ? ` which is ${formatCurrency(result.inflationAdjustedSipWealth)} in today's purchasing power` : ''} while also saving ${formatCurrency(result.interestSaved)} in interest payments.`;

  if (!isHydrated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <CalculatorLayout
      title="Prepayment vs Investment"
      description="Should you prepay your loan or invest in SIP? Find your optimal strategy with our smart calculator."
      breadcrumbLabel="Loan vs SIP Calculator"
      breadcrumbHref="/loan-vs-sip"
    >
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5">
          <div className="space-y-6">
            {/* Loan Details Card */}
            <LoanDetailsCard
              outstandingPrincipal={outstandingPrincipal}
              annualInterestRate={annualInterestRate}
              tenureMode={tenureMode}
              tenureValue={tenureValue}
              onPrincipalChange={handleOutstandingPrincipalChange}
              onInterestRateChange={handleInterestRateChange}
              onTenureModeChange={setTenureMode}
              onTenureValueChange={handleTenureChange}
            />

            {/* Strategy Card */}
            <StrategyCard
              isOnetime={isOnetime}
              surplusAmount={surplusAmount}
              prepaymentPercentage={prepaymentPercentage}
              onOnetimeChange={handleOnetimeToggle}
              onSurplusAmountChange={handleSurplusAmountChange}
              onPrepaymentPercentageChange={setPrepaymentPercentage}
              isHydrated={isHydrated}
            />

            {/* Advanced Options Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <MobileToggle
                id="show-advanced-loan-vs-sip"
                checked={showAdvanced}
                onChange={setShowAdvanced}
                label="Show Advanced Options"
                description="Customize assumptions for more accurate calculations"
              />

              {showAdvanced && (
                <AdvancedLoanVsSipInputs
                  expectedSipReturn={expectedSipReturn}
                  onExpectedSipReturnChange={handleExpectedSipReturnChange}
                  annualStepUp={annualStepUp}
                  onAnnualStepUpChange={handleAnnualStepUpChange}
                  inflationRate={inflationRate}
                  onInflationRateChange={handleInflationRateChange}
                  isOnetime={isOnetime}
                />
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <div className={`transition-opacity duration-300 ${isCalculating ? 'opacity-60' : 'opacity-100'}`}>
            {isCalculating && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Calculating...</span>
                </div>
              </div>
            )}
            
            <InflationAwareResults
              title="Your Strategic Financial Analysis"
              inflationMessage="Results show both nominal values and inflation-adjusted purchasing power"
            >
          {/* Loan Impact Section */}
          <section className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30 mb-6" aria-labelledby="loan-impact-heading">
            <h3 id="loan-impact-heading" className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
              <span className="mr-2" aria-hidden="true">🏠</span>
              Loan Impact
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  New Loan Tenure
                </div>
                <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {Math.floor(result.newTenureMonths / 12)} Years, {result.newTenureMonths % 12} Months
                </div>
              </div>
              
              <div className="border-t border-blue-200 dark:border-blue-700 my-4"></div>
              
              <FinancialMetric
                label="Interest Saved"
                amount={result.interestSaved}
                description="Money saved from reduced interest payments"
                color="success"
                weight="semibold"
                size="lg"
              />
            </div>
          </section>

          {/* Investment Impact Section */}
          <section className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800/30 mb-6" aria-labelledby="investment-impact-heading">
            <h3 id="investment-impact-heading" className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
              <span className="mr-2" aria-hidden="true">📈</span>
              Investment Impact
            </h3>

            <FinancialMetric
              label="Final Maturity Value"
              amount={result.futureSipWealth}
              description={isOnetime 
                ? `After ${tenureMode === "years" ? `${tenureValue} years` : `${Math.floor(remainingTenureMonths / 12)} years`} of lumpsum compounding`
                : `Wealth created through systematic investing over ${tenureMode === "years" ? `${tenureValue} years` : `${Math.floor(remainingTenureMonths / 12)} years`}`
              }
              color="primary"
              weight="bold"
              size="xl"
            />
            
            <FinancialDivider />

            <FinancialMetric
              label="Total Amount Invested"
              amount={result.totalSipInvested}
              color="neutral"
              weight="medium"
              size="lg"
            />

            {result.inflationAdjustedSipWealth && (
              <>
                <FinancialDivider />
                <HighlightedMetric
                  label="💰 Real Value in Today's Money"
                  amount={result.inflationAdjustedSipWealth}
                  description={`What ₹${formatCurrency(result.futureSipWealth)} will actually buy in ${tenureMode === "years" ? `${tenureValue} years` : `${Math.floor(remainingTenureMonths / 12)} years`}`}
                  icon="✨"
                />
              </>
            )}
          </section>

          <FinancialDivider />

          {/* Total Benefit */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800" aria-labelledby="total-benefit-heading">
            <div id="total-benefit-heading" className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
              Total Financial Benefit
            </div>
            <FinancialMetric
              label=""
              amount={result.totalFinancialBenefit}
              description={`Sum of Wealth Created (₹${formatCurrency(result.futureSipWealth)}) + Interest Saved (₹${formatCurrency(result.interestSaved)})`}
              color="success"
              weight="bold"
              size="xl"
            />
            {result.inflationAdjustedBenefit && (
              <div className="mt-2 text-sm text-green-700 dark:text-green-300 flex items-center">
                <span className="mr-1">💡</span>
                Real value: ₹{formatCurrency(result.inflationAdjustedBenefit)} in today's purchasing power
              </div>
            )}
          </section>

          <div className="my-6" />

          {/* Strategic Summary */}
          <section className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800" aria-labelledby="strategic-summary-heading">
            <h3 id="strategic-summary-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="text-blue-500 mr-2" aria-hidden="true">🎯</span>
              Strategic Summary
            </h3>
            
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                By splitting your surplus <span className="font-semibold text-blue-600 dark:text-blue-400">{prepaymentPercentage}%</span> / <span className="font-semibold text-green-600 dark:text-green-400">{100-prepaymentPercentage}%</span>, you achieve:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4" role="group" aria-label="Key benefits summary">
                <div className="bg-blue-100/50 dark:bg-blue-900/10 rounded-lg p-3 text-center" aria-label={`Loan finished early by ${timeSavedYears > 0 || timeSavedRemainingMonths > 0 ? `${timeSavedYears > 0 ? `${timeSavedYears} years` : ''} ${timeSavedRemainingMonths > 0 ? `${timeSavedRemainingMonths} months` : ''}` : 'zero months'}`}>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Loan Finished Early By</div>
                  <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                    {timeSavedYears > 0 || timeSavedRemainingMonths > 0 
                      ? `${timeSavedYears > 0 ? `${timeSavedYears}Y` : ''}${timeSavedYears > 0 && timeSavedRemainingMonths > 0 ? ' ' : ''}${timeSavedRemainingMonths > 0 ? `${timeSavedRemainingMonths}M` : ''}`
                      : '0M'
                    }
                  </div>
                </div>
                
                <div className="bg-green-100/50 dark:bg-green-900/10 rounded-lg p-3 text-center" aria-label={`Wealth built: ${formatCurrency(result.futureSipWealth)} rupees`}>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">Wealth Built</div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200">
                    ₹{formatCurrency(result.futureSipWealth)}
                  </div>
                </div>
                
                <div className="bg-emerald-100/50 dark:bg-emerald-900/10 rounded-lg p-3 text-center" aria-label={`Interest saved: ${formatCurrency(result.interestSaved)} rupees`}>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Interest Saved</div>
                  <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                    ₹{formatCurrency(result.interestSaved)}
                  </div>
                </div>
              </div>
              
              {result.inflationAdjustedSipWealth && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  <span aria-hidden="true">💡</span> Your wealth will have <span className="font-medium text-green-600 dark:text-green-400">₹{formatCurrency(result.inflationAdjustedSipWealth)}</span> purchasing power in today's rupees.
                </p>
              )}
            </div>
          </section>

          <div className="my-6" />

          {/* Key Assumptions */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800" aria-labelledby="key-assumptions-heading">
            <h3 id="key-assumptions-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <span aria-hidden="true">📊</span> Key Assumptions Used in Calculation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>• Expected SIP Return: {expectedSipReturn}%</div>
              {!isOnetime && <div>• Annual Step-up: {annualStepUp}%</div>}
              <div>• Loan Interest Rate: {annualInterestRate}%</div>
              <div>• Inflation Rate: {inflationRate}%</div>
              <div>• Investment Period: {tenureMode === "years" ? `${tenureValue} years` : `${Math.floor(remainingTenureMonths / 12)} years`}</div>
              <div>• Split Strategy: {prepaymentPercentage}% Prepay / {100-prepaymentPercentage}% Invest</div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              <span aria-hidden="true">💡</span> Use "Advanced Options" above to customize these assumptions
            </p>
          </section>
          </InflationAwareResults>
          </div>
        </div>
      </div>

      <div className="my-8" />

      <CalculatorDisclaimer />

      {/* FAQ Section */}
      <CalculatorFAQ specificFAQ={LOAN_VS_SIP_CONTENT.faq} />

      <MoreCalculators currentPath="/loan-vs-sip" />
    </CalculatorLayout>
  );
}