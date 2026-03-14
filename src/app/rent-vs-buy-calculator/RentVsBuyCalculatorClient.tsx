"use client";

import { useState, useEffect, useMemo, useCallback, Suspense, startTransition } from "react";
import dynamic from "next/dynamic";
import { RentVsBuyCalculator } from "@/calculators/rent-vs-buy-calculator/rentVsBuyCalculator";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

import { InflationAwareResults } from "@/components/ui/InflationComponents";
import { 
  INPUT_LIMITS,
  handleIntegerInput,
  handleDecimalInput,
  parseAndClampInteger,
  parseAndClampDecimal
} from "@/lib/inputValidation";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { CalculatorDisclaimer, CalculatorFAQ, MoreCalculators } from "@/components/calculator/SharedCalculatorComponents";
import { RENT_VS_BUY_CONTENT } from "@/lib/calculatorContent";
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
// Lazy load YearByYearBreakdown for better performance
const YearByYearBreakdown = dynamic(() => import("@/components/rent-vs-buy-calculator/YearByYearBreakdown"), {
  loading: () => (
    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

const calculator = new RentVsBuyCalculator();

// Code splitting: Lazy load advanced inputs (only when needed)
const AdvancedRentVsBuyInputs = dynamic(() => import("./AdvancedRentVsBuyInputs"), {
  loading: () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="animate-pulse">
        <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded mb-4 w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
              <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

export default function RentVsBuyCalculatorClient() {
  // Primary inputs
  const [propertyPrice, setPropertyPrice] = useState<string>(INPUT_LIMITS.propertyPrice.default);
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>(INPUT_LIMITS.downPaymentPercent.default);
  const [loanInterestRate, setLoanInterestRate] = useState<string>(INPUT_LIMITS.loanInterestRate.default);
  const [loanTenure, setLoanTenure] = useState<string>(INPUT_LIMITS.loanTenureYears.default);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<string>(INPUT_LIMITS.monthlyMaintenance.default);
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState<string>(INPUT_LIMITS.propertyAppreciationRate.default);
  const [monthlyRent, setMonthlyRent] = useState<string>(INPUT_LIMITS.monthlyRent.default);
  const [annualRentHike, setAnnualRentHike] = useState<string>(INPUT_LIMITS.annualRentHike.default);
  const [sipReturnRate, setSipReturnRate] = useState<string>(INPUT_LIMITS.sipReturnRate.default);

  // Advanced inputs
  const [inflationRate, setInflationRate] = useState<string>(INPUT_LIMITS.inflationRate.default);
  const [securityDepositMonths, setSecurityDepositMonths] = useState<string>(INPUT_LIMITS.securityDepositMonths.default);
  const [transactionCostPercent, setTransactionCostPercent] = useState<string>(INPUT_LIMITS.transactionCostPercent.default);
  const [maintenanceIncreasePercent, setMaintenanceIncreasePercent] = useState<string>(INPUT_LIMITS.maintenanceIncreasePercent.default);

  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInvestmentGapDetails, setShowInvestmentGapDetails] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [calculationStatus, setCalculationStatus] = useState<'calculating' | 'ready'>('ready');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Parse and clamp all inputs  
  const parsedInputs = useMemo(() => ({
    propertyPrice: parseAndClampInteger(propertyPrice, INPUT_LIMITS.propertyPrice),
    downPaymentPercent: parseAndClampDecimal(downPaymentPercent, INPUT_LIMITS.downPaymentPercent),
    loanInterestRate: parseAndClampDecimal(loanInterestRate, INPUT_LIMITS.loanInterestRate),
    loanTenure: parseAndClampInteger(loanTenure, INPUT_LIMITS.loanTenureYears),
    monthlyMaintenance: parseAndClampInteger(monthlyMaintenance, INPUT_LIMITS.monthlyMaintenance),
    propertyAppreciationRate: parseAndClampDecimal(propertyAppreciationRate, INPUT_LIMITS.propertyAppreciationRate),
    monthlyRent: parseAndClampInteger(monthlyRent, INPUT_LIMITS.monthlyRent),
    annualRentHike: parseAndClampDecimal(annualRentHike, INPUT_LIMITS.annualRentHike),
    sipReturn: parseAndClampDecimal(sipReturnRate, INPUT_LIMITS.sipReturnRate),
    inflationRate: parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate),
    securityDepositMonths: parseAndClampInteger(securityDepositMonths, INPUT_LIMITS.securityDepositMonths),
    transactionCostPercent: parseAndClampDecimal(transactionCostPercent, INPUT_LIMITS.transactionCostPercent),
    maintenanceIncreasePercent: parseAndClampDecimal(maintenanceIncreasePercent, INPUT_LIMITS.maintenanceIncreasePercent),
  }), [
    propertyPrice, downPaymentPercent, loanInterestRate, loanTenure,
    monthlyMaintenance, propertyAppreciationRate, monthlyRent, annualRentHike,
    sipReturnRate, inflationRate, securityDepositMonths,
    transactionCostPercent, maintenanceIncreasePercent
  ]);

  const assumptions = useMemo(() => ({
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
  }), []);

  // Debounced calculation for better performance
  const [debouncedInputs, setDebouncedInputs] = useState(parsedInputs);
  
  useEffect(() => {
    setCalculationStatus('calculating');
    const timer = setTimeout(() => {
      setDebouncedInputs(parsedInputs);
      setCalculationStatus('ready');
    }, 250); // 250ms debounce

    return () => clearTimeout(timer);
  }, [parsedInputs]);

  // Calculate result with debounced inputs
  const result = useMemo(() => {
    if (!isHydrated) {
      // Return default result for SSR
      return {
        winner: 'renting' as const,
        advantageAmount: 0,
        finalPropertyValue: 0,
        finalRenterWealth: 0,
        totalRentPaid: 0,
        breakEvenYear: null,
        monthlyEMI: 0,
        totalUpfrontBuying: 0,
        totalUpfrontRenting: 0,
        inflationAdjustedAdvantage: 0,
        inflationAdjustedPropertyValue: 0,
        inflationAdjustedRenterWealth: 0,
        totalInterestPaid: 0,
        initialRenterAdvantage: 0,
      };
    }

    try {
      return calculator.calculate(debouncedInputs, assumptions);
    } catch (error) {
      console.error('Calculation error:', error);
      // Return fallback result on error
      return {
        winner: 'renting' as const,
        advantageAmount: 0,
        finalPropertyValue: 0,
        finalRenterWealth: 0,
        totalRentPaid: 0,
        breakEvenYear: null,
        monthlyEMI: 0,
        totalUpfrontBuying: 0,
        totalUpfrontRenting: 0,
        inflationAdjustedAdvantage: 0,
        inflationAdjustedPropertyValue: 0,
        inflationAdjustedRenterWealth: 0,
        totalInterestPaid: 0,
        initialRenterAdvantage: 0,
      };
    }
  }, [debouncedInputs, assumptions, isHydrated]);

  // Input handlers with optimized state updates using startTransition
  const handlePropertyPriceChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      startTransition(() => {
        setPropertyPrice(validInput);
      });
    }
  }, []);

  const handlePropertyPriceBlur = useCallback(() => {
    const value = parseInt(propertyPrice);
    if (isNaN(value) || value < INPUT_LIMITS.propertyPrice.min) {
      setPropertyPrice(INPUT_LIMITS.propertyPrice.default);
    } else if (value > INPUT_LIMITS.propertyPrice.max) {
      setPropertyPrice(INPUT_LIMITS.propertyPrice.max.toString());
    }
  }, [propertyPrice]);

  const handleDownPaymentPercentChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setDownPaymentPercent(validInput);
    }
  }, []);

  const handleDownPaymentPercentBlur = useCallback(() => {
    const value = parseFloat(downPaymentPercent);
    if (isNaN(value) || value < INPUT_LIMITS.downPaymentPercent.min) {
      setDownPaymentPercent(INPUT_LIMITS.downPaymentPercent.default);
    } else if (value > INPUT_LIMITS.downPaymentPercent.max) {
      setDownPaymentPercent(INPUT_LIMITS.downPaymentPercent.max.toString());
    }
  }, [downPaymentPercent]);

  const handleLoanInterestRateChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setLoanInterestRate(validInput);
    }
  }, []);

  const handleLoanInterestRateBlur = useCallback(() => {
    const value = parseFloat(loanInterestRate);
    if (isNaN(value) || value < INPUT_LIMITS.loanInterestRate.min) {
      setLoanInterestRate(INPUT_LIMITS.loanInterestRate.default);
    } else if (value > INPUT_LIMITS.loanInterestRate.max) {
      setLoanInterestRate(INPUT_LIMITS.loanInterestRate.max.toString());
    }
  }, [loanInterestRate]);

  const handleLoanTenureChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      setLoanTenure(validInput);
    }
  }, []);

  const handleLoanTenureBlur = useCallback(() => {
    const value = parseInt(loanTenure);
    if (isNaN(value) || value < INPUT_LIMITS.loanTenureYears.min) {
      setLoanTenure(INPUT_LIMITS.loanTenureYears.default);
    } else if (value > INPUT_LIMITS.loanTenureYears.max) {
      setLoanTenure(INPUT_LIMITS.loanTenureYears.max.toString());
    }
  }, [loanTenure]);

  const handleMonthlyMaintenanceChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      setMonthlyMaintenance(validInput);
    }
  }, []);

  const handleMonthlyMaintenanceBlur = useCallback(() => {
    const value = parseInt(monthlyMaintenance);
    if (isNaN(value) || value < INPUT_LIMITS.monthlyMaintenance.min) {
      setMonthlyMaintenance(INPUT_LIMITS.monthlyMaintenance.default);
    } else if (value > INPUT_LIMITS.monthlyMaintenance.max) {
      setMonthlyMaintenance(INPUT_LIMITS.monthlyMaintenance.max.toString());
    }
  }, [monthlyMaintenance]);

  const handlePropertyAppreciationRateChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setPropertyAppreciationRate(validInput);
    }
  }, []);

  const handlePropertyAppreciationRateBlur = useCallback(() => {
    const value = parseFloat(propertyAppreciationRate);
    if (isNaN(value) || value < INPUT_LIMITS.propertyAppreciationRate.min) {
      setPropertyAppreciationRate(INPUT_LIMITS.propertyAppreciationRate.default);
    } else if (value > INPUT_LIMITS.propertyAppreciationRate.max) {
      setPropertyAppreciationRate(INPUT_LIMITS.propertyAppreciationRate.max.toString());
    }
  }, [propertyAppreciationRate]);

  const handleMonthlyRentChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      setMonthlyRent(validInput);
    }
  }, []);

  const handleMonthlyRentBlur = useCallback(() => {
    const value = parseInt(monthlyRent);
    if (isNaN(value) || value < INPUT_LIMITS.monthlyRent.min) {
      setMonthlyRent(INPUT_LIMITS.monthlyRent.default);
    } else if (value > INPUT_LIMITS.monthlyRent.max) {
      setMonthlyRent(INPUT_LIMITS.monthlyRent.max.toString());
    }
  }, [monthlyRent]);

  const handleAnnualRentHikeChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setAnnualRentHike(validInput);
    }
  }, []);

  const handleAnnualRentHikeBlur = useCallback(() => {
    const value = parseFloat(annualRentHike);
    if (isNaN(value) || value < INPUT_LIMITS.annualRentHike.min) {
      setAnnualRentHike(INPUT_LIMITS.annualRentHike.default);
    } else if (value > INPUT_LIMITS.annualRentHike.max) {
      setAnnualRentHike(INPUT_LIMITS.annualRentHike.max.toString());
    }
  }, [annualRentHike]);

  const handleSipReturnRateChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      setSipReturnRate(validInput);
    }
  }, []);

  const handleSipReturnRateBlur = useCallback(() => {
    const value = parseFloat(sipReturnRate);
    if (isNaN(value) || value < INPUT_LIMITS.sipReturnRate.min) {
      setSipReturnRate(INPUT_LIMITS.sipReturnRate.default);
    } else if (value > INPUT_LIMITS.sipReturnRate.max) {
      setSipReturnRate(INPUT_LIMITS.sipReturnRate.max.toString());
    }
  }, [sipReturnRate]);



  return (
    <ErrorBoundary>
      <CalculatorLayout
        title="Rent vs Buy Calculator India 2026 | Wealth & Opportunity Cost"
        description="Use our interactive Rent vs Buy Calculator to see your wealth projection. Our 2026 simulator factors in SIP returns on downpayments and rental inflation to show your true break-even year."
        breadcrumbLabel="Rent vs Buy Calculator"
        breadcrumbHref="/rent-vs-buy-calculator"
      >
      {/* Home Ownership Inputs */}
      <Section background="card" padding="lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2 flex items-center justify-center gap-2">
            <span>🏠</span>
            Home Ownership Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter property price, loan details and maintenance costs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MobileFormInput
                  label="Property Price"
                  value={propertyPrice}
                  onChange={handlePropertyPriceChange}
                  onBlur={handlePropertyPriceBlur}
                  type="currency"
                  placeholder="7500000"
                  helperText="Total property price"
                  icon="💰"
                />

                <MobileFormInput
                  label="Down Payment (%)"
                  value={downPaymentPercent}
                  onChange={handleDownPaymentPercentChange}
                  onBlur={handleDownPaymentPercentBlur}
                  type="percentage"
                  placeholder="20"
                  helperText="Percentage of property price as down payment"
                  icon="💳"
                />

                <MobileFormInput
                  label="Loan Interest Rate (%)"
                  value={loanInterestRate}
                  onChange={handleLoanInterestRateChange}
                  onBlur={handleLoanInterestRateBlur}
                  type="percentage"
                  placeholder="8.5"
                  helperText="Annual home loan interest rate"
                  icon="📊"
                />

                <MobileFormInput
                  label="Loan Tenure / Analysis Period (Years)"
                  value={loanTenure}
                  onChange={handleLoanTenureChange}
                  onBlur={handleLoanTenureBlur}
                  type="number"
                  placeholder="20"
                  helperText="Home loan period (also used as analysis period)"
                  icon="⏰"
                />

                <MobileFormInput
                  label="Monthly Maintenance"
                  value={monthlyMaintenance}
                  onChange={handleMonthlyMaintenanceChange}
                  onBlur={handleMonthlyMaintenanceBlur}
                  type="currency"
                  placeholder="3000"
                  helperText="Monthly property maintenance cost"
                  icon="🔧"
                />

                <MobileFormInput
                  label="Property Appreciation (%)"
                  value={propertyAppreciationRate}
                  onChange={handlePropertyAppreciationRateChange}
                  onBlur={handlePropertyAppreciationRateBlur}
                  type="percentage"
                  placeholder="5"
                  helperText="Expected annual property value growth"
                  icon="📈"
                />
              </div>
        </div>
      </Section>

      {/* Rental Inputs */}
      <Section background="card" padding="lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center justify-center gap-2">
            <span>🏡</span>
            Rental Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter rental costs, expected increases and investment returns
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MobileFormInput
                  label="Monthly Rent"
                  value={monthlyRent}
                  onChange={handleMonthlyRentChange}
                  onBlur={handleMonthlyRentBlur}
                  type="currency"
                  placeholder="25000"
                  helperText="Current monthly rent amount"
                  icon="🏘️"
                />

                <MobileFormInput
                  label="Annual Rent Hike (%)"
                  value={annualRentHike}
                  onChange={handleAnnualRentHikeChange}
                  onBlur={handleAnnualRentHikeBlur}
                  type="percentage"
                  placeholder="7"
                  helperText="Expected yearly rent increase"
                  icon="📊"
                />

                <MobileFormInput
                  label="Investment Return (SIP) (%)"
                  value={sipReturnRate}
                  onChange={handleSipReturnRateChange}
                  onBlur={handleSipReturnRateBlur}
                  type="percentage"
                  placeholder="12"
                  helperText="Expected returns on investment"
                  icon="💹"
                />


              </div>
        </div>
      </Section>

      {/* Advanced Options Section */}
      <Section background="default" padding="md">
        <div className="max-w-4xl mx-auto">
          {/* Advanced Options Toggle */}
          <MobileToggle
            id="show-advanced-rent-vs-buy"
            checked={showAdvanced}
            onChange={setShowAdvanced}
            label="Show Advanced Options"
            description="Customize inflation, transaction costs, and security deposit assumptions"
            icon="⚙️"
          />

          {/* Advanced Inputs - Code Split Component */}
          {showAdvanced && (
            <div className="mt-6">
              <Suspense fallback={
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
                          <div className="h-10 bg-blue-200 dark:bg-blue-800 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <AdvancedRentVsBuyInputs
                  inflationRate={inflationRate}
                  securityDepositMonths={securityDepositMonths}
                  transactionCostPercent={transactionCostPercent}
                  maintenanceIncreasePercent={maintenanceIncreasePercent}
                  setInflationRate={setInflationRate}
                  setSecurityDepositMonths={setSecurityDepositMonths}
                  setTransactionCostPercent={setTransactionCostPercent}
                  setMaintenanceIncreasePercent={setMaintenanceIncreasePercent}
                />
              </Suspense>
            </div>
          )}
        </div>
      </Section>

      {/* Results Content */}
      <>
        {/* Final Verdict */}
        <InflationAwareResults 
          title="Rent vs Buy Analysis Results"
          inflationMessage={`Based on ${parsedInputs.loanTenure}-year loan tenure analysis with ${parsedInputs.inflationRate}% inflation${!showAdvanced ? ' - Click "Show Advanced Options" above to customize assumptions' : ''}`}
          className="mb-8"
          hideRealValueInsight={true}
        >
            {/* Screen Reader Announcements */}
            <div 
              aria-live="polite" 
              aria-atomic="true"
              className="sr-only"
            >
              {calculationStatus === 'calculating' && 'Calculating results...'}
              {calculationStatus === 'ready' && result && 
                `Results updated: ${result.winner === 'buying' ? 'Buying' : 'Renting'} is better by ${formatCurrency(result.advantageAmount)}`
              }
            </div>
            {/* Main Verdict */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {result.winner === 'buying' ? '🏠 Buying Wins!' : '🏡 Renting Wins!'}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    By Amount ({parsedInputs.loanTenure} years):
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(Math.round(result.advantageAmount))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Inflation Adjusted:
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(Math.round(result.inflationAdjustedAdvantage))}
                  </span>
                </div>
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  (at {parsedInputs.inflationRate}% inflation)
                </div>
              </div>
            </div>

            <FinancialDivider />

            {/* Break-even Analysis */}
            {result.breakEvenYear ? (
              <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <div className="text-blue-600 dark:text-blue-400 text-xl mb-2">⚖️</div>
                <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Break-even: Year {result.breakEvenYear}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Buying becomes more profitable starting from this year
                </div>
              </div>
            ) : (
              <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
                <div className="text-orange-600 dark:text-orange-400 text-xl mb-2">⏰</div>
                <div className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  No Break-even
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  {result.winner === 'renting' 
                    ? `Renting remains better throughout the ${parsedInputs.loanTenure}-year loan period` 
                    : `Buying is immediately better from year 1 onwards`}
                </div>
              </div>
            )}

            <FinancialDivider />

            {/* Scenario Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FinancialMetric
                label="🏠 Property Equity"
                amount={Math.round(result.finalPropertyValue)}
                description={`Buyer's net equity after ${parsedInputs.loanTenure} years`}
                color="success"
                size="lg"
              />
              
              <FinancialMetric
                label="💰 Investment Wealth"
                amount={Math.round(result.finalRenterWealth)}
                description={`Renter's accumulated wealth`}
                color="primary"
                size="lg"
              />
            </div>

            <FinancialDivider />

            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FinancialMetric
                label="Monthly EMI"
                amount={Math.round(result.monthlyEMI)}
                description="Home loan monthly payment"
                color="primary"
                size="sm"
              />

              {/* Initial Investment Gap with Expandable Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Initial Investment Gap
                    </h4>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(Math.round(result.initialRenterAdvantage))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Renter's head start for investing
                    </p>
                  </div>
                  {isHydrated && (
                    <button
                      onClick={() => setShowInvestmentGapDetails(!showInvestmentGapDetails)}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`${showInvestmentGapDetails ? 'Hide' : 'Show'} calculation details for Initial Investment Gap`}
                      aria-expanded={showInvestmentGapDetails}
                      aria-controls="investment-gap-details"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowInvestmentGapDetails(!showInvestmentGapDetails);
                        }
                      }}
                    >
                      <svg 
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showInvestmentGapDetails ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {isHydrated && showInvestmentGapDetails && (
                  <div 
                    id="investment-gap-details"
                    className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600"
                    role="region"
                    aria-labelledby="calculation-breakdown-heading"
                  >
                    <h5 id="calculation-breakdown-heading" className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      💰 Calculation Breakdown
                    </h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Down Payment (20%):</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(Math.round(parsedInputs.propertyPrice * parsedInputs.downPaymentPercent / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transaction Costs ({parsedInputs.transactionCostPercent}%):</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(Math.round(parsedInputs.propertyPrice * parsedInputs.transactionCostPercent / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Total Buyer Upfront:</span>
                        <span className="font-semibold">
                          {formatCurrency(Math.round(result.totalUpfrontBuying))}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Security Deposit ({parsedInputs.securityDepositMonths} months):</span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatCurrency(Math.round(result.totalUpfrontRenting))}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-green-700 dark:text-green-300">Renter's Advantage:</span>
                          <span className="text-green-700 dark:text-green-300">
                            {formatCurrency(Math.round(result.initialRenterAdvantage))}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          This amount can be invested from day one
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </InflationAwareResults>



          {/* Assumptions Used */}
          {!showAdvanced && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 mb-8">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                📊 Key Assumptions Used
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>• Property Appreciation: {parsedInputs.propertyAppreciationRate}%</div>
                <div>• Rental Increase: {parsedInputs.annualRentHike}%</div>
                <div>• Investment Returns: {parsedInputs.sipReturn}%</div>
                <div>• Inflation Rate: {parsedInputs.inflationRate}%</div>
                <div>• Transaction Costs: {parsedInputs.transactionCostPercent}%</div>
                <div>• Security Deposit: {parsedInputs.securityDepositMonths} months</div>
                <div>• Maintenance Increase: {parsedInputs.maintenanceIncreasePercent}%</div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Click "Show Advanced Options" to customize
              </p>
            </div>
          )}
        </>

      {/* Year-by-Year Breakdown */}
      {result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && (
        <div 
          className="mt-8"
          role="region"
          aria-labelledby="year-by-year-heading"
        >
          <h3 id="year-by-year-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Year-by-Year Financial Comparison
          </h3>
          {calculationStatus === 'calculating' ? (
            <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6">
              <div 
                className="flex items-center justify-center" 
                role="status" 
                aria-label="Calculating year-by-year breakdown"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Calculating detailed breakdown...</span>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6" role="status" aria-label="Loading year-by-year analysis">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-1/3"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <YearByYearBreakdown
                yearlyData={result.yearlyBreakdown}
                breakEvenYear={result.breakEvenYear}
                winner={result.winner}
                loanTenure={parsedInputs.loanTenure}
              />
            </Suspense>
          )}
        </div>
      )}

      <CalculatorDisclaimer additionalText="This Rent vs Buy calculator provides estimates for educational purposes only and should not be considered as financial or real estate advice. The analysis involves numerous assumptions about market conditions, returns, and costs that may not reflect actual outcomes. Consider these additional factors: (1) Tax implications including home loan tax benefits, capital gains tax, and rental income tax are not included in this analysis. (2) Transaction costs vary significantly by location and may include stamp duty, registration fees, legal fees, brokerage, and other charges that could be higher than assumed. (3) Actual property appreciation and rental yields vary greatly by location, property type, and market conditions. (4) Liquidity considerations - real estate is illiquid compared to financial investments, making it difficult to exit quickly. (5) Maintenance and repair costs can be unpredictable and may exceed estimates. (6) Interest rate changes can significantly impact EMI and overall costs. (7) Investment returns are market-linked and not guaranteed. (8) Personal factors like job stability, family needs, and lifestyle preferences are not quantified but are crucial for decision-making. (9) Market cycles, economic conditions, and regulatory changes can affect outcomes. Please consult with qualified financial advisors, tax consultants, and real estate professionals before making housing decisions." />
      
      <CalculatorFAQ specificFAQ={RENT_VS_BUY_CONTENT.faq} />
      <MoreCalculators currentPath="/rent-vs-buy-calculator" />
    </CalculatorLayout>
    </ErrorBoundary>
  );
}