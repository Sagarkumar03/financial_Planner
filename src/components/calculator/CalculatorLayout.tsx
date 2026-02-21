import React from 'react';
import Link from 'next/link';
import { 
  PageContainer, 
  PageHeader, 
  Footer 
} from '@/components/ui/EnhancedLayouts';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  breadcrumbLabel: string;
  breadcrumbHref: string;
  children: React.ReactNode;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  breadcrumbLabel,
  breadcrumbHref,
  children
}) => {
  return (
    <PageContainer maxWidth="lg">
      {/* Header with Logo */}
      <div className="text-center mb-4">
        <Link href="/" className="inline-flex items-center justify-center hover:opacity-80 transition-all duration-200 hover:scale-105">
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="RealMoneyCalc" 
              className="w-10 h-10 sm:w-12 sm:h-12"
              width="48"
              height="48"
              loading="eager"
              decoding="sync"
            />
          </div>
        </Link>
      </div>
      
      <PageHeader
        title={title}
        description={description}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: breadcrumbLabel, href: breadcrumbHref }
        ]}
      />

      {children}

      {/* Footer */}
      <Footer />
    </PageContainer>
  );
};