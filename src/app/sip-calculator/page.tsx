import type { Metadata } from "next";
import SipCalculatorClient from "./SipCalculatorClient";

export const metadata: Metadata = {
  title: "SIP Calculator – Calculate Mutual Fund SIP Returns Online (India)",
  description:
    "Calculate your mutual fund SIP returns with our free SIP calculator. See total investment, estimated maturity value, and inflation-adjusted returns. Designed for Indian investors.",
};

export default function SipCalculatorPage() {
  return <SipCalculatorClient />;
}
