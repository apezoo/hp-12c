/**
 * HP-12C Calculator Integration Tests
 * Tests real-world calculator operations and UI interactions
 */

const Calculator = require('../app/js/calculator.js');

describe('HP-12C Integration Tests', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    describe('Basic Arithmetic Operations', () => {
        test('4 ENTER 4 + should equal 8', () => {
            // Simulate: 4 ENTER 4 +
            calc.enterDigit('4');
            calc.enter();
            calc.enterDigit('4');
            calc.add();
            
            expect(calc.stack.x).toBe(8);
        });

        test('10 ENTER 5 - should equal 5', () => {
            calc.enterDigit('1');
            calc.enterDigit('0');
            calc.enter();
            calc.enterDigit('5');
            calc.subtract();
            
            expect(calc.stack.x).toBe(5);
        });

        test('3 ENTER 4 × should equal 12', () => {
            calc.enterDigit('3');
            calc.enter();
            calc.enterDigit('4');
            calc.multiply();
            
            expect(calc.stack.x).toBe(12);
        });

        test('12 ENTER 3 ÷ should equal 4', () => {
            calc.enterDigit('1');
            calc.enterDigit('2');
            calc.enter();
            calc.enterDigit('3');
            calc.divide();
            
            expect(calc.stack.x).toBe(4);
        });
    });

    describe('Decimal Operations', () => {
        test('2.5 ENTER 1.5 + should equal 4', () => {
            calc.enterDigit('2');
            calc.enterDecimal();
            calc.enterDigit('5');
            calc.enter();
            calc.enterDigit('1');
            calc.enterDecimal();
            calc.enterDigit('5');
            calc.add();
            
            expect(calc.stack.x).toBe(4);
        });

        test('0.1 ENTER 0.2 + should handle floating point correctly', () => {
            calc.enterDigit('0');
            calc.enterDecimal();
            calc.enterDigit('1');
            calc.enter();
            calc.enterDigit('0');
            calc.enterDecimal();
            calc.enterDigit('2');
            calc.add();
            
            expect(calc.stack.x).toBeCloseTo(0.3, 10);
        });
    });

    describe('Stack Operations', () => {
        test('RPN stack should maintain correct order', () => {
            // Enter 1, 2, 3 into stack
            calc.enterDigit('1');
            calc.enter();
            calc.enterDigit('2');
            calc.enter();
            calc.enterDigit('3');
            
            expect(calc.stack.x).toBe(3);
            expect(calc.stack.y).toBe(2);
            expect(calc.stack.z).toBe(1);
        });

        test('Roll down should rotate stack', () => {
            calc.enterDigit('1');
            calc.enter();
            calc.enterDigit('2');
            calc.enter();
            calc.enterDigit('3');
            calc.enter();
            calc.enterDigit('4');
            
            calc.rollDown();
            
            expect(calc.stack.x).toBe(3);
            expect(calc.stack.y).toBe(2);
            expect(calc.stack.z).toBe(1);
            expect(calc.stack.t).toBe(4);
        });

        test('Swap XY should exchange X and Y', () => {
            calc.enterDigit('5');
            calc.enter();
            calc.enterDigit('1');
            calc.enterDigit('0');
            
            calc.swapXY();
            
            expect(calc.stack.x).toBe(5);
            expect(calc.stack.y).toBe(10);
        });
    });

    describe('Clear Operations', () => {
        test('CLx should clear X register only', () => {
            calc.enterDigit('1');
            calc.enter();
            calc.enterDigit('2');
            calc.enter();
            calc.enterDigit('3');
            
            calc.clearX();
            
            expect(calc.stack.x).toBe(0);
            expect(calc.stack.y).toBe(2);
        });

        test('ON button should reset calculator', () => {
            calc.enterDigit('1');
            calc.enterDigit('2');
            calc.enterDigit('3');
            calc.enter();
            
            calc.reset();
            
            expect(calc.stack.x).toBe(0);
            expect(calc.stack.y).toBe(0);
            expect(calc.stack.z).toBe(0);
            expect(calc.stack.t).toBe(0);
        });
    });

    describe('Chain Calculations', () => {
        test('Complex calculation: (5 + 3) × 2 - 1', () => {
            // 5 ENTER 3 + 2 × 1 -
            calc.enterDigit('5');
            calc.enter();
            calc.enterDigit('3');
            calc.add();  // Result: 8
            calc.enterDigit('2');
            calc.multiply();  // Result: 16
            calc.enterDigit('1');
            calc.subtract();  // Result: 15
            
            expect(calc.stack.x).toBe(15);
        });

        test('Chain operations maintain RPN logic', () => {
            // 10 ENTER 5 + 3 × 2 ÷
            calc.enterDigit('1');
            calc.enterDigit('0');
            calc.enter();
            calc.enterDigit('5');
            calc.add();  // 15
            calc.enterDigit('3');
            calc.multiply();  // 45
            calc.enterDigit('2');
            calc.divide();  // 22.5
            
            expect(calc.stack.x).toBe(22.5);
        });
    });

    describe('Sign Change', () => {
        test('CHS should negate positive number', () => {
            calc.enterDigit('5');
            calc.changeSign();
            
            expect(calc.stack.x).toBe(-5);
        });

        test('CHS should negate negative number', () => {
            calc.enterDigit('5');
            calc.changeSign();
            calc.enter();
            calc.changeSign();
            
            expect(calc.stack.x).toBe(5);
        });
    });

    describe('Input State Management', () => {
        test('Multiple operations should handle input state correctly', () => {
            calc.enterDigit('7');
            calc.enter();
            expect(calc.isNewNumber).toBe(true);
            
            calc.enterDigit('3');
            expect(calc.isNewNumber).toBe(false);
            
            calc.add();
            expect(calc.isNewNumber).toBe(true);
        });

        test('Decimal point should only be entered once', () => {
            calc.enterDigit('1');
            calc.enterDecimal();
            expect(calc.hasDecimal).toBe(true);
            
            calc.enterDecimal(); // Should be ignored
            calc.enterDigit('5');
            
            expect(calc.stack.x).toBe(1.5);
        });
    });

    describe('Display Functionality', () => {
        test('Display should format numbers correctly', () => {
            calc.enterDigit('1');
            calc.enterDigit('2');
            calc.enterDigit('3');
            calc.enterDecimal();
            calc.enterDigit('4');
            calc.enterDigit('5');
            
            const formatted = calc.display.formatNumber(123.45);
            expect(formatted).toMatch(/123\.45/);
        });

        test('Display should handle zero correctly', () => {
            const formatted = calc.display.formatNumber(0);
            expect(formatted).toBe('0.');
        });

        test('Display should handle large numbers', () => {
            const formatted = calc.display.formatNumber(999999999);
            expect(formatted).toContain('999999999');
        });
    });
});

describe('Calculator Button Integration', () => {
    test('Calculator should initialize button listeners', () => {
        // Mock DOM environment
        global.document = {
            getElementById: jest.fn((id) => {
                if (id === 'displayValue') {
                    return { textContent: '0.' };
                }
                return null;
            }),
            querySelectorAll: jest.fn(() => []),
            addEventListener: jest.fn()
        };

        const calc = new Calculator();
        calc.initialize();

        expect(document.getElementById).toHaveBeenCalledWith('displayValue');
    });
});

describe('Error Handling', () => {
    let calc;

    beforeEach(() => {
        calc = new Calculator();
    });

    test('Division by zero should handle gracefully', () => {
        calc.enterDigit('5');
        calc.enter();
        calc.enterDigit('0');
        calc.divide();
        
        // Should result in Infinity
        expect(calc.stack.x).toBe(Infinity);
    });

    test('Display should handle Infinity', () => {
        const formatted = calc.display.formatNumber(Infinity);
        expect(formatted).toContain('Error');
    });

    test('Display should handle NaN', () => {
        const formatted = calc.display.formatNumber(NaN);
        expect(formatted).toContain('Error');
    });
});
