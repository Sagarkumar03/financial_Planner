"use client";

interface HeroCTAButtonProps {
  className?: string;
}

export const HeroCTAButton: React.FC<HeroCTAButtonProps> = ({ className = '' }) => {
  const scrollToCalculators = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('calculators-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToCalculators}
      className={`
        inline-flex items-center font-semibold rounded-xl 
        transform hover:scale-105 transition-all duration-200
        bg-gradient-to-r from-emerald-600 to-blue-600 text-white 
        hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl
        px-8 py-4 text-lg
        ${className}
      `}
    >
      <span className="mr-2">🚀</span>
      Calculate Real Returns Now
    </button>
  );
};