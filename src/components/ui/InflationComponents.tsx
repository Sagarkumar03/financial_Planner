import React from 'react';
import { formatCurrency } from '@/components/ui/FinancialDisplay';

// Eye-catching inflation impact component
interface InflationImpactProps {
  currentAmount: number;
  futureAmount: number;
  years: number;
  inflationRate: number;
  className?: string;
}

export const InflationImpact: React.FC<InflationImpactProps> = ({
  currentAmount,
  futureAmount,
  years,
  inflationRate,
  className = ''
}) => {
  const purchasingPower = futureAmount / Math.pow(1 + inflationRate / 100, years);
  const percentageLoss = ((futureAmount - purchasingPower) / futureAmount) * 100;

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200/80 dark:border-amber-700/50 ${className}`}>
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">⚠️</div>
        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
          Real Value After Inflation
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/70 dark:bg-amber-900/30 rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
            Nominal Value
          </div>
          <div className="text-xl font-bold text-amber-900 dark:text-amber-100">
            ₹{formatCurrency(futureAmount)}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            What you'll receive
          </div>
        </div>
        
        <div className="bg-white/70 dark:bg-amber-900/30 rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
            Real Value (Today's Money)
          </div>
          <div className="text-xl font-bold text-amber-900 dark:text-amber-100">
            ₹{formatCurrency(purchasingPower)}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            Actual purchasing power
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-sm text-amber-800 dark:text-amber-200 mb-2">
          <strong>{percentageLoss.toFixed(1)}%</strong> of value lost to inflation over {years} years
        </div>
        <div className="text-xs text-amber-700 dark:text-amber-300">
          Based on {inflationRate}% average annual inflation rate
        </div>
      </div>
    </div>
  );
};

// Inflation awareness banner
interface InflationBannerProps {
  className?: string;
}

export const InflationBanner: React.FC<InflationBannerProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-4xl">💡</div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold mb-2">
            Why Inflation-Adjusted Returns Matter
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Don't just look at the final number! <strong className="text-white">Real purchasing power</strong> is what matters. 
            Our calculators show you what your money will actually be worth in today's terms.
          </p>
        </div>
      </div>
    </div>
  );
};

// Quick inflation facts component
interface InflationFactsProps {
  className?: string;
}

export const InflationFacts: React.FC<InflationFactsProps> = ({ className = '' }) => {
  const facts = [
    {
      period: '10 Years',
      value: '₹1 Lakh',
      realValue: '₹56,000',
      icon: '📊'
    },
    {
      period: '15 Years', 
      value: '₹1 Lakh',
      realValue: '₹42,000',
      icon: '📉'
    },
    {
      period: '20 Years',
      value: '₹1 Lakh',
      realValue: '₹31,000', 
      icon: '⏰'
    }
  ];

  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200/50 dark:border-amber-700/30 ${className}`}>
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">📊</div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
          Inflation Impact on Money
        </h2>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          At 6% average inflation, here's what happens to your money:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {facts.map((fact, index) => (
          <div key={index} className="bg-white/60 dark:bg-amber-900/30 rounded-lg p-4 text-center border border-amber-200/30">
            <div className="text-2xl mb-2">{fact.icon}</div>
            <div className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
              {fact.period}
            </div>
            <div className="text-lg font-bold text-amber-900 dark:text-amber-100">
              {fact.value} → {fact.realValue}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Real purchasing power
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-xs text-amber-700 dark:text-amber-300 italic">
          *Based on 6% average annual inflation rate in India
        </div>
      </div>
    </div>
  );
};

// Enhanced financial results with inflation emphasis
interface InflationAwareResultsProps {
  title: string;
  children: React.ReactNode;
  inflationMessage?: string;
  className?: string;
}

export const InflationAwareResults: React.FC<InflationAwareResultsProps> = ({
  title,
  children,
  inflationMessage,
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200/50 dark:border-gray-700 shadow-lg ${className}`}>
      {/* Header with inflation emphasis */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💰</span>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        {inflationMessage && (
          <p className="text-emerald-100 text-sm">
            {inflationMessage}
          </p>
        )}
      </div>

      {/* Results content */}
      <div className="p-6">
        {children}
      </div>

      {/* Footer message */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-b-xl p-4 border-t border-emerald-200/50 dark:border-emerald-800/50">
        <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
          <span>✨</span>
          <strong>Real Value Insight:</strong> Numbers adjusted for inflation show your true financial progress
        </div>
      </div>
    </div>
  );
};

// Inflation rate selector with education
interface InflationRateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const InflationRateSelector: React.FC<InflationRateSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const presets = [
    { label: 'Conservative (4%)', value: '4', description: 'Lower than historical average' },
    { label: 'Historical Avg (6%)', value: '6', description: 'India\'s long-term average', recommended: true },
    { label: 'Realistic (7%)', value: '7', description: 'Recent years trend' },
    { label: 'High (9%)', value: '9', description: 'Pessimistic scenario' }
  ];

  return (
    <div className={`bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/30 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-600 dark:text-amber-400">🎯</span>
        <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
          Choose Inflation Rate
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`
              text-left p-3 rounded-lg border transition-all duration-200
              ${value === preset.value
                ? 'border-amber-400 bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
                : 'border-amber-200 dark:border-amber-700 bg-white/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 hover:border-amber-300'
              }
              ${preset.recommended ? 'ring-2 ring-amber-300/50' : ''}
            `}
          >
            <div className="text-sm font-medium mb-1">
              {preset.label}
              {preset.recommended && (
                <span className="ml-2 text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              {preset.description}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-amber-700 dark:text-amber-300 text-center">
        💡 Historical average provides the most realistic long-term perspective
      </div>
    </div>
  );
};