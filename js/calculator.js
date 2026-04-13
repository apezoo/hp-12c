/**
 * HP-12C Calculator Controller
 * Main controller coordinating all calculator components
 */

// Node.js/testing environment requires
if (typeof require !== 'undefined') {
    var RPNStack = require('./rpn-stack.js');
    var DisplayManager = require('./display.js');
    var MemoryManager = require('./memory.js');
    var FinancialEngine = require('./financial.js');
    var StatisticsEngine = require('./statistics.js');
    var DateFunctions = require('./date-functions.js');
    var DepreciationEngine = require('./depreciation.js');
}

class Calculator {
    constructor() {
        this.stack = new RPNStack();
        this.display = new DisplayManager();
        this.memory = new MemoryManager();
        this.financial = new FinancialEngine();
        this.statistics = new StatisticsEngine(this.memory);
        this.dates = new DateFunctions();
        this.depreciation = new DepreciationEngine();
        
        // Input state
        this.currentInput = '';
        this.isNewNumber = true;
        this.hasDecimal = false;
        this.isExponent = false;
        
        // Register input state
        this.awaitingRegisterNumber = null;
        this.registerInputBuffer = '';
        
        // Prefix state
        this.prefixF = false;
        this.prefixG = false;
        
        // References to DOM elements
        this.displayElement = null;
        this.buttons = [];
    }

    /**
     * Initialize calculator with DOM elements
     */
    initialize() {
        // Get display element
        this.displayElement = document.getElementById('displayValue');
        
        // Get indicator elements
        const indicators = {
            f: document.getElementById('indF'),
            g: document.getElementById('indG'),
            user: document.getElementById('indUser'),
            begin: document.getElementById('indBegin'),
            c: document.getElementById('indC'),
            running: document.getElementById('indRunning')
        };
        
        // Initialize display
        this.display.initialize(this.displayElement, indicators);
        
        // Attach button event listeners
        this.attachEventListeners();
        
        // Initial display
        this.updateDisplay();
        
        console.log('HP-12C Calculator initialized');
    }

    /**
     * Attach event listeners to all buttons
     */
    attachEventListeners() {
        this.buttons = document.querySelectorAll('.key');
        
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(button);
                
                // Visual feedback
                button.classList.add('pressed');
                setTimeout(() => button.classList.remove('pressed'), 150);
            });
        });
    }

    /**
     * Handle button click
     * @param {HTMLElement} button - Button element
     */
    handleButtonClick(button) {
        const key = button.dataset.key;
        const primary = button.dataset.primary;
        
        console.log('Button pressed:', key, 'Prefix F:', this.prefixF, 'Prefix G:', this.prefixG);
        
        // Route to appropriate handler
        if (this.prefixF) {
            this.handleGoldFunction(key);
            this.prefixF = false;
            this.display.setIndicator('f', false);
        } else if (this.prefixG) {
            this.handleBlueFunction(key);
            this.prefixG = false;
            this.display.setIndicator('g', false);
        } else {
            this.handlePrimaryFunction(key, primary);
        }
        
        this.updateDisplay();
    }

    /**
     * Handle primary function (no prefix)
     * @param {string} key - Button key
     * @param {string} primary - Primary label
     */
    handlePrimaryFunction(key, primary) {
        // Number keys (digit-0 through digit-9)
        if (key.startsWith('digit-')) {
            const digit = key.replace('digit-', '');
            this.enterDigit(digit);
            return;
        }
        
        // Decimal point
        if (key === 'decimal') {
            this.enterDecimal();
            return;
        }
        
        switch(key) {
            case 'prefix-f':
                this.prefixF = true;
                this.display.setIndicator('f', true);
                break;
                
            case 'prefix-g':
                this.prefixG = true;
                this.display.setIndicator('g', true);
                break;
                
            case 'enter':
                this.enter();
                break;
                
            case 'clx':
                this.clearX();
                break;
                
            case 'roll-down':
                this.rollDown();
                break;
                
            case 'swap-xy':
                this.swapXY();
                break;
                
            case 'op-add':
                this.add();
                break;
                
            case 'op-subtract':
                this.subtract();
                break;
                
            case 'op-multiply':
                this.multiply();
                break;
                
            case 'op-divide':
                this.divide();
                break;
                
            case 'on':
                this.reset();
                break;
                
            case 'chs':
                this.changeSign();
                break;
                
            case 'n':
                this.handleTVMKey('n');
                break;
                
            case 'i':
                this.handleTVMKey('i');
                break;
                
            case 'pv':
                this.handleTVMKey('pv');
                break;
                
            case 'pmt':
                this.handleTVMKey('pmt');
                break;
                
            case 'fv':
                this.handleTVMKey('fv');
                break;
                
            case 'percent':
                this.percent();
                break;
                
            case 'power-yx':
                this.power();
                break;
                
            case 'reciprocal':
                this.reciprocal();
                break;
                
            case 'sigma-plus':
                this.sigmaPlus();
                break;
                
            case 'sto':
                this.awaitingRegisterNumber = 'sto';
                console.log('Awaiting register number for STO');
                break;
                
            case 'rcl':
                this.awaitingRegisterNumber = 'rcl';
                console.log('Awaiting register number for RCL');
                break;
                
            default:
                // Check if awaiting register number
                if (this.awaitingRegisterNumber && key.startsWith('digit-')) {
                    const digit = parseInt(key.replace('digit-', ''));
                    this.handleRegisterNumber(digit);
                } else {
                    console.log('Unimplemented function:', key);
                }
        }
    }

    /**
     * Handle gold function (f prefix)
     * @param {string} key - Button key
     */
    handleGoldFunction(key) {
        // Check for digit keys (FIX mode)
        if (key.startsWith('digit-')) {
            const digit = parseInt(key.replace('digit-', ''));
            this.setFixMode(digit);
            return;
        }
        
        switch(key) {
            case 'pmt':
                // f PMT = BEGIN/END mode toggle
                this.toggleBeginMode();
                break;
                
            case 'pv':
                // f PV = NPV calculation
                this.calculateNPV();
                break;
                
            case 'fv':
                // f FV = IRR calculation
                this.calculateIRR();
                break;
                
            case 'chs':
                // f CHS = Clear Financial registers
                this.clearFinancial();
                break;
                
            case 'clx':
                // f CLX = Clear all registers (CLR REG)
                this.clearRegisters();
                break;
                
            case 'enter':
                // f ENTER = Clear PREFIX (already handled)
                break;
                
            case 'sigma-plus':
                // f Σ+ = Clear Statistics
                this.clearStatistics();
                break;
                
            default:
                console.log('Gold function:', key);
        }
    }

    /**
     * Handle blue function (g prefix)
     * @param {string} key - Button key
     */
    handleBlueFunction(key) {
        // Check for digit keys (SCI mode)
        if (key.startsWith('digit-')) {
            const digit = parseInt(key.replace('digit-', ''));
            
            // Special cases for specific functions
            if (digit === 0) {
                // g 0 = Mean (x̄) - already implemented
                this.meanX();
                return;
            } else if (digit === 1) {
                // g 1 = Y-estimate, Correlation (ŷ,r)
                this.estimateY();
                return;
            } else if (digit === 2) {
                // g 2 = X-estimate, Correlation (x̂,r)
                this.estimateX();
                return;
            } else if (digit === 4) {
                // g 4 = D.MY date format
                this.setDateFormat('DMY');
                return;
            } else if (digit === 5) {
                // g 5 = M.DY date format
                this.setDateFormat('MDY');
                return;
            } else if (digit === 9) {
                // g 9 = INTG (Integer part)
                this.integerPart();
                return;
            }
            
            // Otherwise, set SCI mode
            this.setSciMode(digit);
            return;
        }
        
        switch(key) {
            case 'n':
                // g n = 12× (multiply by 12)
                this.multiply12();
                break;
                
            case 'i':
                // g i = 12÷ (divide by 12)
                this.divide12();
                break;
                
            case 'op-divide':
                // g ÷ = Delta % (Δ%)
                this.deltaPercent();
                break;
                
            case 'op-multiply':
                // g × = Percent Total (%T)
                this.percentTotal();
                break;
                
            case 'power-yx':
                // g yˣ = Square Root (√x)
                this.squareRoot();
                break;
                
            case 'reciprocal':
                // g 1/x = Natural Exponential (eˣ)
                this.exponential();
                break;
                
            case 'percent-total':
                // g %T = Natural Logarithm (LN)
                this.naturalLog();
                break;
                
            case 'clx':
                // g CLX = Clear LSTX
                this.stack.lstx = 0;
                console.log('Last X cleared');
                break;
                
            case 'sigma-plus':
                // g Σ+ = Sigma Minus (Σ-)
                this.sigmaMinus();
                break;
                
            case 'decimal':
                // g . = Standard Deviation (s)
                this.standardDeviationX();
                break;
                
            case 'pmt':
                // g PMT = FRAC (Fractional part)
                this.fractionalPart();
                break;
                
            case 'eex':
                // g EEX = ΔDYS (days between dates)
                this.calculateDYS();
                break;
                
            case 'chs':
                // g CHS = DATE (future/past date)
                this.calculateDATE();
                break;
                
            default:
                console.log('Blue function:', key);
        }
    }

    /**
     * Enter a digit
     * @param {string} digit - Digit to enter (0-9)
     */
    enterDigit(digit) {
        if (this.isNewNumber) {
            this.currentInput = digit;
            this.isNewNumber = false;
            this.hasDecimal = false;
        } else {
            // Limit to 10 digits
            if (this.currentInput.replace(/[^0-9]/g, '').length < 10) {
                this.currentInput += digit;
            }
        }
        
        this.stack.x = parseFloat(this.currentInput) || 0;
    }

    /**
     * Enter decimal point
     */
    enterDecimal() {
        if (this.isNewNumber) {
            this.currentInput = '0.';
            this.isNewNumber = false;
            this.hasDecimal = true;
        } else if (!this.hasDecimal) {
            this.currentInput += '.';
            this.hasDecimal = true;
        }
        
        this.stack.x = parseFloat(this.currentInput) || 0;
    }

    /**
     * ENTER key: Push X to stack
     */
    enter() {
        this.stack.enter();
        this.isNewNumber = true;
        this.display.show(this.stack.x, true);
    }

    /**
     * Clear X register
     */
    clearX() {
        this.stack.clearX();
        this.currentInput = '';
        this.isNewNumber = true;
        this.hasDecimal = false;
    }

    /**
     * Roll down stack
     */
    rollDown() {
        this.finishNumberEntry();
        this.stack.rollDown();
        this.isNewNumber = true;
    }

    /**
     * Swap X and Y
     */
    swapXY() {
        this.finishNumberEntry();
        this.stack.swapXY();
        this.isNewNumber = true;
    }

    /**
     * Addition: Y + X
     */
    add() {
        this.finishNumberEntry();
        this.stack.binaryOp((y, x) => y + x);
        this.isNewNumber = true;
    }

    /**
     * Subtraction: Y - X
     */
    subtract() {
        this.finishNumberEntry();
        this.stack.binaryOp((y, x) => y - x);
        this.isNewNumber = true;
    }

    /**
     * Multiplication: Y × X
     */
    multiply() {
        this.finishNumberEntry();
        this.stack.binaryOp((y, x) => y * x);
        this.isNewNumber = true;
    }

    /**
     * Division: Y ÷ X
     */
    divide() {
        this.finishNumberEntry();
        if (this.stack.x === 0) {
            this.display.showError('Error 0');
            return;
        }
        this.stack.binaryOp((y, x) => y / x);
        this.isNewNumber = true;
    }

    /**
     * Finish number entry (push to stack if needed)
     */
    finishNumberEntry() {
        if (!this.isNewNumber) {
            this.stack.push(parseFloat(this.currentInput) || this.stack.x);
            this.isNewNumber = true;
        }
    }

    /**
     * Change sign of X (CHS)
     */
    changeSign() {
        if (!this.isNewNumber) {
            // Change sign of current input
            if (this.currentInput.startsWith('-')) {
                this.currentInput = this.currentInput.substring(1);
            } else {
                this.currentInput = '-' + this.currentInput;
            }
            this.stack.x = parseFloat(this.currentInput) || 0;
        } else {
            // Change sign of stack X
            this.stack.x = -this.stack.x;
        }
    }

    /**
     * Recall last X value
     */
    recallLastX() {
        this.stack.recallLastX();
        this.isNewNumber = true;
    }

    /**
     * Store X to memory register
     * @param {number} registerNum - Register number (0-19)
     */
    storeRegister(registerNum) {
        this.finishNumberEntry();
        this.memory.store(registerNum, this.stack.x);
        console.log(`Stored ${this.stack.x} to R${registerNum}`);
    }

    /**
     * Recall value from memory register
     * @param {number} registerNum - Register number (0-19)
     */
    recallRegister(registerNum) {
        const value = this.memory.recall(registerNum);
        this.stack.push(value);
        this.isNewNumber = true;
        console.log(`Recalled ${value} from R${registerNum}`);
    }

    /**
     * Handle TVM key press (store or solve)
     * @param {string} variable - TVM variable (n, i, pv, pmt, fv)
     */
    handleTVMKey(variable) {
        this.finishNumberEntry();
        
        // Store current X value to the TVM variable
        this.financial.store(variable, this.stack.x);
        console.log(`Stored ${this.stack.x} to ${variable.toUpperCase()}`);
        
        // Sync with memory registers (R0-R4)
        const registerMap = { 'n': 0, 'i': 1, 'pv': 2, 'pmt': 3, 'fv': 4 };
        this.memory.store(registerMap[variable], this.stack.x);
        
        this.isNewNumber = true;
    }

    /**
     * Solve for a TVM variable (when pressed while awaiting result)
     * This would be triggered by pressing a TVM key without entering a number first
     * For now, we'll implement direct solve by double-pressing or using a prefix
     */
    solveTVM(variable) {
        try {
            let result;
            
            switch(variable.toLowerCase()) {
                case 'n':
                    result = this.financial.solveN();
                    break;
                case 'i':
                    result = this.financial.solveI();
                    break;
                case 'pv':
                    result = this.financial.solvePV();
                    break;
                case 'pmt':
                    result = this.financial.solvePMT();
                    break;
                case 'fv':
                    result = this.financial.solveFV();
                    break;
                default:
                    throw new Error('Invalid TVM variable');
            }
            
            this.stack.push(result);
            this.isNewNumber = true;
            
            // Sync with memory
            const registerMap = { 'n': 0, 'i': 1, 'pv': 2, 'pmt': 3, 'fv': 4 };
            this.memory.store(registerMap[variable], result);
            
            console.log(`Solved ${variable.toUpperCase()} = ${result}`);
            
        } catch (error) {
            this.display.showError(error.message);
            console.error(`Error solving ${variable}:`, error);
        }
    }

    /**
     * Percent function: Y = base, X = percentage -> Result = Y * (X / 100)
     */
    percent() {
        this.finishNumberEntry();
        const base = this.stack.y;
        const percentage = this.stack.x;
        const result = this.financial.calculatePercent(base, percentage);
        
        // Push result to stack (keeps Y in place)
        this.stack.x = result;
        this.isNewNumber = true;
        
        console.log(`${base} × ${percentage}% = ${result}`);
    }

    /**
     * Delta percent function: Y = old, X = new -> Result = ((X - Y) / Y) * 100
     */
    deltaPercent() {
        this.finishNumberEntry();
        const oldValue = this.stack.y;
        const newValue = this.stack.x;
        
        try {
            const result = this.financial.calculateDeltaPercent(oldValue, newValue);
            
            // Replace X with result, drop stack
            this.stack.binaryOp((y, x) => this.financial.calculateDeltaPercent(y, x));
            this.isNewNumber = true;
            
            console.log(`Δ%: ${oldValue} → ${newValue} = ${result}%`);
            
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Percent of total function: Y = total, X = part -> Result = (X / Y) * 100
     */
    percentTotal() {
        this.finishNumberEntry();
        const total = this.stack.y;
        const part = this.stack.x;
        
        try {
            const result = this.financial.calculatePercentTotal(total, part);
            
            // Replace X with result, drop stack
            this.stack.binaryOp((y, x) => this.financial.calculatePercentTotal(y, x));
            this.isNewNumber = true;
            
            console.log(`%T: ${part} / ${total} = ${result}%`);
            
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Toggle BEGIN/END mode for TVM calculations
     */
    toggleBeginMode() {
        this.financial.setBeginMode(!this.financial.getBeginMode());
        this.display.setIndicator('begin', this.financial.getBeginMode());
        console.log('Payment mode:', this.financial.getBeginMode() ? 'BEGIN' : 'END');
    }

    /**
     * Calculate NPV
     */
    calculateNPV() {
        this.finishNumberEntry();
        try {
            const rate = this.stack.x;  // Interest rate from X
            const npv = this.financial.calculateNPV(rate);
            this.stack.push(npv);
            this.isNewNumber = true;
            console.log(`NPV at ${rate}% = ${npv}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Calculate IRR
     */
    calculateIRR() {
        try {
            const irr = this.financial.calculateIRR();
            this.stack.push(irr);
            this.isNewNumber = true;
            console.log(`IRR = ${irr}%`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Power function: Y^X
     */
    power() {
        this.finishNumberEntry();
        const base = this.stack.y;
        const exponent = this.stack.x;
        
        // Check for invalid operations
        if (base < 0 && exponent !== Math.floor(exponent)) {
            this.display.showError('Error 0');
            console.error('Cannot raise negative number to fractional power');
            return;
        }
        
        const result = Math.pow(base, exponent);
        
        // Check for overflow/underflow
        if (!isFinite(result)) {
            this.display.showError('Error 0');
            console.error('Power result overflow');
            return;
        }
        
        this.stack.binaryOp((y, x) => Math.pow(y, x));
        this.isNewNumber = true;
        console.log(`${base}^${exponent} = ${result}`);
    }
    
    /**
     * Reciprocal: 1/X
     */
    reciprocal() {
        this.finishNumberEntry();
        const x = this.stack.x;
        
        if (x === 0) {
            this.display.showError('Error 0');
            console.error('Division by zero');
            return;
        }
        
        const result = 1 / x;
        this.stack.unaryOp(x => 1 / x);
        this.isNewNumber = true;
        console.log(`1/${x} = ${result}`);
    }
    
    /**
     * Square Root: √X
     */
    squareRoot() {
        this.finishNumberEntry();
        const x = this.stack.x;
        
        if (x < 0) {
            this.display.showError('Error 0');
            console.error('Cannot take square root of negative number');
            return;
        }
        
        const result = Math.sqrt(x);
        this.stack.unaryOp(x => Math.sqrt(x));
        this.isNewNumber = true;
        console.log(`√${x} = ${result}`);
    }
    
    /**
     * Natural Exponential: e^X
     */
    exponential() {
        this.finishNumberEntry();
        const x = this.stack.x;
        const result = Math.exp(x);
        
        // Check for overflow
        if (!isFinite(result)) {
            this.display.showError('Error 0');
            console.error('Exponential overflow');
            return;
        }
        
        this.stack.unaryOp(x => Math.exp(x));
        this.isNewNumber = true;
        console.log(`e^${x} = ${result}`);
    }
    
    /**
     * Natural Logarithm: LN(X)
     */
    naturalLog() {
        this.finishNumberEntry();
        const x = this.stack.x;
        
        if (x <= 0) {
            this.display.showError('Error 0');
            console.error('Cannot take logarithm of non-positive number');
            return;
        }
        
        const result = Math.log(x);
        this.stack.unaryOp(x => Math.log(x));
        this.isNewNumber = true;
        console.log(`ln(${x}) = ${result}`);
    }
    
    /**
     * Common Logarithm: LOG(X) base 10
     */
    commonLog() {
        this.finishNumberEntry();
        const x = this.stack.x;
        
        if (x <= 0) {
            this.display.showError('Error 0');
            console.error('Cannot take logarithm of non-positive number');
            return;
        }
        
        const result = Math.log10(x);
        this.stack.unaryOp(x => Math.log10(x));
        this.isNewNumber = true;
        console.log(`log(${x}) = ${result}`);
    }

    /**
     * ==========================================
     * STATISTICS FUNCTIONS
     * ==========================================
     */

    /**
     * Σ+ (Sigma Plus) - Add data point to statistical registers
     * For single-variable: uses X register
     * For two-variable: uses Y and X registers (x=X, y=Y)
     */
    sigmaPlus() {
        this.finishNumberEntry();
        
        try {
            const x = this.stack.x;
            const y = this.stack.y;
            
            // Add data point to statistics
            const n = this.statistics.sigmaPlus(x, y);
            
            // Display new count
            this.stack.x = n;
            this.isNewNumber = true;
            
            console.log(`Σ+ added: x=${x}, y=${y}, n=${n}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Σ- (Sigma Minus) - Remove data point from statistical registers
     * Removes the values currently in X and Y from statistics
     */
    sigmaMinus() {
        this.finishNumberEntry();
        
        try {
            const x = this.stack.x;
            const y = this.stack.y;
            
            // Remove data point from statistics
            const n = this.statistics.sigmaMinus(x, y);
            
            // Display new count
            this.stack.x = n;
            this.isNewNumber = true;
            
            console.log(`Σ- removed: x=${x}, y=${y}, n=${n}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * x̄ (Mean) - Calculate mean of x values
     * Also places mean of y values in Y register
     */
    meanX() {
        this.finishNumberEntry();
        
        try {
            const xMean = this.statistics.mean();
            const yMean = this.statistics.meanY();
            
            // HP-12C behavior: place results directly in X and Y without stack lift
            this.stack.y = yMean;
            this.stack.x = xMean;
            this.isNewNumber = true;
            
            console.log(`Mean: x̄=${xMean}, ȳ=${yMean}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * s (Standard Deviation) - Calculate sample standard deviation
     * Also places standard deviation of y values in Y register
     */
    standardDeviationX() {
        this.finishNumberEntry();
        
        try {
            const sX = this.statistics.standardDeviation();
            const sY = this.statistics.standardDeviationY();
            
            // HP-12C behavior: place results directly in X and Y without stack lift
            this.stack.y = sY;
            this.stack.x = sX;
            this.isNewNumber = true;
            
            console.log(`Standard Deviation: sx=${sX}, sy=${sY}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * ŷ,r (Y-estimate, Correlation) - Linear regression: estimate y from x
     * Uses x value in X register to estimate y
     * Returns estimated y in X and correlation coefficient r in Y
     */
    estimateY() {
        this.finishNumberEntry();
        
        try {
            const x = this.stack.x;
            const { yEstimate, correlation } = this.statistics.estimateY(x);
            
            // HP-12C behavior: place results directly in X and Y without stack lift
            this.stack.y = correlation;
            this.stack.x = yEstimate;
            this.isNewNumber = true;
            
            console.log(`Y-estimate: x=${x}, ŷ=${yEstimate}, r=${correlation}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * x̂,r (X-estimate, Correlation) - Linear regression: estimate x from y
     * Uses y value in X register to estimate x
     * Returns estimated x in X and correlation coefficient r in Y
     */
    estimateX() {
        this.finishNumberEntry();
        
        try {
            const y = this.stack.x;
            const { xEstimate, correlation } = this.statistics.estimateX(y);
            
            // HP-12C behavior: place results directly in X and Y without stack lift
            this.stack.y = correlation;
            this.stack.x = xEstimate;
            this.isNewNumber = true;
            
            console.log(`X-estimate: y=${y}, x̂=${xEstimate}, r=${correlation}`);
        } catch (error) {
            this.display.showError(error.message);
        }
    }

    /**
     * Set FIX mode (f followed by digit 0-9)
     * @param {number} decimals - Number of decimal places (0-9)
     */
    setFixMode(decimals) {
        this.display.setFormat('fixed', decimals);
        console.log(`Display format set to FIX ${decimals}`);
    }

    /**
     * Set SCI mode (g followed by digit 0-9, but not 0,1,2,9)
     * @param {number} decimals - Number of decimal places (0-9)
     */
    setSciMode(decimals) {
        this.display.setFormat('sci', decimals);
        console.log(`Display format set to SCI ${decimals}`);
    }

    /**
     * Multiply X by 12 (g n)
     * Time conversion utility: years to months, etc.
     */
    multiply12() {
        this.stack.lstx = this.stack.x;
        this.stack.x = this.stack.x * 12;
        console.log('Multiplied by 12:', this.stack.x);
    }

    /**
     * Divide X by 12 (g i)
     * Time conversion utility: annual to monthly rate, etc.
     */
    divide12() {
        this.stack.lstx = this.stack.x;
        this.stack.x = this.stack.x / 12;
        console.log('Divided by 12:', this.stack.x);
    }

    /**
     * Get integer part of X (g 9)
     * Discards fractional part, preserves sign
     */
    integerPart() {
        this.stack.lstx = this.stack.x;
        this.stack.x = Math.trunc(this.stack.x);
        console.log('Integer part:', this.stack.x);
    }

    /**
     * Get fractional part of X (g PMT)
     * Returns only decimal portion, always positive
     */
    fractionalPart() {
        this.stack.lstx = this.stack.x;
        const intPart = Math.trunc(this.stack.x);
        this.stack.x = Math.abs(this.stack.x - intPart);
        console.log('Fractional part:', this.stack.x);
    }

    /**
     * Toggle BEGIN/END mode (f PMT)
     */
    toggleBeginMode() {
        this.financial.beginMode = !this.financial.beginMode;
        this.display.setIndicator('begin', this.financial.beginMode);
        console.log(`Payment mode: ${this.financial.beginMode ? 'BEGIN' : 'END'}`);
    }

    /**
     * Clear statistics registers (f Σ+)
     */
    clearStatistics() {
        this.statistics.clear();
        console.log('Statistics registers cleared');
    }

    /**
     * Clear financial registers
     */
    clearFinancial() {
        this.financial.clear();
        // Clear memory registers R0-R4
        for (let i = 0; i < 5; i++) {
            this.memory.store(i, 0);
        }
        console.log('Financial registers cleared');
    }

    /**
     * Clear all memory registers
     */
    clearRegisters() {
        this.memory.clear();
        console.log('All registers cleared');
    }

    /**
     * Handle register number input (for STO/RCL)
     * @param {number} digit - Register digit (0-9)
     */
    handleRegisterNumber(digit) {
        if (this.awaitingRegisterNumber === 'sto') {
            this.storeRegister(digit);
            this.awaitingRegisterNumber = null;
            this.registerInputBuffer = '';
        } else if (this.awaitingRegisterNumber === 'rcl') {
            this.recallRegister(digit);
            this.awaitingRegisterNumber = null;
            this.registerInputBuffer = '';
        }
    }

    // ==================== Date Functions ====================
    
    /**
     * Set date format mode
     * @param {string} format - 'DMY' or 'MDY'
     */
    setDateFormat(format) {
        this.dates.setFormat(format);
        console.log(`Date format set to ${format === 'DMY' ? 'D.MY' : 'M.DY'}`);
        this.updateDisplay();
    }
    
    /**
     * Calculate days between two dates (ΔDYS function)
     * HP-12C: g EEX
     * Stack: Y=date1, X=date2 → X=days
     */
    calculateDYS() {
        this.finishNumberEntry();
        
        const date2 = this.stack.x;
        const date1 = this.stack.y;
        
        const result = this.dates.daysBetween(date1, date2);
        
        if (result.error) {
            this.display.showError(result.error);
            console.error('DYS error:', result.error);
            return;
        }
        
        // Binary operation: replace X and Y with result
        this.stack.binaryOp(() => result.days);
        
        console.log(`Days between dates: ${result.days}`);
        this.updateDisplay();
    }
    
    /**
     * Calculate future/past date (DATE function)
     * HP-12C: g CHS
     * Stack: Y=start_date, X=days → X=new_date, Y=day_of_week
     */
    calculateDATE() {
        this.finishNumberEntry();
        
        const days = this.stack.x;
        const startDate = this.stack.y;
        
        const result = this.dates.addDays(startDate, days);
        
        if (result.error) {
            this.display.showError(result.error);
            console.error('DATE error:', result.error);
            return;
        }
        
        // Drop stack and set X to new date, Y to day of week
        this.stack.saveLastX();
        this.stack.drop();
        this.stack.x = result.date;
        this.stack.y = result.dayOfWeek;
        this.stack.enableStackLift();
        
        console.log(`New date: ${result.date}, Day of week: ${result.dayOfWeek}`);
        this.updateDisplay();
    }

    /**
     * Reset calculator
     */
    reset() {
        this.stack.reset();
        this.memory.reset();
        this.financial.clear();
        this.currentInput = '';
        this.isNewNumber = true;
        this.hasDecimal = false;
        this.prefixF = false;
        this.prefixG = false;
        this.awaitingRegisterNumber = null;
        this.registerInputBuffer = '';
        this.display.setFormat('fixed', 2);
        this.display.setIndicator('f', false);
        this.display.setIndicator('g', false);
        this.display.setIndicator('begin', false);
        console.log('Calculator reset');
    }

    /**
     * Update display with current value
     */
    updateDisplay() {
        this.display.show(this.stack.x);
        
        // Update stack display if visible (only in browser environment)
        if (typeof document !== 'undefined') {
            const stackDisplay = document.getElementById('stackDisplay');
            if (stackDisplay && stackDisplay.style.display !== 'none') {
                this.display.updateStackDisplay(this.stack.getState());
            }
        }
    }

    /**
     * Get calculator state
     * @returns {object} Complete calculator state
     */
    getState() {
        return {
            stack: this.stack.getState(),
            memory: this.memory.getState(),
            display: this.display.getFormat(),
            prefixF: this.prefixF,
            prefixG: this.prefixG
        };
    }
}

// Initialize calculator when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.calculator = new Calculator();
        window.calculator.initialize();
    });
}

// Export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
