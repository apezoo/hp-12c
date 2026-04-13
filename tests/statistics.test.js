/**
 * HP-12C Statistics Functions Test Suite
 * 
 * Tests for Phase 7 statistics functions:
 * - Σ+ (Sigma Plus - add data point)
 * - Σ- (Sigma Minus - remove data point)
 * - x̄ (Mean calculation)
 * - s (Standard Deviation)
 * - ŷ,r (Y-estimate and Correlation)
 * - x̂,r (X-estimate and Correlation)
 */

// Mock DOM before requiring Calculator
global.document = {
    getElementById: () => ({ style: {}, textContent: '' }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

const Calculator = require('../app/js/calculator.js');

describe('Statistics Functions', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
        // Clear statistics registers before each test
        calc.statistics.clear();
    });

    describe('Σ+ (Sigma Plus - Add Data Point)', () => {
        test('add single data point', () => {
            calc.stack.push(5);
            calc.sigmaPlus();
            
            expect(calc.stack.x).toBe(1); // Count = 1
            expect(calc.statistics.getCount()).toBe(1);
        });

        test('add multiple data points', () => {
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            calc.stack.push(30);
            calc.sigmaPlus();
            
            expect(calc.stack.x).toBe(3); // Count = 3
            expect(calc.statistics.getCount()).toBe(3);
        });

        test('add two-variable data (x,y pairs)', () => {
            // First point: x=1, y=2
            calc.stack.push(2);  // y
            calc.stack.push(1);  // x
            calc.sigmaPlus();
            
            expect(calc.stack.x).toBe(1); // Count = 1
            
            // Second point: x=3, y=4
            calc.stack.push(4);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            expect(calc.stack.x).toBe(2); // Count = 2
        });

        test('accumulate registers correctly', () => {
            calc.stack.push(5);
            calc.sigmaPlus();
            
            // Check statistical registers
            expect(calc.memory.recall(1)).toBe(1);    // n = 1
            expect(calc.memory.recall(2)).toBe(5);    // Σx = 5
            expect(calc.memory.recall(3)).toBe(25);   // Σx² = 25
        });

        test('negative and decimal values', () => {
            calc.stack.push(-5.5);
            calc.sigmaPlus();
            calc.stack.push(10.3);
            calc.sigmaPlus();
            
            expect(calc.stack.x).toBe(2);
            expect(calc.statistics.getCount()).toBe(2);
        });
    });

    describe('Σ- (Sigma Minus - Remove Data Point)', () => {
        test('remove single data point', () => {
            // Add then remove
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(10);
            calc.sigmaMinus();
            
            expect(calc.stack.x).toBe(0); // Count = 0
            expect(calc.statistics.getCount()).toBe(0);
        });

        test('remove from multiple data points', () => {
            // Add three points
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            calc.stack.push(30);
            calc.sigmaPlus();
            
            expect(calc.statistics.getCount()).toBe(3);
            
            // Remove one point
            calc.stack.push(20);
            calc.sigmaMinus();
            
            expect(calc.stack.x).toBe(2); // Count = 2
        });

        test('correct data entry error scenario', () => {
            // HP-12C common use case: correct a mistake
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            calc.stack.push(15);  // Oops, meant 25
            calc.sigmaPlus();
            
            // Remove incorrect value
            calc.stack.push(15);
            calc.sigmaMinus();
            
            // Add correct value
            calc.stack.push(25);
            calc.sigmaPlus();
            
            expect(calc.statistics.getCount()).toBe(3);
        });

        test('error when removing from empty data set', () => {
            // Mock display.showError to capture error
            const showErrorSpy = jest.spyOn(calc.display, 'showError');
            
            calc.stack.push(5);
            calc.sigmaMinus();
            
            // Should show error
            expect(showErrorSpy).toHaveBeenCalled();
            
            showErrorSpy.mockRestore();
        });

        test('remove two-variable data', () => {
            calc.stack.push(4);  // y
            calc.stack.push(3);  // x
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(3);
            calc.sigmaMinus();
            
            expect(calc.statistics.getCount()).toBe(0);
        });
    });

    describe('x̄ (Mean Calculation)', () => {
        test('mean of single value', () => {
            calc.stack.push(42);
            calc.sigmaPlus();
            
            calc.meanX();
            
            expect(calc.stack.x).toBeCloseTo(42, 10);
        });

        test('mean of multiple values', () => {
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            calc.stack.push(30);
            calc.sigmaPlus();
            
            calc.meanX();
            
            expect(calc.stack.x).toBeCloseTo(20, 10); // (10+20+30)/3 = 20
        });

        test('mean of two-variable data', () => {
            // x,y pairs: (1,2), (3,4), (5,6)
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            calc.stack.push(6);
            calc.stack.push(5);
            calc.sigmaPlus();
            
            calc.meanX();
            
            expect(calc.stack.x).toBeCloseTo(3, 10); // x̄ = (1+3+5)/3 = 3
            expect(calc.stack.y).toBeCloseTo(4, 10); // ȳ = (2+4+6)/3 = 4
        });

        test('mean with negative values', () => {
            calc.stack.push(-10);
            calc.sigmaPlus();
            calc.stack.push(0);
            calc.sigmaPlus();
            calc.stack.push(10);
            calc.sigmaPlus();
            
            calc.meanX();
            
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('mean with decimal values', () => {
            calc.stack.push(2.5);
            calc.sigmaPlus();
            calc.stack.push(3.5);
            calc.sigmaPlus();
            calc.stack.push(4.0);
            calc.sigmaPlus();
            
            calc.meanX();
            
            expect(calc.stack.x).toBeCloseTo(3.333333, 5);
        });

        test('error with no data', () => {
            // Mock display.showError to capture error
            const showErrorSpy = jest.spyOn(calc.display, 'showError');
            
            calc.meanX();
            
            expect(showErrorSpy).toHaveBeenCalled();
            
            showErrorSpy.mockRestore();
        });
    });

    describe('s (Standard Deviation)', () => {
        test('standard deviation requires at least 2 points', () => {
            // Mock display.showError to capture error
            const showErrorSpy = jest.spyOn(calc.display, 'showError');
            
            calc.stack.push(10);
            calc.sigmaPlus();
            
            calc.standardDeviationX();
            
            expect(showErrorSpy).toHaveBeenCalled();
            
            showErrorSpy.mockRestore();
        });

        test('standard deviation of identical values is zero', () => {
            calc.stack.push(5);
            calc.sigmaPlus();
            calc.stack.push(5);
            calc.sigmaPlus();
            calc.stack.push(5);
            calc.sigmaPlus();
            
            calc.standardDeviationX();
            
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('standard deviation of simple data set', () => {
            // Data: 2, 4, 4, 4, 5, 5, 7, 9
            const data = [2, 4, 4, 4, 5, 5, 7, 9];
            data.forEach(val => {
                calc.stack.push(val);
                calc.sigmaPlus();
            });
            
            calc.standardDeviationX();
            
            // Expected sample standard deviation ≈ 2.138
            expect(calc.stack.x).toBeCloseTo(2.138, 2);
        });

        test('standard deviation of two values', () => {
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            
            calc.standardDeviationX();
            
            // s = sqrt(((10-15)² + (20-15)²) / 1) = sqrt(50) ≈ 7.071
            expect(calc.stack.x).toBeCloseTo(7.071, 2);
        });

        test('standard deviation with negative values', () => {
            calc.stack.push(-5);
            calc.sigmaPlus();
            calc.stack.push(0);
            calc.sigmaPlus();
            calc.stack.push(5);
            calc.sigmaPlus();
            
            calc.standardDeviationX();
            
            expect(calc.stack.x).toBeCloseTo(5, 10);
        });

        test('standard deviation for x and y', () => {
            // Two-variable data
            calc.stack.push(10);  // y
            calc.stack.push(1);   // x
            calc.sigmaPlus();
            
            calc.stack.push(20);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(30);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            calc.standardDeviationX();
            
            expect(calc.stack.x).toBeCloseTo(1, 10);    // sx = 1
            expect(calc.stack.y).toBeCloseTo(10, 10);   // sy = 10
        });
    });

    describe('ŷ,r (Y-estimate and Correlation)', () => {
        test('perfect positive correlation', () => {
            // Perfect line: y = 2x
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(6);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            // Estimate y for x=4
            calc.stack.push(4);
            calc.estimateY();
            
            expect(calc.stack.x).toBeCloseTo(8, 10);  // ŷ = 8
            expect(calc.stack.y).toBeCloseTo(1, 10);  // r = 1 (perfect correlation)
        });

        test('perfect negative correlation', () => {
            // Perfect line: y = -2x + 10
            calc.stack.push(8);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(6);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            // Estimate y for x=4
            calc.stack.push(4);
            calc.estimateY();
            
            expect(calc.stack.x).toBeCloseTo(2, 10);   // ŷ = 2
            expect(calc.stack.y).toBeCloseTo(-1, 10);  // r = -1 (perfect negative)
        });

        test('moderate correlation', () => {
            // Somewhat linear data with scatter
            calc.stack.push(2.3);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(3.8);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(6.2);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            calc.stack.push(7.5);
            calc.stack.push(4);
            calc.sigmaPlus();
            
            // Estimate y for x=2.5
            calc.stack.push(2.5);
            calc.estimateY();
            
            // r should be between 0 and 1
            expect(calc.stack.y).toBeGreaterThan(0.9);
            expect(calc.stack.y).toBeLessThanOrEqual(1);
        });

        test('requires at least 2 data points', () => {
            // Mock display.showError to capture error
            const showErrorSpy = jest.spyOn(calc.display, 'showError');
            
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(1.5);
            calc.estimateY();
            
            expect(showErrorSpy).toHaveBeenCalled();
            
            showErrorSpy.mockRestore();
        });

        test('classic example: advertising vs sales', () => {
            // Advertising spend (x) vs Sales (y)
            // Data: (1,2), (2,3), (3,4), (4,5)
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(3);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            calc.stack.push(5);
            calc.stack.push(4);
            calc.sigmaPlus();
            
            // Estimate sales for advertising spend of 5
            calc.stack.push(5);
            calc.estimateY();
            
            expect(calc.stack.x).toBeCloseTo(6, 10);
            expect(calc.stack.y).toBeCloseTo(1, 10);  // r = 1
        });
    });

    describe('x̂,r (X-estimate and Correlation)', () => {
        test('estimate x from y - simple linear', () => {
            // Line: y = 2x, so x = y/2
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(4);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(6);
            calc.stack.push(3);
            calc.sigmaPlus();
            
            // Estimate x for y=10
            calc.stack.push(10);
            calc.estimateX();
            
            expect(calc.stack.x).toBeCloseTo(5, 10);  // x̂ = 5
            expect(calc.stack.y).toBeCloseTo(1, 10);  // r = 1
        });

        test('estimate x with inverse relationship', () => {
            // When x increases, y increases
            calc.stack.push(100);
            calc.stack.push(10);
            calc.sigmaPlus();
            
            calc.stack.push(200);
            calc.stack.push(20);
            calc.sigmaPlus();
            
            calc.stack.push(300);
            calc.stack.push(30);
            calc.sigmaPlus();
            
            // Estimate x for y=250
            calc.stack.push(250);
            calc.estimateX();
            
            expect(calc.stack.x).toBeCloseTo(25, 10);
            expect(calc.stack.y).toBeCloseTo(1, 10);
        });

        test('x-estimate matches y-estimate inverse', () => {
            // Add data points
            calc.stack.push(5);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(10);
            calc.stack.push(4);
            calc.sigmaPlus();
            
            calc.stack.push(15);
            calc.stack.push(6);
            calc.sigmaPlus();
            
            // Estimate y for x=5
            calc.stack.push(5);
            calc.estimateY();
            const estimatedY = calc.stack.x;
            const r1 = calc.stack.y;
            
            // Now estimate x for that y
            calc.stack.push(estimatedY);
            calc.estimateX();
            const estimatedX = calc.stack.x;
            const r2 = calc.stack.y;
            
            expect(estimatedX).toBeCloseTo(5, 1);  // Should be close to original x
            expect(r1).toBeCloseTo(r2, 10);        // Correlation should be same
        });

        test('requires at least 2 data points', () => {
            // Mock display.showError to capture error
            const showErrorSpy = jest.spyOn(calc.display, 'showError');
            
            calc.stack.push(2);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(3);
            calc.estimateX();
            
            expect(showErrorSpy).toHaveBeenCalled();
            
            showErrorSpy.mockRestore();
        });
    });

    describe('Integration Tests', () => {
        test('complete workflow: enter data, calculate statistics', () => {
            // Enter test scores
            const scores = [85, 90, 78, 92, 88];
            scores.forEach(score => {
                calc.stack.push(score);
                calc.sigmaPlus();
            });
            
            // Calculate mean
            calc.meanX();
            const mean = calc.stack.x;
            expect(mean).toBeCloseTo(86.6, 1);
            
            // Calculate standard deviation
            calc.standardDeviationX();
            const stdDev = calc.stack.x;
            expect(stdDev).toBeGreaterThan(4);
            expect(stdDev).toBeLessThan(6);
        });

        test('two-variable regression analysis', () => {
            // Study hours (x) vs Test score (y)
            const data = [
                [2, 65],
                [3, 70],
                [4, 80],
                [5, 85],
                [6, 90]
            ];
            
            data.forEach(([x, y]) => {
                calc.stack.push(y);
                calc.stack.push(x);
                calc.sigmaPlus();
            });
            
            // Calculate means
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(4, 10);   // x̄ = 4
            expect(calc.stack.y).toBeCloseTo(78, 10);  // ȳ = 78
            
            // Predict score for 7 hours of study
            calc.stack.push(7);
            calc.estimateY();
            expect(calc.stack.x).toBeGreaterThan(90);  // Should be > 90
            expect(calc.stack.y).toBeGreaterThan(0.9); // Strong correlation
        });

        test('correct data entry with Σ-', () => {
            // Add initial data
            [10, 20, 30].forEach(val => {
                calc.stack.push(val);
                calc.sigmaPlus();
            });
            
            // Calculate mean
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(20, 10);
            
            // Realize 30 was wrong, should be 40
            calc.stack.push(30);
            calc.sigmaMinus();
            calc.stack.push(40);
            calc.sigmaPlus();
            
            // Recalculate mean
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(23.333, 2);
        });

        test('statistical registers cleared properly', () => {
            // Add data
            calc.stack.push(10);
            calc.sigmaPlus();
            calc.stack.push(20);
            calc.sigmaPlus();
            
            expect(calc.statistics.getCount()).toBe(2);
            
            // Clear statistics
            calc.statistics.clear();
            
            expect(calc.statistics.getCount()).toBe(0);
            expect(calc.memory.recall(1)).toBe(0);  // n
            expect(calc.memory.recall(2)).toBe(0);  // Σx
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('very large numbers', () => {
            calc.stack.push(1e10);
            calc.sigmaPlus();
            calc.stack.push(2e10);
            calc.sigmaPlus();
            
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(1.5e10, -8);
        });

        test('very small numbers', () => {
            calc.stack.push(0.0001);
            calc.sigmaPlus();
            calc.stack.push(0.0002);
            calc.sigmaPlus();
            
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(0.00015, 8);
        });

        test('mixed positive and negative values', () => {
            calc.stack.push(-100);
            calc.sigmaPlus();
            calc.stack.push(-50);
            calc.sigmaPlus();
            calc.stack.push(50);
            calc.sigmaPlus();
            calc.stack.push(100);
            calc.sigmaPlus();
            
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('zero values in data set', () => {
            calc.stack.push(0);
            calc.sigmaPlus();
            calc.stack.push(5);
            calc.sigmaPlus();
            calc.stack.push(10);
            calc.sigmaPlus();
            
            calc.meanX();
            expect(calc.stack.x).toBeCloseTo(5, 10);
        });

        test('correlation clamped to [-1, 1]', () => {
            // Even with numerical errors, r should be in valid range
            calc.stack.push(1);
            calc.stack.push(1);
            calc.sigmaPlus();
            
            calc.stack.push(2);
            calc.stack.push(2);
            calc.sigmaPlus();
            
            calc.stack.push(1.5);
            calc.estimateY();
            
            expect(calc.stack.y).toBeGreaterThanOrEqual(-1);
            expect(calc.stack.y).toBeLessThanOrEqual(1);
        });
    });
});
