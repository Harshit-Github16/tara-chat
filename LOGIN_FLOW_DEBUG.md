# 🔍 Login Flow Debug Guide

## ✅ **LOGIN REDIRECT ISSUE FIXES**

### **🐛 Problem:**
Login successful hone ke baad onboarding/welcome page pe redirect nahi ho raha.

### **🛠️ Fixes Applied:**

#### **1. Login Page Enhanced (`app/login/page.js`):**

**Added Features:**
- ✅ **AuthContext Integration** - useAuth hook added
- ✅ **Auto-redirect Check** - If already authenticated, redirect immediately
- ✅ **Manual Auth Refresh** - checkAuth() call after login
- ✅ **Loading States** - Show loading while checking auth
- ✅ **Delayed Redirect** - 500ms delay to ensure state update

**New Flow:**
```javascript
// 1. Check if already authenticated
useEffect(() => {
    if (!authLoading && user) {
        if (user.isOnboardingComplete) {
            router.replace('/welcome');
        } else {
            router.replace('/onboarding');
        }
    }
}, [user, authLoading, router]);

// 2. After Google login
const { user, isNewUser } = await signInWithGoogle();
await checkAuth(); // Refresh AuthContext
setTimeout(() => {
    // Redirect based on user status
}, 500);
```

### **🎯 Debug Process:**

#### **Step 1: Check Console Logs**
Login करने पर ये logs दिखने चाहिए:
```
"Starting Google login..."
"Firebase login response: {token: '...', user: {...}, isNewUser: true/false}"
"Token stored in localStorage: ..."
"Login successful, user: {...}, isNewUser: true/false"
"Refreshing AuthContext..."
"AuthContext checkAuth - token exists: true"
"User data fetched: {...}"
"Redirecting to onboarding/welcome"
```

#### **Step 2: Use Debug Page**
Visit: `http://localhost:3001/debug`

**Before Login:**
- User: Not authenticated
- Token: Missing
- Loading: false

**After Login:**
- User: Authenticated
- Token: Present
- isOnboardingComplete: true/false
- Loading: false

#### **Step 3: Manual Testing**

**Test 1: New User Flow**
```
1. Clear localStorage: localStorage.clear()
2. Visit: /login
3. Click "Continue with Google"
4. Should redirect to: /onboarding
```

**Test 2: Existing User Flow**
```
1. Complete onboarding first
2. Logout and login again
3. Should redirect to: /welcome
```

**Test 3: Token Persistence**
```javascript
// After login, check token
localStorage.getItem('authToken'); // Should exist

// Test API call
fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
// Should return user data
```

### **🚨 Troubleshooting:**

#### **Issue 1: No Redirect After Login**

**Symptoms:**
- Login successful but stays on login page
- Console shows "Login successful" but no redirect

**Solutions:**
1. **Check Console Logs** - Look for error messages
2. **Check Token** - Verify localStorage has authToken
3. **Manual Redirect** - Try visiting /debug to check auth state
4. **Clear Cache** - Clear browser cache and cookies

#### **Issue 2: Wrong Redirect Destination**

**Symptoms:**
- New user goes to welcome instead of onboarding
- Existing user goes to onboarding instead of welcome

**Solutions:**
1. **Check isNewUser** - Verify Firebase API returns correct flag
2. **Check isOnboardingComplete** - Verify user data in database
3. **Manual API Test** - Test /api/auth/me endpoint

#### **Issue 3: Infinite Loading**

**Symptoms:**
- Login page shows loading spinner forever
- No redirect happens

**Solutions:**
1. **Check AuthContext** - Verify checkAuth() completes
2. **Check API** - Verify /api/auth/me returns 200
3. **Check Token** - Verify token is valid

### **🔧 Manual Fixes:**

#### **Force Redirect (Emergency):**
```javascript
// In browser console after login
if (localStorage.getItem('authToken')) {
    window.location.href = '/onboarding'; // or /welcome
}
```

#### **Clear All Data:**
```javascript
// Reset everything
localStorage.clear();
sessionStorage.clear();
// Then refresh page
window.location.reload();
```

#### **Test API Manually:**
```javascript
// Test login API
const token = localStorage.getItem('authToken');
fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include'
}).then(r => r.json()).then(data => {
    console.log('User data:', data);
    if (data.user) {
        window.location.href = data.user.isOnboardingComplete ? '/welcome' : '/onboarding';
    }
});
```

### **🎯 Expected Behavior:**

#### **New User:**
```
Login → Firebase Auth → Token Stored → AuthContext Loaded → 
isNewUser: true → Redirect to /onboarding
```

#### **Existing User (Incomplete):**
```
Login → Firebase Auth → Token Stored → AuthContext Loaded → 
isOnboardingComplete: false → Redirect to /onboarding
```

#### **Existing User (Complete):**
```
Login → Firebase Auth → Token Stored → AuthContext Loaded → 
isOnboardingComplete: true → Redirect to /welcome
```

### **🚀 Success Indicators:**

- ✅ **Console Logs** show complete flow
- ✅ **Token Stored** in localStorage
- ✅ **AuthContext Loaded** with user data
- ✅ **Automatic Redirect** to correct page
- ✅ **No Manual Refresh** needed
- ✅ **Debug Page** shows correct auth state

**Test karo aur console logs check karo! 🎯**