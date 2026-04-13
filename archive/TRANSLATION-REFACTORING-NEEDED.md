# Translation System Refactoring Needed

**Status:** 🚧 Work Required  
**Priority:** Medium  
**Complexity:** High (requires refactoring 2900+ lines)

## Problem

After the production reorganization, the translation system has a critical issue:

### Current Behavior
When German language is selected and a key is clicked, the modal shows **mixed German/English** content:

```
Beschreibung (German header)
Periodic payment amount in TVM calculations (English content)
```

## Root Cause

The [`key-metadata.js`](../app/js/key-metadata.js) file (2904 lines) contains **hardcoded English** content for all 39 calculator keys:

```javascript
"pmt": {
  primaryFunction: {
    title: "Periodic Payment",  // ← Hardcoded English
    description: "Periodic payment amount in TVM calculations",  // ← Hardcoded English
    examples: [
      "Store periods: '360 n' stores 360 months (30-year mortgage)",  // ← Hardcoded English
    ]
  }
}
```

The [`i18n.js`](../app/js/i18n.js) translation system only handles **UI labels**, not the key metadata content.

## Required Solution

### 1. Centralize All Translations in i18n.js

Move all translatable strings from `key-metadata.js` to `i18n.js`:

**Current Structure:**
```
app/js/
  ├── i18n.js           ← UI labels only (50 strings)
  ├── key-metadata.js   ← Hardcoded English (2900+ lines)
  └── key-info.js       ← Displays metadata
```

**Target Structure:**
```
app/js/
  ├── i18n.js           ← ALL translations (UI + key metadata)
  ├── key-metadata.js   ← Structure only (translation keys)
  └── key-info.js       ← Use i18n for display
```

### 2. Update key-metadata.js Structure

Change from hardcoded strings to translation keys:

**BEFORE:**
```javascript
"pmt": {
  primaryFunction: {
    title: "Periodic Payment",
    description: "Periodic payment amount in TVM calculations",
    examples: [
      "Store payment: '500 PMT' stores monthly payment"
    ]
  }
}
```

**AFTER:**
```javascript
"pmt": {
  primaryFunction: {
    titleKey: "key_pmt_primary_title",
    descriptionKey: "key_pmt_primary_description",
    exampleKeys: [
      "key_pmt_example_1"
    ]
  }
}
```

### 3. Extend i18n.js with Key Metadata Translations

Add translations for all keys:

```javascript
const translations = {
  en: {
    // ... existing UI translations ...
    
    // Key metadata translations
    key_pmt_primary_title: "Periodic Payment",
    key_pmt_primary_description: "Periodic payment amount in TVM calculations",
    key_pmt_example_1: "Store payment: '500 PMT' stores monthly payment",
    
    key_n_primary_title: "Number of Periods",
    key_n_primary_description: "In Time Value of Money...",
    // ... for all 39 keys ...
  },
  
  de: {
    // ... existing UI translations ...
    
    // Key metadata translations (German)
    key_pmt_primary_title: "Periodische Zahlung",
    key_pmt_primary_description: "Periodischer Zahlungsbetrag bei TVM-Berechnungen",
    key_pmt_example_1: "Zahlung speichern: '500 PMT' speichert monatliche Zahlung",
    
    key_n_primary_title: "Anzahl der Perioden",
    key_n_primary_description: "Bei Zeitwertberechnungen...",
    // ... for all 39 keys ...
  }
};
```

### 4. Update key-info.js to Use Translations

Modify the display logic to lookup translations:

```javascript
// BEFORE
const title = metadata.primaryFunction.title;

// AFTER
const titleKey = metadata.primaryFunction.titleKey;
const title = i18n.t(titleKey);
```

## Scope of Work

### Files to Modify
1. `app/js/i18n.js` - Add ~500+ translation strings for key metadata
2. `app/js/key-metadata.js` - Convert all strings to translation keys
3. `app/js/key-info.js` - Update to use i18n.t() for all displays

### Translation Count Estimate
- 39 keys × ~15 strings per key = **~600 strings to translate**
- Each string needs EN + DE = **~1200 total translations**

### Benefits
✅ Fully bilingual key information  
✅ Easy to add more languages (FR, ES, etc.)  
✅ Centralized translation management  
✅ No more mixed-language displays  
✅ Professional multilingual support  

## Current Workaround

For immediate use:
- English language works perfectly
- German users will see mixed EN/DE (functional but not ideal)

## Implementation Steps

1. **Extract strings** - Create translation key mapping for all metadata
2. **Translate to German** - Get professional translation for 600+ strings
3. **Update i18n.js** - Add all key metadata translations
4. **Refactor key-metadata.js** - Replace strings with keys
5. **Update key-info.js** - Use i18n.t() everywhere
6. **Test both languages** - Verify complete translations
7. **Document** - Update README with translation system

## Estimated Effort

- **Development:** 6-8 hours
- **Translation:** 4-6 hours (if using professional translator)
- **Testing:** 2 hours
- **Total:** ~15 hours

## Priority Justification

**Medium Priority** because:
- ✅ Calculator functionality works perfectly
- ✅ English language complete
- ✅ All 409 tests passing
- ⚠️ German users get mixed language (functional but not professional)
- 📈 Should be done before marketing to German users

## Related Files

- [`app/js/i18n.js`](../app/js/i18n.js) - Current translation system
- [`app/js/key-metadata.js`](../app/js/key-metadata.js) - Key definitions
- [`app/js/key-info.js`](../app/js/key-info.js) - Display logic

---

**Created:** April 13, 2026  
**Status:** Documented for future work  
**Impact:** User experience for non-English users
