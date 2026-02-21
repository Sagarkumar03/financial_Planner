"use client";

import { useState, useEffect } from "react";
import { LumpsumCalculator } from "@/calculators/lumpsum/lumpsumCalculator";
import { IndiaSipAssumptions } from "@/calculators/sip/assumptions";
import { 
  INPUT_LIMITS,
  handleIntegerInput,
  handleDecimalInput,
  parseAndClampInteger,
  parseAndClampDecimal
} from "@/lib/inputValidation";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { CalculatorDisclaimer, CalculatorFAQ, MoreCalculators } from "@/components/calculator/SharedCalculatorComponents";
import { LUMPSUM_CONTENT } from "@/lib/calculatorContent";
import { CommonCalculatorInputs } from "@/components/calculator/CommonCalculatorInputs";
import { Section } from "@/components/ui/EnhancedLayouts";
import { 
  InflationAwareResults
} from "@/components/ui/InflationComponents";
import { 
  FinancialMetric, 
  FinancialDivider,
  HighlightedMetric,
  formatCurrency
} from "@/components/ui/FinancialDisplay";

const calculator = new LumpsumCalculator();

export default function LumpsumCalculatorClient() {
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [annualReturnRate, setAnnualReturnRate] = useState("12");
  const [investmentYears, setInvestmentYears] = useState("10");
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  const [inflationRate, setInflationRate] = useState("6");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleInitialInvestmentChange = (value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      const numValue = parseInt(validInput) || 0;
      const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.monthlyInvestment.min), INPUT_LIMITS.monthlyInvestment.max);
      setInitialInvestment(clampedValue.toString());
    }
  };

  const handleInitialInvestmentBlur = () => {
    const value = parseInt(initialInvestment);
    if (isNaN(value)) {
      setInitialInvestment(INPUT_LIMITS.monthlyInvestment.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.monthlyInvestment.max) setInitialInvestment(INPUT_LIMITS.monthlyInvestment.max.toString());
    if (value < INPUT_LIMITS.monthlyInvestment.min) setInitialInvestment(INPUT_LIMITS.monthlyInvestment.min.toString());
  };

  const handleAnnualReturnChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setAnnualReturnRate(validInput);
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
      setInvestmentYears(validInput);
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

  const handleInflationRateChange = (value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setInflationRate(validInput);
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
  const parsedInitialInvestment = parseAndClampInteger(initialInvestment, INPUT_LIMITS.monthlyInvestment);
  const parsedAnnualReturnRate = parseAndClampDecimal(annualReturnRate, INPUT_LIMITS.annualReturnRate);
  const parsedInvestmentYears = parseAndClampDecimal(investmentYears, INPUT_LIMITS.investmentYears);
  const parsedInflationRate = parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate);

  const assumptions = {
    ...IndiaSipAssumptions,
    inflationRate: parsedInflationRate / 100,
  };

  const result = calculator.calculate({
    initialInvestment: parsedInitialInvestment,
    annualReturnRate: parsedAnnualReturnRate,
    investmentYears: parsedInvestmentYears,
    adjustForInflation,
  }, assumptions);

  // Enhanced calculation metrics
  const totalReturns = result.maturityValue - result.totalInvested;
  const returnsMultiple = result.totalInvested > 0 ? (totalReturns / result.totalInvested) : 0;
  const absoluteCagr = parsedInvestmentYears > 0 ? Math.pow(result.maturityValue / result.totalInvested, 1/parsedInvestmentYears) - 1 : 0;
  const realCagr = result.inflationAdjustedValue && result.totalInvested > 0 
    ? Math.pow(result.inflationAdjustedValue / result.totalInvested, 1/parsedInvestmentYears) - 1 
    : 0;

  return (
    <CalculatorLayout
      title="Lumpsum Calculator with Real Returns"
      description="Calculate your lumpsum investment returns with compound growth and see what your money will actually be worth after inflation."
      breadcrumbLabel="Lumpsum Calculator"
      breadcrumbHref="/lumpsum-calculator"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <CommonCalculatorInputs
            inputs={{
              monthlyInvestment: initialInvestment, // Using for lumpsum amount
              annualReturnRate,
              investmentYears,
              inflationRate,
              adjustForInflation
            }}
            handlers={{
              handleMonthlyInvestmentChange: handleInitialInvestmentChange,
              handleMonthlyInvestmentBlur: handleInitialInvestmentBlur,
              handleAnnualReturnChange,
              handleAnnualReturnBlur,
              handleInvestmentYearsChange,
              handleInvestmentYearsBlur,
              handleInflationRateChange,
              handleInflationRateBlur,
              setAdjustForInflation
            }}
            isHydrated={isHydrated}
            toggleId="lumpsumInflationToggle"
            customLabels={{
              monthlyInvestment: "Initial Investment",
              monthlyInvestmentHelper: "Your one-time lumpsum investment amount"
            }}
          />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {isHydrated && (
            <InflationAwareResults 
              title="Your Lumpsum Investment Summary"
              inflationMessage={adjustForInflation ? `Real value adjusted for ${inflationRate}% annual inflation` : undefined}
              className="mb-6"
            >
              <FinancialMetric
                label="Final Maturity Value"
                amount={result.maturityValue}
                description={`After ${investmentYears} years of lumpsum compounding`}
                color="primary"
                weight="bold"
                size="xl"
              />
              
              <FinancialDivider />
              
              <FinancialMetric
                label="Initial Investment"
                amount={result.totalInvested}
                description="Your one-time investment"
                color="neutral"
                weight="medium"
                size="lg"
              />
              
              <FinancialDivider />
              
              <FinancialMetric
                label="Estimated Wealth Gain"
                amount={totalReturns}
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

          {/* Performance Metrics - Only show when inflation toggle is on */}
          {adjustForInflation && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Performance Analysis
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(absoluteCagr * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Absolute CAGR</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(realCagr * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Real CAGR</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Content */}
      <Section background="gradient" padding="lg" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>💰</span>
              Power of Lumpsum Investment
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Lumpsum investments benefit from compound interest from day one. Unlike SIP, your entire capital starts working immediately, 
              potentially generating higher returns if invested at the right time when markets are low.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>📊</span>
              Why Real Value Matters
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Inflation reduces purchasing power over time. ₹1 lakh today won't buy the same things in {parsedInvestmentYears} years. 
              Our calculator shows both nominal returns and real purchasing power, helping you understand what your money will actually be worth.
            </p>
          </div>
        </div>
      </Section>

      <CalculatorDisclaimer additionalText="Returns are computed assuming a constant annual growth rate. Lumpsum investments are made as a one-time payment. Inflation is assumed to remain constant throughout the investment period at the specified rate." />

      {/* FAQ */}
      <CalculatorFAQ specificFAQ={LUMPSUM_CONTENT.faq} />

      {/* More Calculators Link */}
      <MoreCalculators currentPath="/lumpsum-calculator" />
    </CalculatorLayout>
  );
}