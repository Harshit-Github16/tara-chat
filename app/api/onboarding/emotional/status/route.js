import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/jwt';
import { User } from '../../../../../lib/models/User';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.userId;

        // Get user data
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            onboardingCompleted: user.isOnboardingComplete || false,
            archetype: user.archetype || null,
            lifeAreas: user.lifeAreas || [],
            supportPreference: user.supportPreference || null
        });

    } catch (error) {
        console.error('Error checking onboarding status:', error);
        return NextResponse.json(
            { error: 'Failed to check onboarding status' },
            { status: 500 }
        );
    }
}
