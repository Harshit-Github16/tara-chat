# Debug Theme Issue

## Test in Browser Console

Open browser console (F12) and run:

```javascript
// Check current CSS variable value
console.log(getComputedStyle(document.documentElement).getPropertyValue('--rose-500'));

// Manually change to blue
document.documentElement.style.setProperty('--rose-500', '#3b82f6');

// Check if it changed
console.log(getComputedStyle(document.documentElement).getPropertyValue('--rose-500'));
```

If manual change works but theme selector doesn't, then issue is in ThemeContext.

## Check if ThemeContext is working

```javascript
// Check localStorage
console.log(localStorage.getItem('tara-theme'));

// Should show 'blue' if you selected blue
```

## Force theme change

```javascript
// Manually trigger theme change
const colors = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
};

Object.entries(colors).forEach(([shade, color]) => {
  document.documentElement.style.setProperty(`--rose-${shade}`, color);
});

// Check if colors changed
```
