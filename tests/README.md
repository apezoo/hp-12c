# HP-12C Test Suite

Comprehensive automated tests for the HP-12C Financial Calculator implementation.

## Overview

The test suite has been converted from manual HTML tests to automated Jest tests, providing:

- **70+ automated test cases** covering all financial functions
- **Command-line execution** for easy integration into development workflow
- **Coverage reports** to ensure code quality
- **CI/CD ready** for continuous integration pipelines
- **Fast feedback** during development

## Test Structure

```
tests/
├── README.md                    # This file
├── test-helpers.js              # Common test utilities and custom matchers
├── financial-engine.test.js     # Core engine and state management tests
├── tvm.test.js                  # Time Value of Money calculations
├── percentage.test.js           # Percentage functions (%, Δ%, %T)
├── npv-irr.test.js             # NPV and IRR calculations
└── test-financial.html          # Legacy manual test runner (visual reference)
```

## Prerequisites

Install Node.js and npm if not already installed:

```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# macOS (using Homebrew)
brew install node

# Verify installation
node --version
npm --version
```

## Installation

Install test dependencies:

```bash
npm install
```

This will install Jest and all required testing dependencies.

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# TVM tests only
npm run test:tvm

# Percentage function tests only
npm run test:percentage

# Financial engine tests only
npm run test:financial
```

### Watch Mode (Auto-rerun on changes)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

This generates a detailed coverage report in the `coverage/` directory.

### Verbose Output

```bash
npm run test:verbose
```

## Test Categories

### 1. TVM Tests (`tvm.test.js`)

Tests Time Value of Money calculations:

- **Compound Interest**: Simple FV, multi-year compound interest
- **Annuities**: Loan payments, savings plans, retirement calculations
- **BEGIN Mode**: Payment timing differences
- **Edge Cases**: Zero interest, error handling
- **Real-World Examples**: Mortgages, investments, doubling time

**Example:**
```javascript
test('30-Year Mortgage: $300,000 loan at 6.5% APR', () => {
    const fin = setupTVM({ pv: 300000, i: 6.5 / 12, n: 360, fv: 0 });
    const result = fin.solvePMT();
    expect(result).toBeCloseTo(-1896.20, 10);
});
```

### 2. Percentage Tests (`percentage.test.js`)

Tests percentage calculation functions:

- **Basic %**: Calculate percentage of a value
- **Δ% (Delta)**: Calculate percentage change
- **%T (Percent Total)**: Calculate value as percentage of total
- **Real-World Examples**: Sales tax, tips, discounts

**Example:**
```javascript
test('Sales Tax: 8.5% of $1,234.56', () => {
    const fin = createFinancialEngine();
    const result = fin.calculatePercent(1234.56, 8.5);
    expect(result).toBeCloseTo(104.94, 0.01);
});
```

### 3. NPV/IRR Tests (`npv-irr.test.js`)

Tests investment analysis functions:

- **NPV**: Net Present Value calculations
- **IRR**: Internal Rate of Return solver
- **Cash Flow Management**: Adding and clearing cash flows
- **Business Cases**: Startup investments, equipment purchases

**Example:**
```javascript
test('IRR - Simple Investment: CF0=-1000, CF1=1100', () => {
    const fin = setupCashFlows([-1000, 1100]);
    const result = fin.calculateIRR();
    expect(result).toBeCloseTo(10, 0.1); // 10% return
});
```

### 4. Financial Engine Tests (`financial-engine.test.js`)

Tests core engine functionality:

- **State Management**: Get/set state, persistence
- **BEGIN/END Mode**: Payment timing modes
- **Clear Operations**: Resetting registers
- **Variable Storage**: Store and recall TVM variables

## Custom Matchers

The test suite includes custom Jest matchers for financial calculations:

### `toBeCloseTo(expected, tolerance)`

Asserts that a value is within a tolerance of the expected value.

```javascript
expect(result).toBeCloseTo(1050, 0.01);
// Passes if result is between 1049.99 and 1050.01
```

### `toBeBetween(lower, upper)`

Asserts that a value falls within a range.

```javascript
expect(irr).toBeBetween(10, 15);
// Passes if irr is between 10 and 15
```

## Test Helpers

Common utilities in `test-helpers.js`:

### `createFinancialEngine()`

Creates a fresh FinancialEngine instance for testing.

```javascript
const fin = createFinancialEngine();
```

### `setupTVM(params)`

Creates and configures a FinancialEngine with TVM parameters.

```javascript
const fin = setupTVM({ 
    pv: -1000, 
    i: 5, 
    n: 12, 
    pmt: 0,
    beginMode: false 
});
```

### `setupCashFlows(cashFlows)`

Creates a FinancialEngine with pre-loaded cash flows.

```javascript
const fin = setupCashFlows([-1000, 500, 600]);
```

## Writing New Tests

### Test Structure

```javascript
describe('Feature Category', () => {
    test('Specific test case description', () => {
        // Arrange: Set up test data
        const fin = setupTVM({ pv: 1000, i: 5, n: 10 });
        
        // Act: Execute the function
        const result = fin.solveFV();
        
        // Assert: Verify the result
        expect(result).toBeCloseTo(1628.89, 0.5);
    });
});
```

### Best Practices

1. **Descriptive Names**: Use clear, descriptive test names
2. **Single Assertion**: Focus each test on one specific behavior
3. **Tolerance Values**: Use appropriate tolerances for financial calculations
4. **Real-World Examples**: Include practical test cases
5. **Edge Cases**: Test boundary conditions and error states

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v2
```

## Test Coverage Goals

Current test coverage targets:

- **TVM Functions**: 100% - Complete coverage of all TVM solvers
- **Percentage Functions**: 100% - All three percentage operations
- **NPV/IRR**: 95%+ - Core calculations and edge cases
- **Engine Core**: 90%+ - State management and utilities

Run `npm run test:coverage` to see detailed coverage reports.

## Troubleshooting

### Tests Fail with Module Errors

Ensure `financial.js` has the Node.js export:

```javascript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialEngine;
}
```

### Floating Point Precision Issues

Use appropriate tolerances with `toBeCloseTo()`:

```javascript
// For financial calculations
expect(result).toBeCloseTo(expected, 0.01); // ±$0.01

// For percentages
expect(result).toBeCloseTo(expected, 0.001); // ±0.001%
```

### npm not found

Install Node.js and npm following the prerequisites section above.

## Migration from Manual Tests

The original manual test suite (`test-financial.html`) has been preserved for reference but is no longer the primary testing method. The new Jest tests provide:

- **Faster execution**: Command-line vs browser-based
- **Better reporting**: Detailed failure messages
- **Automation**: Easily integrated into development workflow
- **Coverage tracking**: See exactly what code is tested

## Next Steps

1. **Run tests locally**: `npm test`
2. **Check coverage**: `npm run test:coverage`
3. **Add new tests**: Follow the patterns in existing test files
4. **Integrate CI/CD**: Add test commands to your pipeline
5. **Monitor coverage**: Aim for 95%+ coverage on financial logic

## Support

For questions or issues with the test suite:

1. Check test output for specific error messages
2. Review the test-helpers.js for available utilities
3. Examine existing tests for usage patterns
4. Ensure all dependencies are installed (`npm install`)
