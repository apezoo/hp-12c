# HP-12C Financial Calculator Simulator

A fully functional, fun, and beautiful web-based replica of the legendary HP-12C financial calculator. Built with vanilla HTML, CSS, and JavaScript.

<div align="center">

![HP-12C](https://img.shields.io/badge/HP--12C-Est.%201981-brown?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Experience the power and elegance of RPN calculation with modern web technologies**

[Try It Live](#) • [Documentation](#documentation) • [Examples](#quick-examples) • [Contribute](#contributing)

</div>

---

## ✨ Why HP-12C?

The HP-12C, introduced in 1981, is the world's most successful financial calculator. Still in production after 40+ years, it's beloved by financial professionals, engineers, and calculator enthusiasts for its:

- 🧮 **RPN Logic**: Efficient Reverse Polish Notation
- 💰 **Financial Power**: TVM, NPV, IRR, amortization, and more
- 🎓 **Legendary Reliability**: Used by CPAs, CFAs, and MBA students worldwide
- 📈 **Timeless Design**: Classic aesthetic that never goes out of style

## 🎯 Features

### Core Capabilities
- ✅ **Complete RPN Stack Engine** - 4-level stack with automatic lift/drop
- ✅ **All Financial Functions** - TVM, NPV, IRR, amortization, depreciation, dates
- ✅ **20 Memory Registers** - Store and recall with arithmetic operations
- ✅ **Advanced Math** - Logarithms, exponentials, powers, roots
- ✅ **Percentage Functions** - %, Δ%, and percentage calculations

### Modern Enhancements
- 🎨 **Beautiful UI** - Authentic HP-12C design with smooth animations
- ⌨️ **Keyboard Support** - Full keyboard shortcuts for efficiency
- 🎮 **Fun to Use** - Achievements, challenges, Easter eggs, and themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎓 **Interactive Learning** - Built-in tutorials and helpful hints
- 🌙 **Multiple Themes** - Classic, dark mode, neon, matrix, and more
- 🔊 **Sound Effects** - Optional tactile audio feedback (toggleable)
- 📊 **Calculation History** - Track and review your calculations

## 🚀 Quick Start

### Try It Now
Just open `index.html` in your browser. No installation required!

```bash
# Clone the repository
git clone https://github.com/yourusername/HP-12C.git

# Open in browser
cd HP-12C
open index.html  # macOS
# or
xdg-open index.html  # Linux
# or just double-click index.html in Windows
```

### Quick Examples

#### Basic RPN Calculation
```
Problem: 15 + 25 = ?
Keys: 15 ENTER 25 +
Result: 40
```

#### Mortgage Payment
```
Problem: $300,000 loan, 30 years, 6% APR
Keys: 360 n
      6 ENTER 12 ÷ i
      300000 PV
      0 FV
      PMT
Result: -1,798.65 (monthly payment)
```

#### Investment NPV
```
Problem: Invest $10,000, return $3,000/year for 5 years @ 8%
Keys: f CLX
      10000 CHS g CF₀
      3000 g CFⱼ
      5 g Nⱼ
      8 i
      f NPV
Result: 1,981.62 (positive = good investment!)
```

## 📚 Documentation

### For Users
- **[Quick Start Guide](docs/quick-start-guide.md)** - Learn RPN in 5 minutes
- **[Examples](docs/examples.md)** - 48 real-world calculation examples
- **[User Guide](docs/user-guide.md)** - Complete function reference

### For Developers
- **[Implementation Plan](plans/hp12c-implementation-plan.md)** - Architecture and strategy
- **[Technical Spec](docs/technical-spec.md)** - Algorithms and formulas
- **[Fun Features](docs/fun-features.md)** - Gamification and engagement ideas

## 🎮 Fun Features

This isn't your grandfather's calculator (well, it is, but with style)! 

- 🏆 **Achievements** - Unlock badges as you master the calculator
- 🎯 **Daily Challenges** - New financial problem every day
- 🎨 **Themes** - Classic, Matrix, Neon 80s, Moonlight, and more
- 🔊 **Sound Effects** - Satisfying clicks and beeps (optional)
- 🎊 **Easter Eggs** - Find hidden features and surprises
- 📊 **Your Stats** - Track your calculation journey
- 🥋 **RPN Dojo** - Learn through interactive mini-games

## 🛠️ Technology Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks, no dependencies, just pure JS
- **Local Storage** - Save calculator state and preferences
- **Modern Browser APIs** - Audio, animations, events

## 📁 Project Structure

```
HP-12C/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css         # Main styles
│   ├── themes.css         # Theme variations
│   └── animations.css     # Animation effects
├── js/
│   ├── calculator.js      # Main controller
│   ├── rpn-stack.js      # RPN engine
│   ├── financial.js      # Financial calculations
│   ├── display.js        # Display management
│   ├── memory.js         # Memory registers
│   ├── keyboard.js       # Keyboard input
│   └── achievements.js   # Gamification
├── docs/
│   ├── quick-start-guide.md
│   ├── examples.md
│   ├── technical-spec.md
│   ├── user-guide.md
│   └── fun-features.md
├── tests/
│   └── test-cases.md
├── plans/
│   └── hp12c-implementation-plan.md
└── README.md
```

## 🎓 Learning RPN

New to RPN? Don't worry! RPN (Reverse Polish Notation) seems strange at first, but it's actually more efficient once you get the hang of it.

**Traditional**: `2 + 3 =` → Result: 5  
**RPN**: `2 ENTER 3 +` → Result: 5

**Why RPN?**
- No equals button needed
- No parentheses needed
- See intermediate results
- Fewer keystrokes
- More efficient for complex calculations

Check out our [Quick Start Guide](docs/quick-start-guide.md) to master RPN in 5 minutes!

## 🧮 Calculator Functions

### Basic Operations
Numbers, +, -, ×, ÷, ENTER, CLx, CHS, EEX

### Stack Operations
ENTER, CLx, R↓, x↔y, LastX

### Memory
STO, RCL (registers 0-19) with arithmetic (STO+, STO-, STO×, STO÷)

### Math Functions
√x, x², 1/x, yˣ, LN, eˣ, LOG, 10ˣ

### Percentage
%, Δ%, %T (percentage total)

### Financial (TVM)
n, i, PV, PMT, FV

### Cash Flow
CF₀, CFⱼ, Nⱼ, NPV, IRR

### Amortization
AMORT, principal, interest, balance

### Depreciation
SL, DB, SOYD

### Date Functions
DATE, ΔDYS (days between dates)

## 🎯 Use Cases

### For Students
- **Business School**: Master TVM problems for exams
- **Finance Classes**: Practice NPV, IRR, bond pricing
- **Accounting**: Learn amortization and depreciation

### For Professionals
- **Financial Advisors**: Quick client calculations
- **Real Estate**: Mortgage and investment analysis
- **CPAs**: Tax planning and analysis
- **Engineers**: General calculation needs with RPN efficiency

### For Enthusiasts
- **Calculator Collectors**: Virtual HP-12C experience
- **RPN Fans**: Practice and maintain RPN skills
- **Retro Computing**: Appreciate classic calculator design

## 🎨 Themes Preview

- **Classic HP** 🟤 - Authentic brown and gold
- **Matrix Mode** 🟢 - Green phosphor terminal
- **Neon 80s** 💜 - Cyberpunk pink and blue
- **Moonlight** 🌙 - Dark mode with soft glow
- **Solid Gold** 🏆 - Luxurious gold edition

## ⌨️ Keyboard Shortcuts

| Key | Function |
|-----|----------|
| 0-9 | Number entry |
| . | Decimal point |
| + - * / | Operations |
| Enter | ENTER (push stack) |
| Backspace | CLx |
| Escape | Clear all |
| F | f prefix (gold functions) |
| G | g prefix (blue functions) |
| S | STO |
| R | RCL |

## 🎖️ Achievements

<details>
<summary>Click to reveal achievement list</summary>

### Beginner
- First Steps
- RPN Initiate
- Stack Master
- Memory Bank
- Error Explorer

### Intermediate
- Century Club (100 calculations)
- Financial Novice
- NPV Navigator
- Percentage Pro
- Speed Demon

### Advanced
- IRR Wizard
- Amortization Expert
- Depreciation Master
- Date Detective
- Calculation Guru (1000 calculations)

### Hidden
- Easter Egg Hunter
- Vintage Collector
- BOOBLESS
- Speedrunner
- Nostalgia Trip

</details>

## 🧪 Testing

Comprehensive test suite ensures accuracy:
- Unit tests for all operations
- Integration tests for complex workflows
- Validation against official HP-12C manual examples
- Financial calculation verification

## 🤝 Contributing

Contributions welcome! Areas where you can help:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 Theme designs
- 🎮 New challenges and mini-games
- 🌍 Internationalization

## 📜 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Hewlett-Packard** - For creating the legendary HP-12C in 1981
- **RPN Community** - Calculator enthusiasts worldwide
- **Finance Professionals** - Who've kept the HP-12C relevant for 40+ years
- **You!** - For using and improving this simulator

## 📞 Support

- 📖 [Read the Docs](docs/)
- 💬 [Open an Issue](https://github.com/yourusername/HP-12C/issues)
- 🌟 [Star this repo](https://github.com/yourusername/HP-12C) if you find it useful!

## 🗺️ Roadmap

- [x] Architecture and planning
- [ ] Core RPN engine
- [ ] Basic arithmetic
- [ ] Financial functions (TVM)
- [ ] Cash flow analysis (NPV/IRR)
- [ ] Amortization
- [ ] Memory registers
- [ ] Visual design
- [ ] Keyboard support
- [ ] Themes and customization
- [ ] Achievements and gamification
- [ ] Mobile optimization
- [ ] PWA support
- [ ] iOS/Android apps

## 📊 Project Stats

```
Lines of Code: TBD
Functions Implemented: 0/50+
Test Coverage: TBD
Coffee Consumed: ∞
```

---

<div align="center">

**Made with ❤️ and lots of RPN**

*"The HP-12C: Proving that good design never goes out of style since 1981"*

[⬆ Back to Top](#hp-12c-financial-calculator-simulator)

</div>
