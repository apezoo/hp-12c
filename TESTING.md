# HP-12C Calculator - Testing Guide

## 🎉 Currently Functional Features

### ✅ Phase 1: Foundation (COMPLETE)
- Beautiful HP-12C authentic appearance
- Responsive design (desktop, tablet, mobile)
- LED-style green display
- All 40 buttons with gold/blue function labels

### ✅ Phase 2: Core Calculator (COMPLETE)
- **RPN Stack**: 4-level stack (X, Y, Z, T) with automatic lift/drop
- **Number Entry**: Digits 0-9, decimal point
- **Arithmetic**: +, −, ×, ÷
- **Stack Operations**: ENTER, CLx, R↓, x⟷y
- **Memory**: CHS (change sign), LSTX (last X)
- **Display**: Fixed format with 2 decimal places

## 🧪 How to Test

### Open the Calculator
```bash
# Option 1: Direct open
open index.html

# Option 2: Local server
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Test Cases

#### Test 1: Basic Addition (2 + 3 = 5)
1. Click `2`
2. Click `ENTER`
3. Click `3`
4. Click `+`
5. **Expected**: Display shows `5.00`

#### Test 2: RPN Chain Calculation (15 + 10 × 2 = 50)
In RPN: `15 ENTER 10 ENTER 2 × +`
1. Click `1`, `5`, `ENTER`
2. Click `1`, `0`, `ENTER`
3. Click `2`
4. Click `×` (15, 10, 20 on stack)
5. Click `+` (15 + 20 = 35)
6. **Expected**: Display shows `35.00`

#### Test 3: Stack Operations
1. Click `5`, `ENTER`
2. Click `1`, `0`, `ENTER`
3. Click `1`, `5`
4. Click `R↓` (roll down)
5. **Expected**: Stack rotates, display changes
6. Click `x⟷y` (swap X and Y)
7. **Expected**: Display swaps

#### Test 4: Change Sign (CHS)
1. Click `5`
2. Click `f` (gold indicator lights up)
3. Click `+` (this is CHS in gold mode)
4. **Expected**: Display shows `-5.00`

#### Test 5: Division by Zero
1. Click `5`, `ENTER`
2. Click `0`
3. Click `÷`
4. **Expected**: Display shows "Error 0" with shake animation

## 🎨 Visual Elements to Review

### Display
- LED green glow effect
- Right-aligned numbers
- Always shows decimal point
- Status indicators below display

### Buttons
- Hover effect (slight lift)
- Click animation (press down)
- Gold (f) and blue (g) function labels
- Different colors for:
  - Financial keys (darker brown)
  - ON key (red)
  - ENTER key (special orange)
  - Number keys (medium brown)

### Responsive Design
- Try resizing browser window
- Test on mobile/tablet if available

## 📝 Feedback Areas

Please provide feedback on:

1. **Visual Design**
   - Colors and contrast
   - Button sizes and spacing
   - Display readability
   - Overall aesthetic

2. **User Experience**
   - Button press feedback
   - Responsiveness
   - Error handling
   - Learn curve for RPN

3. **Suggestions**
   - Missing features you'd like prioritized
   - UI/UX improvements
   - Performance issues
   - Browser compatibility

## 🔜 Next Phases (Pending)

- **Phase 3**: Mathematical functions (√x, x², 1/x, %, logs, powers)
- **Phase 4**: TVM financial calculations (n, i, PV, PMT, FV)
- **Phase 5**: Cash flow analysis (NPV, IRR)
- **Phase 6**: Advanced financial (amortization, depreciation, dates)
- **Phase 7**: Keyboard support, help system, final polish

---

**Current Status**: Basic calculator fully functional! Ready for your feedback and recommendations.
