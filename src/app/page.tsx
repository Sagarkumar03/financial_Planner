import type { Metadata } from "next";
import Link from "next/link";
import { 
  PageContainer, 
  PageHeader, 
  CTAButton, 
  Footer, 
  Section,
  generatePageMetadata
} from "@/components/ui/EnhancedLayouts";
import { 
  InflationFacts, 
  InflationBanner 
} from "@/components/ui/InflationComponents";
import { CTAButtons } from "@/components/ui/CTAButtons";
import { HeroCTAButton } from "@/components/ui/HeroCTAButton";

export const metadata: Metadata = generatePageMetadata({
  title: "Free Financial Calculators with Real Inflation-Adjusted Returns",
  description: "See your true wealth growth with inflation-adjusted financial calculators. Calculate SIP returns, investment planning with real purchasing power analysis for Indian investors.",
  keywords: ["inflation adjusted calculator", "SIP calculator", "real returns", "financial planning", "purchasing power", "India"],
  path: "/",
});

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://realmoneycalc.com/#organization",
        "name": "RealMoneyCalc",
        "url": "https://realmoneycalc.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://realmoneycalc.com/logo.png",
          "width": 400,
          "height": 400
        },
        "description": "Free financial calculators with inflation-adjusted returns for smart investors in India"
      },
      {
        "@type": "WebSite",
        "@id": "https://realmoneycalc.com/#website",
        "url": "https://realmoneycalc.com",
        "name": "RealMoneyCalc - Financial Calculators",
        "description": "Calculate real inflation-adjusted returns for SIP, investments, and financial planning in India",
        "publisher": {
          "@id": "https://realmoneycalc.com/#organization"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "SIP Calculator with Inflation Adjustment",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "description": "Calculate mutual fund SIP returns with real purchasing power analysis after inflation",
        "url": "https://realmoneycalc.com/sip-calculator",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "featureList": [
          "Inflation-adjusted returns calculation",
          "Real purchasing power analysis", 
          "Monthly SIP investment planning",
          "Compound interest calculation"
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
      <PageContainer maxWidth="xl">
      {/* Hero Section */}
      <Section background="default" padding="lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="RealMoneyCalc - Financial Calculators" 
                className="w-14 h-14 sm:w-16 sm:h-16"
                width="64"
                height="64"
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>
        </div>
        <PageHeader
          title="Smart Financial Planning Starts Here"
          description="Don't just calculate returns – understand what your money will really be worth. Get inflation-adjusted insights that show your true wealth growth potential."
          className="text-center"
        />
        
        <div className="text-center mt-8">
          <HeroCTAButton />
        </div>
      </Section>

      {/* Inflation Banner */}
      <InflationBanner />

      {/* Inflation Facts */}
      <InflationFacts className="mb-8" />

      {/* Available Calculators */}
      <Section background="card" padding="lg" className="scroll-mt-8" id="calculators-section">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
          🧮 Financial Planning Calculators
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-3xl mx-auto">
          Make informed investment decisions with our <strong className="text-emerald-600 dark:text-emerald-400">inflation-adjusted calculators</strong>. 
          See both nominal returns and real purchasing power for complete financial clarity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* SIP Calculator */}
          <Link href="/sip-calculator" className="group">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  SIP Calculator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Calculate mutual fund SIP returns with <strong className="text-emerald-600 dark:text-emerald-400">real purchasing power analysis</strong>. 
                  See what your money will truly be worth after inflation.
                </p>
                <div className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  Calculate Now
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Step-up SIP Calculator */}
          <Link href="/step-up-sip-calculator" className="group">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Step-Up SIP Calculator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Calculate SIP returns with <strong className="text-blue-600 dark:text-blue-400">annual increment increases</strong>. 
                  Perfect for growing income and career progression scenarios.
                </p>
                <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
                  Calculate Now
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Lumpsum Calculator */}
          <Link href="/lumpsum-calculator" className="group">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Lumpsum Calculator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Calculate one-time investment returns with <strong className="text-purple-600 dark:text-purple-400">compound growth analysis</strong>. 
                  Perfect for one time investments.
                </p>
                <div className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  Calculate Now
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* FIRE Calculator - Coming Soon */}
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800 transition-all duration-300 opacity-75">
              {/* Coming Soon Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Coming Soon 🚀
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔥</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Financial Independence (FIRE) Calculator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Calculate your <strong className="text-orange-600 dark:text-orange-400">"Freedom Number" </strong> 
                  And realistically <strong className="text-orange-600 dark:text-orange-400">When</strong> you can retire based on your expenses and inflation-adjusted corpus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section background="gradient" padding="lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Why RealMoneyCalc?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Inflation Reality Check
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              See what your money will <em>actually</em> be worth. We show both nominal returns and real purchasing power, so you can plan with confidence.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📱</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Mobile-First Design
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Optimized for mobile use with intuitive, finger-friendly inputs. Calculate your returns anywhere, anytime, on any device.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🇮🇳</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              India-Focused
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Built specifically for Indian investors with local inflation data, market understanding, and currency formatting for accurate planning.
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section background="gradient" padding="lg">
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Plan Your Financial Future?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto text-lg">
              Join thousands of smart investors who make <strong>inflation-aware financial decisions</strong>. 
              Choose the right calculator for your planning needs.
            </p>
            <CTAButtons />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </PageContainer>
    </>
  );
}
