/**
 * Display Format Tests
 * Tests for FIX n and SCI n display modes
 */

const Calculator = require('../js/calculator.js');

describe('Display Format Modes', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    describe('FIX Mode (Fixed decimal places)', () => {
        test('FIX 0 - no decimal places', () => {
            calc.enterDigit('1');
            calc.enterDigit('2');
            calc.enterDigit('3');
            calc.enterDecimal();
            calc.enterDigit('4');
            calc.enterDigit('5');
            calc.enterDigit('6');
            calc.enter();
            
            // Set FIX 0
            calc.setFixMode(0);
            expect(calc.display.formatNumber(123.456)).toBe('123.');
        });

        test('FIX 2 - two decimal places (default)', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(123.456789)).toBe('123.46');
            expect(calc.display.formatNumber(99.995)).toBe('100.00');
        });

        test('FIX 4 - four decimal places', () => {
            calc.setFixMode(4);
            expect(calc.display.formatNumber(123.456789)).toBe('123.4568');
            expect(calc.display.formatNumber(0.123456)).toBe('0.1235');
        });

        test('FIX 9 - nine decimal places', () => {
            calc.setFixMode(9);
            expect(calc.display.formatNumber(1.123456789)).toBe('1.123456789');
            expect(calc.display.formatNumber(0.000000001)).toBe('0.000000001');
        });

        test('FIX mode with negative numbers', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(-123.456)).toBe('-123.46');
            expect(calc.display.formatNumber(-0.006)).toBe('-0.01');
        });

        test('FIX mode with zero', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(0)).toBe('0.00');
            calc.setFixMode(5);
            expect(calc.display.formatNumber(0)).toBe('0.00000');
        });

        test('FIX mode with very small numbers', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(0.001)).toBe('0.00');
            expect(calc.display.formatNumber(0.005)).toBe('0.01');
        });

        test('FIX mode preserves internal precision', () => {
            calc.setFixMode(2);
            calc.stack.x = 1.23456789;
            expect(calc.display.formatNumber(calc.stack.x)).toBe('1.23');
            // Internal value should still be full precision
            expect(calc.stack.x).toBe(1.23456789);
        });
    });

    describe('SCI Mode (Scientific notation)', () => {
        test('SCI 2 - two decimal places', () => {
            calc.setSciMode(2);
            expect(calc.display.formatNumber(123456)).toBe('1.23 5');
            expect(calc.display.formatNumber(0.000456)).toBe('4.56 -4');
        });

        test('SCI 4 - four decimal places', () => {
            calc.setSciMode(4);
            expect(calc.display.formatNumber(123456)).toBe('1.2346 5');
            expect(calc.display.formatNumber(0.000456789)).toBe('4.5679 -4');
        });

        test('SCI mode with negative numbers', () => {
            calc.setSciMode(2);
            expect(calc.display.formatNumber(-123456)).toBe('-1.23 5');
            expect(calc.display.formatNumber(-0.000456)).toBe('-4.56 -4');
        });

        test('SCI mode with zero', () => {
            calc.setSciMode(2);
            expect(calc.display.formatNumber(0)).toBe('0.');
        });

        test('SCI mode with numbers close to 1', () => {
            calc.setSciMode(3);
            expect(calc.display.formatNumber(1.23456)).toBe('1.235 0');
            expect(calc.display.formatNumber(9.87654)).toBe('9.877 0');
        });

        test('SCI mode with very large numbers', () => {
            calc.setSciMode(2);
            expect(calc.display.formatNumber(1.23e50)).toBe('1.23 50');
            expect(calc.display.formatNumber(9.99e99)).toBe('9.99 99');
        });

        test('SCI mode with very small numbers', () => {
            calc.setSciMode(2);
            expect(calc.display.formatNumber(1.23e-50)).toBe('1.23 -50');
            expect(calc.display.formatNumber(4.56e-99)).toBe('4.56 -99');
        });

        test('SCI mode preserves internal precision', () => {
            calc.setSciMode(2);
            calc.stack.x = 123456.789;
            const formatted = calc.display.formatNumber(calc.stack.x);
            expect(formatted).toBe('1.23 5');
            // Internal value should still be full precision
            expect(calc.stack.x).toBe(123456.789);
        });
    });

    describe('Format Mode Switching', () => {
        test('Switch from FIX to SCI', () => {
            calc.stack.x = 123.456;
            
            calc.setFixMode(2);
            expect(calc.display.formatNumber(calc.stack.x)).toBe('123.46');
            
            calc.setSciMode(3);
            expect(calc.display.formatNumber(calc.stack.x)).toBe('1.235 2');
        });

        test('Switch from SCI to FIX', () => {
            calc.stack.x = 0.00012345;
            
            calc.setSciMode(2);
            expect(calc.display.formatNumber(calc.stack.x)).toBe('1.23 -4');
            
            calc.setFixMode(6);
            expect(calc.display.formatNumber(calc.stack.x)).toBe('0.000123');
        });

        test('Multiple format changes preserve value', () => {
            const originalValue = 987.654321;
            calc.stack.x = originalValue;
            
            calc.setFixMode(0);
            calc.display.formatNumber(calc.stack.x);
            
            calc.setSciMode(5);
            calc.display.formatNumber(calc.stack.x);
            
            calc.setFixMode(9);
            calc.display.formatNumber(calc.stack.x);
            
            // Value should still be exact
            expect(calc.stack.x).toBe(originalValue);
        });
    });

    describe('Format Integration with Operations', () => {
        test('FIX mode during calculations', () => {
            calc.setFixMode(2);
            
            // 1.23 + 4.56 = 5.79
            calc.stack.x = 1.23;
            calc.enter();
            calc.stack.x = 4.56;
            calc.add();
            
            expect(calc.display.formatNumber(calc.stack.x)).toBe('5.79');
        });

        test('SCI mode during calculations', () => {
            calc.setSciMode(2);
            
            // 1000 * 1000 = 1000000
            calc.stack.x = 1000;
            calc.enter();
            calc.stack.x = 1000;
            calc.multiply();
            
            expect(calc.display.formatNumber(calc.stack.x)).toBe('1.00 6');
        });

        test('Format change does not affect calculation', () => {
            calc.setFixMode(2);
            calc.stack.x = 1.111;
            calc.enter();
            calc.stack.x = 2.222;
            
            // Display shows rounded but calc uses full precision
            expect(calc.display.formatNumber(calc.stack.y)).toBe('1.11');
            expect(calc.display.formatNumber(calc.stack.x)).toBe('2.22');
            
            calc.add();
            // 1.111 + 2.222 = 3.333
            expect(Math.abs(calc.stack.x - 3.333) < 0.0001).toBe(true);
            expect(calc.display.formatNumber(calc.stack.x)).toBe('3.33');
        });
    });

    describe('Edge Cases', () => {
        test('Negative zero handling', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(-0)).toBe('0.00');
        });

        test('Infinity handling', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(Infinity)).toBe('Error 0');
            expect(calc.display.formatNumber(-Infinity)).toBe('Error 0');
        });

        test('NaN handling', () => {
            calc.setFixMode(2);
            expect(calc.display.formatNumber(NaN)).toBe('Error 0');
        });

        test('Very large integer in FIX mode switches to SCI', () => {
            calc.setFixMode(2);
            const largeNum = 12345678901;
            const result = calc.display.formatNumber(largeNum);
            // Should switch to scientific notation
            expect(result).toContain(' ');
        });
    });

    describe('Decimal Place Limits', () => {
        test('FIX respects 0-9 range', () => {
            calc.setFixMode(0);
            expect(calc.display.decimals).toBe(0);
            
            calc.setFixMode(9);
            expect(calc.display.decimals).toBe(9);
            
            // Should clamp to valid range
            calc.display.decimals = 10;
            calc.setFixMode(calc.display.decimals);
            expect(calc.display.decimals).toBe(9);
        });

        test('SCI respects 0-9 range', () => {
            calc.setSciMode(0);
            expect(calc.display.decimals).toBe(0);
            
            calc.setSciMode(9);
            expect(calc.display.decimals).toBe(9);
        });
    });
});
