import type { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";

export const metadata: Metadata = {
  title: "SIP Calculator – Calculate Mutual Fund SIP Returns Online (India)",
  description:
    "Calculate your mutual fund SIP returns with our free SIP calculator. See total investment, estimated maturity value, and inflation-adjusted returns. Designed for Indian investors.",
  keywords: ["SIP calculator", "mutual fund calculator", "SIP returns", "investment calculator", "India"],
  alternates: {
    canonical: "/sip-calculator",
  },
  openGraph: {
    title: "SIP Calculator – Calculate Mutual Fund SIP Returns Online (India)",
    description: "Calculate your mutual fund SIP returns with our free SIP calculator. See total investment, estimated maturity value, and inflation-adjusted returns.",
    url: "https://realmoneycalc.com/sip-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIP Calculator – Calculate Mutual Fund SIP Returns Online (India)",
    description: "Calculate your mutual fund SIP returns with our free SIP calculator. See total investment, estimated maturity value, and inflation-adjusted returns.",
  },
};

export default function SipCalculatorPage() {
  return <SipCalculatorClient />;
}
