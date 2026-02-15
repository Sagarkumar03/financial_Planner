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
  return <SipCalculatorClient />;
}
