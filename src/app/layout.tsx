import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StickyNavigation } from "@/components/ui/StickyNavigation";
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
      <head>
        {/* Favicon package from RealFaviconGenerator.net */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StickyNavigation />
        {children}
      </body>
    </html>
  );
}
