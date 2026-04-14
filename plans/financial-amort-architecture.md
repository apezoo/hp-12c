# HP-12C Amortization (AMORT) Architecture

## Overview

Phase 2 implements the HP-12C's amortization functionality, which calculates interest, principal, and remaining balance for loan payment periods. This builds on the TVM engine from Phase 1.

## HP-12C AMORT Operation Flow

### User Workflow
```
1. Set up loan with TVM registers (n, i, PV, PMT)
2. Enter starting period: 1 [ENTER]
3. Enter ending period: 12 [f] [AMORT]
   → Display shows: Interest paid (periods 1-12)
4. [x⇄y] → Display shows: Principal paid (periods 1-12)
5. [RCL] [PV] → Display shows: Remaining balance
```

### Example: $10,000 Loan at 12% for 30 years
```
10000 [CHS] [PV]      # Loan amount
360 [n]                # 30 years monthly
12 [g] [i]            # 12% annual rate
[PMT]                 # Calculate payment = 102.86

# Amortize first year (periods 1-12)
1 [ENTER] 12 [f] [AMORT]
→ Interest: -1,161.08  # Total interest paid
[x⇄y]
→ Principal: -73.24    # Total principal paid
[RCL] [PV]
→ Balance: -9,926.76   # Remaining balance
```

## Architecture Design

### 1. Amortization State Structure

```javascript
amortSchedule: {
    // Input parameters (from TVM)
    principal: null,      // Original loan amount (PV)
    rate: null,           // Periodic interest rate (i/100)
    payment: null,        // Payment amount (PMT)
    totalPeriods: null,   // Total loan term (n)
    isBeginMode: false,   // Payment timing
    
    // Amortization range
    startPeriod: null,
    endPeriod: null,
    
    // Calculated results
    interestPaid: null,   // Cumulative interest for range
    principalPaid: null,  // Cumulative principal for range
    balance: null,        // Remaining balance after range
    
    // Period-by-period detail (for advanced features)
    schedule: []          // Array of {period, payment, interest, principal, balance}
}
```

### 2. Core Algorithm: Period-by-Period Calculation

```javascript
function calculateAmortization(startPer, endPer) {
    // Validate TVM registers are set
    // Calculate period-by-period:
    //   For each period from 1 to endPer:
    //     interest = balance * rate (or rate at end if BEGIN mode)
    //     principal = payment - interest
    //     balance = balance - principal
    
    // Sum values for range [startPer, endPer]
    // Return {interestPaid, principalPaid, balance}
}
```

### 3. BEGIN vs END Mode Handling

**END Mode (default):**
- Payment at end of period
- Interest accrues first, then payment applied
- Interest = balance * rate
- Principal = payment - interest

**BEGIN Mode:**
- Payment at beginning of period
- Payment applied first, then interest accrues
- Principal applied first
- Interest = (balance - principal) * rate

### 4. Key Integration

**HP-12C Key Sequence:**
```
[f] [AMORT]   # Blue function key (row 2, position AMORT overlay)
```

**Calculator State Flow:**
```
1. User enters starting period and presses ENTER
2. User enters ending period  
3. User presses [f] then [AMORT]
4. Calculator:
   - Retrieves periods from stack (y=start, x=end)
   - Validates TVM registers
   - Calculates amortization
   - Stores results
   - Displays interest paid
5. [x⇄y] swaps to show principal paid
6. [RCL] [PV] shows remaining balance
```

## Implementation Plan

### Step 1: Add Amortization State to Financial Module
```javascript
// In financial.js
state: {
    tvm: {...},
    amort: {
        startPeriod: null,
        endPeriod: null,
        interestPaid: null,
        principalPaid: null,
        balance: null
    }
}
```

### Step 2: Implement Core Amortization Engine
```javascript
function amortize(startPeriod, endPeriod) {
    // Input validation
    // Period-by-period calculation
    // Accumulation for range
    // Return results
}
```

### Step 3: Create Helper Functions
```javascript
calculatePeriod(period, currentBalance)  // Single period calculation
validateAmortInputs()                     // Check TVM registers are set
getAmortizationSchedule()                 // Return full schedule
```

### Step 4: Calculator Integration
```javascript
// Add AMORT key handler
case 'AMORT':
    if (calculator.fKeyActive) {
        handleAmortCalculation();
    }
    break;
```

### Step 5: Display Management
```javascript
// After AMORT calculation:
// - Display interest paid (primary result)
// - Store principal in Y register
// - Store balance in temp location for RCL PV
```

## Validation & Edge Cases

### Input Validation
- ✅ TVM registers must be set (n, i, PV, PMT)
- ✅ Start period must be ≥ 1
- ✅ End period must be ≥ start period
- ✅ End period must be ≤ n (total periods)
- ✅ Payment amount must be sufficient to amortize

### Edge Cases
1. **Zero Payment:** Error 5 (invalid payment)
2. **Negative Amortization:** Payment < interest (balance grows)
3. **Period Out of Range:** Error if endPer > n
4. **No TVM Setup:** Error if registers not initialized
5. **BEGIN Mode:** Different calculation sequence

### Precision Requirements
- Match HP-12C to 2 decimal places
- Handle rounding appropriately per period
- Maintain accuracy across many periods

## Testing Strategy

### Unit Tests
1. **Basic Loan Amortization**
   - Standard 30-year mortgage
   - Single period calculation
   - Multiple period ranges

2. **Payment Mode Tests**
   - END mode (default)
   - BEGIN mode
   - Verify different results

3. **Edge Cases**
   - First period only
   - Last period only
   - Entire loan (period 1 to n)
   - Out-of-range periods

4. **Real-World Scenarios**
   - Car loan (5 years)
   - Mortgage (30 years, 15 years)
   - Business loan
   - Compare with HP-12C examples

### Integration Tests
1. TVM + AMORT workflow
2. Multiple amortization calculations
3. Re-amortization after payment change

## API Design

```javascript
// Public interface
Financial.amortize(startPeriod, endPeriod)
Financial.getAmortInterest()
Financial.getAmortPrincipal()
Financial.getAmortBalance()
Financial.getAmortSchedule()  // Full schedule

// Internal helpers
_calculateAmortPeriod(period, balance)
_validateAmortInputs(start, end)
_accumulateRange(start, end)
```

## Success Criteria

✅ **Accuracy:** Match HP-12C results within 0.01
✅ **Completeness:** Support all HP-12C AMORT operations
✅ **Integration:** Seamless workflow with TVM
✅ **Edge Cases:** Handle all error conditions
✅ **BEGIN Mode:** Correct handling of payment timing
✅ **Documentation:** Clear examples and test cases

## Next Steps

1. Implement amortization engine in [`financial.js`](../js/financial.js)
2. Add state management
3. Integrate with calculator keys
4. Create comprehensive test suite
5. Document with examples
6. Validate against HP-12C manual examples

## References

- HP-12C Owner's Handbook: Section on Amortization
- TVM Phase 1 implementation: [`financial.js`](../js/financial.js)
- Test suite structure: [`test-financial-tvm.html`](../tests/test-financial-tvm.html)
