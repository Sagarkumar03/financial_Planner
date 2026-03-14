"use client";

import React, { useState, useMemo } from 'react';
import { YearlyBreakdown } from '@/calculators/rent-vs-buy-calculator/rentVsBuyTypes';
import { formatCurrency } from '@/components/ui/FinancialDisplay';

interface YearByYearBreakdownProps {
  yearlyData: YearlyBreakdown[];
  breakEvenYear: number | null;
  winner: 'buying' | 'renting';
  loanTenure: number;
}

interface YearCard {
  year: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  advantage: number;
  advantageType: 'buying' | 'renting';
  isBreakEven: boolean;
  isFinal: boolean;
  
  // Inflation-adjusted values
  inflationAdjustedBuyerNetWorth: number;
  inflationAdjustedRenterNetWorth: number;
  inflationAdjustedAdvantage: number;
}

const YearByYearBreakdown: React.FC<YearByYearBreakdownProps> = ({
  yearlyData,
  breakEvenYear,
  winner,
  loanTenure,
}) => {
  const [showLevel, setShowLevel] = useState<'milestone' | 'expanded' | 'all'>('milestone');

  // Memoize the processed data to avoid recalculating on each render
  const processedData = useMemo((): YearCard[] => {
    return yearlyData.map((data) => {
      const roundedBuyerNetWorth = Math.round(data.buyerNetWorth);
      const roundedRenterNetWorth = Math.round(data.renterNetWorth);
      const advantage = Math.abs(roundedBuyerNetWorth - roundedRenterNetWorth);
      const advantageType = roundedBuyerNetWorth > roundedRenterNetWorth ? 'buying' : 'renting';
      
      return {
        year: data.year,
        buyerNetWorth: roundedBuyerNetWorth,
        renterNetWorth: roundedRenterNetWorth,
        advantage,
        advantageType,
        isBreakEven: breakEvenYear === data.year,
        isFinal: data.year === loanTenure,
        
        // Inflation-adjusted values (purchasing power in today's money)
        inflationAdjustedBuyerNetWorth: Math.round(data.inflationAdjustedBuyerNetWorth),
        inflationAdjustedRenterNetWorth: Math.round(data.inflationAdjustedRenterNetWorth),
        inflationAdjustedAdvantage: Math.round(data.inflationAdjustedAdvantage),
      };
    });
  }, [yearlyData, breakEvenYear, loanTenure]);

  // Determine which years to show based on current display level
  const displayData = useMemo(() => {
    if (showLevel === 'all') {
      return processedData;
    }

    // Start with milestone years (every 5th year)
    const milestoneYears = new Set<number>();
    
    // Add every 5th year
    for (let year = 5; year <= loanTenure; year += 5) {
      milestoneYears.add(year);
    }
    
    // ALWAYS add break-even year in initial view if it exists
    if (breakEvenYear && breakEvenYear > 0) {
      milestoneYears.add(breakEvenYear);
    }
    
    // Always add final year
    milestoneYears.add(loanTenure);

    if (showLevel === 'milestone') {
      // Filter to only show milestone years (including break-even)
      return processedData.filter(data => milestoneYears.has(data.year));
    }

    // Expanded level: fill in gaps between milestones
    const expandedYears = new Set(milestoneYears);
    const sortedMilestones = Array.from(milestoneYears).sort((a, b) => a - b);
    
    for (let i = 0; i < sortedMilestones.length - 1; i++) {
      const start = sortedMilestones[i];
      const end = sortedMilestones[i + 1];
      const gap = end - start;
      
      if (gap > 5) {
        // Add one year in the middle of large gaps
        const middle = Math.floor((start + end) / 2);
        expandedYears.add(middle);
      } else if (gap > 2) {
        // Fill smaller gaps completely
        for (let year = start + 1; year < end; year++) {
          expandedYears.add(year);
        }
      }
    }

    return processedData.filter(data => expandedYears.has(data.year));
  }, [processedData, showLevel, breakEvenYear, loanTenure]);

  const handleShowMore = () => {
    if (showLevel === 'milestone') {
      setShowLevel('expanded');
    } else if (showLevel === 'expanded') {
      setShowLevel('all');
    }
  };

  if (processedData.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          📊 Year-by-Year Breakdown
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Track how wealth evolves over time with inflation-adjusted purchasing power
        </p>
      </div>

      <div className="space-y-4">
        {displayData.map((data) => (
          <YearCardComponent
            key={data.year}
            data={data}
            winner={winner}
          />
        ))}
      </div>

      {/* Show More Button */}
      {showLevel !== 'all' && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors duration-200"
          >
            <span>Show More Years</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {showLevel === 'milestone' 
              ? `Showing ${displayData.length} milestone years • ${processedData.length - displayData.length} more available`
              : `Showing ${displayData.length} years • ${processedData.length - displayData.length} more available`
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Memoized individual card component for performance
const YearCardComponent = React.memo<{
  data: YearCard;
  winner: 'buying' | 'renting';
}>(({ data, winner }) => {
  const isWinning = data.advantageType === winner;
  
  return (
    <div 
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${data.isBreakEven 
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/10 ring-2 ring-emerald-100 dark:ring-emerald-800' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {/* Break-even badge */}
      {data.isBreakEven && (
        <div className="absolute -top-2 -right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            🎉 Break-even
          </span>
        </div>
      )}

      {/* Final year badge */}
      {data.isFinal && (
        <div className="absolute -top-2 -left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            🏁 Final
          </span>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Year {data.year}
        </h4>
        <div className="text-right">
          <div className={`
            text-sm font-medium
            ${data.advantageType === 'buying' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-blue-600 dark:text-blue-400'
            }
          `}>
            {data.advantageType === 'buying' ? '🏠 Buying' : '🏡 Renting'} Leads
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            by {formatCurrency(data.advantage)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Nominal Values */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              🏠 Buyer Equity
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(data.buyerNetWorth)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              💰 Renter Wealth
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(data.renterNetWorth)}
            </span>
          </div>
        </div>

        {/* Advantage summary */}
        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center">
            <div className={`
              px-3 py-1 rounded-full text-center
              ${data.advantageType === 'buying' 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : 'bg-blue-50 dark:bg-blue-900/20'
              }
            `}>
              <div className="flex items-center justify-between min-w-0">
                <span className={`
                  text-sm font-medium mr-2
                  ${data.advantageType === 'buying' 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-blue-700 dark:text-blue-400'
                  }
                `}>
                  {data.advantageType === 'buying' ? '🏠' : '🏡'} Advantage
                </span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {formatCurrency(data.advantage)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className={`
                  mr-2 opacity-75
                  ${data.advantageType === 'buying' 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-blue-700 dark:text-blue-400'
                  }
                `}>
                  Today's value
                </span>
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  {formatCurrency(data.inflationAdjustedAdvantage)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

YearCardComponent.displayName = 'YearCardComponent';

export default YearByYearBreakdown;