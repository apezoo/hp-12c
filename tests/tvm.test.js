/**
 * TVM (Time Value of Money) Tests
 * Tests for basic compound interest, annuities, and TVM solver
 */

const { setupTVM } = require('./test-helpers');

describe('TVM - Compound Interest (No Payments)', () => {
    test('Simple Future Value: PV=1000, i=5%, n=1', () => {
        const fin = setupTVM({ pv: -1000, i: 5, n: 1, pmt: 0 });
        const result = fin.solveFV();
        expect(result).toBeCloseTo(1050, 0.01);
    });

    test('10-Year Compound Interest: PV=1000, i=7%, n=10', () => {
        const fin = setupTVM({ pv: -1000, i: 7, n: 10, pmt: 0 });
        const result = fin.solveFV();
        // Expected: 1000 * (1.07)^10 = 1967.15
        expect(result).toBeCloseTo(1967.15, 0.5);
    });

    test('Solve for Present Value: FV=2000, i=6%, n=5', () => {
        const fin = setupTVM({ fv: 2000, i: 6, n: 5, pmt: 0 });
        const result = fin.solvePV();
        // Expected: 2000 / (1.06)^5 = -1494.52
        expect(result).toBeCloseTo(-1494.52, 0.5);
    });

    test('Solve for Interest Rate: PV=-1000, FV=1500, n=5', () => {
        const fin = setupTVM({ pv: -1000, fv: 1500, n: 5, pmt: 0 });
        const result = fin.solveI();
        // Expected: ((1500/1000)^(1/5) - 1) * 100 = 8.45%
        expect(result).toBeCloseTo(8.45, 0.1);
    });

    test('Solve for Number of Periods: PV=-1000, FV=2000, i=10%', () => {
        const fin = setupTVM({ pv: -1000, fv: 2000, i: 10, pmt: 0 });
        const result = fin.solveN();
        // Expected: log(2000/1000) / log(1.10) = 7.27 periods
        expect(result).toBeCloseTo(7.27, 0.1);
    });
});

describe('TVM - Annuities (With Payments)', () => {
    test('Monthly Payment on Loan: PV=200000, i=0.5%, n=360', () => {
        const fin = setupTVM({ pv: 200000, fv: 0, i: 0.5, n: 360 });
        const result = fin.solvePMT();
        // Expected: ~-1199.10 (payment is negative)
        expect(result).toBeCloseTo(-1199.10, 5);
    });

    test('Savings Plan Future Value: PMT=-100, i=0.5%, n=120', () => {
        const fin = setupTVM({ pv: 0, pmt: -100, i: 0.5, n: 120 });
        const result = fin.solveFV();
        // Expected: ~16387.93
        expect(result).toBeCloseTo(16387.93, 10);
    });

    test('Retirement Savings Present Value: PMT=-5000, i=8%, n=30', () => {
        const fin = setupTVM({ pmt: -5000, i: 8, n: 30, fv: 0 });
        const result = fin.solvePV();
        // Expected: ~56288.50
        expect(result).toBeCloseTo(56288.50, 50);
    });

    test('Years to Reach Savings Goal: PMT=-500, FV=100000, i=0.5%', () => {
        const fin = setupTVM({ pv: 0, pmt: -500, fv: 100000, i: 0.5 });
        const result = fin.solveN();
        // Expected: ~155 periods
        expect(result).toBeCloseTo(155, 2);
    });

    test('Interest Rate on Investment: PV=-50000, PMT=-500, FV=100000, n=60', () => {
        const fin = setupTVM({ pv: -50000, pmt: -500, fv: 100000, n: 60 });
        const result = fin.solveI();
        // Should converge to a positive interest rate
        expect(result).toBeBetween(0, 20);
    });
});

describe('TVM - BEGIN Mode', () => {
    test('BEGIN Mode - Payment at Start: PV=10000, i=1%, n=12', () => {
        const fin = setupTVM({ pv: 10000, i: 1, n: 12, fv: 0, beginMode: true });
        const result = fin.solvePMT();
        // BEGIN mode payment should be slightly less than END mode
        expect(result).toBeCloseTo(-879.83, 1);
    });

    test('BEGIN vs END Mode Comparison', () => {
        const finEnd = setupTVM({ pv: 10000, i: 1, n: 12, fv: 0, beginMode: false });
        const pmtEnd = finEnd.solvePMT();

        const finBegin = setupTVM({ pv: 10000, i: 1, n: 12, fv: 0, beginMode: true });
        const pmtBegin = finBegin.solvePMT();

        // BEGIN payment should be about 1% less than END payment
        expect(Math.abs(pmtEnd - pmtBegin)).toBeGreaterThan(5);
        expect(Math.abs(pmtBegin)).toBeLessThan(Math.abs(pmtEnd));
    });
});

describe('TVM - Edge Cases', () => {
    test('Zero Interest Rate: i=0, PV=-1000, n=5, PMT=-100', () => {
        const fin = setupTVM({ pv: -1000, i: 0, n: 5, pmt: -100 });
        const result = fin.solveFV();
        // Expected: 1000 + (100 * 5) = 1500
        expect(result).toBeCloseTo(1500, 0.01);
    });

    test('Zero Interest Rate with Payment: i=0, solving for PMT', () => {
        const fin = setupTVM({ pv: -10000, fv: 15000, i: 0, n: 10 });
        const result = fin.solvePMT();
        // Expected: -(10000 + 15000) / 10 = -2500
        expect(result).toBeCloseTo(-2500, 0.01);
    });

    test('Should throw error when n is zero', () => {
        const fin = setupTVM({ pv: 1000, i: 5, n: 0, pmt: 0 });
        expect(() => fin.solveFV()).toThrow('n must be non-zero');
    });

    test('Should throw error for invalid PV/FV relationship in solveN', () => {
        const fin = setupTVM({ pv: 1000, fv: 1500, i: 5, pmt: 0 });
        expect(() => fin.solveN()).toThrow();
    });
});

describe('TVM - Real-World Examples', () => {
    test('30-Year Mortgage: $300,000 loan at 6.5% APR', () => {
        const fin = setupTVM({ pv: 300000, i: 6.5 / 12, n: 360, fv: 0 });
        const result = fin.solvePMT();
        // Expected: ~-1896.20
        expect(result).toBeCloseTo(-1896.20, 10);
    });

    test('Retirement Savings: $50,000/year for 25 years at 7%', () => {
        const fin = setupTVM({ pmt: -50000, i: 7, n: 25, fv: 0 });
        const result = fin.solvePV();
        // Expected: ~582,430
        expect(result).toBeCloseTo(582430, 1000);
    });

    test('Investment Doubling Time: $10,000 at 9%', () => {
        const fin = setupTVM({ pv: -10000, fv: 20000, i: 9, pmt: 0 });
        const result = fin.solveN();
        // Expected: ~8.04 years (Rule of 72: 72/9 = 8)
        expect(result).toBeCloseTo(8.04, 0.1);
    });

    test('Car Loan: $25,000 at 4.5% for 5 years', () => {
        const fin = setupTVM({ pv: 25000, i: 4.5 / 12, n: 60, fv: 0 });
        const result = fin.solvePMT();
        // Monthly payment should be around -466
        expect(result).toBeCloseTo(-466, 5);
    });

    test('College Savings: Save for 18 years to reach $100,000 at 6%', () => {
        const fin = setupTVM({ pv: 0, fv: 100000, i: 6 / 12, n: 216 });
        const result = fin.solvePMT();
        // Should need monthly payments around -313
        expect(result).toBeCloseTo(-313, 10);
    });
});
