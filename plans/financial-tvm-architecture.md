# HP-12C Financial Functions (TVM) Architecture Plan

**Project Phase:** Phase 5 - Financial Functions (Time Value of Money)  
**Status:** Architecture & Planning  
**Date:** April 14, 2026  
**Complexity:** High (Newton-Raphson iterative solver required)

---

## 📋 Executive Summary

This document outlines the complete architecture for implementing Time Value of Money (TVM) calculations in the HP-12C web simulator. TVM is the core financial capability that distinguishes the HP-12C from basic calculators, enabling users to solve loan, mortgage, investment, and annuity problems.

**Core Capability:** Given any 4 of 5 variables (n, i, PV, PMT, FV), solve for the 5th.

---

## 🎯 Project Goals

### Primary Objectives
1. **Implement 5 TVM Registers:** n, i, PV, PMT, FV with storage and retrieval
2. **Closed-Form Solvers:** Direct calculation for PV, PMT, FV when possible
3. **Iterative Solvers:** Newton-Raphson method for n and i (complex cases)
4. **BEGIN/END Mode:** Payment timing at period start vs. end
5. **Authentic Behavior:** Match HP-12C results within floating-point precision

### Success Criteria
- ✅ All 5 TVM keys functional (store and solve)
- ✅ Solves standard financial problems (mortgage, investment, loan)
- ✅ Results match physical HP-12C within 0.01%
- ✅ Handles edge cases gracefully (no solution, infinite solutions)
- ✅ Comprehensive test coverage (50+ test cases)
- ✅ Clear error messages for invalid inputs

---

## 📐 System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Calculator Controller                     │
│                   (js/calculator.js)                         │
│  - Routes TVM key presses to FinancialEngine                │
│  - Manages BEGIN/END indicator                               │
│  - Coordinates with RPNStack and Memory                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                  Financial Engine                            │
│                  (js/financial.js)                           │
│  ┌─────────────────────┐  ┌──────────────────────┐         │
│  │  TVM Solver         │  │  Payment Mode         │         │
│  │  - Closed-form      │  │  - BEGIN/END          │         │
│  │  - Newton-Raphson   │  │  - Mode switching     │         │
│  └─────────────────────┘  └──────────────────────┘         │
│  ┌─────────────────────┐  ┌──────────────────────┐         │
│  │  Formula Engine     │  │  Validation          │         │
│  │  - PV formula       │  │  - Input checking    │         │
│  │  - PMT formula      │  │  - Edge cases        │         │
│  │  - FV formula       │  │  - Error handling    │         │
│  └─────────────────────┘  └──────────────────────┘         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    Memory Manager                            │
│                   (js/memory.js)                             │
│  Financial Register Mapping:                                 │
│  - R0 = n  (number of periods)                              │
│  - R1 = i  (periodic interest rate)                         │
│  - R2 = PV (present value)                                  │
│  - R3 = PMT (payment)                                       │
│  - R4 = FV (future value)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Interaction Flow - Example: Solving for PMT

1. User enters values:
   360 n      → Store 360 in R0
   6 i        → Store 6.0 in R1  
   200000 PV  → Store 200000 in R2
   0 FV       → Store 0 in R4

2. User solves for PMT:
   Press PMT  → Calculator.handlePrimaryFunction('pmt')
              → FinancialEngine.solvePMT()
              → Read n, i, PV, FV from memory
              → Calculate PMT using closed-form formula
              → Store result in R3
              → Push result to RPN stack X register
              → Update display

3. Result displayed: -1,199.10 (negative = outflow)
```

---

## 🔢 Mathematical Foundation

### TVM Formula (Fundamental Equation)

The core TVM equation that relates all 5 variables:

```
PV + PMT × [(1 + i)^n - 1] / i × (1 + i × BEGIN) + FV / (1 + i)^n = 0
```

Where:
- **n** = number of compounding periods
- **i** = periodic interest rate (decimal, e.g., 0.005 for 0.5%)
- **PV** = present value (negative for outflow, positive for inflow)
- **PMT** = payment per period (negative for outflow, positive for inflow)
- **FV** = future value (negative for outflow, positive for inflow)
- **BEGIN** = 0 for END mode, 1 for BEGIN mode

### Sign Convention (Critical!)

The HP-12C uses cash flow sign convention:
- **Negative values** = money going OUT (payments, investments)
- **Positive values** = money coming IN (receipts, returns)

Example mortgage: PV = +200,000 (loan received), PMT = -1,199 (monthly payment)

---

## 🧮 Solver Algorithms

### 1. Closed-Form Solutions

#### Solve for PV (Present Value)
```javascript
// Formula when i ≠ 0:
PV = -PMT × [(1 - (1 + i)^-n) / i] × (1 + i × BEGIN) - FV / (1 + i)^n

// Special case when i = 0:
PV = -PMT × n - FV
```

**Complexity:** O(1) - Direct calculation  
**Use cases:** Loan amount, bond price, present value of annuity

#### Solve for PMT (Payment)
```javascript
// Formula when i ≠ 0:
PMT = -(PV + FV / (1 + i)^n) × i / [(1 - (1 + i)^-n) × (1 + i × BEGIN)]

// Special case when i = 0:
PMT = -(PV + FV) / n
```

**Complexity:** O(1) - Direct calculation  
**Use cases:** Loan payment, annuity payment, sinking fund

#### Solve for FV (Future Value)
```javascript
// Formula when i ≠ 0:
FV = -PV × (1 + i)^n - PMT × [(1 + i)^n - 1] / i × (1 + i × BEGIN)

// Special case when i = 0:
FV = -PV - PMT × n
```

**Complexity:** O(1) - Direct calculation  
**Use cases:** Investment growth, savings account, retirement planning

### 2. Newton-Raphson Iterative Solutions

#### Solve for n (Number of Periods)

**Challenge:** Requires solving for exponent, no closed-form solution in general case

**Algorithm:**
```javascript
// When PMT = 0 (single cash flow):
n = ln(FV / -PV) / ln(1 + i)

// When PMT ≠ 0 (annuity):
// Use Newton-Raphson iteration on:
// f(n) = PV × (1 + i)^n + PMT × [(1 + i)^n - 1] / i × (1 + i × BEGIN) + FV

// Derivative:
// f'(n) = PV × (1 + i)^n × ln(1 + i) + PMT × [(1 + i)^n × ln(1 + i)] / i × (1 + i × BEGIN)

// Iteration:
n_new = n_old - f(n_old) / f'(n_old)
```

**Convergence:** 5-20 iterations typically  
**Max iterations:** 100 (timeout protection)  
**Tolerance:** 1e-10

#### Solve for i (Interest Rate) - MOST COMPLEX

**Challenge:** Transcendental equation, no closed-form solution, sensitive to initial guess

**Algorithm:**
```javascript
// Newton-Raphson iteration on:
// f(i) = PV + PMT × [(1 + i)^n - 1] / i × (1 + i × BEGIN) + FV / (1 + i)^n

// Derivative:
// f'(i) = PMT × {[(1 + i)^n - 1] × [-1/i²] + [n × (1 + i)^(n-1) / i] × (1 + i × BEGIN)}
//         + PMT × [(1 + i)^n - 1] / i × BEGIN
//         - n × FV × (1 + i)^(-n-1)

// Iteration:
i_new = i_old - f(i_old) / f'(i_old)
```

**Initial Guess Strategy:**
```javascript
// Method 1: Simple heuristic
i_guess = (FV - PV) / (n × (PV + FV) / 2)

// Method 2: Linear interpolation
i_guess = 0.1 (start with 10% as reasonable default)

// Method 3: Bisection fallback if Newton-Raphson diverges
```

**Convergence:** 10-50 iterations typically  
**Max iterations:** 200 (i is hardest to solve)  
**Tolerance:** 1e-10  
**Fallback:** Bisection method if Newton-Raphson fails to converge

---

## 🏗️ Detailed Class Design

### FinancialEngine Class Structure

```javascript
class FinancialEngine {
    constructor() {
        // Payment timing mode
        this.paymentMode = 'END';  // 'BEGIN' or 'END'
        
        // Newton-Raphson configuration
        this.MAX_ITERATIONS = 200;
        this.TOLERANCE = 1e-10;
        this.MIN_RATE = -0.99999;  // Prevent division by zero
        this.MAX_RATE = 1000.0;    // Prevent overflow
        
        // Calculation state
        this.lastSolvedVariable = null;
    }

    // ============================================
    // PUBLIC API - TVM Solvers
    // ============================================
    
    /**
     * Solve for n (number of periods)
     * @param {Object} memory - MemoryManager instance
     * @returns {number} Calculated n value
     * @throws {Error} If solution doesn't exist or invalid inputs
     */
    solveN(memory) {
        const i = memory.getFinancialRegister('i') / 100;
        const pv = memory.getFinancialRegister('pv');
        const pmt = memory.getFinancialRegister('pmt');
        const fv = memory.getFinancialRegister('fv');
        
        // Validation
        this.validateTVMInputs(i, pv, pmt, fv);
        
        // Check for special cases
        if (pmt === 0) {
            return this.solveNSingleCashFlow(i, pv, fv);
        }
        
        // Newton-Raphson iteration
        return this.solveNIterative(i, pv, pmt, fv);
    }

    /**
     * Solve for i (interest rate)
     * @param {Object} memory - MemoryManager instance
     * @returns {number} Calculated i value (as percentage)
     * @throws {Error} If solution doesn't exist or invalid inputs
     */
    solveI(memory) {
        const n = memory.getFinancialRegister('n');
        const pv = memory.getFinancialRegister('pv');
        const pmt = memory.getFinancialRegister('pmt');
        const fv = memory.getFinancialRegister('fv');
        
        // Validation
        this.validateTVMInputs(n, pv, pmt, fv);
        
        // Newton-Raphson iteration with intelligent initial guess
        return this.solveIIterative(n, pv, pmt, fv) * 100;
    }

    /**
     * Solve for PV (present value)
     * @param {Object} memory - MemoryManager instance
     * @returns {number} Calculated PV value
     */
    solvePV(memory) {
        const n = memory.getFinancialRegister('n');
        const i = memory.getFinancialRegister('i') / 100;
        const pmt = memory.getFinancialRegister('pmt');
        const fv = memory.getFinancialRegister('fv');
        
        return this.calculatePV(n, i, pmt, fv);
    }

    /**
     * Solve for PMT (payment)
     * @param {Object} memory - MemoryManager instance
     * @returns {number} Calculated PMT value
     */
    solvePMT(memory) {
        const n = memory.getFinancialRegister('n');
        const i = memory.getFinancialRegister('i') / 100;
        const pv = memory.getFinancialRegister('pv');
        const fv = memory.getFinancialRegister('fv');
        
        return this.calculatePMT(n, i, pv, fv);
    }

    /**
     * Solve for FV (future value)
     * @param {Object} memory - MemoryManager instance
     * @returns {number} Calculated FV value
     */
    solveFV(memory) {
        const n = memory.getFinancialRegister('n');
        const i = memory.getFinancialRegister('i') / 100;
        const pv = memory.getFinancialRegister('pv');
        const pmt = memory.getFinancialRegister('pmt');
        
        return this.calculateFV(n, i, pv, pmt);
    }

    // ============================================
    // CLOSED-FORM CALCULATORS
    // ============================================
    
    calculatePV(n, i, pmt, fv) {
        if (Math.abs(i) < this.TOLERANCE) {
            // i = 0: Simple calculation
            return -(pmt * n + fv);
        }
        
        const beginFactor = this.paymentMode === 'BEGIN' ? (1 + i) : 1;
        const discount = Math.pow(1 + i, -n);
        
        return -(pmt * (1 - discount) / i * beginFactor + fv * discount);
    }

    calculatePMT(n, i, pv, fv) {
        if (Math.abs(i) < this.TOLERANCE) {
            return -(pv + fv) / n;
        }
        
        const beginFactor = this.paymentMode === 'BEGIN' ? (1 + i) : 1;
        const compound = Math.pow(1 + i, n);
        
        return -(pv * i + fv * i / compound) / ((1 - 1/compound) * beginFactor);
    }

    calculateFV(n, i, pv, pmt) {
        if (Math.abs(i) < this.TOLERANCE) {
            return -(pv + pmt * n);
        }
        
        const beginFactor = this.paymentMode === 'BEGIN' ? (1 + i) : 1;
        const compound = Math.pow(1 + i, n);
        
        return -(pv * compound + pmt * (compound - 1) / i * beginFactor);
    }

    // ============================================
    // NEWTON-RAPHSON ITERATIVE SOLVERS
    // ============================================
    
    solveNSingleCashFlow(i, pv, fv) {
        // Special case: PMT = 0, only PV and FV
        if (pv === 0 || fv === 0 || pv * fv > 0) {
            throw new Error('Error 5'); // No solution
        }
        
        if (Math.abs(i) < this.TOLERANCE) {
            throw new Error('Error 5'); // Cannot solve with i=0 and PMT=0
        }
        
        return Math.log(-fv / pv) / Math.log(1 + i);
    }

    solveNIterative(i, pv, pmt, fv) {
        // Initial guess: approximate using logarithm
        let n = 10.0;  // Start with 10 periods as reasonable default
        
        const beginFactor = this.paymentMode === 'BEGIN' ? (1 + i) : 1;
        
        for (let iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
            const compound = Math.pow(1 + i, n);
            const lnCompound = Math.log(1 + i);
            
            // f(n) = PV × (1+i)^n + PMT × [(1+i)^n - 1]/i × (1+i×BEGIN) + FV
            const f = pv * compound + 
                     pmt * (compound - 1) / i * beginFactor + 
                     fv;
            
            // f'(n) = derivative with respect to n
            const df = pv * compound * lnCompound +
                      pmt * compound * lnCompound / i * beginFactor;
            
            if (Math.abs(df) < this.TOLERANCE) {
                throw new Error('Error 7'); // No solution (derivative too small)
            }
            
            // Newton-Raphson step
            const nNew = n - f / df;
            
            // Check convergence
            if (Math.abs(nNew - n) < this.TOLERANCE) {
                return nNew;
            }
            
            // Check for valid range
            if (nNew < 0 || nNew > 99999) {
                throw new Error('Error 5'); // Out of range
            }
            
            n = nNew;
        }
        
        throw new Error('Error 8'); // No convergence
    }

    solveIIterative(n, pv, pmt, fv) {
        // Initial guess strategy: use simple heuristic
        let i = this.getInitialGuessForI(n, pv, pmt, fv);
        
        const beginFactor = this.paymentMode === 'BEGIN' ? 1 : 0;
        
        for (let iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
            const compound = Math.pow(1 + i, n);
            const discount = 1 / compound;
            
            // f(i) = PV + PMT × [(1+i)^n - 1]/i × (1+i×BEGIN) + FV/(1+i)^n
            let f, df;
            
            if (Math.abs(i) < this.TOLERANCE) {
                // Special handling near i = 0
                f = pv + pmt * n + fv;
                df = pmt * n * (n - 1) / 2 - n * fv;
            } else {
                const annuityFactor = (compound - 1) / i;
                const beginMult = 1 + i * beginFactor;
                
                f = pv + pmt * annuityFactor * beginMult + fv * discount;
                
                // Complex derivative - see mathematical foundation above
                df = pmt * beginFactor * annuityFactor +
                     pmt * beginMult * (n * compound / i / (1 + i) - annuityFactor / i) -
                     n * fv * discount / (1 + i);
            }
            
            if (Math.abs(df) < this.TOLERANCE) {
                // Try bisection method as fallback
                return this.solveIBisection(n, pv, pmt, fv);
            }
            
            // Newton-Raphson step
            const iNew = i - f / df;
            
            // Check convergence
            if (Math.abs(iNew - i) < this.TOLERANCE && Math.abs(f) < this.TOLERANCE) {
                return iNew;
            }
            
            // Bounds checking
            if (iNew < this.MIN_RATE || iNew > this.MAX_RATE) {
                return this.solveIBisection(n, pv, pmt, fv);
            }
            
            i = iNew;
        }
        
        throw new Error('Error 8'); // No convergence
    }

    getInitialGuessForI(n, pv, pmt, fv) {
        // Heuristic: estimate based on cash flows
        if (Math.abs(pv) < this.TOLERANCE && Math.abs(pmt) < this.TOLERANCE) {
            return 0.1; // Default 10%
        }
        
        // Simple approximation
        const totalPayments = pmt * n;
        const netCashFlow = fv - pv - totalPayments;
        const avgBalance = (pv + fv) / 2;
        
        if (Math.abs(avgBalance) < this.TOLERANCE) {
            return 0.1;
        }
        
        return netCashFlow / (n * avgBalance);
    }

    solveIBisection(n, pv, pmt, fv) {
        // Bisection method as fallback for i solver
        let iLow = -0.99;
        let iHigh = 10.0;
        
        const beginFactor = this.paymentMode === 'BEGIN' ? 1 : 0;
        
        for (let iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
            const iMid = (iLow + iHigh) / 2;
            
            // Evaluate f at midpoint
            const compound = Math.pow(1 + iMid, n);
            const annuityFactor = (compound - 1) / iMid;
            const beginMult = 1 + iMid * beginFactor;
            const f = pv + pmt * annuityFactor * beginMult + fv / compound;
            
            if (Math.abs(f) < this.TOLERANCE) {
                return iMid;
            }
            
            // Narrow the interval
            const fLow = this.evaluateTVM(n, iLow, pv, pmt, fv);
            if (f * fLow < 0) {
                iHigh = iMid;
            } else {
                iLow = iMid;
            }
            
            if (Math.abs(iHigh - iLow) < this.TOLERANCE) {
                return iMid;
            }
        }
        
        throw new Error('Error 8'); // No convergence
    }

    evaluateTVM(n, i, pv, pmt, fv) {
        const beginFactor = this.paymentMode === 'BEGIN' ? 1 : 0;
        const compound = Math.pow(1 + i, n);
        const annuityFactor = (compound - 1) / i;
        const beginMult = 1 + i * beginFactor;
        return pv + pmt * annuityFactor * beginMult + fv / compound;
    }

    // ============================================
    // VALIDATION & HELPERS
    // ============================================
    
    validateTVMInputs(arg1, arg2, arg3, arg4) {
        // Check for NaN or infinite values
        const values = [arg1, arg2, arg3, arg4];
        for (const val of values) {
            if (!isFinite(val)) {
                throw new Error('Error 0'); // Invalid input
            }
        }
    }

    // ============================================
    // PAYMENT MODE MANAGEMENT
    // ============================================
    
    setPaymentMode(mode) {
        if (mode !== 'BEGIN' && mode !== 'END') {
            throw new Error('Invalid payment mode');
        }
        this.paymentMode = mode;
    }

    getPaymentMode() {
        return this.paymentMode;
    }

    togglePaymentMode() {
        this.paymentMode = this.paymentMode === 'BEGIN' ? 'END' : 'BEGIN';
        return this.paymentMode;
    }
}
```

---

## 🔌 Integration Points

### 1. Calculator Controller Integration

```javascript
// In js/calculator.js

// Handle TVM key presses
handlePrimaryFunction(key, primary) {
    // ... existing code ...
    
    // Financial TVM keys
    case 'n':
        this.handleTVMKey('n');
        break;
    case 'i':
        this.handleTVMKey('i');
        break;
    case 'pv':
        this.handleTVMKey('pv');
        break;
    case 'pmt':
        this.handleTVMKey('pmt');
        break;
    case 'fv':
        this.handleTVMKey('fv');
        break;
}

handleTVMKey(register) {
    if (this.isNewNumber || this.currentInput !== '') {
        // Store mode: store current X register value
        const value = this.stack.getX();
        this.memory.setFinancialRegister(register, value);
        this.isNewNumber = true;
        console.log(`Stored ${value} in ${register.toUpperCase()}`);
    } else {
        // Solve mode: calculate the register value
        try {
            let result;
            switch(register) {
                case 'n':
                    result = this.financial.solveN(this.memory);
                    break;
                case 'i':
                    result = this.financial.solveI(this.memory);
                    break;
                case 'pv':
                    result = this.financial.solvePV(this.memory);
                    break;
                case 'pmt':
                    result = this.financial.solvePMT(this.memory);
                    break;
                case 'fv':
                    result = this.financial.solveFV(this.memory);
                    break;
            }
            
            // Store result
            this.memory.setFinancialRegister(register, result);
            
            // Push to stack
            this.stack.setX(result);
            this.isNewNumber = true;
            
            console.log(`Solved ${register.toUpperCase()} = ${result}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }
}

// Handle BEGIN/END mode (g 7 / g 8)
handleBlueFunction(key) {
    // ... existing code ...
    
    case 'digit-7':  // g 7 = BEGIN
        this.financial.setPaymentMode('BEGIN');
        this.display.setIndicator('begin', true);
        console.log('Payment mode: BEGIN');
        break;
        
    case 'digit-8':  // g 8 = END
        this.financial.setPaymentMode('END');
        this.display.setIndicator('begin', false);
        console.log('Payment mode: END');
        break;
}
```

### 2. Display Manager Integration

```javascript
// In js/display.js

// Ensure BEGIN indicator works
setIndicator(name, active) {
    const indicators = {
        'begin': this.indicators.begin,
        // ... other indicators ...
    };
    
    if (indicators[name]) {
        indicators[name].style.opacity = active ? '1' : '0.2';
    }
}
```

---

## 🧪 Testing Strategy

### Test Structure

Following the pattern from [`tests/test-math-functions.html`](tests/test-math-functions.html:1), create [`tests/test-financial-tvm.html`](tests/test-financial-tvm.html:1)

### Test Categories

#### 1. Basic Storage/Recall Tests (10 tests)
- Store values in n, i, PV, PMT, FV
- Recall values from registers
- Verify register isolation

#### 2. Closed-Form Solver Tests (15 tests)
- **Solve PV:** Various scenarios (loans, investments)
- **Solve PMT:** Monthly payments, annuities
- **Solve FV:** Investment growth, savings

#### 3. Iterative Solver Tests (15 tests)
- **Solve n:** Time to reach goal, loan payoff time
- **Solve i:** Interest rate on loans, IRR approximation

#### 4. BEGIN/END Mode Tests (10 tests)
- Compare BEGIN vs END results
- Verify mode indicator
- Test mode persistence

#### 5. Edge Case Tests (15 tests)
- i = 0 (zero interest)
- PMT = 0 (single cash flow)
- Very large n (long-term loans)
- Very small i (low interest rates)
- Negative interest rates
- No solution cases
- Multiple solution cases

#### 6. Real-World Scenarios (20 tests)
- 30-year mortgage at 6% APR
- Car loan (5 years, 4.5%)
- Retirement savings (25 years, 7% return)
- Student loan payoff
- Investment doubling time
- Annuity calculations

### Sample Test Cases

```javascript
// Test Case: 30-Year Mortgage
{
    description: "30-year mortgage, $200,000 at 6% APR",
    inputs: {
        n: 360,        // 30 years × 12 months
        i: 0.5,        // 6% APR ÷ 12 months
        pv: 200000,    // Loan amount (positive = received)
        fv: 0,         // Paid off completely
        mode: 'END'
    },
    solve: 'pmt',
    expected: -1199.10,  // Monthly payment (negative = paid out)
    tolerance: 0.01
}

// Test Case: Solve for Interest Rate
{
    description: "Find interest rate on a loan",
    inputs: {
        n: 60,         // 5 years × 12 months
        pv: 20000,     // Loan amount
        pmt: -450,     // Monthly payment
        fv: 0,         // Paid off
        mode: 'END'
    },
    solve: 'i',
    expected: 1.0,     // 1% per month = 12% APR
    tolerance: 0.001,  // i is harder, slightly larger tolerance
    requiresIterative: true
}

// Test Case: Investment Growth
{
    description: "Retirement savings, $500/month for 25 years at 7%",
    inputs: {
        n: 300,        // 25 years × 12 months
        i: 0.5833,     // 7% APR ÷ 12 months
        pv: 0,         // Starting from zero
        pmt: -500,     // $500 per month invested
        mode: 'END'
    },
    solve: 'fv',
    expected: 404174.70,  // Future value
    tolerance: 0.01
}

// Test Case: Zero Interest
{
    description: "Simple savings with no interest",
    inputs: {
        n: 60,
        i: 0,          // No interest
        pv: 0,
        pmt: -100,     // $100 per month
        mode: 'END'
    },
    solve: 'fv',
    expected: 6000,    // 60 × $100
    tolerance: 0.01
}

// Test Case: BEGIN mode
{
    description: "Annuity due (BEGIN mode)",
    inputs: {
        n: 10,
        i: 5,          // 5% per period
        pv: 0,
        pmt: -1000,
        mode: 'BEGIN'
    },
    solve: 'fv',
    expected: 13206.79,  // Higher than END mode
    tolerance: 0.01
}
```

### Validation Against Physical HP-12C

Critical step: Test results must match physical calculator within floating-point precision (typically 0.01% or better).

**Validation Sources:**
1. Physical HP-12C calculator
2. HP-12C Platinum (has identical TVM engine)
3. HP-12C Owner's Handbook examples
4. Online HP-12C emulators (for cross-checking)

---

## ⚠️ Error Handling

### Error Types

Following HP-12C error conventions:

| Error Code | Meaning | TVM Context |
|------------|---------|-------------|
| Error 0 | Improper operation | Division by zero, invalid input |
| Error 5 | No solution | Mathematically impossible (e.g., conflicting cash flows) |
| Error 7 | Invalid computation | Derivative too small, unstable iteration |
| Error 8 | No convergence | Iterative solver didn't converge in max iterations |

### Error Scenarios

```javascript
// Scenario 1: No solution exists
// Inputs: n=10, i=5, PV=1000, PMT=-100, solve FV
// Problem: Cash flows don't balance, no valid FV
try {
    const fv = financial.solveFV(memory);
} catch (error) {
    // Display "Error 5" on calculator
}

// Scenario 2: Newton-Raphson doesn't converge
// Inputs: Very unusual cash flow patterns
try {
    const i = financial.solveI(memory);
} catch (error) {
    // Display "Error 8" after 200 iterations
}

// Scenario 3: Division by zero
// Inputs: Attempting calculation with i very close to -1
try {
    const pmt = financial.solvePMT(memory);
} catch (error) {
    // Display "Error 0"
}
```

---

## 📝 Implementation Phases

### Phase 1: Foundation (Day 1-2)
**Goal:** Set up data structures and basic framework

- [ ] Expand [`js/financial.js`](js/financial.js:1) with FinancialEngine class structure
- [ ] Add payment mode (BEGIN/END) state management
- [ ] Implement validation helpers
- [ ] Wire BEGIN/END indicators in display
- [ ] Document all methods with JSDoc comments

**Deliverable:** Skeleton code with method signatures

### Phase 2: Closed-Form Solvers (Day 3-4)
**Goal:** Implement direct calculation methods

- [ ] Implement `calculatePV()` with i=0 special case
- [ ] Implement `calculatePMT()` with i=0 special case
- [ ] Implement `calculateFV()` with i=0 special case
- [ ] Test each function independently
- [ ] Create 15 test cases for closed-form solvers

**Deliverable:** Working PV, PMT, FV solvers

### Phase 3: Newton-Raphson for n (Day 5-6)
**Goal:** Implement iterative solver for number of periods

- [ ] Implement `solveNSingleCashFlow()` for PMT=0 case
- [ ] Implement `solveNIterative()` with Newton-Raphson
- [ ] Calculate derivatives correctly
- [ ] Add convergence detection
- [ ] Test with 10 diverse scenarios
- [ ] Handle edge cases (no solution, out of bounds)

**Deliverable:** Working n solver

### Phase 4: Newton-Raphson for i (Day 7-9)
**Goal:** Implement most complex iterative solver

- [ ] Implement `getInitialGuessForI()` heuristic
- [ ] Implement `solveIIterative()` with Newton-Raphson
- [ ] Implement `solveIBisection()` as fallback
- [ ] Calculate complex derivative for i
- [ ] Test with 15 diverse scenarios
- [ ] Test convergence on difficult cases
- [ ] Profile performance (should solve in < 100ms)

**Deliverable:** Working i solver with bisection fallback

### Phase 5: Calculator Integration (Day 10-11)
**Goal:** Wire everything to calculator UI

- [ ] Add TVM key handlers to [`js/calculator.js`](js/calculator.js:1)
- [ ] Implement store vs solve logic
- [ ] Wire BEGIN/END blue functions (g 7, g 8)
- [ ] Update BEGIN indicator in display
- [ ] Test full interaction flow
- [ ] Add error display for TVM errors

**Deliverable:** Fully functional TVM interface

### Phase 6: Comprehensive Testing (Day 12-14)
**Goal:** Validation and real-world testing

- [ ] Create [`tests/test-financial-tvm.html`](tests/test-financial-tvm.html:1)
- [ ] Implement 50+ automated test cases
- [ ] Test against physical HP-12C calculator
- [ ] Validate all real-world scenarios
- [ ] Test edge cases and error conditions
- [ ] Performance testing (all solvers < 100ms)
- [ ] Fix any bugs discovered

**Deliverable:** Comprehensive test suite with 100% pass rate

### Phase 7: Documentation & Metadata (Day 15)
**Goal:** Update documentation and metadata

- [ ] Update [`js/key-metadata.js`](js/key-metadata.js:1) for all TVM keys
- [ ] Mark implementation status as "implemented"
- [ ] Add usage examples to metadata
- [ ] Update [`NEXT-STEPS.md`](NEXT-STEPS.md:1) completion status
- [ ] Create Phase 5 completion summary document
- [ ] Update project completion percentage

**Deliverable:** Complete documentation

---

## 🎨 User Experience Considerations

### Visual Feedback

1. **BEGIN Indicator:** Light up when in BEGIN mode, dim in END mode
2. **Register Storage:** Brief flash or animation when storing value
3. **Solving Animation:** Optional "calculating..." for iterative solvers
4. **Error Display:** Clear error messages with brief explanation

### Performance Targets

- **Closed-form solvers:** < 1ms (instant)
- **Newton-Raphson for n:** < 50ms (barely noticeable)
- **Newton-Raphson for i:** < 100ms (acceptable delay)
- **Display update:** < 16ms (60fps)

### Keyboard Shortcuts

Map physical keys for quick TVM entry:
- `n` key → n
- `i` key → i  
- `p` key → PV
- `m` key → PMT
- `f` key → FV

---

## 🔍 Edge Cases & Special Scenarios

### 1. Zero Interest Rate (i = 0)
When i = 0, standard formulas have division by zero. Use special cases:
- PV = -(PMT × n + FV)
- PMT = -(PV + FV) / n
- FV = -(PV + PMT × n)

### 2. Single Cash Flow (PMT = 0)
Only PV and FV, simplified to compound interest:
- FV = PV × (1 + i)^n
- n = ln(FV / PV) / ln(1 + i)

### 3. Negative Interest Rates
Possible in modern financial markets. Allow i > -100% (i > -1.0 decimal).

### 4. Very Long Periods
n can be very large (e.g., 360 for 30-year mortgage). Ensure no overflow in (1 + i)^n.

### 5. Cash Flow Sign Errors
User forgets to make PMT negative. Calculator should still solve but result may be counterintuitive. Consider validation warning.

---

## 📚 Resources & References

### Technical References
1. **HP-12C Owner's Handbook** - Chapter 5: TVM Calculations
2. **HP-12C Platinum User's Guide** - Detailed TVM examples
3. **Wikipedia:** [Time Value of Money](https://en.wikipedia.org/wiki/Time_value_of_money)
4. **Wikipedia:** [Newton-Raphson Method](https://en.wikipedia.org/wiki/Newton%27s_method)

### Mathematical Papers
1. "Solving the Interest Rate in Financial Calculators" - HP Journal 1976
2. "Convergence of Iterative TVM Solvers" - Financial Mathematics literature

### Online Validators
1. HP-12C Online Emulator: https://www.hp12c.com/
2. Financial Calculator Aggregator: https://www.calculator.net/finance-calculator.html

---

## 🎯 Success Metrics

### Quantitative Metrics
- ✅ 100% of 50+ test cases pass
- ✅ 99.99% accuracy vs physical HP-12C
- ✅ < 100ms solve time for all calculationss
- ✅ Zero crashes or undefined behavior
- ✅ Handles 100+ sequential calculations without drift

### Qualitative Metrics
- ✅ Matches HP-12C user experience
- ✅ Clear, helpful error messages
- ✅ Documentation is comprehensive
- ✅ Code is maintainable and well-commented
- ✅ Educational layer explains TVM concepts

---

## 🚀 Future Enhancements (Post-Phase 5)

### Phase 5.1: Amortization (AMORT)
Calculate loan amortization schedules showing principal/interest breakdown.

### Phase 5.2: Cash Flow Analysis (NPV, IRR)
Net Present Value and Internal Rate of Return for irregular cash flows.

### Phase 5.3: Advanced Features
- Bond calculations
- Depreciation (SL, DB, SOYD)
- Date arithmetic for actual/360, actual/365

---

## 📋 Implementation Checklist

```markdown
## Phase 5: Financial Functions (TVM) Implementation

### Foundation
- [ ] Expand FinancialEngine class structure
- [ ] Add BEGIN/END payment mode management
- [ ] Implement validation helpers
- [ ] Wire BEGIN/END indicators
- [ ] Complete JSDoc documentation

### Closed-Form Solvers
- [ ] Implement calculatePV() with special cases
- [ ] Implement calculatePMT() with special cases
- [ ] Implement calculateFV() with special cases
- [ ] Test closed-form solvers (15 tests)

### Iterative Solver: n
- [ ] Implement solveNSingleCashFlow()
- [ ] Implement solveNIterative() with Newton-Raphson
- [ ] Add convergence detection
- [ ] Test n solver (10 tests)

### Iterative Solver: i (Most Complex)
- [ ] Implement getInitialGuessForI()
- [ ] Implement solveIIterative()
- [ ] Implement solveIBisection() fallback
- [ ] Test i solver (15 tests)
- [ ] Performance optimization

### Integration
- [ ] Add TVM key handlers to calculator.js
- [ ] Implement store vs solve logic
- [ ] Wire BEGIN/END keys (g 7, g 8)
- [ ] Add error handling and display
- [ ] Manual testing of full workflow

### Testing & Validation
- [ ] Create test-financial-tvm.html
- [ ] Implement 50+ automated tests
- [ ] Validate against physical HP-12C
- [ ] Test all edge cases
- [ ] Performance profiling

### Documentation
- [ ] Update key-metadata.js (all TVM keys)
- [ ] Update NEXT-STEPS.md
- [ ] Create Phase 5 completion summary
- [ ] Update project metrics
```

---

## 🤝 Collaboration Notes

### For Code Reviewers
- **Critical areas:** Newton-Raphson derivative calculations (easy to get wrong)
- **Test coverage:** Must validate against physical calculator
- **Performance:** Profile iterative solvers, especially for i
- **Edge cases:** Verify error handling for all special cases

### For Future Developers
- **Don't modify formulas** without deep understanding - they're mathematically precise
- **Test thoroughly** - financial calculations must be accurate
- **Match HP-12C** - authenticity is a core principle
- **Document assumptions** - especially around sign conventions

---

**Document Version:** 1.0  
**Last Updated:** April 14, 2026  
**Next Review:** During Phase 5 implementation  
**Status:** Ready for Implementation ✅
