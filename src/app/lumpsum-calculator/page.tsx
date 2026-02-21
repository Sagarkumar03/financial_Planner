import type { Metadata } from "next";
import LumpsumCalculatorClient from "./LumpsumCalculatorClient";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

export const metadata: Metadata = generatePageMetadata({
  title: "Lumpsum Calculator – One-Time Investment Returns with Inflation Adjustment",
  description: "Calculate your lumpsum investment returns with compound growth and real purchasing power analysis. See what your one-time investment will be worth after inflation adjustment for Indian investors.",
  keywords: [
    "lumpsum calculator",
    "lumpsum investment calculator", 
    "one time investment calculator",
    "compound interest calculator",
    "lumpsum vs sip",
    "inflation adjusted lumpsum",
    "mutual fund lumpsum calculator",
    "investment calculator India",
    "lumpsum returns calculator",
    "real purchasing power calculator"
  ],
  path: "/lumpsum-calculator",
});

export default function LumpsumCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://realmoneycalc.com/lumpsum-calculator#webapp",
        "name": "Lumpsum Calculator with Inflation Adjustment",
        "description": "Calculate lumpsum investment returns with compound growth and inflation adjustment. See what your one-time investment will be worth in real purchasing power for India.",
        "url": "https://realmoneycalc.com/lumpsum-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "Lumpsum investment calculation with compound interest",
          "Inflation-adjusted returns analysis",
          "Real purchasing power evaluation",
          "Inflation Adjustment",
          "Investment planning for Indian market"
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
        "@id": "https://realmoneycalc.com/lumpsum-calculator#breadcrumb",
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
            "name": "Lumpsum Calculator",
            "item": "https://realmoneycalc.com/lumpsum-calculator"
          }
        ]
      },
      {
        "@type": "FinancialService",
        "name": "Lumpsum Investment Calculator",
        "description": "Free online calculator for lumpsum investment returns with inflation adjustment for Indian investors",
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
                "name": "Lumpsum Calculator",
                "description": "Calculate lumpsum investment returns with compound growth and inflation adjustment"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://realmoneycalc.com/lumpsum-calculator#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Lumpsum Investment and how does it work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A lumpsum investment is a one-time investment where you invest a large amount at once instead of making regular monthly investments. The money grows through compound interest over the investment period."
            }
          },
          {
            "@type": "Question", 
            "name": "Lumpsum vs SIP - Which is better?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Both have advantages. Lumpsum works well when markets are low or you have surplus funds. SIP reduces timing risk through rupee cost averaging."
            }
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://realmoneycalc.com/lumpsum-calculator#webpage",
        "url": "https://realmoneycalc.com/lumpsum-calculator",
        "name": "Lumpsum Investment Calculator",
        "description": "Free lumpsum calculator with inflation adjustment for accurate investment planning in India",
        "inLanguage": "en-IN",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://realmoneycalc.com#website"
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
      <LumpsumCalculatorClient />
    </>
  );
}