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
  title: "About – RealMoneyCalc | Solo Developer Building Smart Financial Tools",
  description: "Meet the developer behind RealMoneyCalc - learn about my mission to provide India's most realistic inflation-adjusted financial calculators and empower smart investment decisions.",
  keywords: ["about realmoneycalc", "financial calculator developer", "solo developer", "inflation-adjusted planning", "India financial tools"],
  path: "/about",
});

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About RealMoneyCalc",
    "description": "Meet the solo developer behind RealMoneyCalc and learn about the mission to provide realistic financial planning tools for Indian investors",
    "url": "https://realmoneycalc.com/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "RealMoneyCalc",
      "description": "Solo-developed financial planning calculators with inflation adjustment for Indian investors",
      "url": "https://realmoneycalc.com",
      "foundingDate": "2025",
      "founder": {
        "@type": "Person",
        "name": "Developer",
        "description": "Software engineer passionate about personal finance and realistic financial planning"
      },
      "mission": "To provide realistic, inflation-adjusted financial calculators that show real purchasing power"
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
          title="About RealMoneyCalc"
          description="Empowering smart financial decisions with inflation-adjusted insights"
          breadcrumb={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' }
          ]}
        />

        {/* Main Content */}
        <Section background="card" padding="lg">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            
            {/* Mission Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                My Mission: Financial Transparency Beyond the Surface
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Most financial calculators tell you what your money will look like in the future. At RealMoneyCalc, I tell you what that money will actually buy.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The biggest silent threat to long-term wealth is inflation. A ₹1 Crore retirement corpus sounds impressive today, but at a 6% inflation rate, its purchasing power will be significantly less in 20 years. I built this platform to give investors in India a more honest, "real-world" view of their financial future.
              </p>
            </div>

            {/* Why I Built This Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💡</span>
                Why I Built This
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Hi, I'm the <strong>solo developer</strong> behind RealMoneyCalc.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                As a software engineer with a passion for personal finance, I realized that most online SIP and investment tools ignore the impact of inflation. They show you "nominal" numbers that look great on paper but can lead to under-saving for critical life goals.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                I decided to combine my technical background with financial mathematics to create a suite of tools that focus on Real Value.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                My goal is simple: To provide clean, fast, and mathematically realistic calculators that help you plan for your "Real" future—not just a number on a screen.
              </p>
            </div>

            {/* What Makes This Different */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                What Makes This Different?
              </h2>
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Inflation-Centric</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Every tool I build has inflation adjustment at its core, not as an afterthought.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Privacy First</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    I don't ask for your personal data, bank details, or contact info. Your financial planning stays between you and your browser.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Unbiased & Free</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    RealMoneyCalc is an independent project. I am not here to sell you specific mutual funds or insurance products. I provide the math; you make the decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* The Math Behind the Tools */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔢</span>
                The Math Behind the Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                My calculators use standard financial compounding formulas adjusted for the Consumer Price Index (CPI) trends in India. I believe in "Show Your Work," which is why I provide detailed breakdowns of total investment, wealth gain, and inflation-adjusted maturity values.
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