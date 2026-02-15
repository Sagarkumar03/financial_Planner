import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://realmoneycalc.com"),
  title: {
    default: "Financial Calculators | RealMoneyCalc",
    template: "%s | RealMoneyCalc"
  },
  description: "Free online financial calculators for SIP, investments, and financial planning in India",
  keywords: ["SIP calculator", "financial planning", "investment calculator", "mutual funds", "India"],
  authors: [{ name: "RealMoneyCalc" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://realmoneycalc.com",
    title: "Financial Calculators | RealMoneyCalc",
    description: "Free online financial calculators for SIP, investments, and financial planning in India",
    siteName: "RealMoneyCalc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Calculators | RealMoneyCalc",
    description: "Free online financial calculators for SIP, investments, and financial planning in India",
  },
  other: {
    "google-site-verification": "iJ5IchthSOP80pdR4bTs9X6gDj7KLNiuYj1qM3lvOEc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
