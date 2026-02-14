/**
 * Mathematical utility functions
 */

/**
 * Clamps a value between minimum and maximum bounds
 * @param value The value to clamp
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @returns The clamped value
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Formats a number with Indian comma formatting (lakhs/crores system)
 * @param value The string value to format
 * @returns Formatted number string with Indian comma notation
 */
export const formatNumber = (value: string): string => {
  const clean = value.replace(/,/g, "");
  if (clean === "") return "";
  
  // Consistent formatting that works the same on server and client
  const num = Number(clean);
  if (isNaN(num)) return clean;
  
  // Manual Indian number formatting to avoid locale inconsistencies
  return num.toString().replace(/(\d)(?=(\d{2})+\d(?!\d))/g, '$1,');
};