# HP-12C Financial Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)](https://web.dev/progressive-web-apps/)

A production-ready, independent web-based implementation inspired by the classic HP-12C Financial Calculator. Features authentic design, RPN logic, comprehensive financial functions, and an interactive learning mode.

> **⚠️ Disclaimer:** This project is NOT affiliated with HP Inc. or Hewlett-Packard. "HP-12C" is a registered trademark of HP Inc. This is an independent educational project created for learning purposes.

## ✨ Features

### 🎓 Interactive Learning Mode
- **Click-to-learn functionality** - Detailed information for all 39 keys
- **Hover tooltips** - Quick reference without interrupting workflow
- **Bilingual support** - Full German/English documentation
- **Non-intrusive toggle** - Learn without affecting calculator operation

### 🎨 Authentic Design
- **Photorealistic appearance** matching the original HP-12C Voyager Series
- Brushed gold metallic front plate with realistic texture
- Accurate LCD display with proper beige background and blue-gray digits
- 3D button effects with depth and shadows
- Exact 128:79 aspect ratio
- Fully responsive for desktop, tablet, and mobile

### 🧮 Core Functionality

#### RPN Stack Engine
- Classic 4-level stack (X, Y, Z, T registers)
- Automatic stack lift and drop mechanisms
- LSTX (Last X) register for error recovery
- True HP-12C operation behavior

#### Financial Functions 💰
- **Time Value of Money (TVM)** - Newton-Raphson solver for n, i, PV, PMT, FV
- **Cash Flow Analysis** - NPV and IRR calculations
- **Amortization** - Complete loan payment schedules (AMORT, INT)
- **Depreciation** - SL, DB, and SOYD methods
- **Percentage Functions** - %, Δ%, %T with full calculations
- **BEGIN/END mode** - Payment timing support

#### Date Functions 📅
- **Date Formats** - D.MY (European) and M.DY (US)
- **ΔDYS** - Calculate days between dates
- **DATE** - Calculate date N days in future/past
- **Day of Week** - Returns 1=Monday through 7=Sunday
- **Leap Year Handling** - Accurate Gregorian calendar support

#### Mathematical Operations 🔢
- **Memory** - 20 registers (STO/RCL 0-9 plus .0-.9)
- **Percentage calculations** - %, Δ%, %T
- **Scientific functions** - y^x, 1/x, √x, e^x, LN, LOG
- **Statistics** - Σ+, Σ-, x̄, s, ŷ,r, x̂,r, linear regression
- **Display formats** - FIX n (0-9 decimals), SCI n (scientific notation)
- **Utility functions** - 12×, 12÷, INTG, FRAC

### 📱 Progressive Web App (PWA)
- Installable on desktop and mobile devices
- Offline functionality with service worker
- App-like experience when installed

## 🚀 Quick Start

### Option 1: Open Locally (No Installation)
Simply open [`app/index.html`](app/index.html) in any modern web browser. No build process or server required!

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hp-12c.git
cd hp-12c

# Open in browser
open app/index.html        # macOS
xdg-open app/index.html    # Linux
start app\index.html       # Windows
```

### Option 2: Local Development Server
For full PWA functionality and hot-reload during development:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (npx)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/app/` in your browser.

### Option 3: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `app/index.html`
3. Select "Open with Live Server"

## 📁 Project Structure

```
HP-12C/
├── app/                          # Main application directory
│   ├── index.html               # Main entry point (production-ready, no inline styles)
│   ├── css/                     # Stylesheets
│   │   ├── styles.css          # Main calculator styles (authentic design)
│   │   └── components.css      # UI component styles (extracted from inline)
│   ├── js/                      # JavaScript modules (fully modular)
│   │   ├── calculator.js       # Main calculator controller
│   │   ├── rpn-stack.js        # RPN stack engine
│   │   ├── display.js          # Display management
│   │   ├── memory.js           # Memory registers (STO/RCL)
│   │   ├── financial.js        # TVM, NPV, IRR, amortization
│   │   ├── statistics.js       # Statistical functions
│   │   ├── date-functions.js   # Date calculations
│   │   ├── depreciation.js     # Depreciation methods
│   │   ├── keyboard.js         # Keyboard input handling
│   │   ├── i18n.js            # Internationalization (DE/EN)
│   │   ├── key-metadata.js     # Key function metadata
│   │   └── key-info.js         # Learning mode UI
│   └── assets/                  # Static assets
│       ├── README.md           # Instructions for adding icons
│       └── .gitkeep            # Keep directory in git
│
├── docs/                        # Documentation
│   ├── examples.html           # Interactive examples (bilingual)
│   ├── examples.md             # Example calculations
│   ├── LEARNING-MODE-GUIDE.md  # Learning mode documentation
│   ├── quick-start-guide.md    # User quick start guide
│   ├── technical-spec.md       # Technical specifications
│   ├── fun-features.md         # Feature highlights
│   └── key-detail.html         # Key detail modal template
│
├── tests/                       # Test suite (Jest)
│   ├── *.test.js               # Unit tests (301 tests)
│   ├── test-helpers.js         # Test utilities
│   ├── test-financial.html     # Manual testing page
│   ├── README.md               # Testing documentation
│   ├── SETUP.md                # Test setup guide
│   └── TESTING.md              # Testing methodology
│
├── archive/                     # Historical documents
│   ├── phases/                 # Development phase summaries
│   └── *.md                    # Old planning documents
│
├── plans/                       # Design and architecture docs
│   ├── ARCHITECTURE.md         # System architecture
│   ├── DESIGN-SPEC.md          # Design specifications
│   └── *.md                    # Implementation plans
│
├── manifest.json                # PWA manifest
├── sw.js                        # Service worker for offline functionality
├── .nojekyll                    # GitHub Pages configuration
├── .gitignore                   # Git ignore rules
├── package.json                 # npm dependencies (Jest for testing)
├── jest.config.js               # Jest configuration
├── LICENSE                      # MIT License
└── README.md                    # This file
```

## 🧪 Testing

### Run Automated Tests

The project includes a comprehensive test suite with **301 test cases** covering all calculator functions.

```bash
# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:financial    # Financial functions
npm run test:tvm          # Time Value of Money
npm run test:percentage   # Percentage calculations
```

### Manual Testing

Open [`tests/test-financial.html`](tests/test-financial.html) in a browser for interactive testing of financial functions.

### Test Coverage

- ✅ **RPN Stack Operations** - 45 tests
- ✅ **Financial Functions** - 87 tests (TVM, NPV, IRR, Amortization)
- ✅ **Date Functions** - 87 tests (ΔDYS, DATE, formats, leap years)
- ✅ **Depreciation** - 42 tests (SL, DB, SOYD)
- ✅ **Statistics** - 24 tests (Σ+, Σ-, x̄, s, regression)
- ✅ **Scientific Functions** - 28 tests (y^x, √x, e^x, LN, LOG)
- ✅ **Display Formats** - 21 tests (FIX, SCI, rounding)
- ✅ **Percentage Functions** - 18 tests (%, Δ%, %T)
- ✅ **Utility Functions** - 15 tests (12×, 12÷, INTG, FRAC)

## 🚀 Deployment

### GitHub Pages

1. Push your code to GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. Go to repository Settings → Pages
3. Set source to "main" branch and "/" root
4. Access your app at `https://YOUR_USERNAME.github.io/hp-12c/app/`

The `.nojekyll` file is already included to ensure proper deployment.

### Netlify

1. Create a `netlify.toml` in the root:
```toml
[build]
  publish = "app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect your GitHub repository to Netlify
3. Deploy automatically on every push

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository through the Vercel dashboard.

### Self-Hosted

Simply copy the entire `app/` directory to your web server. No build step required!

```bash
# Example: Copy to Apache web root
cp -r app/* /var/www/html/hp12c/

# Example: Using rsync
rsync -avz app/ user@server:/var/www/html/hp12c/
```

## 💻 Development

### Code Structure

The application follows a modular architecture with no frameworks or build tools required:

- **Pure Vanilla JavaScript** - No dependencies, runs anywhere
- **ES5 Compatible** - Works in all modern browsers
- **Modular Design** - Each JS file handles a specific concern
- **No Build Step** - Edit and refresh, that's it!

### Key Modules

- **[`calculator.js`](app/js/calculator.js)** - Main controller, orchestrates all functions
- **[`rpn-stack.js`](app/js/rpn-stack.js)** - RPN stack implementation with automatic lift/drop
- **[`financial.js`](app/js/financial.js)** - TVM solver, NPV, IRR, amortization
- **[`display.js`](app/js/display.js)** - Display formatting and management
- **[`i18n.js`](app/js/i18n.js)** - Bilingual support (German/English)

### Adding New Features

1. Determine which module should handle the new functionality
2. Add the function to the appropriate module
3. Update [`key-metadata.js`](app/js/key-metadata.js) if adding a new key function
4. Write tests in `tests/` directory
5. Update documentation

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

- **[Quick Start Guide](docs/quick-start-guide.md)** - Get started in 5 minutes
- **[Technical Specification](docs/technical-spec.md)** - Detailed implementation
- **[Learning Mode Guide](docs/LEARNING-MODE-GUIDE.md)** - Educational features
- **[Examples & Tutorials](docs/examples.html)** - 48 step-by-step examples
- **[Fun Features](docs/fun-features.md)** - Feature highlights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the iconic HP-12C Financial Calculator
- HP-12C is a registered trademark of HP Inc.
- This is an independent educational project with no official affiliation

## 📊 Project Status

**Version:** 1.5.0  
**Status:** Production Ready ✅  
**Test Coverage:** 301 passing tests  
**Functions Implemented:** 95% of HP-12C functionality

### Implemented ✅
- RPN Stack Engine
- Time Value of Money (TVM)
- Cash Flow Analysis (NPV, IRR)
- Amortization
- Depreciation (SL, DB, SOYD)
- Date Functions
- Scientific Functions
- Statistical Functions
- Memory Registers
- Display Formats
- Learning Mode
- Bilingual Support (DE/EN)
- PWA Support

### Future Enhancements 🚧
- Bond pricing and yield calculations
- Trigonometric functions
- More example calculations
- Video tutorials
- Mobile app versions

## 📞 Support

If you encounter any issues or have questions:
1. Check the [documentation](docs/)
2. Review [existing issues](https://github.com/YOUR_USERNAME/hp-12c/issues)
3. Open a [new issue](https://github.com/YOUR_USERNAME/hp-12c/issues/new) if needed

---

**Made with ❤️ for the financial calculator community**

*Last updated: April 2026*
