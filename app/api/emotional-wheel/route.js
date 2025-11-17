import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../lib/jwt';
import { User } from '../../../lib/models/User';

export async function POST(request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { emotionalWheelData } = body;

        // Save emotional wheel data
        await User.updateById(decoded.userId, {
            emotionalWheelData: emotionalWheelData,
            lastEmotionalWheelUpdate: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Emotional wheel data saved successfully'
        });

    } catch (error) {
        console.error('Save emotional wheel error:', error);
        return NextResponse.json(
            { error: 'Failed to save emotional wheel data' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            lifeAreas: user.lifeAreas || [],
            emotionalWheelData: user.emotionalWheelData || null,
            lastEmotionalWheelUpdate: user.lastEmotionalWheelUpdate || null
        });

    } catch (error) {
        console.error('Get emotional wheel error:', error);
        return NextResponse.json(
            { error: 'Failed to get emotional wheel data' },
            { status: 500 }
        );
    }
}
