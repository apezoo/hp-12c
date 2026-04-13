/**
 * HP-12C Scientific Functions Test Suite
 * 
 * Tests for Phase 6 scientific/mathematical functions:
 * - y^x (Power)
 * - 1/x (Reciprocal)
 * - √x (Square Root)
 * - e^x (Natural Exponential)
 * - LN (Natural Logarithm)
 * - LOG (Common Logarithm, base 10)
 */

// Mock DOM before requiring Calculator
global.document = {
    getElementById: () => ({ style: {}, textContent: '' }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

const Calculator = require('../js/calculator.js');

describe('Scientific Functions', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    describe('Power (y^x)', () => {
        test('basic integer powers: 2^3 = 8', () => {
            calc.stack.push(2);
            calc.stack.push(3);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(8, 10);
        });

        test('5^2 = 25', () => {
            calc.stack.push(5);
            calc.stack.push(2);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(25, 10);
        });

        test('10^2 = 100', () => {
            calc.stack.push(10);
            calc.stack.push(2);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(100, 10);
        });

        test('fractional exponents: 4^0.5 = 2', () => {
            calc.stack.push(4);
            calc.stack.push(0.5);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(2, 10);
        });

        test('fractional exponents: 27^(1/3) ≈ 3', () => {
            calc.stack.push(27);
            calc.stack.push(1/3);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(3, 10);
        });

        test('negative exponents: 2^-2 = 0.25', () => {
            calc.stack.push(2);
            calc.stack.push(-2);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(0.25, 10);
        });

        test('negative exponents: 10^-3 = 0.001', () => {
            calc.stack.push(10);
            calc.stack.push(-3);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(0.001, 10);
        });

        test('zero exponent: 5^0 = 1', () => {
            calc.stack.push(5);
            calc.stack.push(0);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(1, 10);
        });

        test('one exponent: 7^1 = 7', () => {
            calc.stack.push(7);
            calc.stack.push(1);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(7, 10);
        });

        test('large result: 2^10 = 1024', () => {
            calc.stack.push(2);
            calc.stack.push(10);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(1024, 10);
        });

        test('decimal base: 1.5^2 = 2.25', () => {
            calc.stack.push(1.5);
            calc.stack.push(2);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(2.25, 10);
        });
    });

    describe('Reciprocal (1/x)', () => {
        test('basic reciprocals: 1/2 = 0.5', () => {
            calc.stack.x = 2;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(0.5, 10);
        });

        test('1/4 = 0.25', () => {
            calc.stack.x = 4;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(0.25, 10);
        });

        test('1/5 = 0.2', () => {
            calc.stack.x = 5;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(0.2, 10);
        });

        test('1/8 = 0.125', () => {
            calc.stack.x = 8;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(0.125, 10);
        });

        test('large number: 1/1000 = 0.001', () => {
            calc.stack.x = 1000;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(0.001, 10);
        });

        test('small number: 1/0.001 = 1000', () => {
            calc.stack.x = 0.001;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(1000, 10);
        });

        test('decimal: 1/0.5 = 2', () => {
            calc.stack.x = 0.5;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(2, 10);
        });

        test('double reciprocal returns original: 1/(1/7) = 7', () => {
            calc.stack.x = 7;
            calc.reciprocal();
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(7, 10);
        });

        test('negative number: 1/(-4) = -0.25', () => {
            calc.stack.x = -4;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(-0.25, 10);
        });

        test('very small number: 1/0.0001 = 10000', () => {
            calc.stack.x = 0.0001;
            calc.reciprocal();
            expect(calc.stack.x).toBeCloseTo(10000, 10);
        });
    });

    describe('Square Root (√x)', () => {
        test('perfect squares: √4 = 2', () => {
            calc.stack.x = 4;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(2, 10);
        });

        test('√9 = 3', () => {
            calc.stack.x = 9;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(3, 10);
        });

        test('√16 = 4', () => {
            calc.stack.x = 16;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(4, 10);
        });

        test('√25 = 5', () => {
            calc.stack.x = 25;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(5, 10);
        });

        test('√100 = 10', () => {
            calc.stack.x = 100;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(10, 10);
        });

        test('non-perfect square: √2 ≈ 1.414214', () => {
            calc.stack.x = 2;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(1.414214, 5);
        });

        test('√3 ≈ 1.732051', () => {
            calc.stack.x = 3;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(1.732051, 5);
        });

        test('√5 ≈ 2.236068', () => {
            calc.stack.x = 5;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(2.236068, 5);
        });

        test('large number: √10000 = 100', () => {
            calc.stack.x = 10000;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(100, 10);
        });

        test('small number: √0.0001 = 0.01', () => {
            calc.stack.x = 0.0001;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(0.01, 10);
        });

        test('√0 = 0', () => {
            calc.stack.x = 0;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('√1 = 1', () => {
            calc.stack.x = 1;
            calc.squareRoot();
            expect(calc.stack.x).toBeCloseTo(1, 10);
        });
    });

    describe('Natural Exponential (e^x)', () => {
        test('e^0 = 1', () => {
            calc.stack.x = 0;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(1, 10);
        });

        test('e^1 ≈ 2.718282', () => {
            calc.stack.x = 1;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(2.718282, 5);
        });

        test('e^2 ≈ 7.389056', () => {
            calc.stack.x = 2;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(7.389056, 5);
        });

        test('e^3 ≈ 20.085537', () => {
            calc.stack.x = 3;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(20.085537, 5);
        });

        test('negative: e^-1 ≈ 0.367879', () => {
            calc.stack.x = -1;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(0.367879, 5);
        });

        test('negative: e^-2 ≈ 0.135335', () => {
            calc.stack.x = -2;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(0.135335, 5);
        });

        test('large: e^10 ≈ 22026.466', () => {
            calc.stack.x = 10;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(22026.466, 3);
        });

        test('decimal: e^0.5 ≈ 1.648721', () => {
            calc.stack.x = 0.5;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(1.648721, 5);
        });

        test('small: e^0.1 ≈ 1.105171', () => {
            calc.stack.x = 0.1;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(1.105171, 5);
        });

        test('precision validation for e^1', () => {
            calc.stack.x = 1;
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(Math.E, 10);
        });
    });

    describe('Natural Logarithm (LN)', () => {
        test('ln(e) = 1', () => {
            calc.stack.x = Math.E;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(1, 10);
        });

        test('ln(1) = 0', () => {
            calc.stack.x = 1;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('ln(2) ≈ 0.693147', () => {
            calc.stack.x = 2;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(0.693147, 5);
        });

        test('ln(10) ≈ 2.302585', () => {
            calc.stack.x = 10;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(2.302585, 5);
        });

        test('ln(100) ≈ 4.605170', () => {
            calc.stack.x = 100;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(4.605170, 5);
        });

        test('ln(0.5) ≈ -0.693147', () => {
            calc.stack.x = 0.5;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(-0.693147, 5);
        });

        test('ln(0.1) ≈ -2.302585', () => {
            calc.stack.x = 0.1;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(-2.302585, 5);
        });

        test('ln(5) ≈ 1.609438', () => {
            calc.stack.x = 5;
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(1.609438, 5);
        });

        test('inverse: ln(e^x) = x for x=3', () => {
            calc.stack.x = 3;
            calc.exponential();
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(3, 9);
        });

        test('inverse: e^(ln(x)) = x for x=7', () => {
            calc.stack.x = 7;
            calc.naturalLog();
            calc.exponential();
            expect(calc.stack.x).toBeCloseTo(7, 9);
        });
    });

    describe('Common Logarithm (LOG)', () => {
        test('log(10) = 1', () => {
            calc.stack.x = 10;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(1, 10);
        });

        test('log(100) = 2', () => {
            calc.stack.x = 100;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(2, 10);
        });

        test('log(1000) = 3', () => {
            calc.stack.x = 1000;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(3, 10);
        });

        test('log(1) = 0', () => {
            calc.stack.x = 1;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(0, 10);
        });

        test('log(0.1) = -1', () => {
            calc.stack.x = 0.1;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(-1, 10);
        });

        test('log(0.01) = -2', () => {
            calc.stack.x = 0.01;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(-2, 10);
        });

        test('log(2) ≈ 0.301030', () => {
            calc.stack.x = 2;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(0.301030, 5);
        });

        test('log(5) ≈ 0.698970', () => {
            calc.stack.x = 5;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(0.698970, 5);
        });

        test('log(50) ≈ 1.698970', () => {
            calc.stack.x = 50;
            calc.commonLog();
            expect(calc.stack.x).toBeCloseTo(1.698970, 5);
        });
    });

    describe('Integration Tests', () => {
        test('compound calculation: ln(e^2) = 2', () => {
            calc.stack.x = 2;
            calc.exponential();
            calc.naturalLog();
            expect(calc.stack.x).toBeCloseTo(2, 9);
        });

        test('power and root: (√16)^2 = 16', () => {
            calc.stack.x = 16;
            calc.squareRoot(); // = 4
            calc.stack.push(calc.stack.x);
            calc.stack.push(2);
            calc.power(); // 4^2 = 16
            expect(calc.stack.x).toBeCloseTo(16, 10);
        });

        test('reciprocal chain: 1/(1/4) = 4 (double reciprocal)', () => {
            calc.stack.x = 4;
            calc.reciprocal(); // = 0.25
            calc.reciprocal(); // = 4
            expect(calc.stack.x).toBeCloseTo(4, 10);
        });

        test('exponential growth: 1.05^10 (compound interest)', () => {
            calc.stack.push(1.05);
            calc.stack.push(10);
            calc.power();
            expect(calc.stack.x).toBeCloseTo(1.62889, 5);
        });
    });

    describe('Error Handling', () => {
        test('1/0 shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.x = 0;
            calc.reciprocal();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });

        test('√(-1) shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.x = -1;
            calc.squareRoot();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });

        test('ln(0) shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.x = 0;
            calc.naturalLog();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });

        test('ln(-1) shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.x = -1;
            calc.naturalLog();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });

        test('log(0) shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.x = 0;
            calc.commonLog();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });

        test('(-2)^0.5 shows error', () => {
            calc.display.showError = jest.fn();
            calc.stack.push(-2);
            calc.stack.push(0.5);
            calc.power();
            expect(calc.display.showError).toHaveBeenCalledWith('Error 0');
        });
    });
});
