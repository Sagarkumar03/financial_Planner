import React from 'react';
import { MobileFormInput } from "@/components/ui/MobileOptimizedInputs";

interface AdvancedLoanVsSipInputsProps {
  expectedSipReturn: string;
  onExpectedSipReturnChange: (value: string) => void;
  annualStepUp: string;
  onAnnualStepUpChange: (value: string) => void;
  inflationRate: string;
  onInflationRateChange: (value: string) => void;
  isOnetime?: boolean;
}

export default function AdvancedLoanVsSipInputs({
  expectedSipReturn,
  onExpectedSipReturnChange,
  annualStepUp,
  onAnnualStepUpChange,
  inflationRate,
  onInflationRateChange,
  isOnetime = false,
}: AdvancedLoanVsSipInputsProps) {
  return (
    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
        <span className="mr-2" aria-hidden="true">⚙️</span>
        Advanced Options
      </h4>
      <div className="space-y-4">
        <MobileFormInput
          label="Expected SIP Return"
          value={expectedSipReturn}
          onChange={onExpectedSipReturnChange}
          type="percentage"
          unit="%"
          placeholder="12.0"
          icon="📊"
          helperText="Historical equity returns: 10-15% annually"
        />
        {!isOnetime && (
          <MobileFormInput
            label="Annual Step-up"
            value={annualStepUp}
            onChange={onAnnualStepUpChange}
            type="percentage"
            unit="%"
            placeholder="5.0"
            icon="📈"
            helperText="Annual increase in SIP amount"
          />
        )}
        <MobileFormInput
          label="Inflation Rate"
          value={inflationRate}
          onChange={onInflationRateChange}
          type="percentage"
          unit="%"
          placeholder="6.0"
          icon="📉"
          helperText="Historical average: 6% annually in India"
        />
      </div>
    </div>
  );
}