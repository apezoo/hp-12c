# Service Worker & Cache Troubleshooting Guide

## Overview

The HP-12C calculator uses a Service Worker for PWA functionality and offline support. While this provides excellent performance, it can cause confusion during development when stale code is served from cache.

## Common Issues

### Issue 1: Code Changes Not Appearing in Browser

**Symptoms:**
- Updated JavaScript not executing
- Old HTML/CSS still showing
- Console shows old log messages
- Browser DevTools shows the file changed, but behavior hasn't

**Root Cause:**
Service Worker is serving cached versions of files.

**Solution:**
1. **Immediate fix (Chrome/Edge):**
   - Open DevTools (F12)
   - Go to Application tab → Service Workers
   - Check "Update on reload"
   - OR click "Unregister" to remove service worker completely
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

2. **Immediate fix (Firefox):**
   - Open DevTools (F12)
   - Go to Storage tab → Service Workers
   - Click "Unregister" next to the service worker
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

3. **Clear all caches:**
   ```javascript
   // Run in browser console
   caches.keys().then(keys => {
     keys.forEach(key => caches.delete(key));
   });
   // Then hard refresh
   ```

4. **Nuclear option:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Options → Privacy → Clear Data → Cached Web Content

### Issue 2: Different Behavior in Browser vs Tests

**Symptoms:**
- Tests pass but browser fails
- Class defined but instance not created
- `window.calculator` is undefined

**Root Cause:**
This is NOT a cache issue - it's an initialization issue.

**Solution:**
1. Verify `DOMContentLoaded` event handler exists in HTML
2. Verify calculator instantiation happens in event handler
3. Check browser console for errors during page load
4. Run browser smoke test: `open tests/browser-smoke-test.html`

### Issue 3: Service Worker Won't Update

**Symptoms:**
- New service worker shows as "waiting"
- Old cache version still active
- Page refresh doesn't activate new SW

**Root Cause:**
Service Worker lifecycle requires all tabs to close.

**Solution:**
1. Close ALL tabs with the app open
2. Open a fresh tab
3. OR click "skipWaiting" in DevTools → Application → Service Workers

## Development Workflow

### During Active Development

Set `DEV_MODE = true` in [`sw.js`](../sw.js:10):

```javascript
const DEV_MODE = true;  // Network-first strategy
```

This switches to network-first caching, always fetching fresh content while maintaining offline fallback.

**Remember:** Change back to `false` before deployment!

### Before Each Deployment

1. **Increment cache version** in [`sw.js`](../sw.js:6):
   ```javascript
   const CACHE_NAME = 'hp12c-v1.5.2';  // Increment this!
   ```

2. **Update query params** in HTML files (if needed):
   ```html
   <script src="js/calculator.js?v=5"></script>
   ```

3. **Test locally** with hard refresh

4. **Verify** old caches are cleaned up:
   ```javascript
   // Browser console
   caches.keys().then(console.log);
   // Should show only the new version
   ```

## Cache Strategy Explained

### Production Mode (DEV_MODE = false)
- **Strategy:** Cache-first
- **Behavior:** Serves from cache immediately, falls back to network
- **Best for:** Performance, offline support
- **Risk:** Can serve stale content if cache not properly versioned

### Development Mode (DEV_MODE = true)
- **Strategy:** Network-first
- **Behavior:** Always fetches from network, caches for offline fallback
- **Best for:** Development, debugging
- **Risk:** Slower, requires network connection

## Verification Commands

### Check Service Worker Status
```javascript
// Browser console
navigator.serviceWorker.getRegistrations().then(reg => {
  console.log('Active SW:', reg[0]?.active?.scriptURL);
  console.log('Waiting SW:', reg[0]?.waiting?.scriptURL);
});
```

### List All Caches
```javascript
caches.keys().then(keys => {
  console.log('Cached versions:', keys);
});
```

### Check Specific Cache Contents
```javascript
caches.open('hp12c-v1.5.1').then(cache => {
  cache.keys().then(keys => {
    console.log('Cached files:', keys.map(k => k.url));
  });
});
```

### Force Update Service Worker
```javascript
navigator.serviceWorker.getRegistrations().then(reg => {
  reg[0]?.update();
  console.log('Update triggered');
});
```

### Complete Reset (Development Only)
```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// Delete all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});

// Then hard refresh the page
console.log('Service workers and caches cleared. Hard refresh now!');
```

## Testing Checklist

Before reporting a bug:
- [ ] Did you hard refresh? (Ctrl+Shift+R)
- [ ] Did you check the service worker is not serving stale cache?
- [ ] Did you verify the correct file version in DevTools Sources?
- [ ] Did you try with DevTools → Application → "Update on reload" checked?
- [ ] Did you run the browser smoke test?
- [ ] Did you check the browser console for errors?
- [ ] Did you verify the issue exists in Incognito/Private mode?

## Emergency Debugging

If caching issues are blocking development:

1. **Disable Service Worker temporarily:**
   - Comment out SW registration in [`app/index.html`](../app/index.html:333-339)
   - Comment out SW registration in [`app/calculator-mobile.html`](../app/calculator-mobile.html:442-448)
   - Use query strings on all script tags: `?v=debug-timestamp`

2. **Serve with no-cache headers:**
   ```bash
   # Python 3
   python3 -m http.server 8000 --bind 127.0.0.1
   ```
   Then manually add this to HTML temporarily:
   ```html
   <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
   ```

## Best Practices

1. **During development:** Use `DEV_MODE = true` or disable SW entirely
2. **Before commits:** Increment `CACHE_NAME` version
3. **After major changes:** Update query param versions in HTML
4. **When debugging:** Always check browser DevTools Network tab
5. **For production:** Ensure `DEV_MODE = false` and proper version numbers
6. **Document:** Note cache version in commit messages when relevant

## Related Files

- Service Worker: [`sw.js`](../sw.js)
- Desktop HTML: [`app/index.html`](../app/index.html)
- Mobile HTML: [`app/calculator-mobile.html`](../app/calculator-mobile.html)
- Browser smoke test: [`tests/browser-smoke-test.html`](../tests/browser-smoke-test.html)
