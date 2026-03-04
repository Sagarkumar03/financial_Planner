import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

// Code splitting: Lazy load the main calculator component
const FireCalculatorClient = dynamic(() => import("./FireCalculatorClient"), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  ),
  ssr: true, // Keep SSR for SEO benefits
});

export const metadata: Metadata = generatePageMetadata({
  title: "FIRE Calculator – Real Inflation-Adjusted Financial Independence & Early Retirement Planner (2026)",
  description: "Calculate your path to Financial Independence (FIRE) with realistic projections. See your Freedom Number, retirement timeline, and track progress with inflation-adjusted calculations for Indian investors.",
  keywords: ["FIRE calculator", "Financial Independence calculator", "early retirement calculator", "Freedom Number", "Safe withdrawal rate", "FIRE India", "retirement planning", "financial freedom"],
  path: "/fire-calculator",
});

export default function FireCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://realmoneycalc.com/fire-calculator#webapp",
        "name": "FIRE Calculator - Financial Independence Planner",
        "description": "Calculate your path to Financial Independence (FIRE) with realistic projections including inflation, step-up savings, and safe withdrawal rates. Plan your early retirement in India.",
        "url": "https://realmoneycalc.com/fire-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "Freedom Number calculation",
          "Early retirement timeline planning",
          "Step-up SIP projections", 
          "Safe withdrawal rate analysis",
          "Inflation-adjusted projections",
          "Progress tracking towards FIRE",
          "Gap analysis and recommendations",
          "Financial Independence planning for India"
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
            "name": "FIRE Calculator",
            "item": "https://realmoneycalc.com/fire-calculator"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is FIRE (Financial Independence, Retire Early)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "FIRE is a movement focused on achieving financial independence early through aggressive saving and investing. The goal is to accumulate enough wealth (your 'Freedom Number') so that you can live off investment returns without actively working."
            }
          },
          {
            "@type": "Question", 
            "name": "How is the Freedom Number calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Your Freedom Number is calculated using the Safe Withdrawal Rate (SWR) formula: Freedom Number = Annual Expenses ÷ Safe Withdrawal Rate. For example, if your annual expenses are ₹6 lakhs and you use a 4% SWR, your Freedom Number is ₹1.5 crores."
            }
          },
          {
            "@type": "Question",
            "name": "What is a Safe Withdrawal Rate (SWR)?", 
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SWR is the percentage of your corpus you can withdraw annually without depleting your wealth. The popular '4% rule' suggests you can withdraw 4% annually. In India, due to higher inflation, many prefer 3-3.5%. This calculator uses 3.3% as the conservative default."
            }
          },
          {
            "@type": "Question",
            "name": "Is FIRE realistic in India?",
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": "Yes, FIRE is achievable in India but requires discipline and higher savings rates (40-60% of income). Many Indians achieve FIRE by combining aggressive saving, smart investing in equity mutual funds, and starting early (20s-30s). The key is consistent investing and letting compound interest work."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Calculate Your FIRE Number",
        "description": "Step-by-step guide to calculate when you can achieve Financial Independence",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Calculate Annual Expenses",
            "text": "Determine your current annual living expenses. This includes housing, food, transportation, healthcare, and lifestyle costs."
          },
          {
            "@type": "HowToStep", 
            "name": "Apply Safe Withdrawal Rate",
            "text": "Divide annual expenses by your chosen safe withdrawal rate (typically 3-4%). This gives you your Freedom Number."
          },
          {
            "@type": "HowToStep",
            "name": "Plan Your Savings",
            "text": "Calculate how much you need to save monthly with step-up increments to reach your Freedom Number by your target retirement age."
          },
          {
            "@type": "HowToStep",
            "name": "Track Progress", 
            "text": "Monitor your progress regularly and adjust savings or retirement timeline as needed based on your actual returns and life changes."
          }
        ]
      },
      {
        "@type": "FinancialService",
        "name": "FIRE Investment Calculator",
        "description": "Free online Financial Independence Retire Early (FIRE) calculator with inflation adjustment and step-up savings for Indian investors",
        "provider": {
          "@type": "Organization",
          "name": "RealMoneyCalc"
        },
        "serviceType": "Investment Calculator",
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
                "name": "FIRE Calculator",
                "description": "Calculate Financial Independence timeline with step-up savings and withdrawal rate analysis"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense 
        fallback={
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <FireCalculatorClient />
      </Suspense>
    </>
  );
}