/**
 * Input validation utilities for financial calculators
 */

// Input validation limits for financial calculators
export const INPUT_LIMITS = {
  monthlyInvestment: {
    min: 0,
    max: 1_00_00_000, // 1 crore for SIP monthly investments
    default: "10000"
  },
  lumpsumInvestment: {
    min: 0,
    max: 100_000_000, // 10 crores for lumpsum investments
    default: "100000"
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
  },
  annualIncrement: {
    min: 0,
    max: 40, // 40%
    default: "10"
  },
  // FIRE Calculator specific inputs
  currentAge: {
    min: 18,
    max: 70, // 70 years max current age
    default: "30"
  },
  targetRetirementAge: {
    min: 25,
    max: 70, // 70 years max retirement age
    default: "45"
  },
  currentAnnualExpenses: {
    min: 0,
    max: 1_00_00_000, // 1 crore annual expenses
    default: "1000000"
  },
  existingRetirementCorpus: {
    min: 0,
    max: 25_00_00_000, // 25 crores existing corpus
    default: "5000000"
  },
  monthlyFireSavings: {
    min: 0,
    max: 50_00_000, // 50 lakh monthly FIRE savings
    default: "30000"
  },
  postRetirementExpense: {
    min: 20,
    max: 200, // 20% to 200% of current expenses
    default: "100"
  },
  preRetirementReturns: {
    min: 0,
    max: 30, // 30%
    default: "12"
  },
  postRetirementReturns: {
    min: 0,
    max: 25, // 25%
    default: "8"
  },
  safeWithdrawalRate: {
    min: 1,
    max: 10, // 1% to 10%
    default: "3.3"
  },
  lifeExpectancy: {
    min: 50,
    max: 100, // 100 years max life expectancy
    default: "85"
  }
} as const;

/**
 * Validates if a string contains only digits
 * @param value The string to validate
 * @returns True if the string contains only digits or is empty
 */
export const isValidInteger = (value: string): boolean => {
  return /^\d*$/.test(value);
};

/**
 * Validates if a string is a valid decimal number (digits with optional decimal point)
 * Maximum 3 decimal places allowed
 * @param value The string to validate
 * @returns True if the string is a valid decimal format with max 3 decimal places
 */
export const isValidDecimal = (value: string): boolean => {
  return /^\d*\.?\d{0,3}$/.test(value);
};

/**
 * Handles integer input validation and cleaning
 * @param value The input value to process
 * @returns Cleaned value if valid, null if invalid
 */
export const handleIntegerInput = (value: string): string | null => {
  // Remove commas first, then validate
  const cleanValue = value.replace(/,/g, "");
  return isValidInteger(cleanValue) ? cleanValue : null;
};

/**
 * Handles decimal input validation with max 3 decimal places
 * @param value The input value to process
 * @returns Original value if valid, null if invalid
 */
export const handleDecimalInput = (value: string): string | null => {
  // Check if valid decimal format with max 3 decimal places
  if (!isValidDecimal(value)) {
    return null;
  }
  
  // If there's a decimal point, ensure max 3 digits after it
  if (value.includes('.')) {
    const [, decimalPart] = value.split('.');
    if (decimalPart && decimalPart.length > 3) {
      return null;
    }
  }
  
  return value;
};

/**
 * Parses a string to integer and clamps it within specified limits
 * @param value The string value to parse
 * @param limits Object containing min, max bounds
 * @returns Parsed and clamped integer value
 */
export const parseAndClampInteger = (
  value: string, 
  limits: { min: number; max: number }
): number => {
  const parsed = parseInt(value.replace(/,/g, "")) || 0;
  return Math.min(Math.max(parsed, limits.min), limits.max);
};

/**
 * Parses a string to float and clamps it within specified limits
 * @param value The string value to parse
 * @param limits Object containing min, max bounds
 * @returns Parsed and clamped decimal value
 */
export const parseAndClampDecimal = (
  value: string, 
  limits: { min: number; max: number }
): number => {
  const parsed = parseFloat(value) || 0;
  return Math.min(Math.max(parsed, limits.min), limits.max);
};