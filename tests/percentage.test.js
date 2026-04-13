/**
 * Percentage Function Tests
 * Tests for %, Δ%, and %T functions
 */

const { createFinancialEngine } = require('./test-helpers');

describe('Percentage Functions - Basic %', () => {
    test('Simple Percentage: 15% of 200', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(200, 15);
        expect(result).toBeCloseTo(30, 0.01);
    });

    test('Percentage with Decimal: 7.5% of 1000', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(1000, 7.5);
        expect(result).toBeCloseTo(75, 0.01);
    });

    test('Large Percentage: 125% of 500', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(500, 125);
        expect(result).toBeCloseTo(625, 0.01);
    });

    test('Small Percentage: 0.5% of 10000', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(10000, 0.5);
        expect(result).toBeCloseTo(50, 0.01);
    });

    test('Zero Percentage: 0% of 100', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(100, 0);
        expect(result).toBeCloseTo(0, 0.01);
    });
});

describe('Percentage Functions - Delta % (Δ%)', () => {
    test('Delta Percent - Increase: 100 → 150', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(100, 150);
        expect(result).toBeCloseTo(50, 0.01);
    });

    test('Delta Percent - Decrease: 200 → 150', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(200, 150);
        expect(result).toBeCloseTo(-25, 0.01);
    });

    test('Delta Percent - Double: 50 → 100', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(50, 100);
        expect(result).toBeCloseTo(100, 0.01);
    });

    test('Delta Percent - Half: 100 → 50', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(100, 50);
        expect(result).toBeCloseTo(-50, 0.01);
    });

    test('Delta Percent - No Change: 100 → 100', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(100, 100);
        expect(result).toBeCloseTo(0, 0.01);
    });

    test('Delta Percent - Division by Zero Protection', () => {
        const fin = createFinancialEngine();
        expect(() => fin.calculateDeltaPercent(0, 100)).toThrow('Error 0');
    });

    test('Delta Percent - Large Change: 10 → 1000', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(10, 1000);
        expect(result).toBeCloseTo(9900, 0.01);
    });
});

describe('Percentage Functions - Percent of Total (%T)', () => {
    test('Percent of Total: 75 as % of 300', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(300, 75);
        expect(result).toBeCloseTo(25, 0.01);
    });

    test('Percent of Total - Large Numbers: 12500 as % of 50000', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(50000, 12500);
        expect(result).toBeCloseTo(25, 0.01);
    });

    test('Percent of Total - 100%: 200 as % of 200', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(200, 200);
        expect(result).toBeCloseTo(100, 0.01);
    });

    test('Percent of Total - Over 100%: 500 as % of 200', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(200, 500);
        expect(result).toBeCloseTo(250, 0.01);
    });

    test('Percent of Total - Small Fraction: 1 as % of 1000', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(1000, 1);
        expect(result).toBeCloseTo(0.1, 0.01);
    });

    test('Percent of Total - Division by Zero Protection', () => {
        const fin = createFinancialEngine();
        expect(() => fin.calculatePercentTotal(0, 50)).toThrow('Error 0');
    });
});

describe('Percentage Functions - Real-World Examples', () => {
    test('Sales Tax: 8.5% of $1,234.56', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(1234.56, 8.5);
        expect(result).toBeCloseTo(104.94, 0.01);
    });

    test('Tip Calculation: 18% of $87.50', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercent(87.50, 18);
        expect(result).toBeCloseTo(15.75, 0.01);
    });

    test('Stock Price Change: $45.20 → $52.80', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(45.20, 52.80);
        expect(result).toBeCloseTo(16.81, 0.01);
    });

    test('Discount: Original $150, Sale $120 (what % discount?)', () => {
        const fin = createFinancialEngine();
        const result = fin.calculateDeltaPercent(150, 120);
        expect(result).toBeCloseTo(-20, 0.01);
    });

    test('Budget Allocation: $2,000 out of $8,000 budget', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(8000, 2000);
        expect(result).toBeCloseTo(25, 0.01);
    });

    test('Test Score: 47 correct out of 50 questions', () => {
        const fin = createFinancialEngine();
        const result = fin.calculatePercentTotal(50, 47);
        expect(result).toBeCloseTo(94, 0.01);
    });
});
