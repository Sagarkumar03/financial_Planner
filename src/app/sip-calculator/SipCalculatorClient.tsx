"use client";

import { useState, useEffect } from "react";
import { SipCalculator } from "@/calculators/sip/sipCalculator";
import { IndiaSipAssumptions } from "@/calculators/sip/assumptions";
import { formatNumber } from "@/lib/mathUtils";
import { 
  INPUT_LIMITS,
  handleIntegerInput,
  handleDecimalInput,
  parseAndClampInteger,
  parseAndClampDecimal
} from "@/lib/inputValidation";
import { 
  FinancialResultsCard, 
  FinancialMetric, 
  FinancialDivider,
  HighlightedMetric
} from "@/components/ui/FinancialDisplay";
import {
  MainContainer,
  PageHeading,
  Description,
  DisclaimerSection,
  FAQSection
} from "@/components/ui/CommonUI";

const calculator = new SipCalculator();

export default function SipCalculatorClient() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("10000");
  const [annualReturnRate, setAnnualReturnRate] = useState("12");
  const [investmentYears, setInvestmentYears] = useState("20");
  const [adjustForInflation, setAdjustForInflation] = useState(false);
  const [inflationRate, setInflationRate] = useState("6");
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch by only showing formatted numbers after hydration
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

  return (
    <MainContainer>
      <PageHeading title="SIP Calculator – Estimate Your Mutual Fund Returns" />

      <Description>
        Use this free SIP calculator to estimate the future value of your monthly
        mutual fund investments in India. Adjust returns for inflation to understand
        the real purchasing power of your money.
      </Description>

      {/* Monthly Investment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Monthly Investment (₹)
        </label>
        <input
            type="text"
            inputMode="numeric"
            value={isHydrated ? formatNumber(monthlyInvestment) : monthlyInvestment}
            onChange={(e) => {
                const validInput = handleIntegerInput(e.target.value);
                if (validInput !== null) {
                    const numValue = parseInt(validInput) || 0;
                    const clampedValue = Math.min(Math.max(numValue, INPUT_LIMITS.monthlyInvestment.min), INPUT_LIMITS.monthlyInvestment.max);
                    setMonthlyInvestment(clampedValue.toString());
                }
            }}
            suppressHydrationWarning={true}
            onBlur={() => {
            const value = parseInt(monthlyInvestment);
            if (isNaN(value)) {
                setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.default);
                return;
            }
            if (value > INPUT_LIMITS.monthlyInvestment.max) setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.max.toString());
            if (value < INPUT_LIMITS.monthlyInvestment.min) setMonthlyInvestment(INPUT_LIMITS.monthlyInvestment.min.toString());
        }}
        className="w-full border rounded p-2"
        />
      </div>

      {/* Annual Return */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Expected Annual Return <span className="text-xs text-gray-600 dark:text-gray-400">(%)</span>
        </label>

        <input
            type="text"
            inputMode="decimal"
            value={annualReturnRate}
            suppressHydrationWarning={true}
            onChange={(e) => {
                const validInput = handleDecimalInput(e.target.value);
                if (validInput !== null) {
                    // Allow partial decimals like "12." while typing
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
            }}
            onBlur={() => {
            const value = parseFloat(annualReturnRate);
            if (isNaN(value)) {
                setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.default);
                return;
            }
            if (value > INPUT_LIMITS.annualReturnRate.max) setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.max.toString());
            if (value < INPUT_LIMITS.annualReturnRate.min) setAnnualReturnRate(INPUT_LIMITS.annualReturnRate.min.toString());
        }}
            className="w-full border rounded p-2"
        />

      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Investment Duration (Years)
        </label>
        <input
            type="text"
            inputMode="decimal"
            value={investmentYears}
            suppressHydrationWarning={true}
            onChange={(e) => {
                const validInput = handleDecimalInput(e.target.value);
                if (validInput !== null) {
                    // Allow partial decimals like "20." while typing
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
            }}
            onBlur={() => {
            const value = parseFloat(investmentYears);
            if (isNaN(value)) {
                setInvestmentYears(INPUT_LIMITS.investmentYears.default);
                return;
            }
            if (value > INPUT_LIMITS.investmentYears.max) setInvestmentYears(INPUT_LIMITS.investmentYears.max.toString());
            if (value < INPUT_LIMITS.investmentYears.min) setInvestmentYears(INPUT_LIMITS.investmentYears.min.toString());
        }}
            className="w-full border rounded p-2"
        />

      </div>

      {/* Inflation Toggle */}
      <div 
        className="mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2"
        onClick={() => setAdjustForInflation(!adjustForInflation)}
      >
  <span
    className="text-sm font-medium text-gray-900 dark:text-gray-100 underline cursor-pointer"
  >
    Adjust for Inflation
  </span>
  <button
    id="inflationToggle"
    role="switch"
    aria-checked={adjustForInflation}
    onClick={(e) => {
      e.stopPropagation();
      setAdjustForInflation(!adjustForInflation);
    }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${adjustForInflation ? "bg-emerald-500" : "bg-gray-400"}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition
        ${adjustForInflation ? "translate-x-5" : "translate-x-1"}`}
    />
  </button>
</div>


      {/* Inflation Rate */}
      {adjustForInflation && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
            Inflation Rate <span className="text-xs text-gray-600 dark:text-gray-400">(% per year)</span>
          </label>

          <input
            type="text"
            inputMode="decimal"
            value={inflationRate}
            suppressHydrationWarning={true}
            onChange={(e) => {
                const validInput = handleDecimalInput(e.target.value);
                if (validInput !== null) {
                    // Allow partial decimals like "6." while typing
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
            }}
            onBlur={() => {
            const value = parseFloat(inflationRate);
            if (isNaN(value)) {
                setInflationRate(INPUT_LIMITS.inflationRate.default);
                return;
            }
            if (value > INPUT_LIMITS.inflationRate.max) setInflationRate(INPUT_LIMITS.inflationRate.max.toString());
            if (value < INPUT_LIMITS.inflationRate.min) setInflationRate(INPUT_LIMITS.inflationRate.min.toString());
        }}
            className="w-full border rounded p-2"
            />

        </div>
      )}

      {/* Results */}
      {isHydrated && (
        <FinancialResultsCard title="Investment Summary">
          <FinancialMetric
            label="Final Value (Maturity Amount)"
            amount={result.maturityValue}
            description={`After ${investmentYears} years`}
            color="primary"
            weight="bold"
          />
          
          <FinancialDivider />
          
          <FinancialMetric
            label="Estimated Gain"
            amount={result.maturityValue - result.totalInvested}
            color="success"
            weight="semibold"
          />
          
          <FinancialDivider />
          
          <FinancialMetric
            label="Total Amount Invested"
            amount={result.totalInvested}
            color="neutral"
            weight="medium"
          />
          
          {/* Inflation Adjusted */}
          {result.inflationAdjustedValue !== undefined && (
            <>
              <FinancialDivider />
              <HighlightedMetric
                label="Value in today's money"
                amount={result.inflationAdjustedValue}
                description={`Adjusted for ${inflationRate}% inflation`}
                icon="💰"
              />
            </>
          )}
        </FinancialResultsCard>
      )}




      <DisclaimerSection title="Assumptions & Disclaimer">
        <p className="mb-3">
          Returns are assumed to be constant annually. SIP investments are made
          monthly. Inflation rate is assumed to remain constant throughout the
          investment period.
        </p>
        <p>
          Mutual fund investments are subject to market risks. This calculator
          provides estimates for educational purposes only and does not
          guarantee returns.
        </p>
      </DisclaimerSection>
      <FAQSection 
        title="SIP Calculator – Frequently Asked Questions"
        items={[
          {
            question: "How is SIP maturity calculated?",

            answer: "SIP returns are calculated using compound interest, assuming a fixed rate of return and monthly investments throughout the investment period."

          },
          {
            question: "Is this SIP calculator accurate?",
            answer: "This calculator provides estimates based on your inputs. Actual returns may vary depending on market performance and fund selection."

          },
          {
            question: "What does inflation-adjusted value mean?",
            answer: "Inflation-adjusted value shows what your investment will be worth in today's terms after accounting for inflation."
          }
        ]}
      />
    </MainContainer>
  );
}
