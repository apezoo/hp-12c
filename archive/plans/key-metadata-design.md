# Key Metadata Design Document - Phase 2

## Executive Summary

This document provides the complete architectural design for [`js/key-metadata.js`](../js/key-metadata.js), including:
- Complete inventory of all 40 HP-12C keys
- Standardized data-key naming convention
- Detailed metadata schema with examples
- Implementation status mapping
- Educational content structure
- Code generation templates

## 1. Complete Key Inventory

### 1.1 Current State Analysis

From [`index.html`](../index.html), here are all 40 physical keys with their **current** data-key values:

| # | Current data-key | Label | Gold Function(s) | Blue Function(s) | Category |
|---|------------------|-------|------------------|------------------|----------|
| 1 | `n` | n | AMORT | 12× | financial |
| 2 | `i` | i | INT | 12÷ | financial |
| 3 | `PV` | PV | NPV | CFo | financial |
| 4 | `PMT` | PMT | RND | CFj | financial |
| 5 | `FV` | FV | IRR | Nj | financial |
| 6 | `CHS` | CHS | - | DATE | arithmetic |
| 7 | `7` | 7 | - | BEG | numeric-entry |
| 8 | `8` | 8 | - | END | numeric-entry |
| 9 | `9` | 9 | - | MEM | numeric-entry |
| 10 | `divide` | ÷ | - | - | arithmetic |
| 11 | `yx` | yˣ | PRICE/BOND/YTM | √x | power-log |
| 12 | `1x` | 1/x | - | eˣ | arithmetic |
| 13 | `PT` | %T | - | LN | percentage |
| 14 | `DP` | Δ% | SL/SOYD/DB | FRAC | percentage |
| 15 | `PCT` | % | - | INTG | percentage |
| 16 | `EEX` | EEX | - | ΔDYS | numeric-entry |
| 17 | `4` | 4 | - | D.MY | numeric-entry |
| 18 | `5` | 5 | - | M.DY | numeric-entry |
| 19 | `6` | 6 | - | x̄w | numeric-entry |
| 20 | `multiply` | × | - | - | arithmetic |
| 21 | `RS` | R/S | P/R | PSE | control |
| 22 | `SST` | SST | Σ | BST | programming |
| 23 | `Rdown` | R↓ | PRGM | GTO | stack |
| 24 | `xy` | x↔y | CLEAR FIN/REG/PREFIX | x≤y | stack |
| 25 | `CLx` | CLx | - | x=0 | stack |
| 26 | `ENTER` | ENTER | - | LSTx | stack |
| 27 | `1` | 1 | - | ŷ,r | numeric-entry |
| 28 | `2` | 2 | - | x̂,r | numeric-entry |
| 29 | `3` | 3 | - | n! | numeric-entry |
| 30 | `subtract` | − | - | - | arithmetic |
| 31 | `ON` | ON | - | - | control |
| 32 | `f` | f | - | - | prefix |
| 33 | `g` | g | - | - | prefix |
| 34 | `STO` | STO | - | - | memory |
| 35 | `RCL` | RCL | - | - | memory |
| 36 | `0` | 0 | - | x̄ | numeric-entry |
| 37 | `decimal` | . | - | s | numeric-entry |
| 38 | `SigmaPlus` | Σ+ | - | Σ− | statistics |
| 39 | `add` | + | - | - | arithmetic |

**Note:** Number 40 is a composite - the implementation plan shows 40 keys, but the actual count includes the ENTER key which spans multiple columns.

### 1.2 Standardized Data-Key Naming

According to the [implementation plan](educational-layer-implementation-plan.md#12-proposed-standardization-strategy), we need to standardize all data-key values:

| Current | Standardized | Reason |
|---------|--------------|--------|
| `n` | `n` | Already correct |
| `i` | `i` | Already correct |
| `PV` | `pv` | Lowercase consistency |
| `PMT` | `pmt` | Lowercase consistency |
| `FV` | `fv` | Lowercase consistency |
| `CHS` | `chs` | Lowercase consistency |
| `7` | `digit-7` | Explicit digit prefix |
| `8` | `digit-8` | Explicit digit prefix |
| `9` | `digit-9` | Explicit digit prefix |
| `divide` | `op-divide` | Explicit operation prefix |
| `yx` | `power-yx` | Descriptive name |
| `1x` | `reciprocal` | Descriptive name |
| `PT` | `percent-total` | Descriptive name |
| `DP` | `delta-percent` | Descriptive name |
| `PCT` | `percent` | Descriptive name |
| `EEX` | `eex` | Lowercase consistency |
| `4` | `digit-4` | Explicit digit prefix |
| `5` | `digit-5` | Explicit digit prefix |
| `6` | `digit-6` | Explicit digit prefix |
| `multiply` | `op-multiply` | Explicit operation prefix |
| `RS` | `rs` | Lowercase consistency |
| `SST` | `sst` | Lowercase consistency |
| `Rdown` | `roll-down` | Descriptive name |
| `xy` | `swap-xy` | Descriptive name |
| `CLx` | `clx` | Lowercase consistency |
| `ENTER` | `enter` | Lowercase consistency |
| `1` | `digit-1` | Explicit digit prefix |
| `2` | `digit-2` | Explicit digit prefix |
| `3` | `digit-3` | Explicit digit prefix |
| `subtract` | `op-subtract` | Explicit operation prefix |
| `ON` | `on` | Lowercase consistency |
| `f` | `prefix-f` | Explicit prefix designation |
| `g` | `prefix-g` | Explicit prefix designation |
| `STO` | `sto` | Lowercase consistency |
| `RCL` | `rcl` | Lowercase consistency |
| `0` | `digit-0` | Explicit digit prefix |
| `decimal` | `decimal` | Already correct |
| `SigmaPlus` | `sigma-plus` | Lowercase with hyphen |
| `add` | `op-add` | Explicit operation prefix |

## 2. Metadata Schema Structure

### 2.1 Complete Schema Definition

```javascript
{
  "key-id": {
    // === IDENTITY ===
    id: "key-id",                    // Matches object key
    dataKey: "key-id",               // Matches standardized data-key attribute
    label: "Display Label",          // What appears on the key face
    displayName: "Human Name",       // Full human-readable name
    
    // === CLASSIFICATION ===
    category: "category-name",       // See category list below
    type: "key",                     // Always "key" for physical keys
    
    // === PRIMARY FUNCTION ===
    primaryFunction: {
      title: "Function Title",
      description: "Detailed description of primary function behavior",
      examples: [
        "Example usage 1",
        "Example usage 2"
      ],
      keystrokes: "7 ENTER 8 +"     // Keystroke sequence if applicable
    },
    
    // === SHIFTED FUNCTIONS ===
    shiftedFunctions: {
      gold: [
        {
          label: "AMORT",
          title: "Amortization",
          description: "Calculate loan amortization schedule",
          implementationStatus: "planned",
          examples: ["Example if applicable"],
          keystrokes: "f n"
        }
      ],
      blue: [
        {
          label: "12×",
          title: "Multiply by 12",
          description: "Multiplies the number by 12",
          implementationStatus: "planned",
          examples: ["Example if applicable"],
          keystrokes: "g n"
        }
      ]
    },
    
    // === DOCUMENTATION ===
    shortDescription: "One-line summary for tooltip",
    longDescription: "Extended multi-paragraph description",
    
    // === IMPLEMENTATION ===
    implementation: {
      status: "implemented",         // See status enum below
      note: "Specific implementation details",
      version: "1.0"
    },
    
    // === HISTORICAL CONTEXT ===
    originalHp12cBehavior: "How this key worked on original HP-12C",
    simulatorBehavior: "How this key works in our web simulator",
    
    // === EDUCATIONAL CONTENT ===
    relatedTopics: [
      "RPN (Reverse Polish Notation)",
      "Stack Operations"
    ],
    relatedKeys: ["enter", "clx", "swap-xy"],
    commonMistakes: [
      "Forgetting to press ENTER between numbers",
      "Confusing with algebraic notation"
    ],
    expertTips: [
      "Use roll-down to review stack contents",
      "ENTER duplicates X for quick squaring"
    ]
  }
}
```

### 2.2 Category Enum

Valid category values:
- `financial` - TVM, NPV, IRR, amortization
- `arithmetic` - Basic operations (+, −, ×, ÷, CHS, 1/x)
- `percentage` - %, %T, Δ%
- `stack` - ENTER, CLx, R↓, x↔y, LSTx
- `memory` - STO, RCL
- `control` - ON, R/S, PSE
- `programming` - SST, BST, GTO, PRGM
- `statistics` - Σ+, Σ−, x̄, s, regression
- `numeric-entry` - Digits 0-9, decimal, EEX
- `prefix` - f, g (prefix mode toggles)
- `power-log` - yˣ, √x, eˣ, LN
- `date` - DATE, ΔDYS, D.MY, M.DY
- `bond` - PRICE, BOND, YTM
- `depreciation` - SL, SOYD, DB

### 2.3 Implementation Status Enum

Valid status values:
- `implemented` - Fully functional and tested
- `partially-implemented` - Code exists but not fully wired or incomplete
- `planned` - Design documented, implementation scheduled
- `not-implemented` - No implementation started
- `informational-only` - Display-only, no calculator logic (e.g., brand elements)

## 3. Implementation Status Mapping

### 3.1 Fully Implemented Keys (✅ implemented)

**Rationale:** These keys have complete, working implementations in [`calculator.js`](../js/calculator.js).

| Key ID | Label | Function |
|--------|-------|----------|
| `digit-0` through `digit-9` | 0-9 | Digit entry |
| `decimal` | . | Decimal point entry |
| `op-add` | + | Addition |
| `op-subtract` | − | Subtraction |
| `op-multiply` | × | Multiplication |
| `op-divide` | ÷ | Division |
| `enter` | ENTER | Duplicate X to Y, push stack |
| `clx` | CLx | Clear X register |
| `roll-down` | R↓ | Roll stack down |
| `swap-xy` | x↔y | Swap X and Y registers |
| `on` | ON | Reset calculator |
| `prefix-f` | f | Activate gold function mode |
| `prefix-g` | g | Activate blue function mode |

**Total: 17 keys**

### 3.2 Partially Implemented Keys (⚙️ partially-implemented)

**Rationale:** Logic exists in code but not connected to UI or incomplete.

| Key ID | Label | Status Detail |
|--------|-------|---------------|
| `chs` | CHS | Change sign method exists but not wired in handlePrimaryFunction |
| `sto` | STO | MemoryManager.store() exists but not wired to UI |
| `rcl` | RCL | MemoryManager.recall() exists but not wired to UI |

**Total: 3 keys**

### 3.3 Planned Keys (⚠️ planned)

All remaining keys are planned for future implementation:

**Financial (5 keys):** n, i, pv, pmt, fv  
**Scientific (6 keys):** power-yx, reciprocal, percent-total, delta-percent, percent, eex  
**Programming (2 keys):** rs, sst  
**Statistics (1 key):** sigma-plus

**Total: 14 keys planned**

**Plus all shifted functions (60+ functions total).**

## 4. Metadata Examples by Category

### 4.1 Fully Implemented: Digit Key

```javascript
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
          "Rent calculations"
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
    "Stack Lift"
  ],
  
  relatedKeys: ["digit-0", "digit-1", "digit-2", "digit-3", "digit-4", "digit-5", "digit-6", "digit-8", "digit-9", "decimal", "enter"],
  
  commonMistakes: [
    "Forgetting to press ENTER between two numbers (e.g., typing '5 7' gives 57, not 5 and 7)",
    "Expecting algebraic notation instead of RPN"
  ],
  
  expertTips: [
    "Digits can be entered at any time - the calculator knows when to start a new number",
    "Use ENTER to explicitly separate numbers when building stack operations",
    "The BEG function (g 7) is essential for lease and rent calculations"
  ]
}
```

### 4.2 Fully Implemented: Arithmetic Operation

```javascript
"op-add": {
  id: "op-add",
  dataKey: "op-add",
  label: "+",
  displayName: "Addition",
  category: "arithmetic",
  type: "key",
  
  primaryFunction: {
    title: "Add",
    description: "Adds the Y register to the X register, consuming both values. The result is placed in X, and the stack drops down (Z→Y, T→Z, T remains in T).",
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
  longDescription: "The addition key is one of the four basic arithmetic operations in the HP-12C. It operates on the two bottom stack registers: Y (second number) and X (first number). Like all HP calculators using RPN, you enter operands first, then the operation. The result replaces both operands, and the stack automatically drops down to fill the gap.",
  
  implementation: {
    status: "implemented",
    note: "Full RPN addition with proper stack drop behavior. Handles all numeric ranges correctly.",
    version: "1.0"
  },
  
  originalHp12cBehavior: "Performs Y + X, stores result in X, drops stack. If the result causes overflow (exceeds 9.999999999 × 10^99), displays 'Error 0' and stops.",
  
  simulatorBehavior: "Fully matches original HP-12C behavior including stack management and RPN semantics. Currently does not implement overflow detection.",
  
  relatedTopics: [
    "RPN (Reverse Polish Notation)",
    "Stack Operations",
    "Arithmetic Operations",
    "Stack Drop"
  ],
  
  relatedKeys: ["op-subtract", "op-multiply", "op-divide", "enter", "clx"],
  
  commonMistakes: [
    "Typing '5 + 3' without ENTER between (results in 53, not 8)",
    "Forgetting that addition consumes both X and Y from the stack",
    "Not understanding that the stack drops after binary operations"
  ],
  
  expertTips: [
    "Chain operations without intermediate ENTER: '10 ENTER 20 + 30 +' works perfectly",
    "Addition is commutative, so order doesn't matter, but subtraction and division do",
    "Use R↓ before operations to review what's in the stack"
  ]
}
```

### 4.3 Partially Implemented: Change Sign

```javascript
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
    status: "partially-implemented",
    note: "The changeSign() method exists in calculator.js at line ~313, but handlePrimaryFunction() does not call it when CHS is pressed. Needs wire-up in button handler.",
    version: "1.0"
  },
  
  originalHp12cBehavior: "Changes the sign of X register immediately. Works during digit entry or on completed numbers. If pressed during exponent entry (after EEX), changes the sign of the exponent, not the mantissa.",
  
  simulatorBehavior: "Logic is implemented but not connected to the UI. The key press is currently not handled, so pressing CHS has no effect. This is a wiring issue, not a logic issue.",
  
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
}
```

### 4.4 Planned: Financial Function

```javascript
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
      "Check stored value: 'RCL n' displays currently stored n value"
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
        implementationStatus: "planned",
        examples: [
          "Convert years to months: '5 g n' → displays 60",
          "Convert annual rate to monthly: '6 ENTER 12 ÷ i' stores monthly rate"
        ],
        keystrokes: "g n"
      }
    ]
  },
  
  shortDescription: "Stores or solves for number of compounding periods in TVM calculations",
  longDescription: "The n key is one of the five Time Value of Money registers (n, i, PV, PMT, FV) that form the core of the HP-12C's financial capabilities. The n register stores the number of compounding or payment periods in a financial calculation. For loans and mortgages, this is typically the number of monthly payments. For investments, it might be years or any other period.\n\nWhen solving TVM problems, you typically:\n1. Enter known values into four of the five TVM keys\n2. Press the unknown key to solve for it\n3. The HP-12C iteratively calculates the unknown value\n\nThe n value must match the compounding frequency of the interest rate (i). If i is monthly, n should be in months. The helpful 'g n' (12×) function converts annual periods to monthly.",
  
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
    "Not understanding that n must be positive (loans in arrears)",
    "Confusing n with number of years (n is number of periods)"
  ],
  
  expertTips: [
    "Always ensure n and i use the same time period (both monthly or both annual)",
    "Use 'g n' (12×) to quickly convert years to months: type years, press 'g n'",
    "For a 30-year mortgage with monthly payments, n = 360 (30 years × 12 months)",
    "To check stored n value, use 'RCL .1' (recall from register .1) or just press 'n'",
    "When solving for n, the result may include fractional periods (e.g., 48.7 payments)"
  ]
}
```

## 5. File Structure Template

### 5.1 Complete File Structure

```javascript
/**
 * HP-12C Key Metadata Database
 * 
 * Complete metadata for all 40 physical calculator keys, including:
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
    // FINANCIAL KEYS (5 keys)
    // ============================================
    
    "n": { /* ... */ },
    "i": { /* ... */ },
    "pv": { /* ... */ },
    "pmt": { /* ... */ },
    "fv": { /* ... */ },
    
    // ============================================
    // NUMERIC ENTRY KEYS (11 keys)
    // ============================================
    
    "digit-0": { /* ... */ },
    "digit-1": { /* ... */ },
    "digit-2": { /* ... */ },
    "digit-3": { /* ... */ },
    "digit-4": { /* ... */ },
    "digit-5": { /* ... */ },
    "digit-6": { /* ... */ },
    "digit-7": { /* ... */ },
    "digit-8": { /* ... */ },
    "digit-9": { /* ... */ },
    "decimal": { /* ... */ },
    
    // ============================================
    // ARITHMETIC KEYS (6 keys)
    // ============================================
    
    "op-add": { /* ... */ },
    "op-subtract": { /* ... */ },
    "op-multiply": { /* ... */ },
    "op-divide": { /* ... */ },
    "chs": { /* ... */ },
    "reciprocal": { /* ... */ },
    
    // ============================================
    // STACK OPERATION KEYS (4 keys)
    // ============================================
    
    "enter": { /* ... */ },
    "clx": { /* ... */ },
    "roll-down": { /* ... */ },
    "swap-xy": { /* ... */ },
    
    // ============================================
    // MEMORY KEYS (2 keys)
    // ============================================
    
    "sto": { /* ... */ },
    "rcl": { /* ... */ },
    
    // ============================================
    // PREFIX KEYS (2 keys)
    // ============================================
    
    "prefix-f": { /* ... */ },
    "prefix-g": { /* ... */ },
    
    // ============================================
    // CONTROL KEYS (2 keys)
    // ============================================
    
    "on": { /* ... */ },
    "rs": { /* ... */ },
    
    // ============================================
    // SCIENTIFIC/POWER KEYS (2 keys)
    // ============================================
    
    "power-yx": { /* ... */ },
    "eex": { /* ... */ },
    
    // ============================================
    // PERCENTAGE KEYS (3 keys)
    // ============================================
    
    "percent": { /* ... */ },
    "percent-total": { /* ... */ },
    "delta-percent": { /* ... */ },
    
    // ============================================
    // PROGRAMMING KEYS (1 key)
    // ============================================
    
    "sst": { /* ... */ },
    
    // ============================================
    // STATISTICS KEYS (1 key)
    // ============================================
    
    "sigma-plus": { /* ... */ }
  };
  
  // Validate metadata on load
  const keyCount = Object.keys(window.HP12C_KEY_METADATA).length;
  console.log(`HP-12C Key Metadata loaded: ${keyCount} keys`);
  
  if (keyCount !== 39) {  // 39 standard keys (ENTER spans multiple columns but is 1 key)
    console.warn(`Expected 39 keys, found ${keyCount}`);
  }
  
  // Export metadata access functions
  window.HP12C_KEY_METADATA_UTILS = {
    getKey: function(keyId) {
      return window.HP12C_KEY_METADATA[keyId] || null;
    },
    
    getAllKeys: function() {
      return Object.keys(window.HP12C_KEY_METADATA);
    },
    
    getKeysByCategory: function(category) {
      return Object.values(window.HP12C_KEY_METADATA)
        .filter(key => key.category === category);
    },
    
    getKeysByStatus: function(status) {
      return Object.values(window.HP12C_KEY_METADATA)
        .filter(key => key.implementation.status === status);
    }
  };
  
})();
```

## 6. Implementation Checklist

### 6.1 Metadata Completeness Requirements

For EACH of the 39 keys, ensure:

- [ ] `id` and `dataKey` match and use standardized naming
- [ ] `label` matches what's visible on the calculator
- [ ] `displayName` is clear and unambiguous
- [ ] `category` is one of the valid enum values
- [ ] `primaryFunction` has title, description, examples, keystrokes
- [ ] `shiftedFunctions.gold` array populated (or empty if none)
- [ ] `shiftedFunctions.blue` array populated (or empty if none)
- [ ] All shifted functions have `implementationStatus`
- [ ] `shortDescription` is concise (< 80 characters)
- [ ] `longDescription` is comprehensive
- [ ] `implementation.status` is accurate and honest
- [ ] `implementation.note` explains current state
- [ ] `originalHp12cBehavior` documents HP-12C behavior
- [ ] `simulatorBehavior` documents our current implementation
- [ ] `relatedTopics` array has 2-5 items
- [ ] `relatedKeys` array references real key IDs
- [ ] `commonMistakes` array has 2-4 items
- [ ] `expertTips` array has 2-4 items

### 6.2 Validation Tests

```javascript
// Run these tests after loading metadata
function validateMetadata() {
  const metadata = window.HP12C_KEY_METADATA;
  const requiredFields = ['id', 'dataKey', 'label', 'displayName', 'category', 
                          'primaryFunction', 'shiftedFunctions', 'shortDescription',
                          'longDescription', 'implementation', 'originalHp12cBehavior',
                          'simulatorBehavior', 'relatedTopics', 'relatedKeys',
                          'commonMistakes', 'expertTips'];
  
  let errors = [];
  
  for (const [keyId, keyData] of Object.entries(metadata)) {
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
    
    // Check valid category
    const validCategories = ['financial', 'arithmetic', 'percentage', 'stack', 
                            'memory', 'control', 'programming', 'statistics',
                            'numeric-entry', 'prefix', 'power-log', 'date', 
                            'bond', 'depreciation'];
    if (!validCategories.includes(keyData.category)) {
      errors.push(`${keyId}: Invalid category '${keyData.category}'`);
    }
    
    // Check valid implementation status
    const validStatuses = ['implemented', 'partially-implemented', 'planned',
                          'not-implemented', 'informational-only'];
    if (!validStatuses.includes(keyData.implementation.status)) {
      errors.push(`${keyId}: Invalid status '${keyData.implementation.status}'`);
    }
  }
  
  if (errors.length === 0) {
    console.log('✅ All metadata validation passed');
  } else {
    console.error('❌ Metadata validation errors:', errors);
  }
  
  return errors.length === 0;
}
```

## 7. Next Steps

### 7.1 Implementation Order

1. **Start with implemented keys** (17 keys) - These have working examples to reference
2. **Add partially-implemented keys** (3 keys) - Document current state honestly
3. **Complete planned keys** (19 keys) - Research HP-12C manual for accuracy
4. **Validate all entries** - Run validation script
5. **Add rich educational content** - Tips, mistakes, related topics
6. **Test loading** - Ensure file loads without errors
7. **Integration test** - Verify key-info.js can consume the data

### 7.2 Research Resources

For accurate HP-12C behavior documentation:
- HP-12C Owner's Manual (PDF available online)
- HP-12C Solutions Handbook
- HP Museum (hpmuseum.org)
- RPN Calculator community documentation

### 7.3 Quality Standards

Each metadata entry should be:
- **Accurate:** Matches real HP-12C behavior
- **Honest:** Clear about implementation status
- **Educational:** Helps users learn RPN and financial calculations
- **Complete:** No missing required fields
- **Consistent:** Follows naming conventions
- **Helpful:** Includes practical examples and tips

## 8. Estimated Effort

- **Implemented keys (17):** ~20 minutes each = 5-6 hours
- **Partially-implemented keys (3):** ~15 minutes each = 45 minutes  
- **Planned keys (19):** ~25 minutes each = 7-8 hours
- **Validation and testing:** 2 hours
- **Total estimated effort:** 14-16 hours of focused work

This can be broken into phases:
- Phase 1: Digits and arithmetic (3 hours)
- Phase 2: Stack and control (2 hours)
- Phase 3: Financial keys (4 hours)
- Phase 4: Scientific and remaining keys (4 hours)
- Phase 5: Validation and polish (2 hours)

---

**Status:** Architecture complete, ready for implementation  
**Dependencies:** None (this is Phase 2, foundational)  
**Blocks:** Phase 3 (Data-Key Standardization), Phase 4 (Learn Mode), Phase 5 (Tooltips)
