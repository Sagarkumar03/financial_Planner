"use client";

import { useState, useEffect } from "react";
import { StepUpSipCalculator } from "@/calculators/step-up-sip/stepUpSipCalculator";
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
import { STEP_UP_SIP_CONTENT } from "@/lib/calculatorContent";
import { MobileFormInput } from "@/components/ui/MobileOptimizedInputs";
import { 
  InflationAwareResults
} from "@/components/ui/InflationComponents";
import { 
  FinancialMetric, 
  FinancialDivider,
  HighlightedMetric,
  formatCurrency
} from "@/components/ui/FinancialDisplay";

const calculator = new StepUpSipCalculator();

export default function StepUpSipCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("10000");
  const [annualReturnRate, setAnnualReturnRate] = useState("12");
  const [investmentYears, setInvestmentYears] = useState("20");
  const [annualIncrement, setAnnualIncrement] = useState("10");
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  const [inflationRate, setInflationRate] = useState("6");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const parsedMonthlyInvestment = parseAndClampInteger(monthlyInvestment, INPUT_LIMITS.monthlyInvestment);
  const parsedAnnualReturnRate = parseAndClampDecimal(annualReturnRate, INPUT_LIMITS.annualReturnRate);
  const parsedInvestmentYears = parseAndClampDecimal(investmentYears, INPUT_LIMITS.investmentYears);
  const parsedAnnualIncrement = parseAndClampDecimal(annualIncrement, INPUT_LIMITS.annualIncrement);
  const parsedInflationRate = parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate);

  const assumptions = {
    ...IndiaSipAssumptions,
    inflationRate: parsedInflationRate / 100,
  };

  const result = calculator.calculate(
    {
      monthlyInvestment: parsedMonthlyInvestment,
      annualReturnRate: parsedAnnualReturnRate,
      investmentYears: parsedInvestmentYears,
      annualIncrement: parsedAnnualIncrement,
      adjustForInflation,
    },
    assumptions
  );

  // Base handlers (same as SIP calculator)
  const handleMonthlyInvestmentChange = (value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      const numValue = parseInt(validInput) || 0;
      const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.monthlyInvestment.min), INPUT_LIMITS.monthlyInvestment.max);
      setMonthlyInvestment(clampedValue.toString());
    }
  };

  const handleMonthlyInvestmentBlur = () => {
    const value = parseInt(monthlyInvestment);
    if (isNaN(value)) {
      setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.monthlyInvestment.max) setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.max.toString());
    if (value < INPUT_LIMITS.monthlyInvestment.min) setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.min.toString());
  };

  const handleAnnualReturnChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setAnnualReturnRate(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.annualReturnRate.min), INPUT_LIMITS.annualReturnRate.max);
          setAnnualReturnRate(clampedValue.toString());
        } else {
          setAnnualReturnRate(validInput);
        }
      }
    }
  };

  const handleAnnualReturnBlur = () => {
    const value = parseFloat(annualReturnRate);
    if (isNaN(value)) {
      setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.annualReturnRate.max) setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.max.toString());
    if (value < INPUT_LIMITS.annualReturnRate.min) setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.min.toString());
  };

  const handleInvestmentYearsChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setInvestmentYears(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.investmentYears.min), INPUT_LIMITS.investmentYears.max);
          setInvestmentYears(clampedValue.toString());
        } else {
          setInvestmentYears(validInput);
        }
      }
    }
  };

  const handleInvestmentYearsBlur = () => {
    const value = parseFloat(investmentYears);
    if (isNaN(value)) {
      setInvestmentYears(INPUT_LIMITS.investmentYears.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.investmentYears.max) setInvestmentYears(INPUT_LIMITS.investmentYears.max.toString());
    if (value < INPUT_LIMITS.investmentYears.min) setInvestmentYears(INPUT_LIMITS.investmentYears.min.toString());
  };

  // Step-up specific handlers
  const handleAnnualIncrementChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setAnnualIncrement(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.annualIncrement.min), INPUT_LIMITS.annualIncrement.max);
          setAnnualIncrement(clampedValue.toString());
        } else {
          setAnnualIncrement(validInput);
        }
      }
    }
  };

  const handleAnnualIncrementBlur = () => {
    const value = parseFloat(annualIncrement);
    if (isNaN(value)) {
      setAnnualIncrement(INPUT_LIMITS.annualIncrement.default);
      return;
    }
    if (value > INPUT_LIMITS.annualIncrement.max) setAnnualIncrement(INPUT_LIMITS.annualIncrement.max.toString());
    if (value < INPUT_LIMITS.annualIncrement.min) setAnnualIncrement(INPUT_LIMITS.annualIncrement.min.toString());
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
        } else {
          setInflationRate(validInput);
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

  // Step-up specific additional input
  const stepUpInput = (
    <MobileFormInput
      label="Annual SIP Increase"
      value={annualIncrement}
      onChange={handleAnnualIncrementChange}
      onBlur={handleAnnualIncrementBlur}
      type="percentage"
      unit="%"
      helperText="Your SIP amount will increase by this percentage every year"
      icon="📈"
    />
  );

  return (
    <CalculatorLayout
      title="Step-Up SIP Calculator with Real Returns"
      description="Calculate your step-up SIP (top-up SIP) returns with annual increments and see what your money will actually be worth after inflation."
      breadcrumbLabel="Step-Up SIP Calculator"
      breadcrumbHref="/step-up-sip-calculator"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5">
          <CommonCalculatorInputs
            inputs={{
              monthlyInvestment,
              annualReturnRate,
              investmentYears,
              inflationRate,
              adjustForInflation
            }}
            handlers={{
              handleMonthlyInvestmentChange,
              handleMonthlyInvestmentBlur,
              handleAnnualReturnChange,
              handleAnnualReturnBlur,
              handleInvestmentYearsChange,
              handleInvestmentYearsBlur,
              handleInflationRateChange,
              handleInflationRateBlur,
              setAdjustForInflation
            }}
            isHydrated={isHydrated}
            toggleId="stepUpInflationToggle"
            additionalInputs={stepUpInput}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
          {/* Results */}
          {isHydrated && (
            <InflationAwareResults 
              title="Your Step-Up SIP Investment Summary"
              inflationMessage={adjustForInflation ? `Real value adjusted for ${inflationRate}% annual inflation` : undefined}
              className="mb-6"
            >
              <FinancialMetric
                label="Final Maturity Value"
                amount={result.maturityValue}
                description={`After ${investmentYears} years of step-up SIP investing`}
                color="primary"
                weight="bold"
                size="xl"
              />
              
              <FinancialDivider />
              
              <FinancialMetric
                label="Total Amount Invested"
                amount={result.totalInvested}
                color="neutral"
                weight="medium"
                size="lg"
              />
              
              <FinancialDivider />
              
              <FinancialMetric
                label="Estimated Wealth Gain"
                amount={result.maturityValue - result.totalInvested}
                color="success"
                weight="semibold"
                size="lg"
              />
              
              {/* Inflation Adjusted Value */}
              {result.inflationAdjustedValue !== undefined && (
                <>
                  <FinancialDivider />
                  <HighlightedMetric
                    label="💰 Real Value in Today's Money"
                    amount={result.inflationAdjustedValue}
                    description={`What ₹${formatCurrency(result.maturityValue)} will actually buy in ${investmentYears} years`}
                    icon="✨"
                  />
                </>
              )}
            </InflationAwareResults>
          )}

          {/* Additional Step-Up Details */}
          {isHydrated && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                {STEP_UP_SIP_CONTENT.benefits.title}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Starting SIP:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    ₹{formatCurrency(parsedMonthlyInvestment)}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Final Year SIP:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    ₹{formatCurrency(Math.round(parsedMonthlyInvestment * Math.pow(1 + parsedAnnualIncrement / 100, parsedInvestmentYears - 1)))}/month
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                    {parsedAnnualIncrement >= parsedInflationRate 
                      ? `By increasing your SIP by ${parsedAnnualIncrement}% annually, you're keeping pace with salary increments and inflation (${parsedInflationRate}%)!`
                      : parsedAnnualIncrement >= parsedInflationRate * 0.5
                        ? `Your ${parsedAnnualIncrement}% annual SIP increase helps partially offset inflation (${parsedInflationRate}%) and grows with your income.`
                        : `Consider increasing your step-up percentage closer to inflation rate (${parsedInflationRate}%) to maintain purchasing power over time.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Content */}
      <CalculatorDisclaimer additionalText="Returns are computed assuming a constant annual growth rate with step-up increments applied annually. Inflation is assumed to remain constant throughout the investment period at the specified rate." />

      {/* FAQ */}
      <CalculatorFAQ specificFAQ={STEP_UP_SIP_CONTENT.faq} />

      {/* More Calculators Link */}
      <MoreCalculators currentPath="/step-up-sip-calculator" />
    </CalculatorLayout>
  );
}