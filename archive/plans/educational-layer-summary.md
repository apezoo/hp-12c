# Educational Key-Information Layer - Executive Summary

## Overview

This plan provides a complete blueprint for integrating an educational key-information system into the existing HP-12C web calculator without breaking any existing functionality.

## Key Design Decisions

### 1. Zero Breaking Changes Strategy
- **Learn Mode uses capture-phase event handling** - intercepts clicks before they reach calculator.js
- **No modifications to calculator.js required** - existing event handlers remain untouched
- **Data-key standardization** - systematic update of all 40 buttons to use consistent naming

### 2. Local-First Architecture
- **No fetch() for JSON** - metadata stored as global `window.HP12C_KEY_METADATA`
- **No build tools** - pure vanilla JavaScript, HTML, CSS
- **Browser-executable** - works directly from file:// URLs

### 3. Honest Implementation Status
- Every key clearly marked: implemented, partially-implemented, planned, not-implemented
- Detail pages explicitly state what works vs what's planned
- No misleading claims about unimplemented financial/scientific functions

### 4. Progressive Enhancement
- **Default mode:** Normal calculator operation (tooltips on hover)
- **Learn Mode:** Click any key to see detailed educational content
- **Accessibility-first:** Keyboard navigation, screen reader support, semantic HTML

## Implementation Scope

### New Files (3)
1. **`js/key-metadata.js`** (~800-1000 lines) - Complete metadata for 40 keys
2. **`js/key-info.js`** (~500-700 lines) - Educational layer functionality
3. **`docs/key-detail.html`** (~300-400 lines) - Dynamic detail page

### Modified Files (2)
1. **`index.html`** - 40 data-key updates + Learn Mode toggle
2. **`css/styles.css`** - ~200 lines of educational layer styles

### Unchanged Files
- `js/calculator.js` - No changes needed (optional: wire existing CHS function)
- `js/rpn-stack.js` - No changes
- `js/display.js` - No changes
- `js/memory.js` - No changes
- All other existing files remain untouched

## Core Features

### 1. Learn Mode Toggle
- Prominent toggle control above calculator
- OFF: Normal calculator operation
- ON: Clicking keys opens detail pages
- Keyboard accessible (Space/Enter)
- Clear visual state (OFF/ON)

### 2. Tooltip System
- Appears on hover/focus (300ms delay for hover)
- Shows: key name, category, primary function, shifted functions, status
- Smart positioning (above preferred, viewport-aware)
- Dark theme with gold accent border
- Implementation status badges
- Works on desktop and mobile (focus-based)

### 3. Detail Page
- Single dynamic page: `docs/key-detail.html?key=<id>`
- Sections: Hero, Primary Function, Shifted Functions, Original Behavior, Simulator Status, Related Topics
- Honest implementation status prominently displayed
- Error handling for invalid keys
- Back navigation to calculator
- Consistent visual design with examples page

## Data Architecture

### Key Metadata Schema
```javascript
{
  id, dataKey, label, displayName,
  category, type,
  primaryFunction: { title, description, examples, keystrokes },
  shiftedFunctions: { 
    gold: [{ label, title, description, implementationStatus, examples, keystrokes }],
    blue: [{ ... }]
  },
  shortDescription, longDescription,
  implementation: { status, note, version },
  originalHp12cBehavior, simulatorBehavior,
  relatedTopics, relatedKeys, commonMistakes, expertTips
}
```

### Complete Key Inventory (40 keys)
- 5 Financial (n, i, pv, pmt, fv)
- 10 Digits (digit-0 through digit-9)
- 4 Operations (op-add, op-subtract, op-multiply, op-divide)
- 6 Scientific (power-yx, reciprocal, percent-total, delta-percent, percent, eex)
- 6 Stack (rs, sst, roll-down, swap-xy, clx, enter)
- 9 Control/Memory (on, prefix-f, prefix-g, sto, rcl, decimal, sigma-plus, chs)

## Implementation Status Mapping

### ✅ Fully Implemented (13 keys)
- All digit keys (0-9, decimal)
- Basic arithmetic (+, −, ×, ÷)
- Stack operations (ENTER, CLx, R↓, x↔y)
- Control (ON, prefix-f, prefix-g)

### ⚙️ Partially Implemented (3 keys)
- CHS - coded but not wired to UI
- STO/RCL - MemoryManager complete but not wired

### ⚠️ Planned (24+ keys)
- All financial functions
- All scientific functions
- All percentage functions
- All date functions
- All programming functions
- All statistics functions
- All depreciation/bond functions

## Integration Strategy

### Event Flow
```
User clicks key in Learn Mode
  ↓
key-info.js capture-phase handler intercepts
  ↓
event.stopPropagation() prevents calculator.js from seeing click
  ↓
Navigate to docs/key-detail.html?key=<data-key>
  ↓
key-info.js renders detail page from metadata
```

### Load Order
```
1. Core calculator modules (rpn-stack, display, memory, etc.)
2. key-metadata.js (defines window.HP12C_KEY_METADATA)
3. key-info.js (depends on metadata)
4. calculator.js (existing, unchanged)
```

## Visual Design

### Learn Mode Toggle
- Location: Above calculator, centered
- Style: Modern iOS-style toggle switch
- Colors: Gray when OFF, blue gradient when ON
- Hint text changes with state
- Subtle, professional, non-intrusive

### Tooltips
- Dark semi-transparent background (#1a1d23, 95% opacity)
- Gold border accent (#d79a33)
- White text with good contrast
- Status badges with color coding
- Max width: 320px desktop, 280px mobile
- Smooth fade-in (200ms)

### Detail Page
- Consistent with existing docs/examples.html styling
- Card-based layout with clear sections
- Prominent status badges
- Navigation breadcrumbs
- Responsive design

## Testing Strategy

### Manual Testing (14 phases)
1. Data-key standardization
2. Metadata completeness
3. Learn Mode toggle
4. Calculator behavior - default mode
5. Learn Mode behavior
6. Tooltip system - desktop
7. Tooltip system - mobile
8. Detail page - valid keys
9. Detail page - various keys
10. Detail page - error states
11. Accessibility
12. Responsive design
13. Browser compatibility
14. Performance

### Key Test Scenarios
- ✅ Default mode: Clicking 7 still enters 7
- ✅ Default mode: All calculator operations work
- ✅ Learn Mode ON: Clicking key opens detail page
- ✅ Learn Mode ON: Calculator action does NOT fire
- ✅ Tooltip appears on hover/focus
- ✅ Detail page renders correctly for all keys
- ✅ Error handling for invalid keys
- ✅ Keyboard navigation works
- ✅ Mobile/tablet responsive

## Risk Mitigation

### Primary Risks Addressed
1. **Breaking calculator** → Capture-phase event handling (zero calculator.js changes)
2. **Data-key mismatches** → Systematic standardization with testing
3. **Tooltip viewport issues** → Robust positioning with viewport clamping
4. **Learn Mode not obvious** → Clear toggle with prominent visual state
5. **Accessibility gaps** → ARIA attributes, keyboard support, semantic HTML

### Rollback Strategy
- Remove `<script>` tags for key-metadata.js and key-info.js
- Revert data-key changes if needed (git checkout)
- Educational CSS is isolated and can be removed

## Success Metrics

### Must Achieve
- ✅ Zero regression in existing calculator functionality
- ✅ All 40 keys have complete metadata
- ✅ Tooltips work on desktop and mobile
- ✅ Learn Mode clearly toggles states
- ✅ Detail pages load for all keys
- ✅ Implementation status is honest and clear
- ✅ Keyboard accessible
- ✅ Works on Chrome, Firefox, Safari

### Nice to Have
- Ctrl/Cmd+Click direct detail navigation
- Long-press tooltip on mobile
- Next/Previous key navigation
- Related keys auto-linking

## Implementation Phases

1. ✅ **Preparation** (Complete) - Analysis and planning
2. **Metadata Creation** - Write complete key metadata
3. **Data-Key Standardization** - Update index.html
4. **Learn Mode Toggle** - UI and functionality
5. **Tooltip System** - Hover/focus tooltips
6. **Learn Mode Interception** - Capture-phase click handling
7. **Detail Page** - Dynamic rendering system
8. **Integration Testing** - Full test suite
9. **Documentation** - User guide and developer docs
10. **Launch** - Final testing and deployment

## Next Steps

To proceed with implementation:

1. **Switch to Code mode** to begin creating the actual files
2. Start with Phase 2: Create `js/key-metadata.js` with complete metadata
3. Continue through each phase systematically
4. Test thoroughly after each phase

## Resources

- **Full Plan:** `plans/educational-layer-implementation-plan.md`
- **Current Codebase:** `index.html`, `css/styles.css`, `js/calculator.js`
- **Examples Reference:** `docs/examples.html` (for styling consistency)

---

**Status:** Architecture complete, ready for implementation
**Estimated Total Code:** ~1,500-2,000 new lines across 3 files, ~250 modified lines in 2 files
**Breaking Changes:** None (designed for zero regression)
**External Dependencies:** None (pure vanilla JS/HTML/CSS)
