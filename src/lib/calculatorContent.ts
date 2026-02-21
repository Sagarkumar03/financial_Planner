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
      question: "Can I change my SIP amount later?",
      answer: "Yes, most mutual fund companies allow you to increase, decrease, or pause your SIP. You can also start multiple SIPs in the same fund. It's advisable to review and adjust your SIP annually based on income changes and financial goals."
    }
  ]
};

export const STEP_UP_SIP_CONTENT = {
  faq: [
    {
      question: "What is Step-Up SIP and how does it work?",
      answer: "A Step-Up SIP (also called Top-Up SIP) allows you to increase your monthly investment amount periodically (usually annually) by a predetermined percentage. For example, if you start with ₹10,000/month with 10% annual increase, your SIP becomes ₹11,000 in year 2, ₹12,100 in year 3, and so on."
    },
    {
      question: "What should be the ideal step-up percentage?",
      answer: "A step-up of 10-15% annually is common and aligns with typical salary increments. This helps you maintain the same lifestyle while increasing investments proportionally with income growth. Conservative investors can start with 5-8%, while aggressive investors might choose 15-20%."
    },
    {
      question: "How much more can I earn with Step-Up SIP vs regular SIP?",
      answer: "A Step-Up SIP significantly accelerates wealth creation by aligning your investments with your rising income. For example, a 10% annual step-up can result in a final corpus that is 50% to 80% larger than a flat SIP over a 20-year period, even if you start with the same amount. This happens because the increased contributions in later years have a massive compounding effect on a larger base."
    }
  ],
  
  benefits: {
    title: "📈 Step-Up SIP Benefits",
    description: "By increasing your SIP by {increment}% annually, you're keeping pace with salary increments and inflation!"
  }
};

export const LUMPSUM_CONTENT = {
  faq: [
    {
      question: "What is Lumpsum Investment and how does it work?",
      answer: "A lumpsum investment is a one-time investment where you invest a large amount at once instead of making regular monthly investments. The money grows through compound interest over the investment period. It's ideal when you have surplus funds like bonuses, inheritance, or maturity proceeds."
    },
    {
      question: "Lumpsum vs SIP - Which is better?",
      answer: "Both have advantages. Lumpsum works well when markets are low or you have surplus funds. SIP reduces timing risk through rupee cost averaging. If you have a large amount and markets are at reasonable levels, lumpsum can potentially generate higher returns due to longer compounding period."
    },
    {
      question: "What's the minimum amount for lumpsum investment?",
      answer: "Most mutual funds have a minimum lumpsum investment of ₹1,000 to ₹5,000. However, for meaningful wealth creation, consider investing at least ₹50,000 to ₹1 lakh. The key is ensuring you won't need this money for at least 5-7 years to ride out market volatility."
    },
    {
      question: "How much can I earn with lumpsum investment?",
      answer: "Returns depend on the asset class and time horizon. Equity mutual funds have historically delivered 10-15% annually over 10+ year periods. A ₹1 lakh lumpsum investment at 12% annual returns becomes ₹6.1 lakhs in 15 years and ₹19.6 lakhs in 25 years due to compounding power."
    }
  ],
  
  benefits: {
    title: "💰 Lumpsum Investment Benefits",
    description: "Harness the full power of compounding with your one-time investment of ₹{amount}!"
  }
};