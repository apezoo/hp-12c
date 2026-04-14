/**
 * HP-12C Key Metadata Database
 * 
 * Complete metadata for all 39 physical calculator keys, including:
 * - Primary functions
 * - Shifted functions (gold/blue)
 * - Implementation status
 * - Educational content
 * 
 * This file must load BEFORE key-info.js
 * 
 * @version 1.0
 * @author HP-12C Web Implementation Project
 */

(function() {
  'use strict';
  
  window.HP12C_KEY_METADATA = {
    // ============================================
    // FINANCIAL KEYS (5 keys) - All Planned
    // ============================================
    
    "n": {
      id: "n",
      dataKey: "n",
      label: "n",
      displayName: "Number of Periods",
      category: "financial",
      type: "key",
      
      primaryFunction: {
        title: "Number of Compounding Periods",
        description: "In Time Value of Money (TVM) calculations, the n key stores or solves for the number of compounding periods. This could be months for a loan, years for an investment, or any other time period. When you have four of the five TVM values (n, i, PV, PMT, FV), you can solve for the fifth.",
        examples: [
          "Store periods: '360 n' stores 360 months (30-year mortgage)",
          "Solve for periods: After entering i, PV, PMT, FV, press 'n' to calculate",
          "Check stored value: 'RCL .1' displays currently stored n value"
        ],
        keystrokes: "n"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "AMORT",
            title: "Amortization",
            description: "Calculates amortization for a range of loan payment periods. Shows how much goes to principal vs. interest, and remaining balance.",
            implementationStatus: "planned",
            examples: [
              "Amortize first year: '1 ENTER 12 f AMORT' shows payments 1-12",
              "Press 'x↔y' to see interest paid",
              "Press 'RCL PV' to see remaining balance"
            ],
            keystrokes: "f n"
          }
        ],
        blue: [
          {
            label: "12×",
            title: "Multiply by 12",
            description: "Multiplies the number in X register by 12. Commonly used to convert annual periods to monthly periods.",
            implementationStatus: "implemented",
            examples: [
              "Convert years to months: '5 g n' → displays 60",
              "Convert annual rate: for use with monthly i"
            ],
            keystrokes: "g n"
          }
        ]
      },
      
      shortDescription: "Stores or solves for number of compounding periods in TVM calculations",
      longDescription: "The n key is one of the five Time Value of Money registers (n, i, PV, PMT, FV) that form the core of the HP-12C's financial capabilities. The n register stores the number of compounding or payment periods in a financial calculation. For loans and mortgages, this is typically the number of monthly payments. For investments, it might be years or any other period.\n\nWhen solving TVM problems, you typically: 1) Enter known values into four of the five TVM keys, 2) Press the unknown key to solve for it, 3) The HP-12C iteratively calculates the unknown value.\n\nThe n value must match the compounding frequency of the interest rate (i). If i is monthly, n should be in months.",
      
      implementation: {
        status: "planned",
        note: "Financial engine is not implemented yet. TVM solver requires iterative Newton-Raphson algorithm for solving n, i, or FV. This is a complex implementation scheduled for Phase 5 of the project.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "On the original HP-12C, pressing 'n' without a preceding number displays the currently stored n value. Pressing a number then 'n' stores that number in the n register. When four TVM variables are known, pressing 'n' solves for the number of periods using iterative calculation, which can take 1-3 seconds.",
      
      simulatorBehavior: "Currently not implemented. The key is displayed as part of the authentic visual interface, but pressing it has no effect. The web simulator will need to implement the full TVM calculation engine before this key becomes functional.",
      
      relatedTopics: [
        "Time Value of Money (TVM)",
        "Loan Calculations",
        "Mortgage Amortization",
        "Investment Returns",
        "Compound Interest"
      ],
      
      relatedKeys: ["i", "pv", "pmt", "fv"],
      
      commonMistakes: [
        "Mismatching n and i periods (e.g., annual n with monthly i)",
        "Forgetting to convert years to months for monthly payment calculations",
        "Not understanding that n must be positive",
        "Confusing n with number of years (n is number of periods)"
      ],
      
      expertTips: [
        "Always ensure n and i use the same time period (both monthly or both annual)",
        "Use 'g n' (12×) to quickly convert years to months",
        "For a 30-year mortgage with monthly payments, n = 360 (30 × 12)",
        "When solving for n, the result may include fractional periods (e.g., 48.7 payments)"
      ]
    },
    
    "i": {
      id: "i",
      dataKey: "i",
      label: "i",
      displayName: "Interest Rate",
      category: "financial",
      type: "key",
      
      primaryFunction: {
        title: "Interest Rate per Period",
        description: "Stores or solves for the periodic interest rate in TVM calculations. Must be expressed as a percentage per period (not decimal). For monthly calculations, this is the monthly rate, not annual.",
        examples: [
          "Store monthly rate: '0.5 i' stores 0.5% per month (6% annual)",
          "Solve for rate: After entering n, PV, PMT, FV, press 'i' to calculate",
          "Annual to monthly: '6 ENTER 12 ÷ i' stores monthly rate"
        ],
        keystrokes: "i"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "INT",
            title: "Interest Amount",
            description: "After AMORT calculation, displays the total interest paid during the amortized period.",
            implementationStatus: "planned",
            examples: [
              "After 'f AMORT', press 'f i' to see interest"
            ],
            keystrokes: "f i"
          }
        ],
        blue: [
          {
            label: "12÷",
            title: "Divide by 12",
            description: "Divides the number in X register by 12. Commonly used to convert annual rates to monthly rates.",
            implementationStatus: "implemented",
            examples: [
              "Convert 6% annual to monthly: '6 g i' → displays 0.5"
            ],
            keystrokes: "g i"
          }
        ]
      },
      
      shortDescription: "Stores or solves for periodic interest rate as percentage",
      longDescription: "The i key manages the periodic interest rate in TVM calculations. On the HP-12C, interest rates are always entered and displayed as percentages (not decimals), and they must be per period. For monthly payments, enter the monthly rate. The 'g i' (12÷) function helps convert annual rates to monthly rates.\n\nSolving for i is one of the most computationally intensive operations on the HP-12C because there's no closed-form solution - it requires iterative numerical methods.",
      
      implementation: {
        status: "planned",
        note: "Requires full TVM engine with Newton-Raphson solver. Interest rate calculation is particularly complex due to lack of closed-form solution.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Stores or retrieves periodic interest rate as percentage. Solving for i can take 2-10 seconds depending on initial guess accuracy. Displays 'Error 3' if no solution converges.",
      
      simulatorBehavior: "Currently not implemented. Key press has no effect.",
      
      relatedTopics: [
        "Time Value of Money (TVM)",
        "Interest Rates",
        "APR (Annual Percentage Rate)",
        "Effective Rate vs Nominal Rate"
      ],
      
      relatedKeys: ["n", "pv", "pmt", "fv"],
      
      commonMistakes: [
        "Entering interest as decimal instead of percentage (use 5, not 0.05)",
        "Using annual rate when n is in months",
        "Forgetting that i is per period, not per year"
      ],
      
      expertTips: [
        "Always enter interest as percentage: 5% is '5 i', not '0.05 i'",
        "Use 'g i' to convert annual to monthly: '6 g i' gives 0.5% monthly",
        "Solving for i is slow - be patient, it may take several seconds"
      ]
    },
    
    "pv": {
      id: "pv",
      dataKey: "pv",
      label: "PV",
      displayName: "Present Value",
      category: "financial",
      type: "key",
      
      primaryFunction: {
        title: "Present Value",
        description: "Stores or solves for the present value in TVM calculations. Represents the current lump sum amount - the principal of a loan or the current value of an investment.",
        examples: [
          "Store loan amount: '250000 CHS PV' (negative = cash out)",
          "Solve for PV: After entering n, i, PMT, FV, press 'PV'",
          "Investment value: 'RCL PV' shows stored present value"
        ],
        keystrokes: "PV"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "NPV",
            title: "Net Present Value",
            description: "Calculates net present value of uneven cash flows stored in registers. Essential for investment analysis.",
            implementationStatus: "planned",
            examples: [
              "Store cash flows in R0-R9, then 'f PV' calculates NPV"
            ],
            keystrokes: "f PV"
          }
        ],
        blue: [
          {
            label: "CFo",
            title: "Initial Cash Flow",
            description: "Stores the initial (time=0) cash flow for NPV/IRR calculations.",
            implementationStatus: "planned",
            examples: [
              "-50000 g PV' stores initial investment"
            ],
            keystrokes: "g PV"
          }
        ]
      },
      
      shortDescription: "Present value - principal amount or current investment value",
      longDescription: "PV represents 'money now' in TVM calculations. For loans, PV is the borrowed amount (entered as negative since money flows out). For investments, PV is the current value or initial deposit. The HP-12C uses cash flow sign convention: money you receive is positive, money you pay is negative.",
      
      implementation: {
        status: "planned",
        note: "Requires TVM engine. PV has closed-form solution, making it easier to implement than n or i.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Stores or retrieves present value. Solving for PV is fast (closed-form solution). Sign convention: negative = cash outflow, positive = cash inflow.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Time Value of Money (TVM)",
        "Present Value",
        "Cash Flow Convention",
        "Loan Principal"
      ],
      
      relatedKeys: ["n", "i", "pmt", "fv"],
      
      commonMistakes: [
        "Wrong sign convention (loan principal should be negative)",
        "Confusing PV with payment amount (that's PMT)"
      ],
      
      expertTips: [
        "For loans: PV negative (you get money), PMT positive (you pay)",
        "Use CHS to change sign: '100000 CHS PV' for borrowing"
      ]
    },
    
    "pmt": {
      id: "pmt",
      dataKey: "pmt",
      label: "PMT",
      displayName: "Payment",
      category: "financial",
      type: "key",
      
      primaryFunction: {
        title: "Payment Amount",
        description: "Stores or solves for the periodic payment amount in TVM calculations. This is the regular payment made each period.",
        examples: [
          "Solve for payment: After entering n, i, PV, FV, press 'PMT'",
          "Store known payment: '1500 CHS PMT' (negative = paying out)"
        ],
        keystrokes: "PMT"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "RND",
            title: "Round",
            description: "Rounds the X register to the number of decimal places shown in the display format. Useful for rounding calculated payments to cents.",
            implementationStatus: "planned",
            examples: [
              "After calculating payment, 'f PMT' rounds to display format"
            ],
            keystrokes: "f PMT"
          }
        ],
        blue: [
          {
            label: "CFj",
            title: "Cash Flow j",
            description: "Stores individual cash flows for NPV/IRR calculations.",
            implementationStatus: "planned",
            examples: [
              "Enter series: '5000 g PMT, 6000 g PMT' stores CF1, CF2"
            ],
            keystrokes: "g PMT"
          }
        ]
      },
      
      shortDescription: "Periodic payment amount in TVM calculations",
      longDescription: "PMT is the regular payment made each period. For loans, this is your monthly payment (negative = outflow). For savings, this is your regular deposit. PMT must have opposite sign from PV in most calculations.",
      
      implementation: {
        status: "planned",
        note: "Requires TVM engine. PMT has closed-form solution.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Stores or retrieves periodic payment. Solving for PMT is fast. Sign convention applies.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Time Value of Money (TVM)",
        "Loan Payments",
        "Annuities",
        "Regular Deposits"
      ],
      
      relatedKeys: ["n", "i", "pv", "fv"],
      
      commonMistakes: [
        "Wrong sign (payment should be negative when you pay it out)",
        "Not matching payment frequency with n and i periods"
      ],
      
      expertTips: [
        "For standard loans: PV negative, PMT positive",
        "Use 'f PMT' (RND) to round calculated payments to cents"
      ]
    },
    
    "fv": {
      id: "fv",
      dataKey: "fv",
      label: "FV",
      displayName: "Future Value",
      category: "financial",
      type: "key",
      
      primaryFunction: {
        title: "Future Value",
        description: "Stores or solves for the future value in TVM calculations. The lump sum amount at the end of the investment or loan period.",
        examples: [
          "Solve for FV: After entering n, i, PV, PMT, press 'FV'",
          "Balloon payment: '50000 FV' stores final payment"
        ],
        keystrokes: "FV"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "IRR",
            title: "Internal Rate of Return",
            description: "Calculates IRR for uneven cash flows. One of the most powerful financial functions.",
            implementationStatus: "planned",
            examples: [
              "After storing cash flows, 'f FV' calculates IRR"
            ],
            keystrokes: "f FV"
          }
        ],
        blue: [
          {
            label: "Nj",
            title: "Number of times CFj occurs",
            description: "Specifies how many times the current cash flow repeats in NPV/IRR calculations.",
            implementationStatus: "planned",
            examples: [
              "'5000 g PMT 3 g FV' means $5000 occurs 3 times"
            ],
            keystrokes: "g FV"
          }
        ]
      },
      
      shortDescription: "Future value - lump sum amount at end of period",
      longDescription: "FV represents the value at the end of the time period. For savings, it's how much you'll have. For loans with balloon payments, it's the remaining balance. FV is often zero for fully-amortized loans.",
      
      implementation: {
        status: "planned",
        note: "Requires TVM engine. FV has closed-form solution for most cases, but solving for FV when it's unknown can require iterative methods.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Stores or retrieves future value. Sign convention applies. Solving for FV is typically fast.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Time Value of Money (TVM)",
        "Future Value",
        "Compound Growth",
        "Balloon Payments"
      ],
      
      relatedKeys: ["n", "i", "pv", "pmt"],
      
      commonMistakes: [
        "Forgetting FV exists (often zero for standard loans)",
        "Wrong sign convention"
      ],
      
      expertTips: [
        "For fully-amortized loans, FV = 0",
        "Use FV for balloon payment calculations"
      ]
    },
    
    // ============================================
    // NUMERIC ENTRY KEYS (11 keys) - All Implemented
    // ============================================
    
    "digit-0": {
      id: "digit-0",
      dataKey: "digit-0",
      label: "0",
      displayName: "Digit Zero",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 0",
        description: "Enters the digit 0 into the current number being typed. If starting a new number, this begins a new entry. If continuing an existing number, this appends 0 to the display.",
        examples: [
          "Type 0 alone to display 0.0000",
          "Type 1 0 to display 10.0000",
          "Type 1 0 0 to display 100.0000"
        ],
        keystrokes: "0"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "x̄",
            title: "Mean (Average)",
            description: "Calculates the arithmetic mean (average) of accumulated statistical data. Uses values stored via Σ+ key.",
            implementationStatus: "planned",
            examples: [
              "Enter data: 5 Σ+, 10 Σ+, 15 Σ+",
              "Calculate mean: g 0 → displays 10"
            ],
            keystrokes: "g 0"
          }
        ]
      },
      
      shortDescription: "Enters the digit 0",
      longDescription: "The digit 0 key is used for numeric entry in the HP-12C calculator. Like all HP calculators, the HP-12C uses Reverse Polish Notation (RPN), so numbers are entered digit-by-digit before pressing ENTER to push them onto the stack. The 0 key is essential for entering numbers with trailing zeros, whole tens/hundreds/thousands, and decimal values like 0.5.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior. Handles new number vs. continuing number states correctly.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 0 into the display. Works in both regular mode and during exponent entry (after EEX). The calculator automatically formats the display with proper decimal places based on the current display format setting.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Digit entry works correctly with display formatting, new number detection, and RPN stack lift behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Stack Lift",
        "Leading Zeros"
      ],
      
      relatedKeys: ["digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Thinking leading zeros are significant (0007 displays as 7)",
        "Forgetting that 0 alone is a valid number entry",
        "Not realizing trailing zeros after decimal ARE significant (1.50 ≠ 1.5 in some contexts)"
      ],
      
      expertTips: [
        "Use 0 to start decimal numbers: '0 . 5' for 0.5",
        "Trailing zeros matter for display: '1 . 0 0' shows 1.00",
        "The x̄ function (g 0) is fundamental for statistical analysis"
      ]
    },
    
    "digit-1": {
      id: "digit-1",
      dataKey: "digit-1",
      label: "1",
      displayName: "Digit One",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 1",
        description: "Enters the digit 1 into the current number being typed.",
        examples: [
          "Type 1 alone to display 1.0000",
          "Type 1 2 to display 12.0000",
          "Type 1 0 0 0 to display 1000.0000"
        ],
        keystrokes: "1"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "ŷ,r",
            title: "Y-Estimate and Correlation",
            description: "Calculates the estimated y-value for a given x using linear regression, and provides the correlation coefficient r.",
            implementationStatus: "planned",
            examples: [
              "Enter x,y pairs with Σ+",
              "Enter x value, press g 1 to get estimated y"
            ],
            keystrokes: "g 1"
          }
        ]
      },
      
      shortDescription: "Enters the digit 1",
      longDescription: "The digit 1 key is used for numeric entry. It's one of the most frequently used keys for entering numbers in financial calculations, counts, and basic arithmetic.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 1 into the display. Works in both regular mode and during exponent entry.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Linear Regression"
      ],
      
      relatedKeys: ["digit-0", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Forgetting to press ENTER between separate numbers"
      ],
      
      expertTips: [
        "The ŷ,r function (g 1) is powerful for forecasting and trend analysis",
        "Use 1 followed by EEX for powers of 10"
      ]
    },
    
    "digit-2": {
      id: "digit-2",
      dataKey: "digit-2",
      label: "2",
      displayName: "Digit Two",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 2",
        description: "Enters the digit 2 into the current number being typed.",
        examples: [
          "Type 2 alone to display 2.0000",
          "Type 2 5 to display 25.0000"
        ],
        keystrokes: "2"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "x̂,r",
            title: "X-Estimate and Correlation",
            description: "Calculates the estimated x-value for a given y using linear regression, and provides the correlation coefficient r.",
            implementationStatus: "planned",
            examples: [
              "Enter x,y pairs with Σ+",
              "Enter y value, press g 2 to get estimated x"
            ],
            keystrokes: "g 2"
          }
        ]
      },
      
      shortDescription: "Enters the digit 2",
      longDescription: "The digit 2 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 2 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Not pressing ENTER before starting a second number"
      ],
      
      expertTips: [
        "The x̂,r function (g 2) is the inverse of ŷ,r for regression analysis"
      ]
    },
    
    "digit-3": {
      id: "digit-3",
      dataKey: "digit-3",
      label: "3",
      displayName: "Digit Three",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 3",
        description: "Enters the digit 3 into the current number being typed.",
        examples: [
          "Type 3 alone to display 3.0000",
          "Type 1 3 to display 13.0000"
        ],
        keystrokes: "3"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "n!",
            title: "Factorial",
            description: "Calculates the factorial of the number in X register. n! = n × (n-1) × (n-2) × ... × 1",
            implementationStatus: "planned",
            examples: [
              "5 g 3 → displays 120 (5! = 5×4×3×2×1)",
              "0 g 3 → displays 1 (0! = 1 by definition)"
            ],
            keystrokes: "g 3"
          }
        ]
      },
      
      shortDescription: "Enters the digit 3",
      longDescription: "The digit 3 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 3 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Factorial",
        "Combinatorics"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Trying to calculate factorial of negative numbers (undefined)"
      ],
      
      expertTips: [
        "The n! function (g 3) is essential for probability and statistics",
        "Factorials grow extremely fast: 10! = 3,628,800"
      ]
    },
    
    "digit-4": {
      id: "digit-4",
      dataKey: "digit-4",
      label: "4",
      displayName: "Digit Four",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 4",
        description: "Enters the digit 4 into the current number being typed.",
        examples: [
          "Type 4 alone to display 4.0000",
          "Type 4 5 to display 45.0000"
        ],
        keystrokes: "4"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "D.MY",
            title: "Day.Month.Year Format",
            description: "Sets the calculator to interpret dates in Day.Month.Year format (European/International standard).",
            implementationStatus: "planned",
            examples: [
              "g 4 (set D.MY mode)",
              "25.12.2024 represents December 25, 2024"
            ],
            keystrokes: "g 4"
          }
        ]
      },
      
      shortDescription: "Enters the digit 4",
      longDescription: "The digit 4 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 4 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Date Formats"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Confusing D.MY with M.DY formats when entering dates"
      ],
      
      expertTips: [
        "D.MY format (g 4) is standard in Europe and most of the world",
        "Always verify date format setting before date calculations"
      ]
    },
    
    "digit-5": {
      id: "digit-5",
      dataKey: "digit-5",
      label: "5",
      displayName: "Digit Five",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 5",
        description: "Enters the digit 5 into the current number being typed.",
        examples: [
          "Type 5 alone to display 5.0000",
          "Type 5 0 to display 50.0000"
        ],
        keystrokes: "5"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "M.DY",
            title: "Month.Day.Year Format",
            description: "Sets the calculator to interpret dates in Month.Day.Year format (US standard).",
            implementationStatus: "planned",
            examples: [
              "g 5 (set M.DY mode)",
              "12.25.2024 represents December 25, 2024"
            ],
            keystrokes: "g 5"
          }
        ]
      },
      
      shortDescription: "Enters the digit 5",
      longDescription: "The digit 5 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 5 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Date Formats"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-6", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Confusing M.DY with D.MY formats when entering dates"
      ],
      
      expertTips: [
        "M.DY format (g 5) is standard in the United States",
        "Check your date format setting with RCL ENTER before date calculations"
      ]
    },
    
    "digit-6": {
      id: "digit-6",
      dataKey: "digit-6",
      label: "6",
      displayName: "Digit Six",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 6",
        description: "Enters the digit 6 into the current number being typed.",
        examples: [
          "Type 6 alone to display 6.0000",
          "Type 3 6 to display 36.0000"
        ],
        keystrokes: "6"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "x̄w",
            title: "Weighted Mean",
            description: "Calculates the weighted average of statistical data where x values are data points and y values are their weights.",
            implementationStatus: "planned",
            examples: [
              "Enter data,weight pairs: 85 ENTER 3 Σ+, 90 ENTER 2 Σ+",
              "Calculate: g 6 → weighted mean"
            ],
            keystrokes: "g 6"
          }
        ]
      },
      
      shortDescription: "Enters the digit 6",
      longDescription: "The digit 6 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 6 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Weighted Statistics"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-7", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Forgetting that x̄w requires paired x,y data with Σ+"
      ],
      
      expertTips: [
        "x̄w (g 6) is essential for grade calculations and weighted portfolios"
      ]
    },
    
    "digit-7": {
      id: "digit-7",
      dataKey: "digit-7",
      label: "7",
      displayName: "Digit Seven",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 7",
        description: "Enters the digit 7 into the current number being typed. If starting a new number, this begins a new entry. If continuing an existing number, this appends 7 to the display.",
        examples: [
          "Type 7 alone to display 7.0000",
          "Type 1 7 to display 17.0000",
          "Type 7 0 5 to display 705.0000"
        ],
        keystrokes: "7"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "BEG",
            title: "Begin Mode",
            description: "Sets payment timing to beginning of period for financial calculations. Used in annuity due calculations where payments occur at the start of each period.",
            implementationStatus: "planned",
            examples: [
              "Lease payment calculations",
              "Rent calculations",
              "g 7 (activate BEG mode)"
            ],
            keystrokes: "g 7"
          }
        ]
      },
      
      shortDescription: "Enters the digit 7",
      longDescription: "The digit 7 key is used for numeric entry in the HP-12C calculator. Like all HP calculators, the HP-12C uses Reverse Polish Notation (RPN), so numbers are entered digit-by-digit before pressing ENTER to push them onto the stack. The 7 key can be pressed multiple times in sequence to create numbers like 77 or 777.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior. Handles new number vs. continuing number states correctly.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 7 into the display. Works in both regular mode and during exponent entry (after EEX). The calculator automatically formats the display with proper decimal places based on the current display format setting.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Digit entry works correctly with display formatting, new number detection, and RPN stack lift behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Stack Lift",
        "Annuity Due"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-8", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Forgetting to press ENTER between two numbers (e.g., typing '5 7' gives 57, not 5 and 7)",
        "Expecting algebraic notation instead of RPN",
        "Not setting BEG mode for beginning-of-period payments"
      ],
      
      expertTips: [
        "Digits can be entered at any time - the calculator knows when to start a new number",
        "Use ENTER to explicitly separate numbers when building stack operations",
        "The BEG function (g 7) is essential for lease and rent calculations where payments are made at the beginning of each period"
      ]
    },
    
    "digit-8": {
      id: "digit-8",
      dataKey: "digit-8",
      label: "8",
      displayName: "Digit Eight",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 8",
        description: "Enters the digit 8 into the current number being typed.",
        examples: [
          "Type 8 alone to display 8.0000",
          "Type 8 8 to display 88.0000",
          "Type 1 8 0 to display 180.0000"
        ],
        keystrokes: "8"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "END",
            title: "End Mode",
            description: "Sets payment timing to end of period for financial calculations (default mode). Used in ordinary annuity calculations where payments occur at the end of each period.",
            implementationStatus: "planned",
            examples: [
              "Standard loan payments",
              "Most mortgage payments",
              "g 8 (activate END mode - default)"
            ],
            keystrokes: "g 8"
          }
        ]
      },
      
      shortDescription: "Enters the digit 8",
      longDescription: "The digit 8 key is used for numeric entry in all calculator operations. In RPN notation, digits are entered sequentially to build up numbers.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 8 into the display. Works in both regular mode and during exponent entry.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Ordinary Annuity"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-9", "decimal", "enter"],
      
      commonMistakes: [
        "Not understanding the difference between BEG and END mode"
      ],
      
      expertTips: [
        "END mode (g 8) is the default and used for most standard loans",
        "BEG mode is for leases and rent; END mode is for mortgages and car loans"
      ]
    },
    
    "digit-9": {
      id: "digit-9",
      dataKey: "digit-9",
      label: "9",
      displayName: "Digit Nine",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Digit 9",
        description: "Enters the digit 9 into the current number being typed.",
        examples: [
          "Type 9 alone to display 9.0000",
          "Type 9 9 to display 99.0000",
          "Type 1 9 8 4 to display 1984.0000"
        ],
        keystrokes: "9"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "MEM",
            title: "Memory Status",
            description: "Displays the amount of available memory for programming and storage. Shows how many program steps and registers are available.",
            implementationStatus: "planned",
            examples: [
              "g 9 → displays available memory",
              "Useful before entering long programs"
            ],
            keystrokes: "g 9"
          }
        ]
      },
      
      shortDescription: "Enters the digit 9",
      longDescription: "The digit 9 key is used for numeric entry in all calculator operations.",
      
      implementation: {
        status: "implemented",
        note: "Full digit entry with proper RPN behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters the digit 9 into the display.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior.",
      
      relatedTopics: [
        "Numeric Entry",
        "RPN (Reverse Polish Notation)",
        "Memory Management"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "decimal", "enter"],
      
      commonMistakes: [
        "Not checking memory before storing large programs"
      ],
      
      expertTips: [
        "MEM function (g 9) is essential for programmers to avoid memory overflow"
      ]
    },
    
    "decimal": {
      id: "decimal",
      dataKey: "decimal",
      label: ".",
      displayName: "Decimal Point",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Decimal Point",
        description: "Enters a decimal point in the current number. Only one decimal point is allowed per number. If pressed while entering a number, it marks the transition from the integer part to the fractional part.",
        examples: [
          "Type 3 . 1 4 to display 3.14",
          "Type . 5 to display 0.5",
          "Type 1 0 0 . to display 100."
        ],
        keystrokes: "."
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "s",
            title: "Standard Deviation",
            description: "Calculates the sample standard deviation of accumulated statistical data. Measures the amount of variation or dispersion in a data set.",
            implementationStatus: "planned",
            examples: [
              "Enter data: 10 Σ+, 20 Σ+, 30 Σ+",
              "Calculate: g . → standard deviation"
            ],
            keystrokes: "g ."
          }
        ]
      },
      
      shortDescription: "Enters decimal point in number",
      longDescription: "The decimal point key is essential for entering fractional numbers and precise values. In the HP-12C, the decimal point separates the integer and fractional parts of a number. The display format (number of decimal places shown) can be set separately and doesn't affect the internal precision of calculations, which is always maintained to 10 significant digits.",
      
      implementation: {
        status: "implemented",
        note: "Full decimal point entry. Prevents multiple decimal points in the same number. Handles leading decimal (e.g., .5 for 0.5).",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters a decimal point in the current number entry. If pressed at the start of a number, creates a number beginning with 0. (e.g., .5 = 0.5). Only one decimal point allowed per number.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Properly handles decimal point entry, prevents duplicate decimal points, and maintains internal precision.",
      
      relatedTopics: [
        "Numeric Entry",
        "Decimal Numbers",
        "Precision",
        "Display Format",
        "Statistics"
      ],
      
      relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9", "enter"],
      
      commonMistakes: [
        "Trying to enter multiple decimal points in one number",
        "Confusing display format (cosmetic) with internal precision (always 10 digits)",
        "Forgetting to press decimal point when entering fractional values"
      ],
      
      expertTips: [
        "Leading decimal works: . 5 gives 0.5",
        "Internal precision is always 10 significant digits regardless of display format",
        "The s function (g .) calculates sample standard deviation for data analysis",
        "Trailing zeros after decimal point are shown based on display format setting"
      ]
    },
    
    // ============================================
    // ARITHMETIC KEYS (4 keys) - All Implemented
    // ============================================
    
    "op-add": {
      id: "op-add",
      dataKey: "op-add",
      label: "+",
      displayName: "Addition",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Add",
        description: "Adds the Y register to the X register, consuming both values. The result is placed in X, and the stack drops down (Z→Y, T→Z, T remains in T). This is the fundamental addition operation in RPN.",
        examples: [
          "Add 5 + 3: Type '5 ENTER 3 +' → displays 8",
          "Chain addition: '10 ENTER 20 ENTER 30 + +' → displays 60",
          "Mixed operations: '100 ENTER 50 - 25 +' → displays 75"
        ],
        keystrokes: "+"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Adds Y to X (X = Y + X)",
      longDescription: "The addition key is one of the four basic arithmetic operations in the HP-12C. It operates on the two bottom stack registers: Y (second number) and X (first number). Like all HP calculators using RPN, you enter operands first, then the operation. The result replaces both operands, and the stack automatically drops down to fill the gap. This efficient design eliminates the need for an equals key and allows for natural chain calculations.",
      
      implementation: {
        status: "implemented",
        note: "Full RPN addition with proper stack drop behavior. Handles all numeric ranges correctly, including negative numbers and decimals.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Performs Y + X, stores result in X, drops stack. If the result causes overflow (exceeds 9.999999999 × 10^99), displays 'Error 0' and stops. Addition is commutative, so order of operands doesn't matter.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior including stack management and RPN semantics. Currently does not implement overflow detection for extremely large numbers.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Arithmetic Operations",
        "Stack Drop",
        "Chain Calculations"
      ],
      
      relatedKeys: ["op-subtract", "op-multiply", "op-divide", "enter", "clx", "swap-xy"],
      
      commonMistakes: [
        "Typing '5 + 3' without ENTER between (results in 53, not 8)",
        "Forgetting that addition consumes both X and Y from the stack",
        "Not understanding that the stack drops after binary operations",
        "Expecting algebraic notation with parentheses"
      ],
      
      expertTips: [
        "Chain operations without intermediate ENTER: '10 ENTER 20 + 30 +' works perfectly",
        "Addition is commutative, so order doesn't matter, but subtraction and division do",
        "Use R↓ before operations to review what's in the stack",
        "RPN chain calculations are faster than algebraic once you learn the pattern"
      ]
    },
    
    "op-subtract": {
      id: "op-subtract",
      dataKey: "op-subtract",
      label: "−",
      displayName: "Subtraction",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Subtract",
        description: "Subtracts the X register from the Y register (Y - X). The result is placed in X, and the stack drops down. Important: order matters - it's Y minus X, not X minus Y.",
        examples: [
          "Subtract 3 from 5: Type '5 ENTER 3 -' → displays 2",
          "Chain: '100 ENTER 25 - 10 -' → displays 65",
          "Negative result: '10 ENTER 20 -' → displays -10"
        ],
        keystrokes: "-"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Subtracts X from Y (X = Y - X)",
      longDescription: "The subtraction key performs Y - X, where Y is the second number entered and X is the first (most recent) number. Unlike addition, subtraction is not commutative, so order matters in RPN. After the operation, the stack drops down just like addition. To enter negative numbers, use the CHS (Change Sign) key, not the subtraction operator.",
      
      implementation: {
        status: "implemented",
        note: "Full RPN subtraction with proper stack drop behavior. Correctly handles positive, negative, and zero results.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Performs Y - X, stores result in X, drops stack. Can produce negative results. Does not require CHS for negative numbers in the result - only for entering negative numbers as input.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior including proper Y - X order and stack management.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Arithmetic Operations",
        "Negative Numbers",
        "Stack Drop"
      ],
      
      relatedKeys: ["op-add", "op-multiply", "op-divide", "chs", "enter", "clx"],
      
      commonMistakes: [
        "Confusing the order: it's Y - X, not X - Y",
        "Using subtraction key to enter negative numbers (use CHS instead)",
        "Forgetting to press ENTER between the two numbers",
        "Expecting algebraic notation"
      ],
      
      expertTips: [
        "Remember: the order is 'first ENTER second -' gives first minus second",
        "To negate a number, use CHS, not '0 x -'",
        "Chain subtractions work naturally: '100 ENTER 10 - 5 -' = 85",
        "Use x↔y to swap operands if you entered them in wrong order"
      ]
    },
    
    "op-multiply": {
      id: "op-multiply",
      dataKey: "op-multiply",
      label: "×",
      displayName: "Multiplication",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Multiply",
        description: "Multiplies the Y register by the X register (Y × X). The result is placed in X, and the stack drops down. Multiplication is commutative, so order doesn't matter.",
        examples: [
          "Multiply 5 × 3: Type '5 ENTER 3 ×' → displays 15",
          "Chain: '2 ENTER 3 × 4 ×' → displays 24",
          "Decimal: '1.5 ENTER 2.5 ×' → displays 3.75"
        ],
        keystrokes: "×"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Multiplies Y by X (X = Y × X)",
      longDescription: "The multiplication key performs Y × X operation on the two bottom stack registers. Like addition, multiplication is commutative (order doesn't matter). The operation is fundamental for scaling, unit conversions, compound calculations, and financial computations. After multiplication, the stack drops down naturally.",
      
      implementation: {
        status: "implemented",
        note: "Full RPN multiplication with proper stack behavior. Handles all numeric ranges, decimals, and negative numbers correctly.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Performs Y × X, stores result in X, drops stack. Can produce very large or very small results. Overflow/underflow handling displays 'Error 0' if result exceeds range.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior for typical numeric ranges. Does not currently implement overflow/underflow error detection.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Arithmetic Operations",
        "Scaling",
        "Unit Conversion"
      ],
      
      relatedKeys: ["op-add", "op-subtract", "op-divide", "enter", "clx"],
      
      commonMistakes: [
        "Forgetting ENTER between numbers",
        "Not understanding how multiplication works with negative numbers"
      ],
      
      expertTips: [
        "Multiplication is commutative: 5 ENTER 3 × equals 3 ENTER 5 ×",
        "Quick squaring: 5 ENTER × (duplicates X, then squares it)",
        "Use for percentage calculations: price ENTER percent ENTER 100 ÷ ×",
        "Chain multiplications work naturally without intermediate steps"
      ]
    },
    
    "op-divide": {
      id: "op-divide",
      dataKey: "op-divide",
      label: "÷",
      displayName: "Division",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Divide",
        description: "Divides the Y register by the X register (Y ÷ X). The result is placed in X, and the stack drops down. Important: order matters - it's Y divided by X, not X divided by Y. Division by zero produces an error.",
        examples: [
          "Divide 10 by 2: Type '10 ENTER 2 ÷' → displays 5",
          "Chain: '100 ENTER 2 ÷ 5 ÷' → displays 10",
          "Decimal: '22 ENTER 7 ÷' → displays 3.1428...(π approximation)"
        ],
        keystrokes: "÷"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Divides Y by X (X = Y ÷ X)",
      longDescription: "The division key performs Y ÷ X, where Y is the dividend (the number being divided) and X is the divisor (what you're dividing by). Like subtraction, division is not commutative - order matters. Division is fundamental for ratios, rates, unit conversions, and averages. Division by zero is mathematically undefined and produces an error on the HP-12C.",
      
      implementation: {
        status: "implemented",
        note: "Full RPN division with proper stack behavior. Should handle division by zero with error detection.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Performs Y ÷ X, stores result in X, drops stack. Division by zero displays 'Error 0' and stops calculation. Very small results may underflow to zero.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior for typical cases. Division by zero handling should be verified in implementation.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Arithmetic Operations",
        "Ratios",
        "Unit Conversion"
      ],
      
      relatedKeys: ["op-add", "op-subtract", "op-multiply", "reciprocal", "enter", "clx"],
      
      commonMistakes: [
        "Confusing the order: it's Y ÷ X, not X ÷ Y",
        "Division by zero",
        "Forgetting ENTER between numbers",
        "Not understanding that 1 ÷ X is different from 1/x key operation"
      ],
      
      expertTips: [
        "Remember: 'dividend ENTER divisor ÷' gives dividend/divisor",
        "For reciprocal (1/x), use the dedicated 1/x key instead of '1 ENTER x ÷'",
        "Chain divisions: '100 ENTER 2 ÷ 5 ÷' = 100÷2÷5 = 10",
        "Use x↔y to swap if you entered numbers in wrong order"
      ]
    },
    
    "chs": {
      id: "chs",
      dataKey: "chs",
      label: "CHS",
      displayName: "Change Sign",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Change Sign",
        description: "Changes the sign of the current number in X register (multiplies by -1). If you're in the middle of typing a number, it changes the sign of what you're typing. If X already has a value, it negates that value.",
        examples: [
          "Type '5 CHS' → displays -5",
          "From -5, press CHS → displays 5",
          "Type '3 ENTER 2 CHS -' → displays 5 (3 - (-2))"
        ],
        keystrokes: "CHS"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "DATE",
            title: "Date",
            description: "Displays current date stored in calculator or calculates date arithmetic. Used with calendar functions.",
            implementationStatus: "planned",
            examples: [
              "Calculate days between dates",
              "Find date N days in future/past"
            ],
            keystrokes: "g CHS"
          }
        ]
      },
      
      shortDescription: "Changes sign of X register (negates)",
      longDescription: "The CHS (Change Sign) key toggles the sign of the current value between positive and negative. This is essential for entering negative numbers in RPN calculators, since there is no minus sign on the numeric keypad. CHS can be pressed during number entry or after a number is complete. It does not affect the stack - only the X register changes.",
      
      implementation: {
        status: "implemented",
        note: "The changeSign() method is fully implemented and wired to the CHS button handler.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Changes the sign of X register immediately. Works during digit entry or on completed numbers. If pressed during exponent entry (after EEX), changes the sign of the exponent, not the mantissa.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Pressing CHS negates the X register value, works during entry and after completion.",
      
      relatedTopics: [
        "Numeric Entry",
        "Negative Numbers",
        "RPN Operations"
      ],
      
      relatedKeys: ["op-subtract", "digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9"],
      
      commonMistakes: [
        "Trying to use minus key (-) instead of CHS for negative numbers",
        "Forgetting that CHS can be pressed during or after number entry",
        "Not realizing CHS works differently during exponent entry"
      ],
      
      expertTips: [
        "CHS can be pressed at any time during number entry",
        "For negative exponents, press EEX, then the exponent digits, then CHS",
        "CHS is faster than '0 x -' for changing sign"
      ]
    },
    
    // ============================================
    // STACK OPERATION KEYS (4 keys) - All Implemented
    // ============================================
    
    "enter": {
      id: "enter",
      dataKey: "enter",
      label: "ENTER",
      displayName: "Enter",
      category: "stack",
      type: "key",
      
      primaryFunction: {
        title: "Enter / Push Stack",
        description: "Duplicates the X register into Y and pushes the entire stack up (Y→Z, Z→T, T is lost). This is how you terminate number entry and prepare for the next operation. Essential for RPN operation.",
        examples: [
          "Enter two numbers: '5 ENTER 3' → stack has 5 in Y, 3 in X",
          "Quick square: '7 ENTER ×' → displays 49",
          "Three numbers: '10 ENTER 20 ENTER 30' → ready for operations"
        ],
        keystrokes: "ENTER"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "LSTx",
            title: "Last X",
            description: "Recalls the value that was in the X register before the last operation. Useful for correcting mistakes or reusing values.",
            implementationStatus: "planned",
            examples: [
              "'5 ENTER 3 +' → displays 8",
              "'g ENTER' → recalls 3 (last X value)"
            ],
            keystrokes: "g ENTER"
          }
        ]
      },
      
      shortDescription: "Terminates number entry and pushes stack",
      longDescription: "ENTER is arguably the most important key in RPN calculators. It serves two purposes: 1) It terminates the current number entry, and 2) It duplicates the X register into Y and pushes the stack up. In RPN, you enter operands first by typing numbers separated by ENTER, then execute operations. ENTER never executes a calculation - it only prepares the stack. This elegant design eliminates the need for parentheses and an equals key.",
      
      implementation: {
        status: "implemented",
        note: "Full ENTER functionality with proper stack lift. Correctly duplicates X→Y and pushes stack. Terminates number entry mode.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Duplicates X register to Y, pushes stack (Y→Z, Z→T, T lost). Terminates number entry. After ENTER, pressing digit keys starts a new number. ENTER pressed twice duplicates X again. Does not perform calculations.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Stack lift works correctly, number entry termination works properly. Critical foundation for all RPN operations.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Number Entry",
        "Stack Lift",
        "Four-Level Stack"
      ],
      
      relatedKeys: ["clx", "roll-down", "swap-xy", "op-add", "op-subtract", "op-multiply", "op-divide"],
      
      commonMistakes: [
        "Pressing ENTER after operations (not needed - operations automatically enable stack lift)",
        "Not pressing ENTER between consecutive numbers",
        "Thinking ENTER executes calculations (it only prepares the stack)",
        "Forgetting that ENTER duplicates X, enabling quick squaring with ×"
      ],
      
      expertTips: [
        "ENTER is your separator between numbers in RPN",
        "Never press ENTER after operations - they automatically enable stack lift",
        "Double-tap ENTER for quick duplication: '5 ENTER ENTER +' gives 10",
        "ENTER + × is the fastest way to square a number",
        "LSTx (g ENTER) is invaluable for recovering from mistakes"
      ]
    },
    
    "clx": {
      id: "clx",
      dataKey: "clx",
      label: "CLx",
      displayName: "Clear X",
      category: "stack",
      type: "key",
      
      primaryFunction: {
        title: "Clear X Register",
        description: "Clears the X register to 0.0000 without affecting Y, Z, or T registers. Used to cancel the current number entry or clear an unwanted value. Does not drop the stack.",
        examples: [
          "Type '123' then CLx → displays 0",
          "After calculation, CLx → clears result",
          "'5 ENTER 7' then CLx → X=0, Y=5"
        ],
        keystrokes: "CLx"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "x=0",
            title: "Test X Equals Zero",
            description: "Tests if X register equals zero. Used in programming for conditional branching. Skips the next program step if X is zero.",
            implementationStatus: "planned",
            examples: [
              "In program: 'g CLx' tests X=0",
              "Useful for loop termination"
            ],
            keystrokes: "g CLx"
          }
        ]
      },
      
      shortDescription: "Clears X register to zero",
      longDescription: "CLx is the 'undo' or 'clear' key for the current number. It sets the X register to 0.0000 without affecting the rest of the stack (Y, Z, T remain unchanged). This is useful for starting over with a new number, clearing mistakes during entry, or resetting a calculation. Unlike some operations, CLx does not drop the stack - it only affects X. The rest of the stack remains intact.",
      
      implementation: {
        status: "implemented",
        note: "Full CLx functionality. Sets X register to 0, preserves Y/Z/T stack registers, terminates number entry mode.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Sets X register to 0.0000. Does not affect Y, Z, or T registers. Terminates number entry if currently entering a number. Often used to clear mistakes or start fresh calculations.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Properly clears X to 0, leaves stack intact, and terminates number entry mode.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Error Correction",
        "Clear Functions",
        "Programming Tests"
      ],
      
      relatedKeys: ["enter", "roll-down", "swap-xy", "on"],
      
      commonMistakes: [
        "Confusing CLx with ON (CLx only clears X; ON resets entire calculator)",
        "Expecting CLx to clear the entire stack (it only clears X)",
        "Not realizing CLx is useful during number entry to start over"
      ],
      
      expertTips: [
        "CLx during number entry = backspace/clear entire entry",
        "CLx after calculation = clear result, keep stack",
        "Use CLx rather than '0' when you want to explicitly show zero",
        "In programming, g CLx (x=0 test) is powerful for conditional logic",
        "CLx doesn't affect pending operations in Y, Z, or T"
      ]
    },
    
    "roll-down": {
      id: "roll-down",
      dataKey: "roll-down",
      label: "R↓",
      displayName: "Roll Down",
      category: "stack",
      type: "key",
      
      primaryFunction: {
        title: "Roll Stack Down",
        description: "Rotates the four stack registers downward in a circular fashion: X→T, T→Z, Z→Y, Y→X. This allows you to bring buried stack values to X for viewing or operations. Very useful for reviewing stack contents.",
        examples: [
          "Stack: T=1, Z=2, Y=3, X=4",
          "Press R↓ → T=4, Z=1, Y=2, X=3",
          "Press R↓ again → T=3, Z=4, Y=1, X=2"
        ],
        keystrokes: "R↓"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "GTO",
            title: "Go To",
            description: "In programming mode, jumps to a specified line number or label. Used for creating loops and branches in calculator programs.",
            implementationStatus: "planned",
            examples: [
              "'g R↓ 000' goes to line 000",
              "'g R↓ A' goes to label A"
            ],
            keystrokes: "g R↓"
          }
        ]
      },
      
      shortDescription: "Rotates stack down circularly",
      longDescription: "R↓ (Roll Down) is the stack manipulation key that rotates all four registers in a circular pattern. Each press moves every value down one position: what was in X goes to the top (T), T→Z, Z→Y, and Y→X. This is invaluable for inspecting stack contents (press R↓ four times to cycle through all values), rearranging values for calculations, or bringing buried numbers back to X. Unlike operations that drop the stack, R↓ preserves all four values.",
      
      implementation: {
        status: "implemented",
        note: "Full R↓ functionality with proper circular rotation. All four stack levels rotate correctly.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Rotates stack downward circularly: X→T, T→Z, Z→Y, Y→X. Press four times to return to original state. Very useful for inspecting stack without losing values. Does not affect memory or registers.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Proper circular rotation of all four stack registers.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Four-Level Stack",
        "Stack Inspection",
        "Programming (GTO)"
      ],
      
      relatedKeys: ["enter", "clx", "swap-xy"],
      
      commonMistakes: [
        "Confusing R↓ with x↔y (R↓ rotates all four levels, x↔y only swaps X and Y)",
        "Not realizing R↓ is circular (press 4 times returns to start)",
        "Forgetting that R↓ is useful for reviewing stack contents"
      ],
      
      expertTips: [
        "Press R↓ four times to cycle through and view all stack registers",
        "R↓ three times = roll up (reverse direction)",
        "Use R↓ to bring Z or T values down to X for operations",
        "Combination: 'x↔y R↓' performs useful stack rearrangements",
        "In programming, g R↓ (GTO) is essential for loops and branching"
      ]
    },
    
    "swap-xy": {
      id: "swap-xy",
      dataKey: "swap-xy",
      label: "x↔y",
      displayName: "Swap X and Y",
      category: "stack",
      type: "key",
      
      primaryFunction: {
        title: "Exchange X and Y",
        description: "Swaps the contents of the X and Y registers. Z and T are not affected. Essential for correcting operand order in non-commutative operations (subtraction, division) and for viewing the Y register.",
        examples: [
          "X=5, Y=3: Press x↔y → X=3, Y=5",
          "Wrong order: '3 ENTER 10 x↔y ÷' fixes division order",
          "View Y: Press x↔y to see Y value, press again to restore"
        ],
        keystrokes: "x↔y"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "CLEAR FIN/REG/PREFIX",
            title: "Clear Functions",
            description: "Followed by PREFIX, FIN, or REG to clear different calculator areas. 'f x↔y PRGM' clears program memory. 'f x↔y REG' clears data registers. 'f x↔y FIN' clears financial registers.",
            implementationStatus: "planned",
            examples: [
              "'f x↔y' then another key to select clear type",
              "Dangerous operation - clears data permanently"
            ],
            keystrokes: "f x↔y"
          }
        ],
        blue: [
          {
            label: "x≤y",
            title: "Test X Less Than or Equal Y",
            description: "Tests if X ≤ Y. Used in programming for conditional branching. Skips the next program step if X > Y.",
            implementationStatus: "planned",
            examples: [
              "In program: 'g x↔y' tests X≤Y",
              "Useful for sorting and comparisons"
            ],
            keystrokes: "g x↔y"
          }
        ]
      },
      
      shortDescription: "Swaps X and Y registers",
      longDescription: "x↔y is the stack exchange key that swaps the bottom two registers. It's one of the most frequently used stack manipulation keys because: 1) It lets you correct the order of operands for subtraction and division, 2) It allows you to view what's in the Y register, 3) It's useful for complex calculations requiring operand rearrangement. Unlike R↓ which affects all four levels, x↔y only affects X and Y, leaving Z and T untouched.",
      
      implementation: {
        status: "implemented",
        note: "Full x↔y functionality. Properly swaps X and Y registers while preserving Z and T.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Swaps contents of X and Y registers. Z and T remain unchanged. Can be pressed repeatedly to toggle between two values. Very commonly used to correct operand order or inspect Y register.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior. Clean swap of X and Y with Z and T unaffected.",
      
      relatedTopics: [
        "RPN (Reverse Polish Notation)",
        "Stack Operations",
        "Operand Order",
        "Non-Commutative Operations",
        "Programming Tests"
      ],
      
      relatedKeys: ["enter", "clx", "roll-down", "op-subtract", "op-divide"],
      
      commonMistakes: [
        "Confusing x↔y with R↓ (x↔y only swaps two registers, R↓ rotates all four)",
        "Not using x↔y to fix wrong operand order before subtraction/division",
        "Forgetting that x↔y doesn't affect Z or T"
      ],
      
      expertTips: [
        "Press x↔y twice to peek at Y without changing anything",
        "Before subtraction/division: if operands wrong order, press x↔y to fix",
        "'x↔y -' reverses subtraction direction: makes it 'X - Y' instead of 'Y - X'",
        "x↔y is faster than using R↓ when you only need to swap bottom two values",
        "In programming, g x↔y (x≤y test) enables comparison-based branching"
      ]
    },
    
    // ============================================
    // MEMORY KEYS (2 keys) - Partially Implemented
    // ============================================
    
    "sto": {
      id: "sto",
      dataKey: "sto",
      label: "STO",
      displayName: "Store",
      category: "memory",
      type: "key",
      
      primaryFunction: {
        title: "Store to Memory",
        description: "Stores the value in the X register to a specified memory register (0-9 or .0-.9). After pressing STO, press a digit to specify which register. The value remains in X (non-destructive store).",
        examples: [
          "'5 STO 0' → stores 5 in register 0",
          "'3.14 STO 5' → stores 3.14 in register 5",
          "Store keeps value in X unchanged"
        ],
        keystrokes: "STO [digit]"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Stores X to a memory register",
      longDescription: "The STO (Store) key saves the current X register value to one of 20 memory registers (R0-R9 and R.0-R.9). This is essential for storing intermediate results, constants, and data for later recall. STO is non-destructive - the value stays in X after storing. You can also use STO with arithmetic operations (STO + 0, STO - 1, etc.) to add/subtract/multiply/divide the memory register by X.",
      
      implementation: {
        status: "implemented",
        note: "STO key is fully wired. Press STO then a digit (0-9) to store X register value to that memory register. Arithmetic store operations (STO+, STO-, etc.) not yet implemented.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Stores X register to specified memory register. Also supports arithmetic store operations: 'STO + n' adds X to register n, 'STO - n' subtracts X from register n, 'STO × n' multiplies register n by X, 'STO ÷ n' divides register n by X.",
      
      simulatorBehavior: "Basic STO functionality implemented. Press STO then a digit to store. Value remains in X (non-destructive). Arithmetic store operations planned for future implementation.",
      
      relatedTopics: [
        "Memory Registers",
        "Data Storage",
        "Intermediate Results",
        "Memory Arithmetic"
      ],
      
      relatedKeys: ["rcl", "digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9"],
      
      commonMistakes: [
        "Forgetting to press a digit after STO",
        "Confusing STO (store) with = (which doesn't exist in RPN)",
        "Not realizing STO is non-destructive (X remains unchanged)"
      ],
      
      expertTips: [
        "Use STO + n to accumulate totals in register n",
        "Store constants early: π, commonly used values",
        "Registers .0-.9 are accessed with decimal: 'STO . 5' → R.5",
        "Memory is preserved even after pressing ON (only cleared by specific clear operations)"
      ]
    },
    
    "rcl": {
      id: "rcl",
      dataKey: "rcl",
      label: "RCL",
      displayName: "Recall",
      category: "memory",
      type: "key",
      
      primaryFunction: {
        title: "Recall from Memory",
        description: "Recalls (copies) the value from a specified memory register (0-9 or .0-.9) to the X register. After pressing RCL, press a digit to specify which register. The stack lifts to make room for the recalled value.",
        examples: [
          "'RCL 0' → copies register 0 value to X",
          "'RCL 5' → recalls register 5 to X",
          "Stack lifts: old X→Y, Y→Z, Z→T"
        ],
        keystrokes: "RCL [digit]"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Recalls value from memory register to X",
      longDescription: "The RCL (Recall) key copies a value from one of the 20 memory registers (R0-R9 and R.0-R.9) to the X register. The stack automatically lifts to make room (X→Y, Y→Z, Z→T, T lost). The memory register itself is unchanged - RCL is a non-destructive read. You can also recall financial registers, statistical registers, and use RCL with arithmetic operations for memory-based calculations.",
      
      implementation: {
        status: "implemented",
        note: "RCL key is fully wired. Press RCL then a digit (0-9) to recall value from that memory register to X register with stack lift. Arithmetic recall operations (RCL+, RCL-, etc.) not yet implemented.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Recalls value from specified memory register to X, with stack lift. Also supports arithmetic recall: 'RCL + n' adds register n to X, 'RCL - n' subtracts register n from X, 'RCL × n' multiplies X by register n, 'RCL ÷ n' divides X by register n.",
      
      simulatorBehavior: "Basic RCL functionality implemented. Press RCL then a digit to recall. Stack lifts automatically (X→Y, Y→Z, Z→T). Memory register unchanged (non-destructive read). Arithmetic recall operations planned for future implementation.",
      
      relatedTopics: [
        "Memory Registers",
        "Data Retrieval",
        "Stack Lift",
        "Memory Arithmetic"
      ],
      
      relatedKeys: ["sto", "digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9"],
      
      commonMistakes: [
        "Forgetting to press a digit after RCL",
        "Not realizing RCL causes stack lift",
        "Confusing which register number was used for storage"
      ],
      
      expertTips: [
        "RCL + n performs X = X + Rn (useful for accumulating)",
        "Use RCL to bring constants into calculations",
        "Financial registers: RCL .1 (n), RCL .2 (i), RCL .3 (PV), etc.",
        "RCL ENTER shows current date in date format"
      ]
    },
    
    // ============================================
    // PREFIX KEYS (2 keys) - All Implemented
    // ============================================
    
    "prefix-f": {
      id: "prefix-f",
      dataKey: "prefix-f",
      label: "f",
      displayName: "f (Gold Prefix)",
      category: "prefix",
      type: "key",
      
      primaryFunction: {
        title: "Gold Function Prefix",
        description: "Activates the gold (yellow/orange) shifted function printed above keys. Press 'f' then another key to execute that key's gold function. The gold functions include financial operations (AMORT, INT, NPV, IRR), programming commands, and special functions.",
        examples: [
          "'f n' executes AMORT (amortization)",
          "'f i' executes INT (interest)",
          "'f R↓' executes PRGM (program mode)"
        ],
        keystrokes: "f"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Activates gold shifted functions",
      longDescription: "The f key is one of two prefix keys that unlock the calculator's full functionality. On the HP-12C, most keys have three functions: the primary function (printed in white on the key face), the gold function (printed in gold/yellow above the key), and the blue function (printed in blue below the key). Pressing 'f' activates the gold function set. The calculator displays a small 'f' indicator to show prefix mode is active. The gold functions primarily include financial calculations, programming operations, and advanced mathematical functions.",
      
      implementation: {
        status: "implemented",
        note: "Prefix mode indicator functioning. Activates gold function mode, cleared after next key press. Most gold functions not yet implemented.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Activates gold function mode. Calculator shows 'f' indicator. Next key press executes that key's gold function, then prefix mode clears. If an invalid combination is pressed, calculator may beep and clear prefix.",
      
      simulatorBehavior: "Fully matches original HP-12C prefix behavior. Shows 'f' indicator in display. Clears after next key press. Most gold functions are planned for future implementation.",
      
      relatedTopics: [
        "Shifted Functions",
        "Prefix Keys",
        "Financial Functions",
        "Programming Functions"
      ],
      
      relatedKeys: ["prefix-g"],
      
      commonMistakes: [
        "Forgetting that 'f' is a prefix - you must press another key after it",
        "Confusing 'f' (gold) with 'g' (blue) functions",
        "Not noticing the 'f' indicator in the display"
      ],
      
      expertTips: [
        "Gold functions are primarily financial and programming operations",
        "The 'f' indicator shows prefix mode is active",
        "Press 'f' twice to cancel prefix mode if pressed by accident",
        "Most financial calculations require 'f' prefix: AMORT, INT, NPV, IRR"
      ]
    },
    
    "prefix-g": {
      id: "prefix-g",
      dataKey: "prefix-g",
      label: "g",
      displayName: "g (Blue Prefix)",
      category: "prefix",
      type: "key",
      
      primaryFunction: {
        title: "Blue Function Prefix",
        description: "Activates the blue shifted function printed below keys. Press 'g' then another key to execute that key's blue function. The blue functions include mathematical operations (factorial, statistics, dates), unit conversions, and test functions.",
        examples: [
          "'g 3' executes n! (factorial)",
          "'g 0' executes x̄ (mean)",
          "'g ENTER' executes LSTx (last X)"
        ],
        keystrokes: "g"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Activates blue shifted functions",
      longDescription: "The g key is the second prefix key that unlocks additional calculator functions. While the 'f' key primarily accesses financial and programming functions, the 'g' key primarily accesses mathematical operations (factorial, statistics, trigonometry), date functions, unit conversions, and test operations used in programming. The calculator displays a small 'g' indicator to show blue prefix mode is active.",
      
      implementation: {
        status: "implemented",
        note: "Prefix mode indicator functioning. Activates blue function mode, cleared after next key press. Most blue functions not yet implemented.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Activates blue function mode. Calculator shows 'g' indicator. Next key press executes that key's blue function, then prefix mode clears. Blue functions include mathematical operations, statistics, dates, and test operations.",
      
      simulatorBehavior: "Fully matches original HP-12C prefix behavior. Shows 'g' indicator in display. Clears after next key press. Most blue functions are planned for future implementation.",
      
      relatedTopics: [
        "Shifted Functions",
        "Prefix Keys",
        "Mathematical Functions",
        "Statistical Functions",
        "Date Functions"
      ],
      
      relatedKeys: ["prefix-f"],
      
      commonMistakes: [
        "Confusing 'g' (blue) with 'f' (gold) functions",
        "Forgetting that 'g' is a prefix - you must press another key after it",
        "Not noticing the 'g' indicator in the display"
      ],
      
      expertTips: [
        "Blue functions are primarily mathematical and statistical operations",
        "The 'g' indicator shows prefix mode is active",
        "Press 'g' twice to cancel prefix mode if pressed by accident",
        "'g ENTER' for LSTx is one of the most useful recovery functions"
      ]
    },
    
    // ============================================
    // CONTROL KEYS (1 key) - Implemented
    // ============================================
    
    "on": {
      id: "on",
      dataKey: "on",
      label: "ON",
      displayName: "On / Reset",
      category: "control",
      type: "key",
      
      primaryFunction: {
        title: "On / Clear All",
        description: "Resets the calculator to its initial state. Clears all stack registers (X, Y, Z, T) to zero, clears display, cancels any prefix mode, and stops any running programs. Does NOT clear stored memory registers or financial registers. This is the 'start fresh' button.",
        examples: [
          "Press ON → clears stack and display",
          "After error → press ON to recover",
          "Start new problem → press ON"
        ],
        keystrokes: "ON"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: []
      },
      
      shortDescription: "Resets calculator (clears stack and display)",
      longDescription: "The ON key serves as both the power button and the reset button for the HP-12C. In physical calculators, it turned the device on from sleep mode. In all contexts, pressing ON clears the stack registers (X, Y, Z, T), clears the display, cancels pending operations, clears any prefix mode (f/g), and stops program execution. Importantly, ON does NOT clear the memory registers (R0-R19), financial registers (n, i, PV, PMT, FV), program memory, or calculator settings. Use ON when you want a fresh start for a new calculation while preserving stored data.",
      
      implementation: {
        status: "implemented",
        note: "Full ON functionality implemented. Clears stack, resets display, cancels prefix modes. Does not clear memory or stored values as per HP-12C behavior.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Clears X, Y, Z, T registers to 0. Clears display. Cancels any prefix mode (f/g). Stops running programs. Does NOT affect: memory registers (R0-R.9), financial registers, program memory, display format, or date mode. On battery-powered units, also serves as power on button.",
      
      simulatorBehavior: "Fully matches original HP-12C behavior for reset functionality. Clears stack and display while preserving memory and settings. Since this is a web simulator, there's no 'power off' - the calculator is always 'on'.",
      
      relatedTopics: [
        "Calculator Reset",
        "Stack Clearing",
        "Error Recovery",
        "Fresh Start"
      ],
      
      relatedKeys: ["clx", "prefix-f", "prefix-g"],
      
      commonMistakes: [
        "Thinking ON clears memory registers (it doesn't - only stack)",
        "Using ON when you only need CLx (CLx clears X only, preserves Y/Z/T)",
        "Pressing ON accidentally and losing your stack contents",
        "Expecting ON to clear financial registers (it doesn't)"
      ],
      
      expertTips: [
        "ON is for 'start a new calculation' while keeping stored values",
        "To fully clear everything, use: ON, then f CLx (clear various memory areas)",
        "ON is the universal 'get out of trouble' button for errors",
        "Use CLx instead of ON if you just made a mistake in X",
        "ON won't erase your carefully stored memory values or programs"
      ]
    },
    
    // ============================================
    // SCIENTIFIC & PERCENTAGE KEYS (6 keys) - All Planned
    // ============================================
    
    "reciprocal": {
      id: "reciprocal",
      dataKey: "reciprocal",
      label: "1/x",
      displayName: "Reciprocal",
      category: "arithmetic",
      type: "key",
      
      primaryFunction: {
        title: "Reciprocal (1/x)",
        description: "Calculates the reciprocal of X (1 divided by X). Replaces X with the result. Essential for converting between rates, finding reciprocals, and inverting ratios.",
        examples: [
          "'4 1/x' → displays 0.25",
          "'0.5 1/x' → displays 2",
          "Convert miles to km: '1.609 1/x' → miles per km"
        ],
        keystrokes: "1/x"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "eˣ",
            title: "e to the x",
            description: "Raises mathematical constant e (2.71828...) to the power in X register. Natural exponential function.",
            implementationStatus: "implemented",
            examples: [
              "'1 g 1/x' → displays 2.7183 (e¹)",
              "'2 g 1/x' → displays 7.3891 (e²)"
            ],
            keystrokes: "g 1/x"
          }
        ]
      },
      
      shortDescription: "Calculates 1 divided by X",
      longDescription: "The reciprocal function calculates 1/X, replacing X with the result. This is faster than entering '1 ENTER X ÷' and is commonly used in engineering, physics, and financial calculations. Division by zero produces an error.",
      
      implementation: {
        status: "implemented",
        note: "Reciprocal function (1/x) fully implemented with proper error handling for division by zero.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Calculates 1/X immediately. Division by zero displays 'Error 0'. Does not affect stack (no stack drop).",
      
      simulatorBehavior: "Fully implemented. Calculates 1/X with proper error handling. Blue function (g 1/x) calculates eˣ.",
      
      relatedTopics: [
        "Reciprocals",
        "Division",
        "Rate Conversion"
      ],
      
      relatedKeys: ["op-divide", "power-yx"],
      
      commonMistakes: [
        "Trying 1/x on zero (undefined)",
        "Confusing 1/x with x⁻¹ (they're the same)"
      ],
      
      expertTips: [
        "Use 1/x twice to return to original value",
        "1/x is faster than '1 ENTER x ÷'"
      ]
    },
    
    "percent": {
      id: "percent",
      dataKey: "percent",
      label: "%",
      displayName: "Percent",
      category: "percentage",
      type: "key",
      
      primaryFunction: {
        title: "Percentage",
        description: "Calculates what percentage X is of Y. Result shows 'X is what percent of Y'. Useful for finding percentage values, discounts, and markups.",
        examples: [
          "'200 ENTER 50 %' → displays 25 (50 is 25% of 200)",
          "'100 ENTER 15 %' → displays 15 (15% of 100)",
          "Find discount %: 'original ENTER discount %'"
        ],
        keystrokes: "%"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "INTG",
            title: "Integer Part",
            description: "Returns the integer (whole number) part of X, discarding the fractional part.",
            implementationStatus: "implemented",
            examples: [
              "'3.75 g %' → displays 3",
              "'-2.9 g %' → displays -2"
            ],
            keystrokes: "g %"
          }
        ]
      },
      
      shortDescription: "Calculates percentage (X is what % of Y)",
      longDescription: "The % key calculates percentages using Y as the base and X as the amount. It answers: 'X is what percentage of Y?' This is essential for retail calculations, financial analysis, and everyday percentage problems.",
      
      implementation: {
        status: "implemented",
        note: "Percentage calculation fully implemented. Formula: (X / Y) × 100",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Calculates (X/Y) × 100, displaying the percentage. Both X and Y remain on stack.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Percentages",
        "Discounts",
        "Markups",
        "Ratios"
      ],
      
      relatedKeys: ["percent-total", "delta-percent"],
      
      commonMistakes: [
        "Entering numbers in wrong order (base should be in Y)",
        "Confusing % with %T (% total) or Δ% (delta percent)"
      ],
      
      expertTips: [
        "For 'what is 15% of 200': type '200 ENTER 15 %'",
        "Y register is the base (100%), X is compared to it"
      ]
    },
    
    "percent-total": {
      id: "percent-total",
      dataKey: "percent-total",
      label: "%T",
      displayName: "Percent of Total",
      category: "percentage",
      type: "key",
      
      primaryFunction: {
        title: "Percent of Total",
        description: "Calculates what amount is X% of Y. Result shows the actual value. Useful for adding/subtracting percentages, calculating tips, discounts.",
        examples: [
          "'200 ENTER 15 %T' → displays 30 (15% of 200)",
          "'50 ENTER 20 %T' → displays 10 (20% of 50)",
          "Add 25%: 'value ENTER 25 %T +'"
        ],
        keystrokes: "%T"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "LN",
            title: "Natural Logarithm",
            description: "Calculates the natural logarithm (base e) of X.",
            implementationStatus: "implemented",
            examples: [
              "'  2.7183 g %T' → displays 1 (ln(e) = 1)",
              "'10 g %T' → displays 2.3026"
            ],
            keystrokes: "g %T"
          }
        ]
      },
      
      shortDescription: "Calculates X percent of Y",
      longDescription: "The %T key answers 'what is X% of Y?' by calculating (X/100) × Y. This is the complement to the % key. Use it when you know the percentage and want the actual amount.",
      
      implementation: {
        status: "implemented",
        note: "Percent of total calculation fully implemented. Formula: (X / 100) × Y",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Calculates (X/100) × Y. Both X and Y remain on stack after calculation.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Percentages",
        "Tips",
        "Discounts",
        "Markups"
      ],
      
      relatedKeys: ["percent", "delta-percent"],
      
      commonMistakes: [
        "Confusing %T with % (they're inverses)",
        "Wrong order: base in Y, percentage in X"
      ],
      
      expertTips: [
        "For tips: 'bill ENTER 20 %T' gives tip amount",
        "Chain: 'price ENTER 25 %T +' adds 25% markup"
      ]
    },
    
    "delta-percent": {
      id: "delta-percent",
      dataKey: "delta-percent",
      label: "Δ%",
      displayName: "Delta Percent",
      category: "percentage",
      type: "key",
      
      primaryFunction: {
        title: "Percent Change",
        description: "Calculates the percentage change from Y to X. Shows by what percent Y changed to become X. Essential for growth rates, investment returns, price changes.",
        examples: [
          "'100 ENTER 120 Δ%' → displays 20 (20% increase)",
          "'50 ENTER 40 Δ%' → displays -20 (20% decrease)",
          "Stock gain: 'old_price ENTER new_price Δ%'"
        ],
        keystrokes: "Δ%"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "SL/SOYD/DB",
            title: "Depreciation Methods",
            description: "Calculates depreciation using Straight Line, Sum-of-Years-Digits, or Declining Balance methods.",
            implementationStatus: "planned",
            examples: [
              "Complex depreciation calculations"
            ],
            keystrokes: "f Δ%"
          }
        ],
        blue: [
          {
            label: "FRAC",
            title: "Fractional Part",
            description: "Returns the fractional (decimal) part of X, discarding the integer part.",
            implementationStatus: "implemented",
            examples: [
              "'3.75 g Δ%' → displays 0.75",
              "'-2.3 g Δ%' → displays -0.3"
            ],
            keystrokes: "g Δ%"
          }
        ]
      },
      
      shortDescription: "Calculates percentage change from Y to X",
      longDescription: "Δ% calculates the percent change: ((X - Y) / Y) × 100. This answers 'by what percent did Y change to become X?' Positive means increase, negative means decrease. Critical for analyzing investment returns, sales growth, inflation rates.",
      
      implementation: {
        status: "implemented",
        note: "Delta percent calculation fully implemented. Formula: ((X - Y) / Y) × 100",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Calculates percentage change from Y (old) to X (new). Both values remain on stack.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Percentage Change",
        "Growth Rates",
        "Returns",
        "Inflation"
      ],
      
      relatedKeys: ["percent", "percent-total"],
      
      commonMistakes: [
        "Entering new value in Y and old in X (should be reversed)",
        "Forgetting that negative results mean decrease"
      ],
      
      expertTips: [
        "Old value in Y, new value in X",
        "For investment return: 'cost ENTER sale_price Δ%'"
      ]
    },
    
    "power-yx": {
      id: "power-yx",
      dataKey: "power-yx",
      label: "yˣ",
      displayName: "Y to the power of X",
      category: "power-log",
      type: "key",
      
      primaryFunction: {
        title: "Power Function",
        description: "Raises Y to the power of X. Calculates Y^X. Essential for exponential calculations, compound interest, engineering formulas.",
        examples: [
          "'2 ENTER 3 yˣ' → displays 8 (2³)",
          "'10 ENTER 2 yˣ' → displays 100 (10²)",
          "'5 ENTER 0.5 yˣ' → displays 2.236 (√5)"
        ],
        keystrokes: "yˣ"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "PRICE/BOND/YTM",
            title: "Bond Calculations",
            description: "Calculates bond price, yield to maturity, or other bond-related values.",
            implementationStatus: "planned",
            examples: [
              "Complex bond pricing calculations"
            ],
            keystrokes: "f yˣ"
          }
        ],
        blue: [
          {
            label: "√x",
            title: "Square Root",
            description: "Calculates the square root of X.",
            implementationStatus: "implemented",
            examples: [
              "'16 g yˣ' → displays 4",
              "'2 g yˣ' → displays 1.4142"
            ],
            keystrokes: "g yˣ"
          }
        ]
      },
      
      shortDescription: "Raises Y to the power of X (Y^X)",
      longDescription: "The yˣ key performs exponentiation: Y to the power of X. This is fundamental for compound growth, scientific calculations, and many engineering formulas. For square roots, use 0.5 as the exponent, or use the dedicated √x function (g yˣ).",
      
      implementation: {
        status: "implemented",
        note: "Power function (yˣ) fully implemented with proper handling of negative bases, fractional exponents, and overflow detection.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Calculates Y^X with stack drop. Handles integer and fractional exponents. Negative bases with fractional exponents may produce errors.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Exponentiation",
        "Powers",
        "Exponential Growth",
        "Roots"
      ],
      
      relatedKeys: ["reciprocal"],
      
      commonMistakes: [
        "Confusing order: base in Y, exponent in X",
        "Trying negative base with fractional exponent"
      ],
      
      expertTips: [
        "For square: 'x ENTER 2 yˣ' or faster: 'x ENTER ×'",
        "For nth root: 'x ENTER n 1/x yˣ' or use √x for square root",
        "Compound growth: 'principal ENTER 1.05 yˣ' for 5% over x years"
      ]
    },
    
    "eex": {
      id: "eex",
      dataKey: "eex",
      label: "EEX",
      displayName: "Enter Exponent",
      category: "numeric-entry",
      type: "key",
      
      primaryFunction: {
        title: "Enter Exponent (Scientific Notation)",
        description: "Enters the exponent for scientific notation. Allows entry of very large or very small numbers like 1.5×10²³ or 3.2×10⁻⁹.",
        examples: [
          "'6.02 EEX 23' → 6.02×10²³ (Avogadro's number)",
          "'3 EEX 8' → 3×10⁸ (speed of light)",
          "'1.6 EEX 19 CHS' → 1.6×10⁻¹⁹ (electron charge)"
        ],
        keystrokes: "EEX"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "ΔDYS",
            title: "Delta Days",
            description: "Calculates the number of days between two dates.",
            implementationStatus: "planned",
            examples: [
              "Enter two dates, press 'g EEX' for days between"
            ],
            keystrokes: "g EEX"
          }
        ]
      },
      
      shortDescription: "Enters scientific notation exponent",
      longDescription: "EEX (Enter Exponent) allows entry of numbers in scientific notation. After typing the mantissa, press EEX followed by the exponent digits. Use CHS after the exponent to make it negative. Essential for scientific and engineering calculations with very large or small numbers.",
      
      implementation: {
        status: "planned",
        note: "Requires scientific notation number entry mode with separate mantissa and exponent tracking.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Enters exponent entry mode. Display shows small exponent. Press CHS after exponent digits to make exponent negative, not mantissa.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Scientific Notation",
        "Numeric Entry",
        "Exponents",
        "Large Numbers"
      ],
      
      relatedKeys: ["chs", "digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-7", "digit-8", "digit-9"],
      
      commonMistakes: [
        "Pressing CHS before EEX (negates mantissa, not exponent)",
        "Forgetting that EEX means '×10^' not '^'",
        "Confusing EEX with yˣ (power function)"
      ],
      
      expertTips: [
        "For 1.5×10⁻³: type '1.5 EEX 3 CHS'",
        "CHS after exponent negates exponent; before EEX negates mantissa",
        "Display format affects how exponents are shown but not internal precision"
      ]
    },
    
    // ============================================
    // PROGRAMMING & CONTROL KEYS (2 keys) - Planned
    // ============================================
    
    "rs": {
      id: "rs",
      dataKey: "rs",
      label: "R/S",
      displayName: "Run/Stop",
      category: "control",
      type: "key",
      
      primaryFunction: {
        title: "Run/Stop Program",
        description: "Starts program execution from current position, or stops a running program. Essential for calculator programming and automation.",
        examples: [
          "Press R/S to start program from line 000",
          "Press R/S during execution to pause",
          "Press R/S again to continue"
        ],
        keystrokes: "R/S"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "P/R",
            title: "Program Mode",
            description: "Toggles between program mode (for entering/editing programs) and run mode (for calculations).",
            implementationStatus: "planned",
            examples: [
              "'f R/S' enters program mode",
              "'f R/S' again returns to run mode"
            ],
            keystrokes: "f R/S"
          }
        ],
        blue: [
          {
            label: "PSE",
            title: "Pause",
            description: "Pauses program execution for about 1 second to display intermediate results, then continues automatically.",
            implementationStatus: "planned",
            examples: [
              "In program: 'g R/S' pauses to show display"
            ],
            keystrokes: "g R/S"
          }
        ]
      },
      
      shortDescription: "Runs or stops program execution",
      longDescription: "R/S controls program execution. Press it to start running a program from the current program counter position. Press it again to stop execution. This is fundamental to HP-12C programming, which allows recording sequences of keystrokes for automated calculations.",
      
      implementation: {
        status: "planned",
        note: "Requires full programming engine: program memory, program counter, instruction execution loop, and program/run mode toggle.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Starts/stops program execution. In run mode, starts from current position. Can be used to single-step through programs.",
      
      simulatorBehavior: "Currently not implemented. Programming features are planned for future phase.",
      
      relatedTopics: [
        "Calculator Programming",
        "Automation",
        "Program Execution",
        "Program Mode"
      ],
      
      relatedKeys: ["sst", "prefix-f", "prefix-g"],
      
      commonMistakes: [
        "Forgetting to set program counter to 000 before running",
        "Not understanding P/R (program mode) vs R/S (run)"
      ],
      
      expertTips: [
        "GTO 000 then R/S to start program from beginning",
        "R/S during execution = pause; R/S again = continue",
        "Use PSE (g R/S) in programs to show intermediate results"
      ]
    },
    
    "sst": {
      id: "sst",
      dataKey: "sst",
      label: "SST",
      displayName: "Single Step",
      category: "programming",
      type: "key",
      
      primaryFunction: {
        title: "Single Step",
        description: "In run mode, executes one program line and stops. In program mode, advances to next program line without executing. Essential for debugging programs.",
        examples: [
          "Debug: Press SST repeatedly to step through program",
          "View program: In PRGM mode, SST shows each line"
        ],
        keystrokes: "SST"
      },
      
      shiftedFunctions: {
        gold: [
          {
            label: "Σ",
            title: "Sigma (Summation Symbol)",
            description: "Display symbol used in statistical operations. Not a function itself.",
            implementationStatus: "informational-only",
            examples: [],
            keystrokes: "f SST"
          }
        ],
        blue: [
          {
            label: "BST",
            title: "Back Step",
            description: "Steps backward through program memory. Opposite of SST.",
            implementationStatus: "planned",
            examples: [
              "In PRGM mode: 'g SST' moves back one line"
            ],
            keystrokes: "g SST"
          }
        ]
      },
      
      shortDescription: "Steps through program one line at a time",
      longDescription: "SST (Single Step) is the programmer's debugging tool. In run mode, it executes one program instruction and stops, allowing you to inspect the results. In program mode, it advances through the program listing without executing. Combined with BST (backstep), you can navigate through your program.",
      
      implementation: {
        status: "planned",
        note: "Requires programming engine with single-step execution capability and program counter management.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Executes one program step in run mode. Advances program counter in program mode. Shows current line in display.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Calculator Programming",
        "Debugging",
        "Program Navigation",
        "Program Mode"
      ],
      
      relatedKeys: ["rs", "prefix-f", "prefix-g"],
      
      commonMistakes: [
        "Confusing SST behavior in run mode vs program mode",
        "Not realizing SST executes in run mode"
      ],
      
      expertTips: [
        "SST in run mode = execute and stop (for debugging)",
        "SST in PRGM mode = view next line (no execution)",
        "Use BST (g SST) to go backward through program"
      ]
    },
    
    // ============================================
    // STATISTICS KEYS (1 key) - Planned
    // ============================================
    
    "sigma-plus": {
      id: "sigma-plus",
      dataKey: "sigma-plus",
      label: "Σ+",
      displayName: "Sigma Plus",
      category: "statistics",
      type: "key",
      
      primaryFunction: {
        title: "Accumulate Statistics",
        description: "Adds the current X (and Y if doing two-variable statistics) to statistical registers. Essential for calculating mean, standard deviation, and regression.",
        examples: [
          "One variable: '10 Σ+', '20 Σ+', '30 Σ+' (adds data)",
          "Two variable: '5 ENTER 10 Σ+' (adds x=5, y=10 pair)",
          "Then: 'g 0' for mean, 'g .' for std dev"
        ],
        keystrokes: "Σ+"
      },
      
      shiftedFunctions: {
        gold: [],
        blue: [
          {
            label: "Σ−",
            title: "Sigma Minus",
            description: "Removes the last data point added with Σ+. Useful for correcting data entry mistakes.",
            implementationStatus: "planned",
            examples: [
              "After incorrect Σ+: 'RCL X, g Σ+' removes that point"
            ],
            keystrokes: "g Σ+"
          }
        ]
      },
      
      shortDescription: "Adds data to statistical registers",
      longDescription: "Σ+ is the foundation of statistical calculations on the HP-12C. Each press accumulates data into the statistical registers (R1-R6). For single-variable statistics, it uses X. For two-variable (regression), it uses both X and Y. After accumulating data, you can calculate mean, standard deviation, correlation, linear regression, and more.",
      
      implementation: {
        status: "planned",
        note: "Requires statistical register allocation (R1-R6) and accumulation formulas for sum(x), sum(x²), sum(y), sum(y²), sum(xy), and n.",
        version: "1.0"
      },
      
      originalHp12cBehavior: "Adds X to R1 (n), X to R2 (Σx), X² to R3 (Σx²). For two-variable: Y to R4 (Σy), Y² to R5 (Σy²), X×Y to R6 (Σxy). Increments n counter.",
      
      simulatorBehavior: "Currently not implemented.",
      
      relatedTopics: [
        "Statistics",
        "Mean",
        "Standard Deviation",
        "Linear Regression",
        "Correlation"
      ],
      
      relatedKeys: ["digit-0", "decimal"],
      
      commonMistakes: [
        "Forgetting to clear statistics before new data set",
        "Not entering Y value for two-variable statistics",
        "Accumulating in wrong order for x,y pairs"
      ],
      
      expertTips: [
        "Clear statistics: 'f CLx' then select REG clears all",
        "For x,y pairs: 'x ENTER y Σ+' (x in stack first)",
        "To remove bad data: recall it, then use Σ− (g Σ+)",
        "Statistical functions: g 0 (x̄), g . (s), g 1 (ŷ,r), g 2 (x̂,r)"
      ]
    }
  };
  
  // ============================================
  // METADATA VALIDATION & UTILITY FUNCTIONS
  // ============================================
  
  // Validate metadata on load
  const keyCount = Object.keys(window.HP12C_KEY_METADATA).length;
  console.log(`HP-12C Key Metadata loaded: ${keyCount} keys`);
  
  if (keyCount < 17) {
    console.warn(`Phase A: Expected at least 17 keys, found ${keyCount}`);
  }
  
  // Export metadata access functions
  window.HP12C_KEY_METADATA_UTILS = {
    /**
     * Get metadata for a specific key by ID
     */
    getKey: function(keyId) {
      return window.HP12C_KEY_METADATA[keyId] || null;
    },
    
    /**
     * Get all key IDs
     */
    getAllKeys: function() {
      return Object.keys(window.HP12C_KEY_METADATA);
    },
    
    /**
     * Get all keys in a specific category
     */
    getKeysByCategory: function(category) {
      return Object.values(window.HP12C_KEY_METADATA)
        .filter(key => key.category === category);
    },
    
    /**
     * Get all keys with a specific implementation status
     */
    getKeysByStatus: function(status) {
      return Object.values(window.HP12C_KEY_METADATA)
        .filter(key => key.implementation.status === status);
    },
    
    /**
     * Get statistics about metadata coverage
     */
    getStats: function() {
      const keys = Object.values(window.HP12C_KEY_METADATA);
      return {
        total: keys.length,
        implemented: keys.filter(k => k.implementation.status === 'implemented').length,
        partial: keys.filter(k => k.implementation.status === 'partially-implemented').length,
        planned: keys.filter(k => k.implementation.status === 'planned').length,
        categories: [...new Set(keys.map(k => k.category))].sort()
      };
    },
    
    /**
     * Validate metadata structure
     */
    validate: function() {
      const requiredFields = ['id', 'dataKey', 'label', 'displayName', 'category',
                              'primaryFunction', 'shiftedFunctions', 'shortDescription',
                              'longDescription', 'implementation', 'originalHp12cBehavior',
                              'simulatorBehavior', 'relatedTopics', 'relatedKeys',
                              'commonMistakes', 'expertTips'];
      
      const errors = [];
      
      for (const [keyId, keyData] of Object.entries(window.HP12C_KEY_METADATA)) {
        // Check required fields
        for (const field of requiredFields) {
          if (!(field in keyData)) {
            errors.push(`${keyId}: Missing required field '${field}'`);
          }
        }
        
        // Check id matches object key
        if (keyData.id !== keyId) {
          errors.push(`${keyId}: id mismatch (${keyData.id} !== ${keyId})`);
        }
      }
      
      if (errors.length === 0) {
        console.log('✅ All metadata validation passed');
        return true;
      } else {
        console.error('❌ Metadata validation errors:', errors);
        return false;
      }
    }
  };
  
  // Log statistics
  const stats = window.HP12C_KEY_METADATA_UTILS.getStats();
  console.log('Metadata Stats:', stats);
  
})();
