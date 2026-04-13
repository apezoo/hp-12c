# HP-12C Quick Start Guide

## 🎓 Learn Mode - Your Interactive Guide

Before diving into calculations, take advantage of the **Learn Mode** feature!

### What is Learn Mode?

Learn Mode is an interactive educational layer that helps you understand every key on the HP-12C calculator. It's perfect for beginners and experts alike.

### How to Use Learn Mode

1. **Find the toggle** at the top of the calculator (below the title)
2. **Click the toggle** to turn Learn Mode ON
3. **Hover over any key** to see a quick tooltip with basic information
4. **Click any key** to open a detailed information page with:
   - Complete function descriptions
   - Primary, gold (f), and blue (g) functions
   - Implementation status
   - Technical details
5. **Click "← Back to Calculator"** to return
6. **Toggle OFF** when you're ready to use the calculator normally

### Understanding Status Badges

When viewing key details, you'll see status badges:
- ✅ **Implemented** - This function works right now!
- ⚙️ **Partially Implemented** - Basic functionality working
- 📋 **Planned** - Coming soon (but documentation is ready)

**Tip:** All 39 keys are documented in Learn Mode, even those not yet implemented in the calculator. This lets you learn about the complete HP-12C while we continue development.

---

## Introduction to RPN (Reverse Polish Notation)

The HP-12C uses RPN logic, which is different from standard calculators. Instead of pressing `2 + 3 =`, you press `2 ENTER 3 +`.

### Why RPN?
- **No equals key needed**: Results appear immediately
- **No parentheses needed**: Natural order of operations
- **Efficient**: Fewer keystrokes for complex calculations
- **Visible stack**: You can see intermediate results

## Basic Operations

### Simple Addition
**Problem**: 2 + 3

**Steps**:
1. Press `2`
2. Press `ENTER` (pushes 2 onto stack)
3. Press `3`
4. Press `+`
5. **Result**: 5

### Simple Subtraction
**Problem**: 8 - 3

**Steps**:
1. Press `8`
2. Press `ENTER`
3. Press `3`
4. Press `-`
5. **Result**: 5

### Multiplication
**Problem**: 4 × 5

**Steps**:
1. Press `4`
2. Press `ENTER`
3. Press `5`
4. Press `×`
5. **Result**: 20

### Division
**Problem**: 20 ÷ 4

**Steps**:
1. Press `20`
2. Press `ENTER`
3. Press `4`
4. Press `÷`
5. **Result**: 5

## Chain Calculations

### Example: (2 + 3) × 4
In RPN, this is natural:

**Steps**:
1. Press `2 ENTER 3 +` → Result: 5
2. Press `4 ×` → Result: 20

No parentheses needed!

### Example: (10 + 5) ÷ (2 + 1)

**Steps**:
1. Press `10 ENTER 5 +` → Result: 15 (stack: 15)
2. Press `2 ENTER 1 +` → Result: 3 (stack: 15, 3)
3. Press `÷` → Result: 5

## Using the Stack

### View the Stack
The display shows the **X register** (bottom of stack). The stack has 4 levels:

```
T (Top)
Z
Y  
X (Display) ← You see this
```

### Stack Operations

#### ENTER
Duplicates X into Y and lifts the stack.

#### R↓ (Roll Down)
Rotates stack: T→X, Z→T, Y→Z, X→Y

#### x↔y (Exchange)
Swaps X and Y registers.

#### CLx (Clear X)
Clears only the display (X register).

## Memory Storage

### Store a Number (STO)
1. Enter the number
2. Press `STO`
3. Press register number (0-9)

**Example**: Store 42 in register 5
- Press `42 STO 5`

### Recall a Number (RCL)
1. Press `RCL`
2. Press register number

**Example**: Recall from register 5
- Press `RCL 5` → Display: 42

## Financial Calculations

### Loan Payment Example
**Problem**: Calculate monthly payment for a $200,000 loan at 6% annual interest for 30 years.

**Steps**:
1. `360 n` (30 years × 12 months)
2. `6 ENTER 12 ÷ i` (6% annual ÷ 12 = 0.5% monthly)
3. `200000 PV` (loan amount)
4. `0 FV` (fully amortized)
5. `PMT` → **Result**: -1,199.10

(Negative indicates money paid out)

### Investment Return (NPV) Example
**Problem**: Investment costs $10,000. Returns $3,000/year for 5 years. What's the NPV at 8% discount rate?

**Steps**:
1. `10000 CHS g CF₀` (initial investment, negative)
2. `3000 g CFⱼ` (first cash flow)
3. `5 g Nⱼ` (5 occurrences)
4. `8 i` (discount rate)
5. `f NPV` → **Result**: 1,981.62

Positive NPV means good investment!

## Common Mathematical Functions

### Square Root
- Enter number
- Press `g √x`

**Example**: √16
- `16 g √x` → Result: 4

### Square
- Enter number
- Press `g x²`

**Example**: 5²
- `5 g x²` → Result: 25

### Reciprocal (1/x)
- Enter number
- Press `1/x`

**Example**: 1/4
- `4 1/x` → Result: 0.25

### Percentage
**Problem**: What is 15% of 200?

**Steps**:
- `200 ENTER 15 %` → Result: 30

### Percentage Change (Δ%)
**Problem**: Percentage change from 50 to 65?

**Steps**:
- `50 ENTER 65 Δ%` → Result: 30 (30% increase)

## Display Formats

### Set Decimal Places
Press `f` followed by a digit (0-9)

- `f 2` → Shows 2 decimal places
- `f 4` → Shows 4 decimal places
- `f 9` → Shows 9 decimal places

### Scientific Notation
Press `f EEX` to toggle scientific notation display.

## Error Messages

If you see "Error X" in display:
- **Error 0**: Math error (like division by zero)
- **Error 3**: IRR calculation error

**To clear**: Press any key

## Tips and Tricks

### 1. Use ENTER to Separate Numbers
Always press ENTER between consecutive numbers:
- `2 ENTER 3 +` ✓
- `2 3 +` ✗ (This would be 23+)

### 2. LastX Register
After an operation, the previous X value is saved in LastX.
- Press `g LST x` to recall it

**Use case**: Made a mistake? Undo the last operation:
- `5 ENTER 3 +` → Result: 8
- `g LST x` → Recall 3
- `-` → Result: 5 (undone!)

### 3. Change Sign Quickly
Press `CHS` to change the sign of the number in X.

### 4. Clear Everything
- `f CLX` → Clear all registers and stack
- `CLx` → Clear only display (X)

### 5. Test Your Calculation
Verify: Does 9² = 81?
- `9 g x² 81 -` → Should equal 0

## Practice Problems

### Problem 1: Basic Calculation
Calculate: (12 + 8) × 3 ÷ 4

<details>
<summary>Solution</summary>

1. `12 ENTER 8 +` → 20
2. `3 ×` → 60
3. `4 ÷` → 15

**Answer**: 15
</details>

### Problem 2: Mortgage Payment
$300,000 mortgage, 30 years, 5.5% annual interest. Monthly payment?

<details>
<summary>Solution</summary>

1. `360 n` (30 years × 12 months)
2. `5.5 ENTER 12 ÷ i` (monthly rate)
3. `300000 PV`
4. `0 FV`
5. `PMT`

**Answer**: -1,703.37 per month
</details>

### Problem 3: Investment Growth
Invest $5,000 at 7% annual interest for 10 years. Future value?

<details>
<summary>Solution</summary>

1. `10 n`
2. `7 i`
3. `5000 CHS PV` (negative = money paid out)
4. `0 PMT`
5. `FV`

**Answer**: $9,835.76
</details>

## Keyboard Shortcuts

When using the web calculator:

- **Numbers**: Type 0-9
- **Operations**: +, -, *, /
- **Enter**: Press Enter or Return
- **Clear**: Press Escape or Delete
- **Decimal**: Press . (period)

## Getting Help

### In-Calculator Help
- Hover over any button to see its function
- Click the "?" button for detailed help
- Press F1 for keyboard shortcuts

## Next Steps

Once you're comfortable with basics:

1. **Learn TVM**: Master n, i, PV, PMT, FV calculations
2. **Explore NPV/IRR**: Analyze investments and projects
3. **Try Amortization**: Create loan payment schedules
4. **Use Memory**: Store and recall frequently used values

## Additional Resources

- Full User Guide: See [`docs/user-guide.md`](./user-guide.md)
- Example Calculations: See [`docs/examples.md`](./examples.md)
- Technical Docs: See [`docs/technical-spec.md`](./technical-spec.md)

## Common Questions

### Q: Why is my payment negative?
A: Cash outflows (payments, investments) are negative. Cash inflows (receipts) are positive.

### Q: Can I use parentheses?
A: No need! RPN eliminates the need for parentheses through its natural stack-based calculation order.

### Q: What if I make a mistake?
A: Press CLx to clear the current entry, or use the LastX function to undo the last operation.

### Q: How do I calculate compound interest?
A: Use the TVM keys (n, i, PV, PMT, FV). Enter 4 values and solve for the 5th.

---

**Happy Calculating!** 🧮

The HP-12C is a powerful financial calculator. Take time to practice RPN logic, and you'll find it becomes second nature.
