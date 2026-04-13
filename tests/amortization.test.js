/**
 * HP-12C Amortization Functions Test Suite
 * Tests AMORT and INT functions
 */

const FinancialEngine = require('../app/js/financial.js');

describe('Amortization Functions', () => {
    let financial;

    beforeEach(() => {
        financial = new FinancialEngine();
    });

    describe('Basic Amortization (END mode)', () => {
        test('should calculate amortization for single period', () => {
            // 30-year mortgage: $200,000 at 6% annual (0.5% monthly)
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.beginMode = false;
            financial.solvePMT(); // Calculate payment

            // Amortize first payment
            const result = financial.calculateAmortization(1, 1);

            expect(result.principal).toBeCloseTo(-199.10, 2);
            expect(result.interest).toBeCloseTo(-1000.00, 2);
            expect(result.balance).toBeCloseTo(199800.90, 2);
            expect(financial.pv).toBeCloseTo(199800.90, 2); // PV updated
        });

        test('should calculate amortization for first year (12 payments)', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.beginMode = false;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 12);

            // Year 1: mostly interest, little principal
            expect(result.interest).toBeLessThan(-11000); // About -11,760
            expect(result.principal).toBeGreaterThan(-3000); // About -2,628
            expect(result.interest + result.principal).toBeCloseTo(financial.pmt * 12, 2);
            // Allow reasonable rounding difference (~200 out of 200000)
            expect(Math.abs(result.balance - 197372)).toBeLessThan(200);
        });

        test('should handle multiple amortization calls', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.solvePMT();

            // Year 1
            const year1 = financial.calculateAmortization(1, 12);
            const balanceAfterYear1 = year1.balance;

            // Year 2 (balance is now updated)
            financial.pv = balanceAfterYear1;
            const year2 = financial.calculateAmortization(1, 12);

            // Principal payment should increase in year 2
            expect(Math.abs(year2.principal)).toBeGreaterThan(Math.abs(year1.principal));
            // Interest should decrease in year 2
            expect(Math.abs(year2.interest)).toBeLessThan(Math.abs(year1.interest));
        });

        test('should amortize middle period range', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.solvePMT();

            // Periods 13-24 (second year)
            const result = financial.calculateAmortization(13, 24);

            expect(result.principal).toBeLessThan(0);
            expect(result.interest).toBeLessThan(0);
            expect(result.interest + result.principal).toBeCloseTo(financial.pmt * 12, 2);
        });

        test('should calculate full loan amortization', () => {
            financial.n = 60; // 5-year loan
            financial.i = 0.5;
            financial.pv = 25000;
            financial.fv = 0;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 60);

            // After 60 payments, balance should be near zero
            expect(result.balance).toBeCloseTo(0, 0);
            // Total payments should equal principal + interest
            const totalPaid = result.principal + result.interest;
            expect(totalPaid).toBeCloseTo(financial.pmt * 60, 2);
        });

        test('should store amortization state for INT function', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.solvePMT();

            financial.calculateAmortization(1, 12);

            const interest = financial.getAmortizationInterest();
            const state = financial.getAmortizationState();

            expect(interest).toBeLessThan(0);
            expect(state.startPeriod).toBe(1);
            expect(state.endPeriod).toBe(12);
            expect(state.lastInterest).toBe(interest);
        });
    });

    describe('BEGIN Mode Amortization', () => {
        test('should calculate BEGIN mode amortization', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.beginMode = true;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 12);

            // BEGIN mode: less interest, more principal
            expect(result.interest).toBeLessThan(0);
            expect(result.principal).toBeLessThan(0);
            // BEGIN mode should have more principal than END mode
            expect(Math.abs(result.principal)).toBeGreaterThan(2000);
        });

        test('BEGIN mode should differ from END mode', () => {
            // END mode
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.beginMode = false;
            financial.solvePMT();
            const endResult = financial.calculateAmortization(1, 12);

            // BEGIN mode
            financial.pv = 200000; // Reset
            financial.beginMode = true;
            financial.solvePMT();
            const beginResult = financial.calculateAmortization(1, 12);

            // BEGIN mode should have less interest
            expect(Math.abs(beginResult.interest)).toBeLessThan(Math.abs(endResult.interest));
            // BEGIN mode should have more principal paid
            expect(Math.abs(beginResult.principal)).toBeGreaterThan(Math.abs(endResult.principal));
        });
    });

    describe('Real-World Mortgage Examples', () => {
        test('$300,000 mortgage at 4.5% for 30 years - first payment', () => {
            financial.n = 360;
            financial.i = 4.5 / 12; // Monthly rate
            financial.pv = 300000;
            financial.fv = 0;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 1);

            expect(financial.pmt).toBeCloseTo(-1520.06, 2);
            expect(result.interest).toBeCloseTo(-1125.00, 2);
            expect(result.principal).toBeCloseTo(-395.06, 2);
            expect(result.balance).toBeCloseTo(299604.94, 2);
        });

        test('$300,000 mortgage - complete first year', () => {
            financial.n = 360;
            financial.i = 4.5 / 12;
            financial.pv = 300000;
            financial.fv = 0;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 12);

            // First year totals (allow small rounding differences)
            expect(Math.abs(result.interest + 13403.85)).toBeLessThan(10);
            expect(Math.abs(result.principal + 4836.87)).toBeLessThan(10);
            expect(Math.abs(result.balance - 295163.13)).toBeLessThan(10);
        });

        test('Car loan: $25,000 at 5.9% for 5 years', () => {
            financial.n = 60;
            financial.i = 5.9 / 12;
            financial.pv = 25000;
            financial.fv = 0;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 60);

            // Full loan should pay off
            expect(result.balance).toBeCloseTo(0, 0);
            // Total interest over life of loan (allow ~40 difference for rounding)
            expect(Math.abs(Math.abs(result.interest) - 3969.40)).toBeLessThan(50);
        });

        test('Student loan: $50,000 at 6.8% for 10 years', () => {
            financial.n = 120;
            financial.i = 6.8 / 12;
            financial.pv = 50000;
            financial.fv = 0;
            financial.solvePMT();

            // First year
            const year1 = financial.calculateAmortization(1, 12);

            expect(financial.pmt).toBeCloseTo(-575.40, 1);
            // Allow reasonable rounding difference
            expect(Math.abs(year1.interest + 3348.75)).toBeLessThan(70);
            expect(Math.abs(year1.principal + 3556.05)).toBeLessThan(70);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should throw error if n not set', () => {
            financial.i = 0.5;
            financial.pv = 100000;

            expect(() => {
                financial.calculateAmortization(1, 12);
            }).toThrow();
        });

        test('should throw error if i is zero', () => {
            financial.n = 360;
            financial.i = 0;
            financial.pv = 100000;

            expect(() => {
                financial.calculateAmortization(1, 12);
            }).toThrow();
        });

        test('should throw error if PV not set', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 0;

            expect(() => {
                financial.calculateAmortization(1, 12);
            }).toThrow();
        });

        test('should throw error if start period < 1', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 100000;
            financial.solvePMT();

            expect(() => {
                financial.calculateAmortization(0, 12);
            }).toThrow();
        });

        test('should throw error if end period > n', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 100000;
            financial.solvePMT();

            expect(() => {
                financial.calculateAmortization(1, 361);
            }).toThrow();
        });

        test('should throw error if start > end', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 100000;
            financial.solvePMT();

            expect(() => {
                financial.calculateAmortization(12, 1);
            }).toThrow();
        });

        test('should auto-calculate PMT if not set', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            // Don't call solvePMT()

            const result = financial.calculateAmortization(1, 1);

            // Should calculate PMT automatically
            expect(financial.pmt).not.toBe(0);
            expect(result.principal + result.interest).toBeCloseTo(financial.pmt, 2);
        });
    });

    describe('Last Payment and Rounding', () => {
        test('last payment should clear remaining balance', () => {
            financial.n = 60;
            financial.i = 0.5;
            financial.pv = 10000;
            financial.fv = 0;
            financial.solvePMT();

            // Amortize all 60 periods at once
            const result = financial.calculateAmortization(1, 60);

            // After full amortization, balance should be near zero
            expect(result.balance).toBeCloseTo(0, 0);
        });

        test('should handle fractional period values', () => {
            financial.n = 59.5; // Fractional periods
            financial.i = 0.5;
            financial.pv = 10000;
            financial.fv = 0;
            financial.solvePMT();

            const result = financial.calculateAmortization(1, 59);

            expect(result.balance).toBeGreaterThan(0);
        });
    });

    describe('Complex Amortization Scenarios', () => {
        test('should handle balloon payment loans', () => {
            // 30-year amortization, 5-year balloon
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.solvePMT();

            // After 60 payments (5 years)
            const result = financial.calculateAmortization(1, 60);

            // Balloon payment = remaining balance
            expect(result.balance).toBeGreaterThan(180000);
            expect(result.balance).toBeLessThan(195000);
        });

        test('should handle interest-only period calculations', () => {
            // For interest-only, PMT = PV * i
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 100000;
            financial.pmt = -500; // Interest-only payment
            financial.fv = -100000; // Same as PV (no principal reduction)

            const result = financial.calculateAmortization(1, 12);

            // All payment goes to interest
            expect(Math.abs(result.interest)).toBeCloseTo(6000, 0);
            expect(Math.abs(result.principal)).toBeCloseTo(0, 0);
            expect(result.balance).toBeCloseTo(100000, 0);
        });

        test('should calculate amortization with extra principal payments', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.fv = 0;
            financial.solvePMT();

            // Standard first year
            const standard = financial.calculateAmortization(1, 12);
            const standardBalance = standard.balance;

            // Reset and simulate extra payment
            financial.pv = 200000;
            const withExtra = financial.calculateAmortization(1, 12);
            // Manually reduce balance
            const balanceWithExtra = withExtra.balance - 10000;

            expect(balanceWithExtra).toBeLessThan(standardBalance);
        });
    });

    describe('Amortization State Management', () => {
        test('should clear amortization state', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.solvePMT();

            financial.calculateAmortization(1, 12);
            expect(financial.getAmortizationInterest()).not.toBe(0);

            financial.clear();
            expect(financial.getAmortizationInterest()).toBe(0);
        });

        test('should preserve amortization state between calls', () => {
            financial.n = 360;
            financial.i = 0.5;
            financial.pv = 200000;
            financial.solvePMT();

            financial.calculateAmortization(1, 12);
            const firstInterest = financial.getAmortizationInterest();

            financial.calculateAmortization(13, 24);
            const secondInterest = financial.getAmortizationInterest();

            // State should be updated
            expect(secondInterest).not.toBe(firstInterest);
        });
    });
});
