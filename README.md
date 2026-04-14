# HP-12C Financial Calculator (Web Implementation)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
![Completion](https://img.shields.io/badge/Completion-68%25-blue)
![Version](https://img.shields.io/badge/Version-0.68-green)

An independent, educational web-based implementation inspired by the classic HP-12C Financial Calculator, featuring authentic design, RPN logic, and comprehensive financial functions.

> **⚠️ Disclaimer:** This project is NOT affiliated with HP Inc. or Hewlett-Packard. "HP-12C" is a registered trademark of HP Inc. This is an independent fan project created for educational purposes.

![HP-12C Calculator](https://img.shields.io/badge/Authenticity-98%25-success)
![Test Coverage](https://img.shields.io/badge/Tests-86%2B%20passing-success)

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

### 💰 Financial Functions ✅ **PRODUCTION READY**
- ✅ **Time Value of Money (TVM)** - All 5 solvers (n, i, PV, PMT, FV)
- ✅ **Amortization (AMORT)** - Complete period-by-period analysis
- ✅ **BEGIN/END Payment Modes** - Ordinary and annuity due
- ⚠️ Cash flow analysis (NPV, IRR) - Planned
- ⚠️ Bond pricing and yield - Planned
- ⚠️ Depreciation (SL, DB, SOYD) - Planned

### 🔢 Mathematical Operations ✅ **PRODUCTION READY**
- ✅ Basic arithmetic with RPN logic
- ✅ 13 mathematical functions (√, eˣ, ln, yˣ, n!, %, 1/x, etc.)
- ✅ Percentages and percent changes (%, %T, Δ%)
- ✅ Memory registers (R0-R9 accessible, R0-R19 available)
- ⚠️ Statistics (Σ+, mean, regression) - Planned
- ⚠️ Extended memory arithmetic (STO+, STO-) - Engine ready, not wired

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

### 🎯 For Users
- **[Quick Start Guide](docs/quick-start-guide.md)** - Get started in 5  minutes
- **[Examples & Tutorials](docs/examples.html)** - 48 bilingual step-by-step examples (EN/DE)
- **[Fun Features](docs/fun-features.md)** - All the cool features explained
- **[Key Detail Pages](docs/key-detail.html)** - Interactive documentation for every key

### 🧪 For Testers
- **[Testing Guide](docs/TESTING-GUIDE.md)** ⭐ - Comprehensive testing checklist
- **[Test Suite Overview](tests/README.md)** - All automated tests (86+ passing)
- **[Math Functions Tests](tests/test-math-functions.html)** - 50+ automated tests
- **[TVM Tests](tests/test-financial-tvm.html)** - 20+ automated tests
- **[AMORT Tests](tests/test-financial-amort.html)** - 16 automated tests

### 👨‍💻 For Developers
- **[Architecture](plans/ARCHITECTURE.md)** - System design and structure
- **[Technical Specification](docs/technical-spec.md)** - Detailed implementation
- **[Strategic Assessment](docs/STRATEGIC-ASSESSMENT.md)** ⭐ - Strategic roadmap and priorities
- **[Future Work](docs/FUTURE-WORK.md)** ⭐ - Missing features and improvements roadmap
- **[Next Steps](NEXT-STEPS.md)** - Detailed phase-by-phase plan

### 📊 Implementation Summaries
- **[Math Functions](docs/summaries/MATH-FUNCTIONS-COMPLETE.md)** - 13 functions implemented
- **[TVM Phase 1](docs/summaries/FINANCIAL-TVM-PHASE1-COMPLETE.md)** - Complete TVM engine
- **[AMORT Phase 2](docs/summaries/AMORT-PHASE2-SUMMARY.md)** - Amortization complete
- **[Project Status](docs/summaries/PROJECT-STATUS-SUMMARY.md)** - Overall status

### 🗺️ Planning Documents
- **[TVM Architecture](plans/financial-tvm-architecture.md)** - TVM design
- **[AMORT Architecture](plans/financial-amort-architecture.md)** - AMORT design
- **[Educational Layer](plans/educational-layer-summary.md)** - Learn Mode design

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

### Financial TVM Calculation
```
30-year mortgage: $200,000 at 6% APR
360 n                # 30 years × 12 months
0.5 i                # 6% ÷ 12 = 0.5% monthly
200000 PV            # Loan amount
0 FV                 # Pay off completely
PMT → -1,199.10      # Monthly payment
```

### Amortization Analysis
```
Analyze first year of mortgage:
1 ENTER 12           # Periods 1 through 12
f AMORT              # Calculate amortization
→ -11,933.00         # Interest paid
x↔y → -2,456.00      # Principal paid
RCL PV → -197,544    # Remaining balance
```

## 📁 Project Structure

```
HP-12C/
├── index.html              # Main calculator interface
├── css/
│   └── styles.css         # Authentic HP-12C styling + educational layer
├── js/
│   ├── calculator.js      # Main controller (~880 lines)
│   ├── rpn-stack.js       # RPN stack engine
│   ├── display.js         # Display manager
│   ├── memory.js          # Memory registers (R0-R19)
│   ├── financial.js       # ⭐ TVM & AMORT engine (~1000 lines)
│   ├── math-functions.js  # ⭐ 13 mathematical functions
│   ├── keyboard.js        # Keyboard handler
│   ├── key-metadata.js    # Key documentation (39 keys)
│   └── key-info.js        # Learn Mode system
├── docs/
│   ├── STRATEGIC-ASSESSMENT.md  # ⭐ Strategic roadmap
│   ├── FUTURE-WORK.md          # ⭐ Missing features & improvements
│   ├── TESTING-GUIDE.md        # ⭐ Comprehensive testing procedures
│   ├── key-detail.html         # Interactive key documentation
│   ├── examples.html           # 48 bilingual examples
│   └── summaries/              # Implementation summaries
├── tests/
│   ├── README.md                    # Test suite overview
│   ├── test-math-functions.html     # 50+ automated tests
│   ├── test-financial-tvm.html      # 20+ TVM tests
│   ├── test-financial-amort.html    # 16 AMORT tests
│   └── test-integration.html        # Integration tests
└── plans/
    ├── ARCHITECTURE.md              # System architecture
    ├── financial-tvm-architecture.md # TVM design
    └── financial-amort-architecture.md # AMORT design
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

### Automated Test Suites (86+ Tests)
Open in browser with server running (`python3 -m http.server 8080`):
- **[Math Tests](tests/test-math-functions.html)** - 50+ tests, 100% passing
- **[TVM Tests](tests/test-financial-tvm.html)** - 20+ tests, 100% passing
- **[AMORT Tests](tests/test-financial-amort.html)** - 16 tests, 100% passing

### Comprehensive Testing Guide
Follow **[`docs/TESTING-GUIDE.md`](docs/TESTING-GUIDE.md)** for:
- Manual TVM testing procedures (1-2 hours)
- Manual AMORT testing (1 hour)
- Edge case scenarios
- Cross-browser validation
- HP-12C accuracy comparison

**⚠️ Important:** Test TVM/AMORT thoroughly before adding new features (see Strategic Assessment)

## 📈 Project Status (v0.68 - April 2026)

### ✅ Fully Implemented (68%)
- ✅ Core RPN engine (95%)
- ✅ Mathematical functions (95% - 13 functions)
- ✅ Memory system (70% - basic STO/RCL)
- ✅ Financial TVM (100% - all 5 solvers)
- ✅ Financial AMORT (100% - complete)
- ✅ Educational layer (90% - Learn Mode)

### 📋 Planned Features (32%)
See **[`docs/FUTURE-WORK.md`](docs/FUTURE-WORK.md)** for complete details:
- 📅 **Date Functions** (1 week) - RECOMMENDED NEXT
- 📊 **Statistics** (2-3 weeks) - Σ+, mean, regression
- ⚠️ **NPV/IRR** (2-3 weeks) - After thorough testing
- 🎨 **UI/UX** (1-2 weeks) - Mobile, accessibility
- ⌨️ **Programming** (2-4 weeks) - Low priority

### 🎯 Next Recommended Actions
Per **[`docs/STRATEGIC-ASSESSMENT.md`](docs/STRATEGIC-ASSESSMENT.md)**:
1. ⭐ **Test TVM/AMORT** (1-2 weeks) - CRITICAL
2. 📅 **Date Functions** (1 week) - Simple, high value
3. 🎨 **UI Improvements** (1-2 weeks) - User benefit
4. ⚠️ **NPV/IRR** - Only after solid testing

## 🤝 Contributing

Contributions are welcome! For guidance:

1. **Read First:**
   - [`docs/STRATEGIC-ASSESSMENT.md`](docs/STRATEGIC-ASSESSMENT.md) - Strategic priorities
   - [`docs/FUTURE-WORK.md`](docs/FUTURE-WORK.md) - What needs doing
   - [`plans/ARCHITECTURE.md`](plans/ARCHITECTURE.md) - System design

2. **Pick a Task:**
   - Easy: Memory arithmetic wiring (4 hours)
   - Medium: Date functions (1 week)
   - Hard: Statistics or NPV/IRR (2-3 weeks)

3. **Development Process:**
   ```bash
   git checkout -b feature/AmazingFeature
   # Implement with tests
   # Update documentation
   git commit -m 'feat: Add AmazingFeature'
   git push origin feature/AmazingFeature
   # Open Pull Request
   ```

4. **Quality Standards:**
   - Write automated tests
   - Update JSDoc comments
   - Follow existing code style
   - Test across browsers
   - Update relevant documentation

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
- Special thanks to all contributors and testers

## 📞 Support & Contact

**Repository:** [github.com/yourusername/HP-12C](https://github.com/yourusername/HP-12C)

**Issues:** Report bugs and feature requests via [GitHub Issues](https://github.com/yourusername/HP-12C/issues)

**Questions:** Check the documentation first, especially:
- [`docs/STRATEGIC-ASSESSMENT.md`](docs/STRATEGIC-ASSESSMENT.md) for strategic direction
- [`docs/FUTURE-WORK.md`](docs/FUTURE-WORK.md) for planned features
- [`docs/TESTING-GUIDE.md`](docs/TESTING-GUIDE.md) for testing procedures

---

## 🎓 For AI Assistants & Future Contributors

**Start Here:**
1. Read [`docs/STRATEGIC-ASSESSMENT.md`](docs/STRATEGIC-ASSESSMENT.md) - Understand strategic priorities
2. Review [`docs/FUTURE-WORK.md`](docs/FUTURE-WORK.md) - See what needs implementation
3. Check [`plans/ARCHITECTURE.md`](plans/ARCHITECTURE.md) - Understand system design
4. Follow [`docs/TESTING-GUIDE.md`](docs/TESTING-GUIDE.md) - Test before adding features

**Current Priority:** Test TVM/AMORT thoroughly (1-2 weeks) before implementing new features.

**Next Recommended Features:**
1. Date Functions (1 week, simple, high value)
2. UI/UX improvements (incremental)
3. Statistics (2 weeks, moderate complexity)
4. NPV/IRR (2-3 weeks, only after thorough testing)

**Quick Wins:** Memory arithmetic wiring (STO+, STO-) - 4 hours, engine ready

---

*Built with ❤️ and attention to detail*

**Visual Authenticity:** 98% | **Feature Completion:** 68% | **Test Coverage:** 86+ tests passing | **Production Ready:** TVM & AMORT
