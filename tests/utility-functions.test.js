/**
 * Utility Functions Tests
 * Tests for time conversion (12×, 12÷) and number manipulation (INTG, FRAC)
 */

const Calculator = require('../js/calculator.js');

describe('Utility Functions', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    describe('12× (Multiply by 12) - Time Conversion', () => {
        test('Convert years to months: 5 years = 60 months', () => {
            calc.stack.x = 5;
            calc.multiply12();
            expect(calc.stack.x).toBe(60);
        });

        test('Convert annual rate to monthly: 6% annual', () => {
            calc.stack.x = 6;
            calc.multiply12();
            expect(calc.stack.x).toBe(72);
        });

        test('30 years = 360 monthly payments', () => {
            calc.stack.x = 30;
            calc.multiply12();
            expect(calc.stack.x).toBe(360);
        });

        test('Multiply by 12 with decimal values', () => {
            calc.stack.x = 2.5;
            calc.multiply12();
            expect(calc.stack.x).toBe(30);
        });

        test('Multiply by 12 with negative numbers', () => {
            calc.stack.x = -3;
            calc.multiply12();
            expect(calc.stack.x).toBe(-36);
        });

        test('Multiply by 12 with zero', () => {
            calc.stack.x = 0;
            calc.multiply12();
            expect(calc.stack.x).toBe(0);
        });

        test('Multiply by 12 saves LSTX', () => {
            calc.stack.x = 5;
            calc.multiply12();
            expect(calc.stack.lstx).toBe(5);
            expect(calc.stack.x).toBe(60);
        });
    });

    describe('12÷ (Divide by 12) - Time Conversion', () => {
        test('Convert months to years: 60 months = 5 years', () => {
            calc.stack.x = 60;
            calc.divide12();
            expect(calc.stack.x).toBe(5);
        });

        test('Convert annual rate to monthly: 12% annual = 1% monthly', () => {
            calc.stack.x = 12;
            calc.divide12();
            expect(calc.stack.x).toBe(1);
        });

        test('6% annual = 0.5% monthly', () => {
            calc.stack.x = 6;
            calc.divide12();
            expect(calc.stack.x).toBe(0.5);
        });

        test('360 months = 30 years', () => {
            calc.stack.x = 360;
            calc.divide12();
            expect(calc.stack.x).toBe(30);
        });

        test('Divide by 12 with decimal values', () => {
            calc.stack.x = 30;
            calc.divide12();
            expect(calc.stack.x).toBe(2.5);
        });

        test('Divide by 12 with negative numbers', () => {
            calc.stack.x = -36;
            calc.divide12();
            expect(calc.stack.x).toBe(-3);
        });

        test('Divide by 12 with zero', () => {
            calc.stack.x = 0;
            calc.divide12();
            expect(calc.stack.x).toBe(0);
        });

        test('Divide by 12 saves LSTX', () => {
            calc.stack.x = 60;
            calc.divide12();
            expect(calc.stack.lstx).toBe(60);
            expect(calc.stack.x).toBe(5);
        });
    });

    describe('INTG (Integer Part) - g 9', () => {
        test('Get integer part of positive number', () => {
            calc.stack.x = 123.456;
            calc.integerPart();
            expect(calc.stack.x).toBe(123);
        });

        test('Get integer part of negative number', () => {
            calc.stack.x = -45.789;
            calc.integerPart();
            expect(calc.stack.x).toBe(-45);
        });

        test('Get integer part of number less than 1', () => {
            calc.stack.x = 0.999;
            calc.integerPart();
            expect(calc.stack.x).toBe(0);
        });

        test('Integer part of zero', () => {
            calc.stack.x = 0;
            calc.integerPart();
            expect(calc.stack.x).toBe(0);
        });

        test('Integer part of pure integer', () => {
            calc.stack.x = 42;
            calc.integerPart();
            expect(calc.stack.x).toBe(42);
        });

        test('Integer part of negative fraction', () => {
            calc.stack.x = -0.5;
            calc.integerPart();
            // Math.trunc(-0.5) returns -0, which is equivalent to 0
            expect(calc.stack.x === 0 || Object.is(calc.stack.x, -0)).toBe(true);
        });

        test('INTG saves LSTX', () => {
            calc.stack.x = 123.456;
            calc.integerPart();
            expect(calc.stack.lstx).toBe(123.456);
            expect(calc.stack.x).toBe(123);
        });

        test('INTG with large number', () => {
            calc.stack.x = 9999999.123;
            calc.integerPart();
            expect(calc.stack.x).toBe(9999999);
        });
    });

    describe('FRAC (Fractional Part) - g PMT', () => {
        test('Get fractional part of positive number', () => {
            calc.stack.x = 123.456;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.456) < 0.0001).toBe(true);
        });

        test('Get fractional part of negative number (returns positive)', () => {
            calc.stack.x = -45.789;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.789) < 0.0001).toBe(true);
        });

        test('Fractional part of number less than 1', () => {
            calc.stack.x = 0.999;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.999) < 0.0001).toBe(true);
        });

        test('Fractional part of zero', () => {
            calc.stack.x = 0;
            calc.fractionalPart();
            expect(calc.stack.x).toBe(0);
        });

        test('Fractional part of pure integer', () => {
            calc.stack.x = 42;
            calc.fractionalPart();
            expect(calc.stack.x).toBe(0);
        });

        test('Fractional part is always positive', () => {
            calc.stack.x = -3.7;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.7) < 0.0001).toBe(true);
            expect(calc.stack.x >= 0).toBe(true);
        });

        test('FRAC saves LSTX', () => {
            calc.stack.x = 123.456;
            calc.fractionalPart();
            expect(calc.stack.lstx).toBe(123.456);
        });

        test('FRAC with very small fractional part', () => {
            calc.stack.x = 100.001;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.001) < 0.0001).toBe(true);
        });
    });

    describe('INTG and FRAC Combined', () => {
        test('INTG + FRAC should reconstruct positive number', () => {
            const original = 123.456;
            
            calc.stack.x = original;
            calc.enter(); // Save in Y
            
            calc.integerPart(); // X = 123
            const intPart = calc.stack.x;
            
            calc.stack.x = original;
            calc.fractionalPart(); // X = 0.456
            const fracPart = calc.stack.x;
            
            const reconstructed = intPart + fracPart;
            expect(Math.abs(reconstructed - original) < 0.0001).toBe(true);
        });

        test('Split number using INTG and FRAC', () => {
            const num = 987.654;
            
            // Get integer part
            calc.stack.x = num;
            calc.enter();
            calc.integerPart();
            expect(calc.stack.x).toBe(987);
            
            // Get fractional part
            calc.stack.x = num;
            calc.fractionalPart();
            expect(Math.abs(calc.stack.x - 0.654) < 0.0001).toBe(true);
        });
    });

    describe('Time Conversion Workflow', () => {
        test('Convert 2.5 years to months and back', () => {
            calc.stack.x = 2.5;
            calc.multiply12();
            expect(calc.stack.x).toBe(30);
            
            calc.divide12();
            expect(calc.stack.x).toBe(2.5);
        });

        test('Annual rate to monthly and back', () => {
            calc.stack.x = 12;
            calc.divide12();
            expect(calc.stack.x).toBe(1);
            
            calc.multiply12();
            expect(calc.stack.x).toBe(12);
        });

        test('Real world: 30 year mortgage = 360 payments', () => {
            // 30 years
            calc.stack.x = 30;
            calc.multiply12();
            expect(calc.stack.x).toBe(360);
            
            // Typical monthly payment calculation setup
            // This would be used with TVM functions
        });
    });

    describe('Integration with RPN Stack', () => {
        test('12× does not affect Y register', () => {
            calc.stack.x = 5;
            calc.enter();
            calc.stack.x = 10;
            calc.multiply12();
            
            expect(calc.stack.y).toBe(5);
            expect(calc.stack.x).toBe(120);
        });

        test('12÷ does not affect Y register', () => {
            calc.stack.x = 60;
            calc.enter();
            calc.stack.x = 120;
            calc.divide12();
            
            expect(calc.stack.y).toBe(60);
            expect(calc.stack.x).toBe(10);
        });

        test('INTG does not affect Y register', () => {
            calc.stack.x = 10.5;
            calc.enter();
            calc.stack.x = 20.7;
            calc.integerPart();
            
            expect(calc.stack.y).toBe(10.5);
            expect(calc.stack.x).toBe(20);
        });

        test('FRAC does not affect Y register', () => {
            calc.stack.x = 10.5;
            calc.enter();
            calc.stack.x = 20.7;
            calc.fractionalPart();
            
            expect(calc.stack.y).toBe(10.5);
            expect(Math.abs(calc.stack.x - 0.7) < 0.0001).toBe(true);
        });
    });
});
