# HP-12C Recovery Branch

Based on v1.5.0 (working baseline confirmed by user)

Structure reorganized to app/ while preserving working initialization pattern.

## Changes from v1.5.0:
- Moved js/ → app/js/
- Moved css/ → app/css/
- Moved index.html → app/index.html
- Added manifest.json for PWA
- Added sw.js with DEV_MODE enabled
- Updated paths in HTML

## Working initialization pattern preserved:
- Auto-init at end of app/js/calculator.js
- NO manual init in app/index.html
- Single initialization path

## Test:
```
python -m http.server 8000
# Open: http://localhost:8000/app/index.html
```
