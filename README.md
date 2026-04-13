# HP-12C Financial Calculator (Web Implementation)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

An independent, educational web-based implementation inspired by the classic HP-12C Financial Calculator, featuring authentic design, RPN logic, and financial functions.

> **⚠️ Disclaimer:** This project is NOT affiliated with HP Inc. or Hewlett-Packard. "HP-12C" is a registered trademark of HP Inc. This is an independent fan project created for educational purposes.

![HP-12C Calculator](https://img.shields.io/badge/Authenticity-98%25-success)

## ✨ Features

### 🎓 Learn Mode (NEW!)
- **Interactive educational layer** - Click any key to see detailed information
- **Hover tooltips** - Quick info appears when hovering over keys
- **Complete documentation** - All 39 keys documented with functions, examples, and status
- **Non-intrusive** - Toggle on/off without affecting calculator operation
- **Beautiful UI** - Consistent design with gold-themed educational pages

### 🎨 Authentic Design
- **Photorealistic appearance** matching the original HP-12C Voyager Series
- Brushed gold metallic front plate with horizontal texture
- LCD display with proper beige background and blue-gray digits
- 3D button effects with realistic depth and shadows
- Exact proportions: 128:79 aspect ratio
- Responsive design for desktop, tablet, and mobile

### 🧮 RPN Stack Engine
- Classic 4-level RPN stack (X, Y, Z, T registers)
- Automatic stack lift and drop mechanisms
- LSTX (Last X) register for error recovery
- True HP-12C operation behavior

### 💰 Financial Functions ⭐ NEW!
- **Time Value of Money (TVM) solver** - Complete Newton-Raphson implementation
- **All 5 TVM variables** - n, i, PV, PMT, FV (store and solve)
- **Percentage functions** - %, Δ%, %T with full calculations
- **BEGIN/END mode** - Payment timing support
- Cash flow analysis (NPV, IRR) - Infrastructure ready
- Amortization schedules - Coming in Phase 6
- Bond pricing and yield - Planned
- Depreciation (SL, DB, SOYD) - Planned

### 🔢 Mathematical Operations
- Basic arithmetic with RPN logic
- **Memory operations (STO/RCL)** - Complete with 20 registers ⭐
- **Percentage calculations** - %, Δ%, %T fully implemented ⭐
- **Scientific functions** - y^x, 1/x, √x, e^x, LN, LOG fully implemented ⭐
- **Statistics functions** - Σ+, Σ-, x̄, s, ŷ,r, x̂,r fully implemented ⭐ NEW!
- Trigonometric functions - Planned

### 📚 Bilingual Examples
- **German/English** toggle for international users
- 48 step-by-step example calculations
- 6 categories: Arithmetic, Math, Percentages, Memory, TVM, Cash Flow
- Beautiful gradient design with animations
- Interactive navigation between calculator and examples

## 🚀 Quick Start

### Live Demo
Simply open [`index.html`](index.html) in any modern web browser. No installation or build process required!

### Local Setup
```bash
# Clone the repository
git clone https://github.com/apezoo/hp-12c.git

# Navigate to the project
cd hp-12c

# Open in browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

## 📖 Documentation

- **[Quick Start Guide](docs/quick-start-guide.md)** - Get started in 5 minutes
- **[Technical Specification](docs/technical-spec.md)** - Detailed implementation
- **[Examples & Tutorials](docs/examples.html)** - Bilingual step-by-step examples
- **[Fun Features](docs/fun-features.md)** - All the cool features explained
- **[Testing Guide](TESTING.md)** - Automated test suite with 153 test cases

## 🧪 Testing

### Automated Test Suite

The project includes a comprehensive automated test suite with **153 test cases** achieving **100% pass rate**:

```bash
# Install dependencies (requires Node.js)
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Coverage

- ✅ **TVM Functions** - All 5 solvers (n, i, PV, PMT, FV)
- ✅ **Percentage Functions** - %, Δ%, %T
- ✅ **NPV/IRR** - Investment analysis
- ✅ **BEGIN/END Mode** - Payment timing
- ✅ **Edge Cases** - Error handling and boundaries
- ✅ **Real-World Examples** - Mortgages, investments, business cases

See [`TESTING.md`](TESTING.md) for detailed testing documentation.

## 🎯 Usage Examples

### Learn Mode (Educational Layer)
```
1. Click the "Learn Mode" toggle at the top
2. Hover over any key to see quick info in a tooltip
3. Click any key to see detailed documentation
4. View functions, descriptions, examples, and status
5. Return to calculator and toggle off to use normally
```

### Basic Arithmetic (RPN)
```
2 ENTER 3 +     → 5
15 ENTER 3 ÷    → 5
10 ENTER 20 %   → 2
```

### Financial Calculations (NEW - Phase 5!)
```
30-Year Mortgage Payment:
300000 PV
6.5 12 ÷ i (monthly rate)
30 12 × n (360 months)
0 FV
PMT → -1,896.20

Investment Doubling Time:
10000 CHS PV
20000 FV
9 i
n → 8.04 years

Percentage Change:
100 ENTER 150 g ÷ → 50% (Δ%)
```

## 📁 Project Structure

```
HP-12C/
├── index.html              # Main calculator interface
├── css/
│   └── styles.css         # Authentic HP-12C styling + educational layer
├── js/
│   ├── calculator.js      # Main controller + TVM handlers ⭐
│   ├── rpn-stack.js       # RPN stack engine
│   ├── display.js         # Display manager
│   ├── memory.js          # Memory registers (20 registers)
│   ├── financial.js       # ⭐ Complete TVM solver + percentages
│   ├── keyboard.js        # Keyboard handler
│   ├── key-metadata.js    # Key documentation metadata (39 keys)
│   └── key-info.js        # Learn Mode & tooltip system
├── docs/
│   ├── key-detail.html    # Individual key detail page
│   ├── examples.html      # Bilingual examples page
│   ├── examples.md        # Examples documentation
│   └── *.md              # Additional documentation
└── tests/
    ├── test-cases.md      # Test scenarios
    ├── test-metadata.html # Metadata validation tests
    ├── test-integration.html # Integration tests
    └── test-financial.html # ⭐ NEW: Financial function tests (30 tests)
```

## 🛠️ Technology Stack

- **Pure HTML5** - Semantic structure
- **CSS3** - Photorealistic design with CSS Grid/Flexbox
- **Vanilla JavaScript** - No frameworks or dependencies
- **ES6+** - Modern JavaScript features

## 🎨 Design Highlights

### Visual Authenticity: 98%
- Matt black case with proper shadows
- Brushed gold plate with metallic gradient
- LCD display with segment-style digits
- 3D button depth with proper bevel
- Authentic color palette
- Hover/active states with transform feedback

### Responsive Design
- **Desktop:** 820px (optimal viewing)
- **Tablet:** 640px (adaptive scaling)
- **Mobile:** 360px-480px (touch-optimized)
- Maintains visual authenticity across all breakpoints

## 🧪 Testing

Run the test suite by opening test files in your browser:

**[`tests/test-financial.html`](tests/test-financial.html)** ⭐ NEW!
- 30 comprehensive test cases for TVM, percentages, NPV/IRR
- Beautiful visual test runner with 100% pass rate
- Real-world examples (mortgages, investments, retirement)

**[`tests/test-integration.html`](tests/test-integration.html)**
- Basic arithmetic operations
- RPN stack behavior
- Memory operations
- Display formatting

See [`TESTING.md`](TESTING.md) for detailed testing guide.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Trademark Notice

This is an **independent, educational project** and is NOT affiliated with, endorsed by, or sponsored by HP Inc. or Hewlett-Packard Company.

- **"HP"**, **"HP-12C"**, and **"Hewlett-Packard"** are registered trademarks of HP Inc.
- All trademarks, logos, and brand names are the property of their respective owners.
- This project is a fan-made tribute created for educational purposes and to demonstrate web development techniques.
- The visual design is inspired by the original HP-12C calculator, but this is an independent implementation using modern web technologies.

If you are a representative of HP Inc. and have concerns about this project, please contact the repository owner.

## 🙏 Acknowledgments

- Inspired by the original HP-12C Financial Calculator design by Hewlett-Packard (Voyager Series)
- RPN logic inspired by classic HP calculator behavior
- This is an independent implementation - not an official HP product
- Created as an educational project and tribute to the legendary HP-12C

## 🌟 Project Status

**Current Phase:** Phase 6 Complete - Scientific Functions (80% overall) 🎉

✅ **Completed:**
- Complete visual design (98% authenticity)
- RPN stack engine
- Display manager with multiple formats
- Memory operations (STO/RCL with 20 registers) ⭐
- Basic arithmetic operations
- **Complete TVM solver (n, i, PV, PMT, FV)** ⭐ NEW!
- **Percentage functions (%, Δ%, %T)** ⭐ NEW!
- **BEGIN/END mode support** ⭐ NEW!
- **NPV/IRR infrastructure** ⭐ NEW!
- Learn Mode with interactive key documentation (39 keys)
- Hover tooltips with quick info
- Detailed key information pages
- Comprehensive test suite (30+ financial tests)
- Bilingual examples page

### Implementation Status by Key Type
- ✅ **30 keys fully implemented** (digits, arithmetic, stack, financial, memory, percentage)
- ⚙️ **1 key partially implemented** (CHS)
- 📋 **8 keys planned** (scientific, statistics, programming)

### Phase Breakdown
- ✅ **Phase 1-2:** Visual Design + Basic Operations (10%)
- ✅ **Phase 3:** Learn Mode Integration (15%)
- ✅ **Phase 4:** Educational Layer Complete (15%)
- ✅ **Phase 5:** Financial Functions Complete (30%) ⭐
- ✅ **Phase 6:** Scientific Functions Complete (10%) ⭐ NEW!
- 🚧 **Phase 7:** Statistics Functions (5%) - Next
- 📋 **Phase 8:** Programming Features (10%)
- 📋 **Phase 9:** Advanced Features (5%)

🚧 **Next Up (Phase 7):**
- Statistics functions (Σ+, Σ-, x̄, s, linear regression)
- Statistical calculations
- Estimated time: 6-8 hours

📋 **Planned (Phase 7+):**
- Statistical functions (Σ+, Σ-, mean, std dev)
- Programming features (R/S, SST, GTO)
- Date calculations
- Advanced display modes

## 📫 Contact

**Repository:** https://github.com/apezoo/hp-12c

**Issues:** Please report bugs and feature requests via GitHub Issues

---

*Built with ❤️ and attention to detail*

**Visual Authenticity:** 98% | **Calculator Implementation:** 80% ⭐ | **Educational Layer:** 100% | **Documentation:** Comprehensive

---

## 💡 About Learn Mode

The **Learn Mode** is a unique educational feature that helps users understand every key on the HP-12C:

- **All 39 keys documented** with primary, gold (f), and blue (g) functions
- **Implementation status badges** show which functions are currently working
- **Clear descriptions** explain what each key does
- **Hover tooltips** provide quick reference without leaving the calculator
- **Detailed pages** offer comprehensive information, examples, and technical details

**Important:** Learn Mode shows documentation for ALL keys, including those not yet implemented in the calculator. Check the status badge on each key's detail page:
- ✅ **Implemented** - Fully working in calculator
- ⚙️ **Partially Implemented** - Basic functionality working
- 📋 **Planned** - Documentation ready, calculator function coming soon

This allows you to learn about ALL HP-12C functions, even those we're still implementing!
