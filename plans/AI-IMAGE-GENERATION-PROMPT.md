# HP-12C AI Image Generation Prompt

## ⚠️ Problem Analysis

Previous AI-generated images had critical layout errors:

1. **+ Button Misplaced**: Located in row with 1-2-3 → Must be at bottom in column 5 (right operator column)
2. **Operator Column Broken**: Right column (÷ × − +) not vertically aligned
3. **Bottom Row Shifted**: ON/f/g/STO/RCL misaligned with columns above
4. **ENTER Button Wrong**: Not properly double-height and left-aligned with number row

These are typical weaknesses of image AI with strict logical button grids.

---

## ✅ Improved Prompt (Copy 1:1 to Image AI)

```
Create a photorealistic, exact 1:1 front-view replica of the original Hewlett-Packard HP-12C financial calculator. No artistic freedom, no deviations from the real device.

Use a strict 5-column grid for all buttons. All buttons are black with slightly rounded corners, raised bevel and subtle 3D shadow. Primary labels are large white text. f-functions (above) are small orange text. g-functions (below on sloped front edge) are small blue text.

Layout exactly as follows (row by row, left to right):

Row 1 (top financial row):
AMORT/n/12× | INT/i/12÷ | NPV/PV/CF₀ | RND/PMT/CFⱼ | IRR/FV/Nⱼ

Row 2:
DATE/CHS/BEG | MEM/7/FIX | END/8/SCI | MEM/9/ENG | ÷

Row 3:
PRICE/yˣ/√x | YTM/1/x/Eˣ | SL/%T/LN | SOYD/Δ%/FRAC | DB/%/INTG

Row 4:
EEX | ΔDYS/4/D.MY | 5/M.DY | 6/x̄w | ×

Row 5:
PSE/R/S/P/R | BST/SST/Σ | GTO/R↓/x↔y | x=0/x↔y/CLΣ | ∫xy/CLx/∫xR

Then a tall ENTER key (double height, spans row 5 and row 6, left column) with white text "ENTER ↑"

In the same row as the numbers (row 6):
YLD/1/10ˣ | 2/LOG | 3/yˣ | −

Row 7 (bottom row):
Red recessed ON button (leftmost) | orange f button | blue g button | ŷ,r/STO/x̄ | %/RCL/s

In the rightmost column of row 7 must be the + button.

All other buttons in row 7: BOND/0/x² | DBY/./1/X | L.R./Σ+/Σ−

The faceplate is brushed gold metal with a thin black border. Top left: small white "hp" logo. Top right: black rectangle with yellow "hp 12C". Bottom center: "HEWLETT·PACKARD" in black capital letters.

Display above the keys shows "0." in 7-segment style on light beige background (#c8c8a0) with status indicators USER F G BEGIN GRAD D.MY C PRGM.

Perfectly aligned grid, correct button sizes, correct colors, correct label positions, high detail, sharp focus, studio lighting, no background.
```

---

## 🎯 Additional Tips for Image AI

Add these instructions to improve grid accuracy:

- **"strict 5-column CSS grid layout, no rearrangement allowed"**
- **"photorealistic product photography style"**
- **"exact vertical alignment of operator column (÷ × − +)"**
- **"bottom row ON-f-g-STO-RCL must align perfectly with columns above"**

---

## 📐 Critical Grid Requirements

### Column Structure (5 columns, left to right):

```
Column 1  | Column 2 | Column 3 | Column 4 | Column 5
----------|----------|----------|----------|----------
n         | i        | PV       | PMT      | FV
CHS       | 7        | 8        | 9        | ÷
yˣ        | 1/x      | %T       | Δ%       | %
EEX       | 4        | 5        | 6        | ×
R/S       | SST      | R↓       | x↔y      | CLx
ENTER     | 1        | 2        | 3        | −
(cont.)   | 0        | .        | Σ+       | +
ON        | f        | g        | STO      | RCL
```

### Row 6-7 Detail (Critical for AI):

**Row 6:**
- Column 1: ENTER (spans rows 6 AND 7 vertically!)
- Columns 2-5: 1, 2, 3, −

**Row 7:**
- Column 1: (continues ENTER from above)
- Columns 2-5: 0, ., Σ+, +

**Row 8 (bottom):**
- All 5 columns: ON, f, g, STO, RCL

---

## 🎨 Visual Specifications

### Colors (Exact Values):
- **Case:** Matt black (#1a1a1a)
- **Front Plate:** Brushed gold/beige (#d4af70 to #c9a961)
- **Buttons:** Matt black (#2a2a2a)
- **Primary Labels:** White (#ffffff)
- **Gold/Orange Labels:** #ff9f00
- **Blue Labels:** #00b0ff
- **f-Key Background:** Orange (#f5a623)
- **g-Key Background:** Blue (#00a0d8)
- **ON-Key Background:** Red (#c8102a)
- **Display Background:** Beige (#c8c8a0)
- **Display Segments:** Black (#000000)

### Dimensions:
- **Calculator:** 128mm × 79mm (landscape)
- **Button Gap:** 6px
- **Button Radius:** 6px
- **Case Radius:** 20px
- **Front Plate Radius:** 12px

### Label Sizes:
- **Gold/Blue Functions:** 7px
- **Primary Labels:** 13px
- **Operators (÷×−+):** 22px
- **Decimal Point (.):** 28px

### 3D Effects:
- **Button Depth:** box-shadow: 0 3px 0 rgba(0,0,0,0.3)
- **Raised Bevel:** Subtle light highlight on top edge
- **Slanted Front Edge:** Blue labels sit on 14px gradient bottom strip

---

## 🚨 Critical Errors to Avoid

### ❌ Common AI Mistakes:

1. **+ button in wrong row** → Must be bottom-right (row 7, column 5)
2. **ENTER not tall enough** → Must span exactly 2 rows (rows 6-7, column 1)
3. **Bottom row misaligned** → ON-f-g-STO-RCL must perfectly align with columns above
4. **Operators not vertical** → ÷ × − + must form perfect vertical line (column 5, rows 2-3-6-7)
5. **Number row broken** → 0-.-Σ+ must align with 1-2-3 above (row 7 vs row 6)

### ✅ Validation Checklist:

- [ ] ENTER button spans rows 6-7 in column 1
- [ ] + button is in row 7, column 5 (bottom-right)
- [ ] Operator column (÷ × − +) perfectly vertical in column 5
- [ ] Row 8 (ON/f/g/STO/RCL) aligns with all columns above
- [ ] Number 0 is directly below number 1 (column 2)
- [ ] Decimal . is directly below number 2 (column 3)
- [ ] Σ+ is directly below number 3 (column 4)
- [ ] All buttons have consistent gaps (6px)
- [ ] All buttons have rounded corners (6px radius)
- [ ] Gold labels at top (8%), blue labels at bottom (12%)

---

## 📝 Alternative Approach: SVG Generation

If AI image generation continues to fail, consider:

1. **Generate SVG with code** → Perfect geometric accuracy
2. **Use CSS Grid** → Already implemented in our HTML/CSS
3. **Screenshot HTML** → Our implementation is 99% accurate
4. **Manual Photoshop** → Trace over screenshot with proper textures

---

## 🔗 Related Documentation

- [`DESIGN-REBUILD-SUMMARY.md`](../DESIGN-REBUILD-SUMMARY.md) - Our exact implementation
- [`AUTHENTIC-DESIGN-SPECS.md`](AUTHENTIC-DESIGN-SPECS.md) - Original HP-12C specifications
- [`AUTHENTIC-DESIGN-IMPLEMENTATION.md`](AUTHENTIC-DESIGN-IMPLEMENTATION.md) - Implementation guide
- [`index.html`](../index.html) - Correct button layout (rows 1-8)
- [`css/styles.css`](../css/styles.css) - Exact visual styling

---

## 🎯 Success Criteria

Generated image must achieve:

- **Grid Accuracy:** 100% (all buttons in correct position)
- **Visual Fidelity:** 95%+ (authentic HP-12C appearance)
- **Label Accuracy:** 100% (all text correct and positioned)
- **Color Accuracy:** 90%+ (brushed gold, matt black, proper labels)
- **3D Depth:** 85%+ (realistic button shadows and bevels)

**Overall Target:** Photorealistic replica that could be mistaken for a real HP-12C photograph.

---

*Last Updated: 2026-04-12*
*Status: Ready for AI image generation with improved specifications*
