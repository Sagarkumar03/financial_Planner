"use client";

import React, { useState, useEffect } from 'react';
import { formatNumber } from '@/lib/mathUtils';

// Mobile-optimized form input with enhanced UX
interface MobileFormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'currency' | 'percentage' | 'number';
  placeholder?: string;
  helperText?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
  unit?: string;
  className?: string;
  isHydrated?: boolean;
}

export const MobileFormInput: React.FC<MobileFormInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  type = 'number',
  placeholder,
  helperText,
  min,
  max,
  step,
  icon,
  unit,
  className = '',
  isHydrated = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = React.useId();
  const helperTextId = React.useId();
  
  const displayValue = type === 'currency' && isHydrated ? formatNumber(value) : value;
  
  const getInputMode = () => {
    switch (type) {
      case 'currency':
        return 'numeric';
      case 'percentage':
        return 'decimal';
      default:
        return 'decimal';
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    switch (type) {
      case 'currency':
        return '10,000';
      case 'percentage':
        return '12.0';
      default:
        return '';
    }
  };

  const getAriaLabel = () => {
    let ariaLabel = label;
    if (type === 'currency') {
      ariaLabel += ' in Indian Rupees';
    } else if (type === 'percentage') {
      ariaLabel += ' as a percentage';
    }
    return ariaLabel;
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
          {label}
        </div>
        {helperText && (
          <span id={helperTextId} className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1 block">
            {helperText}
          </span>
        )}
      </label>
      
      <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.01]' : ''}`}>
        <div className="relative">
          {type === 'currency' && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium" aria-hidden="true">
              ₹
            </div>
          )}
          
          <input
            id={inputId}
            type="text"
            inputMode={getInputMode()}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={getPlaceholder()}
            aria-label={getAriaLabel()}
            aria-describedby={helperText ? helperTextId : undefined}
            min={min}
            max={max}
            step={step}
            suppressHydrationWarning={true}
            className={`
              w-full h-14 text-lg font-medium border-2 rounded-xl shadow-sm
              transition-all duration-200 ease-in-out
              ${type === 'currency' ? 'pl-8 pr-4' : 'px-4'}
              ${unit ? 'pr-12' : ''}
              ${isFocused 
                ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-900/30 bg-white dark:bg-gray-800' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700'
              }
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:bg-white dark:focus:bg-gray-800
            `}
          />
          
          {unit && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium" aria-hidden="true">
              {unit}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced mobile toggle switch
interface MobileToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: string;
  className?: string;
}

export const MobileToggle: React.FC<MobileToggleProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  icon,
  className = ''
}) => {
  const labelId = React.useId();
  const descriptionId = React.useId();
  
  return (
    <div 
      className={`
        mb-6 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
        ${checked 
          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20' 
          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
        }
        ${className}
      `}
      onClick={() => onChange(!checked)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
            <span id={labelId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </span>
          </div>
          {description && (
            <p id={descriptionId} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <button
          id={id}
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onChange(!checked);
          }}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300
            ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900
          `}
        >
          <span className="sr-only">
            {checked ? 'Turn off' : 'Turn on'} {label}
          </span>
          <span
            className={`
              inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
};

// Quick preset buttons for common values
interface QuickPresetsProps {
  label: string;
  presets: { label: string; value: string }[];
  onPresetSelect: (value: string) => void;
  currentValue?: string;
  className?: string;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
  label,
  presets,
  onPresetSelect,
  currentValue,
  className = ''
}) => {
  const labelId = React.useId();
  
  return (
    <div className={`mb-4 ${className}`}>
      <div id={labelId} className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={labelId}>
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onPresetSelect(preset.value)}
            aria-label={`Set ${label.toLowerCase()} to ${preset.label}`}
            aria-pressed={currentValue === preset.value}
            className={`
              px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200
              ${currentValue === preset.value
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};