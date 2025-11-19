# 🚀 Quick Start - Theme System

## 5 Minutes Setup Guide

### Step 1: User ko Theme Change karna hai? 
```
1. Profile page ya Insights page pe jao
2. Top-right corner me "Theme" button dikhega
3. Click karo aur apna favorite color select karo
4. Done! 🎉
```

### Step 2: Developer - Naye Page me Theme Add karna hai?

#### Import karo:
```jsx
import ThemeSelector from '../components/ThemeSelector';
```

#### Header me add karo:
```jsx
<header className="sticky top-0 z-10">
  <div className="flex items-center justify-between">
    <div>Logo</div>
    <div className="flex items-center gap-3">
      <ThemeSelector />  {/* 👈 Bas yeh add karo */}
    </div>
  </div>
</header>
```

### Step 3: Colors Use karna hai?

#### ❌ Old Way (Don't use):
```jsx
<div className="bg-rose-100 text-rose-600 border-rose-200">
```

#### ✅ New Way (Use this):
```jsx
<div className="bg-primary-100 text-primary-600 border-primary-200">
```

### Step 4: Custom Component Banana hai?

```jsx
import { ThemedButton, ThemedCard } from '../components/ThemedComponents';

function MyComponent() {
  return (
    <ThemedCard>
      <h2>My Card</h2>
      <ThemedButton variant="primary">
        Click Me
      </ThemedButton>
    </ThemedCard>
  );
}
```

## Common Use Cases

### 1. Button with Theme
```jsx
<button 
  className="bg-primary-100 text-primary-600 hover:bg-primary-200 rounded-full px-4 py-2"
>
  Click Me
</button>
```

### 2. Card with Theme
```jsx
<div className="bg-white border border-primary-100 rounded-2xl p-6">
  <h3 className="text-primary-600">Title</h3>
  <p className="text-gray-600">Content</p>
</div>
```

### 3. Input with Theme
```jsx
<input 
  className="border border-primary-200 focus:border-primary-500 rounded-lg px-3 py-2"
  placeholder="Enter text"
/>
```

### 4. Gradient Background
```jsx
<div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 min-h-screen">
  Content
</div>
```

### 5. Loading Spinner
```jsx
<div className="border-4 border-primary-200 border-t-primary-500 rounded-full w-12 h-12 animate-spin" />
```

## Color Reference

| Class | What it does |
|-------|--------------|
| `bg-primary-50` | Very light background |
| `bg-primary-100` | Light background |
| `bg-primary-500` | Main color |
| `text-primary-600` | Dark text |
| `border-primary-200` | Light border |
| `hover:bg-primary-200` | Hover state |

## Testing

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000/profile

# Click "Theme" button
# Try different colors
# Navigate to other pages
# Theme should persist!
```

## Troubleshooting

### Theme not changing?
```bash
# Clear cache
localStorage.clear()
# Hard refresh
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

### Colors not showing?
- Check if you're using `primary-*` not `rose-*`
- Make sure ThemeProvider is in layout.js
- Verify CSS variables in globals.css

## Need Help?

1. Check `THEME_SYSTEM.md` for detailed docs
2. Check `THEME_IMPLEMENTATION_SUMMARY.md` for complete overview
3. Look at `app/profile/page.js` for working example

---

**That's it! Ab tumhara app fully themeable hai! 🎨✨**
