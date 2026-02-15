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
import { 
  PageContainer, 
  PageHeader, 
  Navigation, 
  Footer, 
  Section 
} from "@/components/ui/EnhancedLayouts";
import { 
  MobileFormInput, 
  MobileToggle
} from "@/components/ui/MobileOptimizedInputs";
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
    <PageContainer maxWidth="lg">
      
      {/* Header */}
      <PageHeader
        title="SIP Calculator with Real Returns"
        description="Calculate your mutual fund SIP returns and see what your money will actually be worth after inflation. Get the complete picture of your financial growth."
        icon="📈"
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'SIP Calculator', href: '/sip-calculator' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5">
          <Section background="card" padding="lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>🎯</span>
              Investment Details
            </h2>

            {/* Monthly Investment */}
            <MobileFormInput
              label="Monthly SIP Amount"
              value={monthlyInvestment}
              onChange={handleMonthlyInvestmentChange}
              onBlur={handleMonthlyInvestmentBlur}
              type="currency"
              helperText="The amount you invest every month"
              icon="💰"
              isHydrated={isHydrated}
            />

            {/* Annual Return Rate */}
            <MobileFormInput
              label="Expected Annual Return"
              value={annualReturnRate}
              onChange={handleAnnualReturnChange}
              onBlur={handleAnnualReturnBlur}
              type="percentage"
              unit="%"
              helperText="Historical equity returns: 10-15% annually"
              icon="📊"
            />

            {/* Investment Duration */}
            <MobileFormInput
              label="Investment Duration"
              value={investmentYears}
              onChange={handleInvestmentYearsChange}
              onBlur={handleInvestmentYearsBlur}
              type="number"
              unit="years"
              helperText="Longer duration = better compounding power"
              icon="⏰"
            />

            {/* Inflation Toggle */}
            <MobileToggle
              id="inflationToggle"
              label="Show Real Value (Inflation-Adjusted)"
              description="See what your money will actually be worth in today's purchasing power"
              checked={adjustForInflation}
              onChange={setAdjustForInflation}
              icon="💡"
            />
            
            {adjustForInflation && (
              <MobileFormInput
                label="Inflation Rate"
                value={inflationRate}
                onChange={handleInflationRateChange}
                onBlur={handleInflationRateBlur}
                type="percentage"
                unit="%"
                helperText="Historical average: 6% annually in India"
                icon="📈"
              />
            )}
          </Section>
        </div>

        {/* Results */}
        <div className="lg:col-span-7">

          {/* Results */}
          {isHydrated && (
            <InflationAwareResults 
              title="Your SIP Investment Summary"
              inflationMessage={adjustForInflation ? `Real value adjusted for ${inflationRate}% annual inflation` : undefined}
              className="mb-6"
            >
              <FinancialMetric
                label="Final Maturity Value"
                amount={result.maturityValue}
                description={`After ${investmentYears} years of SIP investing`}
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
        </div>
      </div>

      {/* Educational Content */}
      <Section background="gradient" padding="lg" className="mt-8">
        {/* <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          💡 Why Inflation-Adjusted Returns Matter
        </h2> */}
        
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
              Inflation reduces purchasing power over time. ₹1 lakh today won't buy the same things in 20 years. 
              Our calculator shows both nominal returns and real purchasing power, helping you understand what your money will actually be worth.
            </p>
          </div>
        </div>
      </Section>

      {/* Disclaimer */}
      <Section background="default" padding="md">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">
            ⚠️ Important Disclaimer
          </h3>
          <div className="text-xs text-gray-700 dark:text-gray-400 space-y-2 max-w-3xl mx-auto leading-relaxed">
            <p>
              Returns are computed assuming a constant annual growth rate. SIP investments are made monthly. 
              Inflation is assumed to remain constant throughout the investment period at the specified rate.
            </p>
            <p>
              <strong>Mutual fund investments are subject to market risks.</strong> This calculator provides estimates 
              for educational purposes only and does not guarantee returns. Past performance is not indicative of future results. 
              Please consult with a qualified financial advisor for personalized investment advice.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section background="card" padding="lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🤔 Frequently Asked Questions
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              How accurate is this SIP calculator?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
              This calculator provides estimates based on your inputs assuming constant returns. Actual mutual fund returns vary 
              based on market performance, fund selection, and economic conditions. Use this as a planning tool, not a guarantee.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              What does inflation-adjusted value mean?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
              Inflation-adjusted value shows what your investment will be worth in today's purchasing power. For example, 
              if you have ₹1 crore in 20 years, it shows how much stuff that money can actually buy compared to today's prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              What's a realistic return expectation for SIPs?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
              Historically, diversified equity mutual funds in India have delivered 10-15% annual returns over long periods (15+ years). 
              However, returns can be volatile in the short term. Conservative estimates of 10-12% are often used for long-term planning.
            </p>
          </div>
        </div>
      </Section>

      {/* More Calculators Link */}
      <Section background="default" padding="md">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🧮 More Calculators
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Explore other financial planning tools to build your complete investment strategy
          </p>
          <Navigation currentPath="/sip-calculator" className="justify-center" />
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </PageContainer>
  );
}
