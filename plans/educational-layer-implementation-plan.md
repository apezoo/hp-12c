# Educational Key-Information Layer Implementation Plan

## Executive Summary

This document provides a comprehensive implementation plan for integrating an educational key-information system into the existing HP-12C web calculator. The implementation will add tooltips, Learn Mode, and detailed key documentation while preserving all existing calculator functionality and visual authenticity.

**Critical Constraints:**
- Vanilla JavaScript only (no frameworks)
- No build tools or transpilers
- No external CDN dependencies
- Must work from local files (no fetch for local JSON)
- Zero breaking changes to existing calculator behavior
- Preserve 98%+ visual authenticity

---

## 1. Data-Key Standardization Analysis

### 1.1 Current State Analysis

The existing [`index.html`](../index.html:48) has inconsistent `data-key` naming:

**Current data-key values:**
- Financial: `n`, `i`, `PV`, `PMT`, `FV`, `CHS`
- Digits: `7`, `8`, `9`, `4`, `5`, `6`, `1`, `2`, `3`, `0`
- Operations: `divide`, `multiply`, `subtract`, `add`
- Scientific: `yx`, `1x`, `PT`, `DP`, `PCT`, `EEX`
- Stack: `RS`, `SST`, `Rdown`, `xy`, `CLx`, `ENTER`
- Control: `ON`, `f`, `g`, `STO`, `RCL`, `decimal`, `SigmaPlus`

**Issues Identified:**
1. **Case inconsistency:** Mix of uppercase (`PV`, `PMT`, `FV`, `CHS`) and lowercase (`n`, `i`)
2. **Naming inconsistency:** Digits use bare numbers (`7`) vs specification (`digit-7`)
3. **Operation naming:** Uses short names (`divide`, `add`) vs specification (`op-divide`, `op-add`)
4. **Convention variance:** Mixed abbreviations (`xy` vs `swap-xy`, `Rdown` vs `roll-down`)

### 1.2 Proposed Standardization Strategy

**Recommendation:** Update all `data-key` attributes to match the specification exactly, but maintain backwards compatibility in [`calculator.js`](../js/calculator.js:78) during transition.

**Standardized naming convention:**
```
Financial:     n, i, pv, pmt, fv, chs
Digits:        digit-0 through digit-9
Operations:    op-add, op-subtract, op-multiply, op-divide
Scientific:    power-yx, reciprocal, percent-total, delta-percent, percent, eex
Stack:         rs, sst, roll-down, swap-xy, clx, enter
Control:       on, prefix-f, prefix-g, sto, rcl, decimal, sigma-plus
```

**Migration Path:**
1. Update all `data-key` attributes in `index.html` to use lowercase, hyphenated conventions
2. Update [`calculator.js`](../js/calculator.js:78) `handleButtonClick()` to use the new keys
3. Add backwards compatibility mapping if needed
4. Test all calculator functions still work

---

## 2. Key Metadata Structure Design

### 2.1 Metadata Schema

The metadata will be stored as a global object on `window.HP12C_KEY_METADATA`.

**Complete metadata schema:**

```javascript
window.HP12C_KEY_METADATA = {
  "key-id": {
    // Identity
    id: "key-id",
    dataKey: "key-id",
    label: "Display Label",
    displayName: "Human Readable Name",
    
    // Classification
    category: "financial|arithmetic|percentage|stack|memory|control|programming|statistics|numeric-entry|prefix|power-log|date|bond|depreciation",
    type: "key",
    
    // Primary Function
    primaryFunction: {
      title: "Function Title",
      description: "Detailed description of what this key does in normal mode.",
      examples: ["Example 1", "Example 2"],
      keystrokes: "7 ENTER 8 +"
    },
    
    // Shifted Functions
    shiftedFunctions: {
      gold: [
        {
          label: "GOLD-LEGEND",
          title: "Gold Function Title",
          description: "What the gold-shifted function does",
          implementationStatus: "implemented|partially-implemented|planned|not-implemented|informational-only",
          examples: [],
          keystrokes: "f KEY"
        }
      ],
      blue: [
        {
          label: "BLUE-LEGEND",
          title: "Blue Function Title", 
          description: "What the blue-shifted function does",
          implementationStatus: "implemented|partially-implemented|planned|not-implemented|informational-only",
          examples: [],
          keystrokes: "g KEY"
        }
      ]
    },
    
    // Documentation
    shortDescription: "One-line summary for tooltip",
    longDescription: "Extended description with context and usage notes",
    
    // Implementation Status
    implementation: {
      status: "implemented|partially-implemented|planned|not-implemented|informational-only",
      note: "Detailed note about current implementation state",
      version: "1.0"
    },
    
    // Historical Context
    originalHp12cBehavior: "How this key worked on the original HP-12C hardware",
    simulatorBehavior: "How this key currently works in our web simulator",
    
    // Educational Content
    relatedTopics: [
      "Topic 1",
      "Topic 2"
    ],
    relatedKeys: ["key-id-1", "key-id-2"],
    commonMistakes: [
      "Common mistake description"
    ],
    expertTips: [
      "Expert tip description"
    ]
  }
}
```

### 2.2 Complete Key Inventory

**40 Physical Keys (with visible gold/blue legends):**

| Key ID | Primary | Gold Legend(s) | Blue Legend(s) | Category |
|--------|---------|----------------|----------------|----------|
| n | n | AMORT | 12× | financial |
| i | i | INT | 12÷ | financial |
| pv | PV | NPV | CFo | financial |
| pmt | PMT | RND | CFj | financial |
| fv | FV | IRR | Nj | financial |
| chs | CHS | - | DATE | arithmetic |
| digit-7 | 7 | - | BEG | numeric-entry |
| digit-8 | 8 | - | END | numeric-entry |
| digit-9 | 9 | - | MEM | numeric-entry |
| op-divide | ÷ | - | - | arithmetic |
| power-yx | yˣ | PRICE/BOND/YTM | √x | power-log |
| reciprocal | 1/x | - | eˣ | arithmetic |
| percent-total | %T | - | LN | percentage |
| delta-percent | Δ% | SL/SOYD/DB | FRAC | percentage |
| percent | % | - | INTG | percentage |
| eex | EEX | - | ΔDYS | numeric-entry |
| digit-4 | 4 | - | D.MY | numeric-entry |
| digit-5 | 5 | - | M.DY | numeric-entry |
| digit-6 | 6 | - | x̄w | numeric-entry |
| op-multiply | × | - | - | arithmetic |
| rs | R/S | P/R | PSE | control |
| sst | SST | Σ | BST | programming |
| roll-down | R↓ | PRGM | GTO | stack |
| swap-xy | x↔y | CLEAR FIN/REG/PREFIX | x≤y | stack |
| clx | CLx | - | x=0 | stack |
| enter | ENTER | - | LSTx | stack |
| digit-1 | 1 | - | ŷ,r | numeric-entry |
| digit-2 | 2 | - | x̂,r | numeric-entry |
| digit-3 | 3 | - | n! | numeric-entry |
| op-subtract | − | - | - | arithmetic |
| on | ON | - | - | control |
| prefix-f | f | - | - | prefix |
| prefix-g | g | - | - | prefix |
| sto | STO | - | - | memory |
| rcl | RCL | - | - | memory |
| digit-0 | 0 | - | x̄ | numeric-entry |
| decimal | . | - | s | numeric-entry |
| sigma-plus | Σ+ | - | Σ− | statistics |
| op-add | + | - | - | arithmetic |

### 2.3 Implementation Status Mapping

**Based on current codebase analysis:**

**Implemented (fully functional):**
- All digit keys (0-9)
- Decimal point
- Basic arithmetic (+ − × ÷)
- Stack operations (ENTER, CLx, R↓, x↔y)
- ON (reset)
- Prefix keys (f, g) - prefix state tracking

**Partially Implemented:**
- CHS - code exists in calculator.js but not wired in handlePrimaryFunction()
- Memory operations (STO, RCL) - methods exist but not wired to UI
- LastX recall - stack has capability but not wired to g-ENTER

**Planned (not yet implemented):**
- All financial functions (n, i, PV, PMT, FV, NPV, IRR, AMORT, PRICE, BOND, etc.)
- All scientific functions (yˣ, 1/x, √x, eˣ, LN)
- All percentage functions (%T, Δ%, %)
- All date functions (DATE, ΔDYS, D.MY, M.DY)
- All programming functions (R/S, SST, BST, GTO, P/R)
- All statistics functions (Σ+, Σ−, x̄, s, etc.)
- All depreciation functions (SL, SOYD, DB)

---

## 3. Learn Mode Toggle Design

### 3.1 UI Design Requirements

**Location:** Above the calculator, below the "Examples & Tutorials" button

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│  ☰ Learn Mode: [OFF]  🔵                       │
│  Click any key to see detailed information     │
└─────────────────────────────────────────────────┘
```

**States:**
1. **OFF (default):** Normal calculator operation
2. **ON:** Key clicks open detail page instead of performing action

**Toggle Control:**
- Style: Modern toggle switch
- Colors: 
  - OFF: Gray/neutral (#6b7280)
  - ON: Blue gradient (#2aa4e6 to #1f97da)
- Animation: Smooth transition (0.3s)
- Accessibility: Keyboard accessible (Space/Enter to toggle)

### 3.2 HTML Structure

```html
<div class="learn-mode-control" role="region" aria-label="Learning Mode Controls">
  <div class="learn-toggle-container">
    <label for="learnModeToggle" class="learn-toggle-label">
      <span class="learn-icon">📚</span>
      <span class="learn-label-text">Learn Mode</span>
    </label>
    <button 
      id="learnModeToggle" 
      class="learn-toggle-button"
      role="switch"
      aria-checked="false"
      aria-label="Toggle Learn Mode"
    >
      <span class="toggle-slider"></span>
      <span class="toggle-state-text" aria-live="polite">OFF</span>
    </button>
    <p class="learn-mode-hint">
      <span class="hint-default">Hover keys for quick info, or enable Learn Mode to explore</span>
      <span class="hint-active">Click any key to see detailed information</span>
    </p>
  </div>
</div>
```

### 3.3 JavaScript API

```javascript
// In key-info.js
class LearnModeManager {
  constructor() {
    this.enabled = false;
    this.toggleButton = null;
    this.onStateChange = null;
  }
  
  initialize() {
    this.toggleButton = document.getElementById('learnModeToggle');
    this.attachEventListeners();
  }
  
  toggle() {
    this.enabled = !this.enabled;
    this.updateUI();
    if (this.onStateChange) {
      this.onStateChange(this.enabled);
    }
  }
  
  isEnabled() {
    return this.enabled;
  }
  
  updateUI() {
    // Update button aria-checked
    // Update visual state
    // Update hint text
  }
}
```

---

## 4. Tooltip System Architecture

### 4.1 Tooltip Design Specifications

**Visual Design:**
```
┌─────────────────────────────────────┐
│ n - Number of Periods          [🏷️] │
├─────────────────────────────────────┤
│ Category: Financial                 │
│ Primary: Stores/solves TVM periods  │
│ Gold: AMORT (planned)               │
│ Blue: 12× (planned)                 │
│                                     │
│ Status: ⚠️ Planned                  │
└─────────────────────────────────────┘
```

**Design Requirements:**
- Max width: 320px on desktop, 280px on mobile
- Background: Dark semi-transparent (#1a1d23 with 95% opacity)
- Text: White (#f4f3ef) with good contrast
- Border: Gold accent (#d79a33) 1px
- Border radius: 8px
- Shadow: 0 4px 12px rgba(0,0,0,0.3)
- Padding: 12px 16px
- Font size: 14px (primary), 12px (meta)
- Animation: Fade in 200ms, no fade out (instant hide)

**Status Badges:**
- ✅ Implemented: Green (#48c774)
- ⚙️ Partially: Yellow (#f5a623)
- ⚠️ Planned: Orange (#ff9800)
- ℹ️ Info only: Blue (#4a9fde)

### 4.2 Positioning Logic

**Priority order:**
1. **Above key** (preferred): If space available above key + scrollable area
2. **Below key:** If no space above but space below
3. **Left of key:** If no vertical space and space on left
4. **Right of key:** If no other options
5. **Center-fixed:** Last resort for very small screens

**Positioning algorithm:**
```javascript
function positionTooltip(keyElement, tooltipElement) {
  const keyRect = keyElement.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const margin = 8;
  
  let top, left;
  
  // Try above
  if (keyRect.top - tooltipRect.height - margin > 0) {
    top = keyRect.top - tooltipRect.height - margin;
    left = keyRect.left + (keyRect.width - tooltipRect.width) / 2;
  }
  // Try below
  else if (keyRect.bottom + tooltipRect.height + margin < viewportHeight) {
    top = keyRect.bottom + margin;
    left = keyRect.left + (keyRect.width - tooltipRect.width) / 2;
  }
  // Fallback: center on mobile
  else {
    top = viewportHeight / 2 - tooltipRect.height / 2;
    left = viewportWidth / 2 - tooltipRect.width / 2;
  }
  
  // Clamp to viewport
  left = Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin));
  top = Math.max(margin, Math.min(top, viewportHeight - tooltipRect.height - margin));
  
  return { top, left };
}
```

### 4.3 Interaction Model

**Desktop:**
- `mouseenter` on key → show tooltip after 300ms delay
- `mouseleave` on key → hide tooltip immediately
- `focus` on key → show tooltip immediately
- `blur` on key → hide tooltip immediately
- `Escape` key → hide tooltip

**Mobile/Touch:**
- Tooltip less critical (Learn Mode is primary access)
- `focus` on key → show tooltip
- `blur` on key → hide tooltip
- Touch and hold (optional enhancement) → show tooltip

### 4.4 Tooltip Content Template

```javascript
function generateTooltipContent(metadata) {
  return `
    <div class="tooltip-header">
      <span class="tooltip-key-label">${metadata.label}</span>
      <span class="tooltip-display-name">${metadata.displayName}</span>
    </div>
    <div class="tooltip-body">
      <div class="tooltip-category">
        <strong>Category:</strong> ${metadata.category}
      </div>
      <div class="tooltip-primary">
        <strong>Primary:</strong> ${metadata.shortDescription}
      </div>
      ${metadata.shiftedFunctions.gold.length > 0 ? `
        <div class="tooltip-shifted gold">
          <strong>Gold:</strong> ${metadata.shiftedFunctions.gold.map(f => 
            `${f.label} (${f.implementationStatus})`
          ).join(', ')}
        </div>
      ` : ''}
      ${metadata.shiftedFunctions.blue.length > 0 ? `
        <div class="tooltip-shifted blue">
          <strong>Blue:</strong> ${metadata.shiftedFunctions.blue.map(f => 
            `${f.label} (${f.implementationStatus})`
          ).join(', ')}
        </div>
      ` : ''}
    </div>
    <div class="tooltip-footer">
      ${getStatusBadge(metadata.implementation.status)}
      <span class="tooltip-hint">Click for details</span>
    </div>
  `;
}
```

---

## 5. Detail Page Design

### 5.1 Page Structure

**File:** `docs/key-detail.html`

**URL Pattern:** `docs/key-detail.html?key=<data-key>`

**Examples:**
- `docs/key-detail.html?key=n`
- `docs/key-detail.html?key=enter`
- `docs/key-detail.html?key=op-add`
- `docs/key-detail.html?key=digit-7`

### 5.2 Page Layout

```
┌──────────────────────────────────────────────────────┐
│ [← Back to Calculator] [📚 Examples]           [HP-12C] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Key: n - Number of Periods              [🏷️]  │ │
│  │ Category: Financial                            │ │
│  │ Status: ⚠️ Planned                             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ PRIMARY FUNCTION                               │ │
│  │ Stores or solves for the number of periods...  │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ SHIFTED FUNCTIONS                              │ │
│  │ [Gold] AMORT - Amortization (planned)          │ │
│  │ [Blue] 12× - Multiply by 12 (planned)          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ ORIGINAL HP-12C BEHAVIOR                       │ │
│  │ On the original HP-12C hardware...             │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ CURRENT SIMULATOR STATUS                       │ │
│  │ This function is planned for future release... │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ RELATED TOPICS                                 │ │
│  │ • Time Value of Money  • Loans  • Annuities    │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.3 Section Requirements

**Required Sections:**
1. **Navigation Bar** - Back link, Examples link, branding
2. **Key Hero Card** - Key identity, category, status badge
3. **Primary Function** - Detailed description with examples
4. **Shifted Functions** - Gold and blue functions with status
5. **Original Behavior** - Historical HP-12C context
6. **Simulator Status** - Honest current implementation state
7. **Related Topics** - Links to related concepts
8. **Usage Examples** (optional) - Keystroke examples

**Error State:**
When query parameter is missing or invalid:
```html
<div class="error-state">
  <h1>⚠️ Key Not Found</h1>
  <p>The requested key could not be found in the metadata.</p>
  <p>Valid key IDs include: n, i, pv, enter, digit-7, op-add, etc.</p>
  <a href="../index.html">Back to Calculator</a>
</div>
```

### 5.4 Dynamic Rendering

```javascript
// In key-info.js
function renderKeyDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const keyId = urlParams.get('key');
  
  if (!keyId) {
    renderMissingKeyState('No key specified');
    return;
  }
  
  const metadata = window.HP12C_KEY_METADATA[keyId];
  
  if (!metadata) {
    renderMissingKeyState(`Key "${keyId}" not found`);
    return;
  }
  
  renderKeyDetails(metadata);
}

function renderKeyDetails(metadata) {
  // Populate hero card
  document.getElementById('keyLabel').textContent = metadata.label;
  document.getElementById('keyDisplayName').textContent = metadata.displayName;
  document.getElementById('keyCategory').textContent = metadata.category;
  document.getElementById('keyStatus').innerHTML = getStatusBadge(metadata.implementation.status);
  
  // Populate primary function
  document.getElementById('primaryTitle').textContent = metadata.primaryFunction.title;
  document.getElementById('primaryDescription').textContent = metadata.primaryFunction.description;
  
  // Populate shifted functions
  renderShiftedFunctions(metadata.shiftedFunctions);
  
  // Populate behavior sections
  document.getElementById('originalBehavior').textContent = metadata.originalHp12cBehavior;
  document.getElementById('simulatorBehavior').textContent = metadata.simulatorBehavior;
  
  // Populate related topics
  renderRelatedTopics(metadata.relatedTopics, metadata.relatedKeys);
}
```

---

## 6. CSS Architecture

### 6.1 New CSS Additions to styles.css

```css
/* ============================================
   EDUCATIONAL LAYER STYLES
   ============================================ */

/* Learn Mode Toggle */
.learn-mode-control {
  max-width: min(980px, 96vw);
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.learn-toggle-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.learn-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2a2a2a;
  cursor: pointer;
}

.learn-icon {
  font-size: 1.5rem;
}

.learn-toggle-button {
  position: relative;
  width: 60px;
  height: 32px;
  background: #6b7280;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.learn-toggle-button[aria-checked="true"] {
  background: linear-gradient(135deg, #2aa4e6, #1f97da);
}

.toggle-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.learn-toggle-button[aria-checked="true"] .toggle-slider {
  transform: translateX(28px);
}

.toggle-state-text {
  position: absolute;
  right: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  line-height: 32px;
}

.learn-toggle-button[aria-checked="true"] .toggle-state-text {
  left: 8px;
  right: auto;
}

.learn-mode-hint {
  flex-basis: 100%;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.learn-mode-hint .hint-active {
  display: none;
}

.learn-mode-control.active .learn-mode-hint .hint-default {
  display: none;
}

.learn-mode-control.active .learn-mode-hint .hint-active {
  display: inline;
  color: #2aa4e6;
  font-weight: 600;
}

/* Key Hover Enhancement in Learn Mode */
.learn-mode-active .key {
  cursor: help;
}

.learn-mode-active .key:hover {
  outline: 2px solid #2aa4e6;
  outline-offset: 2px;
}

/* Tooltip Styles */
.key-tooltip {
  position: fixed;
  z-index: 10000;
  background: rgba(26, 29, 35, 0.95);
  backdrop-filter: blur(10px);
  color: #f4f3ef;
  border: 1px solid #d79a33;
  border-radius: 8px;
  padding: 12px 16px;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.key-tooltip.visible {
  opacity: 1;
}

.tooltip-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(215, 154, 51, 0.3);
}

.tooltip-key-label {
  font-weight: 700;
  font-size: 1.125rem;
  color: #d79a33;
}

.tooltip-display-name {
  font-size: 0.875rem;
  color: #b0b5ba;
}

.tooltip-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.tooltip-category,
.tooltip-primary,
.tooltip-shifted {
  display: flex;
  gap: 0.5rem;
}

.tooltip-shifted.gold strong {
  color: #d79a33;
}

.tooltip-shifted.blue strong {
  color: #2aa4e6;
}

.tooltip-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(215, 154, 51, 0.3);
  font-size: 0.75rem;
}

.tooltip-hint {
  color: #b0b5ba;
  font-style: italic;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.implemented {
  background: rgba(72, 199, 116, 0.2);
  color: #48c774;
}

.status-badge.partially-implemented {
  background: rgba(245, 166, 35, 0.2);
  color: #f5a623;
}

.status-badge.planned {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.status-badge.not-implemented {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-badge.informational-only {
  background: rgba(74, 159, 222, 0.2);
  color: #4a9fde;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .key-tooltip {
    max-width: 280px;
    padding: 10px 14px;
  }
  
  .learn-mode-control {
    padding: 0.75rem 1rem;
  }
  
  .learn-toggle-container {
    justify-content: center;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .key-tooltip,
  .toggle-slider,
  .learn-toggle-button {
    transition: none;
  }
}

/* Focus Visible Enhancement */
.key:focus-visible {
  outline: 2px solid #f4d03f;
  outline-offset: 2px;
  z-index: 10;
}

.learn-toggle-button:focus-visible {
  outline: 2px solid #f4d03f;
  outline-offset: 2px;
}
```

### 6.2 Detail Page Styles (embedded in key-detail.html)

```css
/* Similar styling consistent with existing docs/examples.html */
/* Uses same color scheme and visual language */
```

---

## 7. JavaScript File Architecture

### 7.1 js/key-metadata.js

**Purpose:** Centralized metadata storage

**Structure:**
```javascript
/**
 * HP-12C Key Metadata Database
 * Complete metadata for all 40 physical calculator keys
 * 
 * This file must load BEFORE key-info.js
 */

(function() {
  'use strict';
  
  window.HP12C_KEY_METADATA = {
    // Financial keys
    "n": {
      id: "n",
      dataKey: "n",
      label: "n",
      displayName: "Number of Periods",
      category: "financial",
      // ... full metadata
    },
    
    // ... 39 more keys
  };
  
  console.log('HP-12C Key Metadata loaded:', Object.keys(window.HP12C_KEY_METADATA).length, 'keys');
})();
```

**Size estimate:** ~800-1000 lines for 40 complete key entries

### 7.2 js/key-info.js

**Purpose:** Educational layer functionality

**Structure:**
```javascript
/**
 * HP-12C Educational Key Information System
 * Handles tooltips, Learn Mode, and detail page rendering
 */

(function() {
  'use strict';
  
  // ============================================
  // LEARN MODE MANAGER
  // ============================================
  
  class LearnModeManager {
    constructor() {
      this.enabled = false;
      this.toggleButton = null;
      this.controlContainer = null;
    }
    
    initialize() { /* ... */ }
    toggle() { /* ... */ }
    isEnabled() { /* ... */ }
    setEnabled(enabled) { /* ... */ }
    updateUI() { /* ... */ }
    attachEventListeners() { /* ... */ }
  }
  
  // ============================================
  // TOOLTIP MANAGER
  // ============================================
  
  class TooltipManager {
    constructor() {
      this.tooltip = null;
      this.currentKey = null;
      this.showDelay = 300;
      this.showTimer = null;
    }
    
    initialize() { /* ... */ }
    createTooltip() { /* ... */ }
    showTooltip(keyElement, metadata) { /* ... */ }
    hideTooltip() { /* ... */ }
    positionTooltip(keyElement) { /* ... */ }
    generateTooltipContent(metadata) { /* ... */ }
    attachKeyEventListeners() { /* ... */ }
  }
  
  // ============================================
  // KEY DETAIL RENDERER
  // ============================================
  
  class KeyDetailRenderer {
    renderDetailPage() { /* ... */ }
    renderKeyDetails(metadata) { /* ... */ }
    renderShiftedFunctions(shifted) { /* ... */ }
    renderRelatedTopics(topics, keys) { /* ... */ }
    renderMissingKeyState(message) { /* ... */ }
  }
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  
  function getKeyMetadata(dataKey) {
    return window.HP12C_KEY_METADATA[dataKey] || null;
  }
  
  function getStatusBadge(status) {
    const badges = {
      'implemented': '✅ Implemented',
      'partially-implemented': '⚙️ Partially',
      'planned': '⚠️ Planned',
      'not-implemented': '❌ Not Implemented',
      'informational-only': 'ℹ️ Info Only'
    };
    return `<span class="status-badge ${status}">${badges[status] || status}</span>`;
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  let learnMode = null;
  let tooltipManager = null;
  let detailRenderer = null;
  
  function initializeEducationalLayer() {
    // Check if we're on detail page or main calculator
    if (window.location.pathname.includes('key-detail.html')) {
      detailRenderer = new KeyDetailRenderer();
      detailRenderer.renderDetailPage();
    } else {
      learnMode = new LearnModeManager();
      tooltipManager = new TooltipManager();
      
      learnMode.initialize();
      tooltipManager.initialize();
      
      console.log('Educational layer initialized');
    }
  }
  
  // Wait for metadata to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEducationalLayer);
  } else {
    initializeEducationalLayer();
  }
  
  // Export to window for debugging
  window.HP12C_EDUCATIONAL = {
    learnMode,
    tooltipManager,
    getKeyMetadata,
    getStatusBadge
  };
})();
```

**Size estimate:** ~500-700 lines

---

## 8. Calculator.js Integration Strategy

### 8.1 Minimal Modifications Required

The key insight is that Learn Mode can be handled **without deeply modifying calculator.js**.

**Strategy:** Use event capture phase to intercept clicks before they reach calculator handlers.

### 8.2 Integration Point in key-info.js

```javascript
class LearnModeManager {
  initialize() {
    // ... toggle button setup ...
    
    // Intercept key clicks in capture phase when Learn Mode is enabled
    document.addEventListener('click', this.handleKeyClick.bind(this), true); // true = capture phase
  }
  
  handleKeyClick(event) {
    // Only intercept if Learn Mode is enabled
    if (!this.enabled) {
      return; // Allow normal calculator behavior
    }
    
    // Check if click target is a key button
    const keyButton = event.target.closest('.key');
    if (!keyButton) {
      return; // Not a key, ignore
    }
    
    // Intercept the click
    event.stopPropagation(); // Prevent calculator.js from seeing this
    event.preventDefault();
    
    // Get the key ID
    const dataKey = keyButton.dataset.key;
    if (!dataKey) {
      console.warn('Key button missing data-key attribute');
      return;
    }
    
    // Open detail page
    this.openKeyDetail(dataKey);
  }
  
  openKeyDetail(dataKey) {
    // Navigate to detail page
    window.location.href = `docs/key-detail.html?key=${dataKey}`;
  }
}
```

### 8.3 Optional: Ctrl/Cmd+Click Enhancement

```javascript
handleKeyClick(event) {
  const keyButton = event.target.closest('.key');
  if (!keyButton) {
    return;
  }
  
  // Check for modifier keys (Ctrl/Cmd+Click)
  const isModifierClick = event.ctrlKey || event.metaKey;
  
  if (this.enabled || isModifierClick) {
    // Intercept and open detail page
    event.stopPropagation();
    event.preventDefault();
    
    const dataKey = keyButton.dataset.key;
    if (dataKey) {
      this.openKeyDetail(dataKey);
    }
  }
  // Otherwise, allow normal calculator behavior
}
```

### 8.4 No Changes Needed to calculator.js

The current [`calculator.js`](../js/calculator.js:60) event listener structure is:

```javascript
attachEventListeners() {
  this.buttons = document.querySelectorAll('.key');
  
  this.buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      this.handleButtonClick(button);
      // ...
    });
  });
}
```

This uses the **bubble phase** (default), so our capture-phase handler in `key-info.js` will run first and can stop propagation when Learn Mode is active.

**Result:** Zero modifications to calculator.js required for Learn Mode!

---

## 9. Index.html Modifications

### 9.1 Data-Key Standardization

**Current inconsistencies** (from section 1):

**Changes required:**
```html
<!-- OLD: -->
<button class="key medium" data-key="PV">
<!-- NEW: -->
<button class="key medium" data-key="pv">

<!-- OLD: -->
<button class="key" data-key="7">
<!-- NEW: -->
<button class="key" data-key="digit-7">

<!-- OLD: -->
<button class="key small" data-key="divide">
<!-- NEW: -->
<button class="key small" data-key="op-divide">

<!-- etc. for all 40 keys -->
```

**Full mapping:**
```
n → n (no change)
i → i (no change)
PV → pv
PMT → pmt
FV → fv
CHS → chs
7,8,9,4,5,6,1,2,3,0 → digit-7, digit-8, ... digit-0
divide → op-divide
multiply → op-multiply
subtract → op-subtract
add → op-add
yx → power-yx
1x → reciprocal
PT → percent-total
DP → delta-percent
PCT → percent
EEX → eex
RS → rs
SST → sst
Rdown → roll-down
xy → swap-xy
CLx → clx
ENTER → enter
ON → on
f → prefix-f
g → prefix-g
STO → sto
RCL → rcl
decimal → decimal (no change)
SigmaPlus → sigma-plus
```

### 9.2 Learn Mode Toggle Insertion

**Location:** After the navigation link, before the calculator

```html
<body>
  <!-- Navigation Link -->
  <div style="position: fixed; top: 20px; right: 20px; z-index: 10000;">
    <a href="docs/examples.html" ...>
      📚 Examples & Tutorials
    </a>
  </div>

  <!-- NEW: Learn Mode Control -->
  <div class="learn-mode-control" role="region" aria-label="Learning Mode Controls">
    <div class="learn-toggle-container">
      <label for="learnModeToggle" class="learn-toggle-label">
        <span class="learn-icon">📚</span>
        <span class="learn-label-text">Learn Mode</span>
      </label>
      <button 
        id="learnModeToggle" 
        class="learn-toggle-button"
        role="switch"
        aria-checked="false"
        aria-label="Toggle Learn Mode - Enable to click keys for detailed information"
      >
        <span class="toggle-slider"></span>
        <span class="toggle-state-text" aria-live="polite">OFF</span>
      </button>
      <p class="learn-mode-hint">
        <span class="hint-default">Hover any key for quick info</span>
        <span class="hint-active">Click any key to see detailed information</span>
      </p>
    </div>
  </div>

  <div class="hp12c" aria-label="HP-12C Financial Calculator">
    <!-- existing calculator markup -->
  </div>

  <!-- JavaScript Modules -->
  <script src="js/rpn-stack.js"></script>
  <script src="js/display.js"></script>
  <script src="js/memory.js"></script>
  <script src="js/financial.js"></script>
  <script src="js/keyboard.js"></script>
  <script src="js/key-metadata.js"></script> <!-- NEW -->
  <script src="js/key-info.js"></script>     <!-- NEW -->
  <script src="js/calculator.js"></script>
  
  <!-- existing initialization script -->
</body>
```

### 9.3 Load Order Requirements

**Critical order:**
1. Core calculator modules (rpn-stack, display, memory, etc.)
2. **key-metadata.js** - Must load before key-info.js
3. **key-info.js** - Depends on metadata being available
4. calculator.js - Last, as before

---

## 10. Implementation Honesty Requirements

### 10.1 Current Implementation Status by Category

**Fully Implemented (✅):**
- Digit entry (0-9, decimal)
- Basic arithmetic (+, −, ×, ÷)
- Stack operations (ENTER, CLx, R↓, x↔y)
- Prefix mode tracking (f, g keys toggle state)
- Display formatting (fixed-point)
- ON (calculator reset)

**Exists But Not Wired (⚙️):**
- CHS (change sign) - method exists in calculator.js line 313 but not called
- Memory (STO, RCL) - MemoryManager fully implemented but not wired to UI
- LastX - stack capability exists but not wired to blue-ENTER

**Planned for Future (⚠️):**
- All TVM functions (n, i, PV, PMT, FV, NPV, IRR)
- All scientific functions (yˣ, 1/x, √x, eˣ, LN, etc.)
- All percentage functions (%T, Δ%, %)
- All date functions
- All programming functions (R/S, SST, GTO, etc.)
- All statistics functions (Σ+, Σ−, x̄, s, etc.)
- All depreciation functions (SL, SOYD, DB)
- All bond functions (PRICE, BOND, YTM)

### 10.2 Metadata Honesty Template

Every metadata entry must include:

```javascript
implementation: {
  status: "implemented|partially-implemented|planned|not-implemented",
  note: "Specific note about current state",
  version: "1.0"
},
originalHp12cBehavior: "What the original HP-12C does",
simulatorBehavior: "What this simulator currently does (may differ from original)"
```

**Examples:**

```javascript
// Fully implemented
"enter": {
  // ...
  implementation: {
    status: "implemented",
    note: "Full RPN ENTER behavior with stack lift disable",
    version: "1.0"
  },
  originalHp12cBehavior: "Duplicates X into Y and disables stack lift for next entry",
  simulatorBehavior: "Fully implemented and matches original HP-12C behavior"
}

// Exists but not wired
"chs": {
  // ...
  implementation: {
    status: "partially-implemented",
    note: "Logic exists in calculator code but not connected to UI click handler",
    version: "1.0"
  },
  originalHp12cBehavior: "Changes the sign of X register (or current input)",
  simulatorBehavior: "Function is coded but not yet accessible through the UI"
}

// Planned
"n": {
  // ...
  implementation: {
    status: "planned",
    note: "TVM solver not yet implemented. Financial engine is placeholder only.",
    version: "1.0"
  },
  originalHp12cBehavior: "Stores or solves for number of compounding/payment periods in TVM calculations",
  simulatorBehavior: "Displays as part of authentic interface but does not yet perform TVM calculations"
}
```

### 10.3 UI Honesty Requirements

**On tooltip:** Status badge must accurately reflect implementation state

**On detail page:**
- "Current Simulator Status" section must be prominent
- Must clearly state if function is not yet working
- Must not provide usage examples for unimplemented functions
- May provide "planned usage" examples with clear disclaimer

**Example detail page honesty:**

```html
<section class="implementation-status">
  <h2>Current Simulator Status</h2>
  <div class="status-badge planned">⚠️ Planned</div>
  <p><strong>This function is not yet implemented in the web simulator.</strong></p>
  <p>The n key is displayed as part of the authentic HP-12C interface, 
     but the underlying Time Value of Money solver has not yet been built. 
     This function is planned for a future release.</p>
  <p>On the original HP-12C, this key would store or solve for the 
     number of periods in financial calculations.</p>
</section>
```

---

## 11. Integration Testing Strategy

### 11.1 Manual Test Checklist

**Phase 1: Data-Key Standardization**
- [ ] All 40 keys have correct lowercase, hyphenated data-key attributes
- [ ] All digit keys use digit-N format
- [ ] All operations use op-NAME format
- [ ] Prefixes use prefix-NAME format
- [ ] No data-key mismatches between HTML and metadata

**Phase 2: Metadata Completeness**
- [ ] All 40 physical keys have metadata entries
- [ ] All metadata entries have required fields
- [ ] All implementation statuses are honest and accurate
- [ ] All shifted functions (gold/blue) are documented
- [ ] All status values are valid enum values

**Phase 3: Learn Mode Toggle**
- [ ] Toggle renders correctly on desktop
- [ ] Toggle renders correctly on tablet
- [ ] Toggle renders correctly on mobile
- [ ] Click toggle → state changes
- [ ] Space/Enter on toggle → state changes
- [ ] Visual state updates correctly (OFF/ON)
- [ ] Hint text changes correctly
- [ ] aria-checked updates correctly

**Phase 4: Calculator Behavior - Default Mode**
- [ ] Click digit-7 → enters 7 (normal behavior)
- [ ] Click enter → performs ENTER (normal behavior)
- [ ] Click op-add → performs addition (normal behavior)
- [ ] Click op-divide → performs division (normal behavior)
- [ ] All implemented keys work normally
- [ ] No regression in calculator functionality

**Phase 5: Learn Mode Behavior**
- [ ] Enable Learn Mode
- [ ] Click digit-7 → opens docs/key-detail.html?key=digit-7
- [ ] Click enter → opens docs/key-detail.html?key=enter
- [ ] Click op-add → opens docs/key-detail.html?key=op-add
- [ ] Click n → opens docs/key-detail.html?key=n
- [ ] Calculator action does NOT fire
- [ ] Disable Learn Mode
- [ ] Calculator returns to normal operation

**Phase 6: Tooltip System - Desktop**
- [ ] Hover digit-7 → tooltip appears after delay
- [ ] Tooltip shows correct key info
- [ ] Tooltip shows implementation status badge
- [ ] Tooltip positioned correctly (not off-screen)
- [ ] Mouse leave → tooltip disappears immediately
- [ ] Focus digit-7 → tooltip appears
- [ ] Blur → tooltip disappears
- [ ] Press Escape → tooltip disappears
- [ ] Hover different key → tooltip updates content

**Phase 7: Tooltip System - Mobile**
- [ ] Tap and focus key → tooltip appears
- [ ] Blur → tooltip disappears
- [ ] Tooltip readable on small screen
- [ ] No tooltip blocking interactions

**Phase 8: Detail Page - Valid Keys**
- [ ] Visit docs/key-detail.html?key=n
- [ ] Page loads successfully
- [ ] Key label displays: "n"
- [ ] Display name shows: "Number of Periods"
- [ ] Category shows: "Financial"
- [ ] Status badge shows: "⚠️ Planned"
- [ ] Primary function section rendered
- [ ] Shifted functions section rendered (gold AMORT, blue 12×)
- [ ] Original behavior section rendered
- [ ] Simulator status section rendered
- [ ] Implementation honesty is clear
- [ ] Related topics section rendered
- [ ] Back link works → returns to calculator

**Phase 9: Detail Page - Various Keys**
- [ ] Test implemented key (enter) → shows "✅ Implemented"
- [ ] Test planned key (n) → shows "⚠️ Planned"
- [ ] Test digit key (digit-7) → correct info
- [ ] Test operation key (op-add) → correct info
- [ ] Test prefix key (prefix-f) → correct info

**Phase 10: Detail Page - Error States**
- [ ] Visit docs/key-detail.html (no ?key param)
- [ ] Error state displays correctly
- [ ] Clear message about missing parameter
- [ ] Back link works
- [ ] Visit docs/key-detail.html?key=invalid-key-xyz
- [ ] Error state displays correctly
- [ ] Clear message about invalid key
- [ ] Back link works

**Phase 11: Accessibility**
- [ ] All keys remain keyboard accessible
- [ ] Tab through calculator keys
- [ ] Focus visible on each key
- [ ] Tooltips appear on focus (not just hover)
- [ ] Learn Mode toggle keyboard accessible
- [ ] Screen reader announces Learn Mode state
- [ ] Detail page uses semantic HTML
- [ ] Detail page headings are logical
- [ ] High contrast mode works

**Phase 12: Responsive Design**
- [ ] Desktop (1920×1080) - everything renders correctly
- [ ] Laptop (1366×768) - everything renders correctly
- [ ] Tablet portrait (768×1024) - everything renders correctly
- [ ] Tablet landscape (1024×768) - everything renders correctly
- [ ] Mobile large (414×896) - everything renders correctly
- [ ] Mobile medium (375×667) - everything renders correctly
- [ ] Mobile small (320×568) - everything renders correctly
- [ ] No horizontal scrolling
- [ ] No layout breaks
- [ ] Tooltips don't overflow viewport

**Phase 13: Browser Compatibility**
- [ ] Chrome/Edge (Chromium) - all features work
- [ ] Firefox - all features work
- [ ] Safari (desktop) - all features work
- [ ] Safari (iOS) - all features work
- [ ] Chrome (Android) - all features work

**Phase 14: Performance**
- [ ] Page loads in < 2 seconds on broadband
- [ ] No console errors
- [ ] No console warnings
- [ ] Tooltip appears smoothly (no lag)
- [ ] Learn Mode toggle is instant
- [ ] Detail page renders quickly
- [ ] No memory leaks (test with multiple navigations)

### 11.2 Automated Testing Considerations

While this is a vanilla JS project without build tools, basic automated tests could be added:

**Possible test file:** `tests/educational-layer-tests.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Educational Layer Tests</title>
</head>
<body>
  <h1>Educational Layer Test Suite</h1>
  <div id="results"></div>
  
  <script src="../js/key-metadata.js"></script>
  <script src="../js/key-info.js"></script>
  <script>
    // Simple test framework
    function test(name, fn) {
      try {
        fn();
        console.log('✅', name);
        return true;
      } catch (e) {
        console.error('❌', name, e);
        return false;
      }
    }
    
    // Metadata tests
    test('Metadata loads', () => {
      if (!window.HP12C_KEY_METADATA) throw new Error('Metadata not loaded');
    });
    
    test('All 40 keys present', () => {
      const count = Object.keys(window.HP12C_KEY_METADATA).length;
      if (count !== 40) throw new Error(`Expected 40 keys, got ${count}`);
    });
    
    test('All keys have required fields', () => {
      for (const key in window.HP12C_KEY_METADATA) {
        const meta = window.HP12C_KEY_METADATA[key];
        if (!meta.id || !meta.dataKey || !meta.category) {
          throw new Error(`Key ${key} missing required fields`);
        }
      }
    });
    
    // More tests...
  </script>
</body>
</html>
```

---

## 12. File Summary

### 12.1 New Files to Create

1. **`js/key-metadata.js`** (~800-1000 lines)
   - Complete metadata for all 40 keys
   - Exposes `window.HP12C_KEY_METADATA`

2. **`js/key-info.js`** (~500-700 lines)
   - LearnModeManager class
   - TooltipManager class
   - KeyDetailRenderer class
   - Initialization logic

3. **`docs/key-detail.html`** (~300-400 lines)
   - Single dynamic detail page
   - Renders based on ?key= parameter
   - Includes embedded styles
   - Includes navigation

### 12.2 Files to Modify

1. **`index.html`** (40+ small changes)
   - Standardize all data-key attributes (40 buttons)
   - Add Learn Mode toggle markup (after navigation link)
   - Add script tags for key-metadata.js and key-info.js

2. **`css/styles.css`** (~200 lines added)
   - Learn Mode control styles
   - Tooltip styles
   - Status badge styles
   - Enhanced focus styles
   - Responsive adjustments

3. **`js/calculator.js`** (ZERO changes - optional minor updates)
   - No changes required for Learn Mode (handled in capture phase)
   - Optional: Add data-key compatibility layer if needed
   - Optional: Wire CHS function (already coded, not wired)

### 12.3 Files NOT to Modify

- `js/rpn-stack.js` - No changes needed
- `js/display.js` - No changes needed
- `js/memory.js` - No changes needed
- `js/financial.js` - No changes needed (placeholder)
- `js/keyboard.js` - No changes needed (placeholder)
- `docs/examples.html` - No changes needed
- All markdown docs - No changes needed

---

## 13. Implementation Phases

### Phase 1: Preparation and Analysis
- [x] Analyze current data-key usage
- [x] Design metadata schema
- [x] Plan integration points
- [x] Create implementation plan document

### Phase 2: Metadata Creation
- [ ] Create `js/key-metadata.js`
- [ ] Write complete metadata for all 40 keys
- [ ] Mark implementation status honestly for each
- [ ] Document all shifted functions
- [ ] Test metadata loads correctly

### Phase 3: Data-Key Standardization
- [ ] Update all 40 button data-key attributes in `index.html`
- [ ] Test calculator still works after changes
- [ ] Fix any broken key handlers in `calculator.js` if needed

### Phase 4: Learn Mode Toggle
- [ ] Add Learn Mode control HTML to `index.html`
- [ ] Add Learn Mode CSS to `styles.css`
- [ ] Create LearnModeManager class in `key-info.js`
- [ ] Test toggle functionality
- [ ] Test keyboard accessibility

### Phase 5: Tooltip System
- [ ] Add tooltip CSS to `styles.css`
- [ ] Create TooltipManager class in `key-info.js`
- [ ] Implement tooltip positioning logic
- [ ] Attach event listeners to keys
- [ ] Test tooltip on desktop
- [ ] Test tooltip on mobile
- [ ] Test accessibility

### Phase 6: Learn Mode Click Interception
- [ ] Implement capture-phase click handler
- [ ] Test Learn Mode prevents calculator actions
- [ ] Test Learn Mode OFF allows normal operation
- [ ] Test Ctrl/Cmd+Click enhancement (optional)

### Phase 7: Detail Page
- [ ] Create `docs/key-detail.html`
- [ ] Embed detail page styles
- [ ] Create KeyDetailRenderer class in `key-info.js`
- [ ] Implement URL parameter parsing
- [ ] Implement dynamic content rendering
- [ ] Implement error states
- [ ] Test with various keys
- [ ] Test error handling

### Phase 8: Integration Testing
- [ ] Run full manual test checklist
- [ ] Fix any issues found
- [ ] Test on multiple browsers
- [ ] Test on multiple devices
- [ ] Test accessibility

### Phase 9: Documentation
- [ ] Update README with educational features
- [ ] Create user guide for Learn Mode
- [ ] Document metadata schema for future additions
- [ ] Document how to mark implementation status

### Phase 10: Polish and Launch
- [ ] Review all implementation honesty statements
- [ ] Ensure consistent visual design
- [ ] Performance optimization if needed
- [ ] Final cross-browser testing
- [ ] Deploy

---

## 14. Risk Mitigation

### 14.1 Identified Risks

**Risk 1: Breaking existing calculator functionality**
- **Mitigation:** Use capture-phase event handling to avoid modifying calculator.js
- **Testing:** Extensive regression testing in default mode

**Risk 2: Data-key changes breaking calculator handlers**
- **Mitigation:** Careful systematic update of all references
- **Testing:** Test each key individually after changes

**Risk 3: Tooltip positioning issues on small screens**
- **Mitigation:** Robust positioning algorithm with viewport clamping
- **Testing:** Test on actual mobile devices, not just emulators

**Risk 4: Learn Mode not visually obvious**
- **Mitigation:** Clear toggle with prominent visual state
- **Testing:** User testing with naive users

**Risk 5: Performance issues with metadata size**
- **Mitigation:** Metadata is just JSON, very small (~50-80KB)
- **Testing:** Performance profiling in browser dev tools

**Risk 6: Accessibility issues**
- **Mitigation:** ARIA attributes, keyboard support, semantic HTML
- **Testing:** Screen reader testing, keyboard-only navigation

### 14.2 Rollback Strategy

If issues are discovered after implementation:

1. **Quick rollback:** Remove script tags for key-metadata.js and key-info.js
2. **Restore data-keys:** Revert index.html changes if needed
3. **CSS isolation:** Educational layer CSS is isolated, can be removed safely

---

## 15. Future Enhancements

### 15.1 Possible Future Features

**Short-term:**
- Long-press tooltip on mobile devices
- Keyboard shortcut to toggle Learn Mode (e.g., Alt+L)
- Search/filter on detail page
- "Next/Previous Key" navigation on detail page

**Medium-term:**
- Interactive examples on detail page
- Animated keystroke demonstrations
- Related keys auto-linking
- Categorized key browser view

**Long-term:**
- Full tutorial system integrated with Learn Mode
- Achievement/progress tracking
- Guided learning paths
- Community-contributed examples

---

## 16. Mermaid Diagrams

### 16.1 System Architecture

```mermaid
graph TB
    subgraph "HTML Layer"
        A[index.html]
        B[key buttons with data-key]
        C[Learn Mode toggle]
        D[docs/key-detail.html]
    end
    
    subgraph "CSS Layer"
        E[styles.css]
        F[Educational layer styles]
    end
    
    subgraph "JavaScript Layer"
        G[key-metadata.js]
        H[key-info.js]
        I[calculator.js]
    end
    
    subgraph "Data"
        J[HP12C_KEY_METADATA]
    end
    
    A --> B
    A --> C
    B --> I
    C --> H
    D --> H
    E