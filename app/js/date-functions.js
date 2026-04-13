/**
 * HP-12C Date Functions Engine
 * 
 * Handles calendar calculations, date arithmetic, and format conversions.
 * Implements HP-12C date functions: DYS (days between dates) and DATE (future/past date).
 * 
 * Date Format:
 * - D.MY (Day.Month.Year): DD.MMYYYY - European/International format
 * - M.DY (Month.Day.Year): MM.DDYYYY - US format
 * 
 * Key Functions:
 * - g 4: Set D.MY format
 * - g 5: Set M.DY format
 * - g EEX: ΔDYS - Calculate days between two dates
 * - g CHS: DATE - Calculate date N days from start date
 * 
 * @module date-functions
 */

class DateFunctions {
    constructor() {
        /**
         * Current date format mode
         * @type {'DMY'|'MDY'}
         */
        this.dateFormat = 'DMY';  // Default to European format (D.MY)
        
        /**
         * Valid date range limits
         */
        this.minYear = 1582;  // Gregorian calendar adoption (October 15, 1582)
        this.maxYear = 9999;  // Practical upper limit
        
        /**
         * Days in each month (non-leap year)
         */
        this.daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    
    /**
     * Set date format mode
     * @param {'DMY'|'MDY'} format - Date format to use
     */
    setFormat(format) {
        if (format !== 'DMY' && format !== 'MDY') {
            throw new Error('Invalid date format. Must be DMY or MDY.');
        }
        this.dateFormat = format;
    }
    
    /**
     * Get current date format
     * @returns {'DMY'|'MDY'} Current format
     */
    getFormat() {
        return this.dateFormat;
    }
    
    /**
     * Check if year is a leap year
     * Rules:
     * - Divisible by 400: leap year
     * - Divisible by 100 but not 400: not leap year
     * - Divisible by 4 but not 100: leap year
     * - Otherwise: not leap year
     * 
     * @param {number} year - Year to check
     * @returns {boolean} True if leap year
     */
    isLeapYear(year) {
        if (year % 400 === 0) return true;
        if (year % 100 === 0) return false;
        if (year % 4 === 0) return true;
        return false;
    }
    
    /**
     * Get number of days in a month
     * @param {number} month - Month (1-12)
     * @param {number} year - Year (for leap year calculation)
     * @returns {number} Days in month (28-31)
     */
    daysInMonth(month, year) {
        if (month < 1 || month > 12) {
            return 0;
        }
        
        const days = this.daysPerMonth[month - 1];
        
        // Adjust February for leap years
        if (month === 2 && this.isLeapYear(year)) {
            return 29;
        }
        
        return days;
    }
    
    /**
     * Validate date components
     * @param {number} day - Day of month (1-31)
     * @param {number} month - Month (1-12)
     * @param {number} year - Year (1582-9999)
     * @returns {boolean} True if date is valid
     */
    isValidDate(day, month, year) {
        // Check year range
        if (year < this.minYear || year > this.maxYear) {
            return false;
        }
        
        // Check month range
        if (month < 1 || month > 12) {
            return false;
        }
        
        // Check day range
        if (day < 1) {
            return false;
        }
        
        const maxDay = this.daysInMonth(month, year);
        if (day > maxDay) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Parse date from decimal format
     * Format depends on current dateFormat setting:
     * - DMY: DD.MMYYYY (e.g., 25.121985 = December 25, 1985)
     * - MDY: MM.DDYYYY (e.g., 12.251985 = December 25, 1985)
     *
     * @param {number} dateValue - Date as decimal number
     * @returns {{day: number, month: number, year: number, isValid: boolean, error?: string}}
     */
    parseDate(dateValue) {
        // Convert to string to parse parts
        const str = dateValue.toString();
        const parts = str.split('.');
        
        if (parts.length !== 2) {
            return { day: 0, month: 0, year: 0, isValid: false, error: 'Invalid date format' };
        }
        
        const firstPart = parseInt(parts[0], 10);
        let secondPart = parts[1];
        
        // Pad second part if needed (for dates like 1.012000 which becomes 1.012)
        // We need at least 6 digits for MMYYYY format
        if (secondPart.length < 6) {
            secondPart = secondPart.padEnd(6, '0');
        }
        
        // Extract month/day and year from second part
        // Format: MMYYYY or DDYYYY (6+ digits)
        let secondDigit, yearPart;
        
        if (secondPart.length >= 6) {
            // Full format: MMYYYY or DDYYYY
            secondDigit = parseInt(secondPart.substring(0, 2), 10);
            yearPart = parseInt(secondPart.substring(2, 6), 10);
        } else if (secondPart.length === 5) {
            // Single digit + 4-digit year: M.DYYYY or D.MYYYY
            secondDigit = parseInt(secondPart.substring(0, 1), 10);
            yearPart = parseInt(secondPart.substring(1, 5), 10);
        } else if (secondPart.length === 4) {
            // Two-digit year: MMYY or DDYY
            secondDigit = parseInt(secondPart.substring(0, 2), 10);
            const yy = parseInt(secondPart.substring(2, 4), 10);
            // Interpret as 19YY or 20YY (pivot at 50)
            yearPart = yy < 50 ? 2000 + yy : 1900 + yy;
        } else if (secondPart.length === 3) {
            // Single digit + 2-digit year
            secondDigit = parseInt(secondPart.substring(0, 1), 10);
            const yy = parseInt(secondPart.substring(1, 3), 10);
            yearPart = yy < 50 ? 2000 + yy : 1900 + yy;
        } else {
            return { day: 0, month: 0, year: 0, isValid: false, error: 'Invalid date format' };
        }
        
        let day, month, year;
        
        if (this.dateFormat === 'DMY') {
            // D.MY format: day.monthyear
            day = firstPart;
            month = secondDigit;
            year = yearPart;
        } else {
            // MDY format: month.dayyear
            month = firstPart;
            day = secondDigit;
            year = yearPart;
        }
        
        const isValid = this.isValidDate(day, month, year);
        
        if (!isValid) {
            return { day, month, year, isValid: false, error: 'Invalid date' };
        }
        
        return { day, month, year, isValid: true };
    }
    
    /**
     * Format date to decimal format
     * @param {number} day - Day of month
     * @param {number} month - Month (1-12)
     * @param {number} year - Year
     * @returns {number} Date as decimal number
     */
    formatDate(day, month, year) {
        if (this.dateFormat === 'DMY') {
            // D.MY format: DD.MMYYYY
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = year.toString().padStart(4, '0');
            return parseFloat(`${day}.${monthStr}${yearStr}`);
        } else {
            // MDY format: MM.DDYYYY
            const dayStr = day.toString().padStart(2, '0');
            const yearStr = year.toString().padStart(4, '0');
            return parseFloat(`${month}.${dayStr}${yearStr}`);
        }
    }
    
    /**
     * Convert date to Julian Day Number (JDN)
     * Uses the standard JDN algorithm for accurate date arithmetic
     * 
     * @param {number} day - Day of month
     * @param {number} month - Month (1-12)
     * @param {number} year - Year
     * @returns {number} Julian Day Number
     */
    dateToJDN(day, month, year) {
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        
        const jdn = day + 
                    Math.floor((153 * m + 2) / 5) + 
                    365 * y + 
                    Math.floor(y / 4) - 
                    Math.floor(y / 100) + 
                    Math.floor(y / 400) - 
                    32045;
        
        return jdn;
    }
    
    /**
     * Convert Julian Day Number to date
     * @param {number} jdn - Julian Day Number
     * @returns {{day: number, month: number, year: number}}
     */
    jdnToDate(jdn) {
        const a = jdn + 32044;
        const b = Math.floor((4 * a + 3) / 146097);
        const c = a - Math.floor((146097 * b) / 4);
        const d = Math.floor((4 * c + 3) / 1461);
        const e = c - Math.floor((1461 * d) / 4);
        const m = Math.floor((5 * e + 2) / 153);
        
        const day = e - Math.floor((153 * m + 2) / 5) + 1;
        const month = m + 3 - 12 * Math.floor(m / 10);
        const year = 100 * b + d - 4800 + Math.floor(m / 10);
        
        return { day, month, year };
    }
    
    /**
     * Calculate day of week
     * Uses JDN modulo 7
     * @param {number} day - Day of month
     * @param {number} month - Month (1-12)
     * @param {number} year - Year
     * @returns {number} Day of week (1=Monday, 7=Sunday)
     */
    dayOfWeek(day, month, year) {
        const jdn = this.dateToJDN(day, month, year);
        // JDN % 7: 0=Monday, 6=Sunday
        // Adjust to HP-12C convention: 1=Monday, 7=Sunday
        const dow = (jdn % 7) + 1;
        return dow === 8 ? 1 : dow;
    }
    
    /**
     * Calculate days between two dates (ΔDYS function)
     * HP-12C: g EEX
     * 
     * Stack behavior:
     * - Y: date1 (earlier date typically)
     * - X: date2 (later date typically)
     * - Result: days from date1 to date2 (positive if date2 > date1)
     * 
     * @param {number} date1Value - First date (decimal format)
     * @param {number} date2Value - Second date (decimal format)
     * @returns {{days: number, error?: string}} Number of days (positive or negative)
     */
    daysBetween(date1Value, date2Value) {
        const date1 = this.parseDate(date1Value);
        const date2 = this.parseDate(date2Value);
        
        if (!date1.isValid) {
            return { days: 0, error: date1.error || 'Invalid first date' };
        }
        
        if (!date2.isValid) {
            return { days: 0, error: date2.error || 'Invalid second date' };
        }
        
        const jdn1 = this.dateToJDN(date1.day, date1.month, date1.year);
        const jdn2 = this.dateToJDN(date2.day, date2.month, date2.year);
        
        const days = jdn2 - jdn1;
        
        return { days };
    }
    
    /**
     * Calculate future or past date (DATE function)
     * HP-12C: g CHS
     * 
     * Stack behavior:
     * - Y: start date
     * - X: number of days to add (positive=future, negative=past)
     * - Result X: new date
     * - Result Y: day of week (1=Monday, 7=Sunday)
     * 
     * @param {number} dateValue - Starting date (decimal format)
     * @param {number} days - Number of days to add (can be negative)
     * @returns {{date: number, dayOfWeek: number, error?: string}}
     */
    addDays(dateValue, days) {
        const startDate = this.parseDate(dateValue);
        
        if (!startDate.isValid) {
            return { date: 0, dayOfWeek: 0, error: startDate.error || 'Invalid start date' };
        }
        
        // Convert to JDN, add days, convert back
        const startJDN = this.dateToJDN(startDate.day, startDate.month, startDate.year);
        const newJDN = startJDN + Math.floor(days);
        
        const newDate = this.jdnToDate(newJDN);
        
        // Validate result
        if (!this.isValidDate(newDate.day, newDate.month, newDate.year)) {
            return { date: 0, dayOfWeek: 0, error: 'Result date out of range' };
        }
        
        // Calculate day of week
        const dow = this.dayOfWeek(newDate.day, newDate.month, newDate.year);
        
        // Format result
        const formattedDate = this.formatDate(newDate.day, newDate.month, newDate.year);
        
        return { date: formattedDate, dayOfWeek: dow };
    }
    
    /**
     * Get current system date
     * @returns {number} Current date in active format
     */
    getCurrentDate() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;  // JavaScript months are 0-11
        const year = now.getFullYear();
        
        return this.formatDate(day, month, year);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateFunctions;
}
