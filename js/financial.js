/**
 * HP-12C Financial Engine
 * Implements TVM, NPV, IRR, amortization, depreciation, and date functions
 */

class FinancialEngine {
    constructor() {
        // TVM registers (stored in memory R0-R4)
        this.n = 0;      // Number of periods
        this.i = 0;      // Interest rate per period (as %)
        this.pv = 0;     // Present Value
        this.pmt = 0;    // Payment
        this.fv = 0;     // Future Value
        
        // Payment mode: 0 = END (default), 1 = BEGIN
        this.beginMode = false;
        
        // Cash flow storage for NPV/IRR
        this.cashFlows = [];
        
        // Constants for Newton-Raphson solver
        this.MAX_ITERATIONS = 100;
        this.PRECISION = 1e-8;
    }

    /**
     * Store a TVM variable
     * @param {string} variable - Variable name (n, i, pv, pmt, fv)
     * @param {number} value - Value to store
     */
    store(variable, value) {
        switch(variable.toLowerCase()) {
            case 'n':
                this.n = value;
                break;
            case 'i':
                this.i = value;
                break;
            case 'pv':
                this.pv = value;
                break;
            case 'pmt':
                this.pmt = value;
                break;
            case 'fv':
                this.fv = value;
                break;
        }
    }

    /**
     * Recall a TVM variable
     * @param {string} variable - Variable name (n, i, pv, pmt, fv)
     * @returns {number} Value of the variable
     */
    recall(variable) {
        switch(variable.toLowerCase()) {
            case 'n': return this.n;
            case 'i': return this.i;
            case 'pv': return this.pv;
            case 'pmt': return this.pmt;
            case 'fv': return this.fv;
            default: return 0;
        }
    }

    /**
     * Calculate Present Value (PV)
     * @returns {number} Calculated PV
     */
    solvePV() {
        if (this.n === 0) {
            throw new Error('n must be non-zero');
        }

        const i_decimal = this.i / 100;
        
        // Special case: i = 0
        if (i_decimal === 0) {
            this.pv = -this.fv - (this.pmt * this.n);
            return this.pv;
        }

        const compound = Math.pow(1 + i_decimal, this.n);
        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        // PV = -FV / (1+i)^n - PMT * [(1 - (1+i)^-n) / i] * beginFactor
        this.pv = -this.fv / compound - 
                  this.pmt * ((1 - Math.pow(1 + i_decimal, -this.n)) / i_decimal) * beginFactor;
        
        return this.pv;
    }

    /**
     * Calculate Future Value (FV)
     * @returns {number} Calculated FV
     */
    solveFV() {
        if (this.n === 0) {
            throw new Error('n must be non-zero');
        }

        const i_decimal = this.i / 100;
        
        // Special case: i = 0
        if (i_decimal === 0) {
            this.fv = -this.pv - (this.pmt * this.n);
            return this.fv;
        }

        const compound = Math.pow(1 + i_decimal, this.n);
        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        // FV = -PV * (1+i)^n - PMT * [((1+i)^n - 1) / i] * beginFactor
        this.fv = -this.pv * compound - 
                  this.pmt * ((compound - 1) / i_decimal) * beginFactor;
        
        return this.fv;
    }

    /**
     * Calculate Payment (PMT)
     * @returns {number} Calculated PMT
     */
    solvePMT() {
        if (this.n === 0) {
            throw new Error('n must be non-zero');
        }

        const i_decimal = this.i / 100;
        
        // Special case: i = 0
        if (i_decimal === 0) {
            this.pmt = -(this.pv + this.fv) / this.n;
            return this.pmt;
        }

        const compound = Math.pow(1 + i_decimal, this.n);
        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        // PMT = -[PV * (1+i)^n + FV] * i / [((1+i)^n - 1) * beginFactor]
        this.pmt = -(this.pv * compound + this.fv) * i_decimal / 
                   ((compound - 1) * beginFactor);
        
        return this.pmt;
    }

    /**
     * Calculate Number of Periods (n)
     * Uses closed-form solution when PMT != 0, otherwise simple formula
     * @returns {number} Calculated n
     */
    solveN() {
        const i_decimal = this.i / 100;
        
        // Special case: i = 0
        if (i_decimal === 0) {
            if (this.pmt === 0) {
                throw new Error('Cannot solve: PMT and i are both zero');
            }
            this.n = -(this.pv + this.fv) / this.pmt;
            return this.n;
        }

        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        // Case 1: No payment (simple compound interest)
        if (this.pmt === 0) {
            if (this.pv === 0 || (this.fv / this.pv) > 0) {
                throw new Error('Cannot solve: invalid PV/FV relationship');
            }
            this.n = Math.log(-this.fv / this.pv) / Math.log(1 + i_decimal);
            return this.n;
        }
        
        // Case 2: With payments (annuity formula)
        // n = -log(1 - (FV + PV) * i / (PMT * beginFactor)) / log(1 + i)
        const ratio = (this.fv * i_decimal + this.pmt * beginFactor) / 
                     (this.pv * i_decimal + this.pmt * beginFactor);
        
        if (ratio <= 0) {
            throw new Error('Cannot solve: invalid payment relationship');
        }
        
        this.n = Math.log(ratio) / Math.log(1 + i_decimal);
        return this.n;
    }

    /**
     * Calculate Interest Rate (i)
     * Uses Newton-Raphson iterative method
     * @returns {number} Calculated i (as percentage)
     */
    solveI() {
        // Special case: n = 0
        if (this.n === 0) {
            throw new Error('n must be non-zero');
        }

        // Special case: simple interest (no payment)
        if (this.pmt === 0) {
            if (this.pv === 0) {
                throw new Error('Cannot solve: PV is zero');
            }
            const rate = Math.pow(-this.fv / this.pv, 1 / this.n) - 1;
            this.i = rate * 100;
            return this.i;
        }

        // Use Newton-Raphson method for annuity
        let i_guess = 0.1; // Start with 10% interest rate
        
        for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
            const result = this.tvmFunction(i_guess);
            const derivative = this.tvmDerivative(i_guess);
            
            if (Math.abs(derivative) < 1e-10) {
                throw new Error('Cannot solve: derivative too small');
            }
            
            const i_new = i_guess - result / derivative;
            
            // Check for convergence
            if (Math.abs(i_new - i_guess) < this.PRECISION) {
                this.i = i_new * 100;
                return this.i;
            }
            
            i_guess = i_new;
            
            // Ensure rate stays reasonable
            if (i_guess < -0.99 || i_guess > 100) {
                throw new Error('Interest rate out of reasonable bounds');
            }
        }
        
        throw new Error('Failed to converge on interest rate');
    }

    /**
     * TVM equation function for Newton-Raphson
     * f(i) = PV*(1+i)^n + PMT*[(1+i)^n - 1]/i * beginFactor + FV = 0
     * @param {number} i_decimal - Interest rate as decimal
     * @returns {number} Function value
     */
    tvmFunction(i_decimal) {
        if (Math.abs(i_decimal) < 1e-10) {
            // For very small interest rates, use linear approximation
            return this.pv + this.pmt * this.n + this.fv;
        }
        
        const compound = Math.pow(1 + i_decimal, this.n);
        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        return this.pv * compound + 
               this.pmt * ((compound - 1) / i_decimal) * beginFactor + 
               this.fv;
    }

    /**
     * Derivative of TVM equation for Newton-Raphson
     * f'(i) = n*PV*(1+i)^(n-1) + PMT*[n*(1+i)^(n-1)*i - (1+i)^n + 1]/i^2 * beginFactor
     * @param {number} i_decimal - Interest rate as decimal
     * @returns {number} Derivative value
     */
    tvmDerivative(i_decimal) {
        if (Math.abs(i_decimal) < 1e-10) {
            // For very small interest rates, use approximation
            return this.pv * this.n + this.pmt * this.n * (this.n - 1) / 2;
        }
        
        const compound = Math.pow(1 + i_decimal, this.n);
        const compoundMinus1 = Math.pow(1 + i_decimal, this.n - 1);
        const beginFactor = this.beginMode ? (1 + i_decimal) : 1;
        
        const pvTerm = this.n * this.pv * compoundMinus1;
        const pmtTerm = this.pmt * 
                       ((this.n * compoundMinus1 * i_decimal - compound + 1) / 
                        (i_decimal * i_decimal)) * beginFactor;
        
        return pvTerm + pmtTerm;
    }

    /**
     * Set payment mode (BEGIN or END)
     * @param {boolean} begin - true for BEGIN mode, false for END mode
     */
    setBeginMode(begin) {
        this.beginMode = begin;
    }

    /**
     * Get payment mode
     * @returns {boolean} true if BEGIN mode, false if END mode
     */
    getBeginMode() {
        return this.beginMode;
    }

    /**
     * Calculate percentage (% function)
     * Y = base, X = percentage -> Result = Y * (X / 100)
     * @param {number} base - Base value (Y register)
     * @param {number} percentage - Percentage value (X register)
     * @returns {number} Calculated percentage
     */
    calculatePercent(base, percentage) {
        return base * (percentage / 100);
    }

    /**
     * Calculate delta percentage (Δ% function)
     * Y = old value, X = new value -> Result = ((X - Y) / Y) * 100
     * @param {number} oldValue - Old value (Y register)
     * @param {number} newValue - New value (X register)
     * @returns {number} Percentage change
     */
    calculateDeltaPercent(oldValue, newValue) {
        if (oldValue === 0) {
            throw new Error('Error 0');
        }
        return ((newValue - oldValue) / oldValue) * 100;
    }

    /**
     * Calculate percent of total (%T function)
     * Y = total, X = part -> Result = (X / Y) * 100
     * @param {number} total - Total value (Y register)
     * @param {number} part - Part value (X register)
     * @returns {number} Percentage of total
     */
    calculatePercentTotal(total, part) {
        if (total === 0) {
            throw new Error('Error 0');
        }
        return (part / total) * 100;
    }

    /**
     * Add to cash flow register for NPV/IRR
     * @param {number} value - Cash flow value
     */
    addCashFlow(value) {
        this.cashFlows.push(value);
    }

    /**
     * Clear cash flows
     */
    clearCashFlows() {
        this.cashFlows = [];
    }

    /**
     * Calculate Net Present Value (NPV)
     * @param {number} rate - Discount rate (as percentage)
     * @returns {number} NPV
     */
    calculateNPV(rate) {
        if (this.cashFlows.length === 0) {
            return 0;
        }
        
        const i_decimal = rate / 100;
        let npv = this.cashFlows[0]; // CF0 is not discounted
        
        for (let t = 1; t < this.cashFlows.length; t++) {
            npv += this.cashFlows[t] / Math.pow(1 + i_decimal, t);
        }
        
        return npv;
    }

    /**
     * Calculate Internal Rate of Return (IRR)
     * Uses Newton-Raphson method
     * @returns {number} IRR (as percentage)
     */
    calculateIRR() {
        if (this.cashFlows.length < 2) {
            throw new Error('Need at least 2 cash flows');
        }
        
        let rate = 0.1; // Start with 10%
        
        for (let iter = 0; iter < this.MAX_ITERATIONS; iter++) {
            const npv = this.npvFunction(rate);
            const derivative = this.npvDerivative(rate);
            
            if (Math.abs(derivative) < 1e-10) {
                throw new Error('Cannot solve IRR');
            }
            
            const rate_new = rate - npv / derivative;
            
            if (Math.abs(rate_new - rate) < this.PRECISION) {
                return rate_new * 100;
            }
            
            rate = rate_new;
            
            // Keep rate reasonable
            if (rate < -0.99 || rate > 100) {
                throw new Error('IRR out of reasonable bounds');
            }
        }
        
        throw new Error('Failed to converge on IRR');
    }

    /**
     * NPV function for IRR calculation
     * @param {number} rate - Discount rate as decimal
     * @returns {number} NPV at given rate
     */
    npvFunction(rate) {
        let npv = this.cashFlows[0];
        
        for (let t = 1; t < this.cashFlows.length; t++) {
            npv += this.cashFlows[t] / Math.pow(1 + rate, t);
        }
        
        return npv;
    }

    /**
     * Derivative of NPV function for IRR calculation
     * @param {number} rate - Discount rate as decimal
     * @returns {number} Derivative value
     */
    npvDerivative(rate) {
        let derivative = 0;
        
        for (let t = 1; t < this.cashFlows.length; t++) {
            derivative -= t * this.cashFlows[t] / Math.pow(1 + rate, t + 1);
        }
        
        return derivative;
    }

    /**
     * Clear all financial registers
     */
    clear() {
        this.n = 0;
        this.i = 0;
        this.pv = 0;
        this.pmt = 0;
        this.fv = 0;
        this.clearCashFlows();
    }

    /**
     * Get state for debugging/display
     * @returns {object} Financial engine state
     */
    getState() {
        return {
            n: this.n,
            i: this.i,
            pv: this.pv,
            pmt: this.pmt,
            fv: this.fv,
            beginMode: this.beginMode,
            cashFlows: [...this.cashFlows]
        };
    }

    /**
     * Set state (for loading saved state)
     * @param {object} state - State object
     */
    setState(state) {
        if (state) {
            this.n = state.n || 0;
            this.i = state.i || 0;
            this.pv = state.pv || 0;
            this.pmt = state.pmt || 0;
            this.fv = state.fv || 0;
            this.beginMode = state.beginMode || false;
            this.cashFlows = state.cashFlows || [];
        }
    }
}

// Export for Node.js/Jest (browser compatibility maintained)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialEngine;
}
