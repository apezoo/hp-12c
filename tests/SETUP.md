# Test Setup Instructions

Quick guide to get the test suite running.

## Prerequisites

### Install Node.js and npm

#### Ubuntu/Debian/Linux Mint

```bash
sudo apt update
sudo apt install nodejs npm
```

Verify installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show v9.x or higher
```

#### macOS

Using Homebrew:
```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

#### Windows

Download installer from [nodejs.org](https://nodejs.org/) or use Chocolatey:
```bash
choco install nodejs
```

## Installation

1. **Navigate to project directory**
   ```bash
   cd /path/to/HP-12C
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This installs Jest and all testing dependencies defined in `package.json`.

3. **Verify installation**
   ```bash
   npm test
   ```

   You should see all tests pass:
   ```
   Test Suites: 4 passed, 4 total
   Tests:       71 passed, 71 total
   ```

## Quick Test Commands

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:tvm          # TVM calculations
npm run test:percentage   # Percentage functions
npm run test:financial    # Financial engine core

# Development mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Verbose output
npm run test:verbose
```

## Troubleshooting

### Issue: "Command 'npm' not found"

**Solution**: Install Node.js using instructions above.

### Issue: "Cannot find module 'jest'"

**Solution**: Run `npm install` in the project directory.

### Issue: Tests fail immediately

**Solution**: 
1. Verify `js/financial.js` exists
2. Check that it has the Node.js export at the end:
   ```javascript
   if (typeof module !== 'undefined' && module.exports) {
       module.exports = FinancialEngine;
   }
   ```

### Issue: "npm ERR! missing script: test"

**Solution**: Verify `package.json` exists in project root with test scripts defined.

## File Structure

After installation, you should have:

```
HP-12C/
├── node_modules/        # Dependencies (created by npm install)
├── tests/
│   ├── test-helpers.js
│   ├── financial-engine.test.js
│   ├── tvm.test.js
│   ├── percentage.test.js
│   ├── npv-irr.test.js
│   └── README.md
├── js/
│   └── financial.js     # Must have Node.js export
├── package.json         # Defines dependencies and scripts
└── .gitignore          # Excludes node_modules from git
```

## Next Steps

Once tests are running:

1. Read [`tests/README.md`](README.md) for detailed test documentation
2. Review [`TESTING.md`](../TESTING.md) for testing strategy
3. Run `npm run test:coverage` to see coverage reports
4. Use `npm run test:watch` during development

## Support

If you encounter issues not covered here:

1. Check Node.js version: `node --version` (should be v16+ recommended v18+)
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
4. Check that you're in the correct directory (project root with package.json)

## That's It!

You're ready to run tests. Use `npm test` to verify all financial functions work correctly.
