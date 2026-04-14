# HP-12C Calculator - Invariant Rules

## Overview

These rules are **NON-NEGOTIABLE** and must be maintained unless a failing browser reproduction proves otherwise. They were established through hard-won debugging sessions where subtle violations caused production failures that unit tests couldn't catch.

## Critical Invariants

### 1. Browser Initialization Must Be Explicit

**Rule:** The calculator instance must be created explicitly within a `DOMContentLoaded` event handler.

**Location:** [`app/index.html`](../app/index.html:323-330), [`app/calculator-mobile.html`](../app/calculator-mobile.html:390-395)

**Correct Pattern:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize calculator instance
    window.calculator = new Calculator();
    window.calculator.initialize();
});
```

**Why This Matters:**
- Ensures all script dependencies have loaded
- Guarantees DOM elements exist before binding
- Prevents race conditions in script execution order
- Makes calculator accessible via `window.calculator` for console debugging

**Never:**
- Initialize at top-level script scope
- Rely on auto-initialization from within calculator.js
- Assume class existence means instance creation

**Test Coverage Gap:**
Unit tests pass without this because Jest doesn't simulate real browser script loading timing.

---

### 2. Environment Detection Must Use `typeof window`

**Rule:** Node.js-only code (CommonJS requires) must be gated by `typeof window === 'undefined'`.

**Location:** [`app/js/calculator.js`](../app/js/calculator.js:8)

**Correct Pattern:**
```javascript
// Only execute in Node.js environment (Jest tests)
if (typeof window === 'undefined') {
    // Running in Node.js
    var RPNStack = require('./rpn-stack.js');
    var DisplayManager = require('./display.js');
    // ... more requires
}
// In browser, all classes are loaded via <script> tags in HTML
```

**Why This Matters:**
- `typeof window === 'undefined'` is true ONLY in Node.js
- `typeof require !== 'undefined'` was WRONG - it's true in both Node AND modern browsers
- Wrong check causes double-loading of classes → "already declared" errors
- Wrong check breaks browser entirely while tests pass

**Never Use:**
- `typeof require !== 'undefined'` (browsers have require!)
- `typeof module !== 'undefined'` (browsers have module!)
- `typeof exports !== 'undefined'` (browsers have exports!)

**Test Coverage Gap:**
Jest doesn't have a `window` object, so wrong check passes tests but fails in browser.

---

### 3. Browser Issues Must Be Verified in Actual Browser

**Rule:** Do not trust unit tests alone. Browser-specific issues require browser verification.

**How to Verify:**
1. Run unit tests: `npm test`
2. Run browser smoke test: Open `tests/browser-smoke-test.html`
3. Manual verification in real browser
4. Check browser console for errors
5. Verify `window.calculator` exists and responds

**Why This Matters:**
- Jest doesn't simulate Service Worker caching
- Jest doesn't simulate script loading order
- Jest doesn't have real DOM timing
- Jest doesn't catch initialization race conditions

**Before Deployment:**
- [ ] Unit tests pass (`npm test`)
- [ ] Browser smoke test passes
- [ ] Manual browser verification
- [ ] Check in multiple browsers (Chrome, Firefox, Safari)
- [ ] Test in Incognito/Private mode (no cache)

---

### 4. Service Worker Cache Must Be Versioned

**Rule:** Every deployment must increment the cache version in [`sw.js`](../sw.js:6).

**Correct Pattern:**
```javascript
const CACHE_NAME = 'hp12c-v1.5.1';  // Increment on each deploy!
```

**Additional Cache Busting:**
Query parameters on script tags in HTML files:
```html
<script src="js/calculator.js?v=4"></script>
```

**Why This Matters:**
- Service Worker serves from cache-first by default
- Stale JavaScript causes "already declared" errors
- Old HTML/CSS creates confusing UX
- Users won't see fixes without version bump

**Never:**
- Deploy without incrementing version
- Assume hard refresh will help users (it won't)
- Ignore service worker during debugging

**During Development:**
Set `DEV_MODE = true` in [`sw.js`](../sw.js:10) to use network-first strategy.

---

### 5. HP-12C Authenticity Over Convenience

**Rule:** When behavior conflicts with convenience, prefer HP-12C-like behavior.

**Key Behaviors:**
- Raw entry display while typing (show what user types)
- Trailing decimal period behavior (HP-12C shows "4." not "4.00")
- Stack lift/drop timing (RPN semantics must be exact)
- Chain operations follow RPN rules strictly
- Display formatting thresholds match HP-12C

**Why This Matters:**
- Project goal is authenticity, not improvement
- HP-12C users expect exact behavior
- Convenience changes confuse experienced users
- Tests should match authentic behavior, not "better" behavior

**When Tests Fail:**
Ask: "What does a real HP-12C do?"
- If test expects `0.00` but HP-12C shows `0.`, fix the test
- If test expects stack behavior that's "more logical" but not authentic, fix the test
- If behavior is genuinely broken on real HP-12C, document the decision to deviate

---

## Architecture Invariants

### 6. Vanilla JS Module Structure

**Rule:** Keep the current vanilla JavaScript modular structure.

**Never:**
- Introduce React, Vue, or other frameworks
- Add webpack, Rollup, or bundlers
- Convert to TypeScript (unless fully committed)
- Add complex build processes

**Why This Matters:**
- Project goal: simplicity and static deployability
- No build step = easy contribution
- Vanilla JS = maximum compatibility
- Educational value in readable code

**Allowed:**
- Additional npm packages for development/testing only
- Better tooling for linting/formatting
- Documentation improvements

---

### 7. File System Structure

**Current Structure:**
```
/app                    # Application code (browser)
  /css                  # Styles
  /js                   # JavaScript modules
  index.html            # Desktop calculator
  calculator-mobile.html # Mobile calculator
/tests                  # Jest unit tests + browser tests
/docs                   # Documentation
/archive                # Historical documentation
sw.js                   # Service Worker (root level)
```

**Rule:** Maintain this structure. New features follow existing patterns.

---

## Testing Invariants

### 8. Test Failures Require Classification

**Rule:** Before "fixing" a failing test, classify it:

1. **Display formatting expectation mismatch**
   - Test expects formatted output
   - Code shows authentic HP-12C output
   - → Fix the test to expect authentic output

2. **Test harness issue**
   - Jest environment differs from browser
   - Mock/stub doesn't match reality
   - → Fix the test harness or document limitation

3. **Real calculator logic issue**
   - Behavior is wrong vs real HP-12C
   - Math is incorrect
   - → Fix the code

**Why This Matters:**
- Failing tests aren't always code bugs
- Test expectations may be wrong
- Don't break working code to satisfy wrong tests

---

## Emergency Overrides

### When You Can Break These Rules:

1. **Failing Browser Reproduction:** If you can demonstrate the issue in a real browser with clear steps to reproduce, the rule may be wrong.

2. **Security Vulnerability:** Security always wins over invariants.

3. **Legal/Licensing Issue:** Legal compliance overrides technical preferences.

4. **Accessibility Issue:** WCAG compliance is important, but should be additive not destructive.

### Override Process:

1. Document the browser reproduction case
2. Explain why the invariant fails
3. Propose alternative that maintains spirit of the rule
4. Get review before committing
5. Update this document with new learnings

---

## Related Documentation

- [Service Worker Troubleshooting](./SERVICE-WORKER-TROUBLESHOOTING.md)
- [Browser Smoke Test](../tests/browser-smoke-test.html)
- [Cache Clear Tool](../tests/CLEAR-CACHE.html)
- [Browser Caching Issue Report](../archive/CALCULATOR-BROWSER-CACHING-ISSUE-REPORT.md)
- [Initialization Fix Report](../archive/CALCULATOR-INITIALIZATION-FIX.md)

---

## Quick Reference Checklist

Before committing code changes:
- [ ] Browser initialization remains explicit in DOMContentLoaded
- [ ] Environment detection uses `typeof window === 'undefined'`
- [ ] Service worker cache version incremented (if code changed)
- [ ] Browser smoke test still passes
- [ ] Manual browser verification completed
- [ ] HP-12C authentic behavior preserved
- [ ] No frameworks/bundlers introduced
- [ ] Failing tests classified before "fixing"
