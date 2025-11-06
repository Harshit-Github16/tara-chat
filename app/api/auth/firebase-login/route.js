import { NextResponse } from 'next/server';
import { User } from '../../../../lib/models/User';
import { signToken } from '../../../../lib/jwt';

// Note: For production, you should verify the Firebase ID token server-side
// For now, we'll trust the client-side verification

export async function POST(request) {
    try {
        const body = await request.json();
        const { idToken, user: firebaseUser } = body;

        // For now, we trust the client-side Firebase authentication
        // In production, you should verify the ID token server-side
        const verifiedUser = firebaseUser;

        if (!verifiedUser.email || !verifiedUser.uid) {
            return NextResponse.json(
                { error: 'Invalid user data' },
                { status: 400 }
            );
        }

        // Create or update user in MongoDB
        const { user: mongoUser, isNewUser } = await User.createOrUpdateFirebaseUser({
            uid: verifiedUser.uid,
            email: verifiedUser.email,
            name: verifiedUser.displayName,
            avatar: verifiedUser.photoURL,
        });

        // Create JWT token for our app
        const jwtToken = signToken({
            userId: mongoUser._id.toString(),
            firebaseUid: mongoUser.firebaseUid,
            email: mongoUser.email,
            name: mongoUser.name
        });

        // Create response
        const response = NextResponse.json({
            success: true,
            token: jwtToken, // Include token in response
            user: {
                id: mongoUser._id.toString(),
                firebaseUid: mongoUser.firebaseUid,
                email: mongoUser.email,
                name: mongoUser.name,
                avatar: mongoUser.avatar,
                isOnboardingComplete: mongoUser.isOnboardingComplete
            },
            isNewUser
        });

        // Set JWT token in HTTP-only cookie
        response.cookies.set('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Firebase login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}