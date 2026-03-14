import type { Metadata } from "next";
import RentVsBuyCalculatorClient from "./RentVsBuyCalculatorClient";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";

export const metadata: Metadata = generatePageMetadata({
  title: "Rent vs Buy Calculator India 2026 | Wealth & Opportunity Cost",
  description: "Use our interactive Rent vs Buy Calculator to see your wealth projection. Our 2026 simulator factors in SIP returns on downpayments and rental inflation to show your true break-even year.",
  keywords: [
    "rent vs buy calculator india 2026",
    "opportunity cost of home buying india",
    "SIP vs Real Estate returns",
    "property appreciation vs inflation india",
    "home loan vs rent calculator",
    "rental yield india 2026",
    "wealth comparison rent vs buy",
    "housing break even year calculator",
    "is buying a house worth it in 2026",
    "RealMoneyCalc rent vs buy",
  ],
  path: "/rent-vs-buy-calculator"
});

export default function RentVsBuyCalculatorPage() {
  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://realmoneycalc.com/rent-vs-buy-calculator#webpage",
      "url": "https://realmoneycalc.com/rent-vs-buy-calculator",
      "name": "Rent vs Buy Calculator India 2026 | Wealth & Opportunity Cost",
      "isPartOf": { "@id": "https://realmoneycalc.com/#website" },
      "breadcrumb": { "@id": "https://realmoneycalc.com/rent-vs-buy-calculator#breadcrumbs" },
      "description": "Use our interactive Rent vs Buy Calculator to see your wealth projection. Our 2026 simulator factors in SIP returns on downpayments and rental inflation to show your true break-even year.",
      "mainEntity": { "@id": "https://realmoneycalc.com/rent-vs-buy-calculator#webapp" }
    },
    {
      "@type": "WebApplication",
      "@id": "https://realmoneycalc.com/rent-vs-buy-calculator#webapp",
      "name": "Rent vs Buy Calculator India 2026",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "url": "https://realmoneycalc.com/rent-vs-buy-calculator",
      "softwareVersion": "2026.03",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "featureList": [
        "Opportunity Cost of Down Payment",
        "SIP vs Property Wealth Simulator",
        "EMI vs Rent Comparison",
        "Break-even Analysis",
        "Inflation-Adjusted Results"
      ],
      "author": {
        "@type": "Organization",
        "name": "RealMoneyCalc",
        "url": "https://realmoneycalc.com"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://realmoneycalc.com/rent-vs-buy-calculator#breadcrumbs",
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
          "name": "Rent vs Buy Calculator",
          "item": "https://realmoneycalc.com/rent-vs-buy-calculator"
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
      <RentVsBuyCalculatorClient />
    </>
  );
}