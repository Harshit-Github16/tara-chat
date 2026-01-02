import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';

export async function POST(request) {
    try {
        console.log('=== TEST CHAT API CALLED ===');

        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            console.log('No valid token found');
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        console.log('Token verified for user:', decoded.userId);

        const body = await request.json();
        console.log('Request body:', body);

        return NextResponse.json({
            success: true,
            message: 'Chat API authentication working',
            userId: decoded.userId,
            receivedData: body
        });

    } catch (error) {
        console.error('Test chat error:', error);
        return NextResponse.json({
            error: 'Test failed: ' + error.message
        }, { status: 500 });
    }
}