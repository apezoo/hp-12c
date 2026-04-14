# HP-12C Test Suite

This directory contains comprehensive test suites for the HP-12C calculator implementation.

## Test Files

### 1. test-math-functions.html
**Status:** ✅ Complete  
**Purpose:** Automated testing of all mathematical functions  
**Coverage:** 46+ test cases

**Functions Tested:**
- Reciprocal (1/x)
- Percentage (%, %T, Δ%)
- Power (yˣ) and Square Root (√x)
- Logarithms (LN) and Exponentials (eˣ)
- Integer/Fractional parts (INTG, FRAC)
- Helper functions (12×, 12÷)
- Factorial (n!)

**How to Run:**
1. Start web server: `python3 -m http.server 8080`
2. Open: http://localhost:8080/tests/test-math-functions.html
3. Click "Run All Tests"
4. Review results (should show all tests passing)

### 2. test-new-features.html
**Purpose:** Manual testing guide for newly implemented features
**Coverage:** CHS, STO, RCL functions

### 3. test-integration.html
**Purpose:** Integration testing for calculator components

### 4. test-metadata.html
**Purpose:** Validation of key metadata database

## Running Tests

### Quick Start
```bash
# From project root
python3 -m http.server 8080

# Open in browser
# Math tests: http://localhost:8080/tests/test-math-functions.html
# All tests: http://localhost:8080/tests/
```

### Expected Results
- **Math Functions:** All 46 tests should pass
- **Integration:** All components should load without errors
- **Metadata:** All 39 keys should have complete metadata

## Test Coverage Summary

### ✅ Fully Tested
- RPN Stack Operations
- Basic Arithmetic (+, −, ×, ÷)
- Mathematical Functions (13 functions)
- Memory Operations (STO/RCL)
- Sign Change (CHS)

### ⚠️ Partially Tested
- Financial Functions (TVM not yet implemented)
- Statistics (not yet implemented)
- Programming (not yet implemented)

### 📋 Testing Checklist

- [x] Core RPN stack
- [x] Arithmetic operations
- [x] Stack manipulation (ENTER, CLx, R↓, x↔y)
- [x] Mathematical functions (%, 1/x, √x, ln, eˣ, yˣ)
- [x] Memory operations
- [x] Error handling
- [ ] Financial functions (TVM)
- [ ] Statistics
- [ ] Programming features

## Writing New Tests

### Test Structure
```javascript
const tests = {
    functionName: [
        { 
            input: [value1, value2], 
            expected: result, 
            desc: "Description",
            tolerance: 0.001  // optional for floating point
        }
    ]
};
```

### Adding Test Cases
1. Open appropriate test file
2. Add test case to relevant section
3. Run tests to verify
4. Document in this README

## Continuous Integration

Future work: Set up automated testing with:
- GitHub Actions
- Jest/Mocha for unit tests
- Playwright for E2E tests

## Bug Reporting

If tests fail:
1. Note which test(s) failed
2. Check browser console for errors
3. Verify all JS files loaded correctly
4. Report issue with:
   - Test name
   - Expected vs actual result
   - Browser/environment details

---

**Last Updated:** April 14, 2026  
**Test Suite Version:** 1.0  
**Coverage:** ~55% of planned features
