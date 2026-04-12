/**
 * HP-12C Calculator Controller
 * Main controller coordinating all calculator components
 */

class Calculator {
    constructor() {
        this.stack = new RPNStack();
        this.display = new DisplayManager();
        this.memory = new MemoryManager();
        this.financial = new FinancialEngine();
        
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
                
            default:
                console.log('Gold function:', key);
        }
    }

    /**
     * Handle blue function (g prefix)
     * @param {string} key - Button key
     */
    handleBlueFunction(key) {
        switch(key) {
            case 'op-divide':
                // g ÷ = Delta % (Δ%)
                this.deltaPercent();
                break;
                
            case 'op-multiply':
                // g × = Percent Total (%T)
                this.percentTotal();
                break;
                
            case 'clx':
                // g CLX = Clear LSTX
                this.stack.lstx = 0;
                console.log('Last X cleared');
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
        
        // Update stack display if visible
        const stackDisplay = document.getElementById('stackDisplay');
        if (stackDisplay && stackDisplay.style.display !== 'none') {
            this.display.updateStackDisplay(this.stack.getState());
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
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
    window.calculator.initialize();
});
