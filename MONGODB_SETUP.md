# MongoDB Authentication Setup for Tara

## 🚀 Quick Setup Guide

### 1. Install Dependencies
```bash
npm install mongodb bcryptjs jsonwebtoken google-auth-library
```

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://harshit0150:harshit0150@cluster0.y5z6n.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random

# Google OAuth (set these up in Google Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy Client ID and Client Secret to `.env.local`

## 📁 File Structure

```
lib/
  mongodb.js              # MongoDB connection
  models/User.js          # User model and database operations
  jwt.js                  # JWT token utilities
  google-auth.js          # Google OAuth utilities

app/
  api/auth/
    login/route.js        # Login API endpoint
    logout/route.js       # Logout API endpoint
    register/route.js     # Registration API endpoint
    me/route.js           # Get/Update user profile
    google/
      route.js            # Google OAuth initiation
      callback/route.js   # Google OAuth callback
  
  contexts/
    AuthContext.js        # Authentication context
  
  components/
    ProtectedRoute.js     # Route protection component
    LogoutButton.js       # Logout button component
    ClientOnly.js         # Hydration fix component
    ErrorBoundary.js      # Error handling component
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password or Google login
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Google OAuth
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### Testing
- `GET /api/test` - Test MongoDB connection

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  name: "User Name",
  password: "hashed_password", // Only for email/password users
  avatar: "profile_image_url",
  provider: "google" | "credentials",
  googleId: "google_user_id", // Only for Google users
  isOnboardingComplete: false,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date
}
```

## 🔐 Authentication Flow

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirect to `/api/auth/google`
3. Google OAuth popup/redirect
4. Callback to `/api/auth/google/callback`
5. Create/update user in MongoDB
6. Set JWT cookie
7. Redirect based on onboarding status

### Session Management
- JWT tokens stored in HTTP-only cookies
- 7-day expiration
- Automatic refresh on API calls
- Secure in production (HTTPS only)

## 🛡️ Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Signed with secret key
3. **HTTP-Only Cookies**: Prevent XSS attacks
4. **CSRF Protection**: SameSite cookie attribute
5. **Input Validation**: Email format, password strength
6. **Error Handling**: No sensitive data in error messages

## 🧪 Testing the Setup

### 1. Test MongoDB Connection
```bash
curl http://localhost:3000/api/test
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔄 Usage in Components

### Using Auth Context
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes
```javascript
import ProtectedRoute from '../components/ProtectedRoute';

function Dashboard() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

## 🚨 Common Issues & Fixes

### 1. Hydration Errors
- Use `ClientOnly` component for client-side only content
- Check for `typeof window !== 'undefined'` before accessing browser APIs

### 2. MongoDB Connection Issues
- Verify MONGODB_URI in `.env.local`
- Check network access in MongoDB Atlas
- Test connection with `/api/test` endpoint

### 3. Google OAuth Issues
- Verify redirect URIs in Google Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure domain is authorized

### 4. JWT Issues
- Verify JWT_SECRET is set
- Check cookie settings (secure, sameSite)
- Clear browser cookies if testing locally

## 🎯 Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure Google OAuth for production domain
- [ ] Set up MongoDB Atlas with proper security
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Set up error monitoring
- [ ] Configure CORS properly

Your MongoDB authentication system is now ready! 🎉