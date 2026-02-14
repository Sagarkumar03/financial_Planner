import React from 'react';

// Reusable page heading component
interface PageHeadingProps {
  title: string;
  className?: string;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ title, className = '' }) => {
  return (
    <h1 className={`text-2xl font-medium text-gray-900 dark:text-gray-100 mb-4 leading-snug ${className}`}>
      {title}
    </h1>
  );
};

// Reusable description paragraph component
interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Description: React.FC<DescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

// Reusable form input with label component
interface FormInputProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  inputMode?: 'numeric' | 'decimal' | 'text';
  suppressHydrationWarning?: boolean;
  className?: string;
  inputClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  helperText,
  value,
  onChange,
  onBlur,
  type = 'text',
  inputMode = 'text',
  suppressHydrationWarning = false,
  className = 'mb-4',
  inputClassName = 'w-full border rounded p-2'
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
        {label}
        {helperText && (
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {helperText}
          </span>
        )}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        suppressHydrationWarning={suppressHydrationWarning}
        className={inputClassName}
      />
    </div>
  );
};

// Reusable section divider
export const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`h-px bg-gray-200 dark:bg-gray-700 my-8 ${className}`} />;
};

// Reusable disclaimer section component
interface DisclaimerSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const DisclaimerSection: React.FC<DisclaimerSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <section className={`text-xs text-gray-700 dark:text-gray-400 mt-8 leading-relaxed ${className}`}>
      <h2 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
};

// Reusable FAQ section component
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  items: FAQItem[];
  className?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  items,
  className = ''
}) => {
  return (
    <section className={`mt-10 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {title}
      </h2>
      
      {items.map((item, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {item.question}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
            {item.answer}
          </p>
        </div>
      ))}
    </section>
  );
};

// Reusable main container component
interface MainContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const MainContainer: React.FC<MainContainerProps> = ({
  children,
  maxWidth = 'md',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <main className={`${maxWidthClasses[maxWidth]} mx-auto p-4 ${className}`}>
      {children}
    </main>
  );
};

// Export commonly used classes
export const commonClasses = {
  input: 'w-full border rounded p-2',
  label: 'block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2',
  helperText: 'text-xs text-gray-600 dark:text-gray-400',
  sectionSpacing: 'mb-6'
};