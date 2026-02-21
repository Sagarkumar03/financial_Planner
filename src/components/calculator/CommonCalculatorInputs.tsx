import React from 'react';
import { Section } from '@/components/ui/EnhancedLayouts';
import { 
  MobileFormInput, 
  MobileToggle
} from '@/components/ui/MobileOptimizedInputs';
import { COMMON_CONTENT } from '@/lib/calculatorContent';

interface BaseInputs {
  monthlyInvestment: string;
  annualReturnRate: string;
  investmentYears: string;
  inflationRate: string;
  adjustForInflation: boolean;
}

interface BaseInputHandlers {
  handleMonthlyInvestmentChange: (value: string) => void;
  handleMonthlyInvestmentBlur: () => void;
  handleAnnualReturnChange: (value: string) => void;
  handleAnnualReturnBlur: () => void;
  handleInvestmentYearsChange: (value: string) => void;
  handleInvestmentYearsBlur: () => void;
  handleInflationRateChange: (value: string) => void;
  handleInflationRateBlur: () => void;
  setAdjustForInflation: (value: boolean) => void;
}

interface CommonCalculatorInputsProps {
  inputs: BaseInputs;
  handlers: BaseInputHandlers;
  isHydrated: boolean;
  additionalInputs?: React.ReactNode;
  toggleId: string;
}

export const CommonCalculatorInputs: React.FC<CommonCalculatorInputsProps> = ({
  inputs,
  handlers,
  isHydrated,
  additionalInputs,
  toggleId
}) => {
  const sectionId = React.useId();
  
  return (
    <Section background="card" padding="lg">
      <h2 id={sectionId} className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span aria-hidden="true">🎯</span>
        Investment Details
      </h2>

      <div role="group" aria-labelledby={sectionId}>
        {/* Monthly Investment */}
        <MobileFormInput
          label="Monthly SIP Amount"
          value={inputs.monthlyInvestment}
          onChange={handlers.handleMonthlyInvestmentChange}
          onBlur={handlers.handleMonthlyInvestmentBlur}
          type="currency"
          helperText={COMMON_CONTENT.helperTexts.monthlyInvestment}
          icon="💰"
          isHydrated={isHydrated}
        />

        {/* Annual Return Rate */}
        <MobileFormInput
          label="Expected Annual Return"
          value={inputs.annualReturnRate}
          onChange={handlers.handleAnnualReturnChange}
          onBlur={handlers.handleAnnualReturnBlur}
          type="percentage"
          unit="%"
          helperText={COMMON_CONTENT.helperTexts.annualReturn}
          icon="📊"
        />

        {/* Investment Duration */}
        <MobileFormInput
          label="Investment Duration"
          value={inputs.investmentYears}
          onChange={handlers.handleInvestmentYearsChange}
          onBlur={handlers.handleInvestmentYearsBlur}
          type="number"
          unit="years"
          helperText={COMMON_CONTENT.helperTexts.investmentDuration}
          icon="⏰"
        />

        {/* Additional inputs for specific calculators */}
        {additionalInputs}
      </div>

      {/* Inflation Toggle */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <MobileToggle
          id={toggleId}
          label="Show Real Value (Inflation-Adjusted)"
          description="See what your money will actually be worth in today's purchasing power"
          checked={inputs.adjustForInflation}
          onChange={handlers.setAdjustForInflation}
          icon="💡"
        />
      </div>
      
      {inputs.adjustForInflation && (
        <MobileFormInput
          label="Expected Inflation Rate"
          value={inputs.inflationRate}
          onChange={handlers.handleInflationRateChange}
          onBlur={handlers.handleInflationRateBlur}
          type="percentage"
          unit="%"
          helperText={COMMON_CONTENT.helperTexts.inflationRate}
          icon="📈"
        />
      )}
    </Section>
  );
};