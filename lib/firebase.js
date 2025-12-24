// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvWkg3qWZcn7EEuJIjCtgUOHszsXE-SQw",
    authDomain: "tara-chatbot.firebaseapp.com",
    projectId: "tara-chatbot",
    storageBucket: "tara-chatbot.firebasestorage.app",
    messagingSenderId: "737678790635",
    appId: "1:737678790635:web:dd31cf96188aa1beb253ae",
    measurementId: "G-1LH6JH9J0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
export { analytics };

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Authentication functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Get Firebase ID token
        const idToken = await firebaseUser.getIdToken();

        // Send to our API to create/update user in MongoDB
        const response = await fetch('/api/auth/firebase-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
                user: {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to sync user with database');
        }

        const userData = await response.json();
        console.log('Firebase login response:', userData?.user.userPassword);

        // Store JWT token in localStorage
        if (userData.token) {
            localStorage.setItem('authToken', userData.token);
            localStorage.setItem('isPasswordExist', userData?.user?.userPassword ? true : false);
            console.log('Token stored in localStorage:', userData.token.substring(0, 20) + '...');
        } else {
            console.error('No token received from server!');
        }

        return { user: userData.user, isNewUser: userData.isNewUser };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (uid, profileData) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};