"use client";

import { useState, useEffect } from "react";
import { SipCalculator } from "@/calculators/sip/sipCalculator";
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
import { SIP_CONTENT } from "@/lib/calculatorContent";
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

const calculator = new SipCalculator();

export default function SipCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("10000");
  const [annualReturnRate, setAnnualReturnRate] = useState("12");
  const [investmentYears, setInvestmentYears] = useState("20");
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  const [inflationRate, setInflationRate] = useState("6");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const parsedMonthlyInvestment = parseAndClampInteger(monthlyInvestment, INPUT_LIMITS.monthlyInvestment);
  const parsedAnnualReturnRate = parseAndClampDecimal(annualReturnRate, INPUT_LIMITS.annualReturnRate);
  const parsedInvestmentYears = parseAndClampDecimal(investmentYears, INPUT_LIMITS.investmentYears);
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
      adjustForInflation,
    },
    assumptions
  );

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
      setInflationRate(INPUT_LIMITS.inflationRate.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.inflationRate.max) setInflationRate(INPUT_LIMITS.inflationRate.max.toString());
    if (value < INPUT_LIMITS.inflationRate.min) setInflationRate(INPUT_LIMITS.inflationRate.min.toString());
  };



  return (
    <CalculatorLayout
      title="SIP Calculator with Inflation-Adjusted Returns"
      description="Calculate your mutual fund SIP returns and see what your money will actually be worth after inflation. Get the complete picture of your financial growth."
      breadcrumbLabel="SIP Calculator"
      breadcrumbHref="/sip-calculator"
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
            toggleId="inflationToggle"
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-7">
          {/* Results */}
          <InflationAwareResults 
            title="Your SIP Investment Summary"
            inflationMessage={adjustForInflation ? `Real value adjusted for ${inflationRate}% annual inflation` : undefined}
            className="mb-6"
          >
            <FinancialMetric
              label="Final Maturity Value"
              amount={isHydrated ? result.maturityValue : 0}
              description={`After ${investmentYears} years of SIP investing`}
              color="primary"
              weight="bold"
              size="xl"
            />
            
            <FinancialDivider />
            
            <FinancialMetric
              label="Total Amount Invested"
              amount={isHydrated ? result.totalInvested : 0}
              color="neutral"
              weight="medium"
              size="lg"
            />
            
            <FinancialDivider />
            
            <FinancialMetric
              label="Estimated Wealth Gain"
              amount={isHydrated ? (result.maturityValue - result.totalInvested) : 0}
              color="success"
              weight="semibold"
              size="lg"
            />
            
            {/* Inflation Adjusted Value */}
            {isHydrated && result.inflationAdjustedValue !== undefined && (
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
        </div>
      </div>

      {/* Educational Content */}
      <Section background="gradient" padding="lg" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>📊</span>
              Power of Compounding
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your money grows exponentially over time. The longer you invest, the more powerful compounding becomes. 
              Even small amounts invested regularly can create significant wealth.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>💰</span>
              Why Real Value Matters
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Inflation reduces purchasing power over time. ₹1 lakh today won&apos;t buy the same things in 20 years. 
              Our calculator shows both nominal returns and real purchasing power, helping you understand what your money will actually be worth.
            </p>
          </div>
        </div>
      </Section>

      <CalculatorDisclaimer additionalText="Returns are computed assuming a constant annual growth rate. SIP investments are made monthly. Inflation is assumed to remain constant throughout the investment period at the specified rate." />

      {/* FAQ */}
      <CalculatorFAQ specificFAQ={SIP_CONTENT.faq} />

      {/* More Calculators Link */}
      <MoreCalculators currentPath="/sip-calculator" />
    </CalculatorLayout>
  );
}
