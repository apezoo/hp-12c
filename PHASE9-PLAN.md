# Phase 9: Date Functions - Implementation Plan

**Target Completion:** 95% overall calculator completion  
**Estimated Effort:** 8-10 hours  
**Status:** 📋 Planning  
**Priority:** High - Date calculations are essential for financial applications

---

## 🎯 Overview

Phase 9 implements the HP-12C's powerful date calculation functions, which are critical for bond calculations, loan analysis, time period computations, and general financial planning. The HP-12C uses a sophisticated calendar system that properly handles leap years and century transitions.

### Why Date Functions in Phase 9?

Date functions are fundamental to financial calculations:
- **Bond calculations** require exact day counts between dates
- **Loan amortization** needs date-based payment schedules
- **Investment analysis** depends on precise time periods
- **Financial planning** uses calendar-based projections

At 90% completion after Phase 8, date functions will bring the calculator to 95% completion, leaving only specialized features (programming, depreciation, bonds) for the final 5%.

---

## 📋 Features to Implement

### 1. Date Format Modes ⭐

#### D.MY (Day.Month.Year) Format
- **Key Combination:** `g 4`
- **Function:** Sets European/International date format
- **Format:** DD.MMYYYY
- **Examples:**
  - 25.121985 = December 25, 1985
  - 01.012000 = January 1, 2000
  - 29.022024 = February 29, 2024 (leap year)

#### M.DY (Month.Day.Year) Format
- **Key Combination:** `g 5`
- **Function:** Sets US date format
- **Format:** MM.DDYYYY
- **Examples:**
  - 12.251985 = December 25, 1985
  - 01.012000 = January 1, 2000
  - 02.292024 = February 29, 2024 (leap year)

**Implementation Notes:**
- Default format should be D.MY (European standard)
- Format setting persists across calculator sessions
- Format indicator could be shown in display or settings
- Both formats use the same internal representation

### 2. Calendar Validation ⭐

The HP-12C must validate dates according to Gregorian calendar rules:

#### Leap Year Rules
```javascript
function isLeapYear(year) {
    // Divisible by 400: leap year
    if (year % 400 === 0) return true;
    // Divisible by 100 but not 400: not leap year
    if (year % 100 === 0) return false;
    // Divisible by 4 but not 100: leap year
    if (year % 4 === 0) return true;
    // Otherwise: not leap year
    return false;
}
```

#### Month Day Limits
- January: 31 days
- February: 28 days (29 in leap years)
- March: 31 days
- April: 30 days
- May: 31 days
- June: 30 days
- July: 31 days
- August: 31 days
- September: 30 days
- October: 31 days
- November: 30 days
- December: 31 days

#### Valid Date Range
- **Minimum:** October 15, 1582 (Gregorian calendar adoption)
- **Maximum:** December 31, 9999 (practical limit)
- **HP-12C range:** Typically 1901 to 2099 (some models support wider range)

### 3. Date Entry Format ⭐

Dates are entered as decimal numbers in the active format:

#### D.MY Format Entry
```
Enter: 25.121985
Means: December 25, 1985
Stack: DD.MMYYYY
```

#### M.DY Format Entry
```
Enter: 12.251985
Means: December 25, 1985
Stack: MM.DDYYYY
```

#### Parsing Rules
- Integer part before first decimal = day or month (depends on format)
- First two digits after decimal = month or day
- Last four digits = year (YYYY format always)
- Validation occurs immediately on date function execution

### 4. DYS Function (Days Between Dates) ⭐

#### Key Combination: `g EEX` (blue function on EEX key)

#### Function: ΔDYS (Delta Days)
Calculates the number of days between two dates.

**Syntax:**
```
date1 ENTER date2 g EEX
```

**Behavior:**
- Y register: Earlier date (date1)
- X register: Later date (date2)
- Result: Number of days from date1 to date2
- Sign: Positive if date2 > date1, negative if date2 < date1

**Examples:**

1. Days in a year:
   ```
   01.011985 ENTER 01.011986 g EEX
   → 365 (1985 was not a leap year)
   ```

2. Days in a leap year:
   ```
   01.012024 ENTER 01.012025 g EEX
   → 366 (2024 is a leap year)
   ```

3. Days until deadline:
   ```
   15.072024 ENTER 31.122024 g EEX
   → 169 (days from July 15 to Dec 31, 2024)
   ```

4. Negative days (past date):
   ```
   01.012024 ENTER 01.012023 g EEX
   → -365 (going backward in time)
   ```

**Algorithm:**
Use Julian Day Number (JDN) method for accuracy:
```javascript
function dateToJDN(day, month, year) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 
           365 * y + Math.floor(y / 4) - 
           Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function daysBetween(date1, date2) {
    const jdn1 = dateToJDN(date1.day, date1.month, date1.year);
    const jdn2 = dateToJDN(date2.day, date2.month, date2.year);
    return jdn2 - jdn1;
}
```

### 5. DATE Function (Future/Past Date) ⭐

#### Key Combination: `g CHS` (blue function on CHS key)

#### Function: DATE
Calculates a date that is N days in the future or past from a given date.

**Syntax:**
```
start_date ENTER days g CHS
```

**Behavior:**
- Y register: Starting date
- X register: Number of days (+future, -past)
- Result: New date (displayed in X)
- Y register: Day of week (1=Monday, 7=Sunday)

**Examples:**

1. Date 90 days from now:
   ```
   01.012024 ENTER 90 g CHS
   → 31.032024 (March 31, 2024)
   → x↔y → 7 (Sunday)
   ```

2. Date 30 days ago:
   ```
   01.022024 ENTER 30 CHS g CHS
   → 02.012024 (January 2, 2024)
   → x↔y → 2 (Tuesday)
   ```

3. One year forward:
   ```
   15.072024 ENTER 366 g CHS
   → 15.072025 (July 15, 2025, accounting for leap year)
   → x↔y → 2 (Tuesday)
   ```

**Day of Week Calculation:**
Use Zeller's congruence or JDN modulo 7:
```javascript
function dayOfWeek(day, month, year) {
    const jdn = dateToJDN(day, month, year);
    // JDN % 7: 0=Monday, 6=Sunday (adjust to 1-7)
    return ((jdn % 7) + 7) % 7 || 7;
}
```

### 6. RCL ENTER (Display Current Date) 📋

**Optional Enhancement:**
- `RCL ENTER` displays system's current date
- Useful for quick reference
- Formats according to active date format mode

---

## 🏗️ Architecture

### New Module: `js/date-functions.js`

```javascript
/**
 * HP-12C Date Functions Engine
 * Handles calendar calculations, date arithmetic, and format conversions
 */

class DateFunctions {
    constructor() {
        // Date format: 'DMY' or 'MDY'
        this.dateFormat = 'DMY';  // Default to European format
        
        // Valid date range
        this.minYear = 1582;  // Gregorian calendar start
        this.maxYear = 9999;
    }
    
    /**
     * Parse date from decimal format
     */
    parseDate(dateValue) {
        // Returns { day, month, year, isValid, error }
    }
    
    /**
     * Format date to decimal format
     */
    formatDate(day, month, year) {
        // Returns decimal number in current format
    }
    
    /**
     * Validate date components
     */
    isValidDate(day, month, year) {
        // Check leap year, month limits, day ranges
    }
    
    /**
     * Calculate days between two dates (DYS)
     */
    daysBetween(date1Value, date2Value) {
        // Returns number of days (positive or negative)
    }
    
    /**
     * Calculate future/past date (DATE)
     */
    addDays(dateValue, days) {
        // Returns { date, dayOfWeek }
    }
    
    /**
     * Convert date to Julian Day Number
     */
    dateToJDN(day, month, year) {
        // Returns JDN for accurate calculations
    }
    
    /**
     * Convert Julian Day Number to date
     */
    jdnToDate(jdn) {
        // Returns { day, month, year }
    }
    
    /**
     * Calculate day of week (1=Mon, 7=Sun)
     */
    dayOfWeek(day, month, year) {
        // Returns 1-7
    }
    
    /**
     * Check if year is leap year
     */
    isLeapYear(year) {
        // Leap year logic
    }
    
    /**
     * Get days in month
     */
    daysInMonth(month, year) {
        // Returns 28-31
    }
    
    /**
     * Set date format mode
     */
    setFormat(format) {
        // 'DMY' or 'MDY'
    }
    
    /**
     * Get current date from system
     */
    getCurrentDate() {
        // Returns formatted date decimal
    }
}
```

### Integration Points

#### Calculator.js Additions

```javascript
class Calculator {
    constructor() {
        // ... existing code ...
        this.dates = new DateFunctions();
    }
    
    // Blue function handlers
    handleBlueFunction(key) {
        switch(key) {
            case 'digit-4':  // g 4 - D.MY
                this.setDateFormat('DMY');
                break;
            case 'digit-5':  // g 5 - M.DY
                this.setDateFormat('MDY');
                break;
            case 'eex':      // g EEX - DYS
                this.calculateDYS();
                break;
            case 'chs':      // g CHS - DATE
                this.calculateDATE();
                break;
        }
    }
    
    setDateFormat(format) {
        this.dates.setFormat(format);
        this.updateDisplay();
    }
    
    calculateDYS() {
        const date2 = this.stack.getX();
        const date1 = this.stack.getY();
        const days = this.dates.daysBetween(date1, date2);
        this.stack.binaryOperation(() => days);
        this.updateDisplay();
    }
    
    calculateDATE() {
        const days = this.stack.getX();
        const startDate = this.stack.getY();
        const result = this.dates.addDays(startDate, days);
        // X = new date, Y = day of week
        this.stack.setX(result.date);
        this.stack.setY(result.dayOfWeek);
        this.updateDisplay();
    }
}
```

---

## 🧪 Test Plan

### Test File: `tests/date-functions.test.js`

#### Test Categories

1. **Date Format Mode (6 tests)**
   - Set D.MY format
   - Set M.DY format
   - Parse D.MY dates
   - Parse M.DY dates
   - Format persistence
   - Invalid format handling

2. **Date Validation (12 tests)**
   - Valid dates in both formats
   - Invalid month (13, 0, -1)
   - Invalid day (32, 0, -1)
   - Invalid year (1581, 10000)
   - February 29 in leap years
   - February 29 in non-leap years
   - Day 31 in 30-day months
   - Day 31 in February
   - Leap year detection (400, 100, 4 rules)
   - Historical dates
   - Future dates
   - Edge cases (Dec 31, Jan 1)

3. **Leap Year Calculation (8 tests)**
   - Divisible by 400 (2000, 2400)
   - Divisible by 100 not 400 (1900, 2100)
   - Divisible by 4 not 100 (2024, 2028)
   - Not divisible by 4 (2023, 2025)
   - Century boundaries
   - February 29 validation
   - Days in year calculations
   - Edge cases

4. **DYS Function (15 tests)**
   - Same date (0 days)
   - Sequential days (1 day)
   - One week (7 days)
   - One month (various)
   - One year (365/366)
   - Negative days (past dates)
   - Leap year crossing
   - Century boundary crossing
   - Date1 > Date2 (negative result)
   - Long time spans (decades)
   - Invalid date error handling
   - Format-independent results
   - Real-world examples (loan periods)
   - Month boundary crossing
   - Year boundary crossing

5. **DATE Function (15 tests)**
   - Add positive days
   - Add negative days
   - Add zero days
   - Month boundary crossing
   - Year boundary crossing
   - Leap year consideration
   - Day of week calculation
   - Large day counts
   - Century crossing
   - Invalid start date
   - Result validation
   - Real-world examples
   - Weekend calculation
   - Business day estimation
   - Holiday offsetting

6. **Day of Week Calculation (8 tests)**
   - Known dates (historical)
   - January 1, 2000 (Saturday)
   - Leap year Feb 29
   - Century boundaries
   - All weekdays (1-7)
   - Consistency with DATE function
   - Historical verification
   - Future dates

7. **Julian Day Number (8 tests)**
   - JDN calculation accuracy
   - Round-trip conversion (date→JDN→date)
   - Historical dates
   - Future dates
   - Leap year accuracy
   - Century boundaries
   - Known JDN values
   - Edge cases

8. **Integration Tests (10 tests)**
   - DYS with stack operations
   - DATE with stack operations
   - Format switching mid-calculation
   - LSTX preservation
   - Memory register interaction
   - Complex date calculations
   - Chain calculations
   - Error recovery
   - Real-world scenarios
   - Financial application

**Total Tests:** ~82 comprehensive test cases

### Test Examples

```javascript
describe('Date Functions - DYS', () => {
    test('calculates days between same-year dates', () => {
        calc.dates.setFormat('DMY');
        calc.stack.setY(01.012024);  // Jan 1, 2024
        calc.stack.setX(31.122024);  // Dec 31, 2024
        calc.calculateDYS();
        expect(calc.stack.getX()).toBe(366);  // 2024 is leap year
    });
    
    test('calculates negative days for past dates', () => {
        calc.stack.setY(15.072024);
        calc.stack.setX(15.072023);
        calc.calculateDYS();
        expect(calc.stack.getX()).toBe(-366);  // Going backward
    });
});

describe('Date Functions - DATE', () => {
    test('calculates date 90 days in future', () => {
        calc.stack.setY(01.012024);  // Jan 1, 2024
        calc.stack.setX(90);
        calc.calculateDATE();
        expect(calc.stack.getX()).toBe(31.032024);  // Mar 31, 2024
    });
    
    test('returns correct day of week', () => {
        calc.stack.setY(01.012024);  // Jan 1, 2024 (Monday)
        calc.stack.setX(90);
        calc.calculateDATE();
        calc.stack.swapXY();
        expect(calc.stack.getX()).toBe(7);  // Sunday
    });
});
```

---

## 📊 Success Criteria

### Functional Requirements
- ✅ D.MY format mode works correctly
- ✅ M.DY format mode works correctly
- ✅ Format mode persists and affects all date operations
- ✅ Date validation catches all invalid dates
- ✅ Leap year detection is accurate (400/100/4 rules)
- ✅ DYS calculates correct day counts (positive and negative)
- ✅ DATE calculates correct future/past dates
- ✅ Day of week calculation is accurate
- ✅ Julian Day Number conversions are precise
- ✅ All edge cases handled (leap years, centuries, boundaries)

### Testing Requirements
- ✅ Minimum 80 test cases (target: 82)
- ✅ 100% pass rate on all tests
- ✅ Edge case coverage (leap years, centuries, boundaries)
- ✅ Integration tests with stack operations
- ✅ Real-world financial calculation tests
- ✅ Error handling validation

### Documentation Requirements
- ✅ Date functions documented in implementation
- ✅ Format mode behavior explained
- ✅ Examples provided for each function
- ✅ PHASE9-PLAN.md comprehensive
- ✅ PHASE9-SUMMARY.md created
- ✅ README.md updated with date features
- ✅ TESTING.md updated with test counts

---

## 🎓 Implementation Notes

### Date Arithmetic Precision

The HP-12C uses the **Julian Day Number (JDN)** system for date calculations, which provides:
- Accurate day counting across any date range
- Proper leap year handling
- Century boundary accuracy
- Simple arithmetic (JDN2 - JDN1 = days)

### Calendar System

The calculator uses the **Gregorian calendar**, which:
- Started October 15, 1582
- Has leap year rules: divisible by 4, except centuries unless divisible by 400
- Is the internationally accepted civil calendar

### Performance Considerations

Date calculations should be:
- Fast (< 1ms for typical operations)
- Accurate (no floating-point errors)
- Validated (clear error messages for invalid dates)

### Error Handling

Invalid dates should display error and not corrupt stack:
```javascript
if (!isValidDate(day, month, year)) {
    this.display.showError('Invalid date');
    return;
}
```

---

## 💡 Real-World Applications

### Bond Calculations
- Calculate exact days between coupon payments
- Determine accrued interest periods
- Calculate yield to maturity

### Loan Analysis
- Determine payment dates
- Calculate time to maturity
- Project amortization schedules

### Financial Planning
- Calculate retirement dates
- Determine investment horizons
- Plan tax deadlines

### Business Operations
- Calculate invoice due dates
- Determine delivery schedules
- Plan project timelines

---

## 🔮 Future Enhancements (Beyond Phase 9)

### Actual/360 Day Count Convention
- Bond market standard
- 30/360 day count basis
- Actual/actual basis

### Business Day Calculations
- Skip weekends
- Skip holidays
- Custom calendars

### Date Ranges
- Expand valid range
- Support BCE dates
- Historical calendar modes

---

## 📈 Project Progression

| Phase | Features | Completion | Status |
|-------|----------|------------|--------|
| Phase 1-8 | Core features, TVM, scientific, stats, display | 90% | ✅ |
| **Phase 9** | **Date Functions** | **95%** | **📋 Planning** |
| Phase 10 | Programming, depreciation, bonds | 100% | 📋 Planned |

**After Phase 9:**
- Calculator will be 95% complete
- All major financial functions operational
- Only specialized features remain
- Production-ready for most use cases

---

## 🎯 Phase 9 Deliverables

1. **`js/date-functions.js`** - Complete date calculation engine
2. **`tests/date-functions.test.js`** - 82 comprehensive test cases
3. **Calculator integration** - Date function handlers
4. **Key metadata updates** - Document all date functions
5. **PHASE9-SUMMARY.md** - Implementation summary
6. **Updated documentation** - README.md, TESTING.md

---

**Let's build bulletproof date calculations! 📅**
