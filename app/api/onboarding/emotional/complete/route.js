import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/jwt';
import { User } from '../../../../../lib/models/User';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
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
        const body = await request.json();
        const {
            currentMood,
            personalityAnswers,
            lifeAreas,
            supportPreference,
            archetype
        } = body;

        const client = await clientPromise;
        const db = client.db('tara');

        // Save detailed onboarding data to separate collection
        const onboardingData = {
            userId: new ObjectId(userId),
            currentMood,
            personalityAnswers,
            lifeAreas,
            supportPreference,
            archetype,
            completedAt: new Date(),
            createdAt: new Date()
        };

        await db.collection('emotional_onboarding').insertOne(onboardingData);

        // Update user profile with onboarding completion
        await User.updateById(userId, {
            isOnboardingComplete: true,
            archetype,
            lifeAreas,
            supportPreference,
            currentMood,
            personalityAnswers,
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully',
            archetype
        });

    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            { error: 'Failed to complete onboarding' },
            { status: 500 }
        );
    }
}
