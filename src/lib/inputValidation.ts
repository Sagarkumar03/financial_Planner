/**
 * Input validation utilities for financial calculators
 */

// Input validation limits for financial calculators
export const INPUT_LIMITS = {
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
 * @param value The string to validate
 * @returns True if the string is a valid decimal format
 */
export const isValidDecimal = (value: string): boolean => {
  return /^\d*\.?\d*$/.test(value);
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
 * Handles decimal input validation
 * @param value The input value to process
 * @returns Original value if valid, null if invalid
 */
export const handleDecimalInput = (value: string): string | null => {
  return isValidDecimal(value) ? value : null;
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