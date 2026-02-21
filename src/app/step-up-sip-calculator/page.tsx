import type { Metadata } from "next";
import StepUpSipCalculatorClient from "./StepUpSipCalculatorClient";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

export const metadata: Metadata = generatePageMetadata({
  title: "Step-Up SIP Calculator (Top-Up SIP) – RealMoneyCalc | Inflation-Adjusted SIP with Annual Increases",
  description: "Calculate Step-Up SIP (Top-Up SIP) returns with annual increment feature. See how increasing your SIP annually can boost wealth creation with inflation-adjusted real purchasing power calculations for India.",
  keywords: [
    "step up sip calculator",
    "top up sip calculator",
    "sip calculator with annual increment", 
    "step up sip returns",
    "top up sip returns",
    "inflation adjusted sip calculator",
    "annual increase sip calculator",
    "wealth creation calculator India",
    "mutual fund sip step up",
    "mutual fund sip top up",
    "retirement planning calculator",
    "systematic investment plan calculator",
    "real purchasing power calculator"
  ],
  path: "/step-up-sip-calculator",
});

export default function StepUpSipCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://realmoneycalc.com/step-up-sip-calculator#webapp",
        "name": "Step-Up SIP Calculator (Top-Up SIP) with Inflation Adjustment",
        "description": "Calculate Step-Up SIP returns with annual increment and inflation adjustment. See how increasing your SIP annually can boost wealth creation with real purchasing power analysis for India.",
        "url": "https://realmoneycalc.com/step-up-sip-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "Step-Up SIP calculation with annual increment",
          "Inflation-adjusted returns calculation",
          "Real purchasing power analysis",
          "Compound interest calculation",
          "Annual increment planning",
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
            "name": "Step-Up SIP Calculator",
            "item": "https://realmoneycalc.com/step-up-sip-calculator"
          }
        ]
      },
      {
        "@type": "FinancialService",
        "name": "Step-Up SIP Investment Calculator",
        "description": "Free online calculator for step-up systematic investment plan (SIP) returns with annual increment and inflation adjustment for Indian mutual funds",
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
                "name": "Step-Up SIP Calculator",
                "description": "Calculate step-up mutual fund SIP returns with annual increment and inflation adjustment"
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
      <StepUpSipCalculatorClient />
    </>
  );
}