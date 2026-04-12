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
        
        this.isNewNumber = true;
        this.prefixF = false;
        this.prefixG = false;
    }

    // Calculator operations - to be implemented phase by phase
}
