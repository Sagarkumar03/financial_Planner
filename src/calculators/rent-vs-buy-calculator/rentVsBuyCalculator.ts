import { RentVsBuyInputs, RentVsBuyResult, RentVsBuyAssumptions, YearlyBreakdown } from './rentVsBuyTypes';

export class RentVsBuyCalculator {
  calculate(inputs: RentVsBuyInputs, assumptions: RentVsBuyAssumptions): RentVsBuyResult {
    // 1. Calculate EMI
    const loanAmount = inputs.propertyPrice * (1 - inputs.downPaymentPercent / 100);
    const monthlyInterestRate = inputs.loanInterestRate / 100 / 12;
    const totalMonths = inputs.loanTenure * 12;
    
    const monthlyEMI = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / 
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

    // 2. Calculate upfront costs
    const downPayment = inputs.propertyPrice * (inputs.downPaymentPercent / 100);
    const transactionCosts = inputs.propertyPrice * (inputs.transactionCostPercent / 100);
    const totalUpfrontBuying = downPayment + transactionCosts;
    
    const securityDeposit = inputs.monthlyRent * inputs.securityDepositMonths;
    const totalUpfrontRenting = securityDeposit;
    
    // 3. Initial wealth gap (renter's advantage)
    const initialRenterAdvantage = totalUpfrontBuying - totalUpfrontRenting;
    let renterSIP = initialRenterAdvantage;
    
    // 4. Initialize tracking variables
    let currentRent = inputs.monthlyRent;
    let currentMaintenance = inputs.monthlyMaintenance;
    let totalRentPaid = 0;
    let totalInterestPaid = 0;
    let remainingLoan = loanAmount;
    let breakEvenYear: number | null = null;
    const yearlyBreakdown: YearlyBreakdown[] = [];
    
    // 5. Monthly simulation - using loan tenure as analysis period
    const totalSimulationMonths = inputs.loanTenure * 12;
    
    for (let month = 1; month <= totalSimulationMonths; month++) {
      // Calculate monthly costs
      const buyerOutflow = monthlyEMI + currentMaintenance;
      const renterOutflow = currentRent;
      const monthlySavings = buyerOutflow - renterOutflow;
      
      // Add savings BEFORE compounding so the money works for the full month
      renterSIP += monthlySavings;
      renterSIP = renterSIP * (1 + inputs.sipReturn / 100 / 12);
      
      totalRentPaid += currentRent;
      
      // Calculate interest portion of EMI
      if (remainingLoan > 0) {
        const monthlyInterest = remainingLoan * monthlyInterestRate;
        const monthlyPrincipal = monthlyEMI - monthlyInterest;
        totalInterestPaid += monthlyInterest;
        remainingLoan = Math.max(0, remainingLoan - monthlyPrincipal);
      }
      
      // Apply annual updates every 12 months
      if (month % 12 === 0) {
        const currentYear = Math.floor(month / 12);
        
        const propertyValue = inputs.propertyPrice * Math.pow(1 + inputs.propertyAppreciationRate / 100, currentYear);
        
        // --- CHANGE 1: CORRECTED BUYER NET WORTH ---
        // Equity = Value - Debt. This was the main reason for your Year 1 break-even bug.
        const buyerNetWorth = propertyValue - remainingLoan; 
        
        const renterNetWorth = renterSIP + securityDeposit;
        
        // --- CHANGE 2: REFINED BREAK-EVEN LOGIC ---
        // Checking for buyerNetWorth > renterNetWorth works now because debt is subtracted.
        if (breakEvenYear === null && buyerNetWorth > renterNetWorth) {
          breakEvenYear = currentYear;
        }
        
        yearlyBreakdown.push({
          year: currentYear,
          buyerNetWorth,
          renterNetWorth,
          cumulativeRentPaid: totalRentPaid,
          propertyValue,
          renterSIPBalance: renterSIP,
          
          // Inflation-adjusted values (purchasing power in today's money)
          inflationAdjustedBuyerNetWorth: buyerNetWorth / Math.pow(1 + inputs.inflationRate / 100, currentYear),
          inflationAdjustedRenterNetWorth: renterNetWorth / Math.pow(1 + inputs.inflationRate / 100, currentYear),
          inflationAdjustedAdvantage: Math.abs(buyerNetWorth - renterNetWorth) / Math.pow(1 + inputs.inflationRate / 100, currentYear),
        });
        
        // Apply annual increases
        currentRent *= (1 + inputs.annualRentHike / 100);
        currentMaintenance *= (1 + inputs.maintenanceIncreasePercent / 100);
      }
    }
    
    // 6. Final calculations - using loan tenure as analysis period
    const finalPropertyValue = inputs.propertyPrice * Math.pow(1 + inputs.propertyAppreciationRate / 100, inputs.loanTenure);
    
    // --- CHANGE 3: FINAL BUYER WEALTH ADJUSTMENT ---
    // At loan completion, buyer owns the property outright (no remaining debt).
    const finalBuyerWealth = finalPropertyValue - remainingLoan; 
    const finalRenterWealth = renterSIP + securityDeposit;
    
    // 7. Determine winner
    const winner = finalBuyerWealth > finalRenterWealth ? 'buying' : 'renting';
    const advantageAmount = Math.abs(finalBuyerWealth - finalRenterWealth);
    
    // 8. Inflation adjustments - using loan tenure as analysis period
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, inputs.loanTenure);
    const inflationAdjustedAdvantage = advantageAmount / inflationFactor;
    
    // --- CHANGE 4: ADJUSTED PROPERTY VALUE OUTPUT ---
    // Usually, users want to see the "Net Wealth" (Equity), not just the house price.
    const inflationAdjustedBuyerWealth = finalBuyerWealth / inflationFactor;
    const inflationAdjustedRenterWealth = finalRenterWealth / inflationFactor;
    
    return {
      winner,
      advantageAmount,
      finalPropertyValue: finalBuyerWealth, // Returning Equity for consistency
      finalRenterWealth,
      totalRentPaid,
      breakEvenYear,
      monthlyEMI,
      totalUpfrontBuying,
      totalUpfrontRenting,
      inflationAdjustedAdvantage,
      inflationAdjustedPropertyValue: inflationAdjustedBuyerWealth,
      inflationAdjustedRenterWealth,
      totalInterestPaid,
      initialRenterAdvantage,
      yearlyBreakdown
    };
  }
}