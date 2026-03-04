import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'orange' | 'red';
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showPercentage = true,
  height = 'md',
  color = 'blue',
  animated = true
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  // Height classes
  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };
  
  // Color classes
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };
  
  const gradientClasses = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-400 to-orange-600',
    red: 'from-red-400 to-red-600'
  };
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {clampedPercentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${heightClasses[height]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`
            ${heightClasses[height]} 
            bg-gradient-to-r ${gradientClasses[color]}
            rounded-full 
            shadow-sm
            transition-all duration-700 ease-out
            ${animated ? 'transform' : ''}
            relative
            overflow-hidden
          `}
          style={{ width: `${clampedPercentage}%` }}
        >
          {/* Animated shine effect */}
          {animated && clampedPercentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Optional milestone markers */}
      {height !== 'sm' && (
        <div className="relative mt-1">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface FireProgressBridgeProps {
  currentCorpus: number;
  freedomNumber: number;
  currentAge: number;
  targetAge: number;
  isOnTrack: boolean;
}

export const FireProgressBridge: React.FC<FireProgressBridgeProps> = ({
  currentCorpus,
  freedomNumber,
  currentAge,
  targetAge,
  isOnTrack
}) => {
  const percentage = freedomNumber > 0 ? (currentCorpus / freedomNumber) * 100 : 0;
  const color = isOnTrack ? 'green' : percentage > 80 ? 'orange' : 'blue';
  const yearsLeft = targetAge - currentAge;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🌉 Your FIRE Journey Bridge
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Progress towards Financial Independence
        </p>
      </div>
      
      <ProgressBar
        percentage={percentage}
        label="Freedom Progress"
        height="lg"
        color={color}
        animated={true}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Years Left
          </div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {yearsLeft > 0 ? yearsLeft : 0}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Status
          </div>
          <div className={`text-sm font-semibold ${
            isOnTrack 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {isOnTrack ? '✅ On Track' : '⏳ Needs Boost'}
          </div>
        </div>
      </div>
    </div>
  );
};