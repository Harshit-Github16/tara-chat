import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';

export async function GET(request) {
    try {
        console.log('=== DEBUG TOKEN API CALLED ===');

        // Check if Authorization header exists
        const authHeader = request.headers.get('authorization');
        console.log('Authorization header:', authHeader);

        if (!authHeader) {
            return NextResponse.json({
                error: 'No Authorization header found',
                headers: Object.fromEntries(request.headers.entries())
            }, { status: 401 });
        }

        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Token verification failed',
                authHeader: authHeader
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            message: 'Token is valid',
            userId: decoded.userId,
            tokenPreview: authHeader.substring(0, 20) + '...'
        });

    } catch (error) {
        console.error('Debug token error:', error);
        return NextResponse.json({
            error: 'Debug failed: ' + error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    return GET(request);
}