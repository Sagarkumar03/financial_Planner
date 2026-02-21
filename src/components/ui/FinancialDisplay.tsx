import React from 'react';

// Helper to format currency amounts consistently
export const formatCurrency = (amount: number) => {
  return amount.toString().replace(/(\d)(?=(\d{2})+\d(?!\d))/g, '$1,');
};

// Helper to create screen reader friendly currency text
const formatCurrencyForScreenReader = (amount: number) => {
  const formattedAmount = formatCurrency(amount);
  return `${formattedAmount} Indian Rupees`;
};

// Helper to convert number to words for better screen reader experience
const formatAmountInWords = (amount: number) => {
  if (amount >= 10000000) { // 1 crore or more
    const crores = (amount / 10000000).toFixed(1);
    return `${crores} crores`;
  } else if (amount >= 100000) { // 1 lakh or more
    const lakhs = (amount / 100000).toFixed(1);
    return `${lakhs} lakhs`;
  } else if (amount >= 1000) { // 1 thousand or more
    const thousands = (amount / 1000).toFixed(1);
    return `${thousands} thousands`;
  }
  return formatCurrency(amount);
};

// Reusable monetary value component
interface MonetaryValueProps {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'success' | 'neutral' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const MonetaryValue: React.FC<MonetaryValueProps> = ({
  amount,
  className = '',
  size = 'xl',
  color = 'primary',
  weight = 'medium'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const colorClasses = {
    primary: 'text-blue-800 dark:text-gray-100',
    success: 'text-emerald-600 dark:text-emerald-400',
    neutral: 'text-gray-800 dark:text-gray-200',
    warning: 'text-amber-900 dark:text-amber-200'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} text-right tracking-tight ${className}`}
      aria-label={formatCurrencyForScreenReader(amount)}
      title={`${formatAmountInWords(amount)} (${formatCurrencyForScreenReader(amount)})`}
    >
      <span aria-hidden="true">
        ₹ {formatCurrency(amount)}
      </span>
    </div>
  );
};

// Reusable financial metric component
interface FinancialMetricProps {
  label: string;
  amount: number;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'success' | 'neutral' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const FinancialMetric: React.FC<FinancialMetricProps> = ({
  label,
  amount,
  description,
  size = 'xl',
  color = 'neutral',
  weight = 'medium',
  className = ''
}) => {
  const metricId = React.useId();
  const descriptionId = React.useId();
  
  return (
    <div className={`mb-3 ${className}`} role="group" aria-labelledby={metricId}>
      <div id={metricId} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <MonetaryValue 
        amount={amount} 
        size={size} 
        color={color} 
        weight={weight}
      />
      {description && (
        <div id={descriptionId} className="text-xs text-gray-600 dark:text-gray-400 mt-1" aria-label={`Additional information: ${description}`}>
          {description}
        </div>
      )}
    </div>
  );
};

// Reusable divider component
export const FinancialDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`h-px bg-blue-200 dark:bg-gray-700 my-4 ${className}`} role="separator" aria-hidden="true" />
  );
};

// Reusable results card component
interface FinancialResultsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FinancialResultsCard: React.FC<FinancialResultsCardProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <section className={`mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-blue-100 dark:border-gray-700 shadow-sm ${className}`}>
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
};

// Reusable highlighted metric component (like the inflation-adjusted value)
interface HighlightedMetricProps {
  label: string;
  amount: number;
  description?: string;
  icon?: string;
  className?: string;
}

export const HighlightedMetric: React.FC<HighlightedMetricProps> = ({
  label,
  amount,
  description,
  icon,
  className = ''
}) => {
  const metricId = React.useId();
  const descriptionId = React.useId();
  
  return (
    <div 
      className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/30 ${className}`}
      role="region"
      aria-labelledby={metricId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-amber-600 dark:text-amber-400 text-sm" aria-hidden="true">{icon}</span>}
        <div id={metricId} className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          {label}
        </div>
      </div>
      <MonetaryValue 
        amount={amount} 
        size="xl" 
        color="warning" 
        weight="bold"
      />
      {description && (
        <div id={descriptionId} className="text-xs text-amber-700 dark:text-amber-400 mt-1">
          {description}
        </div>
      )}
    </div>
  );
};

// Consistent input styling classes
export const inputClasses = "w-full border rounded p-2";

// Consistent label styling classes  
export const labelClasses = "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2";

// Consistent toggle styling
interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  id,
  checked,
  onChange,
  label,
  className = ''
}) => {
  const labelId = React.useId();
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        `}
      >
        <span className="sr-only">
          {checked ? 'Disable' : 'Enable'} {label}
        </span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <label id={labelId} htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );
};