# HP-12C Visual Design Specification

## 🎨 Design Overview

This document provides the complete visual design specification for the HP-12C calculator web simulator. The design aims to be authentic to the original while adding modern enhancements.

## 📐 Layout and Dimensions

### Overall Calculator Dimensions
```
Desktop:  400px × 650px
Tablet:   360px × 585px  
Mobile:   340px × 555px (minimum)
```

### Component Breakdown
```
┌────────────────────────────────────────┐
│         HP-12C Header                  │ 40px
│         FINANCIAL PROGRAMMABLE         │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │  Stack: T: 0.00  Z: 0.00         │ │ 25px (optional)
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │           0.                     │ │ 60px
│  │                                  │ │
│  └──────────────────────────────────┘ │
│  [USER] [f] [g] [BEGIN] [END]        │ 8px status
├────────────────────────────────────────┤
│                                        │
│  Financial Row                         │ 50px
│  [n]  [i]  [PV] [PMT] [FV]            │
│                                        │
│  Function Row                          │ 50px
│  [f]  [g]  [STO][RCL][R/S]            │
│                                        │
│  Stack Row                             │ 50px
│  [SST][R↓] [x↔y][CLx][ENTER]          │
│                                        │
│  Number Pad (4 rows)                   │ 50px each
│  [7]  [8]  [9]  [÷]                   │
│  [4]  [5]  [6]  [×]                   │
│  [1]  [2]  [3]  [-]                   │
│  [ON] [0]  [.]  [Σ+] [+]              │
│                                        │
└────────────────────────────────────────┘
```

### Button Grid
```
5 columns × 8 rows
Button size: 70px × 45px
Gap: 4px
Padding: 8px
```

## 🎨 Color Palette

### Classic HP Theme (Default)
```css
/* Body & Case */
--hp-body-dark:     #2B1810;   /* Dark brown/black */
--hp-body-medium:   #4A3428;   /* Medium brown */
--hp-body-light:    #6B4E3D;   /* Light brown */
--hp-bezel:         #1A1A1A;   /* Almost black */

/* Display */
--display-bg:       #1C2218;   /* Dark green LCD background */
--display-on:       #9FCD5A;   /* Bright LCD green */
--display-off:      #2A3324;   /* Dim LCD segments */
--display-border:   #0D0F0B;   /* Dark border */

/* Buttons - Main */
--button-bg:        #8B6B47;   /* Golden brown */
--button-text:      #FFFEF0;   /* Cream white */
--button-hover:     #A37C52;   /* Lighter brown */
--button-active:    #6B4E35;   /* Darker brown */
--button-shadow:    rgba(0,0,0,0.3);

/* Buttons - Gold (f key functions) */
--gold-bg:          #D4AF37;   /* Metallic gold */
--gold-text:        #1A1A1A;   /* Dark text */
--gold-shine:       #F0D870;   /* Gold highlight */

/* Buttons - Blue (g key functions) */
--blue-bg:          #2C4875;   /* Deep blue */
--blue-text:        #87CEEB;   /* Sky blue text */
--blue-highlight:   #4A6FA5;   /* Lighter blue */

/* Buttons - Special (ON, ENTER) */
--special-bg:       #5C3D2E;   /* Dark brown */
--special-text:     #FFAA00;   /* Orange accent */

/* Accent Colors */
--gold-label:       #FFD700;   /* Gold function labels */
--blue-label:       #87CEEB;   /* Blue function labels */
--white-label:      #FFFFFF;   /* Primary labels */
```

### Alternative Theme - Matrix Mode
```css
--matrix-bg:        #0A0E0A;   /* Almost black */
--matrix-display:   #00FF41;   /* Bright green */
--matrix-button:    #1A2F1A;   /* Dark green */
--matrix-text:      #00FF41;   /* Matrix green */
--matrix-glow:      0 0 10px rgba(0, 255, 65, 0.5);
```

### Alternative Theme - Neon 80s
```css
--neon-bg:          #1A0033;   /* Deep purple */
--neon-display:     #FF00FF;   /* Magenta */
--neon-button:      #330066;   /* Purple */
--neon-accent:      #00FFFF;   /* Cyan */
--neon-glow:        0 0 15px currentColor;
```

## 🖋️ Typography

### Display Font
```css
font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
font-size: 32px;
font-weight: 600;
letter-spacing: 2px;
text-align: right;
```

### Button Primary Labels
```css
font-family: 'Arial', 'Helvetica', sans-serif;
font-size: 14px;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.5px;
```

### Button Secondary Labels (Gold/Blue)
```css
font-size: 10px;
font-weight: 600;
position: absolute;
top: 3px / bottom: 3px;
```

### Header Text
```css
font-family: 'Arial', 'Helvetica', sans-serif;
font-size: 16px;
font-weight: 700;
letter-spacing: 2px;
```

## 🔘 Button Design

### Standard Button Structure
```
┌────────────────────┐
│  blue label        │  ← Gold function (top, 10px)
│                    │
│      MAIN          │  ← Primary label (center, 14px)
│                    │
│  gold label        │  ← Blue function (bottom, 10px)
└────────────────────┘
```

### Button States & Animations

#### Normal State
```css
background: linear-gradient(180deg, var(--button-bg) 0%, var(--button-hover) 100%);
border: 1px solid rgba(0,0,0,0.2);
border-radius: 4px;
box-shadow: 0 2px 4px var(--button-shadow);
transition: all 0.15s ease;
```

#### Hover State
```css
transform: translateY(-1px);
box-shadow: 0 3px 6px var(--button-shadow);
filter: brightness(1.1);
```

#### Active State (pressed)
```css
transform: translateY(1px);
box-shadow: 0 1px 2px var(--button-shadow) inset;
filter: brightness(0.9);
transition: all 0.05s ease;
```

#### Prefix Active (f or g pressed)
```css
/* Gold (f) prefix active */
outline: 2px solid var(--gold-label);
box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);

/* Blue (g) prefix active */
outline: 2px solid var(--blue-label);
box-shadow: 0 0 10px rgba(135, 206, 235, 0.5);
```

### Special Button Styles

#### Financial Keys (n, i, PV, PMT, FV)
```css
background: linear-gradient(180deg, #6B4E3D 0%, #5C3D2E 100%);
border-top: 1px solid rgba(255, 215, 0, 0.3);
```

#### ENTER Key
```css
background: linear-gradient(180deg, #5C3D2E 0%, #4A3020 100%);
width: 100px; /* Double width */
font-size: 16px;
color: #FFAA00;
```

#### ON Key
```css
background: #8B0000; /* Dark red */
color: #FFFFFF;
```

## 📟 Display Design

### LED Display Module
```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │           0.                   │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│  [USER] [f] [g] [BEGIN] [END] [C]    │
└──────────────────────────────────────┘
```

### Display Features
- **Main Number Area**: 10 digits + decimal + sign
- **Scientific Notation**: "1.234567890 E-12" format
- **Status Indicators**: Small icons below display
- **LED Effect**: Slight glow and shadow for depth

### Display CSS
```css
.display {
  background: var(--display-bg);
  border: 3px solid var(--display-border);
  border-radius: 2px;
  padding: 15px 20px;
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.5),
    0 1px 0 rgba(255,255,255,0.1);
}

.display-value {
  color: var(--display-on);
  text-shadow: 
    0 0 5px var(--display-on),
    0 0 10px rgba(159, 205, 90, 0.5);
  filter: blur(0.3px); /* Slight blur for LED effect */
}

.display-indicators {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: var(--display-off);
  margin-top: 5px;
}

.indicator.active {
  color: var(--display-on);
  text-shadow: 0 0 3px var(--display-on);
}
```

## 🎭 Visual Effects

### Button Press Animation
```css
@keyframes button-press {
  0% { transform: scale(1) translateY(0); }
  50% { transform: scale(0.95) translateY(2px); }
  100% { transform: scale(1) translateY(0); }
}
```

### Display Update Flash
```css
@keyframes display-flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Stack Movement
```css
@keyframes stack-lift {
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-5px); opacity: 0.5; }
  100% { transform: translateY(0); opacity: 1; }
}
```

### Error Shake
```css
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

### Achievement Celebration
```css
@keyframes celebrate {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

## 📱 Responsive Design

### Desktop (≥768px)
```css
.calculator {
  width: 400px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.button {
  width: 70px;
  height: 45px;
  font-size: 14px;
}
```

### Tablet (≥480px < 768px)
```css
.calculator {
  width: 360px;
  padding: 15px;
}

.button {
  width: 62px;
  height: 42px;
  font-size: 13px;
}
```

### Mobile (<480px)
```css
.calculator {
  width: 100%;
  max-width: 340px;
  padding: 10px;
}

.button {
  width: 58px;
  height: 40px;
  font-size: 12px;
}
```

## 🎯 Accessibility Features

### Visual
- High contrast (4.5:1 minimum)
- Clear focus indicators
- Sufficient button spacing (44px minimum touch target)

### Focus Styles
```css
.button:focus {
  outline: 3px solid #FFD700;
  outline-offset: 2px;
  z-index: 10;
}
```

### Screen Reader Support
```html
<button aria-label="Enter key: Push value to stack">
  ENTER
</button>
```

## 🎨 Theme Variants

### 1. Classic HP (Default)
Authentic HP-12C brown/gold appearance with LCD green display.

### 2. Matrix Mode
Black background, bright green display and text, subtle glow effects.

### 3. Neon 80s
Purple background, magenta/cyan color scheme, strong glow effects.

### 4. Moonlight
Dark blue theme with soft white/blue accents, minimal glow.

### 5. Solid Gold
Luxurious gold theme with black accents, premium appearance.

## 📦 Component Preview

### Header Section
```
┌──────────────────────────────────────┐
│       HP-12C                         │
│  FINANCIAL PROGRAMMABLE              │
└──────────────────────────────────────┘
```

### Display Section
```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │           0.                   │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│  [USER] [f] [g] [BEGIN] [END]        │
└──────────────────────────────────────┘
```

### Button Section
```
┌──────────────────────────────────────┐
│  Financial Keys Row                  │
│  [n]    [i]    [PV]   [PMT]   [FV]  │
│                                       │
│  Function Keys Row                   │
│  [f]    [g]    [STO]  [RCL]   [R/S] │
│                                       │
│  Stack Operations Row                │
│  [SST]  [R↓]   [x↔y]  [CLx] [ENTER]│
│                                       │
│  Number Pad (4 rows)                 │
│  [7]    [8]    [9]    [÷]           │
│  [4]    [5]    [6]    [×]           │
│  [1]    [2]    [3]    [-]           │
│  [ON]   [0]    [.]    [Σ+]   [+]    │
└──────────────────────────────────────┘
```

## 🎭 Animation Timing

```css
/* Standard transitions */
--transition-fast:    0.1s ease;
--transition-medium:  0.2s ease;
--transition-slow:    0.3s ease;

/* Button interactions */
button-press:         0.05s
button-hover:         0.15s
button-focus:         0.2s

/* Display updates */
display-flash:        0.1s
number-change:        0.15s

/* Stack operations */
stack-lift:           0.3s
stack-drop:           0.25s

/* Special effects */
error-shake:          0.4s
achievement-pop:      0.5s
theme-transition:     0.5s
```

## ✨ Polish Details

### Subtle Enhancements
1. **Micro-interactions**: Button press provides tactile feedback
2. **Sound effects**: Optional click sounds for button presses
3. **Haptic feedback**: Vibration on mobile devices
4. **Smooth transitions**: All state changes animated
5. **Loading states**: Spinner for long calculations
6. **Error handling**: Shake animation + clear message
7. **Success feedback**: Subtle green flash on valid operations
8. **Context-sensitive help**: Tooltips on hover

### Easter Eggs
1. **Konami code**: Unlocks retro theme
2. **Calculator birthday**: Special animation on release date
3. **42 result**: Shows "The Answer" message
4. **Pi day**: March 14 shows special π animation
5. **Achievement unlocks**: Confetti for milestones

---

## 🎯 Design Goals

✅ **Authentic**: True to HP-12C appearance  
✅ **Modern**: Smooth animations and effects  
✅ **Accessible**: WCAG 2.1 AA compliant  
✅ **Responsive**: Works on all screen sizes  
✅ **Performant**: 60fps animations  
✅ **Delightful**: Fun without being distracting  

---

*This design specification ensures a professional, authentic, and enjoyable HP-12C calculator experience.*
