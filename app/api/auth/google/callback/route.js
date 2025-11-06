import { NextResponse } from 'next/server';
import { getGoogleTokens, verifyGoogleToken } from '../../../../../lib/google-auth';
import { User } from '../../../../../lib/models/User';
import { signToken } from '../../../../../lib/jwt';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=access_denied`);
        }

        if (!code) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=no_code`);
        }

        // Exchange code for tokens
        const tokens = await getGoogleTokens(code);
        if (!tokens || !tokens.id_token) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=token_exchange_failed`);
        }

        // Verify the ID token
        const googleProfile = await verifyGoogleToken(tokens.id_token);
        if (!googleProfile) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=invalid_token`);
        }

        // Create or update user in database
        const { user, isNewUser } = await User.createOrUpdateGoogleUser(googleProfile);

        // Create JWT token
        const jwtToken = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        });

        // Create response with redirect
        const redirectUrl = isNewUser || !user.isOnboardingComplete
            ? `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/onboarding`
            : `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/welcome`;

        const response = NextResponse.redirect(redirectUrl);

        // Set JWT token in HTTP-only cookie
        response.cookies.set('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=callback_failed`);
    }
}