"use client";

import { useState, useEffect } from "react";
import { SipCalculator } from "@/calculators/sip/sipCalculator";
import { IndiaSipAssumptions } from "@/calculators/sip/assumptions";

const formatNumber = (value: string) => {
  const clean = value.replace(/,/g, "");
  if (clean === "") return "";
  
  // Consistent formatting that works the same on server and client
  const num = Number(clean);
  if (isNaN(num)) return clean;
  
  // Manual Indian number formatting to avoid locale inconsistencies
  return num.toString().replace(/(\d)(?=(\d{2})+\d(?!\d))/g, '$1,');
};

// Helper to format currency amounts consistently.
const formatCurrency = (amount: number) => {
  return amount.toString().replace(/(\d)(?=(\d{2})+\d(?!\d))/g, '$1,');
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Helper functions for input validation
const isValidInteger = (value: string) => {
  return /^\d*$/.test(value);
};

const isValidDecimal = (value: string) => {
  return /^\d*\.?\d*$/.test(value);
};

const handleIntegerInput = (value: string) => {
  // Remove commas first, then validate
  const cleanValue = value.replace(/,/g, "");
  return isValidInteger(cleanValue) ? cleanValue : null;
};

const handleDecimalInput = (value: string) => {
  return isValidDecimal(value) ? value : null;
};

// Input validation limits
const INPUT_LIMITS = {
  monthlyInvestment: {
    min: 0,
    max: 1_00_00_000, // 1 crore
    default: "10000"
  },
  annualReturnRate: {
    min: 0,
    max: 30, // 30%
    default: "12"
  },
  investmentYears: {
    min: 1,
    max: 50, // 50 years
    default: "20"
  },
  inflationRate: {
    min: 0,
    max: 15, // 15%
    default: "6"
  }
};


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

  const parsedMonthlyInvestment = clamp(
  parseInt(monthlyInvestment.replace(/,/g, "")) || 0,
  INPUT_LIMITS.monthlyInvestment.min, 
  INPUT_LIMITS.monthlyInvestment.max
);

const parsedAnnualReturnRate = clamp(
  parseFloat(annualReturnRate) || 0,
  INPUT_LIMITS.annualReturnRate.min,
  INPUT_LIMITS.annualReturnRate.max
);

const parsedInvestmentYears = clamp(
  parseFloat(investmentYears) || 0,
  INPUT_LIMITS.investmentYears.min,
  INPUT_LIMITS.investmentYears.max
);

const parsedInflationRate = clamp(
  parseFloat(inflationRate) || 0,
  INPUT_LIMITS.inflationRate.min,
  INPUT_LIMITS.inflationRate.max
);

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
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">
        SIP Calculator – Estimate Your Mutual Fund Returns
      </h1>

      <p className="text-sm text-gray-700 mb-6">
        Use this free SIP calculator to estimate the future value of your monthly
        mutual fund investments in India. Adjust returns for inflation to understand
        the real purchasing power of your money.
      </p>

      {/* Monthly Investment */}
      <div className="mb-4">
        <label className="block text-sm mb-1">
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
        <label className="block text-sm mb-1">
            Expected Annual Return <span className="text-xs text-gray-500">(%)</span>
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
        <label className="block text-sm mb-1">
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
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={adjustForInflation}
          onChange={(e) => setAdjustForInflation(e.target.checked)}
          suppressHydrationWarning={true}
        />
        <span className="text-sm">
          Adjust for inflation
        </span>
      </div>

      {/* Inflation Rate */}
      {adjustForInflation && (
        <div className="mb-6">
          <label className="block text-sm mb-1">
            Inflation Rate <span className="text-xs text-gray-500">(% per year)</span>
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
      {/* Results */}
      {isHydrated && (
<section
  // CHANGED: border made subtler, card slightly softer
  className="mt-6 bg-gray-800 rounded-xl p-4 ring-1 ring-gray-800/50"
>
  <h2
    // CHANGED: softer heading color
    className="text-sm font-medium text-gray-400 mb-3"
  >
    Investment Summary
  </h2>

  {/* Maturity Value */}
  <div className="mb-4">
    <div className="text-xs text-gray-400">
      Estimated Maturity Value
    </div>

    <div
      // CHANGED: white → gray-100 (less glare, still primary)
      className="text-2xl font-semibold text-gray-300"
    >
      ₹ {formatCurrency(result.maturityValue)}
    </div>

    <div className="text-xs text-gray-400">
      After {investmentYears} years
    </div>
  </div>

  {/* Subtle divider */}
  <div
    // CHANGED: subtle divider using opacity instead of hard border
    className="h-px bg-gray-800/50 my-3"
  />

  {/* Returns */}
  <div className="mb-3">
    <div className="text-xs text-gray-400">
      Estimated Returns
    </div>

    <div
      // unchanged: emerald is already soft and readable
      className="text-lg font-medium text-emerald-400"
    >
      ₹{" "}
      {formatCurrency(result.maturityValue - result.totalInvested)}
    </div>
  </div>

  {/* Total Invested */}
  <div className="mb-3">
    <div className="text-xs text-gray-400">
      Total Amount Invested
    </div>

    <div className="text-base font-medium text-gray-200">
      ₹ {formatCurrency(result.totalInvested)}
    </div>
  </div>

  {/* Inflation Adjusted */}
  {result.inflationAdjustedValue !== undefined && (
    <>
      {/* Subtle divider */}
      <div className="h-px bg-gray-800/50 my-3" />

      <div>
        <div className="text-xs text-gray-400">
          Value in today’s money
        </div>

        <div className="text-base font-medium text-gray-200">
          ₹{" "}
          {formatCurrency(result.inflationAdjustedValue)}
        </div>
      </div>
    </>
  )}
</section>
)}




      {/* Assumptions & Disclaimer */}
      <section className="text-xs text-gray-600 mt-6">
        <h2 className="font-medium mb-1">
          Assumptions & Disclaimer
        </h2>

        <p className="mb-1">
          Returns are assumed to be constant annually. SIP investments are made
          monthly. Inflation rate is assumed to remain constant throughout the
          investment period.
        </p>

        <p>
          Mutual fund investments are subject to market risks. This calculator
          provides estimates for educational purposes only and does not
          guarantee returns.
        </p>
      </section>

<div className="h-px bg-gray-800/50 my-8" />
      {/* FAQ */}
       {/* FAQ */}
<section className="mt-10">
  <h2
    // CHANGED: softer color + more spacing for section separation
    className="text-lg font-medium text-gray-300 mb-4"
  >
    SIP Calculator – Frequently Asked Questions
  </h2>

  {/* FAQ Item */}
  <div className="mb-4">
    <h3
      // CHANGED: clearer question emphasis, not too bold
      className="text-sm font-medium text-gray-300 mb-1"
    >
      How is SIP maturity calculated?
    </h3>
    <p
      // CHANGED: improved readability with softer color + relaxed leading
      className="text-sm text-gray-400 leading-relaxed"
    >
      SIP returns are calculated using compound interest, assuming a fixed rate
      of return and monthly investments throughout the investment period.
    </p>
  </div>

  {/* FAQ Item */}
  <div className="mb-4">
    <h3 className="text-sm font-medium text-gray-300 mb-1">
      Is this SIP calculator accurate?
    </h3>
    <p className="text-sm text-gray-400 leading-relaxed">
      This calculator provides estimates based on your inputs. Actual returns
      may vary depending on market performance and fund selection.
    </p>
  </div>

  {/* FAQ Item */}
  <div>
    <h3 className="text-sm font-medium text-gray-300 mb-1">
      What does inflation-adjusted value mean?
    </h3>
    <p className="text-sm text-gray-400 leading-relaxed">
      Inflation-adjusted value shows what your investment will be worth in
      today’s terms after accounting for inflation.
    </p>
  </div>
</section>
    </main>
  );
}
