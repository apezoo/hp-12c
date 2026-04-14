# ✅ RECOVERY COMPLETE - Test Instructions

**Branch:** `recovery-from-v1.5.0`  
**Based On:** v1.5.0 (confirmed working by user)  
**Date:** April 14, 2026

---

## What Was Done

### 1. Started from Known-Good Baseline
- Checked out v1.5.0 tag (you confirmed this works)
- Created new branch: `recovery-from-v1.5.0`

### 2. Reorganized to app/ Structure
```
v1.5.0 structure:          Recovery structure:
├── js/                    ├── app/
│   └── calculator.js      │   ├── js/
├── css/                   │   │   └── calculator.js
│   └── styles.css         │   ├── css/
├── docs/                  │   │   └── styles.css
└── index.html             │   ├── docs/
                           │   └── index.html
                           ├── docs/ (root)
                           ├── manifest.json
                           └── sw.js
```

### 3. Preserved Working Initialization Pattern
**CRITICAL:** Kept v1.5.0 initialization pattern that works:

**app/js/calculator.js (end of file):**
```javascript
// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
    window.calculator.initialize();
});
```

**app/index.html:**
```javascript
// NO manual initialization - relies on calculator.js auto-init
<script>
    let calculator;
    
    document.addEventListener('DOMContentLoaded', () => {
        console.log('HP-12C Calculator loaded - Superior authentic design applied');
        // NO calculator instantiation here!
    });
</script>
```

### 4. Updated All Paths
- CSS: `href="css/styles.css"` (relative to app/)
- JS: `src="js/calculator.js"` (relative to app/)
- Docs: `href="../docs/examples.html"` (up to root)
- Manifest: `href="../manifest.json"` (up to root)

### 5. Added PWA Support
- `manifest.json` - PWA manifest
- `sw.js` - Service worker with DEV_MODE=true for development

---

## 🧪 TEST NOW (CRITICAL)

### Step 1: Kill ALL Old Servers
```bash
# Kill any python servers on port 8000
pkill -f "python.*8000"

# Or find and kill manually:
lsof -ti:8000 | xargs kill -9
```

### Step 2: Clear Browser Completely
**IMPORTANT - Do ALL of these:**

1. **Unregister service workers:**
   - Open DevTools (F12)
   - Application tab → Service Workers
   - Click "Unregister" for EVERY service worker listed
   - Refresh the ServiceWorker list - should be empty

2. **Clear all site data:**
   - Application tab → Storage
   - Click "Clear site data" button
   - Confirm

3. **Clear cookies:**
   - Application tab → Cookies
   - Right-click → Clear

4. **Close ALL tabs** for localhost

5. **Restart browser** (complete quit and reopen)

### Step 3: Start Fresh Server
```bash
cd /home/mauerm/tools/scripts/hp-taschenrechner/HP-12C

# Make sure you're on recovery branch
git branch  # Should show: * recovery-from-v1.5.0

# Start on DIFFERENT port to avoid cache
python -m http.server 9000
```

### Step 4: Open Calculator
```
http://localhost:9000/app/index.html
```

**NOT:** `http://localhost:8000` (old port, may have cached SW)

### Step 5: Verify Console
Open DevTools Console - you should see:
```
HP-12C Calculator loaded - Superior authentic design applied
Service Worker installing...
Caching app shell
Service Worker activating...
SW registered: http://localhost:9000/
```

### Step 6: Test Calculator
**Visual Test:**
1. Click button `4` → Should see `4.` or similar in display
2. Click `ENTER` → Should see `4` entered
3. Click `4` again → Should see `4.`
4. Click `+` → Should calculate and show `8.00`

**Console Test:**
```javascript
// Check calculator exists
window.calculator

// Check it's initialized
window.calculator.displayElement

// Manual test
window.calculator.reset()
window.calculator.handleDigit('4')
window.calculator.handleEnter()
window.calculator.handleDigit('4')
window.calculator.performOperation('add')
console.log(window.calculator.stack.x)  // Should be 8
```

---

## ✅ Expected Result

**If Working (Like v1.5.0):**
- ✅ Numbers appear when clicking buttons
- ✅ Display updates in real-time
- ✅ 4 ENTER 4 + = 8 works correctly
- ✅ Console shows calculator loaded message
- ✅ No JavaScript errors
- ✅ Service worker registers successfully

---

## ❌ If Still Broken

### Try Different Browser
- If using Chrome, try Firefox
- If using Firefox, try Chrome
- Fresh browser = no cached service workers

### Try Incognito/Private Mode
- Opens with completely clean state
- No extensions interfering
- No cached service workers

### Check What's Actually Loading
```bash
# Verify server is serving correct file
curl http://localhost:9000/app/js/calculator.js | tail -10
```

Should show:
```javascript
// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
    window.calculator.initialize();
});
```

### Report These:
1. Browser console errors (copy/paste)
2. Network tab - any 404s or failed requests?
3. Result of `window.calculator` in console
4. Result of `typeof Calculator` in console
5. Does `document.getElementById('displayValue')` return element?

---

## 📊 What's Different from v1.5.0

### Same (Preserved):
- ✅ Initialization pattern (auto-init in calculator.js)
- ✅ All JavaScript logic
- ✅ All CSS
- ✅ All functionality

### Different (Improved):
- ✅ File structure (organized in app/ directory)
- ✅ PWA support (manifest.json, sw.js)
- ✅ Service worker with network-first in dev mode
- ✅ Updated paths to work with new structure

---

## 🎯 What This Fixes

### Previous Problem:
- Commit e43512f added manual init to HTML
- Did NOT remove auto-init from calculator.js
- Result: Double initialization → broken

### Recovery Solution:
- Started from v1.5.0 (working)
- Reorganized files to app/ structure
- Preserved SINGLE auto-init pattern
- NO manual init in HTML
- Result: Should work exactly like v1.5.0

---

## 📝 Next Steps After Testing

### If Test Succeeds ✅
```bash
# Replace development branch with this working recovery
git checkout development
git reset --hard recovery-from-v1.5.0
git push --force origin development

# Or merge if preferred
git checkout development
git merge recovery-from-v1.5.0 --strategy=theirs
git push origin development
```

### If Test Fails ❌
Then we need to:
1. Verify v1.5.0 STILL works at root level: `http://localhost:9000/index.html`
2. If root works but app/ doesn't: path issue
3. If neither works: environment/browser issue

---

## 🔍 Verification Commands

```bash
# Check branch
git branch
# Should show: * recovery-from-v1.5.0

# Check structure
ls -la app/
# Should show: css/ js/ docs/ index.html

# Check calculator.js has auto-init
tail -10 app/js/calculator.js
# Should show: document.addEventListener... window.calculator = new Calculator();

# Check index.html NO manual init
grep -A5 "DOMContentLoaded" app/index.html
# Should NOT show: new Calculator() inside HTML script tag
```

---

## Summary

**What Changed:** File location only (js/ → app/js/, etc.)  
**What Stayed Same:** All code, including working init pattern  
**Expected Result:** Works exactly like v1.5.0 you confirmed working  
**Test URL:** `http://localhost:9000/app/index.html` (port 9000, fresh start)

**Your Turn:** Test and report if numbers show when buttons pressed.
