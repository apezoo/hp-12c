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
        this.buttons = document.querySelectorAll('.btn');
        
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
        // Number keys (0-9)
        if (key >= '0' && key <= '9') {
            this.enterDigit(key);
            return;
        }
        
        // Decimal point
        if (key === 'decimal') {
            this.enterDecimal();
            return;
        }
        
        switch(key) {
            case 'f':
                this.prefixF = true;
                this.display.setIndicator('f', true);
                break;
                
            case 'g':
                this.prefixG = true;
                this.display.setIndicator('g', true);
                break;
                
            case 'ENTER':
                this.enter();
                break;
                
            case 'CLx':
                this.clearX();
                break;
                
            case 'Rdown':
                this.rollDown();
                break;
                
            case 'xy':
                this.swapXY();
                break;
                
            case 'add':
                this.add();
                break;
                
            case 'subtract':
                this.subtract();
                break;
                
            case 'multiply':
                this.multiply();
                break;
                
            case 'divide':
                this.divide();
                break;
                
            case 'ON':
                this.reset();
                break;
                
            default:
                console.log('Unimplemented function:', key);
        }
    }

    /**
     * Handle gold function (f prefix)
     * @param {string} key - Button key
     */
    handleGoldFunction(key) {
        console.log('Gold function:', key);
        // Gold functions will be implemented in later phases
    }

    /**
     * Handle blue function (g prefix)
     * @param {string} key - Button key
     */
    handleBlueFunction(key) {
        console.log('Blue function:', key);
        // Blue functions will be implemented in later phases
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
     * Reset calculator
     */
    reset() {
        this.stack.reset();
        this.memory.reset();
        this.currentInput = '';
        this.isNewNumber = true;
        this.hasDecimal = false;
        this.prefixF = false;
        this.prefixG = false;
        this.display.setFormat('fixed', 2);
        this.display.setIndicator('f', false);
        this.display.setIndicator('g', false);
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
