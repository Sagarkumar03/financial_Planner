import React from 'react';

// Helper to format currency amounts consistently
const formatCurrency = (amount: number) => {
  return amount.toString().replace(/(\d)(?=(\d{2})+\d(?!\d))/g, '$1,');
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
    <div className={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} text-right tracking-tight ${className}`}>
      ₹ {formatCurrency(amount)}
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
  return (
    <div className={`mb-3 ${className}`}>
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <MonetaryValue 
        amount={amount} 
        size={size} 
        color={color} 
        weight={weight}
      />
      {description && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </div>
      )}
    </div>
  );
};

// Reusable divider component
export const FinancialDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`h-px bg-blue-200 dark:bg-gray-700 my-4 ${className}`} />
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
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/30 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-amber-600 dark:text-amber-400 text-sm">{icon}</span>}
        <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">
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
        <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">
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
  return (
    <div 
      className={`mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 ${className}`}
      onClick={() => onChange(!checked)}
    >
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 underline cursor-pointer">
        {label}
      </span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${checked ? "bg-emerald-500" : "bg-gray-400"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition
            ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
};

// Export formatting utility
export { formatCurrency };