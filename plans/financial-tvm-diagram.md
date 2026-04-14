# Financial TVM - Visual Architecture Diagrams

## System Component Interaction

```mermaid
graph TB
    subgraph User Interface
        A[User Presses TVM Key]
        B[Display Shows Result]
    end
    
    subgraph Calculator Controller
        C[handleTVMKey]
        D{Store or Solve?}
        E[Store Value]
        F[Solve Value]
    end
    
    subgraph Financial Engine
        G[FinancialEngine]
        H{Which Variable?}
        I[solvePV - Closed Form]
        J[solvePMT - Closed Form]
        K[solveFV - Closed Form]
        L[solveN - Newton-Raphson]
        M[solveI - Newton-Raphson]
    end
    
    subgraph Memory System
        N[Memory Manager]
        O[R0: n]
        P[R1: i]
        Q[R2: PV]
        R[R3: PMT]
        S[R4: FV]
    end
    
    A --> C
    C --> D
    D -->|New Input| E
    D -->|No Input| F
    E --> N
    F --> G
    G --> H
    H -->|PV| I
    H -->|PMT| J
    H -->|FV| K
    H -->|n| L
    H -->|i| M
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    N --> O
    N --> P
    N --> Q
    N --> R
    N --> S
    N --> B
```

## TVM Solver Decision Tree

```mermaid
graph TD
    A[TVM Key Pressed] --> B{Is there new input?}
    B -->|Yes| C[STORE MODE: Store X register to financial register]
    B -->|No| D[SOLVE MODE: Calculate missing variable]
    
    D --> E{Which variable?}
    
    E -->|PV| F{i equals 0?}
    F -->|Yes| G[PV = -PMT × n - FV]
    F -->|No| H[PV = -PMT × compound factor - FV × discount]
    
    E -->|PMT| I{i equals 0?}
    I -->|Yes| J[PMT = -PV + FV / n]
    I -->|No| K[PMT = -PV + FV × discount / annuity factor]
    
    E -->|FV| L{i equals 0?}
    L -->|Yes| M[FV = -PV - PMT × n]
    L -->|No| N[FV = -PV × compound - PMT × annuity]
    
    E -->|n| O{PMT equals 0?}
    O -->|Yes| P[n = ln FV / -PV / ln 1 + i]
    O -->|No| Q[Newton-Raphson Iteration]
    Q --> R[Calculate f n and f' n]
    R --> S{Converged?}
    S -->|No| Q
    S -->|Yes| T[Return n]
    
    E -->|i| U[Get Initial Guess]
    U --> V[Newton-Raphson Iteration]
    V --> W[Calculate f i and f' i]
    W --> X{Converged?}
    X -->|No| Y{Diverging?}
    Y -->|Yes| Z[Switch to Bisection Method]
    Y -->|No| V
    X -->|Yes| AA[Return i]
    Z --> AB[Bisection Iteration]
    AB --> AC{Converged?}
    AC -->|No| AB
    AC -->|Yes| AA
```

## Newton-Raphson Algorithm Flow

```mermaid
graph TD
    A[Start Newton-Raphson] --> B[Initialize: guess = initial value]
    B --> C[iteration = 0]
    C --> D[Calculate f guess]
    D --> E[Calculate f' guess]
    E --> F{Is f' too small?}
    F -->|Yes| G[Error: No Solution]
    F -->|No| H[new_guess = guess - f guess / f' guess]
    H --> I{Converged?<br/>abs new_guess - guess less than tolerance}
    I -->|Yes| J[Return new_guess]
    I -->|No| K{In valid range?}
    K -->|No| L{Solving for i?}
    L -->|Yes| M[Switch to Bisection]
    L -->|No| G
    K -->|Yes| N[iteration = iteration + 1]
    N --> O{iteration greater than MAX?}
    O -->|Yes| P[Error: No Convergence]
    O -->|No| Q[guess = new_guess]
    Q --> D
```

## Data Flow Example: Mortgage Calculation

```mermaid
sequenceDiagram
    participant User
    participant Calc as Calculator
    participant Fin as FinancialEngine
    participant Mem as Memory
    participant Disp as Display
    
    Note over User: Calculate 30-year mortgage payment
    
    User->>Calc: 360 n
    Calc->>Mem: store 360 in R0
    Mem-->>Disp: Show 360
    
    User->>Calc: 6 i
    Calc->>Mem: store 6.0 in R1
    Mem-->>Disp: Show 6.0
    
    User->>Calc: 200000 PV
    Calc->>Mem: store 200000 in R2
    Mem-->>Disp: Show 200000
    
    User->>Calc: 0 FV
    Calc->>Mem: store 0 in R4
    Mem-->>Disp: Show 0
    
    User->>Calc: PMT key with no input
    Calc->>Fin: solvePMT
    Fin->>Mem: get n, i, PV, FV
    Mem-->>Fin: 360, 6.0, 200000, 0
    Fin->>Fin: Convert i to decimal: 0.06
    Fin->>Fin: Calculate monthly i: 0.06/12 = 0.005
    Fin->>Fin: Apply PMT formula
    Fin->>Fin: Result: -1199.10
    Fin->>Mem: store -1199.10 in R3
    Fin-->>Calc: -1199.10
    Calc-->>Disp: Show -1199.10
    
    Note over User,Disp: Monthly payment is 1,199.10
```

## Class Structure Diagram

```mermaid
classDiagram
    class Calculator {
        -RPNStack stack
        -DisplayManager display
        -MemoryManager memory
        -FinancialEngine financial
        +handleTVMKey(register)
        +handleBlueFunction(key)
    }
    
    class FinancialEngine {
        -String paymentMode
        -int MAX_ITERATIONS
        -float TOLERANCE
        +solveN(memory)
        +solveI(memory)
        +solvePV(memory)
        +solvePMT(memory)
        +solveFV(memory)
        +setPaymentMode(mode)
        -calculatePV(n, i, pmt, fv)
        -calculatePMT(n, i, pv, fv)
        -calculateFV(n, i, pv, pmt)
        -solveNIterative(i, pv, pmt, fv)
        -solveIIterative(n, pv, pmt, fv)
        -solveIBisection(n, pv, pmt, fv)
        -validateTVMInputs(args)
    }
    
    class MemoryManager {
        -Array registers
        +store(registerNum, value)
        +recall(registerNum)
        +setFinancialRegister(name, value)
        +getFinancialRegister(name)
        +clearFinancial()
    }
    
    class DisplayManager {
        -Element displayElement
        -Object indicators
        +setIndicator(name, active)
        +showError(message)
        +update(value)
    }
    
    Calculator --> FinancialEngine : uses
    Calculator --> MemoryManager : uses
    Calculator --> DisplayManager : uses
    FinancialEngine --> MemoryManager : reads/writes
```

## State Transition Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle: Calculator Ready
    
    Idle --> EnteringNumber: User types digit
    EnteringNumber --> EnteringNumber: More digits
    EnteringNumber --> StoringTVM: Press TVM key
    
    Idle --> SolvingTVM: Press TVM key without input
    
    StoringTVM --> Idle: Value stored in register
    
    SolvingTVM --> CalculatingClosed: Variable is PV/PMT/FV
    SolvingTVM --> CalculatingIterative: Variable is n/i
    
    CalculatingClosed --> DisplayResult: Calculation complete
    
    CalculatingIterative --> Iterating: Start Newton-Raphson
    Iterating --> Iterating: Next iteration
    Iterating --> CheckConvergence: After each iteration
    
    CheckConvergence --> DisplayResult: Converged
    CheckConvergence --> Iterating: Not converged
    CheckConvergence --> FallbackBisection: Diverging (i only)
    CheckConvergence --> Error: Max iterations reached
    
    FallbackBisection --> Bisecting: Start bisection
    Bisecting --> Bisecting: Narrow interval
    Bisecting --> DisplayResult: Converged
    Bisecting --> Error: Max iterations
    
    DisplayResult --> Idle: Result shown
    Error --> Idle: Error displayed
    
    note right of CalculatingIterative
        Newton-Raphson for n or i
        Most complex calculations
    end note
    
    note right of CalculatingClosed
        Direct formula
        Fast computation
    end note
```

## Payment Mode State

```mermaid
stateDiagram-v2
    [*] --> END: Default state
    
    END --> BEGIN: Press g 7
    BEGIN --> END: Press g 8
    
    note right of END
        Payments at period end
        Standard mortgages
        Most common mode
    end note
    
    note right of BEGIN
        Payments at period start
        Annuities due
        Beginning of period
    end note
```

## Error Handling Flow

```mermaid
graph TD
    A[TVM Calculation Request] --> B{Valid Inputs?}
    B -->|No| C[Error 0: Invalid Input]
    B -->|Yes| D[Start Calculation]
    
    D --> E{Method Type?}
    E -->|Closed Form| F[Direct Calculation]
    E -->|Iterative| G[Newton-Raphson]
    
    F --> H{Math Error?}
    H -->|Division by 0| I[Error 0]
    H -->|Overflow| J[Error 9]
    H -->|No Error| K[Return Result]
    
    G --> L{Start Iteration}
    L --> M[Calculate f and f']
    M --> N{Derivative too small?}
    N -->|Yes| O[Error 7: Invalid]
    N -->|No| P[Update Guess]
    
    P --> Q{Converged?}
    Q -->|Yes| K
    Q -->|No| R{Max Iterations?}
    R -->|Yes| S[Error 8: No Convergence]
    R -->|No| T{Valid Range?}
    
    T -->|Yes| L
    T -->|No| U{Can use Bisection?}
    U -->|Yes| V[Switch to Bisection]
    U -->|No| W[Error 5: No Solution]
    
    V --> X[Bisection Loop]
    X --> Y{Converged?}
    Y -->|Yes| K
    Y -->|No| Z{Max Iterations?}
    Z -->|Yes| S
    Z -->|No| X
```

---

## Legend

### Diagram Types
- **Graph TB**: Top-to-bottom flow diagrams
- **sequenceDiagram**: Time-based interactions
- **classDiagram**: Object-oriented structure
- **stateDiagram**: State machine transitions

### Color Coding (conceptual)
- 🟦 **Blue**: User interaction points
- 🟩 **Green**: Successful completion paths
- 🟨 **Yellow**: Decision points
- 🟥 **Red**: Error states

### Key Concepts
- **Closed-form**: Direct mathematical formula, fast (< 1ms)
- **Iterative**: Newton-Raphson or bisection, slower (< 100ms)
- **Convergence**: When iterative solver finds accurate answer
- **Bisection**: Fallback method when Newton-Raphson fails

---

*These diagrams show the complete architecture of the TVM implementation. Use them as reference during coding.*
