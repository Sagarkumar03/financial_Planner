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

export const FIRE_CONTENT = {
  faq: [
    {
      question: "What is FIRE (Financial Independence, Retire Early)?",
      answer: "FIRE is a movement focused on achieving financial independence early through aggressive saving and investing. The goal is to accumulate enough wealth (your 'Freedom Number') so that you can live off investment returns without actively working. This calculator helps determine how much you need and when you can achieve this goal."
    },
    {
      question: "What is the Freedom Number and how is it calculated?",
      answer: "Your Freedom Number is the total corpus needed to maintain your lifestyle without working. It's calculated using the Safe Withdrawal Rate (SWR) formula: Freedom Number = Annual Expenses ÷ Safe Withdrawal Rate. For example, if your annual expenses are ₹6 lakhs and you use a 4% SWR, your Freedom Number is ₹1.5 crores."
    },
    {
      question: "What is Safe Withdrawal Rate (SWR)?",
      answer: "SWR is the percentage of your corpus you can withdraw annually without depleting your wealth. The popular '4% rule' suggests you can withdraw 4% annually and your money should last 30+ years. In India, due to higher inflation, many prefer 3-3.5%. This calculator uses 3.3% as the conservative default."
    },
    {
      question: "Why does this calculator use step-up SIP instead of flat SIP?",
      answer: "Step-up SIP is more realistic as your income typically grows 8-15% annually. By increasing your FIRE savings proportionally, you stay on track with your goals while maintaining your current lifestyle. A 10% annual step-up can increase your final corpus by 50-80% compared to a flat SIP."
    },
    {
      question: "How much should I save for FIRE?",
      answer: "A common guideline is the 25x rule: Save 25 times your annual expenses. However, the exact amount depends on your lifestyle, risk tolerance, and withdrawal rate. This calculator considers inflation, making it more accurate than simple rules of thumb. Typically, saving 40-60% of income accelerates FIRE significantly."
    },
    {
      question: "Is FIRE realistic in the Indian context?",
      answer: "Yes, but it requires discipline and higher savings rates than Western countries due to different social safety nets and inflation patterns. Many Indians achieve FIRE by combining aggressive saving (40-60% of income), smart investing in equity mutual funds, and sometimes real estate. Starting early (20s-30s) gives you the biggest advantage."
    },
    {
      question: "What if I can't retire by my target age?",
      answer: "The calculator shows your actual retirement timeline and the additional monthly savings needed to meet your target. You can adjust your plan by: increasing monthly savings, extending your retirement age by 2-3 years, reducing post-retirement expenses, or finding additional income sources. Small adjustments can make a big difference."
    }
  ],
  
  benefits: {
    title: "🔥 FIRE Calculator Benefits",
    description: "Calculate your path to Financial Independence with realistic projections including inflation and step-up savings!"
  },
  
  assumptions: {
    title: "📊 Key Assumptions Used",
    items: [
      "Annual Savings Step-up: {stepUp}% (compounds annually)",
      "Inflation Rate: {inflation}% (affects expenses and calculations)", 
      "Pre-Retirement Returns: {preReturns}% (equity mutual fund average)",
      "Post-Retirement Returns: {postReturns}% (conservative portfolio)",
      "Safe Withdrawal Rate: {swr}% (sustainable withdrawal)",
      "Post-Retirement Expenses: {expenseRatio}% of current expenses"
    ]
  }
};

export const LOAN_VS_SIP_CONTENT = {
  faq: [
    {
      question: "Should I prepay my loan or invest in SIP?",
      answer: "It depends on your loan interest rate vs expected SIP returns, risk tolerance, and liquidity needs. Our calculator helps you compare both strategies with different allocation splits. Generally, if your loan interest is higher than expected SIP returns, prioritize prepayment. If SIP returns are higher and you can tolerate risk, lean towards investing."
    },
    {
      question: "What is the optimal split between prepayment and SIP?", 
      answer: "There's no universal answer as it depends on personal circumstances. A balanced 50/50 approach often works well, reducing loan burden while building wealth. Conservative investors might prefer 70% prepayment, while aggressive investors might choose 70% SIP. Consider your risk tolerance, emergency fund, and other financial goals."
    },
    {
      question: "Are the SIP returns in this calculator guaranteed?",
      answer: "No, SIP returns are market-linked and not guaranteed. Our calculator uses expected returns for illustration purposes. Actual returns may vary significantly based on market conditions, fund selection, and economic cycles. Loan prepayment provides guaranteed savings equal to your loan interest rate."
    },
    {
      question: "Should I consider tax implications in my decision?",
      answer: "Absolutely! Loan prepayment saves post-tax money, while SIP gains are subject to capital gains tax. For home loans, prepayment also reduces tax benefits on interest paid (up to ₹2 lakhs under Section 24). Consider consulting a tax advisor for personalized advice."
    },
    {
      question: "What about emergency fund and liquidity?",
      answer: "Never compromise your emergency fund for loan prepayment. SIP investments can be redeemed if needed (though not ideal), but prepaid loan amounts cannot be retrieved. Maintain 6-12 months of expenses in liquid funds before aggressive prepayment. Consider this when deciding your split strategy."
    },
    {
      question: "How does inflation affect this comparison?",
      answer: "Inflation erodes the real burden of fixed-rate loans over time, making prepayment relatively less attractive. However, it also affects your future purchasing power. Our calculator shows inflation-adjusted values to help you understand the real impact of both strategies on your wealth."
    }
  ],
  
  benefits: {
    title: "🎯 Loan vs SIP Strategy Benefits", 
    description: "Find your optimal balance between reducing debt and building wealth with our smart allocation calculator!"
  },

  assumptions: {
    title: "📊 Key Assumptions Used",
    items: [
      "Loan Interest Rate: {loanRate}% (guaranteed savings rate)",
      "Expected SIP Return: {sipReturn}% (market-linked, not guaranteed)", 
      "Annual Step-up: {stepUp}% (applies to both prepayment and SIP)",
      "Inflation Rate: {inflation}% (affects real purchasing power)",
      "Split Strategy: {prepayPercent}% Prepayment / {sipPercent}% Investment",
      "Investment Horizon: Based on remaining loan tenure"
    ]
  }
};