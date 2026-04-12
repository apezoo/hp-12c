# HP-12C Technical Specification

## RPN Stack Architecture

### Stack Registers
The HP-12C uses a 4-level RPN stack with automatic lift and drop:

```
T (Top)       - Fourth level
Z (Third)     - Third level  
Y (Second)    - Second level
X (Display)   - First level (displayed)
LastX         - Stores last X value before operation
```

### Stack Operations

#### Stack Lift
Triggered by:
- Entering a digit after an operation
- Pressing ENTER (duplicates X into Y)

#### Stack Drop
Triggered by:
- Arithmetic operations (consume X and Y)
- Single-operand functions (consume X only)

#### Stack Roll Down (R↓)
```
Before:  T Z Y X    After:  X T Z Y
```

#### Exchange X↔Y
```
Before:  T Z Y X    After:  T Z X Y
```

## Financial Calculation Formulas

### Time Value of Money (TVM)

The fundamental TVM equation:
```
PV + PMT × [(1 - (1 + i)^(-n)) / i] + FV × (1 + i)^(-n) = 0
```

Where:
- **n**: number of periods
- **i**: periodic interest rate (as decimal, not percentage)
- **PV**: present value
- **PMT**: payment per period
- **FV**: future value

#### Solving for Interest Rate (i)
Uses Newton-Raphson iteration:
```
i(k+1) = i(k) - f(i(k)) / f'(i(k))
```

Where f(i) is the TVM equation and f'(i) is its derivative.

### Net Present Value (NPV)

```
NPV = CF0 + Σ(CFj / (1 + i)^j)  for j = 1 to n
```

### Internal Rate of Return (IRR)

Solve for i where NPV = 0:
```
0 = CF0 + Σ(CFj / (1 + IRR)^j)  for j = 1 to n
```

Uses Newton-Raphson method with derivative:
```
dNPV/di = Σ(-j × CFj / (1 + i)^(j+1))
```

### Amortization

For period k:
```
Interest(k) = Balance(k-1) × i
Principal(k) = PMT - Interest(k)
Balance(k) = Balance(k-1) - Principal(k)
```

### Depreciation Methods

#### Straight Line (SL)
```
Depreciation = (Cost - Salvage) / Life
```

#### Declining Balance (DB)
```
Depreciation(year) = (Cost - Accumulated) × (Factor / Life)
```

#### Sum of Years Digits (SOYD)
```
Depreciation(year) = (Cost - Salvage) × (Remaining years / Sum of years)
Sum of years = n × (n + 1) / 2
```

## Memory Register Layout

### Standard Registers
- **R0 to R19**: General purpose storage (20 registers)
- **R0 to R4**: Also used for TVM (n, i, PV, PMT, FV)
- **R5 to R19**: Also used for cash flow storage

### Financial Register Mapping
```
R0 = n (number of periods)
R1 = i (interest rate, stored as percentage)
R2 = PV (present value)
R3 = PMT (payment)
R4 = FV (future value)
```

### Cash Flow Register Mapping
```
R5 = CF0 (initial cash flow)
R6 = CF1 (first period cash flow)
...
R19 = CF14 (fourteen period cash flow)
```

## Button Functions

### Primary Functions (White Text on Button)
```
Number Keys: 0-9
Decimal: .
ENTER: Push X to Y, lift stack
CHS: Change sign
EEX: Enter exponent (scientific notation)
CLx: Clear X register
```

### Secondary Functions (Gold, prefix f)
```
f + key activates gold function printed above key
Examples:
- f + 7 = FV (future value)
- f + 8 = PV (present value)  
- f + 9 = PMT (payment)
```

### Tertiary Functions (Blue, prefix g)
```
g + key activates blue function printed below key
Examples:
- g + 0 = x² (square)
- g + 1 = √x (square root)
- g + 2 = LN (natural logarithm)
```

## Error Codes

```
Error 0: Math error (division by zero, sqrt of negative, etc.)
Error 1: Overflow/Underflow
Error 2: Statistical error
Error 3: IRR calculation error (no solution found)
Error 4: Memory error
Error 5: Compound interest error
Error 6: Storage register error
Error 7: IRR calculation error (multiple solutions)
Error 8: Calendar error
Error 9: Service error
```

## Display Formats

### Fixed Decimal (f + 0-9)
Controls number of decimal places (0-9)

### Scientific Notation (f + EEX)
Format: `1.234567890 E±12`

### Engineering Notation
Exponents in multiples of 3

### Display Range
- Normal: 10^-99 to 10^99
- Underflow: Numbers < 10^-99 displayed as 0
- Overflow: Numbers > 10^99 display "9.999999999 E99"

## Precision and Rounding

- Internal: 15-digit precision (JavaScript number)
- Display: 10-digit mantissa
- All calculations use full internal precision
- Display rounds according to format setting

## State Management

### Calculator State Object
```javascript
{
  stack: {
    x: 0,
    y: 0,
    z: 0,
    t: 0,
    lastX: 0
  },
  registers: Array(20).fill(0),
  display: "0.",
  isNewNumber: true,
  isPrefixF: false,
  isPrefixG: false,
  displayFormat: {
    type: "fixed",
    decimals: 2
  },
  cashFlows: [],
  running: false
}
```

## Keyboard Mappings

### Direct Mappings
```
0-9: Number keys
+: Addition
-: Subtraction (also CHS with Shift)
*: Multiplication
/: Division
.: Decimal point
Enter/Return: ENTER
Backspace/Delete: CLx
Escape: Clear all
```

### Key Combinations
```
Shift + Enter: Duplicate (ENTER)
Shift + R: Roll down (R↓)
Shift + X: Exchange (x↔y)
Shift + S: Store (STO)
Shift + R: Recall (RCL)
F: f prefix
G: g prefix
```

## Performance Considerations

### Long-Running Calculations
- IRR: May require 20-30 iterations
- NPV: O(n) where n is number of cash flows
- TVM solving for i: May require 10-20 iterations

### Optimization Strategies
1. Use iterative approximation for IRR
2. Set maximum iteration limits (100 iterations)
3. Set convergence tolerance (0.0000001)
4. Show "Running" indicator for calculations > 100ms
5. Consider using Web Workers for heavy calculations

## Browser Storage

### Local Storage Keys
```
hp12c_state: Current calculator state
hp12c_memory: Memory registers
hp12c_preferences: User preferences (theme, sound, etc.)
hp12c_history: Calculation history
```

## Testing Requirements

### Unit Test Coverage
- All arithmetic operations
- All stack operations
- All mathematical functions
- All financial functions
- Error handling
- Display formatting

### Integration Tests
- Complete calculation sequences
- TVM scenarios
- NPV/IRR calculations
- Memory operations

### Validation Tests
Use examples from HP-12C manual:
1. Simple interest calculation
2. Compound interest
3. Loan payment
4. Mortgage amortization  
5. NPV of investment
6. IRR of cash flows
7. Bond yield
8. Depreciation schedules

## Code Style Guidelines

### JavaScript
```javascript
// Use ES6+ features
// Clear function names
// Single responsibility principle
// Comprehensive comments for complex algorithms

class RPNStack {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.t = 0;
    this.lastX = 0;
  }

  push(value) {
    this.t = this.z;
    this.z = this.y;
    this.y = this.x;
    this.x = value;
  }

  // Additional methods...
}
```

### CSS
```css
/* Use CSS custom properties for theming */
:root {
  --hp12c-body: #2B1810;
  --hp12c-display-bg: #3B442C;
  --hp12c-display-text: #7FAF3F;
  --hp12c-button-bg: #8B6B47;
  --hp12c-button-text: #FFFFFF;
}

/* BEM naming convention */
.calculator__display { }
.calculator__button--golden { }
```

### HTML
```html
<!-- Semantic markup -->
<!-- Accessibility attributes (ARIA labels) -->
<!-- Data attributes for button functions -->

<button class="calculator__button" 
        data-function="add"
        aria-label="Add">
  +
</button>
```

## Accessibility Requirements

### ARIA Labels
- All buttons must have aria-label
- Display should have live region aria-live="polite"
- Keyboard navigation must work throughout

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Focus indicators visible

### Screen Reader Support
- Announce button presses
- Announce display changes
- Announce errors

## Security Considerations

### Input Validation
- Validate all user inputs
- Prevent XSS through display
- Sanitize any stored data

### Safe Math Operations
- Check for division by zero
- Handle overflow/underflow
- Validate numerical ranges

## Performance Metrics

### Target Performance
- Button press: < 50ms response
- Simple operation: < 10ms
- Financial calculation: < 500ms
- IRR calculation: < 2000ms
- Initial load: < 1000ms

### Monitoring
- Log calculation times for optimization
- Track error rates
- Monitor memory usage
