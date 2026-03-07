import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

// Code splitting: Lazy load the main calculator component
const LoanVsSipCalculatorClient = dynamic(() => import("./LoanVsSipCalculatorClient"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  ),
  ssr: true, // Keep SSR for SEO benefits
});

export const metadata: Metadata = generatePageMetadata({
  title: "EMI vs SIP Calculator: Loan Prepayment vs Investment (2026)",
  description: "Should you prepay your loan EMI or invest in SIP? Calculate the optimal split strategy between EMI prepayment and SIP investment with real inflation-adjusted analysis for Indian investors.",
  keywords: [
    "loan prepayment calculator", 
    "loan vs sip calculator", 
    "loan vs step up sip calculator", 
    "loan vs lumpsum calculator", 
    "prepayment vs investment calculator",
    "home loan prepayment calculator",
    "sip vs loan prepayment", 
    "sip vs emi calculator india",
    "emi vs sip calculator india",
    "emi prepayment vs sip calculator",
    "home loan emi vs sip",
    "sip vs loan prepay with annual step up",
    "loan vs investment India",
    "prepayment strategy calculator"
  ],
  path: "/loan-vs-sip",
});

export default function LoanVsSipCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://realmoneycalc.com/loan-vs-sip#webapp",
        "name": "EMI vs SIP Calculator",
        "description": "Strategic financial calculator to decide between EMI prepayment and SIP investment with inflation-adjusted analysis for Indian borrowers.",
        "url": "https://realmoneycalc.com/loan-vs-sip",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "EMI prepayment vs SIP comparison",
          "Home loan EMI vs SIP analysis",
          "Strategic fund allocation analysis", 
          "Inflation-adjusted calculations",
          "Total financial benefit calculation",
          "Interest savings analysis",
          "Wealth creation projections",
          "Monthly vs lumpsum investment options",
          "Flexible split strategy (0-100%)",
          "Loan tenure reduction calculation",
          "Real purchasing power analysis",
          "Financial planning for Indian investors"
        ],
        "author": {
          "@type": "Organization",
          "name": "RealMoneyCalc",
          "url": "https://realmoneycalc.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://realmoneycalc.com/logo.png"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://realmoneycalc.com/loan-vs-sip#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://realmoneycalc.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "EMI vs SIP Calculator",
            "item": "https://realmoneycalc.com/loan-vs-sip"
          }
        ]
      },
      {
        "@type": "FinancialService",
        "@id": "https://realmoneycalc.com/loan-vs-sip#service",
        "name": "EMI Prepayment vs SIP Analysis",
        "description": "Free online calculator to compare home loan EMI prepayment vs SIP investment strategies with inflation adjustment for Indian borrowers and investors",
        "provider": {
          "@type": "Organization",
          "name": "RealMoneyCalc"
        },
        "serviceType": "Financial Planning Calculator",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Financial Calculators",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Loan vs SIP Calculator",
                "description": "Compare loan prepayment vs SIP investment with strategic allocation"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://realmoneycalc.com/loan-vs-sip#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Should I prepay my home loan EMI or invest in SIP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The decision depends on your EMI interest rate, expected SIP returns, tax benefits, and risk tolerance. Our calculator helps you compare both options with inflation-adjusted projections to find the optimal strategy."
            }
          },
          {
            "@type": "Question", 
            "name": "What is the optimal allocation between loan prepayment and SIP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The optimal allocation varies based on interest rate differential, tax implications, and your financial goals. Our dynamic allocation feature helps you find the precise split that maximizes your total financial benefit."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate are the inflation-adjusted calculations?",
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": "Our projections use historical inflation rates (6% average for India) and can be customized in Advanced Options. All results show both nominal values and real purchasing power to help you make informed decisions."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://realmoneycalc.com/loan-vs-sip#howto",
        "name": "How to Use EMI vs SIP Calculator",
        "description": "Step-by-step guide to optimize your EMI prepayment vs SIP investment strategy",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter Loan Details",
            "text": "Input your loan amount, interest rate, and remaining tenure to establish baseline"
          },
          {
            "@type": "HowToStep", 
            "position": 2,
            "name": "Set Available Funds",
            "text": "Specify the additional amount available for prepayment or SIP investment"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Adjust Allocation",
            "text": "Use the dynamic slider to test different allocation percentages between prepayment and SIP"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Review Results", 
            "text": "Compare total financial benefits, interest savings, and wealth creation across strategies"
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Optimize Strategy",
            "text": "Fine-tune using Advanced Options for returns, step-ups, and inflation assumptions"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }>
        <LoanVsSipCalculatorClient />
      </Suspense>
    </>
  );
}