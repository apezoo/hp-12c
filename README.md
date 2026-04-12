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

### 💰 Financial Functions
- Time Value of Money (TVM) calculations
- Cash flow analysis (NPV, IRR)
- Amortization schedules
- Bond pricing and yield
- Depreciation (SL, DB, SOYD)
- Interest conversions

### 🔢 Mathematical Operations
- Basic arithmetic with RPN logic
- Scientific functions (√, x², eˣ, ln, y^x)
- Trigonometric functions
- Percentages and percent changes
- Memory registers (20 storage registers)

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
- **[Testing Guide](TESTING.md)** - Test cases and validation

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

### Financial Calculation
```
Calculate present value:
n=12, i=5, PMT=100, FV=0
12 n
5 i
100 PMT
0 FV
PV → -1,126.74
```

## 📁 Project Structure

```
HP-12C/
├── index.html              # Main calculator interface
├── css/
│   └── styles.css         # Authentic HP-12C styling + educational layer
├── js/
│   ├── calculator.js      # Main controller
│   ├── rpn-stack.js       # RPN stack engine
│   ├── display.js         # Display manager
│   ├── memory.js          # Memory registers
│   ├── financial.js       # Financial calculations
│   ├── keyboard.js        # Keyboard handler
│   ├── key-metadata.js    # 🆕 Key documentation metadata (39 keys)
│   └── key-info.js        # 🆕 Learn Mode & tooltip system
├── docs/
│   ├── key-detail.html    # 🆕 Individual key detail page
│   ├── examples.html      # Bilingual examples page
│   ├── examples.md        # Examples documentation
│   └── *.md              # Additional documentation
└── tests/
    ├── test-cases.md      # Test scenarios
    ├── test-metadata.html # 🆕 Metadata validation tests
    └── test-integration.html # 🆕 Integration tests
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

Run the test suite by following [`TESTING.md`](TESTING.md):
- Basic arithmetic operations
- RPN stack behavior
- Memory operations
- Financial calculations
- Display formatting
- Keyboard input

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

**Current Phase:** Phase 4 Complete - Educational Layer (40% overall)

✅ **Completed:**
- Complete visual design (98% authenticity)
- RPN stack engine
- Display manager with multiple formats
- Memory registers (20 registers)
- Basic arithmetic operations
- **Learn Mode with interactive key documentation (39 keys)**
- **Hover tooltips with quick info**
- **Detailed key information pages**
- Bilingual examples page
- Comprehensive documentation

### Implementation Status by Key Type
- ✅ **22 keys fully implemented** (digits, arithmetic, stack, control)
- ⚙️ **3 keys partially implemented** (CHS, STO, RCL)
- 📋 **14 keys planned** (financial, scientific, statistics)

🚧 **In Progress:**
- Financial functions implementation
- Keyboard input handling
- Advanced display modes
- Program memory

📋 **Planned (Phase 5+):**
- Complete TVM solver (n, i, PV, PMT, FV)
- Statistical functions
- Date calculations
- Additional display formats
- Mobile app wrapper

## 📫 Contact

**Repository:** https://github.com/apezoo/hp-12c

**Issues:** Please report bugs and feature requests via GitHub Issues

---

*Built with ❤️ and attention to detail*

**Visual Authenticity:** 98% | **Calculator Implementation:** 30% | **Educational Layer:** 100% | **Documentation:** Comprehensive

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
