"use client";

import { INPUT_LIMITS, handleDecimalInput, handleIntegerInput } from "@/lib/inputValidation";
import { MobileFormInput } from "@/components/ui/MobileOptimizedInputs";

interface AdvancedFireInputsProps {
  // State values
  annualSavingsIncrease: string;
  postRetirementExpense: string;
  inflationRate: string;
  preRetirementReturns: string;
  postRetirementReturns: string;
  safeWithdrawalRate: string;
  lifeExpectancy: string;
  
  // Setters
  setAnnualSavingsIncrease: (value: string) => void;
  setPostRetirementExpense: (value: string) => void;
  setInflationRate: (value: string) => void;
  setPreRetirementReturns: (value: string) => void;
  setPostRetirementReturns: (value: string) => void;
  setSafeWithdrawalRate: (value: string) => void;
  setLifeExpectancy: (value: string) => void;
}

export default function AdvancedFireInputs({
  annualSavingsIncrease,
  postRetirementExpense,
  inflationRate,
  preRetirementReturns,
  postRetirementReturns,
  safeWithdrawalRate,
  lifeExpectancy,
  setAnnualSavingsIncrease,
  setPostRetirementExpense,
  setInflationRate,
  setPreRetirementReturns,
  setPostRetirementReturns,
  setSafeWithdrawalRate,
  setLifeExpectancy,
}: AdvancedFireInputsProps) {
  
  // Advanced input handlers
  const handleAdvancedDecimalInput = (value: string, setter: (value: string) => void, limit: any) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "" || validInput.endsWith(".")) {
        setter(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, limit.max);
          setter(clampedValue.toString());
        } else {
          setter(validInput);
        }
      }
    }
  };

  const handleAdvancedDecimalBlur = (value: string, setter: (value: string) => void, limit: any) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setter(limit.default.toString());
      return;
    }
    if (numValue > limit.max) setter(limit.max.toString());
    if (numValue < limit.min) setter(limit.min.toString());
  };

  const handleAdvancedIntegerInput = (value: string, setter: (value: string) => void, limit: any) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setter(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          // Only enforce upper limit during typing, lower limit on blur
          const clampedValue = Math.min(numValue, limit.max);
          setter(clampedValue.toString());
        } else {
          setter(validInput);
        }
      }
    }
  };

  const handleAdvancedIntegerBlur = (value: string, setter: (value: string) => void, limit: any) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setter(limit.default.toString());
      return;
    }
    if (numValue > limit.max) setter(limit.max.toString());
    if (numValue < limit.min) setter(limit.min.toString());
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Advanced Assumptions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MobileFormInput
          label="Annual Savings Increase (%)"
          value={annualSavingsIncrease}
          onChange={(v) => handleAdvancedDecimalInput(v, setAnnualSavingsIncrease, INPUT_LIMITS.annualIncrement)}
          onBlur={() => handleAdvancedDecimalBlur(annualSavingsIncrease, setAnnualSavingsIncrease, INPUT_LIMITS.annualIncrement)}
          type="percentage"
          placeholder="10"
          helperText="Annual percentage increase in monthly savings"
        />

        <MobileFormInput
          label="Post-Retirement Expenses"
          value={postRetirementExpense}
          onChange={(v) => handleAdvancedDecimalInput(v, setPostRetirementExpense, INPUT_LIMITS.postRetirementExpense)}
          onBlur={() => handleAdvancedDecimalBlur(postRetirementExpense, setPostRetirementExpense, INPUT_LIMITS.postRetirementExpense)}
          type="percentage"
          placeholder="100"
          helperText="% of current expenses needed"
        />

        <MobileFormInput
          label="Inflation Rate"
          value={inflationRate}
          onChange={(v) => handleAdvancedDecimalInput(v, setInflationRate, INPUT_LIMITS.inflationRate)}
          onBlur={() => handleAdvancedDecimalBlur(inflationRate, setInflationRate, INPUT_LIMITS.inflationRate)}
          type="percentage"
          placeholder="6"
          helperText="Expected annual inflation"
        />

        <MobileFormInput
          label="Pre-Retirement Returns"
          value={preRetirementReturns}
          onChange={(v) => handleAdvancedDecimalInput(v, setPreRetirementReturns, INPUT_LIMITS.preRetirementReturns)}
          onBlur={() => handleAdvancedDecimalBlur(preRetirementReturns, setPreRetirementReturns, INPUT_LIMITS.preRetirementReturns)}
          type="percentage"
          placeholder="12"
          helperText="Investment returns before retirement"
        />

        <MobileFormInput
          label="Post-Retirement Returns"
          value={postRetirementReturns}
          onChange={(v) => handleAdvancedDecimalInput(v, setPostRetirementReturns, INPUT_LIMITS.postRetirementReturns)}
          onBlur={() => handleAdvancedDecimalBlur(postRetirementReturns, setPostRetirementReturns, INPUT_LIMITS.postRetirementReturns)}
          type="percentage"
          placeholder="8"
          helperText="Conservative returns after retirement"
        />

        <MobileFormInput
          label="Safe Withdrawal Rate"
          value={safeWithdrawalRate}
          onChange={(v) => handleAdvancedDecimalInput(v, setSafeWithdrawalRate, INPUT_LIMITS.safeWithdrawalRate)}
          onBlur={() => handleAdvancedDecimalBlur(safeWithdrawalRate, setSafeWithdrawalRate, INPUT_LIMITS.safeWithdrawalRate)}
          type="percentage"
          placeholder="3.3"
          helperText="Sustainable annual withdrawal %"
        />

        <MobileFormInput
          label="Life Expectancy"
          value={lifeExpectancy}
          onChange={(v) => handleAdvancedIntegerInput(v, setLifeExpectancy, INPUT_LIMITS.lifeExpectancy)}
          onBlur={() => handleAdvancedIntegerBlur(lifeExpectancy, setLifeExpectancy, INPUT_LIMITS.lifeExpectancy)}
          type="number"
          placeholder="85"
          helperText="Expected lifespan in years"
        />
      </div>
    </div>
  );
}