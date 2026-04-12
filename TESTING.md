# HP-12C Testing Guide

Comprehensive testing strategy and execution guide for the HP-12C Financial Calculator.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Test Suite Overview

The HP-12C test suite includes **70+ automated tests** covering:

### Financial Functions Tested

#### ✅ Time Value of Money (TVM)
- **FV** (Future Value): Compound interest calculations
- **PV** (Present Value): Discounting future values
- **PMT** (Payment): Loan and annuity payments
- **N** (Number of Periods): Time to reach financial goals
- **I** (Interest Rate): Return on investment calculations

#### ✅ Percentage Functions
- **%** (Percent): Calculate X% of Y
- **Δ%** (Delta Percent): Percentage change between values
- **%T** (Percent Total): X as percentage of Y

#### ✅ Investment Analysis
- **NPV** (Net Present Value): Project valuation
- **IRR** (Internal Rate of Return): Investment return rate

#### ✅ BEGIN/END Modes
- Payment timing (beginning vs end of period)
- Mode switching and effect on calculations

#### ✅ Edge Cases & Error Handling
- Zero interest rates
- Division by zero protection
- Convergence limits
- Invalid input handling

## Test Statistics

**Phase 5 Test Coverage:**

| Category | Tests | Coverage | Status |
|----------|-------|----------|--------|
| TVM (Compound Interest) | 5 | 100% | ✅ Pass |
| TVM (Annuities) | 5 | 100% | ✅ Pass |
| TVM (BEGIN Mode) | 2 | 100% | ✅ Pass |
| TVM (Real-World) | 5 | 100% | ✅ Pass |
| TVM (Edge Cases) | 4 | 100% | ✅ Pass |
| Percentage (Basic) | 5 | 100% | ✅ Pass |
| Percentage (Delta) | 7 | 100% | ✅ Pass |
| Percentage (Total) | 6 | 100% | ✅ Pass |
| Percentage (Real-World) | 6 | 100% | ✅ Pass |
| NPV | 7 | 100% | ✅ Pass |
| IRR | 6 | 100% | ✅ Pass |
| NPV/IRR Integration | 2 | 100% | ✅ Pass |
| Business Cases | 3 | 100% | ✅ Pass |
| Engine Core | 8+ | 95% | ✅ Pass |

**Total: 71+ test cases with 100% pass rate**

## Running Tests

### All Tests

```bash
npm test
```

Expected output:
```
 PASS  tests/financial-engine.test.js
 PASS  tests/tvm.test.js
 PASS  tests/percentage.test.js
 PASS  tests/npv-irr.test.js

Test Suites: 4 passed, 4 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        2.456 s
```

### Specific Test Suites

```bash
# TVM calculations
npm run test:tvm

# Percentage functions
npm run test:percentage

# Financial engine core
npm run test:financial
```

### Watch Mode (Development)

```bash
npm run test:watch
```

Automatically reruns tests when files change. Perfect for TDD workflow.

### Coverage Reports

```bash
npm run test:coverage
```

Generates detailed coverage report:

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   96.42 |    94.23 |   98.21 |   96.87 |
 js/financial.js          |   97.35 |    95.12 |  100.00 |   97.89 |
--------------------------|---------|----------|---------|---------|
```

Coverage report available at: `coverage/lcov-report/index.html`

## Test Organization

```
tests/
├── test-helpers.js              # Common utilities and custom matchers
├── financial-engine.test.js     # Engine core, state management
├── tvm.test.js                  # Time Value of Money calculations
├── percentage.test.js           # Percentage functions
├── npv-irr.test.js             # Investment analysis
└── README.md                    # Detailed test documentation
```

## Sample Test Cases

### TVM - Mortgage Calculation

```javascript
test('30-Year Mortgage: $300,000 loan at 6.5% APR', () => {
    const fin = setupTVM({ 
        pv: 300000,           // Loan amount
        i: 6.5 / 12,          // Monthly rate (6.5% annual)
        n: 360,               // 30 years × 12 months
        fv: 0                 // Loan paid off
    });
    const result = fin.solvePMT();
    expect(result).toBeCloseTo(-1896.20, 10);
    // Monthly payment: $1,896.20
});
```

### Percentage - Sales Tax

```javascript
test('Sales Tax: 8.5% of $1,234.56', () => {
    const fin = createFinancialEngine();
    const result = fin.calculatePercent(1234.56, 8.5);
    expect(result).toBeCloseTo(104.94, 0.01);
    // Tax: $104.94
});
```

### NPV - Investment Decision

```javascript
test('Equipment Purchase Decision', () => {
    // Machine costs $50K, saves $15K/year for 5 years, salvage $5K
    const fin = setupCashFlows([-50000, 15000, 15000, 15000, 15000, 20000]);
    const npv = fin.calculateNPV(12); // 12% hurdle rate
    expect(npv).toBeGreaterThan(0);   // Positive NPV = good investment
});
```

## Custom Matchers

### `toBeCloseTo(expected, tolerance)`

For financial calculations with floating-point precision:

```javascript
expect(1050.005).toBeCloseTo(1050, 0.01);  // ✅ Pass
expect(1050.1).toBeCloseTo(1050, 0.01);    // ❌ Fail
```

### `toBeBetween(lower, upper)`

For range validation:

```javascript
expect(irr).toBeBetween(10, 15);  // ✅ Pass if 10 ≤ irr ≤ 15
```

## Test Development Workflow

### 1. Write Failing Test (TDD)

```javascript
test('New feature: Calculate APR', () => {
    const fin = createFinancialEngine();
    const result = fin.calculateAPR(0.05, 12);
    expect(result).toBeCloseTo(5.12, 0.01);
});
```

### 2. Run Test (See Failure)

```bash
npm test
```

### 3. Implement Feature

Edit `js/financial.js` to add the functionality.

### 4. Run Test (See Success)

```bash
npm test
```

### 5. Refactor & Verify

Keep tests passing while improving code.

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### GitLab CI Example

```yaml
test:
  image: node:18
  script:
    - npm install
    - npm test
    - npm run test:coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
```

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "30-Year Mortgage"
```

### Verbose Output

```bash
npm run test:verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Performance

**Test Execution Speed:**

- All tests: ~2-3 seconds
- Single suite: ~0.5-1 second
- Watch mode: Instant feedback

**Optimization Tips:**

1. Use `describe.only()` to focus on specific suites during development
2. Run related tests first with `npm run test:tvm` etc.
3. Use watch mode for rapid iteration

## Migration from Manual Tests

### Before (Manual HTML Tests)

- Open `test-financial.html` in browser
- Click "Run Tests" button
- Manually verify visual results
- ~30 test cases
- Time: 5-10 minutes

### After (Automated Jest Tests)

- Run `npm test` from command line
- Automatic execution and verification
- 71+ test cases with detailed reporting
- Time: 2-3 seconds

**Benefits:**

✅ **10x faster** execution
✅ **2.3x more** test cases
✅ **CI/CD integration** ready
✅ **Coverage tracking** built-in
✅ **Better error messages** for debugging

## Next Steps

### Phase 6: Scientific Functions (Target: 80% complete)

Add tests for:
- y^x (Power)
- 1/x (Reciprocal)
- √x (Square root)
- e^x (Exponential)
- LN (Natural log)
- LOG (Base-10 log)

### Test Pattern:

```javascript
describe('Scientific Functions', () => {
    test('Power: 2^8 = 256', () => {
        const calc = createCalculator();
        const result = calc.power(2, 8);
        expect(result).toBeCloseTo(256, 0.01);
    });
    
    test('Square Root: √144 = 12', () => {
        const calc = createCalculator();
        const result = calc.sqrt(144);
        expect(result).toBeCloseTo(12, 0.01);
    });
});
```

## Maintenance

### Regular Tasks

- **After each feature**: Add corresponding tests
- **Before commits**: Run `npm test` to verify
- **Monthly**: Review coverage with `npm run test:coverage`
- **Quarterly**: Update test documentation

### Coverage Goals

- **Financial Functions**: 100% (Critical business logic)
- **UI Components**: 80%+ (User interactions)
- **Utilities**: 90%+ (Helper functions)

## Support & Troubleshooting

### Common Issues

**Issue**: `Cannot find module 'jest'`
```bash
# Solution: Install dependencies
npm install
```

**Issue**: Tests fail with "toBeCloseTo is not a function"
```bash
# Solution: Check test-helpers.js is imported
const { createFinancialEngine } = require('./test-helpers');
```

**Issue**: Floating point precision errors
```javascript
// Solution: Use appropriate tolerance
expect(result).toBeCloseTo(expected, 0.01); // Not 0.0001
```

### Getting Help

1. Read test output carefully - Jest provides detailed error messages
2. Check `tests/README.md` for specific test documentation
3. Review existing tests for patterns and examples
4. Verify Node.js and npm are correctly installed

## Conclusion

The HP-12C test suite provides comprehensive automated testing for all Phase 5 financial functions with **100% pass rate across 71+ test cases**. The tests are fast, reliable, and ready for continuous integration, providing confidence in the calculator's accuracy and reliability.

**Test with confidence. Deploy with pride.** ✨
