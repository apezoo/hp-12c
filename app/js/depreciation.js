/**
 * HP-12C Depreciation Engine
 * Implements three standard depreciation methods:
 * - SL (Straight Line)
 * - DB (Declining Balance)
 * - SOYD (Sum of Years' Digits)
 */

class DepreciationEngine {
    constructor() {
        // Depreciation state for display
        this.lastDepreciation = 0;
        this.lastRemainingValue = 0;
        this.method = null;
    }

    /**
     * Calculate Straight Line Depreciation
     * Formula: (Cost - Salvage) / Life
     * 
     * @param {number} cost - Original cost of asset
     * @param {number} salvage - Salvage/residual value at end of life
     * @param {number} life - Total useful life in periods
     * @param {number} period - Period to calculate depreciation for
     * @returns {object} { depreciation, remainingValue }
     */
    straightLine(cost, salvage, life, period) {
        // Validation
        if (life <= 0) {
            throw new Error('Error 5: Life must be positive');
        }
        if (period < 1 || period > life) {
            throw new Error('Error 3: Period must be between 1 and life');
        }
        if (cost < salvage) {
            throw new Error('Error 5: Cost must be >= salvage value');
        }

        // Calculate annual depreciation (same for all periods)
        const annualDepreciation = (cost - salvage) / life;
        
        // Calculate remaining depreciable value after this period
        const totalDepreciated = annualDepreciation * period;
        const remainingValue = cost - totalDepreciated;
        
        // Store for display
        this.lastDepreciation = annualDepreciation;
        this.lastRemainingValue = remainingValue;
        this.method = 'SL';
        
        return {
            depreciation: annualDepreciation,
            remainingValue: remainingValue,
            bookValue: remainingValue // Same as remaining value for SL
        };
    }

    /**
     * Calculate Declining Balance Depreciation
     * Formula: Book Value × (Factor / Life)
     * Common factors: 1.5 (150% DB), 2.0 (200% DB, double declining)
     * 
     * @param {number} cost - Original cost of asset
     * @param {number} salvage - Salvage/residual value at end of life
     * @param {number} life - Total useful life in periods
     * @param {number} period - Period to calculate depreciation for
     * @param {number} factor - Declining balance factor (e.g., 2 for 200% DB)
     * @returns {object} { depreciation, bookValue, remainingValue }
     */
    decliningBalance(cost, salvage, life, period, factor = 2.0) {
        // Validation
        if (life <= 0) {
            throw new Error('Error 5: Life must be positive');
        }
        if (period < 1 || period > life) {
            throw new Error('Error 3: Period must be between 1 and life');
        }
        if (cost < salvage) {
            throw new Error('Error 5: Cost must be >= salvage value');
        }
        if (factor <= 0) {
            throw new Error('Error 5: Factor must be positive');
        }

        // Calculate depreciation rate
        const rate = factor / life;
        
        // Calculate book value at start of period
        let bookValue = cost;
        for (let p = 1; p < period; p++) {
            const depreciation = bookValue * rate;
            bookValue = bookValue - depreciation;
            
            // Don't depreciate below salvage value
            if (bookValue < salvage) {
                bookValue = salvage;
                break;
            }
        }
        
        // Calculate depreciation for this period
        let depreciation = bookValue * rate;
        
        // Ensure we don't go below salvage value
        if (bookValue - depreciation < salvage) {
            depreciation = bookValue - salvage;
        }
        
        // New book value after depreciation
        const newBookValue = bookValue - depreciation;
        
        // Store for display
        this.lastDepreciation = depreciation;
        this.lastRemainingValue = newBookValue;
        this.method = 'DB';
        
        return {
            depreciation: depreciation,
            bookValue: newBookValue,
            remainingValue: newBookValue
        };
    }

    /**
     * Calculate Sum of Years' Digits Depreciation
     * Formula: (Cost - Salvage) × (Remaining Life / SYD)
     * where SYD = n × (n + 1) / 2
     * 
     * @param {number} cost - Original cost of asset
     * @param {number} salvage - Salvage/residual value at end of life
     * @param {number} life - Total useful life in periods
     * @param {number} period - Period to calculate depreciation for
     * @returns {object} { depreciation, remainingValue }
     */
    sumOfYearsDigits(cost, salvage, life, period) {
        // Validation
        if (life <= 0) {
            throw new Error('Error 5: Life must be positive');
        }
        if (period < 1 || period > life) {
            throw new Error('Error 3: Period must be between 1 and life');
        }
        if (cost < salvage) {
            throw new Error('Error 5: Cost must be >= salvage value');
        }

        // Calculate sum of years' digits
        const soyd = (life * (life + 1)) / 2;
        
        // Calculate remaining life at start of this period
        const remainingLife = life - period + 1;
        
        // Calculate depreciation for this period
        const depreciableAmount = cost - salvage;
        const depreciation = depreciableAmount * (remainingLife / soyd);
        
        // Calculate total depreciation through this period
        let totalDepreciation = 0;
        for (let p = 1; p <= period; p++) {
            const remLife = life - p + 1;
            totalDepreciation += depreciableAmount * (remLife / soyd);
        }
        
        // Calculate remaining value
        const remainingValue = cost - totalDepreciation;
        
        // Store for display
        this.lastDepreciation = depreciation;
        this.lastRemainingValue = remainingValue;
        this.method = 'SOYD';
        
        return {
            depreciation: depreciation,
            remainingValue: remainingValue,
            bookValue: remainingValue
        };
    }

    /**
     * Get last depreciation calculation
     * @returns {number} Last depreciation amount
     */
    getLastDepreciation() {
        return this.lastDepreciation;
    }

    /**
     * Get last remaining value
     * @returns {number} Last remaining value
     */
    getLastRemainingValue() {
        return this.lastRemainingValue;
    }

    /**
     * Get depreciation state
     * @returns {object} State object
     */
    getState() {
        return {
            lastDepreciation: this.lastDepreciation,
            lastRemainingValue: this.lastRemainingValue,
            method: this.method
        };
    }

    /**
     * Clear depreciation state
     */
    clear() {
        this.lastDepreciation = 0;
        this.lastRemainingValue = 0;
        this.method = null;
    }
}

// Export for Node.js/Jest (browser compatibility maintained)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DepreciationEngine;
}
