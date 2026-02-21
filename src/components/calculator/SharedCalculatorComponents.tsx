import React from 'react';
import { Section, Navigation } from '@/components/ui/EnhancedLayouts';
import { COMMON_CONTENT } from '@/lib/calculatorContent';

interface CalculatorDisclaimerProps {
  additionalText?: string;
}

export const CalculatorDisclaimer: React.FC<CalculatorDisclaimerProps> = ({ additionalText }) => (
  <Section background="gradient" padding="lg" className="mt-8">
    <div className="text-center mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {COMMON_CONTENT.disclaimers.title}
      </h3>
      <div className="text-xs text-gray-700 dark:text-gray-400 space-y-2 max-w-3xl mx-auto leading-relaxed">
        <p>
          {additionalText || COMMON_CONTENT.disclaimers.assumptions}
        </p>
        <p>
          <strong>{COMMON_CONTENT.disclaimers.general.split('.')[0]}.</strong> {COMMON_CONTENT.disclaimers.general.split('.').slice(1).join('.')}
        </p>
      </div>
    </div>
  </Section>
);

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorFAQProps {
  specificFAQ: FAQItem[];
  includeCommon?: boolean;
}

export const CalculatorFAQ: React.FC<CalculatorFAQProps> = ({ 
  specificFAQ, 
  includeCommon = true 
}) => {
  const allFAQ = includeCommon 
    ? [...specificFAQ, ...COMMON_CONTENT.faq.common]
    : specificFAQ;

  return (
    <Section background="card" padding="lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        🤔 Frequently Asked Questions
      </h2>
      
      <div className="space-y-6">
        {allFAQ.map((item, index) => (
          <div key={index}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {item.question}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

interface MoreCalculatorsProps {
  currentPath: string;
}

export const MoreCalculators: React.FC<MoreCalculatorsProps> = ({ currentPath }) => (
  <Section background="default" padding="md">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {COMMON_CONTENT.navigation.moreCalculators.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {COMMON_CONTENT.navigation.moreCalculators.description}
      </p>
      <Navigation currentPath={currentPath} className="justify-center" />
    </div>
  </Section>
);