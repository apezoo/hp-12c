# HP-12C Authentic Design Specifications

## Feedback Analysis (from Original HP-12C)

### 1. Key Architecture (Beveled Key Design)

**3D Profile**:
- Each key is a flat cuboid with a beveled (chamfered) front face
- Bevel angle: ~45° toward the user
- Haptic: Matte, slightly rough plastic texture
- Color: **Anthracite/Dark Gray** (NOT brown)
- Spacing: Clear gaps between keys for industrial look

### 2. Three-Level Color System

#### Level 1: Primary Function (White)
- **Position**: Directly on top of the flat key surface
- **Color**: Pure white or slight off-white
- **Examples**: Numbers (0-9), operators (+, -, ×, ÷), financial variables (n, i, PV, PMT, FV)

#### Level 2: Gold Functions (f-key)
- **Position**: On the **housing ABOVE** the key (NOT on the key itself!)
- **Color**: Rich golden-yellow or amber
- **Examples**: Above PV key = "AMORT", above n key = "12×"

#### Level 3: Blue Functions (g-key)
- **Position**: On the **beveled front face** of the key (the angled part)
- **Color**: Bright, clear sky blue
- **Examples**: On bevel of n key = "12÷", on bevel of 0 key = "x̄"

### 3. Special Key Highlights

**ENTER Key**:
- **Size**: Extends vertically over 2 rows (or double width)
- Largest key on calculator
- Same anthracite color

**Prefix Keys (f and g)**:
- **f key**: Completely colored in **gold/amber**
- **g key**: Completely colored in **bright blue**
- These are control keys, visually distinct

**ON Key**:
- Bottom left position
- Sometimes slightly recessed or with indentation

### 4. Typography

**Font**: Serifenlos/Sans-serif, Helvetica-like
- **Numbers**: Slightly bolder (Bold weight)
- **Function abbreviations**: Regular weight
- **Finish**: Crisp, technical appearance

### 5. Housing & Materials

**Case**:
- **Material**: Brushed metal look (aluminum)
- **Color**: Dark gold or bronze tone
- Frames the black key field

**Display Window**:
- **Shape**: Narrow rectangular LCD segment display
- **Frame**: Golden/bronze border
- **Off state**: Slightly grayish LCD segments visible
- **Background**: Dark, almost black

### 6. Color Palette Update

```css
/* Corrected HP-12C Colors */
--hp-housing: #8B7355;        /* Brushed bronze/gold */
--hp-housing-dark: #6B5335;   /* Darker bronze */

--key-surface: #3A3A3C;       /* Anthracite gray (NOT brown) */
--key-bevel: #2C2C2E;         /* Darker gray for bevel */
--key-text-white: #FFFFFF;    /* Pure white for primary */
--key-text-gold: #FFB900;     /* Amber/gold for f-functions */
--key-text-blue: #00A4EF;     /* Sky blue for g-functions */

--key-f-bg: #FFB900;          /* Gold f-key background */
--key-g-bg: #00A4EF;          /* Blue g-key background */

--display-frame: #8B7355;     /* Gold frame */
--display-bg: #1C2218;        /* Dark LCD background */
--display-on: #9FCD5A;        /* LCD green segments */
```

## Implementation Requirements

### CSS Changes Needed:
1. Change key color from brown to **anthracite gray**
2. Add 3D bevel effect with CSS (box-shadow, gradients, transform)
3. Move gold labels ABOVE keys (in a separate label area on housing)
4. Position blue labels on front bevel face
5. Style f and g keys with solid colors
6. Make ENTER key double-sized (grid-row: span 2 or grid-column: span 2)
7. Update housing color to brushed bronze/gold
8. Refine display frame with gold border

### HTML Changes Needed:
1. Restructure button-row to include label areas above keys
2. Add bevel face elements for blue labels
3. Modify ENTER key to span 2 cells

## Priority

**CRITICAL** for authentic HP-12C appearance. Current design is functionally correct but visually inaccurate.
