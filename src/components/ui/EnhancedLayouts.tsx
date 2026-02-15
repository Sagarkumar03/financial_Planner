import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// Enhanced main page container with mobile-first design
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  gradient?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  className = '',
  gradient = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };

  const gradientBg = gradient 
    ? 'bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700'
    : 'bg-gray-50 dark:bg-gray-900';

  return (
    <div className={`min-h-screen ${gradientBg}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </div>
  );
};

// Enhanced page header with SEO-optimized structure
interface PageHeaderProps {
  title: string;
  description: string;
  icon?: string;
  breadcrumb?: { label: string; href: string }[];
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumb,
  className = ''
}) => {
  return (
    <header className={`mb-8 ${className}`}>
      {/* Breadcrumb navigation */}
      {breadcrumb && (
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            {breadcrumb.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                <Link
                  href={crumb.href}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Main header content */}
      <div className="text-center sm:text-left">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
            <span className="text-3xl sm:text-4xl">{icon}</span>
          </div>
        )}
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto sm:mx-0 leading-relaxed">
          {description}
        </p>
      </div>
    </header>
  );
};

// Navigation component for the app
interface NavigationProps {
  currentPath?: string;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath = '/',
  className = ''
}) => {
  const navItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'SIP Calculator', href: '/sip-calculator', icon: '📈' },
  ];

  return (
    <nav className={`mb-6 ${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPath === item.href
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-gray-600'
              }
            `}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// CTA (Call-to-Action) button component
interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  href,
  children,
  icon,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center font-semibold rounded-xl 
        transform hover:scale-105 transition-all duration-200
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  );
};

// Footer component
interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">
          © 2025 RealMoneyCalc. Made with ❤️ for smart investors in India.
        </p>
        <p className="text-xs">
          All calculations are estimates for educational purposes only. 
          Please consult with a financial advisor for personalized advice.
        </p>
      </div>
    </footer>
  );
};

// SEO helper functions
export const generatePageMetadata = (config: {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  image?: string;
}): Metadata => {
  const { title, description, keywords = [], path, image } = config;
  
  const url = `https://realmoneycalc.com${path}`;
  const fullTitle = path === '/' ? title : `${title} | RealMoneyCalc`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'financial calculator', 'India', 'investment planning', 'inflation adjusted'],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: image ? [image] : [],
    },
  };
};

// Mobile-optimized section wrapper
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'gradient' | 'card';
  padding?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'default',
  padding = 'md',
  id
}) => {
  const backgrounds = {
    default: '',
    gradient: 'bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/10 dark:to-blue-900/10',
    card: 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700'
  };

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <section
      id={id}
      className={`rounded-xl ${backgrounds[background]} ${paddings[padding]} mb-6 ${className}`}
    >
      {children}
    </section>
  );
};