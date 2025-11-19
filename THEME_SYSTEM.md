# 🎨 Theme System Documentation

## Overview
Tara app me ab ek complete theme system hai jo users ko apni pasand ka color theme select karne deta hai. Yeh system CSS variables aur React Context use karta hai.

## Available Themes
1. **Rose** (Default) - Pink/Rose colors
2. **Purple** - Purple shades
3. **Blue** - Blue tones
4. **Green** - Green colors
5. **Orange** - Orange hues

## How It Works

### 1. CSS Variables (globals.css)
```css
:root {
  --primary: #f43f5e;
  --primary-light: #fff1f2;
  --primary-dark: #e11d48;
  --accent: #fda4af;
  --border: #ffe4e6;
}
```

### 2. Theme Context (app/context/ThemeContext.js)
- Manages current theme state
- Provides `changeTheme()` function
- Stores theme preference in localStorage

### 3. Tailwind Config (tailwind.config.js)
CSS variables ko Tailwind classes me map karta hai:
- `bg-primary-50` → `var(--primary-light)`
- `text-primary-500` → `var(--primary)`
- `border-primary-100` → `var(--border)`

## Usage

### Using Tailwind Classes
```jsx
// Old way (hardcoded)
<div className="bg-rose-100 text-rose-600 border-rose-200">

// New way (theme-aware)
<div className="bg-primary-100 text-primary-600 border-primary-200">
```

### Using Themed Components
```jsx
import { ThemedButton, ThemedCard } from '../components/ThemedComponents';

<ThemedButton variant="primary">Click Me</ThemedButton>
<ThemedCard>Content here</ThemedCard>
```

### Adding Theme Selector
```jsx
import ThemeSelector from '../components/ThemeSelector';

<ThemeSelector />
```

### Accessing Theme in Code
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { currentTheme, changeTheme, themes } = useTheme();
  
  return (
    <button onClick={() => changeTheme('purple')}>
      Switch to Purple
    </button>
  );
}
```

## Color Mapping Reference

| Old Class | New Class |
|-----------|-----------|
| `bg-rose-50` | `bg-primary-50` |
| `bg-rose-100` | `bg-primary-100` |
| `bg-rose-500` | `bg-primary-500` |
| `text-rose-600` | `text-primary-600` |
| `border-rose-200` | `border-primary-200` |
| `from-rose-50` | `from-primary-50` |
| `hover:bg-rose-100` | `hover:bg-primary-100` |

## Excluded Pages
Theme system **NOT applied** on:
- `/` (Homepage)
- `/login` (Login page)

Baaki saare pages theme system use karte hain.

## Adding New Theme

1. Open `app/context/ThemeContext.js`
2. Add new theme in `themes` object:

```javascript
export const themes = {
  // ... existing themes
  teal: {
    name: 'Teal',
    primary: '#14b8a6',
    primaryLight: '#f0fdfa',
    primaryDark: '#0f766e',
    accent: '#5eead4',
    border: '#ccfbf1',
  },
};
```

3. Theme automatically available in ThemeSelector!

## Testing
```bash
# Run the app
npm run dev

# Go to /profile page
# Click on "Theme" button in header
# Select different colors
# Navigate to other pages - theme persists!
```

## Files Modified
- ✅ `app/globals.css` - CSS variables
- ✅ `tailwind.config.js` - Tailwind config
- ✅ `app/context/ThemeContext.js` - Theme context
- ✅ `app/components/ThemeSelector.js` - Theme picker UI
- ✅ `app/components/ThemedComponents.js` - Reusable components
- ✅ `app/layout.js` - Added ThemeProvider
- ✅ All pages (except `/` and `/login`) - Updated colors

## Troubleshooting

### Theme not changing?
- Check if ThemeProvider is in layout.js
- Clear localStorage: `localStorage.removeItem('tara-theme')`
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Colors not showing?
- Make sure you're using `primary-*` classes, not `rose-*`
- Check if CSS variables are defined in globals.css
- Verify Tailwind config has color mappings

## Future Enhancements
- [ ] Dark mode support
- [ ] Custom color picker
- [ ] Theme preview before applying
- [ ] More preset themes
- [ ] Per-page theme override
