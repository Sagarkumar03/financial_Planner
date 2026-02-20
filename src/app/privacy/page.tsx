import type { Metadata } from "next";
import { 
  PageContainer, 
  PageHeader, 
  Section, 
  Footer 
} from "@/components/ui/EnhancedLayouts";
import { generatePageMetadata } from "@/components/ui/EnhancedLayouts";
import Link from "next/link";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy – RealMoneyCalc | Data Protection & Privacy Information",
  description: "Learn how RealMoneyCalc protects your privacy. Our client-side calculators don't store your financial data, ensuring complete privacy for your planning.",
  keywords: ["privacy policy", "data protection", "financial privacy", "client-side calculator", "secure financial planning"],
  path: "/privacy",
});

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Privacy policy and data protection information for RealMoneyCalc",
    "url": "https://realmoneycalc.com/privacy",
    "publisher": {
      "@type": "Organization",
      "name": "RealMoneyCalc"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <PageContainer maxWidth="lg">
        {/* Header with Logo */}
        <div className="text-center pt-6 pb-2">
          <Link href="/" className="inline-block hover:scale-105 transition-transform duration-200">
            <img 
              src="/logo.png" 
              alt="RealMoneyCalc" 
              className="w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-xl"
              width="112"
              height="112"
              loading="eager"
              decoding="sync"
            />
          </Link>
        </div>

        <PageHeader
          title="Privacy Policy"
          description="How we protect your privacy and handle data"
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy', href: '/privacy' }
          ]}
        />

        {/* Main Content */}
        <Section background="card" padding="lg">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            {/* Last Updated */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Last Updated: February 2026
            </p>

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At <strong>RealMoneyCalc</strong>, we value your privacy. This policy explains how we handle information when you visit our website.
              </p>
            </div>

            {/* 1. Information We Do Not Collect */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔒</span>
                1. Information We Do Not Collect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                RealMoneyCalc is designed as a "client-side" tool. This means the financial data you input into our calculators (such as SIP amounts, returns, or inflation rates) is processed in your own browser. We do not store, save, or have access to the financial data you input.
              </p>
            </div>

            {/* 2. Cookies and Analytics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                2. Cookies and Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may use standard cookies and tools like Google Analytics to understand how visitors interact with our site (e.g., which calculators are most popular). This data is anonymized and does not include personally identifiable information.
              </p>
            </div>

            {/* 3. Advertisements */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💼</span>
                3. Advertisements
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may display advertisements from third-party networks (like Google AdSense). These partners may use cookies to serve ads based on your prior visits to this or other websites.
              </p>
            </div>

            {/* 4. Data Security */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🛡️</span>
                4. Data Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use industry-standard security measures (SSL encryption) to protect your connection to our website. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            {/* 5. Contact Us */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📬</span>
                5. Contact Us
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                If you have any questions regarding this Privacy Policy, you can contact the developer at <strong>contact@realmoneycalc.com</strong>.
              </p>
            </div>

            {/* Privacy Highlight */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-400 p-6 rounded-r-lg">
              <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                <strong>Your Financial Data Stays Private:</strong> All calculations happen in your browser. We never see or store your personal financial information.
              </p>
            </div>

          </div>
        </Section>

        {/* Footer */}
        <Footer />
      </PageContainer>
    </>
  );
}