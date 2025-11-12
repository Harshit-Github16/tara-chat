# Protected Routes Configuration

## Overview
The application uses Next.js middleware to protect routes and ensure users are authenticated before accessing protected pages.

## Public Routes (No Authentication Required)

### Pages
- `/` - Landing page
- `/login` - Login page
- `/privacy-policy` - Privacy policy page

### API Routes
- `/api/auth/login` - Login endpoint
- `/api/auth/register` - Registration endpoint
- `/api/auth/google` - Google OAuth endpoint
- `/api/auth/firebase-login` - Firebase login endpoint

### Assets
- `/taralogo.jpg` - Logo
- `/celebrities/*` - Celebrity images
- `/_next/*` - Next.js assets
- `/favicon.ico` - Favicon
- `/static/*` - Static files

## Protected Routes (Authentication Required)

All other routes require authentication:
- `/welcome` - Welcome page
- `/onboarding` - Onboarding flow
- `/chatlist` - Chat list page
- `/journal` - Journal page
- `/insights` - Insights page
- `/blog` - Blogs page
- `/profile` - Profile page
- All other pages not listed as public

## How It Works

1. **Middleware Check**: Every request goes through `middleware.js`
2. **Token Verification**: Checks for `authToken` cookie
3. **Redirect Logic**:
   - If no token → Redirect to `/login?redirect={original_path}`
   - If token exists → Allow access
4. **Login Redirect**: After successful login, user is redirected to:
   - Original requested page (if redirect param exists)
   - `/onboarding` (if new user or onboarding incomplete)
   - `/welcome` (if returning user with complete onboarding)

## Authentication Flow

```
User tries to access /chatlist
    ↓
Middleware checks authToken
    ↓
No token found
    ↓
Redirect to /login?redirect=/chatlist
    ↓
User logs in successfully
    ↓
Redirect to /chatlist (from redirect param)
```

## Configuration

To add a new public route, edit `middleware.js`:

```javascript
const publicRoutes = [
  '/',
  '/login',
  '/privacy-policy',
  '/your-new-public-route',  // Add here
  // ...
];
```

## Security Features

- ✅ Cookie-based authentication
- ✅ Automatic redirect to login
- ✅ Preserve original destination
- ✅ Protected API routes
- ✅ Public assets allowed
- ✅ Static files optimization

## Testing

### Test Public Access
1. Open browser in incognito mode
2. Visit `http://localhost:3000/` - Should work
3. Visit `http://localhost:3000/privacy-policy` - Should work
4. Visit `http://localhost:3000/chatlist` - Should redirect to login

### Test Protected Access
1. Login to the application
2. Visit `http://localhost:3000/chatlist` - Should work
3. Logout
4. Try to access `/chatlist` again - Should redirect to login
