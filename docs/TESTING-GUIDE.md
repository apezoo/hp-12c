# HP-12C Testing Guide & Priorities
**Date:** April 14, 2026  
**Purpose:** Comprehensive testing checklist before adding new features  
**Priority:** ⚠️ HIGH - Complete before NPV/IRR or other complex features

---

## 🎯 Testing Philosophy

You've just completed **significant features**:
- 700+ lines of TVM engine code (Newton-Raphson solvers)
- 280+ lines of AMORT engine code
- Complex financial algorithms with precision requirements

**Before adding more complexity**, you must validate that:
- ✅ Algorithms are mathematically correct
- ✅ Results match physical HP-12C
- ✅ Edge cases are handled properly
- ✅ Integration works seamlessly
- ✅ User experience is intuitive

---

## 📋 Testing Checklist

### Phase 1: Automated Test Verification (30 minutes)

#### 1.1 Math Functions Test Suite
```bash
# Open in browser:
http://localhost:8080/tests/test-math-functions.html

# Expected: 50+ tests, 100% passing
✓ Reciprocal (1/x)
✓ Percentage (%, %T, Δ%)
✓ Power (yˣ), Square Root (√x)
✓ Logarithms (LN), Exponentials (eˣ)
✓ Integer/Fractional (INTG, FRAC)
✓ Factorial (n!), Helpers (12×, 12÷)
```

**Action items:**
- [ ] Open test suite in browser
- [ ] Click "Run All Tests"
- [ ] Verify 100% pass rate
- [ ] Check console for any warnings
- [ ] Document any failed tests

#### 1.2 TVM Test Suite
```bash
# Open in browser:
http://localhost:8080/tests/test-financial-tvm.html

# Expected: 20+ tests, 100% passing
✓ Solve for PV (3 tests)
✓ Solve for PMT (3 tests)
✓ Solve for FV (3 tests)
✓ Solve for n (2 tests)
✓ Solve for i (2 tests)
✓ BEGIN/END mode (2 tests)
✓ Structure tests (3 tests)
```

**Action items:**
- [ ] Open test suite in browser
- [ ] Click "Run All Tests"
- [ ] Verify 100% pass rate
- [ ] Check performance times (should be <100ms)
- [ ] Document any failed tests

#### 1.3 AMORT Test Suite
```bash
# Open in browser:
http://localhost:8080/tests/test-financial-amort.html

# Expected: 16 tests, 100% passing
✓ 30-year mortgage amortization
✓ Car loan amortization
✓ Single period calculations
✓ Multi-period calculations
✓ BEGIN vs END mode
✓ Balance tracking
✓ Edge cases and validation
```

**Action items:**
- [ ] Open test suite in browser
- [ ] Click "Run All Tests"
- [ ] Verify 100% pass rate
- [ ] Check accuracy (tolerance within 0.50)
- [ ] Document any failed tests

#### 1.4 Integration Tests
```bash
# Open in browser:
http://localhost:8080/tests/test-integration.html

# Expected: Basic integration tests passing
```

**Action items:**
- [ ] Open test suite in browser
- [ ] Verify all module loading
- [ ] Check for console errors
- [ ] Document any issues

---

### Phase 2: Manual TVM Testing (1-2 hours)

#### 2.1 Basic TVM Workflow - Mortgage Calculation
```
Test: $200,000 mortgage at 6% APR for 30 years

Steps:
1. Clear calculator: [f] [CLx]
2. Enter periods: 360 [n]
3. Enter rate: 6 [g] [12÷] [i] (or 0.5 [i])
4. Enter loan amount: 200000 [PV]
5. Enter final value: 0 [FV]
6. Solve for payment: [PMT]

Expected: -1199.10 (approximately)
Actual: ___________

Status: [ ] PASS [ ] FAIL
Notes: ________________________________
```

#### 2.2 Solve for PV (Loan Amount)
```
Test: What loan amount for $1,500/month payment?

Steps:
1. Clear calculator: [f] [CLx]
2. 360 [n]
3. 0.5 [i]
4. 1500 [CHS] [PMT]
5. 0 [FV]
6. [PV]

Expected: 249,862.53 (approximately)
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 2.3 Solve for i (Interest Rate)
```
Test: What rate for $200k loan with $1,500/month payment?

Steps:
1. Clear calculator: [f] [CLx]
2. 360 [n]
3. 200000 [PV]
4. 1500 [CHS] [PMT]
5. 0 [FV]
6. [i]

Expected: ~0.716% per month (8.59% APR)
Actual: ___________

Performance: Should complete in <100ms
Actual time: ___________

Status: [ ] PASS [ ] FAIL
```

#### 2.4 Solve for n (Loan Term)
```
Test: How long to pay off $200k at 6% with $1,500/month?

Steps:
1. Clear calculator: [f] [CLx]
2. 0.5 [i]
3. 200000 [PV]
4. 1500 [CHS] [PMT]
5. 0 [FV]
6. [n]

Expected: ~296 months (about 24.7 years)
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 2.5 Solve for FV (Future Value)
```
Test: Retirement savings - $500/month for 30 years at 7% annual

Steps:
1. Clear calculator: [f] [CLx]
2. 360 [n]
3. 7 [g] [12÷] [i] (0.583%)
4. 0 [PV]
5. 500 [CHS] [PMT]
6. [FV]

Expected: ~611,729 (approximately)
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 2.6 BEGIN Mode Test
```
Test: Car lease with BEGIN mode (payment at start)

Steps:
1. [g] [7] (BEGIN mode - indicator lights up)
2. 25000 [PV]
3. 36 [n]
4. 4 [g] [12÷] [i]
5. 15000 [CHS] [FV]
6. [PMT]

Expected: ~-273 (BEGIN mode)
Actual: ___________

7. [g] [8] (END mode - indicator dims)
8. [PMT]

Expected: ~-274 (END mode, slightly higher)
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

---

### Phase 3: Manual AMORT Testing (1 hour)

#### 3.1 Basic Amortization
```
Test: First payment of $200k mortgage at 6%

Prerequisites:
- Set up TVM: 360 [n], 0.5 [i], 200000 [PV], 0 [FV]
- Calculate payment: [PMT] → -1199.10

Steps:
1. Enter period range: 1 [ENTER] 1
2. Press [f] [n] (AMORT)

Expected:
- Interest: -1000.00
- [x⇄y] Principal: -199.10
- [RCL] [PV] Balance: -199,800.90

Actual:
- Interest: ___________
- Principal: ___________
- Balance: ___________

Status: [ ] PASS [ ] FAIL
```

#### 3.2 First Year Amortization
```
Test: First year (12 payments)

Steps:
1. 1 [ENTER] 12 [f] [n] (AMORT)

Expected:
- Interest: ~-11,933.00
- [x⇄y] Principal: ~-2,456.00
- [RCL] [PV] Balance: ~-197,544.00

Actual:
- Interest: ___________
- Principal: ___________
- Balance: ___________

Status: [ ] PASS [ ] FAIL
```

#### 3.3 Mid-Loan Amortization
```
Test: Periods 7-12 (second half of first year)

Steps:
1. 7 [ENTER] 12 [f] [n] (AMORT)

Expected:
- Interest: ~-5,948.00
- [x⇄y] Principal: ~-1,246.00
- [RCL] [PV] Balance: ~-197,544.00

Actual:
- Interest: ___________
- Principal: ___________
- Balance: ___________

Status: [ ] PASS [ ] FAIL
```

#### 3.4 AMORT with BEGIN Mode
```
Test: BEGIN mode amortization

Prerequisites:
1. [g] [7] (BEGIN mode)
2. 10000 [CHS] [PV]
3. 12 [n]
4. 12 [i]
5. [PMT] → Calculate payment

Steps:
1. 1 [ENTER] 1 [f] [n] (AMORT)

Expected:
- Interest should be different from END mode
- Calculation should complete without error

Actual:
- Interest: ___________
- Principal: ___________

Status: [ ] PASS [ ] FAIL
```

---

### Phase 4: Edge Case Testing (1 hour)

#### 4.1 Zero Interest Rate
```
Test: TVM with i=0

Steps:
1. 360 [n]
2. 0 [i]
3. 200000 [PV]
4. 0 [FV]
5. [PMT]

Expected: -555.56 (200000 ÷ 360)
Actual: ___________

Status: [ ] PASS [ ] FAIL
Notes: Should not divide by zero
```

#### 4.2 Single Cash Flow (no payments)
```
Test: Investment doubling time

Steps:
1. 6 [i] (6% annual)
2. 1000 [CHS] [PV]
3. 0 [PMT]
4. 2000 [FV]
5. [n]

Expected: ~11.9 years
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 4.3 Very Large Values
```
Test: $10 million mortgage

Steps:
1. 360 [n]
2. 0.5 [i]
3. 10000000 [PV]
4. 0 [FV]
5. [PMT]

Expected: -59,955.03
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 4.4 Very Small Values
```
Test: $100 loan

Steps:
1. 12 [n]
2. 1 [i]
3. 100 [PV]
4. 0 [FV]
5. [PMT]

Expected: -8.88
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 4.5 Error Conditions
```
Test: Insufficient payment

Steps:
1. 360 [n]
2. 10 [i] (10% per period - absurdly high)
3. 100000 [PV]
4. 50 [CHS] [PMT] (payment less than interest)
5. 0 [FV]
6. Try AMORT: 1 [ENTER] 1 [f] [n]

Expected: Error message
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

---

### Phase 5: Integration Testing (1 hour)

#### 5.1 Complete Loan Analysis Workflow
```
Test: Full mortgage analysis

1. Calculate payment (TVM)
   360 [n], 0.5 [i], 200000 [PV], 0 [FV], [PMT]
   
2. Amortize first year (AMORT)
   1 [ENTER] 12 [f] [n]
   
3. Check remaining balance
   [RCL] [PV]
   
4. Calculate new payoff time with extra payments
   [RCL] [PV] [PV]
   1700 [CHS] [PMT] (extra $500/month)
   0 [FV]
   [n]

Expected: Everything flows smoothly
Status: [ ] PASS [ ] FAIL
Notes: ________________________________
```

#### 5.2 Memory Operations with TVM
```
Test: Store and recall TVM values

Steps:
1. Calculate mortgage: [PMT] → -1199.10
2. Store payment: [STO] 5
3. Clear: [CLx]
4. Recall: [RCL] 5

Expected: Display shows -1199.10
Actual: ___________

Status: [ ] PASS [ ] FAIL
```

#### 5.3 Stack Operations with Financial Results
```
Test: TVM results in stack

Steps:
1. Calculate payment: [PMT]
2. Press [ENTER] (enter into Y)
3. 12 [×] (annual payment)

Expected: Annual payment total
Status: [ ] PASS [ ] FAIL
```

---

### Phase 6: Cross-Browser Testing (1 hour)

#### 6.1 Browser Compatibility Matrix

| Browser | Version | TVM Tests | AMORT Tests | Math Tests | Issues |
|---------|---------|-----------|-------------|------------|--------|
| Chrome  | Latest  | [ ]       | [ ]         | [ ]        |        |
| Firefox | Latest  | [ ]       | [ ]         | [ ]        |        |
| Safari  | Latest  | [ ]       | [ ]         | [ ]        |        |
| Edge    | Latest  | [ ]       | [ ]         | [ ]        |        |

**Instructions:**
1. Open each browser
2. Navigate to: `http://localhost:8080/`
3. Run automated tests
4. Perform manual testing
5. Document any browser-specific issues

---

### Phase 7: Comparison with Physical HP-12C (2 hours)

If you have access to a physical HP-12C or online emulator:

#### 7.1 Side-by-Side Validation

**Resources:**
- Physical HP-12C calculator
- HP-12C online emulator: https://epxx.co/ctb/hp12c.html
- HP-12C Platinum emulator

**Test Cases to Validate:**
1. [ ] Basic mortgage calculation
2. [ ] Solving for i (interest rate)
3. [ ] Solving for n (periods)
4. [ ] BEGIN mode calculations
5. [ ] AMORT first payment
6. [ ] AMORT first year
7. [ ] Complex scenarios from HP-12C manual

**Comparison Template:**
```
Test: _______________________________
Physical HP-12C: _______
Your calculator: _______
Difference: _______
Acceptable? [ ] YES [ ] NO
```

---

## 📊 Testing Results Summary

### Automated Tests
- [ ] test-math-functions.html: ___/50+ passed
- [ ] test-financial-tvm.html: ___/20+ passed
- [ ] test-financial-amort.html: ___/16 passed
- [ ] test-integration.html: ___/___ passed

**Overall Pass Rate:** ____%

### Manual Tests
- [ ] TVM Workflow Tests: ___/6 passed
- [ ] AMORT Tests: ___/4 passed
- [ ] Edge Cases: ___/5 passed
- [ ] Integration: ___/3 passed

**Overall Pass Rate:** ____%

### Cross-Browser
- [ ] Chrome: PASS / FAIL
- [ ] Firefox: PASS / FAIL
- [ ] Safari: PASS / FAIL
- [ ] Edge: PASS / FAIL

### HP-12C Validation
- [ ] Results match physical calculator
- [ ] Differences documented and explained
- [ ] Acceptable accuracy achieved

---

## 🐛 Bug Tracking Template

Use this template to document any issues found:

### Bug Report #___
**Date:** _____________  
**Severity:** [ ] Critical [ ] High [ ] Medium [ ] Low  
**Component:** [ ] TVM [ ] AMORT [ ] Math [ ] UI [ ] Other

**Description:**
_________________________________

**Steps to Reproduce:**
1. _________________________________
2. _________________________________
3. _________________________________

**Expected Result:**
_________________________________

**Actual Result:**
_________________________________

**Browser/Environment:**
_________________________________

**Fix Priority:** [ ] Immediate [ ] Before next feature [ ] Nice to have

---

## ✅ Testing Sign-Off

### Criteria for Proceeding to Next Phase

Before implementing NPV/IRR or other complex features, confirm:

- [ ] **All automated tests passing** (100% or documented exceptions)
- [ ] **Manual TVM tests passing** (6/6 or documented exceptions)
- [ ] **Manual AMORT tests passing** (4/4 or documented exceptions)
- [ ] **Edge cases handled** (5/5 or documented limitations)
- [ ] **Cross-browser compatible** (all major browsers working)
- [ ] **HP-12C accurate** (results match within tolerance)
- [ ] **No critical bugs** (P1/P2 bugs fixed)
- [ ] **Documentation updated** (known issues documented)
- [ ] **User feedback collected** (if applicable)

### Sign-Off

**Tester:** _____________  
**Date:** _____________  
**Status:** [ ] APPROVED TO PROCEED [ ] NEEDS MORE TESTING

**Comments:**
_________________________________
_________________________________

---

## 📚 Resources

### Testing Tools
- **Browser DevTools:** Console for errors, Network for loading issues
- **Performance tab:** Profile calculation performance
- **Lighthouse:** Accessibility and performance audit

### Reference Materials
- HP-12C Owner's Handbook (PDF)
- HP-12C Solutions Handbook
- Financial mathematics formulas
- Online HP-12C emulators for comparison

### Known Issues to Test For
1. **Floating point precision:** JavaScript Number limitations
2. **Newton-Raphson convergence:** Edge cases where it doesn't converge
3. **BEGIN mode edge cases:** Different behavior from END mode
4. **Very large/small numbers:** Display formatting issues
5. **Error recovery:** Does calculator recover gracefully?

---

## 🎯 Next Steps After Testing

Once testing is complete and all critical issues resolved:

1. **Document findings** in [`docs/TESTING-RESULTS.md`](TESTING-RESULTS.md)
2. **Update NEXT-STEPS.md** with test results
3. **Choose next feature** based on:
   - Confidence in codebase
   - User feedback
   - Strategic priorities (see [`docs/STRATEGIC-ASSESSMENT.md`](STRATEGIC-ASSESSMENT.md))

**Recommended next features (in order):**
1. 📅 **Date Functions** (simple, high value)
2. 🎨 **UI/UX Enhancements** (usability improvements)
3. 📊 **Statistics** (moderate complexity)
4. ⚠️ **NPV/IRR** (complex, only after confidence established)

---

**Document Version:** 1.0  
**Last Updated:** April 14, 2026  
**Next Review:** After testing phase completion
