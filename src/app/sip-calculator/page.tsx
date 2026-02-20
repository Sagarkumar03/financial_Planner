import type { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

export const metadata: Metadata = generatePageMetadata({
  title: "SIP Calculator – Real Inflation-Adjusted Mutual Fund Returns (2025)",
  description: "Calculate your SIP returns with true inflation-adjusted purchasing power. See what your mutual fund investments will really be worth in today's money. Free SIP calculator for Indian investors.",
  keywords: ["SIP calculator", "inflation adjusted SIP", "mutual fund calculator", "real returns", "purchasing power", "SIP planning", "India"],
  path: "/sip-calculator",
});

export default function SipCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://realmoneycalc.com/sip-calculator#webapp",
        "name": "SIP Calculator with Inflation Adjustment",
        "description": "Calculate mutual fund SIP returns with real purchasing power analysis. See what your money will actually be worth after inflation in India.",
        "url": "https://realmoneycalc.com/sip-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "Monthly SIP calculation",
          "Inflation-adjusted returns",
          "Real purchasing power analysis",
          "Compound interest calculation",
          "Investment planning for India"
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
            "name": "SIP Calculator",
            "item": "https://realmoneycalc.com/sip-calculator"
          }
        ]
      },
      {
        "@type": "FinancialService",
        "name": "SIP Investment Calculator",
        "description": "Free online calculator for systematic investment plan (SIP) returns with inflation adjustment for Indian mutual funds",
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
                "name": "SIP Calculator",
                "description": "Calculate mutual fund SIP returns with inflation adjustment"
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
      <SipCalculatorClient />
    </>
  );
}
