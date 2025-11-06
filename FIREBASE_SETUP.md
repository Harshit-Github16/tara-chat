# Firebase Authentication Setup for Tara

## 🔥 Firebase Configuration

Your Firebase project is already configured with the following services:
- **Authentication** (Google Sign-in)
- **Firestore Database** (User profiles and data)
- **Analytics** (User behavior tracking)

## 📁 File Structure

```
lib/
  firebase.js                 # Firebase configuration and auth functions
app/
  contexts/
    AuthContext.js            # React context for authentication state
  components/
    ProtectedRoute.js         # Component to protect authenticated routes
    LogoutButton.js           # Reusable logout button component
  login/
    page.js                   # Login page with Google authentication
```

## 🚀 How It Works

### 1. Authentication Flow
- User clicks "Continue with Google" on login page
- Firebase handles Google OAuth popup
- User data is stored in Firestore with profile information
- AuthContext manages authentication state throughout the app

### 2. User Profile Structure (Firestore)
```javascript
{
  uid: "user-firebase-uid",
  email: "user@gmail.com",
  displayName: "User Name",
  photoURL: "https://profile-photo-url",
  createdAt: timestamp,
  lastLoginAt: timestamp,
  isOnboardingComplete: false,
  profile: {
    name: "User Name",
    email: "user@gmail.com",
    avatar: "https://profile-photo-url"
  }
}
```

### 3. Protected Routes
Pages are protected using the `ProtectedRoute` component:
```javascript
<ProtectedRoute requireOnboarding={true}>
  <YourPageContent />
</ProtectedRoute>
```

## 🔧 Key Functions

### Authentication Functions (lib/firebase.js)
- `signInWithGoogle()` - Handle Google sign-in
- `signOutUser()` - Sign out current user
- `onAuthStateChange()` - Listen to auth state changes
- `getUserProfile()` - Get user profile from Firestore
- `updateUserProfile()` - Update user profile data

### Auth Context (app/contexts/AuthContext.js)
- Provides `user`, `userProfile`, and `loading` state
- Automatically syncs with Firebase auth state
- Available throughout the app via `useAuth()` hook

## 🛡️ Security Features

1. **Firestore Security Rules** (to be configured):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

2. **Authentication State Management**:
- Automatic redirect to login if not authenticated
- Onboarding flow for new users
- Protected routes with authentication checks

## 📱 Usage Examples

### Using Auth Context
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {userProfile?.displayName}!</div>;
}
```

### Adding Logout Button
```javascript
import LogoutButton from '../components/LogoutButton';

function Header() {
  return (
    <header>
      <LogoutButton className="text-red-600 hover:text-red-800" />
    </header>
  );
}
```

## 🔄 User Flow

1. **New User**:
   - Login → Firebase Auth → Create Firestore profile → Onboarding → Welcome
   
2. **Returning User**:
   - Login → Firebase Auth → Load Firestore profile → Welcome (skip onboarding)

3. **Logout**:
   - Click logout → Firebase sign out → Redirect to login

## 🚨 Important Notes

1. **Firebase Console Setup**:
   - Enable Google Authentication in Firebase Console
   - Add your domain to authorized domains
   - Configure OAuth consent screen

2. **Environment Variables** (if needed):
   - All Firebase config is in `lib/firebase.js`
   - Consider moving sensitive keys to environment variables for production

3. **Firestore Database**:
   - Create a Firestore database in Firebase Console
   - Set up security rules to protect user data

## 🎯 Next Steps

1. Configure Firestore security rules
2. Set up Firebase hosting (optional)
3. Add email verification (optional)
4. Implement password reset (if adding email/password auth)
5. Add user profile editing functionality

Your Firebase authentication is now fully integrated and ready to use! 🎉