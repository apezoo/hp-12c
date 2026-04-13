/**
 * HP-12C Statistics Engine
 * Implements statistical functions: Σ+, Σ-, x̄, s, ŷ,r, x̂,r
 * 
 * Statistical registers (stored in memory R1-R6):
 * R1 = n (sample count)
 * R2 = Σx (sum of x values)
 * R3 = Σx² (sum of x squared)
 * R4 = Σy (sum of y values)
 * R5 = Σy² (sum of y squared)
 * R6 = Σxy (sum of x*y products)
 */

class StatisticsEngine {
    constructor(memory) {
        // Reference to memory manager for accessing statistical registers
        this.memory = memory;
        
        // Register mapping (HP-12C uses R1-R6 for statistics)
        this.REG_N = 1;      // Sample count
        this.REG_SUM_X = 2;  // Σx
        this.REG_SUM_X2 = 3; // Σx²
        this.REG_SUM_Y = 4;  // Σy
        this.REG_SUM_Y2 = 5; // Σy²
        this.REG_SUM_XY = 6; // Σxy
    }

    /**
     * Σ+ (Sigma Plus) - Add data point to statistical registers
     * Uses X for single-variable statistics
     * Uses Y, X for two-variable (regression) statistics
     * @param {number} x - X value (from stack X register)
     * @param {number} y - Y value (from stack Y register)
     * @returns {number} New sample count (n)
     */
    sigmaPlus(x, y) {
        // Get current values
        const n = this.memory.recall(this.REG_N);
        const sumX = this.memory.recall(this.REG_SUM_X);
        const sumX2 = this.memory.recall(this.REG_SUM_X2);
        const sumY = this.memory.recall(this.REG_SUM_Y);
        const sumY2 = this.memory.recall(this.REG_SUM_Y2);
        const sumXY = this.memory.recall(this.REG_SUM_XY);
        
        // Update statistical registers
        this.memory.store(this.REG_N, n + 1);
        this.memory.store(this.REG_SUM_X, sumX + x);
        this.memory.store(this.REG_SUM_X2, sumX2 + (x * x));
        this.memory.store(this.REG_SUM_Y, sumY + y);
        this.memory.store(this.REG_SUM_Y2, sumY2 + (y * y));
        this.memory.store(this.REG_SUM_XY, sumXY + (x * y));
        
        return n + 1;
    }

    /**
     * Σ- (Sigma Minus) - Remove data point from statistical registers
     * Used to correct data entry errors
     * @param {number} x - X value to remove
     * @param {number} y - Y value to remove
     * @returns {number} New sample count (n)
     */
    sigmaMinus(x, y) {
        // Get current values
        const n = this.memory.recall(this.REG_N);
        
        // Error checking: can't remove from empty data set
        if (n === 0) {
            throw new Error('No data to remove');
        }
        
        const sumX = this.memory.recall(this.REG_SUM_X);
        const sumX2 = this.memory.recall(this.REG_SUM_X2);
        const sumY = this.memory.recall(this.REG_SUM_Y);
        const sumY2 = this.memory.recall(this.REG_SUM_Y2);
        const sumXY = this.memory.recall(this.REG_SUM_XY);
        
        // Update statistical registers (subtract values)
        this.memory.store(this.REG_N, n - 1);
        this.memory.store(this.REG_SUM_X, sumX - x);
        this.memory.store(this.REG_SUM_X2, sumX2 - (x * x));
        this.memory.store(this.REG_SUM_Y, sumY - y);
        this.memory.store(this.REG_SUM_Y2, sumY2 - (y * y));
        this.memory.store(this.REG_SUM_XY, sumXY - (x * y));
        
        return n - 1;
    }

    /**
     * x̄ (Mean) - Calculate arithmetic mean (average) of x values
     * @returns {number} Mean of x values
     */
    mean() {
        const n = this.memory.recall(this.REG_N);
        
        if (n === 0) {
            throw new Error('Insufficient data for mean calculation');
        }
        
        const sumX = this.memory.recall(this.REG_SUM_X);
        return sumX / n;
    }

    /**
     * ȳ (Y Mean) - Calculate mean of y values
     * @returns {number} Mean of y values
     */
    meanY() {
        const n = this.memory.recall(this.REG_N);
        
        if (n === 0) {
            throw new Error('Insufficient data for mean calculation');
        }
        
        const sumY = this.memory.recall(this.REG_SUM_Y);
        return sumY / n;
    }

    /**
     * s (Sample Standard Deviation) - Calculate standard deviation
     * Uses n-1 formula (sample standard deviation)
     * @returns {number} Sample standard deviation of x values
     */
    standardDeviation() {
        const n = this.memory.recall(this.REG_N);
        
        if (n < 2) {
            throw new Error('Insufficient data for standard deviation (need at least 2 points)');
        }
        
        const sumX = this.memory.recall(this.REG_SUM_X);
        const sumX2 = this.memory.recall(this.REG_SUM_X2);
        
        // Sample standard deviation formula: s = sqrt[(Σx² - (Σx)²/n) / (n-1)]
        const variance = (sumX2 - (sumX * sumX) / n) / (n - 1);
        
        if (variance < 0) {
            // Handle numerical rounding errors
            return 0;
        }
        
        return Math.sqrt(variance);
    }

    /**
     * sY (Y Standard Deviation) - Calculate standard deviation of y values
     * @returns {number} Sample standard deviation of y values
     */
    standardDeviationY() {
        const n = this.memory.recall(this.REG_N);
        
        if (n < 2) {
            throw new Error('Insufficient data for standard deviation (need at least 2 points)');
        }
        
        const sumY = this.memory.recall(this.REG_SUM_Y);
        const sumY2 = this.memory.recall(this.REG_SUM_Y2);
        
        const variance = (sumY2 - (sumY * sumY) / n) / (n - 1);
        
        if (variance < 0) {
            return 0;
        }
        
        return Math.sqrt(variance);
    }

    /**
     * Calculate linear regression coefficients
     * y = a + bx where:
     * b = [n·Σxy - Σx·Σy] / [n·Σx² - (Σx)²]
     * a = ȳ - b·x̄
     * @returns {object} {slope: b, intercept: a}
     */
    calculateLinearRegression() {
        const n = this.memory.recall(this.REG_N);
        
        if (n < 2) {
            throw new Error('Insufficient data for linear regression (need at least 2 points)');
        }
        
        const sumX = this.memory.recall(this.REG_SUM_X);
        const sumX2 = this.memory.recall(this.REG_SUM_X2);
        const sumY = this.memory.recall(this.REG_SUM_Y);
        const sumY2 = this.memory.recall(this.REG_SUM_Y2);
        const sumXY = this.memory.recall(this.REG_SUM_XY);
        
        // Calculate slope (b)
        const numerator = n * sumXY - sumX * sumY;
        const denominator = n * sumX2 - sumX * sumX;
        
        if (denominator === 0) {
            throw new Error('Cannot perform linear regression (vertical line)');
        }
        
        const slope = numerator / denominator;
        
        // Calculate intercept (a)
        const meanX = sumX / n;
        const meanY = sumY / n;
        const intercept = meanY - slope * meanX;
        
        return { slope, intercept };
    }

    /**
     * r (Correlation Coefficient) - Calculate Pearson correlation
     * r = [n·Σxy - Σx·Σy] / sqrt([n·Σx² - (Σx)²]·[n·Σy² - (Σy)²])
     * @returns {number} Correlation coefficient (-1 to 1)
     */
    correlationCoefficient() {
        const n = this.memory.recall(this.REG_N);
        
        if (n < 2) {
            throw new Error('Insufficient data for correlation (need at least 2 points)');
        }
        
        const sumX = this.memory.recall(this.REG_SUM_X);
        const sumX2 = this.memory.recall(this.REG_SUM_X2);
        const sumY = this.memory.recall(this.REG_SUM_Y);
        const sumY2 = this.memory.recall(this.REG_SUM_Y2);
        const sumXY = this.memory.recall(this.REG_SUM_XY);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominatorX = n * sumX2 - sumX * sumX;
        const denominatorY = n * sumY2 - sumY * sumY;
        
        if (denominatorX <= 0 || denominatorY <= 0) {
            throw new Error('Cannot calculate correlation (zero variance)');
        }
        
        const r = numerator / Math.sqrt(denominatorX * denominatorY);
        
        // Clamp to [-1, 1] to handle numerical errors
        return Math.max(-1, Math.min(1, r));
    }

    /**
     * ŷ,r (Y-estimate, Correlation) - Estimate y given x using linear regression
     * Returns both the estimated y value and correlation coefficient
     * @param {number} x - X value for estimation
     * @returns {object} {yEstimate: ŷ, correlation: r}
     */
    estimateY(x) {
        const { slope, intercept } = this.calculateLinearRegression();
        const r = this.correlationCoefficient();
        
        const yEstimate = intercept + slope * x;
        
        return { yEstimate, correlation: r };
    }

    /**
     * x̂,r (X-estimate, Correlation) - Estimate x given y using linear regression
     * Uses inverse of y = a + bx, so x = (y - a) / b
     * Returns both the estimated x value and correlation coefficient
     * @param {number} y - Y value for estimation
     * @returns {object} {xEstimate: x̂, correlation: r}
     */
    estimateX(y) {
        const { slope, intercept } = this.calculateLinearRegression();
        const r = this.correlationCoefficient();
        
        if (slope === 0) {
            throw new Error('Cannot estimate x (horizontal line)');
        }
        
        const xEstimate = (y - intercept) / slope;
        
        return { xEstimate, correlation: r };
    }

    /**
     * Clear all statistical registers
     */
    clear() {
        this.memory.store(this.REG_N, 0);
        this.memory.store(this.REG_SUM_X, 0);
        this.memory.store(this.REG_SUM_X2, 0);
        this.memory.store(this.REG_SUM_Y, 0);
        this.memory.store(this.REG_SUM_Y2, 0);
        this.memory.store(this.REG_SUM_XY, 0);
    }

    /**
     * Get current sample count
     * @returns {number} Number of data points
     */
    getCount() {
        return this.memory.recall(this.REG_N);
    }
}

// Node.js/testing environment export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatisticsEngine;
}
