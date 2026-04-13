/**
 * HP-12C Date Functions Tests
 * Comprehensive test suite for date calculations
 */

const Calculator = require('../app/js/calculator.js');
const DateFunctions = require('../app/js/date-functions.js');

describe('Date Functions - Format Modes', () => {
    let calc, dates;
    
    beforeEach(() => {
        calc = new Calculator();
        dates = new DateFunctions();
    });
    
    test('sets D.MY format', () => {
        dates.setFormat('DMY');
        expect(dates.getFormat()).toBe('DMY');
    });
    
    test('sets M.DY format', () => {
        dates.setFormat('MDY');
        expect(dates.getFormat()).toBe('MDY');
    });
    
    test('parses D.MY dates correctly', () => {
        dates.setFormat('DMY');
        const parsed = dates.parseDate(25.121985);
        expect(parsed.day).toBe(25);
        expect(parsed.month).toBe(12);
        expect(parsed.year).toBe(1985);
        expect(parsed.isValid).toBe(true);
    });
    
    test('parses M.DY dates correctly', () => {
        dates.setFormat('MDY');
        const parsed = dates.parseDate(12.251985);
        expect(parsed.day).toBe(25);
        expect(parsed.month).toBe(12);
        expect(parsed.year).toBe(1985);
        expect(parsed.isValid).toBe(true);
    });
    
    test('rejects invalid format', () => {
        expect(() => dates.setFormat('INVALID')).toThrow();
    });
    
    test('format persists across operations', () => {
        dates.setFormat('MDY');
        expect(dates.getFormat()).toBe('MDY');
        dates.parseDate(12.251985);
        expect(dates.getFormat()).toBe('MDY');
    });
});

describe('Date Functions - Date Validation', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
    });
    
    test('validates correct dates', () => {
        expect(dates.isValidDate(25, 12, 1985)).toBe(true);
        expect(dates.isValidDate(1, 1, 2000)).toBe(true);
        expect(dates.isValidDate(31, 3, 2024)).toBe(true);
    });
    
    test('rejects invalid month 13', () => {
        expect(dates.isValidDate(1, 13, 2000)).toBe(false);
    });
    
    test('rejects invalid month 0', () => {
        expect(dates.isValidDate(1, 0, 2000)).toBe(false);
    });
    
    test('rejects invalid day 32', () => {
        expect(dates.isValidDate(32, 1, 2000)).toBe(false);
    });
    
    test('rejects invalid day 0', () => {
        expect(dates.isValidDate(0, 1, 2000)).toBe(false);
    });
    
    test('rejects year before 1582', () => {
        expect(dates.isValidDate(1, 1, 1581)).toBe(false);
    });
    
    test('rejects year after 9999', () => {
        expect(dates.isValidDate(1, 1, 10000)).toBe(false);
    });
    
    test('accepts February 29 in leap year', () => {
        expect(dates.isValidDate(29, 2, 2024)).toBe(true);
        expect(dates.isValidDate(29, 2, 2000)).toBe(true);
    });
    
    test('rejects February 29 in non-leap year', () => {
        expect(dates.isValidDate(29, 2, 2023)).toBe(false);
        expect(dates.isValidDate(29, 2, 1900)).toBe(false);
    });
    
    test('rejects day 31 in 30-day months', () => {
        expect(dates.isValidDate(31, 4, 2024)).toBe(false); // April
        expect(dates.isValidDate(31, 6, 2024)).toBe(false); // June
        expect(dates.isValidDate(31, 9, 2024)).toBe(false); // September
        expect(dates.isValidDate(31, 11, 2024)).toBe(false); // November
    });
    
    test('rejects day 31 in February', () => {
        expect(dates.isValidDate(31, 2, 2024)).toBe(false);
    });
    
    test('accepts edge case dates', () => {
        expect(dates.isValidDate(31, 12, 9999)).toBe(true); // Max date
        expect(dates.isValidDate(15, 10, 1582)).toBe(true); // Min date
    });
});

describe('Date Functions - Leap Year Calculation', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
    });
    
    test('divisible by 400 is leap year', () => {
        expect(dates.isLeapYear(2000)).toBe(true);
        expect(dates.isLeapYear(2400)).toBe(true);
    });
    
    test('divisible by 100 but not 400 is not leap year', () => {
        expect(dates.isLeapYear(1900)).toBe(false);
        expect(dates.isLeapYear(2100)).toBe(false);
        expect(dates.isLeapYear(2200)).toBe(false);
    });
    
    test('divisible by 4 but not 100 is leap year', () => {
        expect(dates.isLeapYear(2024)).toBe(true);
        expect(dates.isLeapYear(2028)).toBe(true);
        expect(dates.isLeapYear(1996)).toBe(true);
    });
    
    test('not divisible by 4 is not leap year', () => {
        expect(dates.isLeapYear(2023)).toBe(false);
        expect(dates.isLeapYear(2025)).toBe(false);
        expect(dates.isLeapYear(2026)).toBe(false);
    });
    
    test('century boundaries', () => {
        expect(dates.isLeapYear(1600)).toBe(true);
        expect(dates.isLeapYear(1700)).toBe(false);
        expect(dates.isLeapYear(1800)).toBe(false);
        expect(dates.isLeapYear(1900)).toBe(false);
    });
    
    test('days in February for leap year', () => {
        expect(dates.daysInMonth(2, 2024)).toBe(29);
        expect(dates.daysInMonth(2, 2000)).toBe(29);
    });
    
    test('days in February for non-leap year', () => {
        expect(dates.daysInMonth(2, 2023)).toBe(28);
        expect(dates.daysInMonth(2, 1900)).toBe(28);
    });
    
    test('days in other months', () => {
        expect(dates.daysInMonth(1, 2024)).toBe(31);
        expect(dates.daysInMonth(4, 2024)).toBe(30);
        expect(dates.daysInMonth(12, 2024)).toBe(31);
    });
});

describe('Date Functions - DYS (Days Between Dates)', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
        dates.setFormat('DMY');
    });
    
    test('same date returns 0 days', () => {
        const result = dates.daysBetween(1.012024, 1.012024);
        expect(result.days).toBe(0);
    });
    
    test('sequential days return 1 day', () => {
        const result = dates.daysBetween(1.012024, 2.012024);
        expect(result.days).toBe(1);
    });
    
    test('one week returns 7 days', () => {
        const result = dates.daysBetween(1.012024, 8.012024);
        expect(result.days).toBe(7);
    });
    
    test('one month (January)', () => {
        const result = dates.daysBetween(1.012024, 1.022024);
        expect(result.days).toBe(31);
    });
    
    test('one year (non-leap)', () => {
        const result = dates.daysBetween(1.012023, 1.012024);
        expect(result.days).toBe(365);
    });
    
    test('one year (leap year)', () => {
        const result = dates.daysBetween(1.012024, 1.012025);
        expect(result.days).toBe(366);
    });
    
    test('negative days for past dates', () => {
        const result = dates.daysBetween(1.012024, 1.012023);
        expect(result.days).toBe(-365);
    });
    
    test('crossing leap year February', () => {
        const result = dates.daysBetween(1.022024, 1.032024);
        expect(result.days).toBe(29); // 2024 is leap year
    });
    
    test('crossing non-leap year February', () => {
        const result = dates.daysBetween(1.022023, 1.032023);
        expect(result.days).toBe(28); // 2023 is not leap year
    });
    
    test('century boundary crossing', () => {
        const result = dates.daysBetween(1.011900, 1.012000);
        expect(result.days).toBe(36524); // 100 years with no leap year 1900
    });
    
    test('long time span (decade)', () => {
        const result = dates.daysBetween(1.012000, 1.012010);
        expect(result.days).toBe(3653); // Includes leap years 2000, 2004, 2008
    });
    
    test('invalid first date', () => {
        const result = dates.daysBetween(32.012024, 1.022024);
        expect(result.error).toBeDefined();
    });
    
    test('invalid second date', () => {
        const result = dates.daysBetween(1.012024, 32.022024);
        expect(result.error).toBeDefined();
    });
    
    test('format independent results', () => {
        dates.setFormat('DMY');
        const result1 = dates.daysBetween(25.121985, 31.121985);
        
        dates.setFormat('MDY');
        const result2 = dates.daysBetween(12.251985, 12.311985);
        
        expect(result1.days).toBe(result2.days);
    });
    
    test('real-world example: loan period', () => {
        // 180-day loan from July 1 to December 28, 2024
        const result = dates.daysBetween(1.072024, 28.122024);
        expect(result.days).toBe(180);
    });
});

describe('Date Functions - DATE (Future/Past Date)', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
        dates.setFormat('DMY');
    });
    
    test('add positive days', () => {
        const result = dates.addDays(1.012024, 10);
        expect(result.date).toBe(11.012024);
    });
    
    test('add negative days (past)', () => {
        const result = dates.addDays(11.012024, -10);
        expect(result.date).toBe(1.012024);
    });
    
    test('add zero days', () => {
        const result = dates.addDays(15.072024, 0);
        expect(result.date).toBe(15.072024);
    });
    
    test('month boundary crossing forward', () => {
        const result = dates.addDays(25.012024, 10);
        expect(result.date).toBe(4.022024); // January 25 + 10 = February 4
    });
    
    test('month boundary crossing backward', () => {
        const result = dates.addDays(5.022024, -10);
        expect(result.date).toBe(26.012024); // February 5 - 10 = January 26
    });
    
    test('year boundary crossing forward', () => {
        const result = dates.addDays(25.122024, 10);
        expect(result.date).toBe(4.012025); // December 25 + 10 = January 4, 2025
    });
    
    test('year boundary crossing backward', () => {
        const result = dates.addDays(5.012024, -10);
        expect(result.date).toBe(26.122023); // January 5 - 10 = December 26, 2023
    });
    
    test('leap year consideration', () => {
        const result = dates.addDays(1.012024, 366);
        expect(result.date).toBe(1.012025); // 2024 is leap year
    });
    
    test('day of week calculation', () => {
        const result = dates.addDays(1.012024, 0);
        expect(result.dayOfWeek).toBeGreaterThanOrEqual(1);
        expect(result.dayOfWeek).toBeLessThanOrEqual(7);
    });
    
    test('day of week for known date (Jan 1, 2024 is Monday)', () => {
        const result = dates.addDays(1.012024, 0);
        expect(result.dayOfWeek).toBe(1); // Monday
    });
    
    test('large day count forward', () => {
        const result = dates.addDays(1.012024, 1000);
        expect(result.error).toBeUndefined();
        expect(result.date).toBeGreaterThan(0);
    });
    
    test('century crossing', () => {
        const result = dates.addDays(1.011999, 366);
        // Result will be 2.01 because trailing zeros are dropped, but parsed correctly
        const parsed = dates.parseDate(result.date);
        expect(parsed.year).toBe(2000);
        expect(parsed.month).toBe(1);
        expect(parsed.day).toBe(2);
    });
    
    test('invalid start date', () => {
        const result = dates.addDays(32.012024, 10);
        expect(result.error).toBeDefined();
    });
    
    test('real-world example: 90 days forward', () => {
        const result = dates.addDays(1.012024, 90);
        expect(result.date).toBe(31.032024); // March 31, 2024
    });
    
    test('real-world example: 30 days ago', () => {
        const result = dates.addDays(1.022024, -30);
        expect(result.date).toBe(2.012024); // January 2, 2024
    });
});

describe('Date Functions - Day of Week Calculation', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
    });
    
    test('January 1, 2000 is Saturday (6)', () => {
        const dow = dates.dayOfWeek(1, 1, 2000);
        expect(dow).toBe(6); // Saturday
    });
    
    test('January 1, 2024 is Monday (1)', () => {
        const dow = dates.dayOfWeek(1, 1, 2024);
        expect(dow).toBe(1); // Monday
    });
    
    test('leap year February 29, 2024 is Thursday (4)', () => {
        const dow = dates.dayOfWeek(29, 2, 2024);
        expect(dow).toBe(4); // Thursday
    });
    
    test('century boundary: January 1, 2000', () => {
        const dow = dates.dayOfWeek(1, 1, 2000);
        expect(dow).toBeGreaterThanOrEqual(1);
        expect(dow).toBeLessThanOrEqual(7);
    });
    
    test('all weekdays in range 1-7', () => {
        for (let day = 1; day <= 7; day++) {
            const dow = dates.dayOfWeek(day, 1, 2024);
            expect(dow).toBeGreaterThanOrEqual(1);
            expect(dow).toBeLessThanOrEqual(7);
        }
    });
    
    test('consistency with DATE function', () => {
        dates.setFormat('DMY');
        const result = dates.addDays(1.012024, 0);
        const dow = dates.dayOfWeek(1, 1, 2024);
        expect(result.dayOfWeek).toBe(dow);
    });
    
    test('historical date verification', () => {
        // December 25, 1985 is Wednesday (3)
        const dow = dates.dayOfWeek(25, 12, 1985);
        expect(dow).toBe(3);
    });
    
    test('future date calculation', () => {
        const dow = dates.dayOfWeek(1, 1, 2030);
        expect(dow).toBeGreaterThanOrEqual(1);
        expect(dow).toBeLessThanOrEqual(7);
    });
});

describe('Date Functions - Julian Day Number', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
    });
    
    test('JDN calculation for January 1, 2000', () => {
        const jdn = dates.dateToJDN(1, 1, 2000);
        expect(jdn).toBe(2451545); // Known JDN
    });
    
    test('round-trip conversion (date → JDN → date)', () => {
        const day = 15, month = 7, year = 2024;
        const jdn = dates.dateToJDN(day, month, year);
        const result = dates.jdnToDate(jdn);
        expect(result.day).toBe(day);
        expect(result.month).toBe(month);
        expect(result.year).toBe(year);
    });
    
    test('historical date JDN', () => {
        const jdn = dates.dateToJDN(15, 10, 1582);
        expect(jdn).toBeGreaterThan(0);
    });
    
    test('future date JDN', () => {
        const jdn = dates.dateToJDN(31, 12, 2100);
        expect(jdn).toBeGreaterThan(0);
    });
    
    test('leap year accuracy', () => {
        const jdn1 = dates.dateToJDN(29, 2, 2024);
        const jdn2 = dates.dateToJDN(1, 3, 2024);
        expect(jdn2 - jdn1).toBe(1);
    });
    
    test('century boundary accuracy', () => {
        const jdn1 = dates.dateToJDN(31, 12, 1999);
        const jdn2 = dates.dateToJDN(1, 1, 2000);
        expect(jdn2 - jdn1).toBe(1);
    });
    
    test('multiple round-trip conversions', () => {
        const testDates = [
            { day: 1, month: 1, year: 2000 },
            { day: 29, month: 2, year: 2024 },
            { day: 31, month: 12, year: 2023 },
            { day: 15, month: 7, year: 1985 }
        ];
        
        testDates.forEach(date => {
            const jdn = dates.dateToJDN(date.day, date.month, date.year);
            const result = dates.jdnToDate(jdn);
            expect(result.day).toBe(date.day);
            expect(result.month).toBe(date.month);
            expect(result.year).toBe(date.year);
        });
    });
    
    test('JDN increments by 1 per day', () => {
        const jdn1 = dates.dateToJDN(1, 1, 2024);
        const jdn2 = dates.dateToJDN(2, 1, 2024);
        expect(jdn2 - jdn1).toBe(1);
    });
});

describe('Date Functions - Integration Tests', () => {
    let calc;
    
    beforeEach(() => {
        calc = new Calculator();
    });
    
    test('DYS with stack operations', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;  // Ensure input state is clean
        calc.stack.y = 1.012024;
        calc.stack.x = 31.122024;
        calc.calculateDYS();
        expect(calc.stack.x).toBe(365); // Jan 1 to Dec 31 (not inclusive of both ends)
    });
    
    test('DATE with stack operations', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;  // Ensure input state is clean
        calc.stack.y = 1.012024;
        calc.stack.x = 90;
        calc.calculateDATE();
        expect(calc.stack.x).toBe(31.032024);
    });
    
    test('format switching mid-calculation', () => {
        // First calculation in DMY format
        const calc1 = new Calculator();
        calc1.dates.setFormat('DMY');
        calc1.isNewNumber = true;
        calc1.stack.y = 1.012024;
        calc1.stack.x = 31.122024;
        calc1.calculateDYS();
        const result1 = calc1.stack.x;
        
        // Second calculation in MDY format (same dates, different format)
        const calc2 = new Calculator();
        calc2.dates.setFormat('MDY');
        calc2.isNewNumber = true;
        calc2.stack.y = 1.012024;
        calc2.stack.x = 12.312024;  // Same dates in MDY format
        calc2.calculateDYS();
        const result2 = calc2.stack.x;
        
        // Results should be same (day count is format-independent)
        expect(result1).toBe(365); // Jan 1 to Dec 31
        expect(result2).toBe(365);
    });
    
    test('LSTX preservation in DYS', () => {
        calc.isNewNumber = true;  // Ensure input state is clean
        calc.stack.y = 1.012024;
        calc.stack.x = 31.122024;
        const originalX = calc.stack.x;
        calc.calculateDYS();
        expect(calc.stack.lastX).toBe(originalX);
    });
    
    test('memory register interaction', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        calc.stack.x = 1.012024;
        calc.memory.store(0, calc.stack.x);
        
        calc.stack.x = 90;
        calc.stack.y = calc.memory.recall(0);
        calc.calculateDATE();
        
        expect(calc.stack.x).toBe(31.032024);
    });
    
    test('complex date calculation: compound', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        // Calculate days, then use result
        calc.stack.y = 1.012024;
        calc.stack.x = 1.072024;
        calc.calculateDYS(); // 182 days
        
        const days = calc.stack.x;
        expect(days).toBe(182);
    });
    
    test('chain calculations', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        // Start date
        calc.stack.y = 1.012024;
        calc.stack.x = 90;
        calc.calculateDATE(); // March 31
        
        // Use result as new start date
        const result1 = calc.stack.x;
        calc.isNewNumber = true;
        calc.stack.y = result1;
        calc.stack.x = 90;
        calc.calculateDATE(); // June 29
        
        expect(calc.stack.x).toBe(29.062024);
    });
    
    test('error recovery from invalid date', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        calc.stack.y = 32.012024; // Invalid
        calc.stack.x = 10;
        
        // Should handle error gracefully
        calc.calculateDATE();
        // Stack should remain in recoverable state
        expect(calc.stack.x).toBeDefined();
    });
    
    test('real-world scenario: bond maturity', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        // Bond issued Jan 1, 2024, matures in 180 days
        calc.stack.y = 1.012024;
        calc.stack.x = 180;
        calc.calculateDATE();
        
        expect(calc.stack.x).toBe(29.062024); // June 29, 2024
    });
    
    test('real-world scenario: invoice due date', () => {
        calc.dates.setFormat('DMY');
        calc.isNewNumber = true;
        // Invoice dated July 15, due in 30 days
        calc.stack.y = 15.072024;
        calc.stack.x = 30;
        calc.calculateDATE();
        
        expect(calc.stack.x).toBe(14.082024); // August 14, 2024
    });
});

describe('Date Functions - Edge Cases', () => {
    let dates;
    
    beforeEach(() => {
        dates = new DateFunctions();
        dates.setFormat('DMY');
    });
    
    test('December 31 to January 1', () => {
        const result = dates.daysBetween(31.122023, 1.012024);
        expect(result.days).toBe(1);
    });
    
    test('leap year February 28 to March 1', () => {
        const result = dates.daysBetween(28.022024, 1.032024);
        expect(result.days).toBe(2); // Feb 29 exists in leap year
    });
    
    test('non-leap year February 28 to March 1', () => {
        const result = dates.daysBetween(28.022023, 1.032023);
        expect(result.days).toBe(1); // No Feb 29 in non-leap year
    });
    
    test('century turn: 1999 to 2000', () => {
        const result = dates.daysBetween(31.121999, 1.012000);
        expect(result.days).toBe(1);
    });
    
    test('millennium turn: year 2000 characteristics', () => {
        expect(dates.isLeapYear(2000)).toBe(true);
        expect(dates.daysInMonth(2, 2000)).toBe(29);
    });
});
