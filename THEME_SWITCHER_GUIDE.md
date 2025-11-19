# 🎨 Theme Switcher - User Guide

## ✅ Setup Complete!

Profile page pe ab **Theme Switcher** available hai with 6 beautiful color options!

## How to Use

### Step 1: Go to Profile Page
Navigate to `/profile` page

### Step 2: Click "Theme" Button
Header me "Edit" button ke paas "Theme" button dikhega

### Step 3: Select Your Favorite Color
6 options available:
- 🌹 **Rose** (Default) - Pink/Rose theme
- 💜 **Purple** - Purple theme
- 💙 **Blue** - Blue theme
- 💚 **Green** - Green theme
- 🧡 **Orange** - Orange theme
- 💗 **Pink** - Pink theme

### Step 4: Enjoy!
Selected theme **pure project me apply** ho jayega instantly!

## Features

### ✅ 6 Beautiful Themes
Each theme has carefully selected colors:
- Light backgrounds
- Medium accents
- Dark text colors
- Matching gradients

### ✅ Instant Preview
Color circle dikhta hai each theme ka

### ✅ Current Theme Indicator
Check mark (✓) shows currently selected theme

### ✅ Persistent
Theme **localStorage me save** hota hai
- Refresh karne pe bhi same theme rahega
- Browser close karke open karne pe bhi rahega

### ✅ Global Application
Theme change karne se update hota hai:
- All page backgrounds
- All buttons
- All text colors
- All borders
- All gradients
- All cards
- Everything!

## Theme Details

### 1. Rose Theme 🌹
**Default theme** - Warm and friendly
- Primary: #f43f5e
- Light: #fff1f2
- Dark: #e11d48

### 2. Purple Theme 💜
Creative and spiritual
- Primary: #a855f7
- Light: #faf5ff
- Dark: #9333ea

### 3. Blue Theme 💙
Professional and calm
- Primary: #3b82f6
- Light: #eff6ff
- Dark: #2563eb

### 4. Green Theme 💚
Nature and growth
- Primary: #22c55e
- Light: #f0fdf4
- Dark: #16a34a

### 5. Orange Theme 🧡
Energetic and vibrant
- Primary: #f97316
- Light: #fff7ed
- Dark: #ea580c

### 6. Pink Theme 💗
Sweet and playful
- Primary: #ec4899
- Light: #fdf2f8
- Dark: #db2777

## Technical Details

### Where Theme is Stored
```javascript
localStorage.getItem('tara-theme') // Returns: 'rose', 'purple', etc.
```

### How Theme Works
1. User selects theme
2. JavaScript updates CSS variables
3. All colors change instantly
4. Theme saved to localStorage
5. On page reload, theme loads from localStorage

### CSS Variables Updated
When theme changes, these update:
```css
--rose-50 to --rose-700  /* All color shades */
--gradient-main          /* Page backgrounds */
--gradient-button        /* Button gradients */
--gradient-header        /* Card headers */
/* ... and more */
```

## For Developers

### Add Theme Selector to Other Pages
```jsx
import ThemeSelector from '../components/ThemeSelector';

<header>
  <ThemeSelector />
</header>
```

### Get Current Theme in Code
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { currentTheme, changeTheme, themes } = useTheme();
  
  return (
    <div>
      <p>Current: {currentTheme}</p>
      <button onClick={() => changeTheme('purple')}>
        Go Purple
      </button>
    </div>
  );
}
```

### Add New Theme
```javascript
// app/context/ThemeContext.js
export const themes = {
  // ... existing themes
  teal: {
    name: 'Teal',
    icon: '💎',
    colors: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
    }
  }
};
```

## Testing

### Test 1: Change Theme
1. Go to profile page
2. Click "Theme" button
3. Select different color
4. See instant change!

### Test 2: Persistence
1. Select a theme
2. Refresh page
3. Theme should remain same

### Test 3: Navigate Pages
1. Select a theme on profile
2. Go to insights page
3. Go to journal page
4. Theme should be same everywhere

### Test 4: Clear Theme
```javascript
// Browser console
localStorage.removeItem('tara-theme');
// Refresh page - will reset to Rose (default)
```

## Troubleshooting

### Q: Theme not changing?
**A:** 
- Hard refresh (Cmd+Shift+R)
- Check browser console for errors
- Make sure JavaScript is enabled

### Q: Theme not persisting?
**A:**
- Check if localStorage is enabled
- Check browser privacy settings
- Try incognito mode

### Q: Want to reset to default?
**A:**
```javascript
localStorage.removeItem('tara-theme');
// Refresh page
```

### Q: Theme looks weird?
**A:**
- Clear browser cache
- Hard refresh
- Check if all CSS loaded properly

## UI/UX Details

### Dropdown Design
- Clean white background
- Smooth animations
- Color preview circles
- Theme names with icons
- Check mark for current theme
- Hover effects
- Click outside to close

### Responsive
- Works on mobile
- Works on tablet
- Works on desktop
- "Theme" text hidden on small screens (icon only)

### Accessibility
- Keyboard accessible
- Screen reader friendly
- High contrast options
- Clear visual feedback

## Summary

✅ **6 themes** available
✅ **Profile page** has theme switcher
✅ **Instant** theme change
✅ **Persistent** across sessions
✅ **Global** application
✅ **Beautiful** UI
✅ **Easy** to use

---

**Location:** Profile page → Header → "Theme" button
**Themes:** Rose, Purple, Blue, Green, Orange, Pink
**Storage:** localStorage
**Scope:** Entire application

**Enjoy your personalized theme! 🎨✨**
