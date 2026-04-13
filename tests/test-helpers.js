/**
 * Test Helpers and Utilities
 * Common functions used across multiple test suites
 */

/**
 * Assert that two numbers are close within a tolerance
 * @param {number} actual - Actual value
 * @param {number} expected - Expected value
 * @param {number} tolerance - Acceptable difference (default: 0.01)
 * @returns {object} Assertion result
 */
function assertClose(actual, expected, tolerance = 0.01) {
    const diff = Math.abs(actual - expected);
    const pass = diff <= tolerance;
    return {
        pass,
        actual,
        expected,
        difference: diff,
        tolerance,
        message: () => pass 
            ? `Expected ${actual} to be close to ${expected} (within ${tolerance})`
            : `Expected ${actual} to be close to ${expected} (within ${tolerance}), but difference was ${diff.toFixed(6)}`
    };
}

/**
 * Custom Jest matcher for financial calculations
 */
expect.extend({
    toBeCloseTo(received, expected, tolerance = 0.01) {
        const result = assertClose(received, expected, tolerance);
        return {
            pass: result.pass,
            message: result.message
        };
    },
    
    toBeBetween(received, lower, upper) {
        const pass = received >= lower && received <= upper;
        return {
            pass,
            message: () => pass
                ? `Expected ${received} to be between ${lower} and ${upper}`
                : `Expected ${received} to be between ${lower} and ${upper}, but it was outside range`
        };
    }
});

/**
 * Create a fresh FinancialEngine instance for testing
 * @returns {FinancialEngine} New financial engine
 */
function createFinancialEngine() {
    const FinancialEngine = require('../app/js/financial.js');
    return new FinancialEngine();
}

/**
 * Set up TVM scenario
 * @param {object} params - TVM parameters {n, i, pv, pmt, fv, beginMode}
 * @returns {FinancialEngine} Configured financial engine
 */
function setupTVM(params) {
    const fin = createFinancialEngine();
    if (params.n !== undefined) fin.n = params.n;
    if (params.i !== undefined) fin.i = params.i;
    if (params.pv !== undefined) fin.pv = params.pv;
    if (params.pmt !== undefined) fin.pmt = params.pmt;
    if (params.fv !== undefined) fin.fv = params.fv;
    if (params.beginMode !== undefined) fin.setBeginMode(params.beginMode);
    return fin;
}

/**
 * Set up cash flows for NPV/IRR testing
 * @param {Array<number>} cashFlows - Array of cash flow values
 * @returns {FinancialEngine} Financial engine with cash flows loaded
 */
function setupCashFlows(cashFlows) {
    const fin = createFinancialEngine();
    cashFlows.forEach(cf => fin.addCashFlow(cf));
    return fin;
}

module.exports = {
    assertClose,
    createFinancialEngine,
    setupTVM,
    setupCashFlows
};
