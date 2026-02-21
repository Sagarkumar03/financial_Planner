"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StickyNavigationProps {
  className?: string;
}

export function StickyNavigation({ className = "" }: StickyNavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      const shouldShow = window.scrollY > 100;
      setIsVisible(shouldShow);
    }
  }, []);

  useEffect(() => {
    // Set hydration flag
    setIsHydrated(true);
    
    // Only add scroll listeners after hydration
    if (typeof window === 'undefined') return;

    // Throttle scroll events to max 60fps
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const isHomePage = pathname === "/";

  // Don't render on server to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${className}`}
      suppressHydrationWarning
    >
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo - CLS Optimized */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              aria-label="RealMoneyCalc homepage"
            >
              <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-sm border border-gray-200 dark:border-gray-700 w-11 h-11 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="RealMoneyCalc" 
                  className="w-8 h-8"
                  width="32"
                  height="32"
                  loading="eager"
                  decoding="sync"
                />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm whitespace-nowrap">
                RealMoneyCalc
              </span>
            </Link>

            {/* Navigation Links - Fixed Width Container */}
            <div className="flex items-center space-x-4 min-w-0">
              {!isHomePage && (
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                  aria-label="Go to homepage"
                >
                  Home
                </Link>
              )}
              
              <div className="flex items-center">
                {isHomePage ? (
                  <button
                    onClick={() => {
                      if (typeof document !== 'undefined') {
                        const calculatorsSection = document.getElementById('calculators-section');
                        calculatorsSection?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    type="button"
                    aria-label="Scroll to calculators section"
                  >
                    Calculators
                  </button>
                ) : pathname === "/sip-calculator" || pathname === "/step-up-sip-calculator" ? (
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    type="button"
                    aria-label="Scroll to top of page"
                  >
                    ↑ Top
                  </button>
                ) : (
                  <Link
                    href="/sip-calculator"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    aria-label="Go to SIP Calculator page"
                  >
                    SIP Calculator
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}