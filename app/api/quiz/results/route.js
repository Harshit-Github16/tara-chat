import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/jwt';
import { User } from '../../../../lib/models/User';

// GET - Retrieve quiz results
export async function GET(request) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        console.log('Decoded token:', decoded);

        // Try to find user by different fields
        let user = null;

        // First try userId (used by onboarding API)
        if (decoded.userId) {
            user = await User.findById(decoded.userId);
        }

        // Then try uid
        if (!user && decoded.uid) {
            user = await User.findByUid(decoded.uid);
        }

        // If not found by uid, try by email
        if (!user && decoded.email) {
            user = await User.findByEmail(decoded.email);
        }

        // If not found by email, try by firebaseUid
        if (!user && decoded.firebaseUid) {
            user = await User.findByFirebaseUid(decoded.firebaseUid);
        }

        console.log('User found:', user ? 'Yes' : 'No');
        console.log('Life areas:', user?.lifeAreas);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            quizResults: user.quizResults || {},
            lifeAreas: user.lifeAreas || []
        });

    } catch (error) {
        console.error('Error fetching quiz results:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz results', details: error.message },
            { status: 500 }
        );
    }
}

// POST - Save quiz results
export async function POST(request) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { lifeArea, answers, score } = await request.json();

        if (!lifeArea || !answers || score === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Try to find user by different fields
        let user = null;

        if (decoded.userId) {
            user = await User.findById(decoded.userId);
        }

        if (!user && decoded.uid) {
            user = await User.findByUid(decoded.uid);
        }

        if (!user && decoded.email) {
            user = await User.findByEmail(decoded.email);
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Initialize quizResults if not exists
        const quizResults = user.quizResults || {};

        // Save quiz result for this life area
        quizResults[lifeArea] = {
            score,
            answers,
            completedAt: new Date(),
            updatedAt: new Date()
        };

        // Update user in database
        await User.updateById(user._id, { quizResults });

        return NextResponse.json({
            message: 'Quiz results saved successfully',
            quizResults
        });

    } catch (error) {
        console.error('Error saving quiz results:', error);
        return NextResponse.json(
            { error: 'Failed to save quiz results' },
            { status: 500 }
        );
    }
}
