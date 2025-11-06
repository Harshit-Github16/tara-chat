import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
);

export async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            verified: payload.email_verified
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}

export function getGoogleAuthUrl() {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    return client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'select_account'
    });
}

export async function getGoogleTokens(code) {
    try {
        const { tokens } = await client.getToken(code);
        return tokens;
    } catch (error) {
        console.error('Error getting Google tokens:', error);
        return null;
    }
}