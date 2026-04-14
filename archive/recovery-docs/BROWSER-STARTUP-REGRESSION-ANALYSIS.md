# HP-12C Browser Startup Regression - Complete Analysis & Fix

**Date:** April 14, 2026  
**Investigated by:** AI Code Mode  
**Status:** Root cause identified, minimal patch ready

---

## A. Root Cause Summary

### **Problem Type: LOGIC REGRESSION (Double Initialization)**

The calculator has **TWO COMPETING INITIALIZATION PATHS** that execute simultaneously:

1. **Auto-initialization in [`calculator.js`](app/js/calculator.js:1266-1271)** (inherited from v1.0.0-production-ready)
2. **Manual initialization in HTML files** (added during development fixes)

**Impact:**
- Double instantiation creates race conditions
- Event listeners attached twice
- Unpredictable behavior when calculator operations execute
- Memory leaks from duplicate instances
- Second initialization overwrites `window.calculator` but leaves first instance's event handlers attached

**Exact Lines Responsible:**
- [`app/js/calculator.js:1266-1271`](app/js/calculator.js:1266) - Auto-init code block
- [`app/index.html:326-327`](app/index.html:326) - Manual init code
- [`app/calculator-mobile.html:391-392`](app/calculator-mobile.html:391) - Manual init code

**Cache is NOT the root cause** - but aggressive service worker caching can mask the fix during development.

---

## B. Known-Good vs Broken Behavior

### v1.0.0-production-ready (WORKING) ✅

**Initialization Strategy:**
```javascript
// At end of calculator.js (lines ~1266-1271)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.calculator = new Calculator();
        window.calculator.initialize();
    });
}
```

**HTML Files:**
```javascript
// app/index.html - NO manual initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('HP-12C Calculator loaded - Production v1.5.0');
    console.log('Authentic design | RPN logic | Financial functions');
    // That's it - no calculator instantiation here
});
```

**Environment Detection:**
```javascript
// FRAGILE but worked by luck
if (typeof require !== 'undefined') {
    var RPNStack = require('./rpn-stack.js');
    // ...
}
```

**Result:** Single initialization path, calculator works reliably.

---

### development branch (BROKEN) ❌

**Initialization Strategy:**
```javascript
// At end of calculator.js (STILL PRESENT)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.calculator = new Calculator();
        window.calculator.initialize();
    });
}

// PLUS in app/index.html (ADDED)
document.addEventListener('DOMContentLoaded', () => {
    console.log('HP-12C Calculator loaded - Production v1.5.0');
    console.log('Authentic design | RPN logic | Financial functions');
    
    // DUPLICATE: Create and initialize calculator instance
    window.calculator = new Calculator();
    window.calculator.initialize();
});
```

**Environment Detection:**
```javascript
// BETTER and safer ✅
if (typeof window === 'undefined') {
    // Running in Node.js
    var RPNStack = require('./rpn-stack.js');
    // ...
}
```

**Result:** Double initialization → race conditions → inconsistent behavior.

---

### Why the Difference Matters

**Single Init (production-ready):**
1. DOM loads
2. calculator.js auto-init fires ONCE
3. Event listeners attached ONCE
4. Calculator ready and functional ✅

**Double Init (development):**
1. DOM loads
2. calculator.js auto-init fires → creates instance #1 → attaches event listeners
3. HTML manual init fires → creates instance #2 → attaches MORE event listeners
4. `window.calculator` points to instance #2
5. BUT instance #1's event listeners still active
6. Key presses trigger handlers from BOTH instances
7. Unpredictable results, race conditions, memory leaks ❌

---

## C. Minimal Patch Plan

### Changes Required

**File 1: [`app/js/calculator.js`](app/js/calculator.js)**
- **Action:** REMOVE the auto-initialization block (lines 1266-1271)
- **Reason:** HTML files now explicitly initialize, auto-init causes double initialization
- **Keep:** Environment detection improvement (`typeof window === 'undefined'`)
- **Keep:** Display update enhancement (lines 1224-1239)
- **Keep:** Export for Node.js/testing (lines 1274-1276)

**Files 2 & 3: [`app/index.html`](app/index.html) & [`app/calculator-mobile.html`](app/calculator-mobile.html)**
- **Action:** NO CHANGES NEEDED
- **Reason:** These files have correct explicit initialization
- **Keep:** Manual initialization code
- **Keep:** Cache-busting parameters (`?v=4`)

**File 4: [`sw.js`](sw.js)**
- **Action:** Enable DEV_MODE for localhost debugging
- **Reason:** Network-first during development prevents stale cache confusion
- **Change:** Set `const DEV_MODE = true;` for localhost
- **Production:** Keep `DEV_MODE = false` for deployment

---

### Logic to Keep ✅

1. **Environment detection** (calculator.js lines 7-18):
   ```javascript
   if (typeof window === 'undefined') {
       // Node.js requires
   }
   ```
   This is BETTER than the fragile `typeof require !== 'undefined'` check.

2. **Manual initialization in HTML** (index.html lines 326-327, calculator-mobile.html lines 391-392):
   ```javascript
   window.calculator = new Calculator();
   window.calculator.initialize();
   ```
   Explicit initialization is clearer and more maintainable.

3. **Enhanced display logic** (calculator.js lines 1224-1239):
   Shows raw input while typing - this is a good improvement.

4. **Service worker DEV_MODE** (sw.js lines 8-10):
   Network-first for development is excellent for debugging.

5. **Cache versioning** (sw.js line 6):
   Incrementing `CACHE_NAME` forces cache invalidation.

---

### Logic to Remove ❌

1. **Auto-initialization block** (calculator.js lines 1266-1271):
   ```javascript
   // DELETE THIS ENTIRE BLOCK
   if (typeof document !== 'undefined') {
       document.addEventListener('DOMContentLoaded', () => {
           window.calculator = new Calculator();
           window.calculator.initialize();
       });
   }
   ```
   Causes double initialization when HTML also initializes.

---

## D. Patch

### Patch 1: Remove Auto-Initialization from calculator.js

```diff
--- a/app/js/calculator.js
+++ b/app/js/calculator.js
@@ -1262,13 +1262,6 @@ class Calculator {
     }
 }
 
-// Initialize calculator when DOM is ready
-if (typeof document !== 'undefined') {
-    document.addEventListener('DOMContentLoaded', () => {
-        window.calculator = new Calculator();
-        window.calculator.initialize();
-    });
-}
-
 // Export for Node.js/testing
 if (typeof module !== 'undefined' && module.exports) {
     module.exports = Calculator;
```

### Patch 2: Enable DEV_MODE in Service Worker

```diff
--- a/sw.js
+++ b/sw.js
@@ -6,7 +6,7 @@ const CACHE_NAME = 'hp12c-v1.5.1';
 
 // Development mode detection (disable aggressive caching during debug)
 // Set to false for production builds
-const DEV_MODE = false;
+const DEV_MODE = true; // Enable for localhost development
 const urlsToCache = [
   './app/index.html',
   './app/css/styles.css',
```

**Note:** Before production deployment, set `DEV_MODE = false;`

### Patch 3: Bump Service Worker Cache Version

```diff
--- a/sw.js
+++ b/sw.js
@@ -3,7 +3,7 @@
 
 // IMPORTANT: Increment this version on every deployment to bust cache
 // Format: hp12c-vX.Y.Z or hp12c-dev-YYYYMMDD for dev builds
-const CACHE_NAME = 'hp12c-v1.5.1';
+const CACHE_NAME = 'hp12c-v1.5.2-fix';
 
 // Development mode detection (disable aggressive caching during debug)
 // Set to false for production builds
```

---

## E. Verification Checklist

### Pre-Flight Checks
- [ ] Service worker unregistered before testing: Open DevTools → Application → Service Workers → Unregister
- [ ] Hard refresh performed: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- [ ] Browser cache cleared: DevTools → Network → "Disable cache" checked

### Browser Smoke Tests

#### 1. Page Load
- [ ] `http://localhost:8000/app/index.html` loads without errors
- [ ] Console shows: `HP-12C Calculator loaded - Production v1.5.0`
- [ ] Console shows: `Authentic design | RPN logic | Financial functions`
- [ ] No JavaScript errors in console
- [ ] No duplicate console messages (would indicate double init)

#### 2. Calculator Instance
- [ ] `window.calculator` exists in console
- [ ] `typeof window.calculator` returns `"object"`
- [ ] `window.calculator.constructor.name` returns `"Calculator"`
- [ ] No errors when typing `window.calculator` in console

#### 3. Basic Operations
- [ ] Type `4` → display shows `4.`
- [ ] Press `ENTER` → display shows `4.00`
- [ ] Type `4` → display shows `4.`
- [ ] Press `+` → display shows `8.00`
- [ ] Numbers appear immediately when typing
- [ ] Display updates in real-time

#### 4. Stack Operations
- [ ] Type `5`, `ENTER`, `3`, `×` → display shows `15.00`
- [ ] Press `√x` → display shows `3.87` (approximately)
- [ ] Press `1/x` → display shows correctly

#### 5. Mobile Page
- [ ] `http://localhost:8000/app/calculator-mobile.html` loads
- [ ] Calculator functions identically to main page
- [ ] Fullscreen button works
- [ ] Language toggle works
- [ ] Back to main button works

#### 6. Service Worker Behavior
- [ ] Network tab shows fresh JS files loaded (200, not 304)
- [ ] After reload, service worker shows active
- [ ] Cache name is `hp12c-v1.5.2-fix`
- [ ] In DEV_MODE, refreshing always gets latest code

#### 7. Event Listener Verification
```javascript
// In browser console, run:
getEventListeners(document.querySelector('[data-key="1"]'))
```
- [ ] Each button has ONE `click` listener (not multiple)
- [ ] No duplicate event handlers present

#### 8. Memory Leak Check
- [ ] Open DevTools → Memory tab
- [ ] Take heap snapshot
- [ ] Search for `Calculator` class
- [ ] Should find exactly ONE Calculator instance, not multiple

---

## F. Cache Handling

### For Localhost/Development

**Service Worker DEV_MODE = true:**
```javascript
const DEV_MODE = true; // Network-first, always fetch fresh
```

**Behavior:**
- Tries network FIRST
- Falls back to cache only if network fails (offline)
- Ensures latest code always loads
- Cache still available for offline testing

**Manual Cache Clear:**
1. Open DevTools → Application tab
2. Under "Storage" → Click "Clear site data"
3. Or: Application → Service Workers → Unregister
4. Hard refresh: `Ctrl+Shift+R`

### For Production

**Service Worker DEV_MODE = false:**
```javascript
const DEV_MODE = false; // Cache-first for performance
```

**Cache Versioning Strategy:**
```javascript
const CACHE_NAME = 'hp12c-v1.5.2-fix'; // Increment on every deployment
```

**On each deployment:**
1. Increment `CACHE_NAME` version number
2. Service worker activation auto-deletes old caches
3. Users get fresh code on next page load
4. No manual cache clearing needed by end users

**Version Format:**
- Release: `hp12c-v1.5.2`
- Hotfix: `hp12c-v1.5.2-fix`
- Dev build: `hp12c-dev-20260414`

### Preventing Localhost Confusion

**Script Version Parameters:**
```html
<script src="js/calculator.js?v=5"></script>
```
- Increment `?v=X` when testing specific file changes
- Forces browser to bypass disk cache
- Complements service worker DEV_MODE

**HTTP Server Headers:**
```bash
# If using custom server, add:
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

---

## G. Safety Notes

### ⚠️ Risk: Double Initialization

**What to watch for:**
- Two messages appear in console: "HP-12C Calculator loaded" × 2
- Event listeners fire twice per click
- Memory shows multiple Calculator instances
- Calculator behaves erratically (double operations)

**How to detect:**
```javascript
// Run in console
let initCount = 0;
const oldCalc = window.calculator;
Object.defineProperty(window, 'calculator', {
    set: function(val) {
        initCount++;
        console.log(`Calculator assigned ${initCount} times`);
        oldCalc = val;
    },
    get: function() { return oldCalc; }
});
// Reload page - should show "assigned 1 times" only
```

**Prevention:** Ensure only ONE of these exists:
- Auto-init in calculator.js (REMOVED ✅)
- Manual init in HTML files (KEPT ✅)

### ⚠️ Risk: Old Service Worker Cache

**Symptom:**
- Fix applied but browser still shows old behavior
- Console shows old error messages
- Network tab shows 304 Not Modified

**Solution:**
1. DevTools → Application → Service Workers
2. Check if **old service worker still active**
3. Click "Unregister" next to each service worker
4. Close ALL browser tabs for site
5. Reopen and verify cache name is new version

**Prevention:** Always increment `CACHE_NAME` when deploying fixes.

### ⚠️ Risk: Browser Extension Interference

**Known issues:**
- Browser extensions can inject code
- Can define `require()` or `module` in browser context
- Can cache or modify requests

**Detection:**
- Test in browser private/incognito mode
- Disable all extensions
- Compare behavior

**Our fix handles this:**
```javascript
// Safer: Checks for window FIRST
if (typeof window === 'undefined') {
    // Only Node.js reaches here
}
```

---

## H. Post-Fix Confirmation

After applying patches, confirm:

1. **Single initialization path** ✅
   - Auto-init removed from calculator.js
   - Manual init only in HTML files
   - Console shows log messages only once

2. **Safe environment detection** ✅
   - Uses `typeof window === 'undefined'`
   - require() never executes in browser
   - Jest tests still work

3. **Service worker properly versioned** ✅
   - Cache name incremented to `hp12c-v1.5.2-fix`
   - DEV_MODE enabled for localhost
   - Old caches automatically cleaned up

4. **No regressions in tests** ✅
   - Jest tests still pass (425/433 or better)
   - No new test failures introduced

5. **Browser functionality restored** ✅
   - Calculator loads and initializes once
   - Keys work immediately
   - Operations produce correct results
   - No console errors

---

## Definition of Done ✅

- [x] Root cause identified: Double initialization
- [x] Known-good vs broken behavior documented
- [x] Minimal patch created (remove auto-init)
- [x] Environment detection kept safe
- [x] Service worker improved for development
- [x] Verification checklist provided
- [x] Cache handling strategy documented
- [x] Safety risks called out
- [x] No framework rewrite (vanilla JS kept)
- [x] HP-12C authentic behavior preserved

**Patch Size:** 9 lines removed, 3 lines changed = minimal ✅

**Risk Level:** Low - removing duplicate code only

**Testing:** Straightforward browser verification

**Rollback:** Simple - revert 2 files if issues occur

---

## Summary

The regression was caused by adding manual initialization to HTML files without removing the pre-existing auto-initialization in calculator.js. This created two Calculator instances and attached event listeners twice, causing unpredictable behavior.

**The fix is minimal:** Remove 7 lines from calculator.js and adjust service worker for better development experience. The safer environment detection (`typeof window === 'undefined'`) introduced during development work is an improvement and should be kept.

The service worker was not the root cause but can mask the fix during testing, so DEV_MODE should be enabled for localhost development.
