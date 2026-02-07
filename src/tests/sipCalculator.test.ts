import { SipCalculator } from '../calculators/sip/sipCalculator';
import { SipInput, SipResult } from '../calculators/sip/sipTypes';
import { IndiaSipAssumptions } from '../calculators/sip/assumptions';

describe('SipCalculator', () => {
  let calculator: SipCalculator;

  beforeEach(() => {
    calculator = new SipCalculator();
  });

  describe('Basic SIP Calculations', () => {
    test('should calculate SIP correctly for standard inputs', () => {
      const input: SipInput = {
        monthlyInvestment: 5000,
        annualReturnRate: 12,
        investmentYears: 10,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      // Expected values calculated manually
      expect(result.totalInvested).toBe(600000); // 5000 * 12 * 10
      expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
      expect(result.inflationAdjustedValue).toBeUndefined();
    });

    test('should calculate SIP with inflation adjustment', () => {
      const input: SipInput = {
        monthlyInvestment: 5000,
        annualReturnRate: 12,
        investmentYears: 10,
        adjustForInflation: true
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(600000);
      expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
      expect(result.inflationAdjustedValue).toBeDefined();
      expect(result.inflationAdjustedValue!).toBeLessThan(result.maturityValue);
    });

    test('should handle zero return rate correctly', () => {
      const input: SipInput = {
        monthlyInvestment: 1000,
        annualReturnRate: 0,
        investmentYears: 5,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      // With 0% return, maturity value should equal total invested
      expect(result.totalInvested).toBe(60000); // 1000 * 12 * 5
      expect(result.maturityValue).toBe(60000);
    });

    test('should calculate correctly for different time periods', () => {
      const shortTermInput: SipInput = {
        monthlyInvestment: 2000,
        annualReturnRate: 10,
        investmentYears: 1,
        adjustForInflation: false
      };

      const longTermInput: SipInput = {
        monthlyInvestment: 2000,
        annualReturnRate: 10,
        investmentYears: 20,
        adjustForInflation: false
      };

      const shortResult = calculator.calculate(shortTermInput);
      const longResult = calculator.calculate(longTermInput);

      expect(shortResult.totalInvested).toBe(24000);
      expect(longResult.totalInvested).toBe(480000);
      
      // Long term should have significantly higher returns due to compounding
      const shortTermGain = shortResult.maturityValue - shortResult.totalInvested;
      const longTermGain = longResult.maturityValue - longResult.totalInvested;
      
      expect(longTermGain).toBeGreaterThan(shortTermGain * 10);
    });
  });

  describe('Edge Cases', () => {
    test('should return zero values for zero monthly investment', () => {
      const input: SipInput = {
        monthlyInvestment: 0,
        annualReturnRate: 12,
        investmentYears: 10,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(0);
      expect(result.maturityValue).toBe(0);
      expect(result.inflationAdjustedValue).toBeUndefined();
    });

    test('should return zero values for negative monthly investment', () => {
      const input: SipInput = {
        monthlyInvestment: -1000,
        annualReturnRate: 12,
        investmentYears: 10,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(0);
      expect(result.maturityValue).toBe(0);
    });

    test('should return zero values for zero investment years', () => {
      const input: SipInput = {
        monthlyInvestment: 5000,
        annualReturnRate: 12,
        investmentYears: 0,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(0);
      expect(result.maturityValue).toBe(0);
    });

    test('should return zero values for negative investment years', () => {
      const input: SipInput = {
        monthlyInvestment: 5000,
        annualReturnRate: 12,
        investmentYears: -5,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(0);
      expect(result.maturityValue).toBe(0);
    });

    test('should handle very high return rates', () => {
      const input: SipInput = {
        monthlyInvestment: 1000,
        annualReturnRate: 50,
        investmentYears: 5,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(60000);
      expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
      expect(Number.isFinite(result.maturityValue)).toBe(true);
    });
  });

  describe('Inflation Calculations', () => {
    test('should calculate inflation adjusted value correctly', () => {
      const input: SipInput = {
        monthlyInvestment: 10000,
        annualReturnRate: 15,
        investmentYears: 15,
        adjustForInflation: true
      };

      const result = calculator.calculate(input);

      expect(result.inflationAdjustedValue).toBeDefined();
      expect(result.inflationAdjustedValue!).toBeLessThan(result.maturityValue);
      
      // Inflation adjusted value should be reasonable (not zero or negative)
      expect(result.inflationAdjustedValue!).toBeGreaterThan(0);
    });

    test('should not calculate inflation adjustment when flag is false', () => {
      const input: SipInput = {
        monthlyInvestment: 10000,
        annualReturnRate: 15,
        investmentYears: 15,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.inflationAdjustedValue).toBeUndefined();
    });

    test('should handle inflation adjustment for edge cases', () => {
      const input: SipInput = {
        monthlyInvestment: 0,
        annualReturnRate: 12,
        investmentYears: 10,
        adjustForInflation: true
      };

      const result = calculator.calculate(input);

      expect(result.inflationAdjustedValue).toBe(0);
    });
  });

  describe('Custom Context', () => {
    test('should use custom assumptions when provided', () => {
      const customAssumptions = {
        inflationRate: 0.04, // 4% instead of default 6%
        currency: "USD",
        compoundingPerYear: 4  // Quarterly instead of monthly
      };

      const input: SipInput = {
        monthlyInvestment: 1000,
        annualReturnRate: 12,
        investmentYears: 5,
        adjustForInflation: true
      };

      const resultWithDefault = calculator.calculate(input);
      const resultWithCustom = calculator.calculate(input, customAssumptions);

      // Results should be different due to different compounding frequency and inflation rate
      expect(resultWithCustom.maturityValue).not.toBe(resultWithDefault.maturityValue);
      expect(resultWithCustom.inflationAdjustedValue).not.toBe(resultWithDefault.inflationAdjustedValue);
    });

    test('should use default assumptions when no context provided', () => {
      const input: SipInput = {
        monthlyInvestment: 5000,
        annualReturnRate: 10,
        investmentYears: 10,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      // Should not throw and should return valid results
      expect(result.totalInvested).toBeGreaterThan(0);
      expect(result.maturityValue).toBeGreaterThan(0);
    });
  });

  describe('Result Precision', () => {
    test('should round results to nearest integer', () => {
      const input: SipInput = {
        monthlyInvestment: 3333.33,
        annualReturnRate: 11.57,
        investmentYears: 7,
        adjustForInflation: true
      };

      const result = calculator.calculate(input);

      // All monetary results should be whole numbers
      expect(result.totalInvested % 1).toBe(0);
      expect(result.maturityValue % 1).toBe(0);
      if (result.inflationAdjustedValue) {
        expect(result.inflationAdjustedValue % 1).toBe(0);
      }
    });

    test('should handle decimal inputs correctly', () => {
      const input: SipInput = {
        monthlyInvestment: 1000.50,
        annualReturnRate: 12.25,
        investmentYears: 5,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBeGreaterThan(0);
      expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
      expect(Number.isFinite(result.totalInvested)).toBe(true);
      expect(Number.isFinite(result.maturityValue)).toBe(true);
    });
  });

  describe('Real World Scenarios', () => {
    test('should calculate typical retirement planning scenario', () => {
      const input: SipInput = {
        monthlyInvestment: 10000,
        annualReturnRate: 12,
        investmentYears: 25,
        adjustForInflation: true
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(3000000); // 10k * 12 * 25
      expect(result.maturityValue).toBeGreaterThan(15000000); // Should be substantial
      expect(result.inflationAdjustedValue).toBeDefined();
      expect(result.inflationAdjustedValue!).toBeGreaterThan(result.totalInvested);
    });

    test('should calculate short-term goal scenario', () => {
      const input: SipInput = {
        monthlyInvestment: 15000,
        annualReturnRate: 8,
        investmentYears: 3,
        adjustForInflation: false
      };

      const result = calculator.calculate(input);

      expect(result.totalInvested).toBe(540000); // 15k * 12 * 3
      expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
      
      // For short term, gains should be moderate
      const gain = result.maturityValue - result.totalInvested;
      expect(gain).toBeGreaterThan(50000);
      expect(gain).toBeLessThan(200000);
    });
  });
});