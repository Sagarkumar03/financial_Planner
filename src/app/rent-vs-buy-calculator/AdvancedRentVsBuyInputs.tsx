import { MobileFormInput } from "@/components/ui/MobileOptimizedInputs";
import { 
  INPUT_LIMITS,
  handleDecimalInput,
  parseAndClampDecimal,
  handleIntegerInput,
  parseAndClampInteger
} from "@/lib/inputValidation";
import { useCallback } from "react";

interface AdvancedRentVsBuyInputsProps {
  inflationRate: string;
  securityDepositMonths: string;
  transactionCostPercent: string;
  maintenanceIncreasePercent: string;
  setInflationRate: (value: string) => void;
  setSecurityDepositMonths: (value: string) => void;
  setTransactionCostPercent: (value: string) => void;
  setMaintenanceIncreasePercent: (value: string) => void;
}

export default function AdvancedRentVsBuyInputs({
  inflationRate,
  securityDepositMonths,
  transactionCostPercent,
  maintenanceIncreasePercent,
  setInflationRate,
  setSecurityDepositMonths,
  setTransactionCostPercent,
  setMaintenanceIncreasePercent,
}: AdvancedRentVsBuyInputsProps) {
  
  // Parse inputs for validation
  const parsedInputs = {
    inflationRate: parseAndClampDecimal(inflationRate, INPUT_LIMITS.inflationRate),
    securityDepositMonths: parseAndClampInteger(securityDepositMonths, INPUT_LIMITS.securityDepositMonths),
    transactionCostPercent: parseAndClampDecimal(transactionCostPercent, INPUT_LIMITS.transactionCostPercent),
    maintenanceIncreasePercent: parseAndClampDecimal(maintenanceIncreasePercent, INPUT_LIMITS.maintenanceIncreasePercent),
  };

  // Input handlers
  const handleInflationRateChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setInflationRate(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(numValue, INPUT_LIMITS.inflationRate.max);
          setInflationRate(clampedValue.toString());
        } else {
          setInflationRate(validInput);
        }
      }
    }
  }, [setInflationRate]);

  const handleInflationRateBlur = useCallback(() => {
    const value = parseFloat(inflationRate);
    if (isNaN(value)) {
      setInflationRate(INPUT_LIMITS.inflationRate.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.inflationRate.max) setInflationRate(INPUT_LIMITS.inflationRate.max.toString());
    if (value < INPUT_LIMITS.inflationRate.min) setInflationRate(INPUT_LIMITS.inflationRate.min.toString());
  }, [inflationRate, setInflationRate]);

  const handleSecurityDepositMonthsChange = useCallback((value: string) => {
    const validInput = handleIntegerInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setSecurityDepositMonths(validInput);
      } else {
        const numValue = parseInt(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(numValue, INPUT_LIMITS.securityDepositMonths.max);
          setSecurityDepositMonths(clampedValue.toString());
        } else {
          setSecurityDepositMonths(validInput);
        }
      }
    }
  }, [setSecurityDepositMonths]);

  const handleSecurityDepositMonthsBlur = useCallback(() => {
    const value = parseInt(securityDepositMonths);
    if (isNaN(value)) {
      setSecurityDepositMonths(INPUT_LIMITS.securityDepositMonths.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.securityDepositMonths.max) setSecurityDepositMonths(INPUT_LIMITS.securityDepositMonths.max.toString());
    if (value < INPUT_LIMITS.securityDepositMonths.min) setSecurityDepositMonths(INPUT_LIMITS.securityDepositMonths.min.toString());
  }, [securityDepositMonths, setSecurityDepositMonths]);

  const handleTransactionCostPercentChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setTransactionCostPercent(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(numValue, INPUT_LIMITS.transactionCostPercent.max);
          setTransactionCostPercent(clampedValue.toString());
        } else {
          setTransactionCostPercent(validInput);
        }
      }
    }
  }, [setTransactionCostPercent]);

  const handleTransactionCostPercentBlur = useCallback(() => {
    const value = parseFloat(transactionCostPercent);
    if (isNaN(value)) {
      setTransactionCostPercent(INPUT_LIMITS.transactionCostPercent.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.transactionCostPercent.max) setTransactionCostPercent(INPUT_LIMITS.transactionCostPercent.max.toString());
    if (value < INPUT_LIMITS.transactionCostPercent.min) setTransactionCostPercent(INPUT_LIMITS.transactionCostPercent.min.toString());
  }, [transactionCostPercent, setTransactionCostPercent]);

  const handleMaintenanceIncreasePercentChange = useCallback((value: string) => {
    const validInput = handleDecimalInput(value);
    if (validInput !== null) {
      if (validInput === "") {
        setMaintenanceIncreasePercent(validInput);
      } else {
        const numValue = parseFloat(validInput);
        if (!isNaN(numValue)) {
          const clampedValue = Math.min(numValue, INPUT_LIMITS.maintenanceIncreasePercent.max);
          setMaintenanceIncreasePercent(clampedValue.toString());
        } else {
          setMaintenanceIncreasePercent(validInput);
        }
      }
    }
  }, [setMaintenanceIncreasePercent]);

  const handleMaintenanceIncreasePercentBlur = useCallback(() => {
    const value = parseFloat(maintenanceIncreasePercent);
    if (isNaN(value)) {
      setMaintenanceIncreasePercent(INPUT_LIMITS.maintenanceIncreasePercent.default.toString());
      return;
    }
    if (value > INPUT_LIMITS.maintenanceIncreasePercent.max) setMaintenanceIncreasePercent(INPUT_LIMITS.maintenanceIncreasePercent.max.toString());
    if (value < INPUT_LIMITS.maintenanceIncreasePercent.min) setMaintenanceIncreasePercent(INPUT_LIMITS.maintenanceIncreasePercent.min.toString());
  }, [maintenanceIncreasePercent, setMaintenanceIncreasePercent]);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">⚙️</span>
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
          Advanced Options
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MobileFormInput
          label="Inflation Rate (%)"
          value={inflationRate}
          onChange={handleInflationRateChange}
          onBlur={handleInflationRateBlur}
          type="percentage"
          placeholder="6.0"
          helperText="Expected annual inflation rate"
          icon="📈"
        />

        <MobileFormInput
          label="Security Deposit (Months)"
          value={securityDepositMonths}
          onChange={handleSecurityDepositMonthsChange}
          onBlur={handleSecurityDepositMonthsBlur}
          type="number"
          placeholder="6"
          helperText="Months of rent as security deposit"
          icon="🔒"
        />

        <MobileFormInput
          label="Transaction Cost (%)"
          value={transactionCostPercent}
          onChange={handleTransactionCostPercentChange}
          onBlur={handleTransactionCostPercentBlur}
          type="percentage"
          placeholder="10.0"
          helperText="Registration, stamp duty, legal fees"
          icon="📋"
        />

        <MobileFormInput
          label="Maintenance Increase (%)"
          value={maintenanceIncreasePercent}
          onChange={handleMaintenanceIncreasePercentChange}
          onBlur={handleMaintenanceIncreasePercentBlur}
          type="percentage"
          placeholder="6.0"
          helperText="Annual increase in maintenance costs"
          icon="🔧"
        />
      </div>

      <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 These assumptions significantly impact the comparison. Adjust based on your local market conditions and expectations.
        </p>
      </div>
    </div>
  );
}