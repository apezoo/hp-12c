# HP-12C Architecture Overview

## 📐 System Architecture

This document provides a high-level architectural overview of the HP-12C calculator simulator.

## 🎯 Design Philosophy

**Core Principles**:
1. **Authenticity First**: Replicate HP-12C behavior accurately
2. **Modern Enhancement**: Add features that improve UX without compromising authenticity
3. **No Dependencies**: Pure vanilla JavaScript for maximum portability
4. **Progressive Enhancement**: Core features work, advanced features enhance
5. **Performance**: Smooth, responsive, < 50ms interactions
6. **Accessibility**: Keyboard navigation, screen reader support
7. **Fun Factor**: Delightful without being distracting

## 🏛️ Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                 Presentation Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │   HTML   │  │   CSS    │  │Animations│         │
│  │  Layout  │  │  Themes  │  │  Effects │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│              Application Layer                      │
│  ┌──────────────────────────────────────┐          │
│  │      Calculator Controller           │          │
│  │  - Event routing                     │          │
│  │  - State management                  │          │
│  │  - Feature coordination              │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│               Business Logic Layer                  │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐           │
│  │   RPN   │  │Financial│  │  Math    │           │
│  │  Stack  │  │ Engine  │  │Functions │           │
│  └─────────┘  └─────────┘  └──────────┘           │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐           │
│  │ Memory  │  │ Display │  │Keyboard  │           │
│  │Manager  │  │Manager  │  │ Handler  │           │
│  └─────────┘  └─────────┘  └──────────┘           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│                Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐               │
│  │Local Storage │  │  State Store │               │
│  │- Preferences │  │  - Stack     │               │
│  │- Achievements│  │  - Registers │               │
│  │- History     │  │  - Display   │               │
│  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

## 🧩 Component Breakdown

### Core Components

#### 1. RPN Stack Engine ([`js/rpn-stack.js`](../js/rpn-stack.js))
**Responsibility**: Manage 4-level stack with automatic lift/drop

**Key Functions**:
- `push(value)`: Add value to stack
- `pop()`: Remove and return X
- `lift()`: Duplicate X to Y, lift stack
- `drop()`: Drop stack after operation
- `roll()`: Roll down (R↓)
- `swap()`: Exchange X and Y

**State**:
```javascript
{
  x: 0,     // Display register
  y: 0,     // Second level
  z: 0,     // Third level
  t: 0,     // Top level
  lastX: 0  // Last X value
}
```

#### 2. Financial Engine ([`js/financial.js`](../js/financial.js))
**Responsibility**: All financial calculations

**Modules**:
- **TVM Calculator**: Time value of money
- **NPV/IRR**: Cash flow analysis
- **Amortization**: Loan schedules
- **Depreciation**: Asset depreciation
- **Date Functions**: Calendar calculations

**Key Algorithms**:
- Newton-Raphson for interest rate
- IRR iteration with convergence
- Amortization schedule generation

#### 3. Display Manager ([`js/display.js`](../js/display.js))
**Responsibility**: Format and show display

**Features**:
- Number formatting (fixed, scientific)
- Decimal place control
- LED-style visualization
- Error message display
- Animation effects

#### 4. Memory Manager ([`js/memory.js`](../js/memory.js))
**Responsibility**: 20 storage registers

**Operations**:
- STO n: Store to register n
- RCL n: Recall from register n
- STO+ n: Add to register n
- STO- n: Subtract from register n
- STO× n: Multiply register n
- STO÷ n: Divide register n

#### 5. Keyboard Handler ([`js/keyboard.js`](../js/keyboard.js))
**Responsibility**: Map keyboard to calculator

**Mappings**:
- Numbers, operators: Direct mapping
- Special keys: Enter, Backspace, Escape
- Prefix keys: F (gold), G (blue)
- Shortcuts: S (STO), R (RCL)

#### 6. Achievement System ([`js/achievements.js`](../js/achievements.js))
**Responsibility**: Track progress and unlock features

**Features**:
- XP and level system
- Unlockable achievements
- Streak tracking
- Stats collection
- Reward system

### Supporting Components

#### Theme Engine ([`css/themes.css`](../css/themes.css))
**Themes**:
- Classic HP (default)
- Matrix Mode
- Neon 80s
- Moonlight
- Solid Gold

#### Animation Engine ([`css/animations.css`](../css/animations.css))
**Effects**:
- Button press
- Stack movement
- Display flicker
- Celebration effects
- Transitions

## 🔄 Data Flow Examples

### Example 1: Simple Calculation (2 + 3)

```
User Input: "2"
  ↓
Display Manager: Update display to "2"
  ↓
User Input: "ENTER"
  ↓
RPN Stack: push(2) → x=2, y=2, z=0, t=0
  ↓
Display Manager: Show "2"
  ↓
User Input: "3"
  ↓
Display Manager: Update display to "3"
  ↓
User Input: "+"
  ↓
RPN Stack: x = y + x → x=5, y=0, z=0, t=0
  ↓
Display Manager: Show "5"
  ↓
Achievement System: Track calculation
```

### Example 2: TVM Calculation

```
User Input: "360 n"
  ↓
Memory Manager: Store 360 in R0 (n register)
  ↓
User Input: "6 ENTER 12 ÷ i"
  ↓
RPN Stack: Calculate 6÷12 = 0.5
Memory Manager: Store 0.5 in R1 (i register)
  ↓
User Input: "200000 PV"
  ↓
Memory Manager: Store 200000 in R2
  ↓
User Input: "0 FV"
  ↓
Memory Manager: Store 0 in R4
  ↓
User Input: "PMT"
  ↓
Financial Engine:
  - Read n, i, PV, FV from registers
  - Calculate PMT using TVM formula
  - Return result
  ↓
RPN Stack: Push result to X
  ↓
Display Manager: Show "-1199.10"
  ↓
Achievement System: Unlock "Financial Novice"
```

### Example 3: Keyboard Shortcut

```
User Press: "5" key
  ↓
Keyboard Handler: Map to calculator button "5"
  ↓
Calculator Controller: Process as number entry
  ↓
Display Manager: Update display
  ↓
User Press: Enter key
  ↓
Keyboard Handler: Map to ENTER button
  ↓
Calculator Controller: Execute ENTER
  ↓
RPN Stack: Lift stack
  ↓
Display Manager: Confirm entry
```

## 🎨 UI Component Structure

```
┌─────────────────────────────────────────────────┐
│              Calculator Container               │
│  ┌─────────────────────────────────────────┐   │
│  │           HP-12C Header                  │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │   LED Display                           │   │
│  │   ┌───────────────────────────────┐    │   │
│  │   │     0.                        │    │   │
│  │   └───────────────────────────────┘    │   │
│  │   [Stack Indicator] [Running]          │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │         Button Grid                     │   │
│  │  [ n ] [ i ] [PV] [PMT][ FV]           │   │
│  │  [ f ] [ g ] [STO][RCL][R/S]           │   │
│  │  [SST][R↓] [x↔y][CLx][ENTER]           │   │
│  │  [ 7 ] [ 8 ] [ 9 ] [ ÷ ]               │   │
│  │  [ 4 ] [ 5 ] [ 6 ] [ × ]               │   │
│  │  [ 1 ] [ 2 ] [ 3 ] [ - ]               │   │
│  │  [ON ] [ 0 ] [ . ] [Σ+] [ + ]          │   │
│  └─────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────┐   │
│  │         Control Panel (Optional)        │   │
│  │  [?] [⚙] [🎨] [🔊] [📊]               │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## 🗄️ State Management

### Global State Object

```javascript
const calculatorState = {
  // Stack
  stack: {
    x: 0,
    y: 0,
    z: 0,
    t: 0,
    lastX: 0
  },
  
  // Memory registers (R0-R19)
  registers: Array(20).fill(0),
  
  // Display
  display: {
    value: "0.",
    format: "fixed",
    decimals: 2
  },
  
  // Input state
  input: {
    isNewNumber: true,
    hasDecimal: false,
    isExponent: false
  },
  
  // Prefix state
  prefix: {
    f: false,  // Gold functions
    g: false   // Blue functions
  },
  
  // Financial registers
  financial: {
    n: 0,    // R0
    i: 0,    // R1
    pv: 0,   // R2
    pmt: 0,  // R3
    fv: 0    // R4
  },
  
  // Cash flows
  cashFlows: [],
  
  // Settings
  settings: {
    theme: "classic",
    sound: true,
    animations: true,
    showStack: false,
    showAchievements: true
  },
  
  // Progress
  progress: {
    calculations: 0,
    streak: 0,
    lastUsed: null,
    xp: 0,
    level: 1,
    achievements: []
  }
};
```

### State Persistence

```javascript
// Save to localStorage
function saveState() {
  localStorage.setItem('hp12c_state', JSON.stringify(calculatorState));
}

// Load from localStorage
function loadState() {
  const saved = localStorage.getItem('hp12c_state');
  if (saved) {
    Object.assign(calculatorState, JSON.parse(saved));
  }
}

// Auto-save on changes
window.addEventListener('beforeunload', saveState);
```

## 🔌 API and Interfaces

### Calculator Controller API

```javascript
class Calculator {
  // Number entry
  enterDigit(digit);
  enterDecimal();
  enterExponent();
  changeSign();
  
  // Operations
  add();
  subtract();
  multiply();
  divide();
  
  // Stack operations
  enter();
  clearX();
  rollDown();
  swapXY();
  
  // Memory
  store(register);
  recall(register);
  
  // Financial
  calculateTVM(solve);
  calculateNPV();
  calculateIRR();
  
  // Display
  setDisplayFormat(type, decimals);
  getDisplay();
  
  // State
  reset();
  getState();
  setState(state);
}
```

### Event System

```javascript
// Custom events for loose coupling
const events = {
  DISPLAY_UPDATE: 'calculator:display',
  STACK_CHANGE: 'calculator:stack',
  ERROR: 'calculator:error',
  ACHIEVEMENT: 'achievement:unlock',
  CALCULATION: 'calculator:calc'
};

// Subscribe to events
document.addEventListener(events.DISPLAY_UPDATE, (e) => {
  updateLED(e.detail.value);
});
```

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Test RPN stack
test('Stack push', () => {
  stack.push(5);
  expect(stack.x).toBe(5);
});

// Test arithmetic
test('Addition', () => {
  calculator.enterDigit(2);
  calculator.enter();
  calculator.enterDigit(3);
  calculator.add();
  expect(calculator.getDisplay()).toBe('5');
});

// Test TVM
test('Loan payment', () => {
  calculator.setN(360);
  calculator.setI(0.5);
  calculator.setPV(200000);
  calculator.setFV(0);
  const pmt = calculator.calculatePMT();
  expect(pmt).toBeCloseTo(-1199.10, 2);
});
```

### Integration Tests
```javascript
// Test complete workflow
test('Complete calculation sequence', () => {
  // Simulate user input
  pressButton('1');
  pressButton('0');
  pressButton('ENTER');
  pressButton('5');
  pressButton('+');
  
  expect(display.value).toBe('15');
  expect(achievements.count).toBeGreaterThan(0);
});
```

## 🚀 Performance Optimization

### Critical Paths
1. **Button Press**: < 16ms (60fps)
2. **Display Update**: < 8ms
3. **Simple Operation**: < 10ms
4. **Financial Calc**: < 500ms
5. **IRR Calculation**: < 2000ms

### Optimization Techniques
- Event delegation for buttons
- Debounce rapid inputs
- Lazy load themes
- Cache formatted numbers
- Use requestAnimationFrame for animations
- Web Workers for heavy calculations (future)

## 📦 Build and Deployment

### Development
```bash
# No build step needed!
# Just open index.html
```

### Production Optimization (Optional)
```bash
# Minify CSS
npx csso styles.css -o styles.min.css

# Minify JavaScript
npx terser calculator.js -o calculator.min.js

# Optimize images
npx imagemin *.png --out-dir=dist
```

### Deployment
```bash
# GitHub Pages
git push origin main

# Netlify
netlify deploy --prod

# Vercel
vercel --prod
```

## 🔒 Security Considerations

### Input Validation
- Sanitize all display output
- Validate numeric ranges
- Prevent XSS through innerHTML
- Use textContent for dynamic content

### Client-Side Security
- No eval() or Function()
- No inline event handlers
- Content Security Policy headers
- Subresource Integrity for CDN (if used)

## 🌐 Browser Compatibility

### Target Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

### Fallbacks
- CSS Grid with flexbox fallback
- Custom properties with fallback colors
- ES6+ with optional transpilation for old browsers

## 📊 Monitoring and Analytics

### Privacy-Friendly Tracking (Local Only)
```javascript
const analytics = {
  calculations: 0,
  mostUsedFunction: {},
  averageTime: 0,
  errorRate: 0,
  sessionTime: 0
};

// No external tracking
// All data stays in browser
```

---

## 🎯 Architecture Goals: Achieved

✅ **Modular**: Clear separation of concerns  
✅ **Maintainable**: Easy to understand and modify  
✅ **Testable**: Components can be tested independently  
✅ **Performant**: Fast and responsive  
✅ **Scalable**: Easy to add new features  
✅ **Accessible**: Keyboard and screen reader support  
✅ **Portable**: No dependencies, runs anywhere  

---

*This architecture supports building a professional, fun, and maintainable HP-12C calculator simulator.*
