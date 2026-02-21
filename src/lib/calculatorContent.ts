// Shared content for financial calculators
export const COMMON_CONTENT = {
  disclaimers: {
    title: "⚠️ Important Disclaimer",
    general: "Mutual fund investments are subject to market risks. This calculator provides estimates for educational purposes only and does not guarantee returns. Past performance is not indicative of future results. Please consult with a qualified financial advisor for personalized investment advice.",
    assumptions: "Returns are computed assuming a constant annual growth rate. Inflation is assumed to remain constant throughout the investment period at the specified rate."
  },
  
  faq: {
    common: [
      {
        question: "What does inflation-adjusted value mean?",
        answer: "Inflation-adjusted value shows what your investment will be worth in today's purchasing power. For example, if you have ₹1 crore in 20 years, it shows how much stuff that money can actually buy compared to today's prices."
      },
      {
        question: "What's a realistic return expectation for SIPs?",
        answer: "Historically, diversified equity mutual funds in India have delivered 10-15% annual returns over long periods (15+ years). However, returns can be volatile in the short term. Conservative estimates of 10-12% are often used for long-term planning."
      }
    ]
  },

  helperTexts: {
    monthlyInvestment: "The amount you invest every month",
    annualReturn: "Historical equity returns: 10-15% annually",
    investmentDuration: "Longer duration = better compounding power",
    inflationRate: "Historical average: 6% annually in India"
  },

  navigation: {
    moreCalculators: {
      title: "🧮 More Calculators",
      description: "Explore other financial planning tools to build your complete investment strategy"
    }
  }
};

export const SIP_CONTENT = {
  faq: [
    {
      question: "How accurate is this SIP calculator?",
      answer: "This calculator provides estimates based on your inputs assuming constant returns. Actual mutual fund returns vary based on market performance, fund selection, and economic conditions. Use this as a planning tool, not a guarantee."
    },
    {
      question: "What does inflation-adjusted value mean?",
      answer: "Inflation-adjusted value shows what your investment will be worth in today's purchasing power. For example, if you have ₹1 crore in 20 years, it shows how much stuff that money can actually buy compared to today's prices."
    },
    {
      question: "What's a realistic return expectation for SIPs?",
      answer: "Historically, diversified equity mutual funds in India have delivered 10-15% annual returns over long periods (15+ years). However, returns can be volatile in the short term. Conservative estimates of 10-12% are often used for long-term planning."
    }
  ]
};

export const STEP_UP_SIP_CONTENT = {
  faq: [
    {
      question: "What is Step-Up SIP and how does it work?",
      answer: "A Step-Up SIP allows you to increase your monthly investment amount periodically (usually annually) by a predetermined percentage. For example, if you start with ₹10,000/month with 10% annual increase, your SIP becomes ₹11,000 in year 2, ₹12,100 in year 3, and so on."
    },
    {
      question: "What should be the ideal step-up percentage?",
      answer: "A step-up of 10-15% annually is common and aligns with typical salary increments. This helps you maintain the same lifestyle while increasing investments proportionally with income growth. Conservative investors can start with 5-8%, while aggressive investors might choose 15-20%."
    },
    {
      question: "How much more can I earn with Step-Up SIP vs regular SIP?",
      answer: "Step-Up SIP can significantly boost your corpus. With 10% annual increases, you might earn 40-60% more than regular SIP over 15-20 years. The exact benefit depends on your step-up percentage, investment duration, and market returns."
    }
  ],
  
  benefits: {
    title: "📈 Step-Up SIP Benefits",
    description: "By increasing your SIP by {increment}% annually, you're keeping pace with salary increments and inflation!"
  }
};