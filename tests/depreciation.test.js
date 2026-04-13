/**
 * HP-12C Depreciation Functions Test Suite
 * Tests SL, DB, and SOYD depreciation methods
 */

const DepreciationEngine = require('../app/js/depreciation.js');

describe('Depreciation Functions', () => {
    let depreciation;

    beforeEach(() => {
        depreciation = new DepreciationEngine();
    });

    describe('Straight Line (SL) Depreciation', () => {
        test('should calculate basic SL depreciation', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const result = depreciation.straightLine(cost, salvage, life, 1);

            expect(result.depreciation).toBe(4500); // (50000-5000)/10
            expect(result.remainingValue).toBe(45500); // 50000 - 4500
        });

        test('should calculate same depreciation for all periods', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const year1 = depreciation.straightLine(cost, salvage, life, 1);
            const year5 = depreciation.straightLine(cost, salvage, life, 5);
            const year10 = depreciation.straightLine(cost, salvage, life, 10);

            expect(year1.depreciation).toBe(4500);
            expect(year5.depreciation).toBe(4500);
            expect(year10.depreciation).toBe(4500);
        });

        test('should calculate correct remaining value each year', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const year1 = depreciation.straightLine(cost, salvage, life, 1);
            const year5 = depreciation.straightLine(cost, salvage, life, 5);
            const year10 = depreciation.straightLine(cost, salvage, life, 10);

            expect(year1.remainingValue).toBeCloseTo(45500, 2);
            expect(year5.remainingValue).toBeCloseTo(27500, 2);
            expect(year10.remainingValue).toBeCloseTo(5000, 2); // Should equal salvage
        });

        test('should handle zero salvage value', () => {
            const cost = 100000;
            const salvage = 0;
            const life = 5;

            const result = depreciation.straightLine(cost, salvage, life, 1);

            expect(result.depreciation).toBe(20000); // 100000/5
            expect(result.remainingValue).toBe(80000);
        });

        test('should handle equipment example from HP-12C manual', () => {
            // Manual example: $10,000 equipment, $1,000 salvage, 5 years
            const result = depreciation.straightLine(10000, 1000, 5, 1);

            expect(result.depreciation).toBe(1800); // (10000-1000)/5
        });

        test('should throw error if life is zero or negative', () => {
            expect(() => {
                depreciation.straightLine(50000, 5000, 0, 1);
            }).toThrow();

            expect(() => {
                depreciation.straightLine(50000, 5000, -5, 1);
            }).toThrow();
        });

        test('should throw error if period out of range', () => {
            expect(() => {
                depreciation.straightLine(50000, 5000, 10, 0);
            }).toThrow();

            expect(() => {
                depreciation.straightLine(50000, 5000, 10, 11);
            }).toThrow();
        });

        test('should throw error if cost < salvage', () => {
            expect(() => {
                depreciation.straightLine(5000, 50000, 10, 1);
            }).toThrow();
        });

        test('should store state correctly', () => {
            depreciation.straightLine(50000, 5000, 10, 3);

            expect(depreciation.getLastDepreciation()).toBe(4500);
            expect(depreciation.method).toBe('SL');
        });
    });

    describe('Declining Balance (DB) Depreciation', () => {
        test('should calculate basic DB depreciation (200%)', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;
            const factor = 2.0; // 200% DB

            const result = depreciation.decliningBalance(cost, salvage, life, 1, factor);

            const rate = factor / life; // 0.2
            expect(result.depreciation).toBeCloseTo(10000, 2); // 50000 * 0.2
            expect(result.bookValue).toBeCloseTo(40000, 2);
        });

        test('should calculate declining amounts each year', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;
            const factor = 2.0;

            const year1 = depreciation.decliningBalance(cost, salvage, life, 1, factor);
            const year2 = depreciation.decliningBalance(cost, salvage, life, 2, factor);
            const year3 = depreciation.decliningBalance(cost, salvage, life, 3, factor);

            // Each year should have less depreciation
            expect(year1.depreciation).toBeGreaterThan(year2.depreciation);
            expect(year2.depreciation).toBeGreaterThan(year3.depreciation);
        });

        test('should not depreciate below salvage value', () => {
            const cost = 10000;
            const salvage = 5000;
            const life = 5;
            const factor = 2.0;

            const year5 = depreciation.decliningBalance(cost, salvage, life, 5, factor);

            expect(year5.bookValue).toBeGreaterThanOrEqual(salvage);
        });

        test('should calculate 200% DB correctly', () => {
            // Double declining balance
            const cost = 100000;
            const salvage = 10000;
            const life = 5;
            const factor = 2.0;

            const year1 = depreciation.decliningBalance(cost, salvage, life, 1, factor);
            
            expect(year1.depreciation).toBeCloseTo(40000, 2); // 100000 * (2/5)
            expect(year1.bookValue).toBeCloseTo(60000, 2);

            const year2 = depreciation.decliningBalance(cost, salvage, life, 2, factor);
            expect(year2.depreciation).toBeCloseTo(24000, 2); // 60000 * 0.4
            expect(year2.bookValue).toBeCloseTo(36000, 2);
        });

        test('should calculate 150% DB correctly', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;
            const factor = 1.5;

            const year1 = depreciation.decliningBalance(cost, salvage, life, 1, factor);

            expect(year1.depreciation).toBeCloseTo(7500, 2); // 50000 * (1.5/10)
            expect(year1.bookValue).toBeCloseTo(42500, 2);
        });

        test('should handle manual example', () => {
            // $10,000 equipment, $1,000 salvage, 5 years, 200% DB
            const year1 = depreciation.decliningBalance(10000, 1000, 5, 1, 2.0);

            expect(year1.depreciation).toBeCloseTo(4000, 2); // 10000 * 0.4
            expect(year1.bookValue).toBeCloseTo(6000, 2);
        });

        test('should protect salvage value in late periods', () => {
            const cost = 10000;
            const salvage = 1000;
            const life = 3;
            const factor = 2.0;

            let bookValue = cost;
            for (let year = 1; year <= life; year++) {
                const result = depreciation.decliningBalance(cost, salvage, life, year, factor);
                bookValue = result.bookValue;
            }

            // Final book value should not be below salvage
            expect(bookValue).toBeGreaterThanOrEqual(salvage);
        });

        test('should throw error for invalid inputs', () => {
            expect(() => {
                depreciation.decliningBalance(50000, 5000, 0, 1, 2.0);
            }).toThrow();

            expect(() => {
                depreciation.decliningBalance(50000, 5000, 10, 0, 2.0);
            }).toThrow();

            expect(() => {
                depreciation.decliningBalance(5000, 50000, 10, 1, 2.0);
            }).toThrow();

            expect(() => {
                depreciation.decliningBalance(50000, 5000, 10, 1, 0);
            }).toThrow();
        });

        test('should store state correctly', () => {
            depreciation.decliningBalance(50000, 5000, 10, 2, 2.0);

            expect(depreciation.getLastDepreciation()).toBeGreaterThan(0);
            expect(depreciation.method).toBe('DB');
        });
    });

    describe('Sum of Years\' Digits (SOYD) Depreciation', () => {
        test('should calculate basic SOYD depreciation', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            // SYD = 10 * 11 / 2 = 55
            // Year 1: (50000-5000) * (10/55) = 45000 * 0.1818 = 8181.82

            const result = depreciation.sumOfYearsDigits(cost, salvage, life, 1);

            expect(result.depreciation).toBeCloseTo(8181.82, 2);
            expect(result.remainingValue).toBeCloseTo(41818.18, 2);
        });

        test('should calculate declining depreciation each year', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const year1 = depreciation.sumOfYearsDigits(cost, salvage, life, 1);
            const year2 = depreciation.sumOfYearsDigits(cost, salvage, life, 2);
            const year5 = depreciation.sumOfYearsDigits(cost, salvage, life, 5);

            // Depreciation should decrease each year
            expect(year1.depreciation).toBeGreaterThan(year2.depreciation);
            expect(year2.depreciation).toBeGreaterThan(year5.depreciation);
        });

        test('should sum to total depreciable amount', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 5;

            let totalDepreciation = 0;
            for (let year = 1; year <= life; year++) {
                const result = depreciation.sumOfYearsDigits(cost, salvage, life, year);
                totalDepreciation += result.depreciation;
            }

            expect(totalDepreciation).toBeCloseTo(cost - salvage, 1);
        });

        test('should calculate correct SYD formula', () => {
            const cost = 100000;
            const salvage = 10000;
            const life = 5;

            // SYD = 5 * 6 / 2 = 15
            // Year 1: 90000 * (5/15) = 30000
            // Year 2: 90000 * (4/15) = 24000
            // Year 3: 90000 * (3/15) = 18000

            const year1 = depreciation.sumOfYearsDigits(cost, salvage, life, 1);
            const year2 = depreciation.sumOfYearsDigits(cost, salvage, life, 2);
            const year3 = depreciation.sumOfYearsDigits(cost, salvage, life, 3);

            expect(year1.depreciation).toBeCloseTo(30000, 2);
            expect(year2.depreciation).toBeCloseTo(24000, 2);
            expect(year3.depreciation).toBeCloseTo(18000, 2);
        });

        test('should handle manual example', () => {
            // $10,000 equipment, $1,000 salvage, 5 years
            // SYD = 15
            // Year 1: 9000 * (5/15) = 3000

            const result = depreciation.sumOfYearsDigits(10000, 1000, 5, 1);

            expect(result.depreciation).toBeCloseTo(3000, 2);
        });

        test('should reach salvage value at end of life', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const finalYear = depreciation.sumOfYearsDigits(cost, salvage, life, life);

            expect(finalYear.remainingValue).toBeCloseTo(salvage, 1);
        });

        test('should handle zero salvage value', () => {
            const cost = 100000;
            const salvage = 0;
            const life = 5;

            const year1 = depreciation.sumOfYearsDigits(cost, salvage, life, 1);

            // SYD = 15, Year 1 = 100000 * (5/15) = 33333.33
            expect(year1.depreciation).toBeCloseTo(33333.33, 2);
        });

        test('should throw error for invalid inputs', () => {
            expect(() => {
                depreciation.sumOfYearsDigits(50000, 5000, 0, 1);
            }).toThrow();

            expect(() => {
                depreciation.sumOfYearsDigits(50000, 5000, 10, 0);
            }).toThrow();

            expect(() => {
                depreciation.sumOfYearsDigits(5000, 50000, 10, 1);
            }).toThrow();
        });

        test('should store state correctly', () => {
            depreciation.sumOfYearsDigits(50000, 5000, 10, 3);

            expect(depreciation.getLastDepreciation()).toBeGreaterThan(0);
            expect(depreciation.method).toBe('SOYD');
        });
    });

    describe('Method Comparisons', () => {
        test('SL vs DB - DB should depreciate faster initially', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const sl = depreciation.straightLine(cost, salvage, life, 1);
            const db = depreciation.decliningBalance(cost, salvage, life, 1, 2.0);

            // DB should have higher first-year depreciation
            expect(db.depreciation).toBeGreaterThan(sl.depreciation);
        });

        test('SL vs SOYD - SOYD should depreciate faster initially', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 10;

            const sl = depreciation.straightLine(cost, salvage, life, 1);
            const soyd = depreciation.sumOfYearsDigits(cost, salvage, life, 1);

            // SOYD should have higher first-year depreciation
            expect(soyd.depreciation).toBeGreaterThan(sl.depreciation);
        });

        test('all three methods should fully depreciate asset', () => {
            const cost = 50000;
            const salvage = 5000;
            const life = 5;

            // SL
            let slTotal = 0;
            for (let y = 1; y <= life; y++) {
                const result = depreciation.straightLine(cost, salvage, life, y);
                slTotal += result.depreciation;
            }

            // SOYD
            let soydTotal = 0;
            for (let y = 1; y <= life; y++) {
                const result = depreciation.sumOfYearsDigits(cost, salvage, life, y);
                soydTotal += result.depreciation;
            }

            const depreciableAmount = cost - salvage;
            expect(slTotal).toBeCloseTo(depreciableAmount, 1);
            expect(soydTotal).toBeCloseTo(depreciableAmount, 1);
        });
    });

    describe('Real-World Examples', () => {
        test('office equipment depreciation comparison', () => {
            const cost = 25000;
            const salvage = 2000;
            const life = 7;

            const sl = depreciation.straightLine(cost, salvage, life, 1);
            const db = depreciation.decliningBalance(cost, salvage, life, 1, 2.0);
            const soyd = depreciation.sumOfYearsDigits(cost, salvage, life, 1);

            // SL: (25000-2000)/7 = 3285.71
            expect(sl.depreciation).toBeCloseTo(3285.71, 2);

            // DB: 25000 * (2/7) = 7142.86
            expect(db.depreciation).toBeCloseTo(7142.86, 2);

            // SOYD: SYD=28, 23000 * (7/28) = 5750
            expect(soyd.depreciation).toBeCloseTo(5750, 2);
        });

        test('vehicle depreciation over 5 years', () => {
            const cost = 35000;
            const salvage = 5000;
            const life = 5;

            // Compare all three methods for each year
            for (let year = 1; year <= life; year++) {
                const sl = depreciation.straightLine(cost, salvage, life, year);
                const db = depreciation.decliningBalance(cost, salvage, life, year, 2.0);
                const soyd = depreciation.sumOfYearsDigits(cost, salvage, life, year);

                // All should be positive depreciation (or zero if at salvage)
                expect(sl.depreciation).toBeGreaterThanOrEqual(0);
                expect(db.depreciation).toBeGreaterThanOrEqual(0);
                expect(soyd.depreciation).toBeGreaterThanOrEqual(0);

                // All should preserve salvage value
                expect(sl.remainingValue).toBeGreaterThanOrEqual(salvage - 1);
                expect(db.bookValue).toBeGreaterThanOrEqual(salvage - 1);
                expect(soyd.remainingValue).toBeGreaterThanOrEqual(salvage - 1);
            }
        });

        test('manufacturing equipment with high salvage', () => {
            const cost = 500000;
            const salvage = 100000; // 20% salvage
            const life = 15;

            const sl = depreciation.straightLine(cost, salvage, life, 1);
            const soyd = depreciation.sumOfYearsDigits(cost, salvage, life, 1);

            // SL: 400000 / 15 = 26666.67
            expect(sl.depreciation).toBeCloseTo(26666.67, 2);

            // SOYD: SYD=120, 400000 * (15/120) = 50000
            expect(soyd.depreciation).toBeCloseTo(50000, 2);
        });
    });

    describe('State Management', () => {
        test('should clear depreciation state', () => {
            depreciation.straightLine(50000, 5000, 10, 1);
            expect(depreciation.getLastDepreciation()).not.toBe(0);

            depreciation.clear();
            expect(depreciation.getLastDepreciation()).toBe(0);
            expect(depreciation.getLastRemainingValue()).toBe(0);
            expect(depreciation.method).toBeNull();
        });

        test('should maintain state between calculations', () => {
            depreciation.straightLine(50000, 5000, 10, 1);
            const state1 = depreciation.getState();

            depreciation.decliningBalance(50000, 5000, 10, 1, 2.0);
            const state2 = depreciation.getState();

            expect(state1.method).toBe('SL');
            expect(state2.method).toBe('DB');
            expect(state2.lastDepreciation).not.toBe(state1.lastDepreciation);
        });
    });
});
