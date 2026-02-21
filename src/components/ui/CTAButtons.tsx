"use client";

import { CTAButton } from "@/components/ui/EnhancedLayouts";

interface CTAButtonsProps {
  className?: string;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({ className = '' }) => {
  const scrollToCalculators = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('calculators-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${className}`}>
      <button 
        onClick={scrollToCalculators}
        className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <span className="mr-2">🧮</span>
        Explore All Calculators
      </button>
      <CTAButton 
        href="/sip-calculator" 
        variant="secondary"
        icon="📈"
        size="md"
      >
        Start with SIP Calculator
      </CTAButton>
    </div>
  );
};