# HP-12C Calculator Examples

This guide provides step-by-step examples for using the HP-12C calculator, from basic arithmetic to advanced financial calculations.

## Table of Contents
- [Basic Arithmetic](#basic-arithmetic)
- [Mathematical Functions](#mathematical-functions)
- [Percentage Calculations](#percentage-calculations)
- [Memory Operations](#memory-operations)
- [Time Value of Money (TVM)](#time-value-of-money-tvm)
- [Cash Flow Analysis (NPV/IRR)](#cash-flow-analysis-npvirr)
- [Amortization](#amortization)
- [Depreciation](#depreciation)
- [Date Calculations](#date-calculations)
- [Real-World Scenarios](#real-world-scenarios)

---

## Basic Arithmetic

### Example 1: Simple Addition
**Problem**: 125 + 375 = ?

**Keystrokes**:
```
125 ENTER 375 +
```

**Display**: `500.00`

---

### Example 2: Subtraction
**Problem**: 1,250 - 450 = ?

**Keystrokes**:
```
1250 ENTER 450 -
```

**Display**: `800.00`

---

### Example 3: Multiplication
**Problem**: 24 × 15 = ?

**Keystrokes**:
```
24 ENTER 15 ×
```

**Display**: `360.00`

---

### Example 4: Division
**Problem**: 2,500 ÷ 25 = ?

**Keystrokes**:
```
2500 ENTER 25 ÷
```

**Display**: `100.00`

---

### Example 5: Chain Calculation
**Problem**: (45 + 55) × 2 - 20 = ?

**Keystrokes**:
```
45 ENTER 55 +        → 100
2 ×                  → 200
20 -                 → 180
```

**Display**: `180.00`

**Explanation**: In RPN, you solve from left to right naturally, no parentheses needed!

---

### Example 6: Complex Expression
**Problem**: (12 + 8) ÷ (5 - 1) = ?

**Keystrokes**:
```
12 ENTER 8 +         → 20
5 ENTER 1 -          → 4
÷                    → 5
```

**Display**: `5.00`

---

## Mathematical Functions

### Example 7: Square Root
**Problem**: √144 = ?

**Keystrokes**:
```
144 g √x
```

**Display**: `12.00`

---

### Example 8: Square
**Problem**: 13² = ?

**Keystrokes**:
```
13 g x²
```

**Display**: `169.00`

---

### Example 9: Reciprocal
**Problem**: 1/8 = ?

**Keystrokes**:
```
8 1/x
```

**Display**: `0.125`

---

### Example 10: Power Function
**Problem**: 2⁸ = ?

**Keystrokes**:
```
2 ENTER 8 g yˣ
```

**Display**: `256.00`

---

### Example 11: Natural Logarithm
**Problem**: ln(100) = ?

**Keystrokes**:
```
100 g LN
```

**Display**: `4.61` (approximately)

---

### Example 12: Exponential
**Problem**: e² = ?

**Keystrokes**:
```
2 g eˣ
```

**Display**: `7.39` (approximately)

---

### Example 13: Common Logarithm
**Problem**: log₁₀(1000) = ?

**Keystrokes**:
```
1000 g LOG
```

**Display**: `3.00`

---

### Example 14: 10 to the Power
**Problem**: 10³ = ?

**Keystrokes**:
```
3 g 10ˣ
```

**Display**: `1000.00`

---

## Percentage Calculations

### Example 15: Simple Percentage
**Problem**: What is 15% of 200?

**Keystrokes**:
```
200 ENTER 15 %
```

**Display**: `30.00`

**Explanation**: The original value (200) remains in Y register.

---

### Example 16: Add Percentage
**Problem**: What is 200 plus 15%?

**Keystrokes**:
```
200 ENTER 15 %       → 30
+                    → 230
```

**Display**: `230.00`

---

### Example 17: Subtract Percentage
**Problem**: What is $500 minus a 20% discount?

**Keystrokes**:
```
500 ENTER 20 %       → 100
-                    → 400
```

**Display**: `400.00` (discounted price)

---

### Example 18: Percentage Change
**Problem**: Sales increased from $50,000 to $65,000. What's the percentage increase?

**Keystrokes**:
```
50000 ENTER 65000 Δ%
```

**Display**: `30.00` (30% increase)

---

### Example 19: Reverse Percentage
**Problem**: If $120 is 80% of a number, what's the full number?

**Keystrokes**:
```
120 ENTER 80 %T
```

**Display**: `150.00`

**Explanation**: %T calculates the total when given a percentage part.

---

## Memory Operations

### Example 20: Store and Recall
**Problem**: Calculate (5 × 8) + (12 × 3), storing intermediate results

**Keystrokes**:
```
5 ENTER 8 ×          → 40
STO 1                (store in R1)
12 ENTER 3 ×         → 36
RCL 1                (recall from R1)
+                    → 76
```

**Display**: `76.00`

---

### Example 21: Register Arithmetic
**Problem**: Store 100 in register 5, then add 50 to it

**Keystrokes**:
```
100 STO 5            (store 100 in R5)
50 STO+ 5            (add 50 to R5)
RCL 5                (recall R5)
```

**Display**: `150.00`

---

### Example 22: Running Total
**Problem**: Keep a running sum: 100 + 250 + 75 + 425

**Keystrokes**:
```
0 STO 0              (initialize R0 to 0)
100 STO+ 0           (add 100)
250 STO+ 0           (add 250)
75 STO+ 0            (add 75)
425 STO+ 0           (add 425)
RCL 0                (recall total)
```

**Display**: `850.00`

---

## Time Value of Money (TVM)

### Example 23: Loan Payment
**Problem**: You're buying a house for $350,000 with a 30-year mortgage at 6.5% annual interest. What's your monthly payment?

**Keystrokes**:
```
360 n                (30 years × 12 months)
6.5 ENTER 12 ÷ i     (6.5% ÷ 12 = 0.542% per month)
350000 PV            (loan amount)
0 FV                 (fully paid off at end)
PMT                  (calculate payment)
```

**Display**: `-2,212.75`

**Answer**: Monthly payment is $2,212.75 (negative = cash outflow)

---

### Example 24: Savings Goal
**Problem**: How much do I need to save monthly to have $50,000 in 5 years at 4% annual interest?

**Keystrokes**:
```
60 n                 (5 years × 12 months)
4 ENTER 12 ÷ i       (4% ÷ 12 monthly)
0 PV                 (starting from zero)
50000 FV             (target amount)
PMT                  (calculate payment)
```

**Display**: `-754.22`

**Answer**: Save $754.22 per month

---

### Example 25: Investment Return
**Problem**: You invest $10,000 and it grows to $15,000 in 3 years. What was your annual return rate?

**Keystrokes**:
```
3 n                  (3 years)
10000 CHS PV         (initial investment, negative)
15000 FV             (final value)
0 PMT                (no additional payments)
i                    (calculate interest rate)
```

**Display**: `14.47`

**Answer**: 14.47% annual return

---

### Example 26: How Long to Double?
**Problem**: At 8% annual interest, how long until $1,000 becomes $2,000?

**Keystrokes**:
```
8 i                  (8% annual)
1000 CHS PV          (initial amount, negative)
2000 FV              (double the amount)
0 PMT                (no payments)
n                    (calculate periods)
```

**Display**: `9.01`

**Answer**: About 9 years to double your money

---

### Example 27: Present Value
**Problem**: You'll receive $100,000 in 10 years. What's it worth today at 5% discount rate?

**Keystrokes**:
```
10 n                 (10 years)
5 i                  (5% discount rate)
100000 CHS FV        (future amount, negative)
0 PMT                (no payments)
PV                   (calculate present value)
```

**Display**: `61,391.33`

**Answer**: Worth $61,391.33 today

---

### Example 28: Retirement Planning
**Problem**: You have $500,000 saved. You want to withdraw $3,000/month for 20 years. What interest rate do you need?

**Keystrokes**:
```
240 n                (20 years × 12 months)
500000 PV            (starting balance)
3000 CHS PMT         (monthly withdrawal, negative)
0 FV                 (depleted at end)
i                    (calculate rate)
12 ×                 (convert to annual)
```

**Display**: `4.42`

**Answer**: Need 4.42% annual return

---

## Cash Flow Analysis (NPV/IRR)

### Example 29: Simple NPV
**Problem**: Project costs $10,000 initially and returns $4,000/year for 4 years. NPV at 10% discount rate?

**Keystrokes**:
```
f CLX                (clear financial registers)
10000 CHS g CF₀      (initial investment, negative)
4000 g CFⱼ           (annual cash flow)
4 g Nⱼ               (4 years)
10 i                 (discount rate)
f NPV                (calculate NPV)
```

**Display**: `2,679.46`

**Answer**: NPV = $2,679.46 (positive, so good investment!)

---

### Example 30: Uneven Cash Flows NPV
**Problem**: Investment costs $50,000. Returns are: Year 1: $15,000, Year 2: $20,000, Year 3: $25,000, Year 4: $12,000. NPV at 12%?

**Keystrokes**:
```
f CLX                (clear financial registers)
50000 CHS g CF₀      (initial investment)
15000 g CFⱼ          (year 1)
20000 g CFⱼ          (year 2)
25000 g CFⱼ          (year 3)
12000 g CFⱼ          (year 4)
12 i                 (discount rate)
f NPV                (calculate NPV)
```

**Display**: `4,036.75`

**Answer**: NPV = $4,036.75

---

### Example 31: IRR Calculation
**Problem**: Same project as Example 30. What's the IRR?

**Keystrokes**:
```
(Cash flows already entered from Example 30)
f IRR                (calculate IRR)
```

**Display**: `18.45`

**Answer**: IRR = 18.45% (higher than 12% discount rate, so good investment)

---

### Example 32: Compare Investments
**Problem**: Investment A: $10,000 cost, returns $3,500/year for 4 years. Investment B: $10,000 cost, returns $2,000/year for 7 years. Which is better at 8%?

**Investment A**:
```
f CLX
10000 CHS g CF₀
3500 g CFⱼ
4 g Nⱼ
8 i
f NPV                → 1,589.87
f IRR                → 15.02%
```

**Investment B**:
```
f CLX
10000 CHS g CF₀
2000 g CFⱼ
7 g Nⱼ
8 i
f NPV                → 405.44
f IRR                → 9.20%
```

**Answer**: Investment A is better (higher NPV and IRR)

---

## Amortization

### Example 33: First Payment Breakdown
**Problem**: For a $200,000 mortgage at 6% for 30 years, how much is principal vs. interest in first payment?

**Keystrokes**:
```
360 n
6 ENTER 12 ÷ i
200000 PV
0 FV
PMT                  → -1,199.10 (monthly payment)

1 f AMORT            (amortize period 1)
x↔y                  → -1,000.00 (interest)
RCL PV              → 199,800.90 (remaining balance)
```

**Results**:
- Monthly payment: $1,199.10
- First payment interest: $1,000.00
- First payment principal: $199.10
- Remaining balance: $199,800.90

---

### Example 34: First Year Amortization
**Problem**: For the same mortgage, total interest and principal in first year (12 payments)?

**Keystrokes**:
```
(TVM already entered from Example 33)
1 ENTER 12 f AMORT   (periods 1-12)
x↔y                  → -11,933.00 (total interest)
g LST x              → -2,456.20 (total principal)
RCL PV              → 197,543.80 (balance after 1 year)
```

**Results**:
- Total payments year 1: $14,389.20
- Interest paid: $11,933.00
- Principal paid: $2,456.20
- Remaining balance: $197,543.80

---

### Example 35: Finding Payoff Balance
**Problem**: After 10 years of payments on the above mortgage, what's the remaining balance?

**Keystrokes**:
```
(TVM already entered)
1 ENTER 120 f AMORT  (periods 1-120)
RCL PV              → 166,791.61
```

**Answer**: After 10 years, $166,791.61 remains

---

## Depreciation

### Example 36: Straight Line Depreciation
**Problem**: Equipment costs $50,000, salvage value $5,000, life 10 years. Annual depreciation?

**Keystrokes**:
```
50000 ENTER          (cost)
5000 -               → 45,000 (depreciable amount)
10 ÷                 → 4,500
```

**Display**: `4,500.00`

**Answer**: $4,500 depreciation per year

Or using built-in function:
```
10 n                 (life)
50000 ENTER          (cost)
5000 -               (salvage)
f SL                 (straight line)
```

---

### Example 37: Declining Balance
**Problem**: Same equipment, 200% declining balance (double declining), year 1 depreciation?

**Keystrokes**:
```
10 n                 (life)
50000 ENTER          (cost)
1 f DB               (declining balance, year 1)
```

**Display**: `10,000.00`

**Answer**: $10,000 first year (20% of $50,000)

---

### Example 38: Sum of Years Digits
**Problem**: Same equipment, SOYD method, year 1 depreciation?

**Keystrokes**:
```
10 n                 (life)
50000 ENTER          (cost)
5000 -               → 45,000 (depreciable amount)
1 f SOYD             (sum of years digits, year 1)
```

**Display**: `8,181.82`

**Answer**: $8,181.82 first year

---

## Date Calculations

### Example 39: Days Between Dates
**Problem**: How many days from January 15, 2024 to March 20, 2024?

**Keystrokes**:
```
1.152024 ENTER       (Jan 15, 2024 in M.DDYYYY format)
3.202024 g ΔDYS      (Mar 20, 2024)
```

**Display**: `65.00`

**Answer**: 65 days (actual days)

---

### Example 40: Future Date
**Problem**: What date is 90 days after June 1, 2024?

**Keystrokes**:
```
6.012024 ENTER       (June 1, 2024)
90 g DATE            (add 90 days)
```

**Display**: `8.302024`

**Answer**: August 30, 2024

---

### Example 41: Age Calculation
**Problem**: How many days has someone lived if born on July 4, 1990 and today is April 12, 2026?

**Keystrokes**:
```
7.041990 ENTER       (birth date)
4.122026 g ΔDYS      (today)
```

**Display**: `13,097.00`

**Answer**: 13,097 days (about 35.86 years)

---

## Real-World Scenarios

### Example 42: Car Lease Decision
**Problem**: Lease a $35,000 car for 36 months at $450/month with $3,000 down, or buy with 4% loan for 60 months. Which is better?

**Lease effective cost**:
```
36 n
3000 PV              (down payment)
450 CHS PMT          (monthly payment)
35000 FV             (residual value)
i                    → 1.52% monthly = 18.24% annual
```

**Purchase loan payment**:
```
60 n
4 ENTER 12 ÷ i
35000 PV
0 FV
PMT                  → -645.30 monthly
```

**Analysis**:
- Lease: Lower monthly ($450 vs $645), but 18.24% implicit rate
- Purchase: Higher monthly, but you own the car and 4% rate is better
- If you keep cars long-term, buying is better

---

### Example 43: Refinance Decision
**Problem**: You have 25 years left on 6% mortgage with $250,000 balance. Refinance to 5% for 20 years costs $3,000. Should you?

**Current loan**:
```
300 n                (25 years)
6 ENTER 12 ÷ i
250000 PV
PMT                  → -1,610.54
```

**New loan** (including closing costs):
```
240 n                (20 years)
5 ENTER 12 ÷ i
253000 PV            (balance + costs)
PMT                  → -1,672.54
```

**Savings**: $1,610.54 - $1,672.54 = -$62.00 more expensive!

**Answer**: Don't refinance. The shorter term outweighs the rate savings.

---

### Example 44: Educational Savings Plan
**Problem**: College costs $30,000/year. Child is 5 years old, college at 18 (13 years). Assuming 3% inflation and 6% investment return, how much to save monthly?

**Step 1**: Future cost in 13 years
```
13 n
3 i                  (inflation)
30000 CHS PV
FV                   → 43,906.37 (year 1 cost)
```

**Step 2**: Monthly savings needed
```
156 n                (13 years × 12)
6 ENTER 12 ÷ i      (monthly return)
0 PV
175625 FV            (4×$43,906, approximating 4 years)
PMT                  → -818.65
```

**Answer**: Save about $819/month

---

### Example 45: Business Valuation
**Problem**: Business generates $100,000/year profit. Profit grows 5%/year. What's its value using 10-year projection at 15% discount rate?

**Keystrokes**:
```
f CLX
0 g CF₀              (no initial investment)
100000 g CFⱼ         (year 1: $100,000)
1 g Nⱼ
105000 g CFⱼ         (year 2: $105,000)
1 g Nⱼ
110250 g CFⱼ         (year 3: $110,250)
1 g Nⱼ
... (continue for 10 years)
15 i
f NPV
```

**Display**: ~$772,173

**Answer**: Business worth approximately $772,000

---

### Example 46: Bond Pricing
**Problem**: Bond pays $50 semi-annually, matures in 5 years at $1,000. Current market rate is 8% annual. What's the fair price?

**Keystrokes**:
```
10 n                 (5 years × 2 periods)
4 i                  (8% ÷ 2 semi-annual)
50 PMT               (coupon payment)
1000 FV              (face value)
PV                   → -918.89
```

**Answer**: Fair price is $918.89 (trading at discount)

---

### Example 47: Equipment Replacement
**Problem**: Machine costs $100,000, saves $30,000/year, lasts 5 years. Required return 12%. Should you buy?

**Keystrokes**:
```
f CLX
100000 CHS g CF₀
30000 g CFⱼ
5 g Nⱼ
12 i
f NPV                → 8,140.33
f IRR                → 15.24%
```

**Answer**: Yes! Positive NPV and IRR > 12%

---

### Example 48: Salary Growth Analysis
**Problem**: Current salary $60,000. If it grows 3% annually, what's total earnings over 30 years in today's dollars (3% inflation)?

This requires calculating each year's real value. Simplified approach:

**Nominal total**:
```
60000 ENTER
1.03 yˣ              (growth factor)
30 ×                 → approximate calculation
```

**Real total**: Since inflation = growth, real total ≈ 30 × $60,000 = $1,800,000

---

## Tips for Complex Problems

### Tip 1: Break Down Complex Calculations
Don't try to do everything at once. Calculate step-by-step and store intermediate results in memory registers.

### Tip 2: Verify Your Work
For important calculations, work backwards:
- Calculated a payment? Verify it pays off the loan.
- Calculated NPV? Check your cash flows sum correctly.

### Tip 3: Use Paper for Cash Flows
For complex NPV/IRR with many cash flows, write them down first to avoid entry errors.

### Tip 4: Understand the Sign Convention
- Money you pay out (investments, loan principal, payments) = negative
- Money you receive (returns, loan proceeds, income) = positive

### Tip 5: Check Units
- Is interest rate annual or monthly?
- Is period in months or years?
- Match n and i to same time period!

---

## Quick Reference: Common Calculations

| Need to Find | Enter | Then Solve For |
|--------------|-------|----------------|
| Loan payment | n, i, PV, FV=0 | PMT |
| Loan payoff | n, i, PMT, FV=0 | PV |
| Investment growth | n, i, PV, PMT | FV |
| Return rate | n, PV, PMT, FV | i |
| Time to goal | i, PV, PMT, FV | n |
| Project value | CF₀, CFⱼ, i | NPV |
| Project return | CF₀, CFⱼ | IRR |

---

**Need more help?**
- See [`quick-start-guide.md`](./quick-start-guide.md) for RPN basics
- See [`technical-spec.md`](./technical-spec.md) for detailed formulas
- See [`user-guide.md`](./user-guide.md) for complete function reference
