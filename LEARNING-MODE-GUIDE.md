# 📚 Learning Mode Guide

## Overview
Learning Mode is an interactive educational feature that allows users to explore the HP-12C calculator's functions without performing actual calculations.

## How to Use Learning Mode

### 1. Enable Learning Mode
- Locate the **Learn Mode** toggle at the top of the calculator
- Click the toggle button to switch it **ON**
- You'll see the toggle indicate "ON" state

### 2. Explore Keys
When Learning Mode is **ON**:
- **Click any calculator key** → Redirects to detailed information page
- **Hover over keys** → Shows quick tooltip with basic info

When Learning Mode is **OFF**:
- Keys function normally (perform calculations)
- Tooltips still available on hover

### 3. View Key Details
The detail page shows:
- **Primary function** and description
- **Gold functions** (accessed with f prefix)
- **Blue functions** (accessed with g prefix)
- **Implementation status**
- **Usage examples**
- **Technical notes**

### 4. Navigate Back
- Click "← Back to Calculator" button
- Or use your browser's back button

## Features

### Quick Tooltips
- Available in **both modes**
- Appear after hovering for 300ms
- Show key category and short description
- Automatically positioned to stay in viewport

### Interactive Detail Pages
- Only accessible when **Learn Mode is ON**
- Comprehensive information for each key
- Color-coded functions (Gold/Blue)
- Implementation status badges
- Links to related functions

### Visual Indicators
- **OFF state**: Default calculator operation
- **ON state**: Visual highlighting, clickable keys indicator
- **Active hover**: Special cursor and key highlighting

## Implementation Details

### Files Modified
- [`js/calculator.js`](js/calculator.js:80-84) - Added Learn Mode detection
- [`js/key-info.js`](js/key-info.js:155-193) - Enhanced event handling
- [`index.html`](index.html:18-42) - Added helpful hints

### Event Handling
1. **Capture Phase**: Learn Mode intercepts clicks first
2. **Event Prevention**: `stopImmediatePropagation()` prevents calculator handlers
3. **Conditional Processing**: Calculator checks Learn Mode state before processing

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Touch-friendly interface

## Troubleshooting

### Redirect Not Working?
- ✅ **Fixed**: Calculator now properly yields to Learn Mode
- Ensure JavaScript is enabled
- Check browser console for errors

### Keys Still Calculate?
- Verify Learn Mode toggle shows "ON"
- Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- Check that HP12C_EDUCATIONAL is defined in console

### Detail Page Shows "Key Not Found"?
- Ensure key-metadata.js is loaded
- Check URL parameter format: `?key=<key-id>`
- View browser console for specific error

## Testing

### Quick Test Procedure
1. Open http://localhost:8000/index.html
2. Toggle Learn Mode ON
3. Click the "7" key
4. Verify redirect to: `docs/key-detail.html?key=digit-7`
5. Verify key details display correctly
6. Click "Back to Calculator"
7. Toggle Learn Mode OFF
8. Click "7" again - should enter digit normally

### Test Coverage
- ✅ Learn Mode toggle functionality
- ✅ Event interception in capture phase
- ✅ Calculator handler skip when Learn Mode active
- ✅ Redirect to detail page
- ✅ Metadata loading on detail page
- ✅ Back navigation to calculator

## Advanced Usage

### Keyboard Shortcuts
- **Space/Enter**: Toggle Learn Mode (when toggle button focused)
- **Escape**: Close tooltips
- **Tab**: Navigate between elements

### Programmatic Access
```javascript
// Check if Learn Mode is enabled
window.HP12C_EDUCATIONAL.learnMode.isEnabled()

// Toggle Learn Mode programmatically
window.HP12C_EDUCATIONAL.learnMode.toggle()

// Set Learn Mode state
window.HP12C_EDUCATIONAL.learnMode.setEnabled(true)

// Get key metadata
window.HP12C_KEY_METADATA['digit-7']
```

### Debug Logging
Open browser console to see:
- Learn Mode state changes
- Key click interceptions
- Redirect URLs
- Metadata loading status

## Future Enhancements

### Potential Additions
- [ ] Animated tutorial on first visit
- [ ] Search functionality for functions
- [ ] Bookmarking favorite functions
- [ ] Print-friendly key reference
- [ ] Dark mode for detail pages
- [ ] Keyboard shortcut overlay
- [ ] Interactive examples with live calculation

### Known Limitations
- Requires JavaScript enabled
- Detail pages require key-metadata.js
- No offline mode currently
- No mobile app version

## Support

### Reporting Issues
If you encounter problems:
1. Check browser console for errors
2. Verify server is running on port 8000
3. Ensure all JS files are loaded
4. Test with different browsers

### Contact
For questions or suggestions, refer to project documentation or open an issue on the project repository.

---

**Version**: 1.0  
**Last Updated**: April 13, 2026  
**Status**: ✅ Fully Functional
