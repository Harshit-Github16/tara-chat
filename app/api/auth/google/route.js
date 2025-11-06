import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '../../../../lib/google-auth';

export async function GET() {
    try {
        const authUrl = getGoogleAuthUrl();
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate Google authentication' },
            { status: 500 }
        );
    }
}