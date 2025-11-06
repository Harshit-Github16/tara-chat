# 🔍 Token Debug Setup Complete

## ✅ **DEBUG LOGS ADDED**

### **🎯 Problem:**
Login ke baad onboarding API me 401 error aa raha hai - token nahi mil raha.

### **🛠️ Debug Setup:**

#### **1. Login Page (`app/login/page.js`):**
```javascript
// Added logs to check:
console.log('Starting Google login...');
console.log('Login successful, user:', user);
console.log('Token stored in localStorage:', token ? 'Yes' : 'No');
```

#### **2. Firebase Function (`lib/firebase.js`):**
```javascript
// Added logs to check:
console.log('Firebase login response:', userData);
console.log('Token stored in localStorage:', userData.token.substring(0, 20) + '...');
console.error('No token received from server!');
```

#### **3. Onboarding Page (`app/onboarding/page.js`):**
```javascript
// Added logs to check:
console.log('Token before onboarding API call:', token ? 'Present' : 'Missing');
console.log('Onboarding data:', formData);
```

#### **4. API Utility (`lib/api.js`):**
```javascript
// Added logs to check:
console.log('API Request to:', url, 'Token:', token ? 'Present' : 'Missing');
console.log('Authorization header added');
console.warn('No token found for API request');
```

#### **5. Onboarding API (`app/api/onboarding/route.js`):**
```javascript
// Added logs to check:
console.log('Onboarding API called');
console.log('Headers:', Object.fromEntries(request.headers.entries()));
console.log('Cookies:', request.cookies.getAll());
console.log('Token extracted:', token ? 'Present' : 'Missing');
```

#### **6. JWT Utility (`lib/jwt.js`):**
```javascript
// Added logs to check:
console.log('Getting token from request...');
console.log('Authorization header:', authHeader);
console.log('Cookie token:', token ? 'Present' : 'Missing');
console.log('Token found in Authorization header/cookies');
console.log('No token found in request');
```

### **🔍 How to Debug:**

#### **Step 1: Login Process**
1. Open browser console
2. Go to `http://localhost:3001/login`
3. Click "Continue with Google"
4. Check console logs:
   - ✅ "Starting Google login..."
   - ✅ "Firebase login response: {token: '...', user: {...}}"
   - ✅ "Token stored in localStorage: ..."
   - ✅ "Login successful, user: ..."
   - ✅ "Token stored in localStorage: Yes"

#### **Step 2: Onboarding Process**
1. Fill onboarding form
2. Click "Complete Setup"
3. Check console logs:
   - ✅ "Token before onboarding API call: Present"
   - ✅ "API Request to: /api/onboarding Token: Present"
   - ✅ "Authorization header added"

#### **Step 3: Server-side Debug**
Check server console for:
- ✅ "Onboarding API called"
- ✅ "Headers: {authorization: 'Bearer ...', ...}"
- ✅ "Token extracted: Present"

### **🎯 Expected Flow:**

```
Login → Firebase Auth → JWT Token Created → localStorage Storage → Onboarding API → Authorization Header → Server Validation → Success
```

### **🚨 Possible Issues:**

#### **Issue 1: Token Not Created**
- Check: "Firebase login response" log
- Fix: Ensure Firebase API returns token

#### **Issue 2: Token Not Stored**
- Check: "Token stored in localStorage" log
- Fix: Ensure localStorage.setItem works

#### **Issue 3: Token Not Sent**
- Check: "Authorization header added" log
- Fix: Ensure API utility adds header

#### **Issue 4: Token Not Received**
- Check: Server "Headers" log
- Fix: Ensure Authorization header present

#### **Issue 5: Token Not Extracted**
- Check: "Token extracted" log
- Fix: Ensure JWT utility reads header/cookie

### **🔧 Manual Tests:**

#### **Test 1: Check localStorage**
```javascript
// In browser console after login
localStorage.getItem('authToken')
// Should return JWT token
```

#### **Test 2: Check API Headers**
```javascript
// In Network tab, check onboarding request
// Should see: Authorization: Bearer eyJ...
```

#### **Test 3: Test Token Manually**
```bash
# Copy token from localStorage and test
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/onboarding
```

### **🎉 Next Steps:**

1. **Login** with Google
2. **Check console logs** step by step
3. **Identify** where token flow breaks
4. **Fix** the specific issue
5. **Test** onboarding API

**Ab detailed debugging ke saath exact issue pata chal jayega! 🔍**